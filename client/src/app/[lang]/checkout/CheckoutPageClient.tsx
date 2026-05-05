'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { Button, Input, PhoneInput } from '@/shared/ui';
import { useAppSelector, useAppDispatch } from '@/shared/hooks';
import { useCreateOrderMutation } from '@/store/api/orderApi';
import { clearCart } from '@/store/cartSlice';
import { addToast } from '@/store/toastSlice';
import { formatPrice, t } from '@/shared/lib/utils';
import { UZ_REGIONS } from '@/shared/data/uz-regions';

interface Props { locale: Locale; dict: Dictionary }

type Form = {
  fullName: string;
  phoneNumber: string;
  region: string;
  district: string;
  address: string;
  note: string;
};

type Errors = Partial<Record<keyof Form, string>>;

export function CheckoutPageClient({ locale, dict }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);
  const cartItems = useAppSelector((s) => s.cart.items);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [topError, setTopError] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const [form, setForm] = useState<Form>({
    fullName: auth.user?.name || '',
    phoneNumber: auth.user?.phoneNumber || '',
    region: '',
    district: '',
    address: '',
    note: '',
  });

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const districts = useMemo(() => {
    return UZ_REGIONS.find((r) => r.name === form.region)?.districts ?? [];
  }, [form.region]);

  const subtotal = cartItems.reduce(
    (sum, i) => sum + (i.product.discountPrice ?? i.product.price) * i.quantity,
    0,
  );
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  // Empty cart → bounce. Use effect so it doesn't run during render.
  useEffect(() => {
    if (cartItems.length === 0) router.push(`/${locale}/cart`);
  }, [cartItems.length, locale, router]);

  if (!auth.token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <p className="text-lg text-slate-600 mb-6">{dict.auth.loginRequired}</p>
          <Link href={`/${locale}/auth?redirect=/${locale}/checkout`}>
            <Button>{dict.auth.login}</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.fullName.trim()) e.fullName = `${dict.checkout.fullName} ${dict.auth.fieldRequired}`;
    if (form.phoneNumber.length < 13) e.phoneNumber = `${dict.checkout.phone} ${dict.auth.fieldIncomplete}`;
    if (!form.region) e.region = `${dict.checkout.region} ${dict.auth.fieldRequired}`;
    if (!form.district) e.district = `${dict.checkout.district} ${dict.auth.fieldRequired}`;
    if (!form.address.trim()) e.address = `${dict.checkout.address} ${dict.auth.fieldRequired}`;
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTopError('');

    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    try {
      const res = await createOrder({
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
      // Redirect to a permanent confirmation page (survives refresh).
      router.replace(`/${locale}/orders/${res.orderNumber}`);
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setTopError(apiErr.data?.message || dict.checkout.orderFailed);
    }
  };

  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-8">
      <Link href={`/${locale}/cart`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4" />
        {dict.cart.title}
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mb-8">{dict.checkout.title}</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                {dict.checkout.shippingAddress}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className={labelClass}>{dict.checkout.fullName}</label>
                  <Input
                    id="fullName"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(e) => set('fullName', e.target.value)}
                    error={errors.fullName}
                  />
                </div>
                <div>
                  <label className={labelClass}>{dict.checkout.phone}</label>
                  <PhoneInput
                    value={form.phoneNumber}
                    onValueChange={(val) => set('phoneNumber', val)}
                    error={errors.phoneNumber}
                  />
                </div>
                <div>
                  <label htmlFor="region" className={labelClass}>{dict.checkout.region}</label>
                  <select
                    id="region"
                    value={form.region}
                    onChange={(e) => {
                      set('region', e.target.value);
                      set('district', '');
                    }}
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/15 ${
                      errors.region ? 'border-red-400 focus:border-red-400 focus:ring-red-500/15' : 'border-slate-200 focus:border-primary'
                    }`}
                  >
                    <option value="">{dict.checkout.selectRegion}</option>
                    {UZ_REGIONS.map((r) => (
                      <option key={r.name} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                  {errors.region && <p className="mt-1.5 text-xs text-red-500">{errors.region}</p>}
                </div>
                <div>
                  <label htmlFor="district" className={labelClass}>{dict.checkout.district}</label>
                  <select
                    id="district"
                    value={form.district}
                    onChange={(e) => set('district', e.target.value)}
                    disabled={!form.region}
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:bg-slate-50 disabled:text-slate-400 ${
                      errors.district ? 'border-red-400 focus:border-red-400 focus:ring-red-500/15' : 'border-slate-200 focus:border-primary'
                    }`}
                  >
                    <option value="">{dict.checkout.selectDistrict}</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {errors.district && <p className="mt-1.5 text-xs text-red-500">{errors.district}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className={labelClass}>{dict.checkout.address}</label>
                  <Input
                    id="address"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={(e) => set('address', e.target.value)}
                    error={errors.address}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="note" className={labelClass}>{dict.checkout.note}</label>
                  <Input
                    id="note"
                    value={form.note}
                    onChange={(e) => set('note', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary — desktop / sticky right column */}
          <div>
            <div className="sticky top-24 rounded-2xl bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">{dict.cart.orderSummary}</h2>
              <div className="space-y-3 text-sm mb-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <span className="text-slate-600 truncate max-w-[60%]">
                      {t(item.product.name, locale)} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice((item.product.discountPrice ?? item.product.price) * item.quantity)}
                    </span>
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

              {topError && <p className="mt-4 text-sm text-red-500">{topError}</p>}

              <Button type="submit" fullWidth className="mt-6 hidden lg:flex" loading={isLoading}>
                {dict.checkout.placeOrder}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile sticky CTA */}
        <div className="fixed inset-x-0 bottom-0 z-30 lg:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-500">{dict.cart.total}</span>
            <span className="text-base font-bold text-slate-900">{formatPrice(total)} UZS</span>
          </div>
          <Button type="submit" fullWidth loading={isLoading}>
            {dict.checkout.placeOrder}
          </Button>
        </div>
      </form>
    </div>
  );
}
