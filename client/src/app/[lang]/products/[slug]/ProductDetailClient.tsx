"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import {
  Package,
  Star,
  Send,
  MessageCircle,
  FileDown,
} from "lucide-react";
import type { Locale, CrossReference } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { useGetProductBySlugQuery } from "@/store/api/productApi";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { useGetDirectionsQuery } from "@/store/api/directionApi";
import { useGetProductReviewsQuery } from "@/store/api/reviewApi";
import { useGetSiteSettingsQuery } from "@/store/api/siteSettingsApi";
import {
  t,
  formatPrice,
  getDiscountPercent,
  getImageUrl,
} from "@/shared/lib/utils";
import { Skeleton, Breadcrumbs } from "@/shared/ui";
import type { BreadcrumbItem } from "@/shared/ui";

const BLUE = "#1d4ed8";

interface Props {
  locale: Locale;
  dict: Dictionary;
  slug: string;
}

export function ProductDetailClient({ locale, dict, slug }: Props) {
  const { data: product, isLoading } = useGetProductBySlugQuery(slug);
  const { data: allCategories } = useGetCategoriesQuery();
  const { data: directions } = useGetDirectionsQuery();
  const { data: settings } = useGetSiteSettingsQuery();
  const { data: reviewData } = useGetProductReviewsQuery(product?.id ?? "", {
    skip: !product,
  });
  const [selectedImage, setSelectedImage] = useState(0);
  const waNumber = (settings?.phone || "+998712000000").replace(/[^\d]/g, "");

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
  const inStock = product.stockStatus
    ? product.stockStatus === "in_stock"
    : product.stock > 0;
  const avgRating = reviewData?.average ?? 5;
  const reviewCount = reviewData?.count ?? 0;

  // Build breadcrumb chain: Home › Directions › [Direction] › [Category] › Product
  const crumbs: BreadcrumbItem[] = [
    { label: dict.directions.title, href: `/${locale}/directions` },
  ];
  const productCategory =
    typeof product.category === "object" ? product.category : null;
  if (productCategory && allCategories) {
    const leaf = allCategories.find(
      (c) => c.id === productCategory.id || c.slug === productCategory.slug,
    );
    const direction = leaf && directions ? directions.find((d) => d.id === leaf.direction) : null;
    if (direction) {
      crumbs.push({
        label: t(direction.name, locale),
        href: `/${locale}/directions/${direction.slug}`,
      });
    }
    if (leaf && direction) {
      crumbs.push({
        label: t(leaf.name, locale),
        href: `/${locale}/directions/${direction.slug}/${leaf.slug}`,
      });
    } else if (leaf) {
      crumbs.push({ label: t(leaf.name, locale) });
    }
  }
  crumbs.push({ label: t(product.name, locale) });

  return (
    <div className="bg-white py-6 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={crumbs} homeHref={`/${locale}`} className="mb-6" />

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
                  <Package className="h-16 w-16" />
                </div>
              )}
              {discount > 0 && !product.priceOnRequest && (
                <span className="absolute top-4 left-4 inline-flex items-center rounded-md bg-[var(--color-accent)] px-3 py-1 text-sm font-bold text-white">
                  -{discount}%
                </span>
              )}
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

            {/* Identity badges — SKU / OEM / Vehicle brand */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Pill label="SKU" value={product.sku} accent />
              {product.oem && <Pill label="OEM" value={product.oem} />}
              {product.vehicleBrand && (
                <Pill label={dict.products.brand} value={product.vehicleBrand} />
              )}
            </div>

            {/* Application / vehicle compatibility */}
            {product.application && (
              <div className="mt-4 rounded-xl bg-[var(--color-brand-soft)] border border-[var(--color-brand)]/15 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-brand)] mb-1">
                  {dict.products.compatibility}
                </p>
                <p className="text-[14px] text-slate-800 leading-relaxed">
                  {product.application}
                </p>
              </div>
            )}

            {/* Description */}
            {t(product.description, locale) && t(product.description, locale) !== product.application && (
              <div className="mt-6">
                <h3 className="section-title text-lg text-slate-900 mb-3">
                  {dict.products.description}
                </h3>
                <p className="text-[14px] text-slate-600 leading-relaxed whitespace-pre-line">
                  {t(product.description, locale)}
                </p>
              </div>
            )}

            {/* Material + Dimensions */}
            {(product.material || product.dimensions) && (
              <div className="mt-6">
                <h3 className="section-title text-lg text-slate-900 mb-3">
                  {dict.products.specifications}
                </h3>
                <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
                  {product.material && (
                    <SpecRow label={dict.products.material} value={product.material} striped />
                  )}
                  {product.dimensions?.height != null && (
                    <SpecRow label={dict.products.height} value={`${product.dimensions.height} mm`} />
                  )}
                  {product.dimensions?.outerDiameter != null && (
                    <SpecRow label={dict.products.outerDiameter} value={`${product.dimensions.outerDiameter} mm`} striped />
                  )}
                  {product.dimensions?.innerDiameter != null && (
                    <SpecRow label={dict.products.innerDiameter} value={`${product.dimensions.innerDiameter} mm`} />
                  )}
                  {product.dimensions?.threadSize && (
                    <SpecRow label={dict.products.threadSize} value={product.dimensions.threadSize} striped />
                  )}
                  {product.dimensions?.inletDiameter != null && (
                    <SpecRow label={dict.products.inletDiameter} value={`${product.dimensions.inletDiameter} mm`} />
                  )}
                  {product.dimensions?.outletDiameter != null && (
                    <SpecRow label={dict.products.outletDiameter} value={`${product.dimensions.outletDiameter} mm`} striped />
                  )}
                </div>
              </div>
            )}

            {/* Cross references — flagship feature for filter shop */}
            {product.crossReferences && product.crossReferences.length > 0 && (
              <CrossReferences refs={product.crossReferences} dict={dict} />
            )}

            {/* Other specifications (key/value translated) */}
            {product.specifications.length > 0 && (
              <div className="mt-6">
                <h3 className="section-title text-lg text-slate-900 mb-3">
                  {dict.products.additionalInfo}
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

            {/* Price + lead-gen actions */}
            <div className="mt-auto pt-8">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {product.priceOnRequest ? (
                  <span className="inline-flex rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)] px-4 py-2 text-[15px] font-bold">
                    {LEAD.onRequest[locale]}
                  </span>
                ) : (
                  <>
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
                  </>
                )}
                <StockBadge status={inStock ? "in_stock" : "under_order"} locale={locale} />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("phoenix:open-tz"))}
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[14px] font-semibold text-white transition-colors"
                  style={{ backgroundColor: BLUE }}
                >
                  <Send className="h-4 w-4" />
                  {LEAD.requestPrice[locale]}
                </button>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#22c35e] px-5 py-3 text-[14px] font-semibold text-white transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
                {product.datasheetUrl && (
                  <a
                    href={product.datasheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-brand)]/40 px-5 py-3 text-[14px] font-semibold text-slate-700 transition-colors"
                  >
                    <FileDown className="h-4 w-4" />
                    Datasheet
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Pill({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] ${
        accent
          ? "border-[var(--color-brand)]/25 bg-[var(--color-brand-soft)] text-[var(--color-brand)]"
          : "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      <span className="text-[10.5px] font-semibold uppercase tracking-wider opacity-70">
        {label}
      </span>
      <span className="font-bold">{value}</span>
    </span>
  );
}

function SpecRow({
  label,
  value,
  striped,
}: {
  label: string;
  value: string;
  striped?: boolean;
}) {
  return (
    <div
      className={`flex justify-between text-[13.5px] px-4 py-2.5 ${
        striped ? "bg-[var(--color-surface)]" : "bg-white"
      }`}
    >
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function CrossReferences({
  refs,
  dict,
}: {
  refs: CrossReference[];
  dict: Dictionary;
}) {
  // Group by manufacturer for compact display
  const byMaker = new Map<string, string[]>();
  for (const r of refs) {
    if (!byMaker.has(r.manufacturer)) byMaker.set(r.manufacturer, []);
    byMaker.get(r.manufacturer)!.push(r.partNumber);
  }
  const groups = Array.from(byMaker.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="mt-6">
      <h3 className="section-title text-lg text-slate-900 mb-1">
        {dict.products.crossReferences}
      </h3>
      <p className="text-[12.5px] text-slate-500 mb-3">
        {dict.products.crossReferencesHint}
      </p>
      <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
        {groups.map(([maker, parts], i) => (
          <div
            key={maker}
            className={`grid grid-cols-[140px_1fr] gap-3 px-4 py-2.5 text-[13px] ${
              i % 2 === 0 ? "bg-[var(--color-surface)]" : "bg-white"
            }`}
          >
            <span className="text-slate-500 font-semibold uppercase text-[11.5px] tracking-wider self-start pt-0.5">
              {maker}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {parts.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center rounded bg-white border border-slate-200 px-2 py-0.5 text-[12px] font-mono text-slate-800"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type LS = Record<Locale, string>;
const LEAD: Record<string, LS> = {
  onRequest: { uz: "So'rov bo'yicha", ru: "По запросу", en: "On request", kz: "Сұраныс бойынша" },
  requestPrice: { uz: "Narxni so'rash", ru: "Запросить цену", en: "Request price", kz: "Бағаны сұрау" },
  inStock: { uz: "Mavjud", ru: "В наличии", en: "In stock", kz: "Бар" },
  underOrder: { uz: "Buyurtma asosida", ru: "Под заказ", en: "Under order", kz: "Тапсырыс бойынша" },
};

function StockBadge({ status, locale }: { status: "in_stock" | "under_order"; locale: Locale }) {
  const ok = status === "in_stock";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-[12px] font-semibold ${
        ok
          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
          : "bg-amber-50 text-amber-600 border border-amber-200"
      }`}
    >
      {ok ? LEAD.inStock[locale] : LEAD.underOrder[locale]}
    </span>
  );
}
