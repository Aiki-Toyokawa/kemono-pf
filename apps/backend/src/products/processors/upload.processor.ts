import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import sharp = require('sharp');
import { PrismaService } from '../../prisma/prisma.service';
import { R2Service } from '../../storage/r2.service';

interface UploadJobData {
  productId: string;
  r2Key: string;
  mimeType: string;
}

@Processor('upload')
export class UploadProcessor {
  private readonly logger = new Logger(UploadProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly r2: R2Service,
  ) {}

  @Process('process')
  async handleProcess(job: Job<UploadJobData>) {
    const { productId, r2Key, mimeType } = job.data;
    this.logger.log(`Processing product ${productId}`);

    try {
      if (!this.r2.isConfigured) {
        await this.markReady(productId);
        return;
      }

      if (!mimeType.startsWith('image/')) {
        await this.markReady(productId);
        return;
      }

      const original = await this.r2.download(r2Key);

      const [thumbnail, preview, webp] = await Promise.all([
        sharp(original).resize(256, 256, { fit: 'cover' }).webp({ quality: 80 }).toBuffer(),
        sharp(original)
          .resize(800, null, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer(),
        mimeType !== 'image/webp'
          ? sharp(original).webp({ quality: 90 }).toBuffer()
          : Promise.resolve(null),
      ]);

      const filename = r2Key.split('/').pop() ?? 'file';

      await Promise.all([
        this.r2.upload(`products/${productId}/thumbnail/thumb.webp`, thumbnail, 'image/webp'),
        this.r2.upload(`products/${productId}/preview/preview.webp`, preview, 'image/webp'),
        webp
          ? this.r2.upload(`products/${productId}/webp/${filename}.webp`, webp, 'image/webp')
          : Promise.resolve(),
      ]);

      await this.markReady(productId);
      this.logger.log(`Product ${productId} processed successfully`);
    } catch (err) {
      this.logger.error(`Failed to process product ${productId}`, err);
      throw err;
    }
  }

  private async markReady(productId: string) {
    await this.prisma.product.update({
      where: { id: productId },
      data: { status: 'READY' },
    });
  }
}
