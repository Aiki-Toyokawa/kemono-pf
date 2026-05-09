# Payment

## Stack

- **Stripe** — 決済プロバイダー
- **Stripe Checkout** — MVP の決済フロー

## MVP Flow

```
Client
  → 購入ボタン押下
  → POST /orders (Backend: Order レコード作成)
  → Stripe Checkout Session 作成
  → Stripe 決済ページへリダイレクト

Stripe Webhook
  → checkout.session.completed
  → Backend: Order ステータス更新 (paid)
  → ダウンロードリンク発行
  → メール送信 (Queue)
```

## Rules

- 決済完了はWebhookでのみ確定とする（フロントのリダイレクトを信用しない）
- Webhook の署名検証を必ず行う
- 冪等キーを使い二重処理を防ぐ
- 返金・キャンセルは Stripe Dashboard で手動対応（MVP）

## Payout (将来)

- Stripe Connect を使い作家への売上分配を自動化
- MVPでは手動対応
