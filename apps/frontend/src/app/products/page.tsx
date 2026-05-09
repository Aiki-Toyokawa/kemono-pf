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

const SORT_OPTIONS = [
  { value: 'newest', label: '新着順' },
  { value: 'price_asc', label: '価格が安い順' },
  { value: 'price_desc', label: '価格が高い順' },
];

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

  const handleSearch = () => {
    setQuery(search);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">作品を探す</h1>
        {data && (
          <p className="mt-1 text-sm text-muted-foreground">
            {data.total.toLocaleString()}件の作品
            {query && ` — 「${query}」の検索結果`}
          </p>
        )}
      </div>

      {/* Search bar */}
      <div className="mb-6 flex gap-2">
        <Input
          placeholder="タイトル・タグで検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="max-w-md bg-white"
        />
        <Button onClick={handleSearch}>検索</Button>
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

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {/* Empty */}
      {!isLoading && data?.items.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white py-20 text-center">
          <span className="mb-3 text-5xl">🔍</span>
          <p className="font-medium text-foreground">
            {query ? `「${query}」に一致する作品が見つかりませんでした` : 'まだ作品がありません'}
          </p>
          {query && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearch('');
                setQuery('');
              }}
            >
              すべての作品を見る
            </Button>
          )}
        </div>
      )}

      {/* Grid */}
      {!isLoading && data && data.items.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {data.items.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            ← 前へ
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 w-8 rounded text-sm font-medium transition-colors ${
                    page === p
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-white hover:bg-muted'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            次へ →
          </Button>
        </div>
      )}
    </div>
  );
}
