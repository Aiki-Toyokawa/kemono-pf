'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useMe, useLogout } from '@/hooks/use-auth';
import { useUpdateProfile, useUpgradeToArtist } from '@/hooks/use-users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  displayName: z.string().min(1, '表示名を入力してください').max(50),
  handle: z
    .string()
    .min(3, 'ユーザーIDは3文字以上で入力してください')
    .max(20, 'ユーザーIDは20文字以内で入力してください')
    .regex(/^[a-zA-Z0-9_]+$/, '英数字とアンダースコア(_)のみ使用できます')
    .optional()
    .or(z.literal('')),
  bio: z.string().max(500).optional(),
  isNsfwEnabled: z.boolean(),
});
type FormData = z.infer<typeof schema>;

export default function SettingsPage() {
  const { data: me } = useMe();
  const update = useUpdateProfile();
  const upgrade = useUpgradeToArtist();
  const logout = useLogout();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (me)
      reset({
        displayName: me.displayName,
        handle: me.handle ?? '',
        bio: me.bio ?? '',
        isNsfwEnabled: me.isNsfwEnabled,
      });
  }, [me, reset]);

  const onSubmit = (data: FormData) => {
    const payload = { ...data, handle: data.handle || undefined };
    update.mutate(payload);
  };

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
            <Label htmlFor="handle">
              ユーザーID
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                （英数字・_ のみ、3〜20文字）
              </span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                @
              </span>
              <Input
                id="handle"
                autoComplete="username"
                placeholder="kemono_taro"
                className="bg-background pl-7"
                {...register('handle')}
              />
            </div>
            {errors.handle && <p className="text-xs text-red-500">{errors.handle.message}</p>}
            {!me?.handle && (
              <p className="text-xs text-orange-500">
                ユーザーIDが未設定です。設定するとドロップダウンに表示されます。
              </p>
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

      {/* Artist upgrade — USER ロールのみ表示 */}
      {me?.role === 'USER' && (
        <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            作家登録
          </h2>
          <p className="mb-4 mt-3 text-sm text-foreground">
            作家登録すると、作品の出品・売上管理ができるようになります。
            <br />
            追加のメールアドレスやパスワードは不要です。
          </p>
          {upgrade.isSuccess ? (
            <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              ✓ 作家登録が完了しました。出品機能が利用できます。
            </p>
          ) : (
            <>
              {upgrade.error && (
                <p className="mb-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                  登録に失敗しました。もう一度お試しください。
                </p>
              )}
              <button
                onClick={() => upgrade.mutate()}
                disabled={upgrade.isPending}
                className="rounded-md bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-60"
              >
                {upgrade.isPending ? '処理中...' : '🎨 作家として登録する'}
              </button>
            </>
          )}
        </div>
      )}

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
