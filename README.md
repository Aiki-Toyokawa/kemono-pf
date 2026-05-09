# kemono-pf

ケモナー向けクリエイタープラットフォーム。

## Overview

作品販売・作家支援・タグ文化・コミュニティ形成を軸にした、個人運営の長期プラットフォーム。
R18コンテンツ対応・高速検索・将来スケールを見据えた設計。

## Tech Stack

| レイヤー        | 技術                                                                              |
| --------------- | --------------------------------------------------------------------------------- |
| Frontend        | Next.js (App Router), TypeScript, TailwindCSS, shadcn/ui, Zustand, TanStack Query |
| Backend         | NestJS, TypeScript, Prisma, PostgreSQL, Redis, BullMQ                             |
| Storage         | Cloudflare R2                                                                     |
| Search (MVP)    | PostgreSQL FullText                                                               |
| Search (Growth) | Meilisearch                                                                       |
| Payment         | Stripe                                                                            |

## Directory Structure

```
kemono-pf/
├ apps/          # アプリケーション (frontend / backend)
├ packages/      # 共有パッケージ
├ infra/         # インフラ定義
├ docs/          # 設計ドキュメント
├ plans/         # 実装計画
└ .claude/       # Claude Code 設定
```

## Getting Started

WIP
