import moment from 'moment';
import { logger } from '../logger';
import { getWearableInventory } from '../ice/ice';
import { redis } from '../redis';
import schedule from 'node-schedule';
import sleep from 'sleep-promise';
import { getIceChipsRecords } from '../leaderboard';
import Analytics from 'analytics-node';

const analytics = new Analytics('OrHyO2XSTZJ6f0KXcojtAB4kyScvZn8B');

const dbMongo = require('../../db/dbMongo');

export class MobileHelper {
  REWARDS_CONFIG: any;
  percentileMapping: any = this.getPercentileMapping([]);
  chipsRecords: any = [];

  constructor() {
    this.initializeChallengeConstants();
    this.refreshPercentileMapping();
  }

  // every 5 minutes, check for changes to ICE challenge constants
  // these include rewards for each category, difficulty, etc.
  async initializeChallengeConstants() {
    schedule.scheduleJob('*/5 * * * *', async () => {
      this.REWARDS_CONFIG = await dbMongo.findIceChallengeConstants();
    });
    this.REWARDS_CONFIG = await dbMongo.findIceChallengeConstants();
  }

  async refreshPercentileMapping() {
    this.chipsRecords = await getIceChipsRecords('today', true);
    this.percentileMapping = this.getPercentileMapping(
      this.chipsRecords.map((player) => Math.round(player.score))
    );
  }

  getRewardsConfig = async () => {
    while (!this.REWARDS_CONFIG) {
      // delay just in case this function is called before server initializes REWARDS_CONFIG
      logger.log('Waiting for REWARDS_CONFIG to be initialized...');
      await sleep(1000);
    }
    return this.REWARDS_CONFIG;
  };

  // determines the start time for current ICE challenge period
  getPeriodStartTimestamp(day) {
    const periodStart = moment().utc().startOf('day');
    if (day === 'today') {
      return periodStart.valueOf();
    } else if (day === 'yesterday') {
      return periodStart.subtract(1, 'day').valueOf();
    } else if (day === 'future') {
      return periodStart.add(2, 'days').valueOf();
    }
  }

  // returns Redis key name for user balance
  getUserBalanceKeyName(address, day) {
    return `mobileChipsBalance:${address}:${this.getPeriodStartTimestamp(day)}`;
  }

  // returns Redis key name for daily leaderboard sorted set
  getUserScoreKeyName(day) {
    return `leaderboard:daily:poker:mobileChips:${this.getPeriodStartTimestamp(
      day
    )}`;
  }

  // returns key name used to store challenge progress data for given user in Redis
  getChallengeProgressKeyName(address, day) {
    return `mobileIceChallengeProgress:${address}:${this.getPeriodStartTimestamp(
      day
    )}`;
  }

  getWearableDataKeyName(address, day) {
    return `mobileIceWearableSnapshot:${address}:${this.getPeriodStartTimestamp(
      day
    )}`;
  }

  getIceEarningsDataKeyName(address, day) {
    return `mobileIceEarningsData:${address}:${this.getPeriodStartTimestamp(
      day
    )}`;
  }

  getCheckedInUsersKeyName(day) {
    return `mobileIceCheckedInUsers:${this.getPeriodStartTimestamp(day)}`;
  }

  /**
   * Sets user balance and score atomically in Redis.
   *
   * For example, if a user's current @balance is 100 and newBalance is 150,
   * then their balance will be set to 150 and their score will be increased by 50.
   *
   * @param {string} address - Player address
   * @param {number} newBalance - New balance that should be set
   * @returns {number} New score after the balance is set
   */
  async setChipsBalance(address: string, newBalance: number): Promise<number> {
    address = address.toLowerCase();
    const balanceKeyName = this.getUserBalanceKeyName(address, 'today');
    const scoreKeyName = this.getUserScoreKeyName('today');
    const futureTimestamp = this.getPeriodStartTimestamp('future');

    const newScore = await redis.eval(
      `local currentBalance = redis.call('get', '${balanceKeyName}');
      if currentBalance == false then currentBalance = ${newBalance} end;
      local difference = ${newBalance} - tonumber(currentBalance);
      local newScore = redis.call('zincrby', '${scoreKeyName}', difference, '${address}');
      redis.call('set', '${balanceKeyName}', ${newBalance});
      return tonumber(newScore);`,
      0
    );

    // set key expiration
    redis.expireat(balanceKeyName, futureTimestamp);
    redis.expireat(scoreKeyName, futureTimestamp);

    return newScore;
  }

