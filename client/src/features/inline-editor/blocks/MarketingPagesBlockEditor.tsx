"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Wrench,
  Cpu,
  Briefcase,
  Factory,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useGetHomeContentQuery,
  useUpdateHomeContentMutation,
  type MarketingPages,
  type MarketingPage,
  type MarketingPageKey,
  type PageStat,
} from "@/store/api/homeContentApi";
import { useAppDispatch } from "@/shared/hooks";
import { addToast } from "@/store/toastSlice";
import type { TranslatedField } from "@/shared/types";
import {
  EditorShell,
  FieldGroup,
  PlainInput,
  SmartTextField,
  ImageField,
  useEditorDict,
} from "../";

const EMPTY_TF: TranslatedField = { uz: "", ru: "", en: "", kz: "" };

const emptyPage = (): MarketingPage => ({
  title: { ...EMPTY_TF },
  subtitle: { ...EMPTY_TF },
  intro: { ...EMPTY_TF },
  image: "",
  stats: [],
});

const EMPTY_PAGES: MarketingPages = {
  about: emptyPage(),
  services: emptyPage(),
  engineering: emptyPage(),
  projects: emptyPage(),
  industries: emptyPage(),
};

interface Props {
  close: () => void;
  initialTab?: MarketingPageKey;
}

/**
 * Inline editor for the standalone marketing pages (About, Services,
 * Engineering, Projects, Industries). Edits the `pages` slice of HomeContent —
 * hero title/subtitle, intro paragraph, banner image and headline stats.
 */
export function MarketingPagesBlockEditor({ close, initialTab = "about" }: Props) {
  const dispatch = useAppDispatch();
  const t = useEditorDict();
  const { data, isLoading } = useGetHomeContentQuery();
  const [update, { isLoading: saving }] = useUpdateHomeContentMutation();

  const [pages, setPages] = useState<MarketingPages>(EMPTY_PAGES);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<MarketingPageKey>(initialTab);

  useEffect(() => {
    if (data?.pages) setPages(data.pages);
  }, [data]);

  const setPage = (key: MarketingPageKey, value: MarketingPage) =>
    setPages((p) => ({ ...p, [key]: value }));

  const handleSave = async () => {
    setError(null);
    try {
      await update({ pages }).unwrap();
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

  const tabs: { id: MarketingPageKey; label: string; icon: typeof Building2 }[] =
    [
      { id: "about", label: t.about, icon: Building2 },
      { id: "services", label: t.pageServices, icon: Wrench },
      { id: "engineering", label: t.pageEngineering, icon: Cpu },
      { id: "projects", label: t.pageProjects, icon: Briefcase },
      { id: "industries", label: t.pageIndustries, icon: Factory },
    ];

  const cur = pages[tab];
  const showIntro = tab === "about";
  const showStats = tab === "about" || tab === "projects";

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

      <FieldGroup title={t.marketingTitle} description={t.marketingDesc}>
        <SmartTextField
          label={t.title}
          value={cur.title}
          onChange={(v) => setPage(tab, { ...cur, title: v })}
        />
        <SmartTextField
          label={t.subtitle}
          value={cur.subtitle}
          onChange={(v) => setPage(tab, { ...cur, subtitle: v })}
          multiline
          rows={3}
        />
        {showIntro && (
          <SmartTextField
            label={t.introText}
            value={cur.intro}
            onChange={(v) => setPage(tab, { ...cur, intro: v })}
            multiline
            rows={4}
          />
        )}
        <ImageField
          label={t.heroImageLabel}
          value={cur.image}
          onChange={(url) => setPage(tab, { ...cur, image: url })}
        />
        {showStats && (
          <StatListEditor
            value={cur.stats}
            onChange={(stats) => setPage(tab, { ...cur, stats })}
          />
        )}
      </FieldGroup>
    </EditorShell>
  );
}

/* ── Stat list ─────────────────────────────────────────────── */

function StatListEditor({
  value,
  onChange,
}: {
  value: PageStat[];
  onChange: (v: PageStat[]) => void;
}) {
  const t = useEditorDict();
  const add = () => onChange([...value, { value: "", label: { ...EMPTY_TF } }]);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const set = (i: number, patch: Partial<PageStat>) =>
    onChange(value.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  return (
    <div>
      <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
        {t.statsLabel}
      </label>
      <div className="space-y-2.5">
        {value.map((s, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--color-border)] bg-white p-3"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {t.stat} {i + 1}
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
                label={t.statValue}
                value={s.value}
                onChange={(v) => set(i, { value: v })}
                placeholder="250+"
              />
              <SmartTextField
                label={t.statLabel}
                value={s.label}
                onChange={(v) => set(i, { label: v })}
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
          {t.addStat}
        </button>
      </div>
    </div>
  );
}
