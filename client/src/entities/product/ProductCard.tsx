"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Bookmark, Eye, Star } from "lucide-react";
import type { Product, Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import {
  t,
  formatPrice,
  getDiscountPercent,
  getImageUrl,
} from "@/shared/lib/utils";

import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { addToCart } from "@/store/cartSlice";
import { toggleWishlist } from "@/store/wishlistSlice";
import { addToast } from "@/store/toastSlice";

interface ProductCardProps {
  product: Product;
  locale: Locale;
  dict: Dictionary;
  index?: number;
}

export function ProductCard({
  product,
  locale,
  dict,
  index = 0,
}: ProductCardProps) {
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector((s) => s.wishlist.ids);
  const cartItems = useAppSelector((s) => s.cart.items);
  const isWished = wishlistIds.includes(product.id);
  const isInCart = cartItems.some((i) => i.product.id === product.id);
  const discount = getDiscountPercent(product.price, product.discountPrice);
  const effectivePrice = product.discountPrice ?? product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
    dispatch(addToast({ message: dict.common.addedToCart, type: "success" }));
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product.id));
    dispatch(
      addToast({
        message: isWished
          ? dict.common.removedFromWishlist
          : dict.common.addedToWishlist,
        type: "info",
      }),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="h-full"
    >
      <Link
        href={`/${locale}/products/${product.slug}`}
        className="group block h-full"
      >
        <div className="relative overflow-hidden rounded-2xl bg-white border border-[var(--color-border)] transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/60 hover:border-[var(--color-brand)]/30 flex flex-col h-full">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-[var(--color-surface)] flex-shrink-0">
            {product.images[0] ? (
              <Image
                src={getImageUrl(product.images[0])}
                alt={t(product.name, locale)}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Eye className="h-10 w-10 text-slate-200" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
              {discount > 0 && (
                <span className="inline-flex items-center rounded-md bg-[var(--color-accent)] px-2 py-0.5 text-[11px] font-bold text-white">
                  -{discount}%
                </span>
              )}
              {product.isFeatured && (
                <span className="inline-flex items-center rounded-md bg-[var(--color-brand)] px-2 py-0.5 text-[11px] font-bold text-white">
                  {dict.products.featuredBadge}
                </span>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={handleToggleWishlist}
              aria-label={dict.wishlist.title}
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm transition-all hover:bg-white hover:scale-105"
            >
              <Bookmark
                className={`h-4 w-4 transition-colors ${
                  isWished
                    ? "fill-[var(--color-brand)] text-[var(--color-brand)]"
                    : "text-slate-400"
                }`}
              />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            {/* Rating stars */}
            <div className="flex items-center gap-0.5 mb-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < 5
                      ? "fill-[var(--color-highlight)] text-[var(--color-highlight)]"
                      : "text-slate-200"
                  }`}
                />
              ))}
              <span className="ml-1 text-[10px] font-semibold text-slate-400">
                (5.0)
              </span>
            </div>

            {/* Title */}
            <h3 className="text-[13.5px] font-semibold text-slate-900 line-clamp-2 group-hover:text-[var(--color-brand)] transition-colors leading-snug min-h-[34px]">
              {t(product.name, locale)}
            </h3>

            {/* SKU */}
            {product.sku && (
              <p className="mt-1 text-[11px] text-slate-400">SKU: {product.sku}</p>
            )}

            {/* Price */}
            <div className="mt-auto pt-3 flex items-baseline gap-2 flex-wrap">
              <span className="text-[16px] font-extrabold text-slate-900">
                {formatPrice(effectivePrice)}
                <span className="ml-0.5 text-[11px] font-medium text-slate-400">
                  {dict.common.currency}
                </span>
              </span>
              {discount > 0 && (
                <span className="text-[12px] text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isInCart}
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-semibold transition-all duration-150 ${
                isInCart
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : product.stock === 0
                    ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                    : "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)]"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              {isInCart
                ? dict.products.inCart
                : product.stock === 0
                  ? dict.products.outOfStock
                  : dict.products.addToCart}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
