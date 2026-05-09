import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TEST_PRODUCTS, TEST_ARTISTS } from '@/lib/test-data';

const CATEGORIES = [
  { label: 'すべて', href: '/products' },
  { label: 'フィギュア', href: '/products?tag=フィギュア' },
  { label: 'ぬいぐるみ', href: '/products?tag=ぬいぐるみ' },
  { label: 'イラスト', href: '/products?tag=イラスト' },
  { label: '書籍', href: '/products?tag=書籍' },
  { label: 'アクリルスタンド', href: '/products?tag=アクリルスタンド' },
  { label: 'キーホルダー', href: '/products?tag=キーホルダー' },
  { label: 'ステッカー', href: '/products?tag=ステッカー' },
];

const FEATURES = [
  {
    emoji: '🐺',
    title: 'ケモナー特化',
    desc: 'ケモノ・獣人テーマに特化したフィギュア・イラスト・書籍専門のマーケットプレイス。',
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
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
          <span className="absolute left-8 top-8 text-8xl opacity-[0.07]">🐺</span>
          <span className="absolute right-16 top-12 text-6xl opacity-[0.06]">🦊</span>
          <span className="absolute bottom-6 left-1/4 text-7xl opacity-[0.05]">🐯</span>
          <span className="absolute bottom-10 right-1/3 text-5xl opacity-[0.06]">🐻</span>
        </div>

        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center md:py-36">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-300">
            <span>🐾</span>
            <span>ケモナー向けクリエイターマーケット</span>
          </div>
          <h1 className="mb-5 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            ケモノ作品を
            <br />
            <span className="text-orange-400">もっと身近に</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-slate-300">
            ケモノ系フィギュア・イラスト・書籍・グッズの専門マーケット。
            <br className="hidden sm:block" />
            お気に入りの作家を見つけて、直接応援しよう。
          </p>
          <Link href="/products">
            <Button size="lg" className="px-8 text-base shadow-lg shadow-orange-900/30">
              作品を探す
            </Button>
          </Link>
          <p className="mt-5 text-sm text-slate-500">
            作家の方は{' '}
            <Link
              href="/register"
              className="text-slate-400 underline underline-offset-2 transition-colors hover:text-white"
            >
              こちらから出品登録
            </Link>
          </p>
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

      {/* ── New & Featured products ───────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">新着・おすすめ作品</h2>
          <Link href="/products" className="text-sm text-primary hover:underline">
            すべて見る →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {TEST_PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                <span className="text-6xl">{product.emoji}</span>
                {product.isNew && (
                  <span className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                    NEW
                  </span>
                )}
              </div>
              <div className="p-3">
                <span className="text-xs text-muted-foreground">{product.category}</span>
                <p className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug group-hover:text-primary">
                  {product.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{product.artist}</p>
                <p className="mt-2 font-bold text-foreground">¥{product.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Commission request (仮) ───────────────────────────── */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-1 flex items-center gap-2">
            <h2 className="text-xl font-bold">作家に依頼する</h2>
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
              準備中
            </span>
          </div>
          <p className="mb-6 text-sm text-muted-foreground">
            イラスト・SSなどのオリジナル作品を作家に直接依頼できます。
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {TEST_ARTISTS.filter((a) => a.acceptingCommissions).map((artist) => (
              <div
                key={artist.id}
                className="flex items-start gap-4 rounded-xl border border-border bg-white p-5 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-2xl">
                  {artist.emoji}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">{artist.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{artist.specialty}</p>
                  <p className="mt-1 text-xs text-muted-foreground">作品数: {artist.works}</p>
                  <button
                    disabled
                    className="mt-3 cursor-not-allowed rounded-md bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-600 opacity-60"
                  >
                    依頼する（準備中）
                  </button>
                </div>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-5 text-center">
              <span className="mb-2 text-3xl">✏️</span>
              <p className="text-sm font-medium">あなたの依頼を届けよう</p>
              <p className="mt-1 text-xs text-muted-foreground">依頼機能は近日公開予定です</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured artists ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">注目の作家</h2>
          <Link href="/products" className="text-sm text-primary hover:underline">
            すべての作家 →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {TEST_ARTISTS.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.id}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-amber-100 text-3xl">
                {artist.emoji}
              </div>
              <div>
                <p className="font-semibold">{artist.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{artist.specialty}</p>
                <p className="mt-1 text-xs text-muted-foreground">作品数: {artist.works}</p>
                {artist.acceptingCommissions && (
                  <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    依頼受付中
                  </span>
                )}
              </div>
            </Link>
          ))}
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
    </main>
  );
}
