# Upload Flow

## Overview

アップロードは同期処理禁止。すべて非同期キュー経由で処理する。

## Flow

```
Client
  → POST /upload (multipart or presigned URL)
  → Backend: バリデーション + DB レコード作成 (status: pending)
  → BullMQ: ジョブエンキュー
  → レスポンス返却 (202 Accepted)

Worker
  → thumbnail generation
  → webp conversion
  → R2 へ保存 (original / thumbnail / preview / webp)
  → DB 更新 (status: ready)
```

## Storage 構造 (Cloudflare R2)

```
products/{productId}/
  original/   ← 元ファイル
  thumbnail/  ← サムネイル
  preview/    ← 透かし付きプレビュー
  webp/       ← WebP変換済み
```

## Rules

- Redis に画像バイナリを保存しない
- ファイルは直接 R2 に書き込む（DBには保存しない）
- presigned URL を使いクライアントから直接 R2 へアップロードする構成を将来検討
- アップロード中のステータス管理は DB で行う

## Why Cloudflare R2

- egress コスト削減（画像ヘビーなプラットフォームに最適）
- CDN との統合が容易
