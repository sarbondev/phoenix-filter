"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Bookmark, ImageIcon, Star, Check } from "lucide-react";
import type { Product, Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import {
  t,
  formatPrice,
  getDiscountPercent,
  getImageUrl,
} from "@/shared/lib/utils";
import { Badge } from "@/shared/ui";
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
  const inStock = product.stock > 0;

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
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-xs transition-all duration-(--duration-base) ease-(--ease-out-soft) hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md focus-visible:ring-4 focus-visible:ring-brand/20"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-surface flex-shrink-0">
          {product.images[0] ? (
            <Image
              src={getImageUrl(product.images[0])}
              alt={t(product.name, locale)}
              fill
              className="object-cover transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300">
              <ImageIcon className="h-10 w-10" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {discount > 0 && (
              <Badge variant="danger" tone="solid" size="sm">
                −{discount}%
              </Badge>
            )}
            {product.isFeatured && (
              <Badge variant="primary" tone="solid" size="sm">
                {dict.products.featuredBadge}
              </Badge>
            )}
          </div>

          {/* Stock pill (only when low/out) */}
          {!inStock && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="default" tone="solid" size="sm">
                {dict.products.outOfStock}
              </Badge>
            </div>
          )}

          {/* Wishlist */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={dict.wishlist.title}
            aria-pressed={isWished}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm shadow-xs transition-all duration-(--duration-fast) hover:bg-white hover:scale-105 active:scale-95"
          >
            <Bookmark
              className={`h-4 w-4 transition-colors ${
                isWished ? "fill-brand text-brand" : "text-slate-400"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Rating stars (placeholder until reviews wired) */}
          <div className="flex items-center gap-0.5 mb-1.5" aria-label="5 star rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-3 w-3 fill-highlight text-highlight"
              />
            ))}
            <span className="ml-1 text-[10px] font-semibold text-slate-400">
              (5.0)
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[13.5px] font-semibold text-slate-900 line-clamp-2 leading-snug min-h-[34px] transition-colors group-hover:text-brand">
            {t(product.name, locale)}
          </h3>

          {/* SKU + Vehicle brand pills */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {product.sku && (
              <span className="text-[11px] font-mono text-slate-500">
                {product.sku}
              </span>
            )}
            {product.vehicleBrand && (
              <Badge variant="default" tone="soft" size="sm">
                {product.vehicleBrand}
              </Badge>
            )}
          </div>

          {/* Application — small subtitle */}
          {product.application && (
            <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
              {product.application}
            </p>
          )}

          {/* Price */}
          <div className="mt-auto pt-3 flex items-baseline gap-2 flex-wrap">
            <span className="text-[17px] font-extrabold text-slate-900">
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
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock || isInCart}
            className={`mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg text-[13px] font-semibold transition-all duration-(--duration-fast) ease-(--ease-out-soft) ${
              isInCart
                ? "bg-success-soft text-success border border-success/30"
                : !inStock
                  ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                  : "bg-brand text-white shadow-sm hover:bg-brand-hover active:translate-y-px"
            }`}
          >
            {isInCart ? (
              <>
                <Check className="h-4 w-4" />
                {dict.products.inCart}
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                {!inStock ? dict.products.outOfStock : dict.products.addToCart}
              </>
            )}
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
