'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useMe } from '@/hooks/use-auth';
import { usePurchase, useDownloadLink } from '@/hooks/use-orders';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductDetail {
  id: string;
  title: string;
  description: string | null;
  price: number;
  isNsfw: boolean;
  status: string;
  createdAt: string;
  author: { id: string; displayName: string; avatarUrl: string | null };
  tags: { tag: { id: string; name: string } }[];
  files: { filename: string; mimeType: string; sizeBytes: number }[];
  hasPurchased: boolean;
  purchasedOrderId: string | null;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: me } = useMe();
  const purchase = usePurchase();

  const { data: product, isLoading } = useQuery<ProductDetail>({
    queryKey: ['products', id],
    queryFn: () => api.get(`/products/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const downloadMutation = useDownloadLink(product?.purchasedOrderId ?? '');

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!product)
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <span className="text-4xl">😢</span>
        <p className="text-muted-foreground">作品が見つかりません</p>
        <Link href="/products">
          <Button variant="outline">作品一覧へ戻る</Button>
        </Link>
      </div>
    );

  const isOwner = me?.id === product.author.id;
  const isFree = product.price === 0;
  const file = product.files[0];

  const handlePurchase = async () => {
    if (!me) return router.push('/login');
    const result = await purchase.mutateAsync(id);
    if (result.free) {
      window.location.reload();
    } else if (result.checkoutUrl) {
      window.location.href = result.checkoutUrl;
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:underline">
          ホーム
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:underline">
          作品一覧
        </Link>
        <span>/</span>
        <span className="truncate max-w-[200px]">{product.title}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        {/* Left: Preview + Description */}
        <div>
          {/* Thumbnail */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 aspect-[4/3]">
            <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
              <span className="text-9xl opacity-10">🐾</span>
            </div>
            {product.isNsfw && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/75 backdrop-blur-sm">
                <span className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white tracking-widest">
                  R-18
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-6 rounded-xl border border-border bg-white p-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                作品概要
              </h2>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">
                {product.description}
              </p>
            </div>
          )}

          {/* Author card */}
          <div className="mt-4 rounded-xl border border-border bg-white p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              作家情報
            </h2>
            <Link href={`/artists/${product.author.id}`} className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                {product.author.displayName[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">
                  {product.author.displayName}
                </p>
                <p className="text-xs text-muted-foreground">作家ページを見る →</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Right: Purchase */}
        <div className="space-y-4">
          {/* Tags + Title */}
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {product.isNsfw && (
                <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                  R-18
                </span>
              )}
              {product.tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <h1 className="text-xl font-bold leading-snug">{product.title}</h1>
            <Link
              href={`/artists/${product.author.id}`}
              className="mt-1 text-sm text-muted-foreground hover:text-primary hover:underline"
            >
              by {product.author.displayName}
            </Link>
          </div>

          {/* Price + Buy */}
          <div className="rounded-xl border-2 border-orange-200 bg-gradient-to-b from-orange-50 to-amber-50 p-5">
            <div className="mb-4">
              <span
                className={cn(
                  'text-3xl font-extrabold',
                  isFree ? 'text-emerald-600' : 'text-orange-600',
                )}
              >
                {isFree ? '無料' : `¥${product.price.toLocaleString()}`}
              </span>
              {!isFree && <span className="ml-2 text-xs text-muted-foreground">（税込）</span>}
            </div>

            {isOwner ? (
              <div className="rounded-lg bg-white border border-border px-4 py-3 text-center text-sm text-muted-foreground">
                これはあなたの作品です
              </div>
            ) : product.hasPurchased ? (
              <Button
                className="w-full h-11 text-sm"
                onClick={() => downloadMutation.mutate()}
                isLoading={downloadMutation.isPending}
              >
                ⬇ ダウンロード
              </Button>
            ) : (
              <Button
                className="w-full h-11 text-sm shadow-md shadow-orange-200"
                onClick={handlePurchase}
                isLoading={purchase.isPending}
              >
                {isFree ? '無料でダウンロード' : `¥${product.price.toLocaleString()} で購入する`}
              </Button>
            )}

            {purchase.error && (
              <p className="mt-2 text-center text-xs text-red-500">購入に失敗しました</p>
            )}
          </div>

          {/* File info */}
          {file && (
            <div className="rounded-xl border border-border bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                ファイル情報
              </h3>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">ファイル名</dt>
                  <dd className="font-medium truncate max-w-[150px]">{file.filename}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">サイズ</dt>
                  <dd className="font-medium">
                    {(Number(file.sizeBytes) / 1024 / 1024).toFixed(1)} MB
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">形式</dt>
                  <dd className="font-medium">{file.mimeType.split('/')[1]?.toUpperCase()}</dd>
                </div>
              </dl>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            公開日: {new Date(product.createdAt).toLocaleDateString('ja-JP')}
          </p>
        </div>
      </div>
    </div>
  );
}
