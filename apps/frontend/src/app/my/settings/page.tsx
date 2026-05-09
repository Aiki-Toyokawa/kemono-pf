'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useMe, useLogout } from '@/hooks/use-auth';
import { useUpdateProfile } from '@/hooks/use-users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  displayName: z.string().min(1, '表示名を入力してください').max(50),
  bio: z.string().max(500).optional(),
  isNsfwEnabled: z.boolean(),
});
type FormData = z.infer<typeof schema>;

export default function SettingsPage() {
  const { data: me } = useMe();
  const update = useUpdateProfile();
  const logout = useLogout();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (me)
      reset({ displayName: me.displayName, bio: me.bio ?? '', isNsfwEnabled: me.isNsfwEnabled });
  }, [me, reset]);

  const onSubmit = (data: FormData) => update.mutate(data);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold">設定</h1>
      <p className="mb-7 text-sm text-muted-foreground">プロフィールと表示設定を管理します</p>

      {/* Profile section */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          プロフィール
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="displayName">表示名</Label>
            <Input id="displayName" {...register('displayName')} className="bg-background" />
            {errors.displayName && (
              <p className="text-xs text-red-500">{errors.displayName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">自己紹介</Label>
            <textarea
              id="bio"
              {...register('bio')}
              rows={4}
              placeholder="あなたについて教えてください..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-4">
            <input
              id="isNsfwEnabled"
              type="checkbox"
              {...register('isNsfwEnabled')}
              className="h-4 w-4 rounded accent-primary cursor-pointer"
            />
            <div>
              <Label htmlFor="isNsfwEnabled" className="cursor-pointer">
                R18コンテンツを表示する
              </Label>
              <p className="text-xs text-muted-foreground">
                成人向けコンテンツを検索・閲覧できるようになります
              </p>
            </div>
          </div>

          {update.isSuccess && (
            <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              ✓ 保存しました
            </p>
          )}
          {update.error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              保存に失敗しました
            </p>
          )}

          <Button type="submit" isLoading={update.isPending} className="w-full sm:w-auto">
            変更を保存
          </Button>
        </form>
      </div>

      {/* Danger zone / Logout */}
      <div className="mt-6 rounded-2xl border border-red-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-red-100 bg-red-50 px-6 py-3">
          <h2 className="text-sm font-semibold text-red-800">アカウント操作</h2>
        </div>
        <div className="p-6">
          <p className="mb-4 text-sm text-muted-foreground">
            ログアウトするとセッションが終了します。再度利用するにはログインが必要です。
          </p>
          <button
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="w-full rounded-md bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {logout.isPending ? 'ログアウト中...' : 'ログアウト'}
          </button>
        </div>
      </div>
    </div>
  );
}
