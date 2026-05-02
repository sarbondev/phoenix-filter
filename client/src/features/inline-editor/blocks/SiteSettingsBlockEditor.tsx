"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Globe, Eye, Plus, Trash2 } from "lucide-react";
import {
  useGetSiteSettingsQuery,
  useUpdateSiteSettingsMutation,
  type SiteSettings,
  type SiteOffice,
  type SiteSocials,
  type SiteSections,
} from "@/store/api/siteSettingsApi";
import { useAppDispatch } from "@/shared/hooks";
import { addToast } from "@/store/toastSlice";
import type { TranslatedField } from "@/shared/types";
import {
  EditorShell,
  FieldGroup,
  PlainInput,
  ToggleField,
  SmartTextField,
  ImageField,
  useEditorDict,
} from "../";

const EMPTY_TF: TranslatedField = { uz: "", ru: "", en: "", kz: "" };

const DEFAULT_SETTINGS: SiteSettings = {
  brandName: "PRESTIGE",
  brandAccent: "FILTER",
  logo: "",
  consultationCta: { ...EMPTY_TF },
  consultationSubtitle: { ...EMPTY_TF },
  phone: "",
  phoneSecondary: "",
  email: "",
  emailSecondary: "",
  workingHours: { ...EMPTY_TF },
  offices: [],
  socials: {},
  sections: {
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
  },
  copyright: { ...EMPTY_TF },
};


type Tab = "brand" | "contacts" | "offices" | "socials" | "sections" | "footer";

interface Props {
  close: () => void;
  /** Optionally focus on a specific tab when opened. */
  initialTab?: Tab;
}

