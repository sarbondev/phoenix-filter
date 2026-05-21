"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Search,
  Hash,
  Repeat,
  Ruler,
  Truck,
  Camera,
  Loader2,
  Upload,
  PackageX,
  ArrowRight,
} from "lucide-react";
import type { Locale, Product } from "@/shared/types";
import {
  useSearchByOemMutation,
  useSearchByAnalogMutation,
  useSearchBySizeMutation,
  useSearchByMachineMutation,
  useSearchByPhotoMutation,
} from "@/store/api/filterSearchApi";
import { useGetEquipmentTypesQuery } from "@/store/api/equipmentTypeApi";
import { useQueryParams } from "@/shared/hooks/useQueryParams";
import { t, formatPrice, getImageUrl } from "@/shared/lib/utils";
import { FS, trFs } from "./strings";

type Tab = "oem" | "analog" | "size" | "machine" | "photo";

const TABS: { id: Tab; icon: typeof Hash }[] = [
  { id: "oem", icon: Hash },
  { id: "analog", icon: Repeat },
  { id: "size", icon: Ruler },
  { id: "machine", icon: Truck },
  { id: "photo", icon: Camera },
];
const TAB_IDS = TABS.map((x) => x.id);

export function FilterSearchClient({
  locale,
  initialQuery,
}: {
  locale: Locale;
  initialQuery: string;
}) {
  const { params, setParams } = useQueryParams();
  const tab: Tab = TAB_IDS.includes(params.tab as Tab)
    ? (params.tab as Tab)
    : "oem";
  const [results, setResults] = useState<Product[] | null>(null);
  const [total, setTotal] = useState(0);
  const [photoSuccess, setPhotoSuccess] = useState(false);

  return (
    <main className="bg-[var(--color-surface)] min-h-screen">
      <section className="bg-[var(--color-ink)] text-white py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h1 className="text-2xl lg:text-[34px] font-extrabold leading-tight tracking-tight">
            {trFs(FS.page.title, locale)}
          </h1>
          <p className="mt-3 text-white/80 max-w-2xl text-[14px] lg:text-[15px]">
            {trFs(FS.page.subtitle, locale)}
          </p>
        </div>
      </section>

      <section className="-mt-8 lg:-mt-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 overflow-hidden">
            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-200">
              {TABS.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setParams({ tab: id });
                    setResults(null);
                    setPhotoSuccess(false);
                  }}
                  className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-5 py-4 text-[13.5px] font-semibold whitespace-nowrap transition-colors ${
                    tab === id
                      ? "text-[var(--color-brand)] border-b-2 border-[var(--color-brand)]"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {trFs(FS.tabs[id], locale)}
                </button>
              ))}
            </div>

            <div className="p-5 lg:p-8">
              {tab === "oem" && (
                <OemForm
                  locale={locale}
                  initialQuery={initialQuery}
                  onResults={(r, t) => {
                    setResults(r);
                    setTotal(t);
                  }}
                />
              )}
              {tab === "analog" && (
                <AnalogForm
                  locale={locale}
                  onResults={(r, t) => {
                    setResults(r);
                    setTotal(t);
                  }}
                />
              )}
              {tab === "size" && (
                <SizeForm
                  locale={locale}
                  onResults={(r, t) => {
                    setResults(r);
                    setTotal(t);
                  }}
                />
              )}
              {tab === "machine" && (
                <MachineForm
                  locale={locale}
                  onResults={(r, t) => {
                    setResults(r);
                    setTotal(t);
                  }}
                />
              )}
              {tab === "photo" && (
                <PhotoForm
                  locale={locale}
                  onSuccess={() => setPhotoSuccess(true)}
                  success={photoSuccess}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {tab === "photo" ? null : (
            <ResultList
              locale={locale}
              results={results}
              total={total}
            />
          )}
        </div>
      </section>
    </main>
  );
}

/* ───── Forms ───────────────────────────────────────────────────────────── */

