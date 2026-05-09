'use client';

import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMyProducts } from '@/hooks/use-products';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  PENDING: { label: '処理中', className: 'bg-yellow-100 text-yellow-800' },
  READY: { label: '非公開', className: 'bg-gray-100 text-gray-800' },
  PUBLISHED: { label: '公開中', className: 'bg-green-100 text-green-800' },
  REJECTED: { label: '非承認', className: 'bg-red-100 text-red-800' },
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
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">マイ作品</h1>
        <Link href="/upload">
          <Button>アップロード</Button>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!isLoading && products?.length === 0 && (
        <div className="rounded-md border border-dashed border-border py-12 text-center">
          <p className="text-muted-foreground">まだ作品がありません</p>
          <Link href="/upload" className="mt-4 inline-block">
            <Button variant="outline">最初の作品をアップロード</Button>
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {products?.map((p) => {
          const s = STATUS_LABEL[p.status] ?? STATUS_LABEL.READY;
          return (
            <div key={p.id} className="rounded-md border border-border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {p.price === 0 ? '無料' : `¥${p.price.toLocaleString()}`}
                    {p.isNsfw && (
                      <span className="ml-2 rounded bg-red-100 px-1 text-xs text-red-700">R18</span>
                    )}
                  </p>
                  {p.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.tags.map(({ tag }) => (
                        <span
                          key={tag.id}
                          className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.className}`}>
                    {s.label}
                  </span>
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
