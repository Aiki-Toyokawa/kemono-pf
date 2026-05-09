# Upload Plan

## Goal

作品アップロード機能を MVP として最小実装する。

## Flow

1. ユーザーがファイルを選択・フォーム入力
2. Backend にマルチパートPOST
3. バリデーション（ファイルタイプ・サイズ・権限）
4. DB に Product レコード作成（status: pending）
5. BullMQ にジョブエンキュー
6. 202 Accepted を返却
7. Worker がサムネイル生成・WebP変換・R2保存
8. DB 更新（status: ready）

## Supported Formats (MVP)

- 画像: JPEG / PNG / WebP / GIF
- PDF

## Validation Rules

- 最大ファイルサイズ: 100MB（MVP）
- ファイルタイプの MIME 検証（拡張子だけ信用しない）
- ログイン済みユーザーのみアップロード可

## Storage Layout

```
R2: products/{productId}/original/{filename}
    products/{productId}/thumbnail/thumb.webp
    products/{productId}/preview/preview.webp
    products/{productId}/webp/{filename}.webp
```

## TODO

- [ ] アップロードエンドポイント実装
- [ ] BullMQ ジョブ定義
- [ ] サムネイル生成 Worker（sharp 使用）
- [ ] R2 アップロードユーティリティ
- [ ] DB スキーマ（Product / ProductFile）
