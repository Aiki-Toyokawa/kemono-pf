import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  isNsfw: boolean;
  author: { id: string; displayName: string };
  tags: { tag: { id: string; name: string } }[];
}

export function ProductCard({ id, title, price, isNsfw, author, tags }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        {/* Thumbnail */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
            <span className="text-7xl opacity-10">🐾</span>
          </div>
          {isNsfw && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <span className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-bold text-white tracking-widest">
                R-18
              </span>
            </div>
          )}
          {price === 0 && (
            <div className="absolute top-2 left-2">
              <span className="rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                FREE
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground group-hover:text-primary transition-colors">
            {title}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">by {author.displayName}</p>
          <div className="mt-2 flex items-center justify-between">
            <span
              className={cn(
                'text-sm font-bold',
                price === 0 ? 'text-emerald-600' : 'text-orange-600',
              )}
            >
              {price === 0 ? '無料' : `¥${price.toLocaleString()}`}
            </span>
          </div>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.slice(0, 2).map(({ tag }) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
