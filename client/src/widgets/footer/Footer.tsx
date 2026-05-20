"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { FacebookIcon, InstagramIcon, TelegramIcon } from "@/shared/ui";
import { useGetSiteSettingsQuery } from "@/store/api/siteSettingsApi";
import { t } from "@/shared/lib/utils";
import { Editable, useEditorDict } from "@/features/inline-editor";
import { SiteSettingsBlockEditor } from "@/features/inline-editor/blocks/SiteSettingsBlockEditor";
import { PhoenixLogo } from "@/widgets/header/PhoenixLogo";

const FOOTER_NAV = {
  products: { uz: "Mahsulotlar", ru: "Продукция", en: "Products", kz: "Өнім" },
  company: { uz: "Kompaniya", ru: "Компания", en: "Company", kz: "Компания" },
  industrial: { uz: "Sanoat filtratsiyasi", ru: "Промышленная фильтрация", en: "Industrial filtration", kz: "Өнеркәсіптік сүзу" },
  spetstexnika: { uz: "Spetstexnika filtrlari", ru: "Фильтры для спецтехники", en: "Special equipment", kz: "Арнайы техника" },
  scrubbers: { uz: "Skrubberlar", ru: "Скрубберы", en: "Scrubbers", kz: "Скрубберлер" },
  about: { uz: "Kompaniya haqida", ru: "О компании", en: "About", kz: "Компания туралы" },
  engineering: { uz: "Injiniring", ru: "Инжиниринг", en: "Engineering", kz: "Инжиниринг" },
  projects: { uz: "Loyihalar", ru: "Проекты", en: "Projects", kz: "Жобалар" },
  services: { uz: "Servis", ru: "Сервис", en: "Service", kz: "Сервис" },
  blog: { uz: "Blog", ru: "Блог", en: "Blog", kz: "Блог" },
  contact: { uz: "Kontaktlar", ru: "Контакты", en: "Контакты", kz: "Байланыс" },
} as const;

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

const localized = {
  en: {
    consultationFallback: "Get a consultation",
    consultationSubFallback: "by phone or via messengers",
    shop: "Shop",
    delivery: "Delivery",
    payment: "Payment",
    returns: "Exchange & return",
    serviceCenter: "Service center",
    repair: "Repair of equipment",
    operator: "Operator services",
    contacts: "Contacts",
    rightsFallback: "All rights reserved",
  },
  ru: {
    consultationFallback: "Получите консультацию",
    consultationSubFallback: "по телефону или в мессенджерах",
    shop: "Магазин",
    delivery: "Доставка",
    payment: "Оплата",
    returns: "Обмен и возврат",
    serviceCenter: "Сервисный центр",
    repair: "Ремонт оборудования",
    operator: "Услуги оператора",
    contacts: "Контакты",
    rightsFallback: "Все права защищены",
  },
  uz: {
    consultationFallback: "Konsultatsiya oling",
    consultationSubFallback: "telefon yoki messenjer orqali",
    shop: "Do'kon",
    delivery: "Yetkazib berish",
    payment: "To'lov",
    returns: "Almashtirish va qaytarish",
    serviceCenter: "Servis markazi",
    repair: "Uskunalar ta'mirlash",
    operator: "Operator xizmatlari",
    contacts: "Kontaktlar",
    rightsFallback: "Barcha huquqlar himoyalangan",
  },
  kz: {
    consultationFallback: "Кеңес алыңыз",
    consultationSubFallback: "телефон немесе мессенджер арқылы",
    shop: "Дүкен",
    delivery: "Жеткізу",
    payment: "Төлем",
    returns: "Айырбас және қайтару",
    serviceCenter: "Сервис орталығы",
    repair: "Жабдықты жөндеу",
    operator: "Оператор қызметтері",
    contacts: "Байланыс",
    rightsFallback: "Барлық құқықтар қорғалған",
  },
};

