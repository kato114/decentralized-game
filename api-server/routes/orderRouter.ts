'use strict';
const Analytics = require('analytics-node');
const analytics = new Analytics('OrHyO2XSTZJ6f0KXcojtAB4kyScvZn8B');
const express = require('express');
const router = express.Router();
const dbMongo = require('../db/dbMongo');
const json2csv = require('json2csv').parse;
import { prepareTransaction } from '../modules/dg/assignPlayer';
import { logger } from '../modules/logger';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// send user's status to client and update user's IP address in database
router.post('/webLogin', async function (req, res) {
  let address = req.body.address.toLowerCase();
  let ipAddress = req.headers['true-client-ip'] ?? req.clientIp;
  let jsonData = { status: undefined };

  try {
    let userdata = await dbMongo.findUser(address);

    if (userdata) {
      if (ipAddress !== userdata.ipAddress) {
        userdata.ipAddress = ipAddress;
        await dbMongo.updateUser(address, userdata);
      }

      jsonData['status'] = userdata.verifyStep;

      logger.log(
        `Client logged in with this IP and wallet address -> ${ipAddress}, ${address}`
      );

      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // send indentify data to Segment analytics
      analytics.identify({
        userId: address,
        traits: {
          userStatus: userdata.verifyStep,
          email: userdata.email,
          source: 'webLogin',
          avatarName: userdata.avatarName,
          ipAddress: ipAddress,
        },
      });
    } else {
      logger.log(`/webLogin error: User ${address} undefined, IP is ${ipAddress}`);

      jsonData['status'] = -1;
    }
  } catch (e) {
    logger.log(`/webLogin failure: ${e}`);

    jsonData['status'] = -1;
  }

  res.send(jsonData);
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// register new user and assign user to affiliate (if affiliate parameter present)
router.post('/webRegister', async function (req, res) {
  let address = req.body.address;
  let ipAddress = req.headers['true-client-ip'] ?? req.clientIp;
  let affiliate = req.body.affiliate;
  let jsonData = { status: false };

  if (!address || address.slice(0, 2) !== '0x') jsonData['status'] = false;
  else {
    try {
      address = address.toLowerCase();

      const userData = await dbMongo.findUser(address);
      if (userData) {
        throw new Error(`User ${address} already exists`);
      }

      // insert user's wallet address and IP address into database
      await dbMongo.insertUser({
        address: address,
        ipAddress: ipAddress,
      });

      logger.log(
        `New client registered with this IP and wallet address -> ${ipAddress}, ${address}`
      );

      // assign new user to affiliate (playersList) for DG rewards
      if (affiliate !== '') {
        prepareTransaction(affiliate, address);
      }

      jsonData['status'] = true;

      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // send indentify data to Segment analytics
      analytics.identify({
        userId: address,
        traits: {
          userStatus: 4,
          email: '',
          source: 'webRegister',
          avatarName: '',
          ipAddress: ipAddress,
        },
      });
    } catch (e) {
      logger.log('/webRegister failure: ' + e);

      jsonData['status'] = false;
    }
  }

  res.send(jsonData);
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// find user info by its wallet address and send result.

router.post('/getUser', async function (req, res) {
  var address = req.body.address.toLowerCase();
  var json_data = {
    status: 'ok',
    result: '',
  };
  if (!address) json_data['result'] = 'false';
  else {
    try {
      var userdata = await dbMongo.findUser(address);
      if (userdata) json_data['result'] = userdata;
      else json_data['result'] = 'false';
    } catch (e) {
      logger.log(e);
      json_data['status'] = 'fail';
    }
  }
  res.send(json_data);
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// save user's transaction history (deposit/withdrawal).

router.post('/updateHistory', async function (req, res) {
  var address = req.body.address.toLowerCase();
  var txid = req.body.txHash;
  var amount = req.body.amount;
  var type = req.body.type;
  var status = req.body.state;
  var step = req.body.step || 0;
  step = parseInt(step);
  var json_data = {
    status: 'ok',
    result: '',
  };
  if (!address) json_data['result'] = 'false';
  else {
    try {
      var txdata = await dbMongo.findTransaction(txid);

      if (txdata) {
        await dbMongo.updateTransaction(txid, {
          address,
          txid,
          amount,
          type,
          status,
          step,
        });
        json_data['result'] = 'true';
      } else {
        txdata = await dbMongo.insertTransaction({
          address,
          txid,
          amount,
          type,
          status,
          step,
        });
        if (txdata) json_data['result'] = 'true';
        else json_data['result'] = 'false';
      }

      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // send transaction history data to Segment analytics
      analytics.track({
        userId: address,
        event: type,
        properties: {
          amount: amount,
          txid: txid,
          status: status,
          step: step,
        },
      });
    } catch (e) {
      logger.log(e);
      json_data['status'] = 'fail';
    }
  }

  res.send(json_data);
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// get transaction history by address, limit and page num.

router.post('/getHistory', async function (req, res) {
  var address = req.body.address.toLowerCase();
  var limit = 100;
  var page = req.body.page;
  var json_data = {
    status: 'ok',
    result: '',
  };
  if (!address) json_data['result'] = 'false';
  else {
    try {
      let currentDate = new Date();
      let indexData;
      let txdatas;
      if (!page || page == 1) {
        txdatas = await dbMongo.findAllTransaction({ address }, { limit });
      } else {
        indexData = await dbMongo.findUserIndexing(address, page - 1);
        if (indexData)
          txdatas = await dbMongo.findAllTransaction(
            { address, _id: { $lt: indexData.historyID } },
            { limit }
          );
      }
      if (txdatas && txdatas.length) {
        indexData = await dbMongo.findUserIndexing(address, page);
        if (!indexData)
          await dbMongo.insertUserIndexing({
            address,
            page,
            historyID: txdatas[txdatas.length - 1]._id,
          });
        else
          await dbMongo.updateUserIndexing(address, page, {
            historyID: txdatas[txdatas.length - 1]._id,
          });
        for (let i = 0; i < txdatas.length; i++) {
          if (txdatas[i].type != 'Withdraw') continue;
          if (
            parseInt(txdatas[i].step) == 1 &&
            txdatas[i].status == 'In Progress'
          ) {
            let date = new Date(txdatas[i].createdAt);
            if (
              currentDate.getTime() - date.getTime() >
              2 * 24 * 60 * 60 * 1000
            ) {
              txdatas[i].status = 'Ready';
              await dbMongo.updateTransaction(txdatas[i].txid, txdatas[i]);
            }
          } else if (
            parseInt(txdatas[i].step) == 3 &&
            txdatas[i].status == 'In Progress'
          ) {
            let date = new Date(txdatas[i].createdAt);
            if (currentDate.getTime() - date.getTime() > 15 * 60 * 1000) {
              txdatas[i].status = 'Ready';
              await dbMongo.updateTransaction(txdatas[i].txid, txdatas[i]);
            }
          }
        }
        json_data['result'] = txdatas;
      } else json_data['result'] = 'false';
    } catch (e) {
      logger.log(e);
      json_data['status'] = 'fail';
    }
  }
  res.send(json_data);
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// get game play infos by address, limit and page num.

router.post('/getPlayInfo', async function (req, res) {
  var address = req.body.address.toLowerCase();
  var limit = 100;
  var page = req.body.page;
  var json_data = {
    status: 'ok',
    result: '',
  };
  if (!address) json_data['result'] = 'false';
  else {
    try {
      let indexData;
      let playinfodatas;
      if (!page || page == 1) {
        playinfodatas = await dbMongo.findAllPlayInfos({ address }, { limit });
      } else {
        indexData = await dbMongo.findUserIndexing(address, page - 1);
        if (indexData)
          playinfodatas = await dbMongo.findAllPlayInfos(
            { address, _id: { $lt: indexData.playID } },
            { limit }
          );
      }
      if (playinfodatas && playinfodatas.length) {
        indexData = await dbMongo.findUserIndexing(address, page);
        if (!indexData)
          await dbMongo.insertUserIndexing({
            address,
            page,
            playID: playinfodatas[playinfodatas.length - 1]._id,
          });
        else
          await dbMongo.updateUserIndexing(address, page, {
            playID: playinfodatas[playinfodatas.length - 1]._id,
          });
        json_data['result'] = playinfodatas;
      } else json_data['result'] = 'false';
    } catch (e) {
      logger.log(e);
      json_data['status'] = 'fail';
    }
  }
  res.send(json_data);
});

router.get('/getPlayInfoCSV', async function (req, res) {
  const address = req.query.address.toLowerCase();
  const playInfoData = await dbMongo.findAllPlayInfosFormatted({ address });
  if (playInfoData.length > 0) {
    let renamedFields = playInfoData.map((record) => {
      record.date = record.createdAt;
      delete record.createdAt;

      record.init_tx_id = record.txid;
      delete record.txid;

      record.payout_tx_id = record.ptxid;
      delete record.ptxid;

      switch (record.gameType) {
        case 1:
          record.gameType = 'slots';
          break;
        case 2:
          record.gameType = 'roulette';
          break;
        case 4:
          record.gameType = 'blackjack';
          break;
        case 7:
          record.gameType = 'blackjack';
          break;
        case 8:
          record.gameType = 'roulette';
          break;
        case 9:
          record.gameType = 'poker';
          break;
      }
      return record;
    });
    res.setHeader(
      'Content-disposition',
      `attachment; filename=${address}_PlayHistory.csv`
    );
    res.set('Content-Type', 'text/csv');
    res.send(json2csv(renamedFields));
  } else {
    res.send({
      status: 'fail',
      result: 'No records exist for specified address',
    });
  }
});

// Error handler
router.use(function (err, req, res, next) {
  if (err) {
    res.status(500).send(err);
  }
});
export default router;
