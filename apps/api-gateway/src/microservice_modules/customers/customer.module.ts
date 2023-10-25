import { Module } from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MS_CUSTOMER_PACKAGE_NAME } from '@app/common/types/ms_customer';
import { MS_CUSTOMER } from '../../common/constants/constants';
import { join } from 'path';
import { AuthGuard } from '../../common/guards/authentication.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MS_CUSTOMER,
        transport: Transport.GRPC,
        options: {
          package: MS_CUSTOMER_PACKAGE_NAME,
          protoPath: join(__dirname, '../ms_customer.proto'),
        },
      },
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService, AuthGuard],
  exports: [AuthGuard, CustomerService],
})
export class CustomerModule {}
