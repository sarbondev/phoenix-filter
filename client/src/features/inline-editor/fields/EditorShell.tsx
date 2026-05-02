"use client";

import { Loader2, Save } from "lucide-react";
import type { ReactNode } from "react";
import { useEditorDict } from "../useEditorDict";

interface Props {
  children: ReactNode;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  errorMessage?: string;
}

/**
 * Standard form shell for inline block editors.
 * - Scrollable body for fields.
 * - Sticky bottom bar with Save / Cancel buttons.
 */
export function EditorShell({
  children,
  onSave,
  onCancel,
  saving = false,
  saveLabel,
  cancelLabel,
  errorMessage,
}: Props) {
  const t = useEditorDict();
  return (
    <div className="flex flex-col h-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-5">
          {children}
        </div>

        {errorMessage && (
          <div className="mx-5 mb-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-[12.5px] text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="border-t border-[var(--color-border)] bg-white px-5 py-3 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            {cancelLabel ?? t.cancel}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white text-[13px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {saveLabel ?? t.save}
          </button>
        </div>
      </form>
    </div>
  );
}

export function FieldGroup({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[13px] font-bold text-slate-900 mb-0.5">{title}</h3>
      {description && (
        <p className="text-[11.5px] text-slate-500 mb-3">{description}</p>
      )}
      {!description && <div className="h-3" />}
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function PlainInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      {label && (
        <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-[13.5px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/15 transition-all"
      />
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

export function PlainSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label?: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div>
      {label && (
        <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-[13.5px] text-slate-800 focus:outline-none focus:border-[var(--color-brand)] transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ToggleField({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 px-3 py-2.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] cursor-pointer transition-colors">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[var(--color-brand)] focus:ring-[var(--color-brand)]"
      />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold text-slate-800">{label}</div>
        {description && (
          <div className="text-[11.5px] text-slate-500 mt-0.5">
            {description}
          </div>
        )}
      </div>
    </label>
  );
}
