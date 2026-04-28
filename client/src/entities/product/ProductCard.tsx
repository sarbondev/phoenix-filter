"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Bookmark, Eye } from "lucide-react";
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="h-full"
    >
      <Link
        href={`/${locale}/products/${product.slug}`}
        className="group block h-full"
      >
        <div className="relative overflow-hidden rounded-xl bg-white border border-slate-200/80 transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300 flex flex-col h-full">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 flex-shrink-0">
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
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              {discount > 0 && (
                <span className="inline-flex items-center rounded-md bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                  -{discount}%
                </span>
              )}
              {product.isFeatured && (
                <span className="inline-flex items-center rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                  {dict.products.featuredBadge}
                </span>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={handleToggleWishlist}
              className="absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
            >
              <Bookmark
                className={`h-4 w-4 transition-colors ${isWished ? "fill-primary text-primary" : "text-slate-400"}`}
              />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            {/* Category */}
            <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1.5 truncate">
              {typeof product.category === "object" && product.category?.name
                ? t(product.category.name, locale)
                : ""}
            </p>

            {/* Title */}
            <h3 className="text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
              {t(product.name, locale)}
            </h3>

            {/* Price */}
            <div className="mt-auto pt-3 flex items-baseline gap-2">
              <span className="text-base font-bold text-slate-900">
                {formatPrice(effectivePrice)}
              </span>
              <span className="text-[11px] text-slate-400">UZS</span>
              {discount > 0 && (
                <span className="text-xs text-slate-400 line-through ml-auto">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isInCart}
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-150 ${
                isInCart
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : product.stock === 0
                    ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-hover active:bg-primary-hover"
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
