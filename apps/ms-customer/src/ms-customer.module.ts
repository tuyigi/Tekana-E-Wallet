import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Customer } from './modules/customer/entities/customer.entity';
import { CustomerModule } from './modules/customer/customer.module';
import { RedisModule } from './common/redis-caching/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST_MS_CUSTOMER,
      port: parseInt(process.env.DB_PORT_MS_CUSTOMER),
      database: process.env.DB_NAME_MS_CUSTOMER,
      username: process.env.DB_USER_MS_CUSTOMER,
      password: process.env.DB_PASSWORD_MS_CUSTOMER,
      entities: [Customer],
      synchronize: true,
      logging: true,
    }),
    CustomerModule,
    RedisModule,
  ],
})
export class MsCustomerModule {}
