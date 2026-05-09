import Link from 'next/link';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
  { label: 'すべて', href: '/products' },
  { label: 'フィギュア', href: '/products?tag=フィギュア' },
  { label: 'ぬいぐるみ', href: '/products?tag=ぬいぐるみ' },
  { label: 'アクリルスタンド', href: '/products?tag=アクリルスタンド' },
  { label: 'キーホルダー', href: '/products?tag=キーホルダー' },
  { label: 'ステッカー', href: '/products?tag=ステッカー' },
  { label: 'デジタルデータ', href: '/products?tag=デジタルデータ' },
];

const FEATURES = [
  {
    emoji: '🐺',
    title: 'ケモナー特化',
    desc: 'ケモノ・獣人テーマに特化したフィギュア・グッズ専門のマーケットプレイス。',
  },
  {
    emoji: '🛡️',
    title: '安全な決済',
    desc: 'Stripe による堅牢な決済システム。クレジットカードで安心して購入できます。',
  },
  {
    emoji: '💖',
    title: '作家を直接支援',
    desc: '購入金額はダイレクトに作家へ。好きなクリエイターを応援しよう。',
  },
];

export default function HomePage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Decorative background emojis */}
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
          <span className="absolute left-8 top-8 text-8xl opacity-[0.07]">🐺</span>
          <span className="absolute right-16 top-12 text-6xl opacity-[0.06]">🦊</span>
          <span className="absolute bottom-6 left-1/4 text-7xl opacity-[0.05]">🐯</span>
          <span className="absolute bottom-10 right-1/3 text-5xl opacity-[0.06]">🐻</span>
        </div>

        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-300">
            <span>🐾</span>
            <span>ケモナー向けクリエイターマーケット</span>
          </div>
          <h1 className="mb-5 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            ケモノフィギュアを
            <br />
            <span className="text-orange-400">もっと身近に。</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-slate-300">
            ケモノ・獣人系フィギュア・グッズの専門マーケット。
            <br className="hidden sm:block" />
            お気に入りの作家を見つけて、直接応援しよう。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="px-8 text-base shadow-lg shadow-orange-900/30">
                作品を探す
              </Button>
            </Link>
            <Link href="/register">
              <button className="h-12 rounded-md border border-white/30 px-8 text-base font-medium text-white transition-colors hover:bg-white/10">
                作家として出品する
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Category strip ───────────────────────────────────── */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 py-3">
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="shrink-0 rounded-full border border-border px-4 py-1.5 text-sm text-foreground/70 transition-colors hover:border-primary hover:text-primary"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse CTA ───────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">新着・おすすめ作品</h2>
          <Link href="/products" className="text-sm text-primary hover:underline">
            すべて見る →
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white py-16 text-center">
          <span className="mb-3 text-4xl">🐾</span>
          <p className="mb-1 font-medium text-foreground">作品を探してみましょう</p>
          <p className="mb-5 text-sm text-muted-foreground">
            ケモノ・獣人系のフィギュアやグッズが揃っています
          </p>
          <Link href="/products">
            <Button size="lg">作品一覧を見る</Button>
          </Link>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="mb-8 text-center text-xl font-bold">
            kemono<span className="text-orange-500">PF</span> の特徴
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-white p-7 text-center shadow-sm"
              >
                <div className="mb-3 text-4xl">{f.emoji}</div>
                <h3 className="mb-2 font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sell CTA ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center text-white">
          <h2 className="mb-3 text-2xl font-extrabold">作品を出品しませんか？</h2>
          <p className="mb-6 text-orange-100">
            あなたの作品をケモナーコミュニティに届けよう。出品は無料。
          </p>
          <Link href="/register">
            <button className="rounded-md bg-white px-8 py-3 font-semibold text-orange-600 shadow-md transition-opacity hover:opacity-90">
              無料で始める
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
