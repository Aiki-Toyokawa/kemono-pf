# Queue

## Philosophy

非同期処理を前提にする。アップロード同期処理は禁止。必ず queue + worker を経由する。

## Stack

- **BullMQ** — ジョブキュー
- **Redis** — BullMQ バックエンド

## 対象ジョブ

| ジョブ               | 概要                         |
| -------------------- | ---------------------------- |
| thumbnail generation | アップロード後サムネイル生成 |
| webp conversion      | 画像の WebP 変換             |
| email                | メール送信                   |
| notifications        | ユーザー通知                 |
| AI tagging           | タグ自動付与（将来）         |
| ranking update       | ランキングスコア更新         |

## Rules

- アップロードリクエストはジョブをエンキューして即レスポンスを返す
- ジョブは冪等に設計する（重複実行しても結果が同じになること）
- ジョブ失敗時はリトライ + DLQ（Dead Letter Queue）に送る
- ジョブの状態は PostgreSQL に記録し Redis に依存しない
