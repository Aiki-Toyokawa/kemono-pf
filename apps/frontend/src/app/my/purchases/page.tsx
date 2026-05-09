'use client';

import { useMyOrders, useDownloadLink } from '@/hooks/use-orders';
import { Button } from '@/components/ui/button';

function DownloadButton({ orderId }: { orderId: string }) {
  const dl = useDownloadLink(orderId);
  return (
    <Button size="sm" variant="outline" onClick={() => dl.mutate()} isLoading={dl.isPending}>
      ⬇ DL
    </Button>
  );
}

export default function PurchasesPage() {
  const { data: orders, isLoading } = useMyOrders();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold">購入履歴</h1>
        {orders && <p className="mt-0.5 text-sm text-muted-foreground">{orders.length}件の購入</p>}
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!isLoading && orders?.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-border bg-white py-16 text-center">
          <span className="mb-3 text-5xl">🛒</span>
          <p className="font-medium">まだ購入した作品がありません</p>
          <p className="mt-1 text-sm text-muted-foreground">気になる作品を見つけてみましょう</p>
        </div>
      )}

      <div className="space-y-3">
        {orders?.map((order) => (
          <div
            key={order.id}
            className="flex items-center gap-4 rounded-xl border border-border bg-white p-4 shadow-sm"
          >
            {/* Thumbnail */}
            <div className="h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center text-xl">
              🐾
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-sm">{order.product.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {order.amount === 0 ? (
                  <span className="font-medium text-emerald-600">無料</span>
                ) : (
                  <span className="font-medium text-orange-600">
                    ¥{order.amount.toLocaleString()}
                  </span>
                )}
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
