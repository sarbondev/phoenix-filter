"use client";

import { Sparkles } from "lucide-react";
import type { TranslatedField as TF, Locale } from "@/shared/types";
import { useLocaleParam } from "@/shared/hooks";
import { useEditorDict } from "../useEditorDict";

const EMPTY: TF = { uz: "", ru: "", en: "", kz: "" };

interface Props {
  label?: string;
  value: TF;
  onChange: (value: TF) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  hint?: string;
  /** When true, hides the AI hint (e.g. for very short fields). */
  hideAiHint?: boolean;
}

/**
 * Single-input translated field. The user types in their current UI locale;
 * the server fills the other languages via Gemini on save. Editing the value
 * clears the other locales so translations refresh from the latest source.
 */
export function SmartTextField({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder,
  hint,
  hideAiHint = false,
}: Props) {
  const safe = value ?? EMPTY;
  const locale = useLocaleParam() as Locale;
  const t = useEditorDict();

  // Display: prefer current locale; fall back to first non-empty so existing
  // entries are visible even if no value was stored for this locale.
  const displayed =
    safe[locale] ||
    safe.ru ||
    safe.uz ||
    safe.en ||
    safe.kz ||
    "";

  const handleType = (text: string) => {
    onChange({ uz: "", ru: "", en: "", kz: "", [locale]: text });
  };

  const inputClass =
    "w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-[13.5px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/15 transition-all";

  return (
    <div>
      {label && (
        <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          rows={rows}
          value={displayed}
          onChange={(e) => handleType(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input
          value={displayed}
          onChange={(e) => handleType(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
      {!hideAiHint && (
        <p className="mt-1.5 flex items-center gap-1 text-[10.5px] text-slate-400">
          <Sparkles className="h-3 w-3 text-[var(--color-brand)]" />
          <span>{t.aiHint}</span>
        </p>
      )}
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
