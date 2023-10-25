import { Module } from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';
import { Customer } from './entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from './services/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../../common/redis-caching/redis.module';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    JwtModule.register({
      secret: 'RSSB_TESTING',
      signOptions: { expiresIn: '1d' },
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_UI,
        port: +process.env.REDIS_PORT,
      },
    }),
    BullModule.registerQueue({
      name: process.env.QUEUE_NAME,
    }),
    RedisModule,
  ],
  controllers: [CustomerController],
  providers: [JwtStrategy, JwtService, CustomerService],
})
export class CustomerModule {}
