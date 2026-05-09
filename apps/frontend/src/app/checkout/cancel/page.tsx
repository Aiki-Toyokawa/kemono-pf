'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function CheckoutCancelPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="text-5xl">✕</div>
      <h1 className="text-2xl font-bold">購入をキャンセルしました</h1>
      <p className="text-muted-foreground">決済がキャンセルされました。</p>
      <Button onClick={() => router.back()}>戻る</Button>
    </div>
  );
}
