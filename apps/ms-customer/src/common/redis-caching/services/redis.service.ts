import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

  /**
   * Get chached data
   * @param prefix
   * @param key
   */
  async get(prefix: string, key: string): Promise<string | null> {
    return this.redisClient.get(`${prefix}:${key}`);
  }

  /**
   * Cache data without expiry time
   * @param prefix
   * @param key
   * @param value
   */

  async set(prefix: string, key: string, value: string): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value);
  }

  /**
   * Delete Delete cached data
   * @param prefix
   * @param key
   */
  async delete(prefix: string, key: string): Promise<void> {
    await this.redisClient.del(`${prefix}:${key}`);
  }

  /**
   * Cache data with expiry time
   * @param prefix
   * @param key
   * @param value
   * @param expiry
   */
  async setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
  }
}
