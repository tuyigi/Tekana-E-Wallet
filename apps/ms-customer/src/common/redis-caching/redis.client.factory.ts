import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';

/**
 * connect to Redis server :: for caching and qeuing
 */

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: () => {
    const redisInstance = new Redis({
      host: process.env.REDIS_UI,
      port: +process.env.REDIS_PORT,
    });
    /**
     * throw exception if redis db is not connected successfully
     */
    redisInstance.on('error', (e) => {
      console.log('REDIS SERVER NOT CONNECTED');
      throw new Error(`Redis connection failed: ${e}`);
    });
    console.log('REDIS SERVER CONNECTED');
    return redisInstance;
  },
  inject: [],
};
