'use strict';
const Analytics = require('analytics-node');
const analytics = new Analytics('OrHyO2XSTZJ6f0KXcojtAB4kyScvZn8B');
import express from 'express';
import { pub, redis, sub } from '../modules/redis';
import { logger } from '../modules/logger';
import { NFTAccessory } from 'types/dbMongo.db';
import { transactionDGRevenueResponse, GamePlayReport } from 
'types/ice.module';
import {getAllIceLeaderboardScoresSeason, getPercentiles} from '../modules/ice/ice';
import {EntryNotFoundError, ValidationError} from '../modules/errors/errors';

const router = express.Router();
import {
  DGStakingCheck,
  getItemId,
  mintToken,
  upgradeToken,
  getBonusFromTxHash,
  getWearableMetadata,
  verifyTokenOwnership,
  claimIceRewards,
  getUnclaimedAmount,
  getWearableInventory,
  getAccessoryInventory,
  getAccessoryMarketplace,
  getCheckInStatus,
  editDelegationParamCheck,
  getTransactionSecondaryRevenue,
} from '../modules/ice/ice';
import { rmSync } from 'fs';
import { utc } from 'moment';
const dbMongo = require('../db/dbMongo');
const moment = require('moment');
const schedule = require('node-schedule');
const { api } = require('../modules/common');
const { contracts } = require('../db/dbContracts');
import { getPlayerCount } from './playerRouter';
const _ = require('lodash');

const ACCESSORYNFT = 'accessory';

// every 5 minutes, check for changes to ICE NFT metadata
let iceWearableMetadata;
const initializeIceMetadata = async () => {
  schedule.scheduleJob('*/5 * * * *', async () => {
    iceWearableMetadata = await dbMongo.findIceNftInfos({});
  });
  iceWearableMetadata = await dbMongo.findIceNftInfos({});
};
initializeIceMetadata();

router.get('/mintToken/:itemID/:tokenAddress', async (req, res) => {
  const address = req.query.address?.toString().toLowerCase();
  const nftType = req.query.type?.toString().toLowerCase();
  const tokenAddress = req.params.tokenAddress.toLowerCase();
  const itemID = parseInt(req.params.itemID);
  let jsonData = { status: false };
  const isIceNFT = nftType != ACCESSORYNFT;

  if (nftType && nftType != ACCESSORYNFT) {
    res
      .status(422)
      .send({ error: 'Invalid type parameter, please pass a string' });
    return;
  }

  logger.log(
    `Mint request received. itemID: ${itemID}, address: ${address}, tokenAddress: ${tokenAddress}`
  );

  try {
    const canExecute = await redis.set(
      `mintRequestCooldown:${address}`,
      '1',
      'EX',
      10,
      'NX'
    );
    if (!canExecute) {
      jsonData['status'] = false;
      jsonData['result'] =
        'You have already requested a mint. Please wait a moment before reattempting.';
      res.send(jsonData);
      return;
    }

    const userData = await dbMongo.findUser(address);
    if (!userData) {
      throw new Error(`User ${address} does not exist`);
    }

    const appConfig = await dbMongo.getAppConfig();
    if (isIceNFT && userData.verifyStep < appConfig.minMintVerifyStep) {
      jsonData['status'] = false;
      jsonData['result'] = `Mint is not allowed for ${address}`;
      res.send(jsonData);
      return;
    }
    let maxMintCount;
    let itemNFTPurchaserAddress;
    if (!isIceNFT) {
      const accessoryNFTInfos = await dbMongo.findAccessoryNftInfos();
      //can use the type for the accessory
      let customMetadata;
      for (const accessoryNFT of accessoryNFTInfos) {
        if (accessoryNFT.contractAddress === tokenAddress) {
          accessoryNFT.collectionMap.forEach((element) => {
            if (element.itemId == itemID) customMetadata = element;
          });
        }
      }
      if (!customMetadata) {
        res.status(404).send({ error: 'Invalid tokenAddress and or tokenId' });
        return;
      }
      maxMintCount = customMetadata.maxMintCount;
      if (maxMintCount === undefined) {
        jsonData['status'] = false;
        jsonData['result'] = 'Mint count is undefined for this collection';
        res.send(jsonData);
        return;
      }
      itemNFTPurchaserAddress = customMetadata.nftPurchaserContract;
    } else {
      const customMetadata = iceWearableMetadata.find(
        (el) => el.contractAddress === tokenAddress
      );
      const rank =
        customMetadata.urnMap[
          `urn:decentraland:matic:collections-v2:${tokenAddress}:${itemID}`
        ].rank;

      if (rank !== 1) {
        jsonData['status'] = false;
        jsonData['result'] = 'ItemID is not allowed';
        res.send(jsonData);
        return;
      }

      maxMintCount = appConfig.maxMintCounts[tokenAddress];
      if (maxMintCount === undefined) {
        jsonData['status'] = false;
        jsonData['result'] = 'Mint count is undefined for this collection';
        res.send(jsonData);
        return;
      }

      logger.log('--- Incoming ICE Wearable Mint Request ---');
      logger.log(
        'DG Staking Requirement:',
        appConfig.requireStakedDG ? 'Active' : 'Inactive'
      );

      let stakingRequirementMet: any = false;
      if (appConfig.requireStakedDG) {
        stakingRequirementMet = await DGStakingCheck(address);
      }
      if (appConfig.requireStakedDG && !stakingRequirementMet) {
        jsonData['status'] = false;
        jsonData['result'] = 'Low DG Staked Balance';
        res.send(jsonData);
        return;
      }
    }
    // Mint the Token
    const txResult = await mintToken(
      itemID,
      address,
      tokenAddress,
      maxMintCount,
      itemNFTPurchaserAddress,
      isIceNFT
    );

    jsonData['txHash'] = txResult.txHash;
    jsonData['workerAddress'] = txResult.workerAddress;

    if (txResult.error) {
      throw txResult.error;
    } else {
      jsonData['status'] = true;
      jsonData['result'] = 'mintToken transaction success';
    }
  } catch (e) {
    logger.log('/mintToken failure: ' + e);
    jsonData['status'] = false;
    jsonData['result'] = `/mintToken transaction failure: ${e}`;
  }

  res.send(jsonData);
});

