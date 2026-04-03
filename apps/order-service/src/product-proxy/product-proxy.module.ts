import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ProductProxyController } from './product-proxy.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: join(__dirname, '../../../..', 'proto/product.proto'),
          url: 'localhost:5001',
        },
      },
    ]),
  ],
  controllers: [ProductProxyController],
})
export class ProductProxyModule {}
