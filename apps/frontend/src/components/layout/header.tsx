'use client';

import Link from 'next/link';
import { useMe, useLogout } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

export function Header() {
  const { data: user } = useMe();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-50 bg-slate-900 shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl leading-none">🐾</span>
          <span className="font-bold text-white text-lg leading-none">
            kemono<span className="text-orange-400">PF</span>
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/products"
            className="rounded px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            作品を探す
          </Link>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin/products"
                  className="hidden sm:block rounded px-2 py-1 text-xs text-orange-400 hover:text-orange-300 hover:bg-slate-800 transition-colors"
                >
                  管理
                </Link>
              )}
              <Link
                href="/my/purchases"
                className="hidden sm:block rounded px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                購入履歴
              </Link>
              <Link
                href="/my/products"
                className="hidden sm:block rounded px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                マイ作品
              </Link>
              <Link href="/upload">
                <Button size="sm" className="hidden sm:inline-flex">
                  出品する
                </Button>
              </Link>
              <Link
                href="/my/settings"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white hover:bg-orange-400 transition-colors"
                title={user.displayName}
              >
                {user.displayName[0].toUpperCase()}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                ログイン
              </Link>
              <Link href="/register">
                <Button size="sm">無料登録</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