router.get('/upgradeToken/:tokenId/:tokenAddress', async (req, res) => {

  const address = req.query.address?.toString().toLowerCase();
  const tokenAddress = req.params.tokenAddress.toLowerCase();
  const tokenId = req.params.tokenId.toLowerCase();
  let jsonData = { status: false };

  

  const isOwner = await verifyTokenOwnership(address, tokenId, tokenAddress);
  if (!isOwner) {
    jsonData['status'] = false;
    jsonData['result'] = 'Invalid token owner';
    res.send(jsonData);
    return;
  }

  const userData = await dbMongo.findUser(address);
  if (!userData) {
    jsonData['status'] = false;
    jsonData['result'] = 'User does not exist';
    res.send(jsonData);
    return;
  }

  const iceWearableCollectionsData = await dbMongo.findIceNftInfos({});
  const customMetadata = iceWearableCollectionsData.find(
    (el) => el.contractAddress === tokenAddress
  );

  const decodedData = await getItemId(tokenAddress, tokenId);
  const itemID = Number(decodedData.itemId);
  const nextItemID = customMetadata.itemIdUpgradeMap[itemID];
  logger.log('--- Incoming ICE Wearable Upgrade Request ---');
  if (!customMetadata || nextItemID === null) {
    logger.log('Invalid upgrade');
    jsonData['status'] = false;
    jsonData['result'] = 'Upgrade request failed';
    res.send(jsonData);
    return;
  }
  logger.log('Upgrading ItemID: ', itemID, ' -> ', nextItemID);

  const iceChallengeConstants = await dbMongo.findIceChallengeConstants();
  const rank =
    customMetadata.urnMap[
      `urn:decentraland:matic:collections-v2:${tokenAddress}:${itemID}`
    ].rank;
  const requiredXP = iceChallengeConstants.xpUpgradeCosts[rank - 1];
  logger.log('Required XP: ', requiredXP);
  logger.log(`User XP (${address}): `, userData.iceXpCurrent);
  if (userData.iceXpCurrent < requiredXP) {
    jsonData['status'] = false;
    jsonData['result'] = `Not enough XP to upgrade (${requiredXP} XP required)`;
    res.send(jsonData);
    return;
  }

  try {
    const txResult = await upgradeToken(
      address,
      tokenAddress,
      tokenId,
      nextItemID,
      rank
    );

    jsonData['txHash'] = txResult.txHash;
    if (txResult.error) {
      throw txResult.error;
    } else {
      const newTokenBonus = await getBonusFromTxHash(address, tokenAddress, txResult.txHash);
      jsonData['status'] = true;
      jsonData['bonus'] = newTokenBonus;
      jsonData['result'] = 'upgradeToken transaction sucess';
      
    }

    await dbMongo.updateUser(address, {
      iceXpCurrent: userData.iceXpCurrent - requiredXP,
    });
  } catch (e) {
    logger.log('/upgradeToken failure: ' + e);
    jsonData['status'] = false;
    jsonData['result'] = `/upgradeToken transaction failure: ${e}`;
  }

  res.send(jsonData);
});

router.get('/getMetadata/:contractAddress/:tokenId', async (req, res) => {
  // PLEASE DO NOT MODIFY THIS ENDPOINT; it is used by OpenSea for their metadata display and has strict requirements
  let metadata;
  const contractAddress = req.params.contractAddress.toLowerCase();
  const tokenId = req.params.tokenId;
  const nftType = req.query.type?.toString().toLowerCase();
  const isIceNFT = nftType != ACCESSORYNFT;

  try {
    const redisKey = `iceMetadata:${contractAddress}:${tokenId}`;
    metadata = JSON.parse(await redis.get(redisKey));

    if (!metadata) {
      const collectionsData = isIceNFT
        ? await dbMongo.findIceNftInfos({})
        : await dbMongo.findAccessoryNftInfos();
      const customMetadata = collectionsData.find(
        (el) => el.contractAddress === contractAddress
      );
      if (customMetadata) {
        metadata = await getWearableMetadata(
          contractAddress,
          tokenId,
          customMetadata,
          isIceNFT
        );
        const bonusAttribute = metadata.attributes.find(
          (el) => el.trait_type === 'Bonus'
        );
        // cache ICE wearables with nonzero bonuses / accessories
        // for ICE wearables, if bonus is still 0 it means it's never been activated
        if (!isIceNFT || (bonusAttribute && bonusAttribute.value > 0)) {
          // store metadata in redis for 24 hours
          redis.set(redisKey, JSON.stringify(metadata), 'ex', 60 * 60 * 24);
        }
      }
    }
  } catch (e) {
    logger.log('/getMetadata failure: ' + e);
  }

  res.send(metadata);
});

