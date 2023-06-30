'use strict';
const Analytics = require('analytics-node');
const analytics = new Analytics('OrHyO2XSTZJ6f0KXcojtAB4kyScvZn8B');
const express = require('express');
const axios = require('axios');
const AbortController = require('abort-controller');
const router = express.Router();
const dbMongo = require('../db/dbMongo');
const {
  api,
  checkCompetitionActiveStatus,
  getCompetitionPeriod,
} = require('../modules/common');
const sleep = require('sleep-promise');
const { redis } = require('../modules/redis');
const { PARCELS_DATA } = require('../modules/parcelsConstants');
import { logger } from '../modules/logger';
const schedule = require('node-schedule');

async function getAllUrls(serverRealmURLMapping) {
  // get status from DCL in parallel, with timeout
  let timeouts = [];
  for (let i = 0; i < serverRealmURLMapping.length; i++) {
    timeouts.push([
      setTimeout(() => {
        timeouts[i][1].abort();
      }, 2000),
      new AbortController(),
    ]);
  }
  try {
    const data = await Promise.all(
      serverRealmURLMapping.map((serverRealm, index) => {
        return axios
          .get(serverRealm.url, { signal: timeouts[index][1].signal })
          .then((response) => response.data)
          .catch((error) => {
            if ((error.type = 'aborted')) {
              console.warn('Failed to fetch:', serverRealm.url);
            } else {
              logger.log('Error: ', error);
            }
          });
      })
    );
    return data;
  } catch (error) {
    logger.log('Error: ', error);
  }
}

export async function getPlayerCount(forceRefresh = false) {
  let data = await redis.get('playerCountData');
  try {
    // check if we have a cached version of the player count data
    if (data && data !== '' && !forceRefresh) {
      data = JSON.parse(data);
      if (!global.playerCountData) {
        global.playerCountData = data;
      }
      return data;
    }

    data = {};

    while (!global.catalystDomainToServerNameMap) {
      logger.log('catalystDomainToServerNameMap is empty, waiting 1 second to retry...')
      await sleep(1000);
    }

    const serverRealmURLMapping = Object.keys(global.catalystDomainToServerNameMap).map(
      (domain) => ({
        url: `${domain}/comms/peers`,
        serverName: global.catalystDomainToServerNameMap[domain],
      })
    );

    // grab player data for each realm; includes addresses / positions
    let realmData: any = await getAllUrls(serverRealmURLMapping);

    for (let scene of PARCELS_DATA) {
      let totalAddressList = [];
      let totalRealmData = [];

      for (let i = 0; i < serverRealmURLMapping.length; i++) {
        let realmAddresses = [];
        try {
          for (let player of realmData[i].peers) {
            if (isArrayInArray(scene.parcels, player['parcel'])) {
              totalAddressList.push(player['address']);
              realmAddresses.push(player['address']);
            }
          }
        } catch (error) {}
        if (realmAddresses.length > 0) {
          const el = totalRealmData.find(
            (el) => el.serverName === serverRealmURLMapping[i].serverName
          );
          if (el) {
            // element with this serverName already exists in totalRealmData
            el.playerCount += realmAddresses.length;
            el.addresses.push(...realmAddresses);
          } else {
            totalRealmData.push({
              realm: `${serverRealmURLMapping[i].serverName}`,
              playerCount: realmAddresses.length,
              addresses: realmAddresses,
            });
          }
        }
      }
      data[scene.name] = {
        totalPlayers: totalAddressList.length,
        serverRealms: totalRealmData.sort((a, b) =>
          a.playerCount < b.playerCount ? 1 : -1
        ),
        totalAddresses: totalAddressList,
        parcels: scene.parcels[0],
      };
    }
  } catch (e) {
    logger.log(e);
  }
  await redis.set('playerCountData', JSON.stringify(data), 'ex', 2 * 60);

  // send total player count to Segment
  let totalPlayerCount = 0;
  for (let scene of Object.keys(data)) {
    totalPlayerCount += data[scene].totalPlayers;
  }

  analytics.track({
    userId: 'API',
    event: 'playerCount',
    properties: {
      count: totalPlayerCount,
    },
  });

  // Store data in global state
  global.playerCountData = data;

  // logger.debug(
  //   `Most Active ICE Realm - Stronghold: ${global.playerCountData?.stronghold?.serverRealms[0]?.realm} - ${global.playerCountData?.stronghold?.serverRealms[0]?.playerCount} players online`
  // );

  // logger.debug(
  //   `Most Active ICE Realm - DEXT: ${global.playerCountData?.dext?.serverRealms[0]?.realm} - ${global.playerCountData?.dext?.serverRealms[0]?.playerCount} players online`
  // );

  // logger.debug(
  //   `Most Active ICE Realm - Chateau: ${global.playerCountData?.chateau?.serverRealms[0]?.realm} - ${global.playerCountData?.chateau?.serverRealms[0]?.playerCount} players online`
  // );

  // logger.debug(
  //   `Most Active ICE Realm - Osiris: ${global.playerCountData?.osiris?.serverRealms[0]?.realm} - ${global.playerCountData?.osiris?.serverRealms[0]?.playerCount} players online`
  // );

  return data;
}

