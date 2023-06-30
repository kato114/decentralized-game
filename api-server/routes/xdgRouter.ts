import express from 'express';
import { logger } from '../modules/logger';
import { claimRewards, getUnclaimedAmount } from '../modules/xdg/xdg';

const router = express.Router();

router.get('/claimRewards', async (req, res) => {
  let jsonData = { status: false, result: '' };
  const address = req.query.address?.toString().toLowerCase();

  try {
    const txHash = await claimRewards(address);
    if (!txHash) {
      throw new Error(`No xDG drops available for ${address} to claim`);
    }
    jsonData['status'] = true;
    jsonData['result'] = 'giveClaimBulk transaction success';
    jsonData['txHash'] = txHash;
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

// Error handler
router.use(function (err, req, res, next) {
  if (err) {
    res.status(500).send(err);
  }
});

export default router;