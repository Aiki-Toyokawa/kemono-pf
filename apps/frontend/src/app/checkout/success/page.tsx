'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="text-5xl">✓</div>
      <h1 className="text-2xl font-bold">購入が完了しました</h1>
      <p className="text-muted-foreground">購入履歴からダウンロードできます。</p>
      <div className="flex gap-4">
        <Link href="/my/purchases">
          <Button>購入履歴を見る</Button>
        </Link>
        <Link href="/products">
          <Button variant="outline">作品を探す</Button>
        </Link>
      </div>
    </div>
  );
}