  /**
   * Gets user balance and score atomically in Redis.
   *
   * @param {string} address - Player address
   * @returns {number, number} Player's balance and score
   */
  async getChipsBalanceAndScore(address: string) {
    address = address.toLowerCase();
    const balanceKeyName = this.getUserBalanceKeyName(address, 'today');
    const scoreKeyName = this.getUserScoreKeyName('today');

    const result = await redis
      .multi()
      .get(balanceKeyName)
      .zscore(scoreKeyName, address)
      .exec();
    return {
      balance: Number(result[0][1]),
      score: Number(result[1][1]),
    };
  }

  async getFormattedWearableInventory(address) {
    const checkInData = {
      wearableData: await getWearableInventory(address),
      validNftCount: 0, // the number of ICE wearables that count toward their daily check-in Chips
      dailyIceChipsAmount: 0, // the amount that the player receives at check-in
      delegatorAddress: undefined, // address of player's wearable delegator, if one exists and player does not have their own wearables
    };

    // filter out unneeded data
    for (let tokenData of checkInData.wearableData) {
      [
        'image',
        'imageUpgrade',
        'name',
        'itemId',
        'description',
        'checkInStatus',
        'mobileCheckInStatus',
      ].forEach((e) => delete tokenData[e]);
      [
        'delegatedToNickname',
        'isQueuedForUndelegationByOwner',
        'isQueuedForUndelegationByDelegatee',
        'createdAt',
      ].forEach((e) => delete tokenData.delegationStatus[e]);
    }

    for (let tokenData of checkInData.wearableData) {
      // if wearable is equipped, set isEquipped to true in token data and pop from equippedWearableURNs
      // this ensures that each detected URN is only ever attached to at most one tokenId
      // sorted above to ensure that equipped wearables of the same type prioritize higher bonuses
      // (bonuses are invisible in DCL backpack)
      if (tokenData.isEquipped) {
        // wearable is both equipped and activated, thus it contributes to the player's valid NFT count
        if (
          tokenData.isActivated &&
          (tokenData.delegationStatus.delegatedTo === null ||
            tokenData.delegationStatus.delegatedTo === address) &&
          !tokenData.metaverseCheckInStatus
        ) {
          checkInData.validNftCount = Math.min(
            checkInData.validNftCount + 1,
            5
          );
          if (checkInData.validNftCount === 1) {
            // first active wearable gets +3000 Chips bonus
            tokenData.chips = 3000;
          } else {
            tokenData.chips = 500;
          }
          if (tokenData.delegationStatus.delegatedTo === address) {
            checkInData.delegatorAddress = tokenData.tokenOwner;
          }
        } else {
          tokenData.chips = 500;
        }
      }
    }

    for (let tokenData of checkInData.wearableData) {
      if (!tokenData.isEquipped) {
        if (
          checkInData.wearableData.find(
            (el) =>
              el.isEquipped &&
              el.category === tokenData.category &&
              el.tokenId !== tokenData.tokenId &&
              !el.metaverseCheckInStatus
          )
        ) {
          // if wearable would fill same slot as an equipped wearable, show +0 bonus
          // for example, Blazer Level 2 replacing Blazer Level 1
          tokenData.chips = 0;
        } else {
          tokenData.chips = 500;
        }
      }
    }

    checkInData.dailyIceChipsAmount =
      checkInData.validNftCount > 0
        ? 3000 + (checkInData.validNftCount - 1) * 500
        : 0;

    return checkInData;
  }

