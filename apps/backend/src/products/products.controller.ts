import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ─── Public ───────────────────────────────────────────────────────

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(
    @CurrentUser() user: User | null,
    @Query('search') search?: string,
    @Query('tag') tag?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const showNsfw = user?.isNsfwEnabled ?? false;
    return this.productsService.findPublished({
      showNsfw,
      search,
      tag,
      page: parseInt(page),
      limit: Math.min(parseInt(limit), 50),
    });
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: User | null) {
    return this.productsService.findOnePublished(id, user?.id);
  }

  // ─── Author ───────────────────────────────────────────────────────

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 100 * 1024 * 1024 } }))
  upload(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.upload(user, file, dto);
  }

  @Get('my/list')
  @UseGuards(JwtAuthGuard)
  findMy(@CurrentUser() user: User) {
    return this.productsService.findByAuthor(user.id);
  }

  @Get(':id/status')
  @UseGuards(JwtAuthGuard)
  getStatus(@Param('id') id: string, @CurrentUser() user: User) {
    return this.productsService.getStatus(id, user.id);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  publish(@Param('id') id: string, @CurrentUser() user: User) {
    return this.productsService.publish(id, user.id);
  }

  @Patch(':id/unpublish')
  @UseGuards(JwtAuthGuard)
  unpublish(@Param('id') id: string, @CurrentUser() user: User) {
    return this.productsService.unpublish(id, user.id);
  }
}
