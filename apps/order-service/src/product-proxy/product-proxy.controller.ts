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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, timeout, catchError, Observable } from 'rxjs';

interface ProductGrpcService {
  createProduct(data: any): Observable<any>;
  findAllProducts(data: any): Observable<any>;
  findOneProduct(data: any): Observable<any>;
  updateProduct(data: any): Observable<any>;
  deleteProduct(data: any): Observable<any>;
}

@ApiTags('products')
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
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'price', 'stock'],
      properties: {
        name: { type: 'string', example: 'iPhone 15' },
        price: { type: 'number', example: 999.99 },
        stock: { type: 'number', example: 50 },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 503, description: 'Product Service unavailable' })
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
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of all products' })
  @ApiResponse({ status: 503, description: 'Product Service unavailable' })
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
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 503, description: 'Product Service unavailable' })
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
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'iPhone 16' },
        price: { type: 'number', example: 1099.99 },
        stock: { type: 'number', example: 100 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 503, description: 'Product Service unavailable' })
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
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 503, description: 'Product Service unavailable' })
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
