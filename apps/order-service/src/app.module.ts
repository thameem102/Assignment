import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OrderModule } from './order/order.module';
import { ProductProxyModule } from './product-proxy/product-proxy.module';
import { Order } from './order/order.entity';

@Module({
  imports: [
    // SQLite database for orders
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'order.db',
      entities: [Order],
      synchronize: true,
    }),

    // gRPC client to communicate with Product Service
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: join(__dirname, '../../..', 'proto/product.proto'),
          url: 'localhost:5001',
        },
      },
    ]),

    OrderModule,
    ProductProxyModule,
  ],
})
export class AppModule {}
