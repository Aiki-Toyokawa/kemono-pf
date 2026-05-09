'use client';

import Link from 'next/link';
import { useMe } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

export function Header() {
  const { data: user } = useMe();
  const { count: cartCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === '/';
  const large = isHome && !scrolled;

  useEffect(() => {
    if (!isHome) return;
    function onScroll() {
      setScrolled((prev) => {
        if (!prev && window.scrollY > 80) return true;
        if (prev && window.scrollY < 20) return false;
        return prev;
      });
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-slate-900 shadow-lg transition-all duration-300 ${large ? 'h-24' : 'h-14'}`}
    >
      <div className="relative mx-auto flex h-full max-w-6xl items-center px-4">
        {/* Logo — left */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span
            className={`leading-none transition-all duration-300 ${large ? 'text-5xl' : 'text-xl'}`}
          >
            🐾
          </span>
          <span
            className={`font-bold leading-none text-white transition-all duration-300 ${large ? 'text-3xl' : 'text-lg'}`}
          >
            kemono<span className="text-orange-400">PF</span>
            {user?.isNsfwEnabled && (
              <span
                className={`ml-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-300 ${
                  large ? 'text-xl' : 'text-sm'
                }`}
              >
                +18
              </span>
            )}
          </span>
        </Link>

        {/* Search bar — スクロール後のみ表示 */}
        <form
          onSubmit={handleSearch}
          className="absolute left-1/2 hidden w-full max-w-sm -translate-x-1/2 md:block"
        >
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="作品・作家を検索..."
              className="w-full rounded-full border border-slate-700 bg-slate-800 py-1.5 pl-4 pr-8 text-sm text-white placeholder-slate-400 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
              aria-label="検索"
            >
              <Search size={14} />
            </button>
          </div>
        </form>

        {/* Right */}
        <div className={`ml-auto flex shrink-0 items-center ${large ? 'gap-3' : 'gap-2'}`}>
          {/* Cart icon — always visible */}
          <Link
            href="/cart"
            className={`relative flex items-center justify-center rounded-md text-slate-400 transition-all duration-300 hover:bg-slate-800 hover:text-white ${
              large ? 'h-11 w-11' : 'h-8 w-8'
            }`}
            aria-label="カート"
          >
            <ShoppingCart size={large ? 24 : 18} />
            {cartCount > 0 && (
              <span
                className={`absolute -right-1 -top-1 flex items-center justify-center rounded-full bg-orange-500 font-bold leading-none text-white ${
                  large ? 'h-5 w-5 text-xs' : 'h-4 w-4 text-[10px]'
                }`}
              >
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin/products"
                  className={`hidden rounded text-orange-400 transition-colors hover:bg-slate-800 hover:text-orange-300 sm:block ${
                    large ? 'px-3 py-1.5 text-sm' : 'px-2 py-1 text-xs'
                  }`}
                >
                  管理
                </Link>
              )}
              {(user.role === 'ARTIST' || user.role === 'ADMIN') && (
                <Link href="/upload" className="hidden sm:block">
                  <Button size={large ? 'default' : 'sm'}>出品する</Button>
                </Link>
              )}
              {/* Avatar with dropdown */}
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className={`flex shrink-0 items-center justify-center rounded-full bg-orange-500 font-bold text-white transition-all duration-300 hover:bg-orange-400 ${
                    large ? 'h-11 w-11 text-sm' : 'h-8 w-8 text-xs'
                  }`}
                  title={user.displayName}
                >
                  {user.displayName[0].toUpperCase()}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-10 z-50 w-44 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
                    <div className="border-b border-border px-3 py-2">
                      <p className="truncate text-xs font-medium text-foreground">
                        {user.displayName}
                      </p>
                      {user.handle ? (
                        <p className="truncate text-xs text-muted-foreground/70">@{user.handle}</p>
                      ) : (
                        <p className="text-xs text-orange-400/80">ID未設定（設定から登録）</p>
                      )}
                    </div>
                    <nav className="py-1">
                      <Link
                        href="/my/purchases"
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        購入履歴
                      </Link>
                      {(user.role === 'ARTIST' || user.role === 'ADMIN') && (
                        <Link
                          href="/my/products"
                          onClick={() => setMenuOpen(false)}
                          className="block px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                        >
                          マイ作品
                        </Link>
                      )}
                      <Link
                        href="/my/settings"
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        設定
                      </Link>
                    </nav>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`rounded text-slate-300 transition-colors hover:bg-slate-800 hover:text-white ${
                  large ? 'px-4 py-2 text-base' : 'px-3 py-1.5 text-sm'
                }`}
              >
                ログイン
              </Link>
              <Link href="/register">
                <Button size={large ? 'default' : 'sm'}>無料登録</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
