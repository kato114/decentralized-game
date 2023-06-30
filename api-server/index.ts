import { initGlobals } from './modules/global';
import { createServer } from 'http';
import express from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import cors from 'cors';
import orderRouter from './routes/orderRouter';
import adminRouter, { updateGameConstants } from './routes/adminRouter';
import authenticationRouter from './routes/authenticationRouter';
import playerRouter from './routes/playerRouter';
import addressRouter from './routes/addressRouter';
import iceRouter from './routes/iceRouter';
import xdgRouter from './routes/xdgRouter';
import mobileRouter from './routes/mobileRouter';
import slackRouter from './routes/slackRouter';
import requestIp from 'request-ip';
import useragent from 'express-useragent';
import jwt from 'jsonwebtoken';
import { getSecret } from './modules/common';
import { buildLeaderboard } from './modules/leaderboard';
import { updateServerList } from './modules/updateServerList';
import { web3Handler } from './modules/web3';
import { updateContracts } from './db/dbContracts';
import { logger } from './modules/logger';
import { redis } from './modules/redis';
import swaggerUi from 'swagger-ui-express';
import { slackPermissionHandler } from './modules/slackPermissionHandler';
const swaggerDefinition = require('./documentation');

const PORT = process.env.PORT || 5000;
const app = express();

initGlobals();

// Disable debug logging in production, unless IS_DEBUG_ENABLED is set to true. If the string value is ‘true’, then boolValue will be true, else a false.
if (process.env.NODE_ENV === 'production' && !process.env.IS_DEBUG_ENABLED) {
  const methods = ['debug'];
  for (let i = 0; i < methods.length; i++) {
    console[methods[i]] = function () {};
  }
}

