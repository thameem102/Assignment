import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('ProductService', 'CreateProduct')
  async createProduct(data: { name: string; price: number; stock: number }) {
    const product = await this.productService.create(data);
    return this.toResponse(product);
  }

  @GrpcMethod('ProductService', 'FindAllProducts')
  async findAllProducts() {
    const products = await this.productService.findAll();
    return { products: products.map((p) => this.toResponse(p)) };
  }

  @GrpcMethod('ProductService', 'FindOneProduct')
  async findOneProduct(data: { id: string }) {
    const product = await this.productService.findOne(data.id);
    return this.toResponse(product);
  }

  @GrpcMethod('ProductService', 'UpdateProduct')
  async updateProduct(data: {
    id: string;
    name?: string;
    price?: number;
    stock?: number;
  }) {
    const product = await this.productService.update(data.id, data);
    return this.toResponse(product);
  }

  @GrpcMethod('ProductService', 'DeleteProduct')
  async deleteProduct(data: { id: string }) {
    return this.productService.delete(data.id);
  }

  @GrpcMethod('ProductService', 'DecrementStock')
  async decrementStock(data: { id: string; quantity: number }) {
    const product = await this.productService.decrementStock(
      data.id,
      data.quantity,
    );
    return this.toResponse(product);
  }

  private toResponse(product: any) {
    return {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      stock: product.stock,
      createdAt: product.createdAt?.toISOString?.() || product.createdAt,
    };
  }
}