  async takeWearableSnapshot(address) {
    logger.log(`Taking wearable snapshot for ${address}`);
    const checkInData = await this.getFormattedWearableInventory(address);

    // only allow wearables that are equipped, activated, and is either delegated to this player or owned
    checkInData.wearableData = checkInData.wearableData.filter(
      (el) =>
        el.isEquipped &&
        el.isActivated &&
        (!el.delegationStatus.delegatedTo ||
          (el.delegationStatus.delegatedTo &&
            el.delegationStatus.delegatedTo === address)) &&
        !el.metaverseCheckInStatus
    );

    await redis.set(
      this.getWearableDataKeyName(address, 'today'),
      JSON.stringify(checkInData)
    );

    // store multiplier values + delegator info to be used during ICE drop calculations
    const iceEarningsData = {
      validNftCount: checkInData.validNftCount,
      highestWearableRank: this.getHighestWearableRank(checkInData),
      nftCountMultiplier: await this.getNftCountMultiplier(checkInData),
      nftBonusMultiplier: this.getNftBonusMultiplier(checkInData),
      delegatorAddress: checkInData.delegatorAddress,
    };
    await redis.set(
      this.getIceEarningsDataKeyName(address, 'today'),
      JSON.stringify(iceEarningsData)
    );

    await this.setChipsBalance(address, checkInData.dailyIceChipsAmount);
    return checkInData;
  }

  async getCheckInData(address) {
    address = address.toLowerCase();
    const wearableSnapshotData = await redis.get(
      this.getWearableDataKeyName(address, 'today')
    );

    let checkInData;
    if (wearableSnapshotData) {
      // player has already checked in today; use snapshot
      checkInData = JSON.parse(wearableSnapshotData);
      checkInData.isCheckedIn = true;
    } else {
      // player hasn't check in yet; use their current wearable data
      checkInData = await this.getFormattedWearableInventory(address);
      checkInData.isCheckedIn = false;
      // logger.debug(
      //   'Snapshot does not exist, loaded current config',
      //   checkInData
      // );
    }
    return checkInData;
  }

  async getIceEarningsData(address: string) {
    return JSON.parse(
      await redis.get(this.getIceEarningsDataKeyName(address, 'today'))
    );
  }

  // check daily challenges for a specific user
  // if this is their first login of the day, assign them new ones
  // challenges progress should be deleted at midnight UTC after sending off to contract
  async grabChallenges(address, day) {
    if (!address) {
      logger.log('Error: Address was not provided');
      return null;
    }

    const iceEarningsDataExists = await redis.exists(
      this.getIceEarningsDataKeyName(address, 'today')
    );

    if (!iceEarningsDataExists) {
      throw new Error(`${address} has not checked-in yet today`);
    }

    const rewardsConfig = await this.getRewardsConfig();
    let challengeProgressData = await redis.hgetall(
      this.getChallengeProgressKeyName(address, day)
    );

    if (Object.keys(challengeProgressData).length === 0) {
      // user hasn't played yet today and is missing challenge progress

      // assign all players this challenge
      await redis.hset(
        this.getChallengeProgressKeyName(address, day),
        'TOTAL_WIN_COUNT',
        0
      );
      challengeProgressData['TOTAL_WIN_COUNT'] = '0';

      // assign them a random challenge from each category
      for (let category of Object.keys(
        rewardsConfig.mobileChallengeCategories
      )) {
        if (category === 'GENERAL') {
          continue;
        }

        const challengeNames = Object.keys(
          rewardsConfig.mobileChallengeCategories[category].challengeNames
        );

        const randomChallenge =
          challengeNames[Math.floor(Math.random() * challengeNames.length)];

        await redis.hset(
          this.getChallengeProgressKeyName(address, day),
          randomChallenge,
          0
        );
        challengeProgressData[randomChallenge] = '0';
      }
    }

    return challengeProgressData;
  }

