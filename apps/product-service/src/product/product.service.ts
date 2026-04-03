import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(data: {
    name: string;
    price: number;
    stock: number;
  }): Promise<Product> {
    const product = this.productRepo.create({
      name: data.name,
      price: data.price,
      stock: data.stock,
    });
    return this.productRepo.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new RpcException({
        code: 5, // NOT_FOUND
        message: `Product with id "${id}" not found`,
      });
    }
    return product;
  }

  async update(
    id: string,
    data: { name?: string; price?: number; stock?: number },
  ): Promise<Product> {
    const product = await this.findOne(id);
    if (data.name !== undefined) product.name = data.name;
    if (data.price !== undefined) product.price = data.price;
    if (data.stock !== undefined) product.stock = data.stock;
    return this.productRepo.save(product);
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    await this.findOne(id); // Ensure it exists
    await this.productRepo.delete(id);
    return { success: true, message: `Product "${id}" deleted successfully` };
  }

  async decrementStock(
    id: string,
    quantity: number,
  ): Promise<Product> {
    const product = await this.findOne(id);
    if (product.stock < quantity) {
      throw new RpcException({
        code: 9, // FAILED_PRECONDITION
        message: `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`,
      });
    }
    product.stock -= quantity;
    return this.productRepo.save(product);
  }
}
