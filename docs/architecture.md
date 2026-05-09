# Architecture

## Overview

Frontend + Backend 分離構成。Next.js only にはしない。
バックエンドのビジネスロジック肥大化に備え NestJS を採用する。

## Frontend

- **Next.js (App Router)** — SEO・SSR/ISR・作品ページ流入を重視
- **TypeScript** — 全レイヤー統一
- **TailwindCSS + shadcn/ui** — UI構築
- **Zustand** — クライアント状態管理
- **TanStack Query** — サーバー状態管理
- **React Hook Form + Zod** — フォームバリデーション

## Backend

- **NestJS** — Module / DI / Guard / Queue integration
- **TypeScript** — 全レイヤー統一
- **Prisma** — ORM
- **PostgreSQL** — 永続データ
- **Redis** — Cache / Queue / Session
- **BullMQ** — 非同期ジョブキュー

## Why NestJS

PFは後半で Queue / Payment / Moderation / Notification / Upload pipeline など業務ロジックが肥大化する。
NestJS の Module 構造と DI により責務を明確に分離できる。

## Deployment (予定)

- Frontend: Vercel
- Backend: Railway / Render
- DB: Supabase / Railway PostgreSQL
- Redis: Upstash
- Storage: Cloudflare R2
