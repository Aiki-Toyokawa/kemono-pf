import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

const SAFE_SELECT = {
  id: true,
  email: true,
  role: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  isNsfwEnabled: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  create(data: { email: string; passwordHash: string; displayName: string; role?: Role }) {
    return this.prisma.user.create({ data });
  }

  async getPublicProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, displayName: true, bio: true, avatarUrl: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('ユーザーが見つかりません');
    return user;
  }

  async updateMe(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: SAFE_SELECT,
    });
  }
}
