import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const BCRYPT_ROUNDS = 12;
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30日

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const emailExists = await this.usersService.findByEmail(dto.email);
    if (emailExists) throw new ConflictException('このメールアドレスは既に使用されています');

    const handleExists = await this.usersService.findByHandle(dto.handle);
    if (handleExists) throw new ConflictException('このユーザーIDは既に使用されています');

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      displayName: dto.displayName,
      handle: dto.handle,
      role: dto.isArtist ? Role.ARTIST : Role.USER,
    });

    return this.issueTokens(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.validateCredentials(dto.email, dto.password);

    // ── 2FA挿入点 ───────────────────────────────────────────────────────
    // メール OTP を実装する場合はここに追加する。
    // 例: if (user.twoFactorEnabled) return this.initiateTwoFactor(user);
    // ────────────────────────────────────────────────────────────────────

    return this.issueTokens(user.id, user.email, user.role);
  }

  async refresh(userId: string, oldToken: string) {
    await this.prisma.refreshToken.deleteMany({ where: { token: oldToken } });
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();
    return this.issueTokens(user.id, user.email, user.role);
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }

  /**
   * メールアドレスとパスワードを検証し、ユーザーを返す。
   * トークン発行は行わないため、パスワード確認（設定画面など）でも再利用できる。
   */
  async validateCredentials(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('メールアドレスまたはパスワードが正しくありません');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('メールアドレスまたはパスワードが正しくありません');

    return user;
  }

  private async issueTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET ?? 'access-secret',
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET ?? 'refresh-secret',
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d',
    });

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    });

    return { accessToken, refreshToken };
  }
}
