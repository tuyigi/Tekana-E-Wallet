import { NestFactory } from '@nestjs/core';
import { MsWalletModule } from './ms-wallet.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { MS_WALLET_PACKAGE_NAME } from '@app/common/types/ms_wallet';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MsWalletModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `${process.env.MS_WALLET_URL}:${process.env.MS_WALLET_PORT}`,
        protoPath: join(__dirname, '../ms_wallet.proto'),
        package: MS_WALLET_PACKAGE_NAME,
      },
    },
  );
  await app.listen();
}
bootstrap();
