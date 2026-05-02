"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { useAppSelector } from "@/shared/hooks";
import { getImageUrl } from "@/shared/lib/utils";
import { useEditorDict } from "../useEditorDict";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface Props {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  hint?: string;
}

export function ImageField({ label, value, onChange, hint }: Props) {
  const token = useAppSelector((s) => s.auth.token);
  const t = useEditorDict();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!token) {
      setError(t.authRequired);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(t.fileTooLarge);
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_URL}/upload/single`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Upload failed (${res.status})`);
      }
      const json = (await res.json()) as { data?: { url?: string } };
      const url = json.data?.url;
      if (!url) throw new Error("Server returned no URL");
      onChange(url);
    } catch (e) {
      const msg = e instanceof Error ? e.message : t.uploadFailed;
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <div>
      {label && (
        <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] aspect-video">
          <Image
            src={getImageUrl(value)}
            alt=""
            fill
            className="object-cover"
            sizes="500px"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
            aria-label="Remove"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-full bg-white/95 hover:bg-white text-slate-700 text-[11.5px] font-semibold px-3 py-1.5 transition-colors"
          >
            {uploading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Upload className="h-3 w-3" />
            )}
            {t.replace}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full aspect-video rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-soft)]/40 transition-colors flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-[var(--color-brand)]"
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-[12px] font-semibold">{t.loading}</span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6" />
              <span className="text-[12px] font-semibold">
                {t.selectImage}
              </span>
              <span className="text-[10.5px] text-slate-400">
                {t.imageHint}
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {error && (
        <p className="mt-1.5 text-[12px] text-[var(--color-accent)] font-medium">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1 text-[11px] text-slate-400">{hint}</p>
      )}
    </div>
  );
}
