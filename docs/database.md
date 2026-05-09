# Database

## PostgreSQL — Source of Truth

PostgreSQL はすべての永続データの唯一の真実ソース。

保存対象：

- users
- artists
- products
- orders
- downloads
- payouts
- tags

### Why PostgreSQL

- ACID トランザクション
- リレーショナル整合性
- JSONB サポート
- 全文検索 (FTS)
- Prisma との相性
- アナリティクスクエリ

NoSQL first にはしない。

---

## Redis — Acceleration Layer

Redis は永続DBではない。消えても再生成・復元可能なデータのみ持たせる。

責務：

- BullMQ Queue バックエンド
- Session ストア
- Rate Limit カウンター
- API キャッシュ
- ランキングキャッシュ

Redis に真実データを持たせない。

---

## Search Strategy

| フェーズ | 手段                       |
| -------- | -------------------------- |
| MVP      | PostgreSQL FullText Search |
| Growth   | Meilisearch                |

重要な検索要件：

- タグ検索
- fuzzy search
- 日本語検索
- NSFWフィルタリング

検索品質はプラットフォームの生命線。
