"use client";

import { useEffect, useState } from "react";
import {
  Layers,
  ShieldCheck,
  Workflow,
  Boxes,
  Megaphone,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useGetHomeContentQuery,
  useUpdateHomeContentMutation,
  type HomeContent,
  type IconFeature,
  type ProcessStep,
  type CTABanner,
  type CTABannerVariant,
} from "@/store/api/homeContentApi";
import { useAppDispatch } from "@/shared/hooks";
import { addToast } from "@/store/toastSlice";
import type { TranslatedField } from "@/shared/types";
import {
  EditorShell,
  FieldGroup,
  PlainInput,
  PlainSelect,
  SmartTextField,
  SmartTextListField,
  ImageField,
  useEditorDict,
} from "../";

const EMPTY_TF: TranslatedField = { uz: "", ru: "", en: "", kz: "" };

const DEFAULT_HOME: HomeContent = {
  about: {
    body: { ...EMPTY_TF },
    image: "",
    features: [],
  },
  whyUs: { title: { ...EMPTY_TF }, features: [] },
  process: { title: { ...EMPTY_TF }, steps: [] },
  integration: { title: { ...EMPTY_TF }, body: { ...EMPTY_TF }, tiles: [] },
  ctaBanners: {
    left: emptyCTA("blue-ink"),
    right: emptyCTA("ink"),
  },
};

function emptyCTA(variant: CTABannerVariant): CTABanner {
  return {
    title: { ...EMPTY_TF },
    subtitle: { ...EMPTY_TF },
    points: [],
    ctaLabel: { ...EMPTY_TF },
    ctaHref: "/products",
    variant,
  };
}

type Tab = "about" | "whyUs" | "process" | "integration" | "cta";

interface Props {
  close: () => void;
  initialTab?: Tab;
}

