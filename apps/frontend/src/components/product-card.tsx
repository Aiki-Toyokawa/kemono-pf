import Link from 'next/link';

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
    <Link href={`/products/${id}`} className="block">
      <div className="group rounded-md border border-border p-4 hover:border-primary transition-colors">
        <div className="mb-3 flex aspect-video items-center justify-center rounded bg-muted text-muted-foreground text-sm">
          作品
        </div>
        <p className="truncate font-medium group-hover:text-primary">{title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          by{' '}
          <span
            className="hover:underline"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/artists/${author.id}`;
            }}
          >
            {author.displayName}
          </span>
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold">
            {price === 0 ? '無料' : `¥${price.toLocaleString()}`}
          </span>
          <div className="flex gap-1">
            {isNsfw && (
              <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-700">R18</span>
            )}
          </div>
        </div>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.slice(0, 3).map(({ tag }) => (
              <span
                key={tag.id}
                className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
