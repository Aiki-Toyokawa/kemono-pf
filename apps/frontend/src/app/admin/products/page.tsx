'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface AdminProduct {
  id: string;
  title: string;
  price: number;
  isNsfw: boolean;
  status: string;
  createdAt: string;
  author: { id: string; displayName: string; email: string };
  tags: { tag: { id: string; name: string } }[];
  files: { filename: string; mimeType: string; sizeBytes: number }[];
}

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const { data: products, isLoading } = useQuery<AdminProduct[]>({
    queryKey: ['admin', 'products'],
    queryFn: () => api.get('/admin/products').then((r) => r.data),
  });

  const reject = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/products/${id}/reject`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });
  const restore = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/products/${id}/restore`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });

  const STATUS_LABEL: Record<string, string> = {
    READY: '非公開',
    PUBLISHED: '公開中',
    REJECTED: '非承認',
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">作品管理</h1>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      <div className="space-y-3">
        {products?.map((p) => (
          <div key={p.id} className="rounded-md border border-border p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-muted-foreground">
                  {p.author.displayName} ({p.author.email})
                </p>
                <p className="text-sm text-muted-foreground">
                  {p.price === 0 ? '無料' : `¥${p.price.toLocaleString()}`}
                  {p.isNsfw && <span className="ml-2 text-red-600">R18</span>}
                  {' · '}
                  {p.files[0]?.filename}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(p.createdAt).toLocaleDateString('ja-JP')}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-medium">{STATUS_LABEL[p.status] ?? p.status}</span>
                <div className="flex gap-2">
                  {p.status !== 'REJECTED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => reject.mutate(p.id)}
                      isLoading={reject.isPending}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      非承認
                    </Button>
                  )}
                  {p.status === 'REJECTED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => restore.mutate(p.id)}
                      isLoading={restore.isPending}
                    >
                      復元
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && products?.length === 0 && (
        <p className="text-center text-muted-foreground">対象の作品がありません</p>
      )}
    </div>
  );
}
