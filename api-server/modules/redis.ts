import Redis from 'ioredis';
import sleep from 'sleep-promise';
import { logger } from './logger';
import keys from '../config/keys';

class RedisClient {
  redis: Redis.Redis;
  pub: Redis.Redis;
  sub: Redis.Redis;

  constructor() {
    this.connectToRedisCache();
  }

  // Catch any errors on connection to mongodb, retry after delay to prevent API server from crashing.
  async connectToRedisCache() {
    try {
      this.redis = new Redis(keys.REDIS_CONNECTION_STRING);
      this.pub = new Redis(keys.REDIS_CONNECTION_STRING);
      this.sub = new Redis(keys.REDIS_CONNECTION_STRING);

      this.sub.subscribe('socket', (err, count) => {
        if (err) {
          logger.log('Failed to subscribe: %s', err.message);
        } else {
          logger.log(
            `[REDIS] Subscribed successfully! This client is currently subscribed to ${count} channels.`
          );
        }
      });

      this.sub.on('message', (channel, message) => {
        logger.log(`[REDIS] Received ${message} from ${channel}`);
      });
    } catch (err) {
      logger.log(err);

      // Wait X seconds and try again if any error occurred
      await sleep(1000 * 10);
      this.connectToRedisCache();
    }
  }
}

export const redisClient = new RedisClient();
export const redis = redisClient.redis;
export const pub = redisClient.pub;
export const sub = redisClient.sub;
