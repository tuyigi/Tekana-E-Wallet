import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CustomerModule } from './microservice_modules/customers/customer.module';
import { WalletModule } from './microservice_modules/wallets/wallet.module';
import { TransactionModule } from './microservice_modules/transactions/transaction.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
  imports: [CustomerModule, WalletModule, TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  /**
   * Configurer looger middleware
   * @param consumer
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