  async getMappedChallengeProgress(challengeProgress) {
    // attach challenge category to challenge name
    // for example { SEE_FLOP: '0', GET_TWO_PAIR: '0', GET_THREE_OF_A_KIND: '0' }
    // will be mapped to { NOOB: { SEE_FLOP: '0' }, APE: { GET_TWO_PAIR: '0' }, CHAD: { GET_THREE_OF_A_KIND: '0' }}
    let mappedChallengeProgress = {};
    const rewardsConfig = await this.getRewardsConfig();
    for (let challengeName of Object.keys(challengeProgress)) {
      for (let category of Object.keys(
        rewardsConfig.mobileChallengeCategories
      )) {
        if (category === 'GENERAL') {
          continue;
        }
        if (
          rewardsConfig.mobileChallengeCategories[category].challengeNames[
            challengeName
          ]
        ) {
          mappedChallengeProgress[category] = {
            challengeName: challengeName,
            progress: Number(challengeProgress[challengeName]),
          };
        }
      }
    }

    return mappedChallengeProgress;
  }

  async checkForCompletion(address, challengeName, challengeProgress) {
    // give XP rewards for completing a challenge

    const rewardsConfig = await this.getRewardsConfig();
    const iceEarningsData = JSON.parse(
      await redis.get(this.getIceEarningsDataKeyName(address, 'today'))
    );
    const mappedChallengeProgress = await this.getMappedChallengeProgress(
      challengeProgress
    );

    if (!iceEarningsData) {
      throw new Error(`${address} has not checked-in yet today`);
    }

    for (let category of Object.keys(mappedChallengeProgress)) {
      if (challengeName === mappedChallengeProgress[category].challengeName) {
        const progress = mappedChallengeProgress[category].progress;
        const goal =
          rewardsConfig.mobileChallengeCategories[category].challengeNames[
            challengeName
          ].nftDifficulty[iceEarningsData.validNftCount - 1];
        const xpReward =
          rewardsConfig.mobileChallengeCategories[category].xpReward;

        if (progress === goal) {
          // challenge completed
          let xpRewardAddress = address;
          if (iceEarningsData.delegatorAddress) {
            // if player is using delegated wearables, XP goes to delegator
            xpRewardAddress = iceEarningsData.delegatorAddress;
          }
          let userData = await dbMongo.findUser(xpRewardAddress);
          logger.log(
            `Rewarding ${xpRewardAddress} with ${xpReward} XP; Previous amount: ${userData.mobileIceXpCurrent}`
          );
          userData.mobileIceXpCurrent += xpReward;
          userData.mobileIceXpAllTime += xpReward;
          await dbMongo.updateUser(xpRewardAddress, userData);

          analytics.track({
            userId: xpRewardAddress,
            event: 'mobileEarnXp',
            properties: {
              amountEarned: xpReward,
            },
          });

          analytics.track({
            userId: address,
            event: 'mobileCompleteChallenge',
            properties: {
              challengeName: challengeName,
              challengeCategory: category,
            },
          });
        }
        break;
      }
    }
  }

  async matchAndIncrementChallenge(challengeName, address) {
    // check if player has matching challenge
    // if so, then increment their challenge counter

    const challengeProgress = await this.grabChallenges(address, 'today');
    const playerHasChallenge =
      Object.keys(challengeProgress).includes(challengeName);
    if (playerHasChallenge) {
      await redis.hincrby(
        this.getChallengeProgressKeyName(address, 'today'),
        challengeName,
        1
      );
      challengeProgress[challengeName] = String(
        Number(challengeProgress[challengeName]) + 1
      );
      logger.log(`Incrementing ${challengeName} challenge for ${address}`);

      await this.checkForCompletion(address, challengeName, challengeProgress);

      const gameplayStats = await this.getGameplayStats(address);
      return gameplayStats;
    } else {
      return false;
    }
  }

  async getNftCountMultiplier(checkInData) {
    const rewardsConfig = await this.getRewardsConfig();
    const nftCountMultiplierMap = rewardsConfig.nftCountMultiplierMap;
    const multiplier =
      nftCountMultiplierMap[
        Math.min(checkInData.validNftCount, nftCountMultiplierMap.length - 1)
      ];
    return multiplier;
  }

