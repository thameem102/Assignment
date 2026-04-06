import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order', description: 'Creates an order by validating product stock via gRPC and decrementing it' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 503, description: 'Product Service unavailable' })
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(dto.productId, dto.quantity);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders', description: 'Returns all orders with enriched product details' })
  @ApiResponse({ status: 200, description: 'List of all orders' })
  async findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', description: 'Order UUID' })
  @ApiResponse({ status: 200, description: 'Order found' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }
}
