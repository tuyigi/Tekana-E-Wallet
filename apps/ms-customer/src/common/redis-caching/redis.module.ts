import { redisClientFactory } from './redis.client.factory';
import { Module } from '@nestjs/common';
import { RedisService } from './services/redis.service';

@Module({
  imports: [],
  controllers: [],
  providers: [redisClientFactory, RedisService],

  exports: [RedisService],
})
export class RedisModule {}
