import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../storage/r2.service';
import { CreateOrderDto } from './dto/create-order.dto';

const DOWNLOAD_TTL_MS = 24 * 60 * 60 * 1000; // 24時間

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private stripe: Stripe | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly r2: R2Service,
  ) {
    if (process.env.STRIPE_SECRET_KEY) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    } else {
      this.logger.warn('Stripe not configured. Paid products will be unavailable.');
    }
  }

  async create(userId: string, dto: CreateOrderDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product || product.status !== 'PUBLISHED') {
      throw new NotFoundException('作品が見つかりません');
    }
    if (product.authorId === userId) {
      throw new BadRequestException('自分の作品は購入できません');
    }

    const existing = await this.prisma.order.findFirst({
      where: { buyerId: userId, productId: dto.productId, status: 'PAID' },
    });
    if (existing) throw new ConflictException('既に購入済みです');

    if (product.price === 0) {
      const order = await this.prisma.order.create({
        data: { buyerId: userId, productId: product.id, amount: 0, status: 'PAID' },
      });
      const download = await this.prisma.download.create({
        data: { orderId: order.id, expiresAt: new Date(Date.now() + DOWNLOAD_TTL_MS) },
      });
      return { orderId: order.id, free: true, downloadToken: download.token };
    }

    if (!this.stripe) {
      throw new BadRequestException('現在決済を受け付けていません');
    }

    const order = await this.prisma.order.create({
      data: { buyerId: userId, productId: product.id, amount: product.price, status: 'PENDING' },
    });

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: { name: product.title },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      metadata: { orderId: order.id },
    });

    await this.prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return { orderId: order.id, free: false, checkoutUrl: session.url };
  }

  async findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { buyerId: userId, status: 'PAID' },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            isNsfw: true,
            files: { select: { filename: true, mimeType: true } },
          },
        },
        download: { select: { token: true, expiresAt: true, usedAt: true } },
      },
    });
  }

  async getDownloadLink(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        download: true,
        product: { include: { files: true } },
      },
    });
    if (!order || order.buyerId !== userId || order.status !== 'PAID') {
      throw new ForbiddenException();
    }

    let download = order.download;
    if (!download || download.expiresAt < new Date()) {
      if (download) {
        await this.prisma.download.delete({ where: { id: download.id } });
      }
      download = await this.prisma.download.create({
        data: { orderId, expiresAt: new Date(Date.now() + DOWNLOAD_TTL_MS) },
      });
    }

    const file = order.product.files[0];
    if (!file) throw new NotFoundException('ファイルが見つかりません');

    const url = this.r2.isConfigured ? await this.r2.signedDownloadUrl(file.r2Key, 3600) : null;

    await this.prisma.download.update({
      where: { id: download.id },
      data: { usedAt: new Date() },
    });

    return { url, filename: file.filename, expiresAt: download.expiresAt };
  }

  async handleStripeWebhook(rawBody: Buffer, signature: string) {
    if (!this.stripe || !process.env.STRIPE_WEBHOOK_SECRET) return;

    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (!orderId) return;

      await this.prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            stripePaymentIntentId: session.payment_intent as string,
          },
        });
        await tx.download.create({
          data: { orderId, expiresAt: new Date(Date.now() + DOWNLOAD_TTL_MS) },
        });
      });
    }
  }
}