export function Footer({ locale, dict }: FooterProps) {
  const c = localized[locale] ?? localized.ru;
  const { data: settings } = useGetSiteSettingsQuery();
  const ed = useEditorDict();

  const phone = settings?.phone || dict.footer.phone;
  const email = settings?.email || dict.footer.email;
  const consultation =
    t(settings?.consultationCta, locale) || c.consultationFallback;
  const consultationSub =
    t(settings?.consultationSubtitle, locale) || c.consultationSubFallback;
  const offices = settings?.offices ?? [];
  const socials = settings?.socials ?? {};
  const rights = t(settings?.copyright, locale) || c.rightsFallback;

  return (
    <Editable
      id="footer"
      label={ed.settingsLabel}
      block={{
        title: ed.siteSettingsTitle,
        description: ed.siteSettingsDesc,
        wide: true,
        render: (close) => <SiteSettingsBlockEditor close={close} />,
      }}
    >
      <footer className="bg-[var(--color-ink)] text-slate-300 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          {/* Top — consultation + contacts + socials */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {consultation}
              </h3>
              <p className="text-[13px] text-slate-400 mt-0.5">
                {consultationSub}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="text-[14px] font-semibold text-white hover:text-[var(--color-brand)] transition-colors"
                >
                  {phone}
                </a>
                {email && (
                  <>
                    <span className="h-4 w-px bg-white/15" />
                    <a
                      href={`mailto:${email}`}
                      className="text-[13px] text-slate-300 hover:text-white transition-colors"
                    >
                      {email}
                    </a>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {socials.facebook && (
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-opacity"
                  >
                    <FacebookIcon className="h-4 w-4" />
                  </a>
                )}
                {socials.instagram && (
                  <a
                    href={socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FEDA75] via-[#D62976] to-[#4F5BD5] text-white hover:opacity-90 transition-opacity"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                )}
                {socials.telegram && (
                  <a
                    href={socials.telegram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Telegram"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#229ED9] text-white hover:opacity-90 transition-opacity"
                  >
                    <TelegramIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-8">
            <div>
              <h4 className="text-[13px] font-bold text-white uppercase tracking-wider mb-4">
                {t(FOOTER_NAV.products, locale)}
              </h4>
              <ul className="space-y-2.5 text-[13px] text-slate-400">
                <li>
                  <Link href={`/${locale}/products`} className="hover:text-white transition-colors">
                    {t(FOOTER_NAV.industrial, locale)}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/spetstexnika`} className="hover:text-white transition-colors">
                    {t(FOOTER_NAV.spetstexnika, locale)}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/industrial/scrubbers`} className="hover:text-white transition-colors">
                    {t(FOOTER_NAV.scrubbers, locale)}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-bold text-white uppercase tracking-wider mb-4">
                {t(FOOTER_NAV.company, locale)}
              </h4>
              <ul className="space-y-2.5 text-[13px] text-slate-400">
                <li><Link href={`/${locale}/about`} className="hover:text-white transition-colors">{t(FOOTER_NAV.about, locale)}</Link></li>
                <li><Link href={`/${locale}/engineering`} className="hover:text-white transition-colors">{t(FOOTER_NAV.engineering, locale)}</Link></li>
                <li><Link href={`/${locale}/projects`} className="hover:text-white transition-colors">{t(FOOTER_NAV.projects, locale)}</Link></li>
                <li><Link href={`/${locale}/services`} className="hover:text-white transition-colors">{t(FOOTER_NAV.services, locale)}</Link></li>
                <li><Link href={`/${locale}/blog`} className="hover:text-white transition-colors">{t(FOOTER_NAV.blog, locale)}</Link></li>
                <li><Link href={`/${locale}/contact`} className="hover:text-white transition-colors">{t(FOOTER_NAV.contact, locale)}</Link></li>
              </ul>
            </div>

            {/* Offices */}
            {offices.length > 0
              ? offices.slice(0, 2).map((office, i) => (
                  <div key={i}>
                    <h4 className="text-[13px] font-bold text-white uppercase tracking-wider mb-4">
                      {t(office.label, locale)}
                    </h4>
                    <p className="flex items-start gap-2 text-[13px] text-slate-400">
                      <MapPin className="h-4 w-4 mt-0.5 text-[var(--color-brand)] flex-shrink-0" />
                      <span>{t(office.address, locale)}</span>
                    </p>
                  </div>
                ))
              : null}
          </div>

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/10 text-[12px] text-slate-500">
            <div>
              © {new Date().getFullYear()} {rights}
            </div>
            <PhoenixLogo light className="scale-90 origin-right" />
          </div>
        </div>
      </footer>
    </Editable>
  );
}
