# CLAUDE.md

このファイルはClaude Codeが参照するプロジェクト指示書です。

## Project Vision

ケモナー向けクリエイタープラットフォームを個人で開発・運営する。
作品販売・作家支援・タグ文化・コミュニティ形成・R18対応・将来スケールまで見据えた長期運営前提のプラットフォーム。

**最重要方針：最小構成で市場投入し、改善速度を最大化する。**

技術的ロマンよりも以下を優先する：

- 開発継続性
- 保守性
- 将来拡張性
- 運用コスト
- 個人開発現実性

---

## Core Development Philosophy

### 1. Avoid Premature Complexity

禁止事項：

- 過剰マイクロサービス
- Kubernetes前提設計
- 不必要な抽象化
- 早すぎる最適化
- DDD過剰導入
- 「将来使うかもしれない」実装

必要になるまで導入しない。

### 2. Prioritize Long-Term Maintainability

1人開発のため「半年後の自分が理解できること」を最優先とする。

重視すること：

- 明確な責務分離
- Module構造
- 型安全
- シンプルなデータフロー
- 命名一貫性
- predictable architecture

### 3. Optimize for Iteration Speed

最速で改善サイクルを回すために：

- Managed Service優先
- TypeScript統一
- AI補助開発前提
- boilerplate削減
- Prisma活用

---

## Coding Standards

- readable first
- explicit > magic
- simplicity > cleverness
- maintainability > micro optimization

コードは「未来の自分」が読む。

---

## AI Collaboration Rules

Claudeはコード生成器ではなく以下の役割で機能すること：

- architecture reviewer
- refactoring advisor
- maintainability reviewer
- scalability reviewer
- technical critic

設計ミスは遠慮なく指摘すること。

特に警戒すること：

- overengineering
- hidden complexity
- cache invalidation issues
- Prisma N+1
- auth boundary leaks
- queue duplication bugs
- transaction inconsistency
- future migration pain

---

## Final Goal

「巨大技術スタックを作ること」ではなく、**ケモナー作家とユーザーが継続利用したくなるプラットフォームを作ること**。

技術は目的ではなく、継続運営のための手段である。
