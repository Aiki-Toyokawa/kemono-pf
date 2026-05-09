'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useMe } from '@/hooks/use-auth';
import { useUpdateProfile } from '@/hooks/use-users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  displayName: z.string().min(1).max(50),
  bio: z.string().max(500).optional(),
  isNsfwEnabled: z.boolean(),
});
type FormData = z.infer<typeof schema>;

export default function SettingsPage() {
  const { data: me } = useMe();
  const update = useUpdateProfile();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (me)
      reset({ displayName: me.displayName, bio: me.bio ?? '', isNsfwEnabled: me.isNsfwEnabled });
  }, [me, reset]);

  const onSubmit = (data: FormData) => update.mutate(data);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">設定</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1">
          <Label htmlFor="displayName">表示名</Label>
          <Input id="displayName" {...register('displayName')} />
          {errors.displayName && (
            <p className="text-xs text-red-500">{errors.displayName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="bio">自己紹介</Label>
          <textarea
            id="bio"
            {...register('bio')}
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="flex items-center gap-3 rounded-md border border-border p-4">
          <input
            id="isNsfwEnabled"
            type="checkbox"
            {...register('isNsfwEnabled')}
            className="h-4 w-4"
          />
          <div>
            <Label htmlFor="isNsfwEnabled">R18コンテンツを表示する</Label>
            <p className="text-xs text-muted-foreground">
              成人向けコンテンツを検索・閲覧できるようになります
            </p>
          </div>
        </div>

        {update.isSuccess && <p className="text-sm text-green-600">保存しました</p>}
        {update.error && <p className="text-sm text-red-500">保存に失敗しました</p>}

        <Button type="submit" isLoading={update.isPending}>
          保存する
        </Button>
      </form>
    </div>
  );
}
