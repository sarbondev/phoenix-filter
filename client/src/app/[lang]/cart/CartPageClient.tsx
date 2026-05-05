'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { t, formatPrice, getImageUrl } from '@/shared/lib/utils';
import { Button, EmptyState } from '@/shared/ui';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { removeFromCart, updateQuantity } from '@/store/cartSlice';

interface Props { locale: Locale; dict: Dictionary }

export function CartPageClient({ locale, dict }: Props) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);

  const subtotal = items.reduce((sum, i) => sum + (i.product.discountPrice ?? i.product.price) * i.quantity, 0);
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <EmptyState
          icon={<ShoppingBag className="h-7 w-7" />}
          title={dict.cart.empty}
          action={
            <Link href={`/${locale}/products`}>
              <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
                {dict.cart.continueShopping}
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-slate-900 mb-8">
        {dict.cart.title}
      </motion.h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-4 rounded-2xl bg-white border border-slate-200 p-4"
              >
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-50">
                  {item.product.images[0] ? (
                    <Image src={getImageUrl(item.product.images[0])} alt={t(item.product.name, locale)} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/${locale}/products/${item.product.slug}`} className="font-semibold text-slate-900 hover:text-primary transition-colors line-clamp-1">
                    {t(item.product.name, locale)}
                  </Link>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {formatPrice(item.product.discountPrice ?? item.product.price)} UZS
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => dispatch(updateQuantity({ id: item.product.id, quantity: item.quantity - 1 }))}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="flex h-11 w-11 items-center justify-center text-slate-500 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => dispatch(updateQuantity({ id: item.product.id, quantity: item.quantity + 1 }))}
                        disabled={item.product.stock != null && item.quantity >= item.product.stock}
                        aria-label="Increase quantity"
                        className="flex h-11 w-11 items-center justify-center text-slate-500 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-slate-900">
                        {formatPrice((item.product.discountPrice ?? item.product.price) * item.quantity)} UZS
                      </span>
                      <button
                        type="button"
                        onClick={() => dispatch(removeFromCart(item.product.id))}
                        aria-label="Remove item"
                        className="flex h-11 w-11 items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="sticky top-24 rounded-2xl bg-white border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">{dict.cart.orderSummary}</h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">{dict.cart.subtotal}</span>
                <span className="font-medium text-slate-900">{formatPrice(subtotal)} UZS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{dict.cart.shipping}</span>
                <span className="font-medium text-slate-900">
                  {shipping === 0 ? dict.cart.freeShipping : `${formatPrice(shipping)} UZS`}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-4 flex justify-between">
                <span className="font-semibold text-slate-900">{dict.cart.total}</span>
                <span className="text-xl font-bold text-slate-900">{formatPrice(total)} UZS</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">{dict.cart.freeShippingNote}</p>

            <Link href={`/${locale}/checkout`} className="block mt-6">
              <Button size="lg" fullWidth icon={<ArrowRight className="h-5 w-5" />}>
                {dict.cart.checkout}
              </Button>
            </Link>

            <Link href={`/${locale}/products`} className="mt-3 block text-center text-sm text-primary hover:underline">
              {dict.cart.continueShopping}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
