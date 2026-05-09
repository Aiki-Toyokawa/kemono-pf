import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

const SAFE_SELECT = {
  id: true,
  handle: true,
  email: true,
  role: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  isNsfwEnabled: true,
  createdAt: true,
  updatedAt: true,
  // serialNumber は意図的に除外（内部管理用）
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

  findByHandle(handle: string) {
    return this.prisma.user.findUnique({ where: { handle } });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    displayName: string;
    handle?: string | null;
    role?: Role;
  }) {
    const artistSerialNumber =
      data.role === Role.ARTIST ? await this.nextArtistSerial() : undefined;
    return this.prisma.user.create({ data: { ...data, artistSerialNumber } });
  }

  /** 管理用: serialNumber から "user000001" 形式のIDを返す */
  static formatUserId(serialNumber: number): string {
    return `user${String(serialNumber).padStart(6, '0')}`;
  }

  /** 管理用: artistSerialNumber から "artist000001" 形式のIDを返す */
  static formatArtistId(artistSerialNumber: number): string {
    return `artist${String(artistSerialNumber).padStart(6, '0')}`;
  }

  /** 次の artistSerialNumber を採番して返す（トランザクション内で使用） */
  private async nextArtistSerial() {
    const last = await this.prisma.user.findFirst({
      where: { artistSerialNumber: { not: null } },
      orderBy: { artistSerialNumber: 'desc' },
      select: { artistSerialNumber: true },
    });
    return (last?.artistSerialNumber ?? 0) + 1;
  }

  async getPublicProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        handle: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('ユーザーが見つかりません');
    return user;
  }

  async updateMe(userId: string, dto: UpdateProfileDto) {
    if (dto.handle) {
      const taken = await this.prisma.user.findUnique({
        where: { handle: dto.handle },
        select: { id: true },
      });
      if (taken && taken.id !== userId) {
        throw new ConflictException('このユーザーIDは既に使用されています');
      }
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: SAFE_SELECT,
    });
  }

  async upgradeToArtist(userId: string) {
    const artistSerialNumber = await this.nextArtistSerial();
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: Role.ARTIST, artistSerialNumber },
      select: SAFE_SELECT,
    });
  }
}
