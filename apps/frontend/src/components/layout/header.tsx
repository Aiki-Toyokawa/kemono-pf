'use client';

import Link from 'next/link';
import { useMe, useLogout } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

export function Header() {
  const { data: user } = useMe();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">
          kemono-pf
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/products"
            className="rounded px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            作品を探す
          </Link>

          {user ? (
            <>
              <Link
                href="/upload"
                className="rounded px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                アップロード
              </Link>
              <Link
                href="/my/products"
                className="rounded px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                マイ作品
              </Link>
              <Link
                href="/my/purchases"
                className="rounded px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                購入履歴
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin/products"
                  className="rounded px-3 py-1.5 text-sm text-orange-600 hover:text-orange-700"
                >
                  管理
                </Link>
              )}
              <Link href="/my/settings">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {user.displayName[0].toUpperCase()}
                </span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => logout.mutate()}>
                ログアウト
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  ログイン
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">新規登録</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
