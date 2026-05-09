import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('products')
  getProducts() {
    return this.adminService.findPendingProducts();
  }

  @Patch('products/:id/reject')
  reject(@Param('id') id: string) {
    return this.adminService.reject(id);
  }

  @Patch('products/:id/restore')
  restore(@Param('id') id: string) {
    return this.adminService.restore(id);
  }
}
