'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { Button, Input, PhoneInput } from '@/shared/ui';
import { useAppSelector, useAppDispatch } from '@/shared/hooks';
import { useCreateOrderMutation } from '@/store/api/orderApi';
import { clearCart } from '@/store/cartSlice';
import { addToast } from '@/store/toastSlice';
import { formatPrice, t } from '@/shared/lib/utils';

interface Props { locale: Locale; dict: Dictionary }

export function CheckoutPageClient({ locale, dict }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);
  const cartItems = useAppSelector((s) => s.cart.items);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: auth.user?.name || '',
    phoneNumber: auth.user?.phoneNumber || '',
    region: '',
    district: '',
    address: '',
    note: '',
  });

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const subtotal = cartItems.reduce((sum, i) => sum + (i.product.discountPrice ?? i.product.price) * i.quantity, 0);
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  // Redirect to auth if not logged in
  if (!auth.token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <p className="text-lg text-slate-600 mb-6">{dict.auth.loginRequired}</p>
          <Link href={`/${locale}/auth`}>
            <Button>{dict.auth.login}</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (cartItems.length === 0 && !success) {
    router.push(`/${locale}/cart`);
    return null;
  }

  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="mx-auto mb-6 inline-flex rounded-full bg-emerald-50 p-6">
            <CheckCircle className="h-16 w-16 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{dict.checkout.orderSuccess}</h2>
          <p className="mt-2 text-slate-500">{dict.checkout.orderSuccessDesc}</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href={`/${locale}`}>
              <Button variant="outline">{dict.checkout.backToHome}</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.fullName || !form.phoneNumber || !form.region || !form.district || !form.address) {
      setError('Please fill all required fields');
      return;
    }

    try {
      await createOrder({
        items: cartItems.map((i) => ({ product: i.product.id, quantity: i.quantity })),
        shippingAddress: {
          fullName: form.fullName,
          phoneNumber: form.phoneNumber,
          region: form.region,
          district: form.district,
          address: form.address,
          note: form.note || undefined,
        },
      }).unwrap();
      dispatch(clearCart());
      dispatch(addToast({ message: dict.checkout.orderSuccess, type: 'success' }));
      setSuccess(true);
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setError(apiErr.data?.message || 'Failed to place order');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href={`/${locale}/cart`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4" />
        {dict.cart.title}
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mb-8">{dict.checkout.title}</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <div className="rounded-2xl bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">{dict.checkout.shippingAddress}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input placeholder={dict.checkout.fullName} value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />
                <PhoneInput
                  value={form.phoneNumber}
                  onValueChange={(val) => set('phoneNumber', val)}
                />
                <Input placeholder={dict.checkout.region} value={form.region} onChange={(e) => set('region', e.target.value)} />
                <Input placeholder={dict.checkout.district} value={form.district} onChange={(e) => set('district', e.target.value)} />
                <div className="sm:col-span-2">
                  <Input placeholder={dict.checkout.address} value={form.address} onChange={(e) => set('address', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <Input placeholder={dict.checkout.note} value={form.note} onChange={(e) => set('note', e.target.value)} />
                </div>
              </div>
            </div>

          </div>

          {/* Summary */}
          <div>
            <div className="sticky top-24 rounded-2xl bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">{dict.cart.orderSummary}</h2>
              <div className="space-y-3 text-sm mb-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <span className="text-slate-600 truncate max-w-[60%]">{t(item.product.name, locale)} x{item.quantity}</span>
                    <span className="font-medium">{formatPrice((item.product.discountPrice ?? item.product.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm border-t border-slate-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">{dict.cart.subtotal}</span>
                  <span>{formatPrice(subtotal)} UZS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{dict.cart.shipping}</span>
                  <span>{shipping === 0 ? dict.cart.freeShipping : `${formatPrice(shipping)} UZS`}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-slate-100 pt-2">
                  <span>{dict.cart.total}</span>
                  <span>{formatPrice(total)} UZS</span>
                </div>
              </div>

              {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

              <Button type="submit" fullWidth className="mt-6" loading={isLoading}>
                {dict.checkout.placeOrder}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
