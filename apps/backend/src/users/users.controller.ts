import {
  Controller,
  Get,
  Put,
  Patch,
  Param,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProductsService } from '../products/products.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  @Get(':id')
  getProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }

  @Get(':id/products')
  getAuthorProducts(@Param('id') id: string) {
    return this.productsService.findByAuthorPublic(id);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  updateMe(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateMe(user.id, dto);
  }

  @Patch('me/upgrade-to-artist')
  @UseGuards(JwtAuthGuard)
  upgradeToArtist(@CurrentUser() user: User) {
    if (user.role !== Role.USER) {
      throw new BadRequestException('既に作家登録されています');
    }
    return this.usersService.upgradeToArtist(user.id);
  }
}
