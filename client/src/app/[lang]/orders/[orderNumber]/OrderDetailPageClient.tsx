'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Package, Phone, MapPin, ArrowLeft } from 'lucide-react';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { useAppSelector } from '@/shared/hooks';
import { useGetOrderByNumberQuery } from '@/store/api/orderApi';
import { Badge, Button, Skeleton } from '@/shared/ui';
import { formatPrice, t, getImageUrl } from '@/shared/lib/utils';

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  PENDING: 'warning', CONFIRMED: 'info', PROCESSING: 'info',
  SHIPPED: 'info', DELIVERED: 'success', CANCELLED: 'danger',
};

interface Props {
  locale: Locale;
  dict: Dictionary;
  orderNumber: string;
}

export function OrderDetailPageClient({ locale, dict, orderNumber }: Props) {
  const auth = useAppSelector((s) => s.auth);
  const { data: order, isLoading, isError } = useGetOrderByNumberQuery(orderNumber, {
    skip: !auth.token,
  });

  if (!auth.token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg text-slate-600 mb-6">{dict.auth.loginRequired}</p>
          <Link href={`/${locale}/auth?redirect=/${locale}/orders/${orderNumber}`}>
            <Button>{dict.auth.login}</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Skeleton className="h-32 rounded-2xl mb-6" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-lg text-slate-600 mb-6">{dict.common.error}</p>
        <Link href={`/${locale}/orders`}>
          <Button variant="outline">{dict.checkout.myOrders}</Button>
        </Link>
      </div>
    );
  }

  const addr = order.shippingAddress;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={`/${locale}/orders`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {dict.checkout.myOrders}
      </Link>

      {/* Confirmation hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-6 mb-6"
      >
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-emerald-100 p-3 flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900">
              {dict.checkout.orderSuccess}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {dict.checkout.orderSuccessDesc}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                {dict.checkout.orderNumber}
              </span>
              <span className="font-mono text-sm font-bold text-slate-900">
                {order.orderNumber}
              </span>
              <Badge variant={statusVariant[order.status] ?? 'default'}>
                {dict.orders.statuses[order.status as keyof typeof dict.orders.statuses] || order.status}
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Items */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Package className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-900">{dict.cart.title}</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {order.items.map((item, i) => {
            const prod = typeof item.product === 'object' && item.product !== null ? item.product : null;
            const name = prod?.name ? t(prod.name, locale) : '-';
            const image = prod?.images?.[0] ?? null;
            return (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-slate-50 border border-slate-200">
                  {image ? (
                    <Image src={getImageUrl(image)} alt={name} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <Package className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 line-clamp-1">{name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    x{item.quantity} · {formatPrice(item.price)} UZS
                  </p>
                </div>
                <p className="font-semibold text-slate-900 text-right">
                  {formatPrice(item.total)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 space-y-1.5 text-sm">
          {order.subtotal != null && (
            <div className="flex justify-between text-slate-600">
              <span>{dict.cart.subtotal}</span>
              <span>{formatPrice(order.subtotal)} UZS</span>
            </div>
          )}
          {order.shippingCost != null && (
            <div className="flex justify-between text-slate-600">
              <span>{dict.cart.shipping}</span>
              <span>
                {order.shippingCost === 0
                  ? dict.cart.freeShipping
                  : `${formatPrice(order.shippingCost)} UZS`}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-base">
            <span>{dict.cart.total}</span>
            <span>{formatPrice(order.totalAmount)} UZS</span>
          </div>
        </div>
      </div>

      {/* Shipping */}
      {addr && (
        <div className="rounded-2xl bg-white border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            {dict.checkout.shippingAddress}
          </h2>
          <p className="font-medium text-slate-900">{addr.fullName}</p>
          <a
            href={`tel:${addr.phoneNumber.replace(/\s/g, '')}`}
            className="mt-1 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <Phone className="h-3.5 w-3.5" />
            {addr.phoneNumber}
          </a>
          <p className="mt-2 text-sm text-slate-600 flex items-start gap-1.5">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-slate-400" />
            <span>
              {addr.region}, {addr.district}
              <br />
              {addr.address}
            </span>
          </p>
          {addr.note && (
            <p className="mt-3 text-sm text-slate-500 italic">"{addr.note}"</p>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Link href={`/${locale}/products`}>
          <Button variant="outline">{dict.cart.continueShopping}</Button>
        </Link>
      </div>
    </div>
  );
}
