import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UploadProcessor } from './processors/upload.processor';

@Module({
  imports: [BullModule.registerQueue({ name: 'upload' })],
  controllers: [ProductsController],
  providers: [ProductsService, UploadProcessor],
  exports: [ProductsService],
})
export class ProductsModule {}