function OemForm({
  locale,
  initialQuery,
  onResults,
}: {
  locale: Locale;
  initialQuery: string;
  onResults: (results: Product[], total: number) => void;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [run, { isLoading }] = useSearchByOemMutation();

  useEffect(() => {
    if (initialQuery) {
      run({ query: initialQuery })
        .unwrap()
        .then((res) => onResults(res.data ?? [], res.meta?.total ?? 0))
        .catch(() => onResults([], 0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const res = await run({ query: query.trim() }).unwrap();
      onResults(res.data ?? [], res.meta?.total ?? 0);
    } catch {
      onResults([], 0);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={trFs(FS.fields.oemPlaceholder, locale)}
          className="w-full h-14 rounded-lg border border-slate-300 pl-12 pr-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent"
        />
      </div>
      <SubmitButton loading={isLoading}>
        {trFs(FS.buttons.find, locale)}
      </SubmitButton>
    </form>
  );
}

function AnalogForm({
  locale,
  onResults,
}: {
  locale: Locale;
  onResults: (results: Product[], total: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [run, { isLoading }] = useSearchByAnalogMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const res = await run({
        query: query.trim(),
        ...(manufacturer ? { manufacturer } : {}),
      }).unwrap();
      onResults(res.data ?? [], res.meta?.total ?? 0);
    } catch {
      onResults([], 0);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input
        value={query}
        onChange={setQuery}
        placeholder={trFs(FS.fields.analogPlaceholder, locale)}
      />
      <select
        value={manufacturer}
        onChange={(e) => setManufacturer(e.target.value)}
        className="w-full h-12 rounded-lg border border-slate-300 px-3 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
      >
        <option value="">{trFs(FS.fields.manufacturer, locale)}</option>
        {["Donaldson", "Fleetguard", "MANN", "Parker", "HYDAC", "WIX", "Sakura", "Baldwin"].map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
      <SubmitButton loading={isLoading}>
        {trFs(FS.buttons.find, locale)}
      </SubmitButton>
    </form>
  );
}

function SizeForm({
  locale,
  onResults,
}: {
  locale: Locale;
  onResults: (results: Product[], total: number) => void;
}) {
  const [height, setHeight] = useState("");
  const [outer, setOuter] = useState("");
  const [inner, setInner] = useState("");
  const [thread, setThread] = useState("");
  const [tol, setTol] = useState("5");
  const [run, { isLoading }] = useSearchBySizeMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, number | string> = {};
    if (height) payload.height = Number(height);
    if (outer) payload.outerDiameter = Number(outer);
    if (inner) payload.innerDiameter = Number(inner);
    if (thread) payload.threadSize = thread;
    if (tol) payload.tolerance = Number(tol);
    try {
      const res = await run(payload).unwrap();
      onResults(res.data ?? [], res.meta?.total ?? 0);
    } catch {
      onResults([], 0);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          value={height}
          onChange={setHeight}
          placeholder={trFs(FS.fields.height, locale)}
          type="number"
        />
        <Input
          value={outer}
          onChange={setOuter}
          placeholder={trFs(FS.fields.outerDiameter, locale)}
          type="number"
        />
        <Input
          value={inner}
          onChange={setInner}
          placeholder={trFs(FS.fields.innerDiameter, locale)}
          type="number"
        />
        <Input
          value={thread}
          onChange={setThread}
          placeholder={trFs(FS.fields.threadSize, locale)}
        />
        <Input
          value={tol}
          onChange={setTol}
          placeholder={trFs(FS.fields.tolerance, locale)}
          type="number"
        />
      </div>
      <SubmitButton loading={isLoading}>
        {trFs(FS.buttons.find, locale)}
      </SubmitButton>
    </form>
  );
}

function MachineForm({
  locale,
  onResults,
}: {
  locale: Locale;
  onResults: (results: Product[], total: number) => void;
}) {
  const { data: equipment } = useGetEquipmentTypesQuery();
  const brandOptions = Array.from(
    new Set((equipment ?? []).flatMap((e) => e.machineBrands ?? [])),
  ).sort();

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [engine, setEngine] = useState("");
  const [year, setYear] = useState("");
  const [run, { isLoading }] = useSearchByMachineMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand) return;
    try {
      const res = await run({
        machineBrand: brand,
        ...(model ? { model } : {}),
        ...(engine ? { engine } : {}),
        ...(year ? { year } : {}),
      }).unwrap();
      onResults(res.data ?? [], res.meta?.total ?? 0);
    } catch {
      onResults([], 0);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
          className="h-12 rounded-lg border border-slate-300 px-3 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
        >
          <option value="">{trFs(FS.fields.machineBrand, locale)}</option>
          {brandOptions.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <Input
          value={model}
          onChange={setModel}
          placeholder={trFs(FS.fields.model, locale)}
        />
        <Input
          value={engine}
          onChange={setEngine}
          placeholder={trFs(FS.fields.engine, locale)}
        />
        <Input
          value={year}
          onChange={setYear}
          placeholder={trFs(FS.fields.year, locale)}
        />
      </div>
      <SubmitButton loading={isLoading}>
        {trFs(FS.buttons.find, locale)}
      </SubmitButton>
    </form>
  );
}

function PhotoForm({
  locale,
  onSuccess,
  success,
}: {
  locale: Locale;
  onSuccess: () => void;
  success: boolean;
}) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [run] = useSearchByPhotoMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !file) return;
    setUploading(true);
    try {
      // Upload to /api/upload first.
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await fetch(
        (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api") + "/upload",
        { method: "POST", body: form },
      );
      const uploadData = await uploadRes.json();
      const imageUrl =
        uploadData?.data?.url ?? uploadData?.data?.path ?? uploadData?.url;
      if (!imageUrl) throw new Error("Upload failed");

      await run({
        phoneNumber: phone,
        imageUrl,
        ...(name ? { name } : {}),
        ...(note ? { note } : {}),
        locale,
      }).unwrap();
      onSuccess();
    } catch {
      // swallow — UI stays on form
    } finally {
      setUploading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg bg-[var(--color-success-soft)] border border-[var(--color-success)]/30 p-6 text-center">
        <p className="text-[15px] text-slate-800">
          {trFs(FS.photo.success, locale)}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-[13px] text-slate-600">{trFs(FS.photo.note, locale)}</p>

      <label className="block">
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-[var(--color-brand)] hover:bg-slate-50 transition-colors">
          <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
          <span className="text-[14px] text-slate-600">
            {file ? file.name : trFs(FS.buttons.upload, locale)}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
      </label>

      <Input
        value={phone}
        onChange={setPhone}
        placeholder={trFs(FS.fields.phone, locale)}
        required
      />
      <Input
        value={name}
        onChange={setName}
        placeholder={trFs(FS.fields.name, locale)}
      />
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={trFs(FS.fields.note, locale)}
        className="w-full rounded-lg border border-slate-300 p-3 text-[14px] min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
      />

      <SubmitButton loading={uploading} disabled={!file || !phone}>
        {trFs(FS.buttons.send, locale)}
      </SubmitButton>
    </form>
  );
}

/* ───── Bits ────────────────────────────────────────────────────────────── */

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full h-12 rounded-lg border border-slate-300 px-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent"
    />
  );
}

function SubmitButton({
  loading,
  disabled,
  children,
}: {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full h-12 rounded-lg bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-semibold text-[14px] inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

function ResultList({
  locale,
  results,
  total,
}: {
  locale: Locale;
  results: Product[] | null;
  total: number;
}) {
  if (results === null) {
    return (
      <div className="text-center text-slate-500 py-12 text-[14px]">
        {trFs(FS.results.initial, locale)}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-xl bg-white ring-1 ring-slate-200 p-10 text-center">
        <PackageX className="h-10 w-10 mx-auto text-slate-300 mb-3" />
        <p className="text-[14px] text-slate-600 max-w-md mx-auto">
          {trFs(FS.results.empty, locale)}
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[13px] text-slate-500 mb-4">
        {total} {trFs(FS.results.countLabel, locale)}
      </p>
      <div className="space-y-3">
        {results.map((p) => (
          <ResultCard key={p.id} product={p} locale={locale} />
        ))}
      </div>
    </div>
  );
}

function ResultCard({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const cover = product.images?.[0];
  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group flex flex-col sm:flex-row gap-4 rounded-xl bg-white ring-1 ring-slate-200 p-4 hover:ring-[var(--color-brand)] hover:shadow-md transition-all"
    >
      <div className="relative h-32 w-full sm:w-32 flex-shrink-0 rounded-lg bg-slate-100 overflow-hidden">
        {cover ? (
          <Image
            src={getImageUrl(cover)}
            alt={t(product.name, locale)}
            fill
            sizes="128px"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          {product.vehicleBrand && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-brand)]">
              {product.vehicleBrand}
            </span>
          )}
          <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-[var(--color-brand)]">
            {t(product.name, locale)}
          </h3>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-500 font-mono">
          {product.sku && <span>SKU: {product.sku}</span>}
          {product.oem && <span>OEM: {product.oem}</span>}
          {product.oemNumbers && product.oemNumbers.length > 1 && (
            <span>+{product.oemNumbers.length - 1}</span>
          )}
        </div>

        {product.crossReferences && product.crossReferences.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.crossReferences.slice(0, 3).map((cr, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
              >
                <span className="font-semibold">{cr.manufacturer}</span>
                {cr.partNumber}
              </span>
            ))}
            {product.crossReferences.length > 3 && (
              <span className="text-[11px] text-slate-400">
                +{product.crossReferences.length - 3}
              </span>
            )}
          </div>
        )}

        {product.application && (
          <p className="mt-2 text-[12px] text-slate-500 line-clamp-1">
            {product.application}
          </p>
        )}
      </div>

      <div className="flex sm:flex-col items-end justify-between gap-2">
        <div className="text-right">
          {product.priceOnRequest ? (
            <span className="inline-flex rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand)] px-3 py-1 text-[11px] font-semibold">
              {trFs(FS.priceOnRequest, locale)}
            </span>
          ) : (
            <span className="text-[16px] font-extrabold text-slate-900">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[var(--color-brand)] group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}