router.post('/delegateToken', async (req, res) => {
  let jsonData = { status: false, result: '', code: -1 };

  if (
    !req.body.delegateAddress ||
    !req.body.tokenId ||
    !req.body.contractAddress
  ) {
    jsonData['status'] = false;
    jsonData['result'] = 'Missing parameter(s)';
    jsonData['code'] = 1;
    res.send(jsonData);
    return;
  }
  let delegateNickname = null;
  if (
    req.body.hasOwnProperty('delegateNickname') &&
    req.body.delegateNickname !== null
  ) {
    delegateNickname = req.body.delegateNickname;
  }
  const requestSender = req.body.address.toLowerCase();
  const delegateAddress = req.body.delegateAddress.toLowerCase();
  const tokenId = req.body.tokenId;
  const contractAddress = req.body.contractAddress.toLowerCase();
  let userInfo = await dbMongo.findUser(requestSender);
  const tokenOwner = userInfo.managerOf ? userInfo.managerOf : requestSender;

  const mappingData = {
    tokenId: tokenId,
    contractAddress: contractAddress,
  };

  // check if identical record already exists for this wearable
  const identicalRecord = await dbMongo.findIceDelegation(mappingData);

  if (
    identicalRecord &&
    (tokenOwner === identicalRecord.tokenOwner ||
      tokenOwner === identicalRecord.delegateAddress)
  ) {
    // check if current token ownership matches DB record
    const isStillOwned = await verifyTokenOwnership(
      identicalRecord.tokenOwner,
      identicalRecord.tokenId,
      identicalRecord.contractAddress
    );
    if (isStillOwned) {
      // cancel queued undelegation if record already exists
      // can only happen if request sender is either token owner (in the record) or delegate address
      if (delegateAddress !== identicalRecord.delegateAddress) {
        jsonData['status'] = false;
        jsonData['result'] = 'Another delegation already exists for this token';
        jsonData['code'] = 8;
        res.send(jsonData);
        return;
      }

      if (tokenOwner === identicalRecord.delegateAddress) {
        await dbMongo.queueDelegateeIceUndelegation(mappingData, false);
      } else if (tokenOwner === identicalRecord.tokenOwner) {
        await dbMongo.queueOwnerIceUndelegation(mappingData, false);
      }
      jsonData['status'] = true;
      jsonData['result'] = 'Cancelled queued undelegation';
      jsonData['code'] = 6;
      res.send(jsonData);
      return;
    }
  }

  // make sure token hasn't already been checked in with today
  const { metaverseCheckInStatus, mobileCheckInStatus } =
    await getCheckInStatus(tokenOwner, tokenId, contractAddress);
  if (metaverseCheckInStatus || mobileCheckInStatus) {
    jsonData['status'] = false;
    jsonData['result'] =
      'This wearable has already been checked-in today. You can delegate after 12 AM UTC.';
    jsonData['code'] = 2;
    res.send(jsonData);
    return;
  }

  if (tokenOwner === delegateAddress) {
    jsonData['status'] = false;
    jsonData['result'] = 'You cannot delegate to yourself';
    jsonData['code'] = 3;
    res.send(jsonData);
    return;
  }

  // check if delegate is banned
  const isBanned =
    (await dbMongo.findBannedUser(delegateAddress)) ||
    (await redis.get(`bannedUsers:${delegateAddress}`));
  if (isBanned) {
    jsonData['status'] = false;
    jsonData['result'] = 'The user you are attempting to delegate to is banned';
    jsonData['code'] = 9;
    res.send(jsonData);
    return;
  }

  // check if request sender is indeed tokenOwner
  const isOwner = await verifyTokenOwnership(
    tokenOwner,
    tokenId,
    contractAddress
  );
  if (!isOwner) {
    jsonData['status'] = false;
    jsonData['result'] = 'Invalid token owner';
    jsonData['code'] = 4;
  } else {
    // check if another player is already delegating to delegateAddress
    const incomingDelegations: Array<any> = await dbMongo.findIceDelegations({
      delegateAddress: delegateAddress,
    });

    // filter incoming delegations to make sure they are still in possession of token
    let filteredIncomingDelegations: Array<any> = [];
    for (let delegation of incomingDelegations) {
      const isStillOwned = await verifyTokenOwnership(
        delegation.tokenOwner,
        delegation.tokenId,
        delegation.contractAddress
      );
      if (isStillOwned) {
        filteredIncomingDelegations.push(delegation);
      } else {
        // remove stale delegations
        await dbMongo.removeIceDelegation(delegation);
      }
    }

    const maxDelegations = 5;
    if (filteredIncomingDelegations.length >= maxDelegations) {
      jsonData['status'] = false;
      jsonData[
        'result'
      ] = `User already has the maximum number of delegations (${maxDelegations})`;
      jsonData['code'] = 7;
    } else if (
      filteredIncomingDelegations.find((el) => el.tokenOwner !== tokenOwner)
    ) {
      jsonData['status'] = false;
      jsonData['result'] = 'User already has delegations from another address';
      jsonData['code'] = 5;
    } else {
      // remove any existing delegations with this tokenId / contractAddress
      // (for example if wearable is currently delegated to someone else)
      const tokenIdRecords = await dbMongo.findIceDelegations({
        tokenId: tokenId,
        contractAddress: contractAddress,
      });
      for (let record of tokenIdRecords) {
        await dbMongo.removeIceDelegation(record);
      }

      // insert delegation record
      const newRecord = await dbMongo.insertIceDelegation({
        tokenOwner: tokenOwner,
        delegateAddress: delegateAddress,
        tokenId: tokenId,
        contractAddress: contractAddress,
      });

      //update the delegateNickname
      if (delegateNickname !== null) {
        const userInfo = await dbMongo.findUser(tokenOwner);
        let delegateNicknameObject = userInfo.delegateNicknames || {};
        delegateNicknameObject[delegateAddress] = delegateNickname;
        await dbMongo.updateUser(tokenOwner, {
          delegateNicknames: delegateNicknameObject,
        });
      }

      // send delegation data to Segment analytics
      analytics.track({
        userId: requestSender,
        event: 'Delegate',
        properties: {
          tokenOwner: tokenOwner,
          delegateAddress: delegateAddress,
          tokenId: tokenId,
          contractAddress: contractAddress,
        },
      });

      logger.log('Inserted new delegation record', newRecord);
      jsonData['status'] = true;
      jsonData['result'] = 'Success';
      jsonData['code'] = 0;
    }
  }

  res.send(jsonData);
});

