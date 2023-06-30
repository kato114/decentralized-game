'use strict';
const express = require('express');
const dbMongo = require('../db/dbMongo');
const moment = require('moment');
const router = express.Router();
const { contracts } = require('../db/dbContracts');
import { getTotalRecords } from '../modules/leaderboard';
const { redis } = require('../modules/redis');
const { api } = require('../modules/common');
import { logger } from '../modules/logger';
const _ = require('lodash');
import sleep from 'sleep-promise';
import axios from 'axios';
import { updateUser, withdrawManagement } from '../modules/admin/admin';
import { UserNotFoundError, ValidationError } from '../modules/errors/errors';

enum BanType {
  SOFT = 'soft',
  HARD = 'hard',
}

/***************/
// Error handler
/***************/
router.use(function (err, req, res, next) {
  if (err) {
    res.status(500).send(err);
  }
});

/***************/
// Route handlers
/***************/
router.get('/getDGPrice', async function (req, res) {
  let dgPriceUSD = await redis.get('dgPriceUSD');
  while (dgPriceUSD === null) {
    await sleep(1000);
    dgPriceUSD = await redis.get('dgPriceUSD');
  }
  res.send({ price: parseFloat(dgPriceUSD) });
});

const dgPriceTTL = 5 * 60; // refresh cache in background every X seconds
async function getDGPriceUSD() {
  try {
    const data = await api(
      'https://api.coingecko.com/api/v3/coins/decentral-games'
    );
    await redis.set(
      'dgPriceUSD',
      JSON.stringify(data.market_data.current_price.usd),
      'ex',
      dgPriceTTL
    );
  } catch (err) {
    logger.log('Error fetching $DG Coin data: ', err);
  }
}

setInterval(async () => {
  let ttl = await redis.ttl('dgPriceUSD');
  if (ttl < dgPriceTTL / 2) {
    // increase expiration while data is being pulled to prevent other API instances from also running this
    await redis.expire('dgPriceUSD', dgPriceTTL);
    getDGPriceUSD();
  }
}, (dgPriceTTL * 1000) / 2);
getDGPriceUSD();

router.get('/getContractAddresses', async function (req, res) {
  var json_data = {
    status: 'ok',
    result: contracts,
  };

  res.send(json_data);
});

router.get('/serverList', async function (req, res) {
  res.send({
    domainList: global.domainList,
    serverNameList: global.serverNameList,
    currentIslandsList: global.islands,
  });
});