  getNftBonusMultiplier(checkInData) {
    const wearableData = checkInData.wearableData.filter((el) => el.isEquipped);
    let totalBonus = 0;
    for (let i = 0; i < 5; i++) {
      if (
        wearableData[i] &&
        wearableData[i].isActivated &&
        !wearableData[i].isDelegatedToSomeoneElse
      ) {
        totalBonus += Number(wearableData[i].bonus);
      }
    }
    const multiplier = +(1 + totalBonus * 0.01).toFixed(2);
    return multiplier;
  }

  getHighestWearableRank(checkInData) {
    const wearableData = checkInData.wearableData.filter((el) => el.isEquipped);
    let highestRank = 1;
    for (let i = 0; i < 5; i++) {
      if (
        wearableData[i] &&
        wearableData[i].isActivated &&
        !wearableData[i].isDelegatedToSomeoneElse
      ) {
        if (wearableData[i].rank > highestRank) {
          highestRank = wearableData[i].rank;
        }
      }
    }
    return highestRank;
  }

  // get expected base ICE earnings and XP amount
  async getExpectedBaseEarnings(
    challengeProgress: any,
    highestWearableRank: number,
    validNftCount: number,
    delegatorAddress: string | null
  ) {
    const mappedChallengeProgress = await this.getMappedChallengeProgress(
      challengeProgress
    );
    const rewardsConfig = await this.getRewardsConfig();

    const delegatorSplit =
      rewardsConfig.delegatorSplits[highestWearableRank - 1];
    const checkInReward =
      rewardsConfig.mobileChallengeCategories['GENERAL'].iceReward;
    let baseIceReward =
      challengeProgress['TOTAL_WIN_COUNT'] > 0 ? checkInReward : 0;
    let delegatorBaseIceReward = 0;
    let totalXpReward = 0;
    let numChallengesCompleted = 0;

    for (let category of Object.keys(mappedChallengeProgress)) {
      const challengeName = mappedChallengeProgress[category].challengeName;
      const progress = mappedChallengeProgress[category].progress;
      const goal =
        rewardsConfig.mobileChallengeCategories[category].challengeNames[
          challengeName
        ].nftDifficulty[validNftCount - 1];
      const iceReward =
        rewardsConfig.mobileChallengeCategories[category].iceReward;
      const xpReward =
        rewardsConfig.mobileChallengeCategories[category].xpReward;

      if (progress >= goal) {
        // challenge completed
        baseIceReward += iceReward;
        totalXpReward += xpReward;
        numChallengesCompleted++;
      }
    }

    if (delegatorAddress) {
      delegatorBaseIceReward = Math.round(baseIceReward * delegatorSplit);
      baseIceReward -= delegatorBaseIceReward;
    }

    return {
      baseIceReward,
      delegatorBaseIceReward, // if player was using delegated wearables, this is how much their delegator earns
      totalXpReward,
      numChallengesCompleted,
    };
  }

  async resetCheckIn(address) {
    address = address.toLowerCase();

    await redis
      .multi()
      .srem(this.getCheckedInUsersKeyName('today'), address)
      .del(this.getChallengeProgressKeyName(address, 'today'))
      .del(this.getUserBalanceKeyName(address, 'today'))
      .del(this.getWearableDataKeyName(address, 'today'))
      .del(this.getIceEarningsDataKeyName(address, 'today'))
      .zrem(this.getUserScoreKeyName('today'), address)
      .exec();
    logger.log(`Successfully reset today's ICE data for ${address}`);
  }