router.post('/undelegateToken', async (req, res) => {
  let jsonData = { status: false, result: '', code: -1 };

  if (
    !req.body.delegateAddress ||
    !req.body.tokenId ||
    !req.body.contractAddress
  ) {
    jsonData['status'] = false;
    jsonData['result'] = 'Missing parameter(s)';
    jsonData['code'] = 1;
    res.send(jsonData);
    return;
  }

  const requestSender = req.body.address.toLowerCase();
  const delegateAddress = req.body.delegateAddress.toLowerCase();
  const tokenId = req.body.tokenId;
  const contractAddress = req.body.contractAddress.toLowerCase();

  // check if delegate's check-in is locked; this occurs while they are checking in
  // to ensure that the flow is not interrupted

  const isCheckInLocked = await redis.get(`iceCheckInLock:${delegateAddress}`);
  if (isCheckInLocked) {
    jsonData['status'] = false;
    jsonData['result'] = 'Delegate is currently checking in.';
    jsonData['code'] = 4;
    res.send(jsonData);
    return;
  }

  let userInfo = await dbMongo.findUser(requestSender);
  const tokenOwner = userInfo.managerOf ? userInfo.managerOf : requestSender;

  const mappingData = {
    delegateAddress: delegateAddress,
    tokenId: tokenId,
    contractAddress: contractAddress,
  };

  // make sure mapping exists in database
  const identicalRecord = await dbMongo.findIceDelegation(mappingData);

  if (!identicalRecord) {
    jsonData['status'] = false;
    jsonData['result'] = 'Delegate mapping does not exist';
    jsonData['code'] = 3;
  } else {
    // check if request sender is either the tokenOwner or delegateAddress
    if (
      tokenOwner !== identicalRecord.tokenOwner &&
      tokenOwner !== delegateAddress
    ) {
      res.sendStatus(403);
      return;
    }

    // if wearable is already checked in today, queue for undelegation
    const { metaverseCheckInStatus, mobileCheckInStatus } =
      await getCheckInStatus(delegateAddress, tokenId, contractAddress);
    if (metaverseCheckInStatus || mobileCheckInStatus) {
      if (tokenOwner === delegateAddress) {
        await dbMongo.queueDelegateeIceUndelegation(mappingData, true);
      } else {
        await dbMongo.queueOwnerIceUndelegation(mappingData, true);
      }
      jsonData['status'] = true;
      jsonData['result'] =
        'Wearable has been queued for delegation at 12 AM UTC';
      jsonData['code'] = 2;
    } else {
      await dbMongo.removeIceDelegation(mappingData);
      jsonData['status'] = true;
      jsonData['result'] = 'Success';
      jsonData['code'] = 0;
    }

    // send undelegation data to Segment analytics
    analytics.track({
      userId: requestSender,
      event: 'Undelegate',
      properties: {
        tokenOwner: identicalRecord.tokenOwner,
        delegateAddress: delegateAddress,
        tokenId: tokenId,
        contractAddress: contractAddress,
      },
    });
  }

  res.send(jsonData);
});

router.get('/getWearableInventory', async (req, res) => {
  const address = req.query.address?.toString().toLowerCase();
  const nftType = req.query.type?.toString().toLowerCase();
  if (!address) {
    res.status(404).send({ status: false, result: 'No address was provided' });
    return;
  }
  if (nftType && nftType != ACCESSORYNFT) {
    res
      .status(422)
      .send({ error: 'Invalid type parameter, please pass a string' });
    return;
  }
  try {
    if (nftType) {
      const accessoryNFTInventory = await getAccessoryInventory(address);
      res.send(accessoryNFTInventory);
      return;
    }
    const wearableInventory = await getWearableInventory(address);
    res.send(wearableInventory);
    return;
  } catch (error) {
    res
      .status(500)
      .send({ error: `There was an internal server error: ${error}` });
  }
});

router.get('/delegateInfo', async (req, res) => {
  const address = req.query.address?.toString().toLowerCase();

  if (!address) {
    res.send({ status: false, result: 'No address was provided' });
    return;
  }

  const outgoingDelegations = await dbMongo.findIceDelegations({
    tokenOwner: address,
  });

  const incomingDelegations = await dbMongo.findIceDelegations({
    delegateAddress: address,
  });

  // filter incoming delegations to make sure they are still in posession of tokenOwner
  let filteredIncomingDelegations: Array<any> = [];
  for (let delegation of incomingDelegations) {
    const isStillOwned = await verifyTokenOwnership(
      delegation.tokenOwner,
      delegation.tokenId,
      delegation.contractAddress
    );
    if (isStillOwned) {
      filteredIncomingDelegations.push(delegation);
    }
  }

  res.send({
    outgoingDelegations: outgoingDelegations,
    incomingDelegations: filteredIncomingDelegations,
  });
});

router.get('/claimRewards', async (req, res) => {
  let jsonData = { status: false, result: '' };
  const address = req.query.address?.toString().toLowerCase();
  const network = 'matic';

  try {
    const txHashOld = await claimIceRewards(
      address,
      contracts.ICE_KEEPER_CONTRACT_ADDRESS_1[network].toLowerCase()
    );
    const txHash = await claimIceRewards(
      address,
      contracts.ICE_KEEPER_CONTRACT_ADDRESS_2[network].toLowerCase()
    );
    if (!txHashOld && !txHash) {
      throw new Error(`No ICE drops available for ${address} to claim`);
    }
    jsonData['status'] = true;
    jsonData['result'] = 'giveClaimBulk transaction success';
    jsonData['txHash'] = txHash ?? txHashOld;
  } catch (err: any) {
    logger.log('/claimRewards failure: ' + err.message);
    jsonData['status'] = false;
    jsonData['result'] = `/claimRewards failure: ${err.message}`;
  }

  res.send(jsonData);
});