router.get('/getTotalRecords', async function (req, res) {
  const address = req.query.address?.toLowerCase();
  const records = await getTotalRecords(false, address);
  res.send(records);
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// return user's information to the client
router.get('/getUser', async function (req, res) {
  const address = req.query.address?.toString().toLowerCase();
  if (!address) {
    res.send('You need to specify address in the query parameter');
  }
  let userInfo = await dbMongo.findUser(address);

  if (userInfo) {
    const [isBanned, isOnMobileWhitelist, appConfig] = await Promise.all([
      dbMongo.findBannedUser(address) || redis.get(`bannedUsers:${address}`),
      dbMongo.findMobileWhitelistUser(address),
      dbMongo.getAppConfig(),
    ]);
    userInfo.isBanned = !!isBanned;
    userInfo.isOnMobileWhitelist = appConfig.isMobileWhitelistEnabled
      ? !!isOnMobileWhitelist
      : true;
    res.send(userInfo);
  } else {
    res.send('User Not Found');
  }
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// Update a user's information
router.patch('/updateUser', async function (req, res) {
  try {
    await updateUser(req.body);
    res.status(200).send('ok');
    return;
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      res.status(404).send(error.message);
      return;
    } else if (error instanceof ValidationError) {
      res.status(422).send(error.message);
      return;
    } else {
      res.status(500).send(error.message);
      return;
    }
  }
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// Update a user's information
router.patch('/withdrawManagement', async function (req, res) {
  try {
    await withdrawManagement(req.body);
    res.status(200).send('ok');
    return;
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      res.status(404).send(error.message);
      return;
    } else if (error instanceof ValidationError) {
      res.status(422).send(error.message);
      return;
    } else {
      res.status(500).send(error.message);
      return;
    }
  }
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// return user's information to the client
router.get('/preApprovedUsers', async function (req, res) {
  const preApprovedUsersList = await dbMongo.getPreApprovedUsersList();
  if (preApprovedUsersList) {
    res.send(preApprovedUsersList);
  } else {
    res.send('No pre-approved users list found.');
  }
});

router.post('/addUsersToMobileWhitelist', async function (req, res) {
  try {
    const userAddresses: string[] = req.body.addresses;
    const cleanedUserAddresses: string[] = userAddresses.map((address) =>
      address.toString().toLowerCase()
    );

    await dbMongo.bulkInsertMobileWhitelistUsers(cleanedUserAddresses);
    res.send('done');
    return;
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).send(error.message);
      return;
    } else {
      res.status(500).send(`Error: ${error}`);
    }
  }
});

router.post('/bulkBlockUsers', async function (req, res) {
  try {
    let userData = await dbMongo.findUser(req.body.address?.toLowerCase());
    if (userData.verifyStep < 20) {
      res.status(403).send({ error: 'This API endpoint is not meant for you' });
      return;
    }
    if (!req.body.banAddresses) {
      throw new ValidationError(
        JSON.stringify({
          BAD_PARAMETERS: [
            `Please include who you would like to ban in the payload`,
          ],
        })
      );
    }
    if (
      req.body.type &&
      req.body.type.toLowerCase().trim() !== BanType.SOFT &&
      req.body.type.toLowerCase().trim() !== BanType.HARD
    ) {
      throw new ValidationError(
        JSON.stringify({
          INVALID_BANTYPE: [`Ban type ${req.query.type} is not valid`],
        })
      );
    }

    const reason = req.body.reason?.toString().trim();
    const reporterName = req.body.reporterName?.toString().trim();
    const type = req.body.type?.toString().toLowerCase().trim();
    const userAddresses = req.body.banAddresses.split(',');

    await dbMongo.bulkInsertBannedUsers(
      userAddresses,
      reason,
      reporterName,
      type
    );
    res.status(200).send('Banned User Success!');
    return;
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).send(error.message);
      return;
    } else {
      res.status(500).send(`Error: ${error}`);
    }
  }
});

router.get('/findBlockedUser', async function (req, res) {
  try {
    let userData = await dbMongo.findUser(req.query.address?.toLowerCase());
    if (userData.verifyStep < 20) {
      res.status(403).send({ error: 'This API endpoint is not meant for you' });
      return;
    }
    if (!req.query.bannedAddress) {
      res
        .status(404)
        .send({ error: 'Please specify a user you would like to look up.' });
      return;
    }
    const bannedUserAddress = req.query.bannedAddress.toString().toLowerCase();
    const bannedUser = await dbMongo.findBannedUser(bannedUserAddress);
    res.send({
      BannedUserAddress: bannedUser.address,
      Reason: bannedUser.reason,
      ReporterName: bannedUser.reporterName,
      Type: bannedUser.type,
    });
    return;
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    return;
  }
});

router.get('/blockUser', async function (req, res) {
  try {
    const address = req.query.address?.toString().toLowerCase();
    if (!address) {
      res.send('You need to specify address in the query parameter');
    }
    const addr = address.toLowerCase();
    await dbMongo.insertBannedUser({
      address: addr,
    });
    res.send('done');
    return;
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    return;
  }
});

router.get('/unBlockUser', async function (req, res) {
  try {
    const address = req.query.address?.toString().toLowerCase();
    if (!address) {
      res.send('You need to specify address in the query parameter');
    }
    const addr = address.toLowerCase();
    await dbMongo.removeBannedUser({
      address: addr,
    });
    res.send('done');
  } catch (error) {
    res.send('failed');
  }
});

router.post('/temporarilyBlockUser', async function (req, res) {
  try {
    if (process.env.NODE_ENV === 'production') {
      res
        .status(403)
        .send({ error: 'This API endpoint is not configured to run in prod' });
      return;
    }
    const address = req.body.address?.toString().toLowerCase();
    let banTime = parseInt(req.body.banTime);
    if (!address || !banTime) {
      res
        .status(422)
        .send({ error: 'Please pass an address and banTime in hours' });
      return;
    }
    //convert hours to seconds
    banTime = banTime * 60 * 60;
    await redis.set(`bannedUsers:${address}`, address, 'ex', banTime);
    res.status(201).send({ success: `Successfully banned used ${address}` });
    return;
  } catch (error) {
    logger.log(`Error Temporarily banning User: ${error}`);
    res.status(500).send({ error: `Internal server error: ${error}` });
    return;
  }
});

router.get('/getTemporarilyBlockedUser', async function (req, res) {
  try {
    if (process.env.NODE_ENV === 'production') {
      res
        .status(403)
        .send({ error: 'This API endpoint is not configured to run in prod' });
      return;
    }
    const address = req.body.address?.toString().toLowerCase();
    if (!address) {
      res.status(422).send({ error: 'Please pass an address' });
      return;
    }
    const bannedUser = await redis.get(`bannedUsers:${address}`);
    if (bannedUser == null) {
      res.status(200).send({ userBlocked: false });
      return;
    }
    res.status(200).send({ userBlocked: true });
    return;
  } catch (error) {
    logger.log(`Error getting banned User: ${error}`);
    res.status(500).send({ error: `Internal server error: ${error}` });
    return;
  }
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// find all game play history

router.get('/getHistory', async function (req, res) {
  var json_data = {
    status: 'ok',
    result: null,
  };
  var limit;
  try {
    var playinfos = await dbMongo.findAllPlayInfos({}, limit);
    if (!playinfos || playinfos.length == 0) json_data['result'] = 'false';
    else json_data['result'] = playinfos;
  } catch (e) {
    logger.log(e);
    json_data['status'] = 'fail';
  }
  res.send(json_data);
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// find game play history with page, period, limit conditions.

router.post('/getTotal', async function (req, res) {
  var page = req.body.page;
  var period = req.body.period;
  var limit = req.body.limit || 100;
  var json_data = {
    status: 'ok',
    result: null,
  };
  try {
    var curTime = new Date();
    var playinfos = await dbMongo.findAllPlayInfos(
      { createdAt: { $gte: new Date(curTime.getTime() - Number(period)) } },
      { limit, page }
    );
    if (!playinfos || playinfos.length == 0) json_data['result'] = 'false';
    else json_data['result'] = playinfos;
  } catch (e) {
    logger.log(e);
    json_data['status'] = 'fail';
  }
  res.send(json_data);
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// find all transactions

router.get('/getDeposit', async function (req, res) {
  var json_data = {
    status: 'ok',
    result: null,
  };
  var limit;
  try {
    var txdatas = await dbMongo.findAllTransaction({}, limit);
    if (txdatas && txdatas.length) json_data['result'] = txdatas;
    else json_data['result'] = 'false';
  } catch (e) {
    logger.log(e);
    json_data['status'] = 'fail';
  }
  res.send(json_data);
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// get poker hand history for specifed user

router.get('/getPokerHandHistory', async function (req, res) {
  const address = req.query.address?.toString().toLowerCase();
  if (!address) {
    res.send('You need to specify address in the query parameter');
  }
  const addr = address.toLowerCase();
  const pokerHandHistory = await dbMongo.findPokerHandHistory(addr);

  // filter other players' hands
  for (let session of pokerHandHistory) {
    for (let hand of session.tableData) {
      hand.playerHandData = hand.playerHandData.find(
        (el) => el.playerAddress === addr
      );
    }

    // filter hands where player wasn't a participant
    session.tableData = session.tableData.filter((el) => el.playerHandData);
  }

  res.send(pokerHandHistory);
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// health check

router.get('/healthCheck', async function (req, res) {
  let dbStatus = false,
    redisStatus = false;
  try {
    dbStatus = await dbMongo.connectToMongoDb(true);
  } catch (err) {}

  try {
    const pong = await redis.ping();
    if (pong === 'PONG') redisStatus = true;
  } catch (err) {}

  const serverStatus = {
    dbStatus: dbStatus ? 'running' : 'stopped',
    redisStatus: redisStatus ? 'running' : 'stopped',
  };
  res.send(serverStatus);
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// get treasury balance history

let treasuryBalanceHistoryData = {};
router.get('/getTreasuryBalanceHistory/:interval', async (req, res) => {
  if (
    !['hour', 'day', 'week', 'month', 'year', 'all'].includes(
      req.params.interval
    )
  ) {
    res.sendStatus(404);
  } else {
    res.send(treasuryBalanceHistoryData[req.params.interval]);
  }
});

getTreasuryBalanceHistoryData();
setInterval(() => {
  getTreasuryBalanceHistoryData();
}, 60000);

async function getTreasuryBalanceHistoryData() {
  const getPercentChange = (oldNumber, newNumber) => {
    let difference = newNumber - oldNumber;
    return (difference / oldNumber) * 100;
  };

  // get latest balances
  const todayBalances = await dbMongo.findLatestTreasuryBalance();
  let todayDate = new Date(todayBalances.timestamp);

  // get balances from 24 hours ago
  const oneDayAgo = new Date(todayDate.setDate(todayDate.getDate() - 1));
  let oneDayAgoBalances = await dbMongo.findEarliestTreasuryBalance({
    timestamp: { $gte: oneDayAgo },
  });

  // get balances from 1 week ago
  const oneWeekAgo = new Date(todayDate.setDate(todayDate.getDate() - 6));
  let oneWeekAgoBalances = await dbMongo.findEarliestTreasuryBalance({
    timestamp: { $gte: oneWeekAgo },
  });

  const balanceTypes = Object.keys(todayBalances._doc).filter(
    (el) =>
      [
        '_id',
        'timestamp',
        'total',
        'atriBalance',
        'totalCurveAaveBalance',
        'usdtBalance',
      ].includes(el) === false
  );

  // grab missing fields
  // for example, if we just started logging field and it's missing from 24 hr / 1 week data
  for (let type of balanceTypes) {
    if (!oneDayAgoBalances.hasOwnProperty(type)) {
      let includesMissingField = await dbMongo.findEarliestTreasuryBalance({
        timestamp: { $gte: oneDayAgo },
        [type]: { $exists: true },
      });
      oneDayAgoBalances[type] = includesMissingField[type];
    }
    if (!oneWeekAgoBalances.hasOwnProperty(type)) {
      let includesMissingField = await dbMongo.findEarliestTreasuryBalance({
        timestamp: { $gte: oneWeekAgo },
        [type]: { $exists: true },
      });
      oneWeekAgoBalances[type] = includesMissingField[type];
    }
  }

  const formatBalances = async (timespan, results) => {
    let data = {};
    for (let type of balanceTypes) {
      data[type] = {};

      // weekly and daily changes
      let todayBalance = todayBalances[type];
      let oneDayAgoBalance = oneDayAgoBalances[type];
      let oneWeekAgoBalance = oneWeekAgoBalances[type];

      data[type]['changes'] = {
        daily: {
          amount: todayBalance - oneDayAgoBalance,
          percent: getPercentChange(oneDayAgoBalance, todayBalance),
        },
        weekly: {
          amount: todayBalance - oneWeekAgoBalance,
          percent: getPercentChange(oneWeekAgoBalance, todayBalance),
        },
      };

      // data for graph on website
      for (let dataPoint of results) {
        if (!data[type]['graph']) {
          data[type]['graph'] = [];
        }

        // check if balance exists since we haven't been tracking them all since the start
        if (dataPoint[type] !== undefined) {
          data[type]['graph'].push({
            primary: dataPoint.timestamp,
            secondary: dataPoint[type],
          });
        }
      }
    }
    treasuryBalanceHistoryData[timespan] = data;
  };

  const calculateTimepoints = async (timespan, filter) => {
    try {
      // grab timestamp of record at start date
      let firstTreasuryBalanceDate = moment(
        (await dbMongo.findEarliestTreasuryBalance(filter))?.timestamp
      );
      let now = moment().utc().seconds(0).milliseconds(0);

      // total number of timepoints
      let count = 250;
      if (timespan === 'hour') {
        count = 60;
      }

      // calculate minutes since first record
      let durationInMinutes = moment
        .duration(now.diff(firstTreasuryBalanceDate))
        .asMinutes();
      let intervalInMinutes = durationInMinutes / (count - 1);

      // store array of timestamps counting backwards from now
      let timePoints = [];
      timePoints.push(new Date(now.toDate()));
      for (let i = 0; i < count - 2; i++) {
        timePoints.push(
          new Date(
            moment(now.subtract(intervalInMinutes, 'minutes'))
              .seconds(0)
              .milliseconds(0)
              .toDate()
          )
        );
      }
      timePoints.push(new Date(firstTreasuryBalanceDate.toDate()));

      // find records for calculated timestamps
      let treasuryBalanceHistory = await dbMongo.findTreasuryBalanceHistory(
        timePoints
      );
      formatBalances(timespan, treasuryBalanceHistory);
    } catch (err) {
      logger.log(`Couldn't calculate timepoints: `, err);
    }
  };

  for (const timespan of ['hour', 'day', 'week', 'month', 'year', 'all']) {
    if (timespan !== 'all') {
      calculateTimepoints(timespan, {
        //TODO: Resolve this type error
        // @ts-ignore
        timestamp: { $gte: new Date(moment().utc().subtract(1, timespan)) },
      });
    } else {
      calculateTimepoints('all', {});
    }
  }
}

router.get('/ping', (req, res) => {
  res.send('pong!');
});

router.get('/getAppConfig', async function (req, res) {
  const appConfig = await dbMongo.getAppConfig();
  const rpcProvider = await dbMongo.findActiveRPC();

  const data = {
    ...appConfig,
    polygonRPC: rpcProvider.matic.webClient,
  };

  res.send(data);
});

router.get('/getFrontPageStats', async function (req, res) {
  const frontPageStats = await dbMongo.getFrontPageStats();
  const todayBalances = await dbMongo.findLatestTreasuryBalance();
  frontPageStats.treasuryTotal = todayBalances.totalBalanceUSD;
  res.send(frontPageStats);
});

router.get('/getJobListings', async function (req, res) {
  const jobListings = await dbMongo.getJobListings();
  res.send(jobListings);
});

/* Get gameConstants */
let gameConstants;

export const updateGameConstants = async () => {
  gameConstants = await dbMongo.getGameConstants();

  if (gameConstants || !_.isEmpty(gameConstants)) {
    // Store in Redis Cache for fast access
    // logger.debug('Caching gameConstants into Redis Cache')
    await redis.set('gameConstants', JSON.stringify(gameConstants));
  }
};

router.get('/getGameConstants', async (req, res) => {
  try {
    /////////////// For Testing Purposes Only /////////////////////////////
    // if (process.env.NODE_ENV === 'localhost') {
    //   await redis.set('gameConstants', null);
    // }
    ///////////////////////////////////////////////////////////////////////

    // Check Redis Cache
    gameConstants = await redis.get('gameConstants');

    // Get from MongoDB if not already in Redis Cache
    if (!gameConstants || _.isEmpty(gameConstants)) {
      await updateGameConstants();
    } else {
      // Use the Redis cache and parse the JSON
      // logger.debug('Using gameConstants from Redis Cache')
      gameConstants = JSON.parse(gameConstants);
    }

    res.send(gameConstants);
  } catch (err) {
    logger.log('Error fetching gameConstants:', err);

    // Clear Redis cache upon error so it can be reset on the next request
    await redis.set('gameConstants', null);
  }
});

// Update every X seconds
setInterval(async () => {
  await updateGameConstants();
}, 1000 * 60); // 60 seconds

router.get('/updateUserBalances', async function (req, res) {
  // `address` and `user` must be called with toLowerCase() for consistency
  const address = req.query.address?.toString().toLowerCase();
  const user = req.query.user.toLowerCase();
  let {
    query: {
      iceChipsAmountChange = undefined,
      freePlayAmountChange = undefined,
    } = {},
  } = req;

  if (!user) {
    res.send(
      'user is required: You need to specify the user in the query parameter'
    );
    return;
  }

  if (!iceChipsAmountChange && !freePlayAmountChange) {
    res.send(
      'iceChipsAmountChange or freePlayAmountChange is required: You need to specify the amount of ICE or FREE Play to add or subtract in the query parameter'
    );
    return;
  }

  // Check if user calling this endpoint is an admin
  const reqUserData = await dbMongo.findUser(address);

  // Only allow Admins to call this endpoint
  if (reqUserData.verifyStep >= 20) {
    // Convert query inputs to Numbers
    iceChipsAmountChange = +iceChipsAmountChange;
    freePlayAmountChange = +freePlayAmountChange;

    const targetUserData = await dbMongo.findUser(user);

    if (targetUserData) {
      if (iceChipsAmountChange && Number.isInteger(iceChipsAmountChange)) {
        // Update User Chips Balance
        targetUserData['iceChipsBalance'] += iceChipsAmountChange;
      }
      if (freePlayAmountChange && Number.isInteger(freePlayAmountChange)) {
        // Update User Chips Balance
        targetUserData['playBalance'] += freePlayAmountChange;
      }

      await dbMongo.updateUser(user, targetUserData);

      res.send({
        message: `Successfully updated ${user}`,
        iceChipsBalance: targetUserData.iceChipsBalance,
        playBalance: targetUserData.playBalance,
      });
    } else {
      res.send(`User does not exist: ${user}`);
    }
  } else {
    res.status(403);
    res.send('You are not authorized to call this endpoint.');
  }
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// Testing Endpoints to Create and Delete Users
router.post('/createUserTesting', async function (req, res) {
  try {
    let userData = await dbMongo.findUser(req.body.address?.toLowerCase());
    if (
      req.body.address?.toLowerCase() !==
        '0x39f123f76ce10489811bac968dd21c198512f808' ||
      userData.verifyStep <= 30
    ) {
      res.status(403).send({ error: 'This API endpoint is not meant for you' });
      return;
    }
    let address = req.body.newAddress.toLowerCase();
    let verifyStep = req.body.verifyStep || 4;
    let ipAddress = req.headers['true-client-ip'] ?? req.clientIp;

    userData = await dbMongo.findUser(address);
    if (userData) {
      res.status(422).send({ error: 'User already exists' });
      return;
    }

    // insert user's wallet address and IP address into database
    await dbMongo.insertUser({
      address: address,
      ipAddress: ipAddress,
      verifyStep: verifyStep,
    });
  } catch (error) {
    logger.log(`/createUser testing failure: ${error}`);
    res.status(500).send({ error: `Internal server error: ${error}` });
  }

  res.status(201).send();
});

router.delete('/deleteUserTesting', async function (req, res) {
  try {
    let userData = await dbMongo.findUser(req.body.address?.toLowerCase());
    if (
      req.body.address?.toLowerCase() !==
        '0x39f123f76ce10489811bac968dd21c198512f808' ||
      userData.verifyStep <= 30
    ) {
      res.status(403).send({ error: 'This API endpoint is not meant for you' });
      return;
    }
    let address = req.body.deleteAddress.toLowerCase();

    const userInfo = await dbMongo.findUser(address);
    if (!userInfo) {
      res.status(404).send({ error: 'User not found' });
      return;
    }

    // insert user's wallet address and IP address into database
    await dbMongo.deleteUser(address);
  } catch (error) {
    logger.log(`/createUser testing failure: ${error}`);
    res.status(500).send({ error: `Internal server error: ${error}` });
  }

  res.status(200).send();
});

router.get('/treasuryDetails', async function (req, res) {
  try {
    const BASE_URL = 'https://intel.decentral.games/api';
    const resp = await axios.post(`${BASE_URL}/session`, {
      username: 'tabatha@decentral.games',
      password: '-r6EKLoUPcrFnA',
    });
    const sessionID = resp.data.id;
    const AUTH_HEADERS = {
      headers: {
        'X-Metabase-Session': sessionID,
      },
    };
    const mintRevenueResponse = await axios.get(
      `${BASE_URL}/card/143`,
      AUTH_HEADERS
    );
    const mintRevenueUSD =
      mintRevenueResponse.data.result_metadata[0].fingerprint.type[
        'type/Number'
      ].avg;
    const mintRevenueLastMonthResponse = await axios.get(
      `${BASE_URL}/card/149`,
      AUTH_HEADERS
    );
    const mintRevenueLastMonthUSD =
      mintRevenueLastMonthResponse.data.result_metadata[0].fingerprint.type[
        'type/Number'
      ].avg;
    const secondaryRevenueResponse = await axios.get(
      `${BASE_URL}/card/137`,
      AUTH_HEADERS
    );
    const secondaryRevenueUSD =
      secondaryRevenueResponse.data.result_metadata[0].fingerprint.type[
        'type/Number'
      ].avg;
    const secondaryRevenueLastMonthResponse = await axios.get(
      `${BASE_URL}/card/147`,
      AUTH_HEADERS
    );
    const secondaryRevenueLastMonthUSD =
      secondaryRevenueLastMonthResponse.data.result_metadata[0].fingerprint
        .type['type/Number'].avg;
    const iceUpgradesRevenueResponse = await axios.get(
      `${BASE_URL}/card/141`,
      AUTH_HEADERS
    );
    const iceUpgradesRevenueUSD =
      iceUpgradesRevenueResponse.data.result_metadata[0].fingerprint.type[
        'type/Number'
      ].avg;
    const iceUpgradesRevenueLastMonthResponse = await axios.get(
      `${BASE_URL}/card/148`,
      AUTH_HEADERS
    );
    const iceUpgradesRevenueLastMonthUSD =
      iceUpgradesRevenueLastMonthResponse.data.result_metadata[0].fingerprint
        .type['type/Number'].avg;
    const activationRevenueResponse = await axios.get(
      `${BASE_URL}/card/145`,
      AUTH_HEADERS
    );
    const activationRevenueUSD =
      activationRevenueResponse.data.result_metadata[0].fingerprint.type[
        'type/Number'
      ].avg;
    const activationRevenueLastMonthResponse = await axios.get(
      `${BASE_URL}/card/151`,
      AUTH_HEADERS
    );
    const activationRevenueLastMonthUSD =
      activationRevenueLastMonthResponse.data.result_metadata[0].fingerprint
        .type['type/Number'].avg;
    const latestTreasuryBalance = await dbMongo.findLatestTreasuryBalance();
    const json_data = {
      breakdownAllTime: {
        mintRevenue: mintRevenueUSD,
        secondaryRevenue: secondaryRevenueUSD,
        iceUpgradesRevenue: iceUpgradesRevenueUSD,
        activationRevenue: activationRevenueUSD,
      },
      breakdownLastMonth: {
        mintRevenue: mintRevenueLastMonthUSD,
        secondaryRevenue: secondaryRevenueLastMonthUSD,
        iceUpgradesRevenue: iceUpgradesRevenueLastMonthUSD,
        activationRevenue: activationRevenueLastMonthUSD,
      },
      treasuryBalance: latestTreasuryBalance.totalBalanceUSD,
      totalLiquidityProvided: latestTreasuryBalance.totalLiquidityProvided,
      dgBalance:
        latestTreasuryBalance.dgBalance +
        latestTreasuryBalance.vestedDgBalance * 1000,
      daiBalance: latestTreasuryBalance.daiBalance,
      ethBalance: latestTreasuryBalance.ethBalance,
      iceBalance: latestTreasuryBalance.iceBalance,
      manaBalance: latestTreasuryBalance.manaBalance,
      decentralandLandUSD: latestTreasuryBalance.totalLandUSD,
      totalMaticUSD: latestTreasuryBalance.totalMaticUSD,
      totalIceUsdcLPBalance: latestTreasuryBalance.totalIceUsdcLPBalance,
      totalDGXDgLPBalance: latestTreasuryBalance.totalDGXDgLPBalance,
      totalDGMaticLPBalance: latestTreasuryBalance.totalDGMaticLPBalance,
      totalDgEthUniswapBalance: latestTreasuryBalance.totalDgEthUniswapBalance,
      erc20BalanceUSD:
        latestTreasuryBalance.totalDgWalletUSD +
        latestTreasuryBalance.totalGameplayUSD,
    };
    res.status(200).send(json_data);
    return;
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    return;
  }
});

export default router;
