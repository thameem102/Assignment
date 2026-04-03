import {
  Injectable,
  OnModuleInit,
  Inject,
  NotFoundException,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom, timeout, catchError, Observable } from 'rxjs';
import { Order, OrderStatus } from './order.entity';

// gRPC service interface (matches proto)
interface ProductGrpcService {
  findOneProduct(data: { id: string }): Observable<any>;
  findAllProducts(data: {}): Observable<any>;
  decrementStock(data: { id: string; quantity: number }): Observable<any>;
}

@Injectable()
export class OrderService implements OnModuleInit {
  private productService: ProductGrpcService;

  constructor(
    @Inject('PRODUCT_SERVICE') private readonly client: ClientGrpc,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  onModuleInit() {
    this.productService =
      this.client.getService<ProductGrpcService>('ProductService');
  }

  async createOrder(productId: string, quantity: number): Promise<any> {
    // 1. Fetch product from Product Service via gRPC
    let product: any;
    try {
      product = await firstValueFrom(
        this.productService.findOneProduct({ id: productId }).pipe(
          timeout(5000),
          catchError((err) => {
            if (err.code === 5 || err.details?.includes('not found')) {
              throw new NotFoundException(
                `Product with id "${productId}" not found`,
              );
            }
            if (err.name === 'TimeoutError') {
              throw new ServiceUnavailableException(
                'Product Service is unavailable. Please try again later.',
              );
            }
            throw err;
          }),
        ),
      );
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof ServiceUnavailableException
      ) {
        throw err;
      }
      throw new ServiceUnavailableException(
        'Product Service is unavailable. Please try again later.',
      );
    }

    // 2. Validate stock
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`,
      );
    }

    // 3. Calculate total price
    const totalPrice = Number(product.price) * quantity;

    // 4. Decrement stock via gRPC
    try {
      await firstValueFrom(
        this.productService
          .decrementStock({ id: productId, quantity })
          .pipe(timeout(5000)),
      );
    } catch (err) {
      throw new ServiceUnavailableException(
        'Failed to update product stock. Order cancelled.',
      );
    }

    // 5. Create order
    const order = this.orderRepo.create({
      productId,
      quantity,
      totalPrice,
      status: OrderStatus.CONFIRMED,
    });
    const savedOrder = await this.orderRepo.save(order);

    return {
      ...savedOrder,
      totalPrice: Number(savedOrder.totalPrice),
      product: {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        stock: product.stock - quantity,
      },
    };
  }

  async findAll(): Promise<any[]> {
    const orders = await this.orderRepo.find({ order: { createdAt: 'DESC' } });

    // Enrich each order with product details
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        let product = null;
        try {
          product = await firstValueFrom(
            this.productService
              .findOneProduct({ id: order.productId })
              .pipe(timeout(3000)),
          );
          product = {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            stock: product.stock,
          };
        } catch {
          product = { id: order.productId, name: 'Unknown', price: 0, stock: 0 };
        }
        return {
          ...order,
          totalPrice: Number(order.totalPrice),
          product,
        };
      }),
    );

    return enrichedOrders;
  }

  async findOne(id: string): Promise<any> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with id "${id}" not found`);
    }

    let product = null;
    try {
      product = await firstValueFrom(
        this.productService
          .findOneProduct({ id: order.productId })
          .pipe(timeout(3000)),
      );
      product = {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        stock: product.stock,
      };
    } catch {
      product = { id: order.productId, name: 'Unknown', price: 0, stock: 0 };
    }

    return {
      ...order,
      totalPrice: Number(order.totalPrice),
      product,
    };
  }
}
