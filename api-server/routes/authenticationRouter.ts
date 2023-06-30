import express from 'express';
const ethUtil = require('ethereumjs-util');
const sigUtil = require('eth-sig-util');
import jwt from 'jsonwebtoken';
import { getSecret } from '../modules/common';
import { logger } from '../modules/logger';
import { Request } from 'express';
import * as dcl from 'decentraland-crypto-middleware';

const router = express.Router();

router.get('/getWebAuthToken', async (req: any, res: any) => {
  const { address, signature, timestamp, ttl } = req.query;

  if (!address || !signature || !timestamp) {
    return res.status(401).send({ error: 'Signature verification failed' });
  }

  const msg = `Decentral Games Login\nTimestamp: ${timestamp}`;

  try {
    // perform an elliptic curve signature verification with ecrecover
    // using msg, address, and signature
    const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
    const decodedAddress = sigUtil.recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });

    // check if the address found with ecrecover matches the client's reported address
    // assign JWT
    if (decodedAddress.toLowerCase() === address.toLowerCase()) {
      const token = await getJWT(decodedAddress.toLowerCase(), ttl);
      return res.json(token);
    } else {
      return res.status(401).send({ error: 'Signature verification failed' });
    }
  } catch (e) {
    logger.log(e);
    return res.status(401).send({ error: 'Signature verification failed' });
  }
});

router.get(
  '/getAuthToken',
  dcl.express({
    expiration: 60 * 60 * 1000, // 1 hour
    onError: (err: Error) => {
      logger.error(`Error authenticating user: ${err.message}`);
      return { ok: false, message: err.message };
    },
  }),
  async (req: Request & dcl.DecentralandSignatureData, res: any) => {
    const address: string = req.auth;
    const metadata: Record<string, any> = req.authMetadata;

    const token = await getJWT(address.toLowerCase(), metadata.ttl);
    return res.send(token);
  }
);

async function getJWT(address: string, ttl: number) {
  const jwt_access_token_secret = await getSecret();

  return new Promise((resolve, reject) =>
    jwt.sign(
      { address: address },
      jwt_access_token_secret,
      {
        algorithm: 'HS256',
        expiresIn: !isNaN(ttl) ? `${ttl}h` : '7d', // allow custom TTL, or default to 7 days
      },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        if (!token) {
          return new Error('Empty token');
        }
        return resolve(token);
      }
    )
  );
}

router.post('/verifyToken', async (req: any, res: any) => {
  const jwt_access_token_secret = await getSecret();
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, jwt_access_token_secret, (err, payload) => {
    if (err) {
      res.sendStatus(403);
      res.send({
        isTokenValid: false,
        status: `Expired or invalid token for user ${payload.address}`,
      });
      return;
    }
    logger.debug(payload.address, 'successfully verified');
    res.send({
      isTokenValid: true,
      status: `Success! I see that you are user ${payload.address}`,
    });
  });
});

router.post('/extendToken', async (req: any, res: any) => {
  const jwt_access_token_secret = await getSecret();
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const ttl = req.body.ttl;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, jwt_access_token_secret, async (err, payload) => {
    if (err) return res.sendStatus(403);
    const token = await getJWT(payload.address, ttl);
    return res.json(token);
  });
});

export default router;
