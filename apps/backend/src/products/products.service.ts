import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../storage/r2.service';
import { CreateProductDto } from './dto/create-product.dto';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
]);
const MAX_FILE_SIZE = 100 * 1024 * 1024;

const PRODUCT_PUBLIC_SELECT = {
  id: true,
  title: true,
  description: true,
  price: true,
  isNsfw: true,
  status: true,
  createdAt: true,
  author: {
    select: { id: true, displayName: true, avatarUrl: true },
  },
  tags: { include: { tag: true } },
  files: { select: { filename: true, mimeType: true, sizeBytes: true, r2Key: true } },
};

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly r2: R2Service,
    @InjectQueue('upload') private readonly uploadQueue: Queue,
  ) {}

  // ─── Public ───────────────────────────────────────────────────────

  async findPublished(opts: {
    showNsfw: boolean;
    search?: string;
    tag?: string;
    page: number;
    limit: number;
  }) {
    const { showNsfw, search, tag, page, limit } = opts;
    const where: Record<string, unknown> = { status: 'PUBLISHED' };
    if (!showNsfw) where['isNsfw'] = false;
    if (search) {
      where['OR'] = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (tag) {
      where['tags'] = { some: { tag: { name: tag } } };
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        select: PRODUCT_PUBLIC_SELECT,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async findOnePublished(productId: string, userId?: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: PRODUCT_PUBLIC_SELECT,
    });
    if (!product || product.status !== 'PUBLISHED') {
      throw new NotFoundException('作品が見つかりません');
    }

    let hasPurchased = false;
    let purchasedOrderId: string | null = null;

    if (userId) {
      const order = await this.prisma.order.findFirst({
        where: { buyerId: userId, productId, status: 'PAID' },
      });
      if (order) {
        hasPurchased = true;
        purchasedOrderId = order.id;
      }
    }

    return { ...product, hasPurchased, purchasedOrderId };
  }

  async findByAuthorPublic(authorId: string) {
    return this.prisma.product.findMany({
      where: { authorId, status: 'PUBLISHED' },
      select: PRODUCT_PUBLIC_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Author ───────────────────────────────────────────────────────

  async upload(user: User, file: Express.Multer.File, dto: CreateProductDto) {
    if (!file) throw new BadRequestException('ファイルを選択してください');
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException('サポートされていないファイル形式です');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('ファイルサイズは100MB以内にしてください');
    }

    const { product: p, r2Key } = await this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          authorId: user.id,
          title: dto.title,
          description: dto.description,
          price: dto.price,
          isNsfw: dto.isNsfw ?? false,
          status: 'PENDING',
        },
      });

      const key = `products/${product.id}/original/${file.originalname}`;
      await tx.productFile.create({
        data: {
          productId: product.id,
          filename: file.originalname,
          mimeType: file.mimetype,
          sizeBytes: file.size,
          r2Key: key,
        },
      });

      if (dto.tags?.length) {
        for (const tagName of dto.tags) {
          const tag = await tx.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });
          await tx.productTag.create({ data: { productId: product.id, tagId: tag.id } });
        }
      }

      return { product, r2Key: key };
    });

    await this.r2.upload(r2Key, file.buffer, file.mimetype);
    await this.uploadQueue.add('process', { productId: p.id, r2Key, mimeType: file.mimetype });

    return { productId: p.id, status: 'PENDING' };
  }

  async publish(productId: string, userId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException();
    if (product.authorId !== userId) throw new ForbiddenException();
    if (product.status !== 'READY') {
      throw new BadRequestException('処理が完了した作品のみ公開できます');
    }
    return this.prisma.product.update({
      where: { id: productId },
      data: { status: 'PUBLISHED' },
    });
  }

  async unpublish(productId: string, userId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException();
    if (product.authorId !== userId) throw new ForbiddenException();
    return this.prisma.product.update({
      where: { id: productId },
      data: { status: 'READY' },
    });
  }

  async getStatus(productId: string, userId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException();
    if (product.authorId !== userId) throw new ForbiddenException();
    return { productId: product.id, status: product.status };
  }

  async findByAuthor(userId: string) {
    return this.prisma.product.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        files: { select: { filename: true, mimeType: true, sizeBytes: true } },
        tags: { include: { tag: true } },
      },
    });
  }
}
