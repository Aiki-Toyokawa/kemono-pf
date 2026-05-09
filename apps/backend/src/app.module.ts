import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AdminModule } from './admin/admin.module';

function parseRedisUrl(url: string) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'rediss:') return url;
  // Upstash (and other TLS Redis providers) use rediss:// scheme
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port) || 6380,
    password: parsed.password || undefined,
    tls: {},
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 100,
      },
    ]),
    BullModule.forRoot({
      redis: parseRedisUrl(process.env.REDIS_URL ?? 'redis://localhost:6379'),
    }),
    PrismaModule,
    StorageModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
