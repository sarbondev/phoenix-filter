"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import {
  ShoppingCart,
  Bookmark,
  Star,
  Minus,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { useGetProductBySlugQuery } from "@/store/api/productApi";
import { useGetProductReviewsQuery } from "@/store/api/reviewApi";
import {
  t,
  formatPrice,
  getDiscountPercent,
  getImageUrl,
} from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { addToCart, updateQuantity } from "@/store/cartSlice";
import { toggleWishlist } from "@/store/wishlistSlice";
import { addToast } from "@/store/toastSlice";

interface Props {
  locale: Locale;
  dict: Dictionary;
  slug: string;
}

export function ProductDetailClient({ locale, dict, slug }: Props) {
  const { data: product, isLoading } = useGetProductBySlugQuery(slug);
  const { data: reviewData } = useGetProductReviewsQuery(product?.id ?? "", {
    skip: !product,
  });
  const [selectedImage, setSelectedImage] = useState(0);
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector((s) => s.wishlist.ids);
  const cartItem = useAppSelector((s) =>
    s.cart.items.find((i) => i.product.id === product?.id),
  );
  const isWished = product ? wishlistIds.includes(product.id) : false;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-500">{dict.products.noProducts}</p>
      </div>
    );
  }

  const discount = getDiscountPercent(product.price, product.discountPrice);
  const effectivePrice = product.discountPrice ?? product.price;
  const avgRating = reviewData?.average ?? 5;
  const reviewCount = reviewData?.count ?? 0;

  return (
    <div className="bg-white py-6 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href={`/${locale}/products`}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[var(--color-brand)] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {dict.products.all}
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              {product.images[selectedImage] ? (
                <Image
                  src={getImageUrl(product.images[selectedImage])}
                  alt={t(product.name, locale)}
                  fill
                  className="object-contain p-8"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-300">
                  <ShoppingCart className="h-16 w-16" />
                </div>
              )}
              {discount > 0 && (
                <span className="absolute top-4 left-4 inline-flex items-center rounded-md bg-[var(--color-accent)] px-3 py-1 text-sm font-bold text-white">
                  -{discount}%
                </span>
              )}
              <button
                onClick={() => {
                  dispatch(toggleWishlist(product.id));
                  dispatch(
                    addToast({
                      message: isWished
                        ? dict.common.removedFromWishlist
                        : dict.common.addedToWishlist,
                      type: "info",
                    }),
                  );
                }}
                aria-label={dict.wishlist.title}
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:scale-105 transition-transform"
              >
                <Bookmark
                  className={`h-5 w-5 ${
                    isWished
                      ? "fill-[var(--color-brand)] text-[var(--color-brand)]"
                      : "text-slate-400"
                  }`}
                />
              </button>
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      i === selectedImage
                        ? "border-[var(--color-brand)]"
                        : "border-[var(--color-border)]"
                    }`}
                  >
                    <Image
                      src={getImageUrl(img)}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i <= Math.round(avgRating)
                        ? "fill-[var(--color-highlight)] text-[var(--color-highlight)]"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[12px] text-slate-500">
                ({reviewCount > 0 ? `${reviewCount} ${dict.products.reviews}` : "0 reviews"})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {t(product.name, locale)}
            </h1>

            {typeof product.category === "object" && product.category?.name && (
              <p className="mt-2 text-[13px] text-[var(--color-brand)] font-semibold">
                {t(product.category.name, locale)}
              </p>
            )}

            {/* Description */}
            <div className="mt-6">
              <h3 className="section-title text-lg text-slate-900 mb-3">
                {dict.products.description}
              </h3>
              <p className="text-[14px] text-slate-600 leading-relaxed whitespace-pre-line">
                {t(product.description, locale)}
              </p>
            </div>

            {/* Specifications */}
            {product.specifications.length > 0 && (
              <div className="mt-6">
                <h3 className="section-title text-lg text-slate-900 mb-3">
                  {dict.products.specifications}
                </h3>
                <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
                  {product.specifications.map((spec, i) => (
                    <div
                      key={i}
                      className={`flex justify-between text-[13.5px] px-4 py-2.5 ${
                        i % 2 === 0 ? "bg-[var(--color-surface)]" : "bg-white"
                      }`}
                    >
                      <span className="text-slate-500">
                        {t(spec.key, locale)}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {t(spec.value, locale)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price + actions */}
            <div className="mt-auto pt-8">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-extrabold text-slate-900">
                  {formatPrice(effectivePrice)}
                  <span className="ml-1 text-base font-medium text-slate-400">
                    {dict.common.currency}
                  </span>
                </span>
                {discount > 0 && (
                  <span className="text-lg text-slate-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {cartItem ? (
                  <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-2 py-1">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: product.id,
                            quantity: cartItem.quantity - 1,
                          }),
                        )
                      }
                      className="p-2 text-slate-500 hover:text-[var(--color-brand)]"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-semibold text-slate-900">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: product.id,
                            quantity: cartItem.quantity + 1,
                          }),
                        )
                      }
                      className="p-2 text-slate-500 hover:text-[var(--color-brand)]"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={product.stock === 0}
                    onClick={() => {
                      dispatch(addToCart(product));
                      dispatch(
                        addToast({
                          message: dict.common.addedToCart,
                          type: "success",
                        }),
                      );
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] disabled:bg-slate-200 disabled:text-slate-400 px-6 py-3 text-[14px] font-semibold text-white transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {product.stock === 0
                      ? dict.products.outOfStock
                      : dict.products.addToCart}
                  </button>
                )}

                <span
                  className={`inline-flex items-center rounded-md px-2.5 py-1 text-[12px] font-semibold ${
                    product.stock > 0
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}
                >
                  {product.stock > 0
                    ? `${dict.products.inStock} (${product.stock})`
                    : dict.products.outOfStock}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