// Retrieve the CORS domains first.
const startServer = async () => {
  // update Server List
  await updateServerList();

  await updateGameConstants();

  // update contract addresses
  await updateContracts();

  // initialize web3 contracts
  await web3Handler.init();

  if (process.env.NODE_ENV !== 'localhost') {
    // Clear Redis cache upon startup
    await redis.set('gameConstants', null);
  }

  // allow cross-origin resource sharing
  const corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    corsOptions = {
      origin: global.domainList,
      credentials: true,
    }; // disable CORS for this request
    callback(null, corsOptions); // callback expects two parameters: error and options
  };

  const corsOptions = {
    origin: global.domainList,
    methods: 'GET,POST,PATCH,DELETE', // 'GET,HEAD,PUT,PATCH,POST,DELETE'
    credentials: true,
    preflightContinue: false,
    maxAge: 600,
  };

  app.options('*', cors(corsOptions));

  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });
  app.use(requestIp.mw());
  app.use(useragent.express());

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // API rate limiting and authentication
  const rateLimiter = new RateLimiterMemory({
    points: 100, // number of points or requests
    duration: 20, // duration in seconds
  });

  // read-only endpoints; these can skip auth token requirement
  const RATE_LIMIT_EXCEPTIONS = ['/ice/getMetadata', '/ice/secondaryRevenue'];

  // Endpoints that don't require an authorization token
  const AUTH_EXCEPTIONS = [
    '/admin/ping',
    '/admin/serverList',
    '/admin/healthCheck',
    '/admin/getUser',
    '/admin/getDGPrice',
    '/admin/getTotalRecords',
    '/admin/getTreasuryBalanceHistory',
    '/admin/treasuryDetails',
    '/admin/getPokerHandHistory',
    '/admin/getAppConfig',
    '/admin/getGameConstants',
    '/admin/getFrontPageStats',
    '/admin/getJobListings',
    'admin/temporarilyBlockUser',
    'admin/getTemporarilyBlockedUser',
    '/players/dclRegister',
    '/players/dclLogin',
    '/players/authorizeTreasury',
    '/players/getPlayerCount',
    '/players/getEvents',
    '/players/getClientConfig',
    '/authentication/getAuthToken',
    '/authentication/getWebAuthToken',
    '/ice/getMetadata',
    '/ice/delegateInfo',
    '/ice/getUnclaimedRewardsAmount',
    '/ice/getRewardsConfig',
    '/ice/getCollectionMetadata',
    '/ice/play',
    '/ice/getWearableInventory',
    '/ice/fetchWearableCheckinStatus',
    '/ice/getGameplayReports',
    '/ice/getDelegationBreakdown',
    'ice/getAccessoryMarketplace',
    '/ice/secondaryRevenue',
    '/xdg/getUnclaimedRewardsAmount',
    '/mobile/getChipsBalanceAndScore',
    '/mobile/getCheckInData',
    '/mobile/getGameplayStats',
    '/mobile/getLeaderboardData',
    '/mobile/generateAvatarImage',
  ];

  const rateLimiterMiddleware = (req, res, next) => {
    if (
      RATE_LIMIT_EXCEPTIONS.some((exception) =>
        req.originalUrl.includes(exception)
      )
    ) {
      next();
    } else {
      rateLimiter
        .consume(req.clientIp)
        .then(() => {
          next();
        })
        .catch(() => {
          res.status(409).send(`Too many requests: ${req.method}`);
          logger.log(
            `Too many requests from ${req.clientIp}: ${req.method} ${req.originalUrl}`
          );
        });
    }
  };

  const auth = async function (req, res, next) {
    if (req.originalUrl.indexOf('slack') !== -1) {
      slackPermissionHandler(req, res, next);
    } else if (
      req.headers['authorization'] &&
      !req.headers['authorization'].includes('undefined') &&
      !req.query.address &&
      !req.body.address
    ) {
      let jwt_access_token_secret = await getSecret();
      const authHeader = req.headers['authorization'];
      // "Bearer " prefix is optional
      const token = (authHeader && authHeader.split(' ')[1]) || authHeader;
      if (token == null) {
        res.status(403);
        res.send({
          isTokenValid: false,
          status: `No authentication token received`,
        });
        return;
      }

      jwt.verify(token, jwt_access_token_secret, (err, payload) => {
        if (err) {
          res.status(403);
          res.send({
            isTokenValid: false,
            status: `Expired or invalid token`,
          });
          return;
        }
        //we reset the ratelimiter for unit testing
        if (payload.unitTesting) {
          rateLimiter.delete(req.clientIp);
        }
        if (req.method === 'GET') {
          if (payload.address) {
            req.query.address = payload.address;
          }
        } else if (
          req.method === 'POST' ||
          req.method === 'PATCH' ||
          req.method === 'DELETE'
        ) {
          if (payload.address) {
            req.body.address = payload.address;
          }
        }
        next();
      });
    } else if (
      AUTH_EXCEPTIONS.some((exception) => req.originalUrl.includes(exception))
    ) {
      next();
    } else {
      res.status(403);
      res.send({
        isTokenValid: false,
        status: `Invalid request, missing headers or other error`,
      });
      return;
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // REST API endpoints and middleware
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));
  app.use(
    '/order',
    [cors(corsOptionsDelegate), rateLimiterMiddleware, auth],
    orderRouter
  );
  app.use(
    '/admin',
    [cors(corsOptionsDelegate), rateLimiterMiddleware, auth],
    adminRouter
  );
  app.use(
    '/authentication',
    [cors(corsOptionsDelegate), rateLimiterMiddleware, auth],
    authenticationRouter
  );
  app.use(
    '/ice',
    [cors(corsOptionsDelegate), rateLimiterMiddleware, auth],
    iceRouter
  );
  app.use(
    '/xdg',
    [cors(corsOptionsDelegate), rateLimiterMiddleware, auth],
    xdgRouter
  );
  app.use('/mobile', [cors(corsOptionsDelegate), auth], mobileRouter);
  app.use(
    '/players',
    [cors(corsOptionsDelegate), rateLimiterMiddleware, auth],
    playerRouter
  );
  app.use(
    '/slack',
    [cors(corsOptionsDelegate), rateLimiterMiddleware, auth],
    slackRouter
  );
  app.get(
    '/addresses',
    [cors(corsOptionsDelegate), rateLimiterMiddleware, auth],
    addressRouter
  );

  // check to see if leaderboard exists in memory
  // if not, leaderboard will be built
  buildLeaderboard();

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  const server = createServer(app);
  server.listen(PORT, () => logger.log(`Listening on ${PORT}`));

  process.on('unhandledRejection', (reason) => {
    logger.error('WARNING: Unhandled promise rejection:', reason);
  });
};

startServer();
