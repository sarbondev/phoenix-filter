import { getDictionary } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import type { Metadata } from 'next';
import { ProductDetailClient } from './ProductDetailClient';
import { fetchProductBySlug, fetchCategoryBySlug } from '@/shared/lib/api-server';
import { t } from '@/shared/lib/utils';
import { productJsonLd, breadcrumbJsonLd } from '@/shared/lib/structured-data';

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const product = await fetchProductBySlug(slug, locale);
  const dict = await getDictionary(locale);

  if (!product) {
    return { title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) };
  }

  const name = t(product.name, locale) || product.sku;
  const titleParts = [name];
  if (product.vehicleBrand) titleParts.push(product.vehicleBrand);
  if (product.oem) titleParts.push(product.oem);

  // Description prioritises information a customer searching the catalogue cares about:
  // application (vehicle compat) → cross-reference brands → fallback description.
  const descParts: string[] = [];
  if (product.application) descParts.push(product.application);
  if (product.crossReferences && product.crossReferences.length > 0) {
    const brands = Array.from(new Set(product.crossReferences.map((r) => r.manufacturer))).slice(0, 6);
    if (brands.length) descParts.push(`${dict.products.crossReferences}: ${brands.join(', ')}`);
  }
  if (descParts.length === 0) descParts.push(t(product.description, locale) || name);

  const title = `${titleParts.join(' · ')} | ${dict.products.title}`;
  const description = descParts.join(' — ').slice(0, 200);
  const imageUrl = product.images?.[0]
    ? (product.images[0].startsWith('http') ? product.images[0] : `/uploads/${product.images[0].replace(/^\/uploads\//, '')}`)
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: `/${locale}/products/${slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const product = await fetchProductBySlug(slug, locale);

  // Resolve category breadcrumbs server-side so JSON-LD is complete (Google won't run client JS).
  const productCategory =
    product && typeof product.category === "object" ? product.category : null;
  const categorySlug = productCategory?.slug;
  const leafCat = categorySlug ? await fetchCategoryBySlug(categorySlug, locale) : null;

  const crumbs = [
    { name: dict.directions.title, href: `/${locale}/yonalish` },
  ];
  if (leafCat) {
    // We don't have the direction slug on the leaf payload — link directly
    // to the products page filtered by this category instead.
    crumbs.push({
      name: t(leafCat.name, locale),
      href: `/${locale}/products?categorySlug=${leafCat.slug}`,
    });
  }
  if (product) crumbs.push({ name: t(product.name, locale) || product.sku, href: `/${locale}/products/${slug}` });

  // JSON.stringify does not escape `<`, so a value containing `</script>`
  // would close the surrounding tag and enable stored XSS. Escape `<`, `>`,
  // `&`, and U+2028/U+2029 (line separators that break JS string literals).
  const safeJsonLd = (data: unknown) =>
    JSON.stringify(data)
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");

  return (
    <>
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(productJsonLd(product, locale)),
          }}
        />
      )}
      {crumbs.length > 1 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(breadcrumbJsonLd(crumbs)),
          }}
        />
      )}
      <ProductDetailClient locale={locale} dict={dict} slug={slug} />
    </>
  );
}
