'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUploadProduct } from '@/hooks/use-products';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
const MAX_SIZE_MB = 100;

const schema = z.object({
  title: z.string().min(1, 'タイトルを入力してください').max(100),
  description: z.string().max(2000).optional(),
  price: z.coerce.number().int().min(0, '0以上を入力してください').max(100_000),
  isNsfw: z.boolean().optional(),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function UploadPage() {
  const router = useRouter();
  const upload = useUploadProduct();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFileError(null);
    if (!file) return setSelectedFile(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError('JPEG/PNG/WebP/GIF/PDF のみアップロードできます');
      return setSelectedFile(null);
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`ファイルサイズは${MAX_SIZE_MB}MB以内にしてください`);
      return setSelectedFile(null);
    }
    setSelectedFile(file);
  };

  const onSubmit = (data: FormData) => {
    if (!selectedFile) {
      setFileError('ファイルを選択してください');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('isNsfw', String(data.isNsfw ?? false));
    if (data.tags) formData.append('tags', data.tags);
    upload.mutate(formData);
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← 戻る
        </button>
        <h1 className="text-2xl font-bold">作品をアップロード</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* File */}
        <div className="space-y-1">
          <Label>ファイル</Label>
          <div
            onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-border p-8 hover:bg-muted transition-colors"
          >
            {selectedFile ? (
              <p className="text-sm font-medium">{selectedFile.name}</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">クリックしてファイルを選択</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  JPEG / PNG / WebP / GIF / PDF（最大100MB）
                </p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleFileChange}
            className="hidden"
          />
          {fileError && <p className="text-xs text-red-500">{fileError}</p>}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <Label htmlFor="title">タイトル</Label>
          <Input id="title" {...register('title')} />
          {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <Label htmlFor="description">説明（任意）</Label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-1">
          <Label htmlFor="price">価格（円）</Label>
          <Input id="price" type="number" min={0} max={100000} {...register('price')} />
          <p className="text-xs text-muted-foreground">0円で無料公開</p>
          {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
        </div>

        {/* Tags */}
        <div className="space-y-1">
          <Label htmlFor="tags">タグ（任意）</Label>
          <Input id="tags" placeholder="ケモノ, オリキャラ, PG13" {...register('tags')} />
          <p className="text-xs text-muted-foreground">カンマ区切りで入力</p>
        </div>

        {/* NSFW */}
        <div className="flex items-center gap-2">
          <input
            id="isNsfw"
            type="checkbox"
            {...register('isNsfw')}
            className="h-4 w-4 rounded border-border"
          />
          <Label htmlFor="isNsfw">R18コンテンツ</Label>
        </div>

        {upload.error && (
          <p className="text-sm text-red-500">アップロードに失敗しました。再度お試しください。</p>
        )}

        <Button type="submit" className="w-full" isLoading={upload.isPending}>
          アップロード
        </Button>
      </form>
    </div>
  );
}
