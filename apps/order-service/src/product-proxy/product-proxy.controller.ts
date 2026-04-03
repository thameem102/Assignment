import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Inject,
  OnModuleInit,
  ServiceUnavailableException,
  NotFoundException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, timeout, catchError, Observable } from 'rxjs';

interface ProductGrpcService {
  createProduct(data: any): Observable<any>;
  findAllProducts(data: any): Observable<any>;
  findOneProduct(data: any): Observable<any>;
  updateProduct(data: any): Observable<any>;
  deleteProduct(data: any): Observable<any>;
}

@Controller('products')
export class ProductProxyController implements OnModuleInit {
  private productService: ProductGrpcService;

  constructor(
    @Inject('PRODUCT_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.productService =
      this.client.getService<ProductGrpcService>('ProductService');
  }

  @Post()
  async create(@Body() data: { name: string; price: number; stock: number }) {
    try {
      return await firstValueFrom(
        this.productService.createProduct(data).pipe(timeout(5000)),
      );
    } catch (err) {
      throw new ServiceUnavailableException(
        'Product Service is unavailable. Please try again later.',
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const result = await firstValueFrom(
        this.productService.findAllProducts({}).pipe(timeout(5000)),
      );
      return result.products || [];
    } catch (err) {
      throw new ServiceUnavailableException(
        'Product Service is unavailable. Please try again later.',
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.productService.findOneProduct({ id }).pipe(
          timeout(5000),
          catchError((err) => {
            if (err.code === 5 || err.details?.includes('not found')) {
              throw new NotFoundException(
                `Product with id "${id}" not found`,
              );
            }
            throw err;
          }),
        ),
      );
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new ServiceUnavailableException(
        'Product Service is unavailable. Please try again later.',
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { name?: string; price?: number; stock?: number },
  ) {
    try {
      return await firstValueFrom(
        this.productService.updateProduct({ id, ...data }).pipe(
          timeout(5000),
          catchError((err) => {
            if (err.code === 5 || err.details?.includes('not found')) {
              throw new NotFoundException(
                `Product with id "${id}" not found`,
              );
            }
            throw err;
          }),
        ),
      );
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new ServiceUnavailableException(
        'Product Service is unavailable. Please try again later.',
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.productService.deleteProduct({ id }).pipe(
          timeout(5000),
          catchError((err) => {
            if (err.code === 5 || err.details?.includes('not found')) {
              throw new NotFoundException(
                `Product with id "${id}" not found`,
              );
            }
            throw err;
          }),
        ),
      );
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new ServiceUnavailableException(
        'Product Service is unavailable. Please try again later.',
      );
    }
  }
}