export function HomeContentBlockEditor({ close, initialTab = "about" }: Props) {
  const dispatch = useAppDispatch();
  const t = useEditorDict();
  const { data, isLoading } = useGetHomeContentQuery();
  const [update, { isLoading: saving }] = useUpdateHomeContentMutation();

  const [form, setForm] = useState<HomeContent>(DEFAULT_HOME);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>(initialTab);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const setSection = <K extends keyof HomeContent>(
    key: K,
    value: HomeContent[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

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

  const tabs: { id: Tab; label: string; icon: typeof Layers }[] = [
    { id: "about", label: t.about, icon: Layers },
    { id: "whyUs", label: t.whyUs, icon: ShieldCheck },
    { id: "process", label: t.process, icon: Workflow },
    { id: "integration", label: t.integration, icon: Boxes },
    { id: "cta", label: t.ctaBanners, icon: Megaphone },
  ];

  return (
    <EditorShell
      onSave={handleSave}
      onCancel={close}
      saving={saving}
      errorMessage={error ?? undefined}
    >
      {/* Tabs */}
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

      {tab === "about" && (
        <FieldGroup title={t.aboutTitle} description={t.aboutDesc}>
          <SmartTextField
            label={t.bodyText}
            value={form.about.body}
            onChange={(v) =>
              setSection("about", { ...form.about, body: v })
            }
            multiline
            rows={4}
          />
          <ImageField
            label={t.factoryImage}
            value={form.about.image}
            onChange={(url) =>
              setSection("about", { ...form.about, image: url })
            }
          />
          <FeatureListEditor
            title={t.featuresLabel}
            value={form.about.features}
            onChange={(features) =>
              setSection("about", { ...form.about, features })
            }
          />
        </FieldGroup>
      )}

      {tab === "whyUs" && (
        <FieldGroup title={t.whyUsTitle} description={t.whyUsDesc}>
          <SmartTextField
            label={t.title}
            value={form.whyUs.title}
            onChange={(v) =>
              setSection("whyUs", { ...form.whyUs, title: v })
            }
          />
          <FeatureListEditor
            title={t.featuresLabel}
            value={form.whyUs.features}
            onChange={(features) =>
              setSection("whyUs", { ...form.whyUs, features })
            }
            iconHint="ShieldCheck, Zap, HeartHandshake, TrendingUp"
          />
        </FieldGroup>
      )}

      {tab === "process" && (
        <FieldGroup title={t.processTitle} description={t.processDesc}>
          <SmartTextField
            label={t.title}
            value={form.process.title}
            onChange={(v) =>
              setSection("process", { ...form.process, title: v })
            }
          />
          <ProcessStepListEditor
            value={form.process.steps}
            onChange={(steps) =>
              setSection("process", { ...form.process, steps })
            }
          />
        </FieldGroup>
      )}

      {tab === "integration" && (
        <FieldGroup
          title={t.integrationTitle}
          description={t.integrationDesc}
        >
          <SmartTextField
            label={t.title}
            value={form.integration.title}
            onChange={(v) =>
              setSection("integration", { ...form.integration, title: v })
            }
          />
          <SmartTextField
            label={t.description}
            value={form.integration.body}
            onChange={(v) =>
              setSection("integration", { ...form.integration, body: v })
            }
            multiline
            rows={3}
          />
          <SmartTextListField
            label={t.tilesLabel}
            values={form.integration.tiles}
            onChange={(tiles) =>
              setSection("integration", { ...form.integration, tiles })
            }
            itemLabel={t.tile}
            placeholder={t.tilePlaceholder}
          />
        </FieldGroup>
      )}

      {tab === "cta" && (
        <>
          <FieldGroup title={t.ctaLeftTitle}>
            <CTABannerEditor
              value={form.ctaBanners.left}
              onChange={(left) =>
                setSection("ctaBanners", { ...form.ctaBanners, left })
              }
            />
          </FieldGroup>
          <FieldGroup title={t.ctaRightTitle}>
            <CTABannerEditor
              value={form.ctaBanners.right}
              onChange={(right) =>
                setSection("ctaBanners", { ...form.ctaBanners, right })
              }
            />
          </FieldGroup>
        </>
      )}
    </EditorShell>
  );
}

/* ── Feature list ──────────────────────────────────────────── */

function FeatureListEditor({
  title,
  value,
  onChange,
  iconHint,
}: {
  title: string;
  value: IconFeature[];
  onChange: (v: IconFeature[]) => void;
  iconHint?: string;
}) {
  const t = useEditorDict();
  const empty: IconFeature = {
    icon: "ShieldCheck",
    title: { ...EMPTY_TF },
    desc: { ...EMPTY_TF },
  };
  const add = () => onChange([...value, empty]);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const set = (i: number, patch: Partial<IconFeature>) =>
    onChange(
      value.map((x, idx) => (idx === i ? { ...x, ...patch } : x)),
    );

  return (
    <div>
      <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
        {title}
      </label>
      <div className="space-y-2.5">
        {value.map((f, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--color-border)] bg-white p-3"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {t.feature} {i + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="p-1 text-red-500 hover:bg-red-50 rounded-md"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              <PlainInput
                label={t.iconName}
                value={f.icon}
                onChange={(v) => set(i, { icon: v })}
                placeholder="ShieldCheck"
                hint={iconHint ?? t.iconHint}
              />
              <SmartTextField
                label={t.title}
                value={f.title}
                onChange={(v) => set(i, { title: v })}
              />
              <SmartTextField
                label={t.description}
                value={f.desc}
                onChange={(v) => set(i, { desc: v })}
                multiline
                rows={2}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] py-2.5 text-[13px] font-semibold text-slate-500 hover:text-[var(--color-brand)] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          {t.addFeature}
        </button>
      </div>
    </div>
  );
}

/* ── Process step list ─────────────────────────────────────── */

function ProcessStepListEditor({
  value,
  onChange,
}: {
  value: ProcessStep[];
  onChange: (v: ProcessStep[]) => void;
}) {
  const t = useEditorDict();
  const add = () => {
    const n = (value.length + 1).toString().padStart(2, "0");
    onChange([
      ...value,
      {
        number: n,
        icon: "ClipboardList",
        title: { ...EMPTY_TF },
        desc: { ...EMPTY_TF },
      },
    ]);
  };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const set = (i: number, patch: Partial<ProcessStep>) =>
    onChange(
      value.map((x, idx) => (idx === i ? { ...x, ...patch } : x)),
    );

  return (
    <div>
      <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
        {t.steps}
      </label>
      <div className="space-y-2.5">
        {value.map((s, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--color-border)] bg-white p-3"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {t.step} {i + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="p-1 text-red-500 hover:bg-red-50 rounded-md"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <PlainInput
                label={t.stepNumber}
                value={s.number}
                onChange={(v) => set(i, { number: v })}
                placeholder="01"
              />
              <PlainInput
                label={t.iconName}
                value={s.icon}
                onChange={(v) => set(i, { icon: v })}
                placeholder="ClipboardList"
              />
            </div>
            <div className="space-y-3">
              <SmartTextField
                label={t.title}
                value={s.title}
                onChange={(v) => set(i, { title: v })}
              />
              <SmartTextField
                label={t.description}
                value={s.desc}
                onChange={(v) => set(i, { desc: v })}
                multiline
                rows={2}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] py-2.5 text-[13px] font-semibold text-slate-500 hover:text-[var(--color-brand)] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          {t.addStep}
        </button>
      </div>
    </div>
  );
}

/* ── CTA banner editor ─────────────────────────────────────── */

function CTABannerEditor({
  value,
  onChange,
}: {
  value: CTABanner;
  onChange: (v: CTABanner) => void;
}) {
  const t = useEditorDict();
  const set = (patch: Partial<CTABanner>) => onChange({ ...value, ...patch });

  return (
    <>
      <SmartTextField
        label={t.title}
        value={value.title}
        onChange={(v) => set({ title: v })}
      />
      <SmartTextField
        label={t.subtitle}
        value={value.subtitle}
        onChange={(v) => set({ subtitle: v })}
      />
      <SmartTextListField
        label={t.bulletList}
        values={value.points}
        onChange={(points) => set({ points })}
        itemLabel={t.bullet}
      />
      <SmartTextField
        label={t.ctaLabel}
        value={value.ctaLabel}
        onChange={(v) => set({ ctaLabel: v })}
      />
      <PlainInput
        label={t.ctaLink}
        value={value.ctaHref}
        onChange={(v) => set({ ctaHref: v })}
        placeholder="/products"
      />
      <PlainSelect<CTABannerVariant>
        label={t.backgroundVariant}
        value={value.variant}
        onChange={(v) => set({ variant: v })}
        options={[
          { value: "blue-ink", label: t.blueDark },
          { value: "ink", label: t.dark },
        ]}
      />
    </>
  );
}