router.get('/getUnclaimedRewardsAmount', async (req, res) => {
  const address = req.query.address?.toString().toLowerCase();

  if (!address) {
    res.send({ status: false, result: 'No address was provided' });
    return;
  }

  const { totalUnclaimedAmount, totalClaimedAmount } = await getUnclaimedAmount(
    address
  );
  res.send({ totalUnclaimedAmount, totalClaimedAmount });
});

router.get('/getRewardsConfig', async (req, res) => {
  const iceChallengeConstants = await dbMongo.findIceChallengeConstants();
  res.send(iceChallengeConstants);
});

router.get('/getGameplayReports', async (req, res) => {
  const address = req.query.address?.toString().toLowerCase();
  const interval = req.query.interval || 'week';

  if (!address) {
    res.send({ status: false, result: 'No address was provided' });
    return;
  }
  let userInfo;
  try {
    userInfo = await dbMongo.findUser(address);
  } catch (error) {
    logger.debug(`Error fetching the user info, ${error}`);
  }

  let reports = await dbMongo.findIceGameplayReports({
    $or: [
      { address: address },
      { 'wearableSnapshot.delegatorAddress': address },
    ],
  });

  reports = reports.sort((a, b) => {
    return Number(new Date(b.gameplayDay)) - Number(new Date(a.gameplayDay));
  });

  let daysInInterval: Array<any> = [];
  const today = moment().utc().startOf('day');

  const getDelegateNickname = (delegateAddress: string) => {
    let delegateNickname = delegateAddress;
    if (
      userInfo?.delegateNicknames != null &&
      userInfo?.delegateNicknames != undefined
    ) {
      delegateNickname = userInfo.delegateNicknames.hasOwnProperty(
        delegateAddress.toLowerCase()
      )
        ? userInfo.delegateNicknames[delegateAddress.toLowerCase()]
        : delegateAddress;
    }
    return delegateNickname;
  };

  //if interval is all check for first entry and log all days from there
  const startDay =
    interval === 'all'
      ? moment.utc(reports[reports.length - 1].gameplayDay)
      : today.clone().subtract(1, interval);
  let dayToInclude = startDay;

  while (dayToInclude.isBefore(today)) {
    daysInInterval.push(new Date(dayToInclude));
    dayToInclude = dayToInclude.add(1, 'day');
  }

  reports = reports.map((report) => ({
    ...report,
    delegateNickname: getDelegateNickname(report.address),
  }));

  const data: GamePlayReport[] = daysInInterval.map((day) => {
    return {
      day: day,
      gameplay:
        reports.find(
          (el) =>
            el.address === address && el.gameplayDay.getTime() === day.getTime()
        ) ?? {}, // player's own gameplay
      delegation:
        reports.filter(
          (el) =>
            el.wearableSnapshot.delegatorAddress === address &&
            el.gameplayDay.getTime() === day.getTime()
        ) ?? [], // data from outgoing delegations
    };
  });

  res.send(data);
});

