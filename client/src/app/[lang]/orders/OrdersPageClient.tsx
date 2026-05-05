'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ShoppingBag } from 'lucide-react';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { useAppSelector } from '@/shared/hooks';
import { useGetMyOrdersQuery } from '@/store/api/orderApi';
import { Button, Badge, EmptyState, OrderRowSkeleton, AuthRequired } from '@/shared/ui';
import { formatPrice, t, getImageUrl } from '@/shared/lib/utils';

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  PENDING: 'warning', CONFIRMED: 'info', PROCESSING: 'info',
  SHIPPED: 'info', DELIVERED: 'success', CANCELLED: 'danger',
};

interface Props { locale: Locale; dict: Dictionary }

export function OrdersPageClient({ locale, dict }: Props) {
  const auth = useAppSelector((s) => s.auth);
  const { data, isLoading } = useGetMyOrdersQuery(undefined, { skip: !auth.token });

  if (!auth.token) {
    return (
      <AuthRequired
        loginHref={`/${locale}/auth?redirect=/${locale}/orders`}
        message={dict.auth.loginRequired}
        loginLabel={dict.auth.login}
      />
    );
  }

  const orders = data?.data ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-slate-900 mb-8"
      >
        {dict.checkout.myOrders}
      </motion.h1>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <OrderRowSkeleton key={i} />)}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-7 w-7" />}
          title={dict.cart.empty}
          action={
            <Link href={`/${locale}/products`}>
              <Button>{dict.cart.continueShopping}</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-primary/40 transition-colors"
            >
              {/* Header — clickable */}
              <Link
                href={`/${locale}/orders/${order.orderNumber}`}
                className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 px-6 py-4 border-b border-slate-100 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Package className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-mono text-sm font-semibold text-slate-900">{order.orderNumber}</p>
                    <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant[order.status] ?? 'default'}>{dict.orders.statuses[order.status as keyof typeof dict.orders.statuses] || order.status}</Badge>
                  <span className="font-semibold text-slate-900">{formatPrice(order.totalAmount)} UZS</span>
                </div>
              </Link>

              {/* Items */}
              <div className="p-6">
                <div className="flex flex-wrap gap-4">
                  {order.items.map((item, j) => {
                    const prod = item.product;
                    const isObj = typeof prod === 'object' && prod !== null;
                    const prodName = isObj && prod.name ? t(prod.name, locale) : '-';
                    const prodImage = isObj && prod.images && prod.images[0] ? prod.images[0] : null;
                    return (
                      <div key={j} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 pr-5">
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-white border border-slate-200">
                          {prodImage ? (
                            <Image src={getImageUrl(prodImage)} alt={prodName} fill className="object-cover" sizes="56px" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-6 w-6 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 line-clamp-1">{prodName}</p>
                          <p className="text-xs text-slate-500">x{item.quantity} · {formatPrice(item.total)} UZS</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
