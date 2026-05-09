'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegister } from '@/hooks/use-auth';

const schema = z
  .object({
    displayName: z
      .string()
      .min(1, '表示名を入力してください')
      .max(50, '表示名は50文字以内で入力してください'),
    handle: z
      .string()
      .min(3, 'ユーザーIDは3文字以上で入力してください')
      .max(20, 'ユーザーIDは20文字以内で入力してください')
      .regex(/^[a-zA-Z0-9_]+$/, '英数字とアンダースコア(_)のみ使用できます'),
    email: z.string().email('有効なメールアドレスを入力してください'),
    password: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください')
      .max(72, 'パスワードは72文字以内で入力してください'),
    confirmPassword: z.string().min(1, '確認用パスワードを入力してください'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

// 横幅があるときに左ラベル・右入力欄のグリッドレイアウトにするラッパー
function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-y-1.5 sm:grid-cols-[11rem_1fr] sm:items-start sm:gap-x-3 sm:gap-y-0">
      <div className="sm:pt-2 sm:text-right">
        <Label htmlFor={htmlFor}>{label}</Label>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground sm:leading-tight">{hint}</p>}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export default function RegisterPage() {
  const register_ = useRegister();
  const [isArtist, setIsArtist] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = ({ confirmPassword: _, ...data }: FormData) =>
    register_.mutate({ ...data, isArtist });

  return (
    <div className="flex min-h-[calc(100vh-112px)] items-center justify-center p-4">
      <div className="w-full max-w-lg">
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
            <Field label="表示名" htmlFor="displayName">
              <Input
                id="displayName"
                autoComplete="nickname"
                placeholder="例：けもの太郎"
                {...register('displayName')}
              />
              {errors.displayName && (
                <p className="text-xs text-red-500">{errors.displayName.message}</p>
              )}
            </Field>

            <Field label="ユーザーID" htmlFor="handle" hint="英数字・_ のみ、3〜20文字">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  @
                </span>
                <Input
                  id="handle"
                  autoComplete="username"
                  placeholder="kemono_taro"
                  className="pl-7"
                  {...register('handle')}
                />
              </div>
              {errors.handle && <p className="text-xs text-red-500">{errors.handle.message}</p>}
            </Field>

            <Field label="メールアドレス" htmlFor="email">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="例：kemono@example.com"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </Field>

            <Field label="パスワード" htmlFor="password">
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="8文字以上"
                  className="pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </Field>

            <Field label="パスワード（確認）" htmlFor="confirmPassword">
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="8文字以上"
                  className="pr-10"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </Field>

            {/* Artist toggle */}
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isArtist}
                    onChange={(e) => setIsArtist(e.target.checked)}
                  />
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                      isArtist ? 'border-orange-500 bg-orange-500' : 'border-border bg-white'
                    }`}
                  >
                    {isArtist && (
                      <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">🎨 作家としても出品したい</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    チェックすると作品の出品・売上管理ができます。後からでも変更できます。
                  </p>
                </div>
              </label>
            </div>

            {register_.error && (
              <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {(register_.error as any)?.response?.data?.message ??
                  '登録に失敗しました。入力内容をご確認ください。'}
              </div>
            )}

            <Button type="submit" className="w-full h-11" isLoading={register_.isPending}>
              {isArtist ? '作家として新規登録する' : '新規で登録する'}
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