router.get('/getDelegationBreakdown/:interval', async (req, res) => {
  const address = req.query.address?.toString().toLowerCase();

  if (!address) {
    res.send({ status: false, result: 'No address was provided' });
    return;
  }
  const userInfo = await dbMongo.findUser(address);

  const today = moment().utc().startOf('day');
  let startDate;
  switch (req.params.interval) {
    case 'week':
      startDate = today.clone().subtract(1, 'week');
      break;
    case 'month':
      startDate = today.clone().subtract(1, 'month');
      break;
    case 'all':
      break;
    default:
      res.sendStatus(404);
      return;
  }

  let daysOfWeek: Array<any> = [];
  if (req.params.interval !== 'all') {
    let dayToInclude = startDate.clone();
    while (dayToInclude.isBefore(today)) {
      daysOfWeek.push(new Date(dayToInclude));
      dayToInclude = dayToInclude.add(1, 'day');
    }
  }

  let reports = dbMongo.findIceGameplayReports(
    req.params.interval !== 'all'
      ? {
          'wearableSnapshot.delegatorAddress': address,
          gameplayDay: { $in: daysOfWeek },
        }
      : { 'wearableSnapshot.delegatorAddress': address }
  );
  let iceWearableInventory: any = getWearableInventory(address);

  // load gameplay reports and wearable inventory in parallel
  await Promise.all([reports, iceWearableInventory]).then((values) => {
    reports = values[0];
    iceWearableInventory = values[1];
  });

  reports = reports.sort((a, b) => {
    return Number(new Date(b.gameplayDay)) - Number(new Date(a.gameplayDay));
  });
  let groupedData = _.groupBy(reports, 'address');

  // we only want to show stats for owner's active delegations
  const outgoingDelegations = iceWearableInventory.filter(
    (el) =>
      el.delegationStatus.delegatedTo !== null &&
      el.delegationStatus.delegatedTo !== address
  );

  // add missing delegations to groupedData (for ex. if player is delegated, but hasn't played yet)
  outgoingDelegations.forEach((delegation) => {
    if (
      delegation.delegationStatus.delegatedTo &&
      !groupedData[delegation.delegationStatus.delegatedTo]
    ) {
      groupedData[delegation.delegationStatus.delegatedTo] = [];
    }
  });

  let filteredData = {};
  let avatarImages = {};
  let banStatuses = {};
  let avatarPromises: Array<Promise<any>> = [];
  let banPromises: Array<Promise<any>> = [];
  for (let address in groupedData) {
    const avatarPromise = (async () => {
      filteredData[address] = groupedData[address];

      // grab avatar profile pic
      let avatarImageID = await redis.get(`avatarImage:${address}`);
      if (!avatarImageID) {
        let profile;
        try {
          profile = await api(
            `https://peer-lb.decentraland.org/lambdas/profile/${address}`
          );
        } catch {
          profile = await api(
            `https://peer.decentral.io/lambdas/profile/${address}`
          );
        }

        if (
          profile.avatars.length > 0 &&
          profile.avatars[0].ethAddress &&
          profile.avatars[0].avatar.snapshots.face256
        ) {
          avatarImageID = profile.avatars[0].avatar.snapshots.face256
            .split('/')
            .slice(-1)[0];
        } else {
          avatarImageID = 'Qmev6LMYw8oNqtHf3gPRMKWGNyFqzYJ8xnjmjMWzhTchwL'; // default avatar
        }

        // cache for 24 hours
        await redis.set(
          `avatarImage:${address}`,
          avatarImageID,
          'ex',
          60 * 60 * 24
        );
      }

      avatarImages[
        address
      ] = `https://peer-lb.decentraland.org/content/contents/${avatarImageID}`;
    })();

    const banPromise = (async () => {
      // check if user is banned
      const isBanned =
        (await dbMongo.findBannedUser(address)) ||
        (await redis.get(`bannedUsers:${address}`));
      banStatuses[address] = !!isBanned;
    })();

    avatarPromises.push(avatarPromise);
    banPromises.push(banPromise);
  }

  await Promise.all(avatarPromises);
  await Promise.all(banPromises);

  filteredData = Object.keys(filteredData).map((delegateAddress) => {
    const daysCheckedIn = filteredData[delegateAddress].length;
    const totalIceEarned = filteredData[delegateAddress].reduce(
      (a, b) => a + (b.iceEarnedDelegator || 0),
      0
    );
    const totalChipsEarned = filteredData[delegateAddress].reduce(
      (a, b) => a + (b.chipsWon || 0),
      0
    );
    const avgIceEarned = daysCheckedIn > 0 ? totalIceEarned / daysCheckedIn : 0;
    const totalChallengesCompleted = filteredData[delegateAddress].reduce(
      (a, b) => a + (b.numChallengesCompleted || 0),
      0
    );
    const totalChallengesAssigned = 3 * daysCheckedIn;
    const avgLeaderboardTier =
      daysCheckedIn > 0
        ? Math.round(
            filteredData[delegateAddress].reduce(
              (a, b) => a + (b.leaderboardPercentile || 0),
              0
            ) /
              daysCheckedIn /
              5
          ) * 5
        : 0;

    const oldestGameplayDate = filteredData[delegateAddress]
      .map((el) => el.gameplayDay)
      .sort((a, b) => {
        return b.gameplayDay - a.gameplayDay;
      })
      .slice(-1)[0];

    const delegationCreationDate = outgoingDelegations.find(
      (el) => el.delegationStatus?.delegatedTo === delegateAddress
    )?.delegationStatus.createdAt;
    let totalPossibleCheckIns;
    if (delegationCreationDate && daysCheckedIn === 0) {
      // user is delegated to, but hasn't played yet
      totalPossibleCheckIns = today.diff(
        moment.max(
          startDate,
          moment(delegationCreationDate).utc().startOf('day')
        ),
        'days'
      );
    } else {
      totalPossibleCheckIns = today.diff(
        startDate
          ? moment.max(
              startDate,
              moment(oldestGameplayDate).utc().startOf('day')
            )
          : moment(oldestGameplayDate).utc().startOf('day'), // used for all-time stats
        'days'
      );
    }

    let delegateNickname = delegateAddress;
    if (
      userInfo.delegateNicknames != null &&
      userInfo.delegateNicknames != undefined
    ) {
      delegateNickname = userInfo.delegateNicknames.hasOwnProperty(
        delegateAddress.toLowerCase()
      )
        ? userInfo.delegateNicknames[delegateAddress.toLowerCase()]
        : delegateAddress;
    }

    return {
      nickname: delegateNickname,
      address: delegateAddress,
      imageURL: avatarImages[delegateAddress],
      isBanned: banStatuses[delegateAddress],
      currentDelegations: outgoingDelegations.filter(
        (el) => el.delegationStatus.delegatedTo === delegateAddress
      ),
      breakdown: filteredData[delegateAddress],
      stats: {
        totalIceEarned,
        totalChipsEarned,
        avgIceEarned,
        totalChallengesCompleted,
        totalChallengesAssigned,
        avgLeaderboardTier,
        daysCheckedIn,
        totalPossibleCheckIns,
      },
    };
  });

  res.send(filteredData);
});

// Error handler
router.use(function (err, req, res, next) {
  if (err) {
    res.status(500).send(err);
  }
});

// determines the start time for current ICE challenge period
const getPeriodStartTimestamp = (day) => {
  const periodStart = moment().utc().startOf('day');
  if (day === 'today') {
    return periodStart.valueOf();
  } else if (day === 'yesterday') {
    return periodStart.subtract(1, 'day').valueOf();
  }
};

