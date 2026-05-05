import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Filter, Phone, Lock } from 'lucide-react';
import { z } from 'zod';
import { useLoginMutation } from '@/store/api/authApi';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { setCredentials } from '@/store/authSlice';
import { Button, Input, Card } from '@/components/ui';
import { PhoneInput } from '@/components/ui/PhoneInput';

const loginSchema = z.object({
  phoneNumber: z.string().regex(/^\+\d{12}$/, 'Phone number is incomplete'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const { t } = useTranslation();
  const { token, user } = useAppSelector((s) => s.auth);

  if (token && user && user.role !== 'CLIENT') {
    return <Navigate to="/" replace />;
  }
  const [phoneDigits, setPhoneDigits] = useState('+998');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [topError, setTopError] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setTopError(null);

    const result = loginSchema.safeParse({ phoneNumber: phoneDigits, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      const res = await login(result.data).unwrap();
      if (res.user.role === 'CLIENT') {
        setTopError(t('auth.accessDenied'));
        return;
      }
      dispatch(setCredentials({ token: res.accessToken, user: res.user }));
      navigate('/');
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setTopError(apiErr.data?.message || t('auth.loginFailed'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
            <Filter className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{t('sidebar.filterSystem')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('sidebar.adminPanel')}</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {topError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {topError}
              </div>
            )}
            <PhoneInput
              label={t('auth.phoneNumber')}
              icon={<Phone className="h-4 w-4" />}
              value={phoneDigits}
              onValueChange={setPhoneDigits}
              error={errors.phoneNumber}
            />
            <Input
              label={t('auth.password')}
              type="password"
              placeholder={t('auth.enterPassword')}
              icon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            <Button type="submit" className="w-full" loading={isLoading}>
              {t('auth.login')}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
