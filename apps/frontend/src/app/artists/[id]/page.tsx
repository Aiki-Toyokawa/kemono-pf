'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useUserProfile, useUserProducts } from '@/hooks/use-users';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';

export default function ArtistPage() {
  const { id } = useParams<{ id: string }>();
  const { data: profile, isLoading: profileLoading } = useUserProfile(id);
  const { data: products } = useUserProducts(id);

  if (profileLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <span className="text-4xl">😢</span>
        <p className="text-muted-foreground">ユーザーが見つかりません</p>
        <Link href="/products">
          <Button variant="outline">作品一覧へ戻る</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Profile header */}
      <div className="mb-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-orange-500 text-2xl font-extrabold text-white shadow-md">
            {profile.displayName[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold">{profile.displayName}</h1>
            {profile.bio ? (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground max-w-lg">
                {profile.bio}
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">自己紹介なし</p>
            )}
            {products && (
              <p className="mt-2 text-xs text-muted-foreground">公開作品 {products.length}件</p>
            )}
          </div>
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="mb-4 text-lg font-bold">公開作品</h2>

        {products?.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-border bg-white py-14 text-center">
            <span className="mb-3 text-4xl">📦</span>
            <p className="text-muted-foreground">まだ公開作品がありません</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products?.map((p: any) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </div>
  );
}
