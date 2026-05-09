'use client';

import { useParams } from 'next/navigation';
import { useUserProfile, useUserProducts } from '@/hooks/use-users';
import { ProductCard } from '@/components/product-card';

export default function ArtistPage() {
  const { id } = useParams<{ id: string }>();
  const { data: profile, isLoading: profileLoading } = useUserProfile(id);
  const { data: products } = useUserProducts(id);

  if (profileLoading) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!profile)
    return <div className="p-8 text-center text-muted-foreground">ユーザーが見つかりません</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
          {profile.displayName[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{profile.displayName}</h1>
          {profile.bio && <p className="mt-1 text-sm text-muted-foreground">{profile.bio}</p>}
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold">公開作品</h2>
      {products?.length === 0 && <p className="text-muted-foreground">まだ公開作品がありません</p>}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {products?.map((p: any) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
}
