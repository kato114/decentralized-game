import { redis } from './redis';
import moment from 'moment';
import { logger } from './logger';
const dbMongo = require('../db/dbMongo');

// leaderboard data

const tokenTypes = [
  'play',
  'mana',
  'dai',
  'ice',
  'dg2',
  'eth',
  'busd',
  'chips',
];
const gameTypes = {
  100: 'all',
  0: 'slot',
  8: 'roulette',
  2: 'backgammon',
  7: 'blackjack',
  9: 'poker',
};

export const getTimespanBreakdown = async (
  checkIfCompetitionIsOngoing = false
) => {
  const now = moment().utc();
  const startOfToday = moment().utc().startOf('day');
  const startOfThisWeek = moment()
    .utc()
    .subtract(1, 'day')
    .startOf('week')
    .add(1, 'day');
  const startOfThisMonth = moment().utc().startOf('month');

  let competitionPeriod = await dbMongo.findCompetition();
  if (
    !competitionPeriod ||
    !competitionPeriod['startTime'] ||
    !competitionPeriod['endTime']
  ) {
    competitionPeriod = await dbMongo.updateCompetition({
      startTime: now,
      endTime: now,
    });
  }
  let startOfCompetition = undefined;
  let endOfCompetition = undefined;

  if (checkIfCompetitionIsOngoing) {
    // insert into competition records if competition is ongoing
    if (
      new Date().getTime() >
        new Date(competitionPeriod['startTime']).getTime() &&
      new Date().getTime() < new Date(competitionPeriod['endTime']).getTime()
    ) {
      startOfCompetition = new Date(competitionPeriod['startTime']);
      endOfCompetition = new Date(competitionPeriod['endTime']);
    }
  } else {
    startOfCompetition = competitionPeriod['startTime'];
    endOfCompetition = competitionPeriod['endTime'];
  }

  let breakdownByTimespan = {
    all: {
      start: new Date(2018, 1, 1),
      end: now.toDate(),
    },
    daily: {
      start: startOfToday.toDate(),
      end: now.toDate(),
    },
    weekly: {
      start: startOfThisWeek.toDate(),
      end: now.toDate(),
    },
    monthly: {
      start: startOfThisMonth.toDate(),
      end: now.toDate(),
    },
    competition: {
      start: startOfCompetition,
      end: endOfCompetition,
      mode:
        competitionPeriod['mode'].toLowerCase() === 'crypto'
          ? 'crypto'
          : 'play',
    },
  };
  return breakdownByTimespan;
};

export const setAvatarNameAndImage = async (userData) => {
  // grab avatarName and avatarImageID from database and insert into cache
  await redis.hmset(
    `userAddresses:${userData.address}`,
    'avatarName',
    userData.avatarName,
    'avatarImageID',
    userData.avatarImageID
      ? userData.avatarImageID
      : 'Qmev6LMYw8oNqtHf3gPRMKWGNyFqzYJ8xnjmjMWzhTchwL'
  );
};

export const getAvatarNameAndImage = async (address) => {
  // check cache for avatar name and image id
  let cachedUserData = await redis.hgetall(`userAddresses:${address}`);
  if (cachedUserData) {
    const avatarName = cachedUserData.avatarName;
    const imageURL = `https://peer-lb.decentraland.org/content/contents/${cachedUserData.avatarImageID}`;
    return { avatarName, imageURL };
  } else {
    return { avatarName: '', imageUrl: '' };
  }
};

export const insertArchivedEarningsIntoCache = async (
  spanType,
  gameType,
  tokenType,
  address,
  earnings,
  startTime
) => {
  // verify that cache has user's avatarName and avatarImageID stored
  let cachedUserData = await redis.hgetall(`userAddresses:${address}`);
  if (Object.keys(cachedUserData).length === 0) {
    const userData = await dbMongo.findUser(address);
    if (userData) {
      await setAvatarNameAndImage(userData);
    }
  }

  // insert user into leaderboard
  await redis.zadd(
    `leaderboard:${spanType}:${gameType}:${tokenType}:${startTime.getTime()}`,
    earnings,
    address
  );
};

