import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  RawBodyRequest,
  Headers,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: User, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.id, dto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMy(@CurrentUser() user: User) {
    return this.ordersService.findMyOrders(user.id);
  }

  @Get(':id/download')
  @UseGuards(JwtAuthGuard)
  getDownload(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ordersService.getDownloadLink(id, user.id);
  }

  @Post('webhook/stripe')
  @HttpCode(200)
  stripeWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') sig: string) {
    return this.ordersService.handleStripeWebhook(req.rawBody!, sig);
  }
}
