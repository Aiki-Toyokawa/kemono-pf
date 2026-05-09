import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-5xl font-bold">kemono-pf</h1>
      <p className="max-w-md text-muted-foreground">
        ケモナー向けクリエイタープラットフォーム。
        <br />
        作品を売ったり、お気に入りの作家を支援しよう。
      </p>
      <div className="flex gap-4">
        <Link href="/products">
          <Button size="lg">作品を探す</Button>
        </Link>
        <Link href="/register">
          <Button variant="outline" size="lg">
            作家として登録
          </Button>
        </Link>
      </div>
    </main>
  );
}