export const insertNewEarningsIntoCache = async (
  playInfo,
  playerInfo,
  userData,
  balanceDelta = 0
) => {
  // verify that cache has user's avatarName and avatarImageID stored
  let cachedUserData = await redis.hgetall(`userAddresses:${userData.address}`);
  if (Object.keys(cachedUserData).length <= 1) {
    await setAvatarNameAndImage(userData);
  }

  const tokenType = playInfo.coinName.toLowerCase();
  const gameType = gameTypes[parseInt(playInfo.globalID.slice(9, 12))];

  let breakdownByTimespan = await getTimespanBreakdown(true);

  // insert new totalEarning for specific game in all-time leaderboard
  let startTime = breakdownByTimespan['all'].start;
  logger.log(
    `Setting score for ${
      userData.address
    } in leaderboard:all:${gameType}:${tokenType}:${startTime.getTime()} to ${
      playerInfo[`${tokenType}TotalEarning`]
    }`
  );
  await redis.zadd(
    `leaderboard:all:${gameType}:${tokenType}:${startTime.getTime()}`,
    playerInfo[`${tokenType}TotalEarning`],
    userData.address
  );

  // free play can have negative or positive affect on score
  // crypto play can only have positive affect on score

  // for daily / weekly / monthly leaderboards: if playing with crypto, use earnings in terms of token
  let scoreChange =
    tokenType === 'play' || tokenType === 'chips'
      ? balanceDelta
      : playInfo.earning;

  // increment ranking in daily / weekly / monthly leaderboard
  for (let timespan in breakdownByTimespan) {
    if (timespan == 'competition') {
      continue;
    }
    startTime = breakdownByTimespan[timespan].start;
    if (startTime) {
      // all games
      if (gameType !== 'poker') {
        logger.log(
          `Adding ${scoreChange} for ${
            userData.address
          } in leaderboard:${timespan}:all:${tokenType}:${startTime.getTime()}`
        );
        await redis.zincrby(
          `leaderboard:${timespan}:all:${tokenType}:${startTime.getTime()}`,
          scoreChange,
          userData.address
        );
      }

      if (timespan == 'all') {
        // skip next part since we already did it above using totalEarning
        continue;
      }
      // specific game
      logger.log(
        `Adding ${scoreChange} for ${
          userData.address
        } in leaderboard:${timespan}:${gameType}:${tokenType}:${startTime.getTime()}`
      );
      await redis.zincrby(
        `leaderboard:${timespan}:${gameType}:${tokenType}:${startTime.getTime()}`,
        scoreChange,
        userData.address
      );
    }
  }

  if (tokenType === 'chips') {
    // chips aren't part of event competitions so we can return
    return;
  }

  // for competitions: if playing with crypto, use earnings in terms of usd
  scoreChange = tokenType === 'play' ? balanceDelta : playInfo.usd;

  // competition, all, usd
  startTime = breakdownByTimespan['competition'].start;
  if (startTime) {
    const isUserInCompetition = await redis.sismember(
      'competitionUsers',
      userData.address
    );
    if (
      !isUserInCompetition ||
      (tokenType === 'play' && userData.competitionBalance === 0)
    ) {
      return;
    }

    // make sure that token type matches competition mode
    if (
      ((breakdownByTimespan['competition'].mode === 'play' &&
        tokenType == 'play') ||
        (breakdownByTimespan['competition'].mode === 'crypto' &&
          tokenType !== 'play')) &&
      gameType !== 'poker'
    ) {
      logger.log(
        `Adding ${scoreChange} for ${
          userData.address
        } in leaderboard:competition:all:usd:${startTime.getTime()}`
      );
      await redis.zincrby(
        `leaderboard:competition:all:usd:${startTime.getTime()}`,
        scoreChange,
        userData.address
      );
    }
  }
};

export const buildLeaderboard = async () => {
  // get latest timestamp that leaderboard is synced to
  let leaderboardCacheTimestamp = Number(await redis.get('leaderboard_sync'));

  // return if leaderboard exists in memory already
  if (leaderboardCacheTimestamp) return;

  logger.log('Leaderboard empty, building leaderboard...');
  console.time('LeaderboardBuild');

  let breakdownByTimespan = await getTimespanBreakdown();

  // all, (gameType), (token)
  for (let token of tokenTypes) {
    for (let gameType in gameTypes) {
      const loggingText = `Synced [all, ${gameTypes[gameType]}, ${token}] in`;
      console.time(loggingText);
      let filter = {};
      if (gameTypes[gameType] !== 'all') {
        filter['gameType'] = Number(gameType);
      }
      let results = await dbMongo.findAllPlayerInfo(filter, {
        sortBy: `${token}TotalEarning`,
        select: `address ${token}`,
      });
      results.forEach(async (result) => {
        const earnings = result[`${token}TotalEarning`];
        await insertArchivedEarningsIntoCache(
          'all',
          gameTypes[gameType],
          token,
          result['_id'],
          earnings,
          breakdownByTimespan['all'].start
        );
      });
      console.timeEnd(loggingText);
    }
  }

  for (let token of tokenTypes) {
    // (daily | weekly | monthly | competition), (gameType), (token)
    for (let timespan in breakdownByTimespan) {
      if (timespan == 'all') {
        continue;
      }
      for (let gameType in gameTypes) {
        const loggingText = `Synced [${timespan}, ${gameTypes[gameType]}, ${token}] in`;
        console.time(loggingText);
        let filter = {
          coinName: token.toUpperCase(),
          createdAt: {
            $gte: breakdownByTimespan[timespan].start,
            $lte: breakdownByTimespan[timespan].end,
          },
        };
        if (gameTypes[gameType] !== 'all') {
          filter['gameType'] = Number(gameType);
        }
        let results = await dbMongo.findWinningInfosByAddress(filter);
        results.forEach(async (result) => {
          const earnings = result[`earning`];
          await insertArchivedEarningsIntoCache(
            timespan,
            gameTypes[gameType],
            token,
            result['_id'],
            earnings,
            breakdownByTimespan[timespan].start
          );
        });
        console.timeEnd(loggingText);
      }
    }
  }

  await redis.set('leaderboard_sync', new Date().getTime());
  logger.log('Leaderboard built!');
  console.timeEnd('LeaderboardBuild');
};

