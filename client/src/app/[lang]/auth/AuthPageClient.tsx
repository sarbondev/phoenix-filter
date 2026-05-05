'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User, Filter, Eye, EyeOff } from 'lucide-react';
import { Phone } from 'lucide-react';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { Button, PhoneInput } from '@/shared/ui';
import { useLoginMutation, useRegisterMutation } from '@/store/api/authApi';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { setAuth } from '@/store/authSlice';
import { addToast } from '@/store/toastSlice';

interface Props { locale: Locale; dict: Dictionary }

export function AuthPageClient({ locale, dict }: Props) {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || `/${locale}`;
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('+998');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const isLoading = loginLoading || registerLoading;

  useEffect(() => {
    if (token) {
      router.replace(`/${locale}`);
    }
  }, [token, locale, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (phone.length < 13) {
      setError(`${dict.auth.phoneNumber} ${dict.auth.fieldIncomplete}`);
      return;
    }
    if (!password) {
      setError(`${dict.auth.password} ${dict.auth.fieldRequired}`);
      return;
    }

    try {
      if (isLogin) {
        const res = await login({ phoneNumber: phone, password }).unwrap();
        dispatch(setAuth({ token: res.accessToken, user: res.user }));
        dispatch(addToast({ message: `${dict.auth.login} ✓`, type: 'success' }));
      } else {
        if (!name.trim()) {
          setError(`${dict.auth.name} ${dict.auth.fieldRequired}`);
          return;
        }
        const res = await register({ phoneNumber: phone, password, name }).unwrap();
        dispatch(setAuth({ token: res.accessToken, user: res.user }));
        dispatch(addToast({ message: `${dict.auth.register} ✓`, type: 'success' }));
      }
      router.push(redirectTo);
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string; errors?: Record<string, string[]> } };
      if (apiErr.data?.errors) {
        const msgs = Object.values(apiErr.data.errors).flat();
        setError(msgs.join('. '));
      } else {
        setError(apiErr.data?.message || dict.common.error);
      }
    }
  };

  if (token) return null;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex rounded-2xl bg-primary/10 p-4">
            <Filter className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isLogin ? dict.auth.login : dict.auth.register}
          </h1>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{dict.auth.name}</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder={dict.auth.name}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            )}

            <PhoneInput
              label={dict.auth.phoneNumber}
              icon={<Phone className="h-4 w-4" />}
              value={phone}
              onValueChange={setPhone}
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{dict.auth.password}</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? dict.auth.hidePassword : dict.auth.showPassword}
                  className="absolute inset-y-0 right-0 flex h-full w-11 items-center justify-center text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!isLogin && (
                <p className="mt-1 text-xs text-slate-400">{dict.auth.passwordHint}</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" fullWidth loading={isLoading} className="!py-3">
              {isLogin ? dict.auth.login : dict.auth.register}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? dict.auth.noAccount : dict.auth.hasAccount}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
