/**
 * JSON-LD generators for Google rich-result eligibility.
 * Embed via `<script type="application/ld+json">` in server components.
 */
import type { Product, Locale } from "@/shared/types";
import { t } from "./utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function absUrl(path: string): string {
  if (!path) return SITE_URL;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function imageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${SITE_URL}/uploads/${path.replace(/^\/uploads\//, "")}`;
}

export function productJsonLd(product: Product, locale: Locale) {
  const name = t(product.name, locale) || product.sku;
  const description =
    product.application ||
    t(product.description, locale) ||
    name;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    sku: product.sku,
    description,
    url: absUrl(`/${locale}/products/${product.slug}`),
  };

  if (product.images && product.images.length > 0) {
    data.image = product.images.map(imageUrl);
  }

  if (product.vehicleBrand) {
    data.brand = { "@type": "Brand", name: product.vehicleBrand };
  } else {
    data.brand = { "@type": "Brand", name: "Phoenix" };
  }

  if (product.oem) {
    data.mpn = product.oem;
  }

  // Cross-references → identifier alternatives. Use Google's approach: list as
  // additionalProperty since schema.org doesn't have a dedicated cross-reference type.
  if (product.crossReferences && product.crossReferences.length > 0) {
    data.additionalProperty = product.crossReferences.slice(0, 30).map((r) => ({
      "@type": "PropertyValue",
      name: r.manufacturer,
      value: r.partNumber,
    }));
  }

  // Offer (price + availability). Even when price is 0 we still expose
  // the offer so Google can show "Contact for price" rich data.
  const offer: Record<string, unknown> = {
    "@type": "Offer",
    priceCurrency: "UZS",
    availability:
      product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    url: absUrl(`/${locale}/products/${product.slug}`),
  };
  if (product.price > 0) {
    offer.price = product.discountPrice ?? product.price;
  } else {
    offer.price = "0";
    offer.priceSpecification = { "@type": "PriceSpecification", price: 0 };
  }
  data.offers = offer;

  return data;
}

export interface BreadcrumbCrumb {
  name: string;
  href: string;
}

export function breadcrumbJsonLd(crumbs: BreadcrumbCrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absUrl(c.href),
    })),
  };
}