const playerCountDataTTL = 1 * 60; // refresh cache in background every X seconds
setInterval(async () => {
  let ttl = await redis.ttl('playerCountData');
  if (ttl < playerCountDataTTL / 2) {
    // increase expiration while data is being pulled to prevent other API instances from also running this
    await redis.expire('playerCountData', playerCountDataTTL);
    getPlayerCount(true);
  }
}, (playerCountDataTTL * 1000) / 2);
getPlayerCount();

router.get('/getPlayerCount', async function (req: any, res: any) {
  try {
    await getPlayerCount(); // This sets global.playerCountData
    res.send(global.playerCountData);
  } catch (err) {
    logger.log(`Error: ${err}`);
  }
});

function isArrayInArray(parentArray, childArray) {
  const result = parentArray.find(function (arr) {
    return JSON.stringify(arr) === JSON.stringify(childArray);
  });
  return result != null;
}

router.get('/sendLocation', async (req: any, res: any) => {
  const { address, land, realm } = req.query;

  logger.log(
    `User Location Changed => Address: ${address}, Land: ${land}, Realm: ${realm}`
  );

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // send user's location data to Segment analytics
  analytics.track({
    userId: address,
    event: 'Player Location',
    properties: {
      land: land,
      realm: realm,
    },
  });

  res.send({ status: true });
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// player login from Decentraland client
router.get('/dclLogin', async (req: any, res: any) => {
  let address = req.query.address.toLowerCase();
  let ipAddress = req.headers['true-client-ip'] ?? req.clientIp;
  let jsonData = { status: false, data: null };

  logger.debug(
    `New client connected with this ip and address -> ${ipAddress}, ${address}`
  );
  try {
    logger.debug('Checking MongoDB for user: ', address);
    let userdata = await dbMongo.findUser(address);

    if (userdata) {
      let shouldUpdateDB = false;

      // update IP address
      if (ipAddress !== userdata.ipAddress) {
        userdata.ipAddress = ipAddress;
        shouldUpdateDB = true;
      }

      // check for avatar profile pic change
      let profile;
      logger.debug(
        'Checking for avatar profile pic change for user: ',
        address
      );
      try {
        profile = await api(
          `https://peer-lb.decentraland.org/lambdas/profile/${address}`
        );
      } catch {
        profile = await api(
          `https://peer.decentral.io/lambdas/profile/${address}`
        );
      }
      logger.debug(
        'Finished checking for avatar profile pic change for user: ',
        address
      );

      if (
        profile.avatars.length > 0 &&
        profile.avatars[0].ethAddress &&
        profile.avatars[0].avatar.snapshots.face256
      ) {
        let avatarImageID = profile.avatars[0].avatar.snapshots.face256
          .split('/')
          .slice(-1)[0];
        if (avatarImageID != userdata.avatarImageID) {
          userdata.avatarImageID = avatarImageID;

          // update cache
          logger.debug('Updating Redis Cache for user: ', address);
          await redis.hset(
            `userAddresses:${address}`,
            'avatarImageID',
            avatarImageID
          );
          shouldUpdateDB = true;
          logger.debug('Finished updating Redis Cache for user: ', address);
        }
      }

      if (shouldUpdateDB) {
        logger.debug('Updating MongoDB for user: ', address);
        await dbMongo.updateUser(address, userdata);
        logger.debug('Finished updating MongoDB for user: ', address);
      }

      const isBanned = await dbMongo.findBannedUser(address) || await redis.get(`bannedUsers:${address}`);
      userdata.isBanned = !!isBanned;

      jsonData['status'] = true;
      jsonData['data'] = userdata;

      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // send indentify data to Segment analytics
      analytics.identify({
        userId: address,
        traits: {
          userStatus: userdata.verifyStep,
          email: userdata.email,
          source: 'dclLogin',
          avatarName: userdata.avatarName,
          ipAddress: ipAddress,
        },
      });
    } else {
      res.status(401).send({ error: 'User does not exist' });
      return;
    }
  } catch (e) {
    logger.log('/dclLogin failure: ' + e);
    res.status(401).send({ error: 'Something went wrong' });
    return;
  }

  res.send(jsonData);
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// register new user
router.get('/dclRegister', async function (req: any, res: any) {
  let address = req.query.address.toLowerCase();
  let ipAddress = req.headers['true-client-ip'] ?? req.clientIp;
  let jsonData = { status: false };

  if (!address || address.slice(0, 2) !== '0x') jsonData['status'] = false;
  else {
    try {
      const userData = await dbMongo.findUser(address);
      if (userData) {
        logger.debug(`User ${address} already exists`);
        jsonData['status'] = false;
      } else {
        // insert user's wallet address and IP address into database
        await dbMongo.insertUser({
          address: address,
          ipAddress: ipAddress,
        });

        logger.log(
          `New client registered with this ip and address -> ${ipAddress}, ${address}`
        );

        jsonData['status'] = true;

        // send identify data to Segment analytics
        analytics.identify({
          userId: address,
          traits: {
            userStatus: 4,
            email: '',
            source: 'dclRegister',
            avatarName: '',
            ipAddress: ipAddress,
          },
        });
      }
    } catch (e) {
      logger.log('/dclRegister failure: ' + e);

      jsonData['status'] = false;
    }
  }

  res.send(jsonData);
});

// Grab audio stream data; checked by clients when connecting to DCL
// DEPRECATED; WILL BE REMOVED SOON
router.get('/audioStreamStatus', async (req: any , res: any) => {
  const findAudioStreamStatus = await dbMongo.findAudioStreamStatus();
  res.send(findAudioStreamStatus);
});

// Grab video stream data; checked by clients when connecting to DCL
// DEPRECATED; WILL BE REMOVED SOON
router.get('/videoStreamStatus', async (req: any, res: any) => {
  const findVideoStreamStatus = await dbMongo.findVideoStreamStatus();
  res.send(findVideoStreamStatus);
});

// Grab active POAP data
// DEPRECATED; WILL BE REMOVED SOON
router.get('/getActivePoap', async (req: any, res: any) => {
  const activePoap = await dbMongo.findActivePoap();
  res.send(activePoap);
});

// Grab NFT screen data for Tominoya
// DEPRECATED; WILL BE REMOVED SOON
router.get('/getNftScreen', async (req: any, res: any) => {
  const nftScreen = await dbMongo.findNftScreen();
  res.send(nftScreen);
});

router.get('/checkCompetitionActiveStatus', async function (req: any, res: any) {
  let activeStatus = await checkCompetitionActiveStatus();
  res.send(activeStatus);
});

router.get('/competitionPeriod', async function (req: any, res: any) {
  let { competitionStart, competitionEnd, mode } = await getCompetitionPeriod();
  res.send({
    start: competitionStart.toISOString(),
    end: competitionEnd.toISOString(),
    mode: mode.toLowerCase() === 'crypto' ? 'crypto' : 'play',
  });
});

// Grab DCL client environment configuration
router.get('/getClientConfig', async (req: any, res: any) => {
  const sceneName = req.query.sceneName;
  const clientConfig = await dbMongo.findClientConfig(
    sceneName ? sceneName : 'tominoya'
  );
  const rpcProvider = await dbMongo.findActiveRPC();

  if (!clientConfig) {
    res.send({ error: 'Scene does not exist' });
    return;
  }

  const data = {
    ...clientConfig,
    rpcProvider: {
      matic: rpcProvider.matic.dclClient,
      bsc: rpcProvider.bsc.client,
    },
  };

  res.send(data);
});

router.get('/getEvents', async (req: any, res: any) => {
  try {
    let dclEventsData = await redis.get('dclEventsData');
    if (dclEventsData === null) {
      dclEventsData = {};
    } else {
      dclEventsData = JSON.parse(dclEventsData);
    }
    res.send(dclEventsData);
  } catch (err) {
    logger.log(`Error: ${err}`);
  }
});

async function getDCLEventsData() {
  try {
    const data = await api('https://events.decentraland.org/api/events/');
    await redis.set('dclEventsData', JSON.stringify(data));
    logger.log('Fetched DCL events data');
  } catch (err) {
    logger.log('Error fetching DCL events data: ', err.response.statusText);
  }
}

// refresh DCL events data every 6 hours
// use Redis NX flag to prevent rate limiting when multiple API instances are running
schedule.scheduleJob('0 */6 * * *', async () => {
  const canExecute = await redis.set(
    'dclEventsDataRefresh',
    true,
    'EX',
    60 * 30,
    'NX'
  );
  if (canExecute) {
    getDCLEventsData();
  }
});

// Error handler
router.use(function (err, req, res, next) {
  if (err) {
    res.status(500).send(err);
  }
});

export default router;