import express from 'express';
import { bulkUndelegateUsers } from '../db/dbMongo';
const dbMongo = require('../db/dbMongo');

const router = express.Router();

router.post('/ipbanwave', async (req, res) => {
  try {
    const addresses = [];
    const lowercaseAddresses = addresses.map((el) => el.toLowerCase());
    await dbMongo.bulkInsertBannedUsers(lowercaseAddresses);
    await bulkUndelegateUsers(lowercaseAddresses);
    res.send({
      response_type: 'in_channel',
      mrkdwn: true,
      text: `Ban wave complete! ${addresses.length} addresses have been banned and queued for undelegation.`,
    });
  } catch (err) {
    res.send({
      response_type: 'in_channel',
      mrkdwn: true,
      text: `*Error:* ${err.message}`,
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
