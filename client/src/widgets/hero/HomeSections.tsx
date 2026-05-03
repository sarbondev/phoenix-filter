"use client";

import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { useGetSiteSettingsQuery } from "@/store/api/siteSettingsApi";
import { useEditMode, useEditorDict } from "@/features/inline-editor";
import { Hero } from "./Hero";
import { AboutSection } from "./AboutSection";
import { BrandsSection } from "./BrandsSection";
import { IndustriesSection } from "./IndustriesSection";
import { WhyUs } from "./WhyUs";
import { ProductCatalogSlider } from "./ProductCatalogSlider";
import { ProductRequestSection } from "./ProductRequestSection";
import { CTASection } from "./CTASection";
import { ProcessSection } from "./ProcessSection";
import { CertificatesSection } from "./CertificatesSection";
import { IntegrationSection } from "./IntegrationSection";
import { ContactFAQSection } from "./ContactFAQSection";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

/**
 * Renders the home page sections in order, respecting the visibility flags
 * configured in site-settings.
 *
 * In edit mode, hidden sections are still rendered but greyed out so the
 * admin can re-enable them.
 */
export function HomeSections({ locale, dict }: Props) {
  const { data: settings } = useGetSiteSettingsQuery();
  const { editMode } = useEditMode();
  const ed = useEditorDict();

  const sections = settings?.sections ?? {
    hero: true,
    about: true,
    brands: true,
    industries: true,
    whyUs: true,
    categories: true,
    products: true,
    ctaBanners: true,
    process: true,
    certificates: true,
    integration: true,
    productRequest: true,
    contactFaq: true,
  };

  const wrap = (
    visible: boolean,
    name: string,
    children: React.ReactNode,
  ) => {
    if (!visible && !editMode) return null;
    if (!visible && editMode) {
      return (
        <div className="relative">
          <div className="opacity-30 pointer-events-none">{children}</div>
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] text-white px-3 py-1.5 text-[11px] font-bold pointer-events-none">
            👁 {ed.sectionHidden}: {name}
          </div>
        </div>
      );
    }
    return children;
  };

  return (
    <div>
      {wrap(sections.hero, ed.secHero, <Hero locale={locale} dict={dict} />)}
      {wrap(
        sections.about,
        ed.secAbout,
        <AboutSection locale={locale} />,
      )}
      {wrap(
        sections.brands,
        ed.secBrands,
        <BrandsSection locale={locale} />,
      )}
      {wrap(
        sections.industries,
        ed.secIndustries,
        <IndustriesSection locale={locale} />,
      )}
      {wrap(sections.whyUs, ed.secWhyUs, <WhyUs locale={locale} />)}
      {wrap(
        sections.products,
        ed.secProducts,
        <ProductCatalogSlider locale={locale} dict={dict} />,
      )}
      {wrap(
        sections.ctaBanners,
        ed.secCtaBanners,
        <CTASection locale={locale} />,
      )}
      {wrap(
        sections.productRequest,
        ed.secProductRequest,
        <ProductRequestSection locale={locale} dict={dict} />,
      )}
      {wrap(
        sections.process,
        ed.secProcess,
        <ProcessSection locale={locale} />,
      )}
      {wrap(
        sections.certificates,
        ed.secCertificates,
        <CertificatesSection locale={locale} />,
      )}
      {wrap(
        sections.integration,
        ed.secIntegration,
        <IntegrationSection locale={locale} />,
      )}
      {wrap(
        sections.contactFaq,
        ed.secContactFaq,
        <ContactFAQSection locale={locale} />,
      )}
    </div>
  );
}