export function SiteSettingsBlockEditor({ close, initialTab = "brand" }: Props) {
  const dispatch = useAppDispatch();
  const t = useEditorDict();
  const { data, isLoading } = useGetSiteSettingsQuery();

  const SECTION_LABELS: Record<keyof SiteSections, string> = {
    hero: t.secHero,
    about: t.secAbout,
    brands: t.secBrands,
    industries: t.secIndustries,
    whyUs: t.secWhyUs,
    categories: t.secCategories,
    products: t.secProducts,
    ctaBanners: t.secCtaBanners,
    process: t.secProcess,
    certificates: t.secCertificates,
    integration: t.secIntegration,
    productRequest: t.secProductRequest,
    contactFaq: t.secContactFaq,
  };
  const [update, { isLoading: saving }] = useUpdateSiteSettingsMutation();

  const [form, setForm] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>(initialTab);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setSocial = (k: keyof SiteSocials, v: string) =>
    setForm((f) => ({ ...f, socials: { ...f.socials, [k]: v } }));

  const setSection = (k: keyof SiteSections, v: boolean) =>
    setForm((f) => ({ ...f, sections: { ...f.sections, [k]: v } }));

  const addOffice = () =>
    set("offices", [
      ...form.offices,
      { label: { ...EMPTY_TF }, address: { ...EMPTY_TF }, mapUrl: "" },
    ]);

  const removeOffice = (i: number) =>
    set(
      "offices",
      form.offices.filter((_, idx) => idx !== i),
    );

  const setOffice = (i: number, patch: Partial<SiteOffice>) =>
    set(
      "offices",
      form.offices.map((o, idx) => (idx === i ? { ...o, ...patch } : o)),
    );

  const handleSave = async () => {
    setError(null);
    try {
      await update(form).unwrap();
      dispatch(addToast({ message: t.saved, type: "success" }));
      close();
    } catch (e) {
      const msg =
        e && typeof e === "object" && "data" in e
          ? ((e.data as { message?: string }).message ?? t.saveError)
          : t.saveError;
      setError(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">{t.loading}</div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Phone }[] = [
    { id: "brand", label: t.tabBrand, icon: Globe },
    { id: "contacts", label: t.tabContacts, icon: Phone },
    { id: "offices", label: t.tabOffices, icon: MapPin },
    { id: "socials", label: t.tabSocials, icon: Mail },
    { id: "sections", label: t.tabSections, icon: Eye },
    { id: "footer", label: t.tabFooter, icon: Globe },
  ];

  return (
    <EditorShell
      onSave={handleSave}
      onCancel={close}
      saving={saving}
      errorMessage={error ?? undefined}
    >
      {/* Tab strip */}
      <div className="flex flex-wrap gap-1 border-b border-[var(--color-border)] -mx-5 -mt-5 px-3 py-2 bg-[var(--color-surface)] sticky top-0 z-10">
        {tabs.map((tabItem) => {
          const Icon = tabItem.icon;
          const isActive = tab === tabItem.id;
          return (
            <button
              key={tabItem.id}
              type="button"
              onClick={() => setTab(tabItem.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                isActive
                  ? "bg-[var(--color-brand)] text-white"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tabItem.label}
            </button>
          );
        })}
      </div>

      {tab === "brand" && (
        <FieldGroup title={t.brand} description={t.brandDesc}>
          <div className="grid grid-cols-2 gap-3">
            <PlainInput
              label={t.brandName}
              value={form.brandName}
              onChange={(v) => set("brandName", v)}
              placeholder="PRESTIGE"
            />
            <PlainInput
              label={t.brandAccent}
              value={form.brandAccent}
              onChange={(v) => set("brandAccent", v)}
              placeholder="FILTER"
            />
          </div>
          <ImageField
            label={t.logoLabel}
            value={form.logo}
            onChange={(url) => set("logo", url)}
            hint={t.logoHint}
          />

          <div className="pt-3">
            <SmartTextField
              label={t.consultationCta}
              value={form.consultationCta}
              onChange={(v) => set("consultationCta", v)}
            />
          </div>
          <SmartTextField
            label={t.consultationSub}
            value={form.consultationSubtitle}
            onChange={(v) => set("consultationSubtitle", v)}
          />
        </FieldGroup>
      )}

      {tab === "contacts" && (
        <FieldGroup title={t.contactsTitle} description={t.contactsTitleDesc}>
          <div className="grid grid-cols-1 gap-3">
            <PlainInput
              label={t.phonePrimary}
              value={form.phone}
              onChange={(v) => set("phone", v)}
              placeholder="+998 (90) 189-94-26"
            />
            <PlainInput
              label={t.phoneSecondary}
              value={form.phoneSecondary ?? ""}
              onChange={(v) => set("phoneSecondary", v)}
            />
            <PlainInput
              label={t.email}
              value={form.email}
              onChange={(v) => set("email", v)}
              placeholder="info@example.com"
            />
            <PlainInput
              label={t.emailSecondary}
              value={form.emailSecondary ?? ""}
              onChange={(v) => set("emailSecondary", v)}
            />
            <SmartTextField
              label={t.workingHours}
              value={form.workingHours}
              onChange={(v) => set("workingHours", v)}
              placeholder="09:00 - 18:00"
            />
          </div>
        </FieldGroup>
      )}

      {tab === "offices" && (
        <FieldGroup title={t.officesTitle} description={t.officesDesc}>
          {form.offices.map((office, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--color-border)] bg-white p-3 relative"
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {t.office} {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeOffice(i)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-3">
                <SmartTextField
                  label={t.officeName}
                  value={office.label}
                  onChange={(v) => setOffice(i, { label: v })}
                />
                <SmartTextField
                  label={t.address}
                  value={office.address}
                  onChange={(v) => setOffice(i, { address: v })}
                />
                <PlainInput
                  label={t.mapUrl}
                  value={office.mapUrl ?? ""}
                  onChange={(v) => setOffice(i, { mapUrl: v })}
                  placeholder="https://yandex.com/map-widget/..."
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addOffice}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] py-2.5 text-[13px] font-semibold text-slate-500 hover:text-[var(--color-brand)] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            {t.addOffice}
          </button>
        </FieldGroup>
      )}

      {tab === "socials" && (
        <FieldGroup title={t.socialsTitle} description={t.socialsDesc}>
          <div className="grid grid-cols-1 gap-3">
            <PlainInput
              label="Facebook"
              value={form.socials.facebook ?? ""}
              onChange={(v) => setSocial("facebook", v)}
              placeholder="https://facebook.com/..."
            />
            <PlainInput
              label="Instagram"
              value={form.socials.instagram ?? ""}
              onChange={(v) => setSocial("instagram", v)}
              placeholder="https://instagram.com/..."
            />
            <PlainInput
              label="Telegram"
              value={form.socials.telegram ?? ""}
              onChange={(v) => setSocial("telegram", v)}
              placeholder="https://t.me/..."
            />
            <PlainInput
              label="YouTube"
              value={form.socials.youtube ?? ""}
              onChange={(v) => setSocial("youtube", v)}
              placeholder="https://youtube.com/..."
            />
            <PlainInput
              label="WhatsApp"
              value={form.socials.whatsapp ?? ""}
              onChange={(v) => setSocial("whatsapp", v)}
              placeholder="https://wa.me/..."
            />
          </div>
        </FieldGroup>
      )}

      {tab === "sections" && (
        <FieldGroup title={t.sectionsTitle} description={t.sectionsDesc}>
          <div className="grid grid-cols-1 gap-1.5">
            {(Object.keys(SECTION_LABELS) as Array<keyof SiteSections>).map(
              (key) => (
                <ToggleField
                  key={key}
                  label={SECTION_LABELS[key]}
                  value={form.sections[key]}
                  onChange={(v) => setSection(key, v)}
                />
              ),
            )}
          </div>
        </FieldGroup>
      )}

      {tab === "footer" && (
        <FieldGroup title={t.footerTitle} description={t.footerDesc}>
          <SmartTextField
            label={t.copyright}
            value={form.copyright}
            onChange={(v) => set("copyright", v)}
          />
        </FieldGroup>
      )}
    </EditorShell>
  );
}
