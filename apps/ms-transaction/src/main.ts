import { NestFactory } from '@nestjs/core';
import { MsTransactionModule } from './ms-transaction.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { MS_TRANSACTION_PACKAGE_NAME } from '@app/common/types/ms_transaction';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MsTransactionModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `${process.env.MS_TRANSACTION_URL}:${process.env.MS_TRANSACTION_PORT}`,
        protoPath: join(__dirname, '../ms_transaction.proto'),
        package: MS_TRANSACTION_PACKAGE_NAME,
      },
    },
  );
  await app.listen();
}
bootstrap();
