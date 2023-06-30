import express from 'express';
import { MobileHelper } from '../modules/ice/mobileHelper';
import { query, body, validationResult } from 'express-validator';
import { redis } from '../modules/redis';
import { logger } from '../modules/logger';

const router = express.Router();

const mobileHelper = new MobileHelper();

router.post(
  '/setChipsBalance',
  body('playerAddress').notEmpty().isEthereumAddress(),
  body('newBalance').notEmpty().isInt({ min: 0 }),
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newScore = await mobileHelper.setChipsBalance(
      req.body.playerAddress,
      Number(req.body.newBalance)
    );

    res.send({ newScore });
  }
);

router.get(
  '/getChipsBalanceAndScore',
  query('address').notEmpty().isEthereumAddress(),
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = await mobileHelper.getChipsBalanceAndScore(
      (req.query as any).address
    );

    res.send(data);
  }
);

router.post(
  '/checkInPlayer',
  body('playerAddress').notEmpty().isEthereumAddress(),
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // This is called when the user checks in to the ICE daily challenge for the day
    let jsonData = { status: false, result: {} };

    const address = req.body.playerAddress.toLowerCase();

    const isAlreadyCheckedIn = await redis.sismember(
      mobileHelper.getCheckedInUsersKeyName('today'),
      address
    );

    if (!isAlreadyCheckedIn) {
      try {
        const checkInData = await mobileHelper.takeWearableSnapshot(address);
        await redis.sadd(
          mobileHelper.getCheckedInUsersKeyName('today'),
          address
        );
        jsonData.status = true;
        jsonData.result = checkInData;
      } catch (e) {
        logger.log(`Error checking in user ${address}: ${e}`);

        jsonData.status = false;
        jsonData.result = `Error checking in user ${address}: ${e}`;
      }
    } else {
      jsonData.status = false;
      jsonData.result = 'Already checked in';
    }

    res.send(jsonData);
  }
);

router.get(
  '/getCheckInData',
  query('address').notEmpty().isEthereumAddress(),
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const checkInData = await mobileHelper.getCheckInData(
      (req.query as any).address
    );

    res.send(checkInData);
  }
);

router.get(
  '/getGameplayStats',
  query('address').notEmpty().isEthereumAddress(),
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let jsonData = { status: false, result: {} };

    const address = (req.query as any).address.toLowerCase();

    try {
      const gameplayStats = await mobileHelper.getGameplayStats(address);
      jsonData.status = true;
      jsonData.result = gameplayStats;
    } catch (e) {
      jsonData.status = false;
      jsonData.result = `Error grabbing gameplay stats: ${e.message}`;
    }

    res.send(jsonData);
  }
);

router.post(
  '/updateChallengeProgress',
  body('playerAddress').notEmpty().isEthereumAddress(),
  body('challengeName').notEmpty().isString(),
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // this is called by the 2D Poker server after each hand is finished
    // this updates the daily challenge progress for each user in the hand
    let jsonData = { status: false, result: {} };

    const address = req.body.playerAddress.toLowerCase();
    const challengeName = req.body.challengeName;

    try {
      const gameplayStats = await mobileHelper.matchAndIncrementChallenge(
        challengeName,
        address
      );

      if (gameplayStats) {
        jsonData.status = true;
        jsonData.result = gameplayStats;
      } else {
        jsonData.status = false;
        jsonData.result = 'Challenge not applicable';
      }
    } catch (e) {
      jsonData.status = false;
      jsonData.result = `Error updating challenge progress: ${e.message}`;
    }

    res.send(jsonData);
  }
);

router.post(
  '/resetCheckIn',
  async (req: express.Request, res: express.Response) => {
    let jsonData = { status: false, result: '' };
    try {
      const address = (req.body as any).address.toLowerCase();
      await mobileHelper.resetCheckIn(address);
      jsonData.status = true;
      jsonData.result = `Successfully reset check in data for ${address}`;
    } catch (e) {
      jsonData.result = `Error resetting check in data: ${e}`;
    }
    res.send(jsonData);
  }
);

export default router;