  async formatLeaderboardData(address, records, percentileMapping) {
    const myScoreData = records.find((el) => el.address === address);
    const myChipsScore = myScoreData ? Math.round(myScoreData.score) : 0;

    // calculate my percentile
    let myPercentile = 0;
    for (let i = 95; i >= 0; i -= 5) {
      const netChips = percentileMapping[i];
      if (myChipsScore >= netChips) {
        myPercentile = i;
      }
    }

    const rewardsConfig = await this.getRewardsConfig();
    let leaderboardMultiplier =
      rewardsConfig.mobileLeaderboardMultiplierMap[myPercentile / 5];

    return {
      percentileMapping,
      myChipsScore,
      myPercentile,
      leaderboardMultiplier,
    };
  }

  getPercentileMapping(allScores) {
    // maps given score to percentile
    // entrance into a percentile requires score to be >= value in mapping
    const distribution = {};
    const percentileCount = 20;
    const stepSize = 100 / percentileCount;

    allScores = allScores.sort((a, b) => a - b).reverse();
    for (let i = 0; i < 100; i += stepSize) {
      let bound =
        allScores[Math.floor((i + 5) * 0.01 * (allScores.length - 1))];
      if (allScores.length < percentileCount) {
        bound = allScores[Math.round((i + 5) * 0.01 * (allScores.length - 1))];
      }
      distribution[i] = bound ?? 0;
    }
    return distribution;
  }

  async getGameplayStats(address: string) {
    await this.refreshPercentileMapping();
    const leaderboardData = await this.formatLeaderboardData(
      address,
      this.chipsRecords,
      this.percentileMapping
    );
    const myChipsScore = leaderboardData.myChipsScore;
    const myPercentile = leaderboardData.myPercentile;
    const leaderboardMultiplier = leaderboardData.leaderboardMultiplier;

    const [iceEarningsData, challengeProgress, userData] = await Promise.all([
      this.getIceEarningsData(address),
      this.grabChallenges(address, 'today'),
      dbMongo.findUser(address),
    ]);
    const mappedChallengeProgress = await this.getMappedChallengeProgress(
      challengeProgress
    );

    // player's ICE rewards
    const nftCountMultiplier = iceEarningsData.nftCountMultiplier;
    const nftBonusMultiplier = iceEarningsData.nftBonusMultiplier;
    const expectedBaseEarnings = await this.getExpectedBaseEarnings(
      challengeProgress,
      iceEarningsData.highestWearableRank,
      iceEarningsData.validNftCount,
      iceEarningsData.delegatorAddress
    );
    const baseIceReward = expectedBaseEarnings.baseIceReward;

    const myIceEarnings = Math.round(
      baseIceReward *
        nftCountMultiplier *
        nftBonusMultiplier *
        leaderboardMultiplier
    );

    const rewardsConfig = await this.getRewardsConfig();
    const delegatorSplit = iceEarningsData.delegatorAddress
      ? rewardsConfig.delegatorSplits[iceEarningsData.highestWearableRank - 1]
      : 1;

    for (let category of Object.keys(mappedChallengeProgress)) {
      if (category === 'GENERAL') {
        continue;
      }
      mappedChallengeProgress[category].iceReward =
        rewardsConfig.mobileChallengeCategories[category].iceReward *
        delegatorSplit;
      mappedChallengeProgress[category].xpReward =
        rewardsConfig.mobileChallengeCategories[category].xpReward;
    }

    const gameplayStats = {
      myChipsScore: myChipsScore,
      percentileMapping: this.percentileMapping,
      myPercentile: myPercentile,
      nextTierValue: this.percentileMapping[myPercentile - 5]
        ? this.percentileMapping[myPercentile - 5] - myChipsScore
        : 0,
      myChallengeProgress: mappedChallengeProgress,
      firstWinChallengeProgress:
        Number(challengeProgress['TOTAL_WIN_COUNT']) > 0,
      iceXpCurrent: userData ? userData.mobileIceXpCurrent : 0,
      baseIceReward: baseIceReward,
      nftCountMultiplier: nftCountMultiplier,
      nftBonusMultiplier: nftBonusMultiplier,
      leaderboardMultiplier: leaderboardMultiplier,
      myIceEarnings: myIceEarnings,
    };
    return gameplayStats;
  }
}
