# MVP Plan

## Goal

最小構成で市場投入し、改善速度を最大化する。

## Scope

### 実装するもの

| 機能             | 概要                                   |
| ---------------- | -------------------------------------- |
| Auth             | ユーザー登録・ログイン・セッション管理 |
| Product Upload   | 作品ファイルのアップロード・登録       |
| Product Detail   | 作品詳細ページ（SEO対応）              |
| Stripe Checkout  | 作品購入フロー                         |
| Download         | 購入済み作品のダウンロード             |
| Admin Moderation | 管理者による作品審査・非表示           |

### 実装しないもの（MVP外）

- SNS機能（フォロー・タイムライン）
- レコメンデーション
- AI機能
- 動画ストリーミング
- モバイルアプリ
- リアルタイム機能（チャット・通知）
- Stripe Connect（作家Payout自動化）

## Priority

1. Auth
2. Product Upload + Admin Moderation
3. Product Detail（公開ページ）
4. Stripe Checkout + Download

## Cost Constraint

個人開発のため運用コストを最小化する。
Managed Service 優先。自己ホスト Kubernetes は採用しない。
