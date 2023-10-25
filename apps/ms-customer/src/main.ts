import { NestFactory } from '@nestjs/core';
import { MsCustomerModule } from './ms-customer.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { MS_CUSTOMER_PACKAGE_NAME } from '@app/common/types/ms_customer';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MsCustomerModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `${process.env.MS_CUSTOMER_URL}:${process.env.MS_CUSTOMER_PORT}`,
        protoPath: join(__dirname, '../ms_customer.proto'),
        package: MS_CUSTOMER_PACKAGE_NAME,
      },
    },
  );
  await app.listen();
}
bootstrap();
