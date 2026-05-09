'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/use-auth';

const schema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => login.mutate(data);

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
            <h1 className="text-xl font-bold">ログイン</h1>
            <p className="text-sm text-muted-foreground">アカウントにサインインしてください</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                autoComplete="current-password"
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {login.error && (
              <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                メールアドレスまたはパスワードが正しくありません
              </div>
            )}

            <Button type="submit" className="w-full h-11" isLoading={login.isPending}>
              ログイン
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          アカウントをお持ちでない方は{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            無料登録
          </Link>
        </p>
      </div>
    </div>
  );
}
