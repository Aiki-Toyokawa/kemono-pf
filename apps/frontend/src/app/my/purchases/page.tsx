'use client';

import { useMyOrders, useDownloadLink } from '@/hooks/use-orders';
import { Button } from '@/components/ui/button';

function DownloadButton({ orderId }: { orderId: string }) {
  const dl = useDownloadLink(orderId);
  return (
    <Button size="sm" onClick={() => dl.mutate()} isLoading={dl.isPending}>
      ダウンロード
    </Button>
  );
}

export default function PurchasesPage() {
  const { data: orders, isLoading } = useMyOrders();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">購入履歴</h1>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!isLoading && orders?.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">まだ購入した作品がありません</p>
      )}

      <div className="space-y-3">
        {orders?.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between rounded-md border border-border p-4 gap-4"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{order.product.title}</p>
              <p className="text-sm text-muted-foreground">
                {order.amount === 0 ? '無料' : `¥${order.amount.toLocaleString()}`}
                {' · '}
                {new Date(order.createdAt).toLocaleDateString('ja-JP')}
              </p>
            </div>
            <DownloadButton orderId={order.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
