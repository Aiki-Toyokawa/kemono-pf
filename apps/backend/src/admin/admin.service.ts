import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  findPendingProducts() {
    return this.prisma.product.findMany({
      where: { status: { in: ['READY', 'PUBLISHED'] } },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, displayName: true, email: true } },
        tags: { include: { tag: true } },
        files: { select: { filename: true, mimeType: true, sizeBytes: true } },
      },
    });
  }

  async reject(productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException();
    return this.prisma.product.update({
      where: { id: productId },
      data: { status: 'REJECTED' },
    });
  }

  async restore(productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException();
    return this.prisma.product.update({
      where: { id: productId },
      data: { status: 'READY' },
    });
  }

  getStats() {
    return Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.order.count({ where: { status: 'PAID' } }),
      this.prisma.product.count({ where: { status: 'READY' } }),
    ]).then(([users, published, orders, pendingReview]) => ({
      users,
      published,
      orders,
      pendingReview,
    }));
  }
}
