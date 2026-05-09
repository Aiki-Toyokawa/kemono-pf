import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/providers/query-provider';
import { Header } from '@/components/layout/header';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'kemonoPF — ケモノフィギュア専門マーケット',
  description: 'ケモノ・獣人系フィギュア・グッズの専門クリエイターマーケット',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <QueryProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <footer className="border-t border-border bg-slate-900 text-slate-400">
              <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🐾</span>
                  <span className="font-semibold text-white text-sm">
                    kemono<span className="text-orange-400">PF</span>
                  </span>
                </div>
                <p className="text-xs">© 2025 kemonoPF. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