router.post('/retriggerIceDrop', async (req, res) => {
  const address = req.body.address.toLowerCase();
  const userData = await dbMongo.findUser(address);
  if (!userData) {
    res.sendStatus(403);
    return;
  }
  if (userData.verifyStep < 25) {
    res.sendStatus(403);
    return;
  }

  const iceDropCompletion = await redis.get(
    `iceDropCompleted:${getPeriodStartTimestamp('yesterday')}`
  ); // false if started but not yet completed, true if completed, null if never started

  if (iceDropCompletion === 'true') {
    res.send({
      success: false,
      message: 'Cannot execute; ICE drop was already completed today',
    });
    return;
  }

  await redis.del(`iceDropCompleted:${getPeriodStartTimestamp('yesterday')}`);
  await pub.publish('api', 'retriggerIceDrop:request');

  const callback = async (channel, message) => {
    if (message === 'retriggerIceDrop:success') {
      res.send({ success: true });
    }
    sub.removeListener('message', callback);
  };
  sub.on('message', callback);
});

router.get('/getCollectionMetadata', async (req, res) => {
  res.send(iceWearableMetadata);
});

// const getPeerServerNamesByDomain = async () => {
//   const dclServersList = await api(
//     `https://peer-lb.decentraland.org/lambdas/contracts/servers`
//   );
//
//   const formattedList = []
//   dclServersList.forEach(server => {
//     formattedList.push(server.baseUrl);
//   })
//
//   global.dclServersList = formattedList;
//   console.log('global.dclServersList', global.dclServersList)
//   updateDclServersList()
// }
//
// setInterval(() => {
//   getPeerServerNamesByDomain();
// }, 10000);

/** GET: /ice/play
 * This is a load balancer which automatically routes players joining the Poker DEXT lounge to the most populated server
 * with a count of players online less than the value of `playIceLoadBalancerMaxPlayers`.
 **/
router.get('/play', async (req, res) => {
  const strongholdPosition = '-102%2C129';
  const dextPosition = '-110%2C129';
  const chateauPosition = '-75%2C71';
  const osirisPosition = '-111%2C137';

  let scenePositionToRedirectTo;
  const requestedPosition = req.query.position?.toString().toUpperCase();

  // Use cached data if available, because the APIs take about 15 seconds to respond.
  if (_.isEmpty(global.playerCountData)) {
    logger.debug('playerCountData is empty, fetching...');
    global.playerCountData = await getPlayerCount();
  }

  // Sort in descending order by `x.totalPlayers`
  const strongholdSortedPlayersByRealm =
    global.playerCountData?.stronghold?.serverRealms.sort((a, b) => {
      return parseFloat(b.totalPlayers) - parseFloat(a.totalPlayers);
    }) || [];

  const pokerDextSortedPlayersByRealm =
    global.playerCountData?.dext?.serverRealms.sort((a, b) => {
      return parseFloat(b.totalPlayers) - parseFloat(a.totalPlayers);
    }) || [];

  const chateauSortedPlayersByRealm =
    global.playerCountData?.chateau?.serverRealms.sort((a, b) => {
      return parseFloat(b.totalPlayers) - parseFloat(a.totalPlayers);
    }) || [];

  const osirisSortedPlayersByRealm =
    global.playerCountData?.osiris?.serverRealms.sort((a, b) => {
      return parseFloat(b.totalPlayers) - parseFloat(a.totalPlayers);
    }) || [];

  // Default value
  let realmToLoad, isAvailableRealmFound;
  const gameConstants = await dbMongo.getGameConstants();
  const icePokerConfig = gameConstants.icePokerConfig;
  const playersPerTable = icePokerConfig.maxPlayersPerTable; // how many maximum players per table?
  const spectatorBuffer = icePokerConfig.spectatorBuffer; // how many extra players per scene will we allow as spectators?

  const checkPlayerCountForRealm = (
    sortedPlayersByRealm,
    sceneName,
    sceneWorldPosition
  ) => {
    // Check The Stronghold Player Count
    for (const realmData of sortedPlayersByRealm) {
      // start at the beginning of the list, if player counter is great than X, move to next in list (next most popular realm)

      const maxPlayerCountAllowed =
        icePokerConfig.maxTablesPerScene[sceneName] * playersPerTable +
        spectatorBuffer;
      logger.log(
        `Checking Scene: ${sceneName} - Realm:`,
        realmData.realm,
        `- Players online: ${realmData.playerCount}`,
        `- Max players allowed: ${maxPlayerCountAllowed}`
      );
      if (realmData.playerCount >= (maxPlayerCountAllowed || 60)) {
        // This realm is full, so skip this iteration
        continue;
      }

      // Set realm name to this iteration
      realmToLoad = realmData.realm;

      logger.log(`Redirecting to Scene: ${sceneName} - Realm:`, realmToLoad);

      isAvailableRealmFound = true;
      scenePositionToRedirectTo = sceneWorldPosition;
      // Exit loop, available realm found
      break;
    }

    if (!isAvailableRealmFound) {
      // If all realms are full, move to the next scene's realm list
      logger.log(`All ${sceneName} realms are full. Checking next venue...`);
    }
  };

  // Check The Stronghold Player Count
  checkPlayerCountForRealm(
    strongholdSortedPlayersByRealm,
    'The Stronghold',
    strongholdPosition
  );

  // Check Osiris Player Count
  if (!isAvailableRealmFound) {
    checkPlayerCountForRealm(
      osirisSortedPlayersByRealm,
      'Osiris',
      osirisPosition
    );
  }

  // Check Chateau Player Count
  if (!isAvailableRealmFound) {
    checkPlayerCountForRealm(
      chateauSortedPlayersByRealm,
      'Chateau Satoshi',
      chateauPosition
    );
  }

  // Check Poker Dext Player Count
  if (!isAvailableRealmFound) {
    checkPlayerCountForRealm(
      pokerDextSortedPlayersByRealm,
      'Poker DEXT',
      dextPosition
    );
  }

  // If no realms found in ICE Poker or DEXT Poker lounge
  if (!isAvailableRealmFound) {
    // If all realms are full, move to the next scene's realm list
    logger.log('All ICE Poker Lounges are full. Defaulting to "DG" realm.');
  }

  if (requestedPosition) {
    // redirected to requested scene
    scenePositionToRedirectTo = requestedPosition;
  } else if (scenePositionToRedirectTo) {
    // do nothing, redirecting to automatically selected scene
  } else {
    // redirect to stronghold DG realm by default if all realms are full in all scenes.
    scenePositionToRedirectTo = 'position=-110%2C129';
    realmToLoad = 'dg';
  }

  const fullRedirectUrl = `https://play.decentraland.org/?position=${scenePositionToRedirectTo}&realm=${realmToLoad}`;

  res.redirect(302, fullRedirectUrl);
});

