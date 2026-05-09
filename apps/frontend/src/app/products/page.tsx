'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProductsResponse {
  items: {
    id: string;
    title: string;
    price: number;
    isNsfw: boolean;
    author: { id: string; displayName: string };
    tags: { tag: { id: string; name: string } }[];
  }[];
  total: number;
  page: number;
  limit: number;
}

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<ProductsResponse>({
    queryKey: ['products', query, page],
    queryFn: () =>
      api
        .get('/products', { params: { search: query || undefined, page, limit: 20 } })
        .then((r) => r.data),
  });

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">作品を探す</h1>

      <div className="mb-6 flex gap-2">
        <Input
          placeholder="タイトルで検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setQuery(search);
              setPage(1);
            }
          }}
          className="max-w-sm"
        />
        <Button
          onClick={() => {
            setQuery(search);
            setPage(1);
          }}
        >
          検索
        </Button>
        {query && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch('');
              setQuery('');
              setPage(1);
            }}
          >
            クリア
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!isLoading && data?.items.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          {query ? `「${query}」に一致する作品が見つかりませんでした` : 'まだ作品がありません'}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {data?.items.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            前へ
          </Button>
          <span className="flex items-center px-3 text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            次へ
          </Button>
        </div>
      )}
    </div>
  );
}
