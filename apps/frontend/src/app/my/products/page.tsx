'use client';

import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMyProducts } from '@/hooks/use-products';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  PENDING: { label: '処理中', className: 'bg-amber-100 text-amber-800' },
  READY: { label: '非公開', className: 'bg-slate-100 text-slate-700' },
  PUBLISHED: { label: '公開中', className: 'bg-emerald-100 text-emerald-700' },
  REJECTED: { label: '非承認', className: 'bg-red-100 text-red-700' },
};

function PublishToggle({ id, status }: { id: string; status: string }) {
  const qc = useQueryClient();
  const publish = useMutation({
    mutationFn: () => api.patch(`/products/${id}/publish`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products', 'my'] }),
  });
  const unpublish = useMutation({
    mutationFn: () => api.patch(`/products/${id}/unpublish`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products', 'my'] }),
  });

  if (status === 'READY') {
    return (
      <Button size="sm" onClick={() => publish.mutate()} isLoading={publish.isPending}>
        公開する
      </Button>
    );
  }
  if (status === 'PUBLISHED') {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => unpublish.mutate()}
        isLoading={unpublish.isPending}
      >
        非公開にする
      </Button>
    );
  }
  return null;
}

export default function MyProductsPage() {
  const { data: products, isLoading } = useMyProducts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">マイ作品</h1>
          {products && (
            <p className="mt-0.5 text-sm text-muted-foreground">{products.length}件の作品</p>
          )}
        </div>
        <Link href="/upload">
          <Button>＋ 新しく出品</Button>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!isLoading && products?.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-border bg-white py-16 text-center">
          <span className="mb-3 text-5xl">📦</span>
          <p className="font-medium">まだ作品がありません</p>
          <p className="mt-1 text-sm text-muted-foreground">
            最初の作品をアップロードしてみましょう
          </p>
          <Link href="/upload" className="mt-5">
            <Button>作品をアップロードする</Button>
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {products?.map((p) => {
          const badge = STATUS_BADGE[p.status] ?? STATUS_BADGE.READY;
          return (
            <div key={p.id} className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                {/* Thumbnail placeholder */}
                <div className="h-14 w-14 shrink-0 rounded-lg bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center text-2xl">
                  🐾
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-semibold">{p.title}</p>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {p.price === 0 ? (
                      <span className="font-medium text-emerald-600">無料</span>
                    ) : (
                      <span className="font-medium text-orange-600">
                        ¥{p.price.toLocaleString()}
                      </span>
                    )}
                    {p.isNsfw && (
                      <span className="ml-2 rounded-md bg-red-100 px-1.5 text-xs font-medium text-red-700">
                        R18
                      </span>
                    )}
                  </p>
                  {p.tags.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {p.tags.map(({ tag }) => (
                        <span
                          key={tag.id}
                          className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  <PublishToggle id={p.id} status={p.status} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
