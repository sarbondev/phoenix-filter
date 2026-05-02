"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, ChevronDown, Check } from "lucide-react";
import type { TranslatedField as TF } from "@/shared/types";
import { useEditorDict } from "../useEditorDict";

const LANGS: { code: keyof TF; label: string; flag: string }[] = [
  { code: "ru", label: "RU", flag: "🇷🇺" },
  { code: "uz", label: "UZ", flag: "🇺🇿" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "kz", label: "KZ", flag: "🇰🇿" },
];

const EMPTY: TF = { uz: "", ru: "", en: "", kz: "" };

interface Props {
  label?: string;
  value: TF;
  onChange: (value: TF) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  hint?: string;
  /** Default source language (defaults to RU). */
  defaultLang?: keyof TF;
  /** When true, hides the AI hint (e.g. for very short fields). */
  hideAiHint?: boolean;
}

/**
 * Single-input translated field. The user types in ONE language; the server
 * automatically translates to the others on save (Gemini AI).
 *
 * Power users can click the language pill to switch source language, or
 * expand "✏️ Qo'lda" to manually edit all four languages.
 */
export function SmartTextField({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder,
  hint,
  defaultLang = "ru",
  hideAiHint = false,
}: Props) {
  const safe = value ?? EMPTY;

  // Source language: first non-empty language (so editing existing entries
  // shows what was previously typed), else the default.
  const initialLang =
    (LANGS.map((l) => l.code).find((l) => safe[l]) as keyof TF | undefined) ??
    defaultLang;

  const [activeLang, setActiveLang] = useState<keyof TF>(initialLang);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const t = useEditorDict();

  // Re-sync activeLang when the field's content arrives later (async query).
  useEffect(() => {
    if (!safe[activeLang]) {
      const firstFilled = LANGS.map((l) => l.code).find((l) => safe[l]);
      if (firstFilled && firstFilled !== activeLang) setActiveLang(firstFilled);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Close lang menu on outside click.
  useEffect(() => {
    if (!langMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(e.target as Node)
      ) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langMenuOpen]);

  const handleType = (text: string) => {
    onChange({ ...safe, [activeLang]: text });
  };

  const inputClass =
    "w-full rounded-lg border border-[var(--color-border)] bg-white pr-3 pl-3 py-2 text-[13.5px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/15 transition-all";

  if (advanced) {
    return (
      <AdvancedTabsView
        label={label}
        value={safe}
        onChange={onChange}
        onCollapse={() => setAdvanced(false)}
        multiline={multiline}
        rows={rows}
        placeholder={placeholder}
        hint={hint}
      />
    );
  }

  const currentLang = LANGS.find((l) => l.code === activeLang)!;
  const otherLangsFilled = LANGS.filter(
    (l) => l.code !== activeLang && safe[l.code],
  );

  return (
    <div>
      {label && (
        <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {multiline ? (
          <textarea
            rows={rows}
            value={safe[activeLang] ?? ""}
            onChange={(e) => handleType(e.target.value)}
            placeholder={placeholder}
            className={`${inputClass} resize-none pr-20`}
          />
        ) : (
          <input
            value={safe[activeLang] ?? ""}
            onChange={(e) => handleType(e.target.value)}
            placeholder={placeholder}
            className={`${inputClass} pr-20`}
          />
        )}

        {/* Source language picker — top-right inside input */}
        <div
          ref={langMenuRef}
          className={`absolute right-1.5 ${multiline ? "top-1.5" : "top-1/2 -translate-y-1/2"}`}
        >
          <button
            type="button"
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="inline-flex items-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200 px-2 py-1 text-[11px] font-bold text-slate-700 transition-colors"
          >
            <span className="text-[12px] leading-none">{currentLang.flag}</span>
            <span>{currentLang.label}</span>
            <ChevronDown
              className={`h-2.5 w-2.5 text-slate-400 transition-transform ${
                langMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 rounded-lg bg-white border border-slate-200 overflow-hidden z-10 shadow-lg">
              <div className="px-2 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100">
                {t.writingLanguage}
              </div>
              {LANGS.map((l) => (
                <button
                  type="button"
                  key={l.code}
                  onClick={() => {
                    setActiveLang(l.code);
                    setLangMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-2.5 py-1.5 text-[12.5px] transition-colors ${
                    l.code === activeLang
                      ? "bg-[var(--color-brand-soft)] text-[var(--color-brand)] font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                  {safe[l.code] && (
                    <Check className="h-3 w-3 ml-auto text-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hint row */}
      <div className="mt-1.5 flex items-center justify-between gap-2">
        {!hideAiHint ? (
          <p className="flex items-center gap-1 text-[10.5px] text-slate-400">
            <Sparkles className="h-3 w-3 text-[var(--color-brand)]" />
            <span>
              {otherLangsFilled.length > 0 ? (
                <>
                  {t.aiHintFilled}:{" "}
                  {otherLangsFilled.map((l) => l.label).join(", ")} ✓
                </>
              ) : (
                <>{t.aiHint}</>
              )}
            </span>
          </p>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => setAdvanced(true)}
          className="text-[10.5px] font-semibold text-slate-400 hover:text-[var(--color-brand)] transition-colors"
        >
          ✏️ {t.manualEdit}
        </button>
      </div>
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

/**
 * Advanced 4-tab view (collapsed by default). Lets power users override
 * each language manually instead of relying on AI.
 */
function AdvancedTabsView({
  label,
  value,
  onChange,
  onCollapse,
  multiline,
  rows,
  placeholder,
  hint,
}: {
  label?: string;
  value: TF;
  onChange: (v: TF) => void;
  onCollapse: () => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  const [active, setActive] = useState<keyof TF>("ru");
  const t = useEditorDict();
  const handle = (lang: keyof TF, v: string) =>
    onChange({ ...value, [lang]: v });

  const inputClass =
    "w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-[13.5px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/15 transition-all";

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[12.5px] font-semibold text-slate-700">
            {label}
          </label>
          <button
            type="button"
            onClick={onCollapse}
            className="text-[10.5px] font-semibold text-slate-500 hover:text-[var(--color-brand)]"
          >
            ✕ {t.closeManual}
          </button>
        </div>
      )}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 overflow-hidden">
        <div className="flex items-center gap-1 px-2 pt-2">
          {LANGS.map((l) => {
            const isEmpty = !value[l.code];
            const isActive = active === l.code;
            return (
              <button
                type="button"
                key={l.code}
                onClick={() => setActive(l.code)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-bold transition-colors ${
                  isActive
                    ? "bg-[var(--color-brand)] text-white"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                <span className="text-[13px] leading-none">{l.flag}</span>
                {l.label}
                {isEmpty && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive ? "bg-white/80" : "bg-amber-400"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="p-2 pt-2">
          {multiline ? (
            <textarea
              rows={rows ?? 3}
              value={value[active] ?? ""}
              onChange={(e) => handle(active, e.target.value)}
              placeholder={placeholder}
              className={`${inputClass} resize-none`}
            />
          ) : (
            <input
              value={value[active] ?? ""}
              onChange={(e) => handle(active, e.target.value)}
              placeholder={placeholder}
              className={inputClass}
            />
          )}
        </div>
      </div>
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

/**
 * List of TranslatedField items (e.g. hero feature bullets). Each item uses
 * SmartTextField, so single-input + AI translation by default.
 */
export function SmartTextListField({
  label,
  values,
  onChange,
  placeholder,
  itemLabel,
}: {
  label?: string;
  values: TF[];
  onChange: (values: TF[]) => void;
  placeholder?: string;
  itemLabel?: string;
}) {
  const t = useEditorDict();
  const add = () => onChange([...values, { ...EMPTY }]);
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const set = (i: number, v: TF) =>
    onChange(values.map((x, idx) => (idx === i ? v : x)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= values.length) return;
    const next = [...values];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      {label && (
        <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="space-y-2.5">
        {values.map((v, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--color-border)] bg-white p-2.5"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {itemLabel ?? "Item"} {i + 1}
              </span>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  title={t.moveUp}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, +1)}
                  disabled={i === values.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  title={t.moveDown}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="px-1.5 text-red-500 hover:bg-red-50 rounded text-[14px]"
                  title={t.delete}
                >
                  ✕
                </button>
              </div>
            </div>
            <SmartTextField
              value={v}
              onChange={(nv) => set(i, nv)}
              placeholder={placeholder}
              hideAiHint={i > 0}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="w-full rounded-xl border border-dashed border-[var(--color-border)] hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] py-2.5 text-[13px] font-semibold text-slate-500 hover:text-[var(--color-brand)] transition-colors"
        >
          + {t.addItem}
        </button>
      </div>
    </div>
  );
}