router.patch('/editDelegation', async (req, res) => {
  const address = req.body.address.toLowerCase();

  if (!editDelegationParamCheck(req.body)) {
    res.sendStatus(422);
    return;
  }
  const role = req.body.role?.toLowerCase();
  try {
    if (req.body.guildName) {
      await dbMongo.updateUser(address, { guildName: req.body.guildName });
      res.sendStatus(200);
      return;
    }
    let userInfo = await dbMongo.findUser(address);
    const guildOwner = userInfo.managerOf ? userInfo.managerOf : address;
    const delegateAddress = req.body.delegateAddress.toLowerCase();
    const nickname = req.body.nickname;
    userInfo = await dbMongo.findUser(guildOwner);
    let delegateNicknameObject = userInfo.delegateNicknames || {};
    delegateNicknameObject[delegateAddress] = nickname;
    await dbMongo.updateUser(guildOwner, {
      delegateNicknames: delegateNicknameObject,
    });

    res.sendStatus(200);
    return;
  } catch (error) {
    logger.log(`MongoDB Error ${error}`);
    res.sendStatus(500);
    return;
  }
});

router.get('/getAccessoryMarketplace', async (req, res) => {
  let accessoryWearables: NFTAccessory;

  try {
    const redisKey = 'accessoryWearables';
    accessoryWearables = JSON.parse(await redis.get(redisKey));
    if (!accessoryWearables) {
      accessoryWearables = await getAccessoryMarketplace();

      // cache for 15 seconds
      redis.set(redisKey, JSON.stringify(accessoryWearables), 'ex', 15);
    }

    res.status(200).send(accessoryWearables);
    return;
  } catch (error) {
    logger.log(`/getAccessoryMarketplace Error ${error}`);
    res.sendStatus(500);
    return;
  }
});

router.get('/secondaryRevenue', async (req, res) => {
  const transactionId = req.query.transactionId;
  if (!transactionId || transactionId.toString().slice(0, 2) !== '0x') {
    res.status(422).send({
      error: 'Please pass a valid transactionId including the leading 0x',
    });
    return;
  }
  try {
    const secondaryRevenue: transactionDGRevenueResponse =
      await getTransactionSecondaryRevenue(transactionId.toString());
    res.send(secondaryRevenue);
    return;
  } catch (err: any) {
    res.status(500).send({ error: `Internal Server Error: ${err}` });
    return;
  }
});

router.get('/getIceLeaderboardScore', async (req, res) => {
  const address = req.query.address?.toString().toLowerCase();
  const CURRENT_GUILD_LEADERBOARD_SEASON = (await dbMongo.getAppConfig()).currentGuildLeaderboardSeason;
  const season = req.query.season ? req.query.season.toString() : CURRENT_GUILD_LEADERBOARD_SEASON;
  try {
    const iceGuildLeaderboard = await dbMongo.findIceGuildLeaderboard(address, season);
    if(!iceGuildLeaderboard){
      res
      .status(404)
      .send({ error: `Unable to find ice guild leaderboard for that user/season combination` });
      return;
    }
    res.status(200).send(iceGuildLeaderboard.GuildScore.toString());
    return;
  } catch (error) {
    res
      .status(500)
      .send({ error: `There was an internal server error: ${error}` });
  }
});

router.get('/getAllIceLeaderboardScores', async (req, res) => {
  const CURRENT_GUILD_LEADERBOARD_SEASON = (await dbMongo.getAppConfig()).currentGuildLeaderboardSeason;
  const season:string = req.query.season ? req.query.season.toString() : CURRENT_GUILD_LEADERBOARD_SEASON;
  try {
    const iceGuildLeaderboards = await getAllIceLeaderboardScoresSeason(season);
    res.status(200).send(iceGuildLeaderboards);
    return;
  } catch (error) {
    if (error instanceof EntryNotFoundError) {
      res.status(404).send(error.message);
      return;
    }else{
      res
      .status(500)
      .send({ error: `There was an internal server error: ${error}` });
    }
  }
});

router.get('/getLeaderboardStats', async (req,res) => {
  try{
    const date = req.query.date || 'today';
    const leaderboardPercentiles = await getPercentiles(date);
    if(leaderboardPercentiles == null){
      throw new ValidationError('Invalid date');
    }
    const iceChallengeConstants = await dbMongo.findIceChallengeConstants();
    const leaderboardMultiplier = iceChallengeConstants.leaderboardMultiplierMap;
    res.status(200).send({LeaderboardPercentiles: leaderboardPercentiles, LeaderboardMultiplier: leaderboardMultiplier})
    return;
  }catch(error){
    if (error instanceof ValidationError) {
      res.status(422).send(error.message);
      return;
    }else{
    res.status(500).send({error: `There was an error getting the leaderboard data: ${error}`})
    }
  }
})

router.get('/iceNftInfos', async (req,res) => {
  try{
    const iceNftInfos = await dbMongo.findIceNftInfos();
    res.status(200).send(iceNftInfos);
    return;
  }catch(error){
    res.status(500).send({error: `There was an error getting the ice nft infos : ${error}`});
    return;
  }
})




export default router;
