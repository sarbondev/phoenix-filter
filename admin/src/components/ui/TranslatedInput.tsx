import { useState } from 'react';
import type { TranslatedField } from '@/lib/types';
import { Input } from './Input';
import { Textarea } from './Textarea';

const LANGS: { code: keyof TranslatedField; label: string; flag: string }[] = [
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
  { code: 'uz', label: 'UZ', flag: '🇺🇿' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'kz', label: 'KZ', flag: '🇰🇿' },
];

interface Props {
  label?: string;
  value: TranslatedField;
  onChange: (value: TranslatedField) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const EMPTY: TranslatedField = { uz: '', ru: '', en: '', kz: '' };

export function TranslatedInput({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder,
  error,
}: Props) {
  const [active, setActive] = useState<keyof TranslatedField>('ru');
  const safe = value ?? EMPTY;
  const handle = (lang: keyof TranslatedField, v: string) =>
    onChange({ ...safe, [lang]: v });

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-1 px-2 pt-2">
          {LANGS.map((l) => (
            <button
              type="button"
              key={l.code}
              onClick={() => setActive(l.code)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold transition-colors ${
                active === l.code
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <span>{l.flag}</span>
              {l.label}
              {!safe[l.code] && (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" title="Empty" />
              )}
            </button>
          ))}
        </div>
        <div className="p-2 pt-2">
          {multiline ? (
            <Textarea
              rows={rows}
              value={safe[active]}
              onChange={(e) => handle(active, e.target.value)}
              placeholder={placeholder}
              error={error}
            />
          ) : (
            <Input
              value={safe[active]}
              onChange={(e) => handle(active, e.target.value)}
              placeholder={placeholder}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function TranslatedListInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label?: string;
  values: TranslatedField[];
  onChange: (values: TranslatedField[]) => void;
  placeholder?: string;
}) {
  const add = () => onChange([...values, { ...EMPTY }]);
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const set = (i: number, v: TranslatedField) =>
    onChange(values.map((x, idx) => (idx === i ? v : x)));

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="space-y-3">
        {values.map((v, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1">
              <TranslatedInput
                value={v}
                onChange={(nv) => set(i, nv)}
                placeholder={placeholder}
              />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="mt-2 px-2.5 py-2 text-xs text-red-600 hover:bg-red-50 rounded-md"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          + Add item
        </button>
      </div>
    </div>
  );
}