export const getCachedRecords = async (
  spanType,
  gameType,
  tokenType,
  startTime,
  includeAllPlayers = false
) => {
  // pull top 10 rankings from Redis cache
  let rawData = await redis.zrevrange(
    `leaderboard:${spanType}:${gameType}:${tokenType}:${startTime.getTime()}`,
    0,
    includeAllPlayers ? -1 : 9,
    'WITHSCORES'
  );

  // format data
  let records = [];
  for (let i = 0; i < rawData.length; i += 2) {
    const { avatarName, imageURL } = await getAvatarNameAndImage(rawData[i]);
    records.push({
      name: avatarName,
      address: rawData[i],
      winnings: Number(rawData[i + 1]).toLocaleString('fullwide', {
        useGrouping: false,
      }),
      imageURL: imageURL,
    });
  }
  return records;
};

export const getPlayerScoreAndRank = async (
  spanType,
  gameType,
  tokenType,
  startTime,
  address
) => {
  const rank = await redis.zrevrank(
    `leaderboard:${spanType}:${gameType}:${tokenType}:${startTime.getTime()}`,
    address
  );
  const score = await redis.zscore(
    `leaderboard:${spanType}:${gameType}:${tokenType}:${startTime.getTime()}`,
    address
  );
  let totalCount = 0;
  if (rank === null) {
    // player not in leaderboard; return would-be position given that their score is 0
    totalCount = await redis.zcount(
      `leaderboard:${spanType}:${gameType}:${tokenType}:${startTime.getTime()}`,
      '0',
      '+inf'
    );
  }
  return {
    rank: rank !== null ? rank + 1 : totalCount + 1,
    score: Number(score).toLocaleString('fullwide', {
      useGrouping: false,
    }),
  };
};

export const getTotalRecords = async (
  includeUSD = false,
  playerAddress = undefined
) => {
  let breakdownByTimespan = await getTimespanBreakdown();

  // store results into object and return data
  let data = {};
  let getCachedRecordsPromises = [];
  let getPlayerScoreAndRankPromises = [];
  for (const timespan in breakdownByTimespan) {
    data[timespan] = {};
    for (const gameType of Object.values(gameTypes)) {
      data[timespan][gameType] = {};
      for (const token of includeUSD ? [...tokenTypes, 'usd'] : tokenTypes) {
        // get top 10 records for given spanType, gameType, tokenType
        let promise1 = (async () => {
          data[timespan][gameType][token] = await getCachedRecords(
            timespan,
            gameType,
            token,
            breakdownByTimespan[timespan].start
          );
        })();
        getCachedRecordsPromises.push(promise1);

        let promise2 = (async () => {
          if (gameType === 'poker' && token === 'chips' && playerAddress) {
            const { rank, score } = await getPlayerScoreAndRank(
              timespan,
              gameType,
              token,
              breakdownByTimespan[timespan].start,
              playerAddress
            );
            data[timespan][gameType]['personalChipsData'] = {
              myScore: score,
              myRank: rank,
            };
          }
        })();
        getPlayerScoreAndRankPromises.push(promise2);
      }
    }
  }
  await Promise.all(getCachedRecordsPromises);
  await Promise.all(getPlayerScoreAndRankPromises);
  return data;
};

export const getCompetitionRecords = async () => {
  const breakdownByTimespan = await getTimespanBreakdown();
  const data = await getCachedRecords(
    'competition',
    'all',
    'usd',
    breakdownByTimespan['competition'].start,
    true
  );
  return data;
};

//from stackexchange
const isValidDate = (dateString) => {
  const regExToMatch = /^\d{4}-\d{2}-\d{2}$/;
  if(!dateString.match(regExToMatch)) return false;  // Formatting issues
  try{
    var date = new Date(dateString);
    var dateAsNum = date.getTime();
    if(!dateAsNum && dateAsNum !== 0) return false; // rejected by date lib
    return date.toISOString().slice(0,10) === dateString;
  }catch(error){
    logger.log(`There was an error trying to validate a date: ${error}`)
  }
}

export const getIceChipsRecords = async (day, isMobile = false) => {
  let startTime;
  if (day === 'today') {
    // used when sending results to clients as they play
    startTime = moment().utc().startOf('day').valueOf();
  } else if (day === 'yesterday') {
    // used for 12 AM UTC contract call when grabbing previous day's results
    startTime = moment().utc().startOf('day').subtract(1, 'day').valueOf();
  } else if ( isValidDate(day)){
    startTime = moment(day).utc().startOf('day').valueOf()
  } else {
    return null;
  }

  let rawData = await redis.zrevrange(
    `leaderboard:daily:poker:${
      isMobile ? 'mobileChips' : 'chips'
    }:${startTime}`,
    0,
    -1,
    'WITHSCORES'
  );

  // format data
  let records = [];
  for (let i = 0; i < rawData.length; i += 2) {
    const score = Number(rawData[i + 1]);
    records.push({
      address: rawData[i],
      score: score,
    });
  }
  return records;
};
