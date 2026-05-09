'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useMe } from '@/hooks/use-auth';
import { usePurchase, useDownloadLink } from '@/hooks/use-orders';
import { Button } from '@/components/ui/button';

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
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!product)
    return <div className="p-8 text-center text-muted-foreground">作品が見つかりません</div>;

  const isOwner = me?.id === product.author.id;
  const isFree = product.price === 0;

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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">{product.title}</h1>
            {product.isNsfw && (
              <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                R18
              </span>
            )}
          </div>

          <Link
            href={`/artists/${product.author.id}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            by {product.author.displayName}
          </Link>

          {product.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {product.tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 flex aspect-video items-center justify-center rounded-md bg-muted text-muted-foreground">
        プレビュー
      </div>

      {product.description && (
        <div className="mb-6 rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">
          {product.description}
        </div>
      )}

      <div className="rounded-md border border-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-2xl font-bold">
            {isFree ? '無料' : `¥${product.price.toLocaleString()}`}
          </span>
          {product.files[0] && (
            <span className="text-xs text-muted-foreground">
              {product.files[0].filename}（
              {(Number(product.files[0].sizeBytes) / 1024 / 1024).toFixed(1)} MB）
            </span>
          )}
        </div>

        {isOwner ? (
          <p className="text-sm text-muted-foreground">自分の作品です</p>
        ) : product.hasPurchased ? (
          <Button
            className="w-full"
            onClick={() => downloadMutation.mutate()}
            isLoading={downloadMutation.isPending}
          >
            ダウンロード
          </Button>
        ) : (
          <Button className="w-full" onClick={handlePurchase} isLoading={purchase.isPending}>
            {isFree ? '無料でダウンロード' : `¥${product.price.toLocaleString()} で購入`}
          </Button>
        )}

        {purchase.error && <p className="mt-2 text-sm text-red-500">購入に失敗しました</p>}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        公開日: {new Date(product.createdAt).toLocaleDateString('ja-JP')}
      </p>
    </div>
  );
}
