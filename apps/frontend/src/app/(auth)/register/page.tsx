'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegister } from '@/hooks/use-auth';

const schema = z.object({
  displayName: z
    .string()
    .min(1, '表示名を入力してください')
    .max(50, '表示名は50文字以内で入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(72, 'パスワードは72文字以内で入力してください'),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const register_ = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => register_.mutate(data);

  return (
    <div className="flex min-h-[calc(100vh-112px)] items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold text-foreground">
              kemono<span className="text-orange-500">PF</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
          <div className="mb-6 space-y-1 text-center">
            <h1 className="text-xl font-bold">新規登録</h1>
            <p className="text-sm text-muted-foreground">無料でアカウントを作成できます</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="displayName">表示名</Label>
              <Input
                id="displayName"
                autoComplete="nickname"
                placeholder="例：けもの太郎"
                {...register('displayName')}
              />
              {errors.displayName && (
                <p className="text-xs text-red-500">{errors.displayName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" type="email" autoComplete="email" {...register('email')} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="8文字以上"
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {register_.error && (
              <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                登録に失敗しました。このメールアドレスは既に使用されている可能性があります
              </div>
            )}

            <Button type="submit" className="w-full h-11" isLoading={register_.isPending}>
              無料で登録する
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            登録することで利用規約とプライバシーポリシーに同意したことになります
          </p>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          既にアカウントをお持ちの方は{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
