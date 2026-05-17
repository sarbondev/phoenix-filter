"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, ChevronRight, FolderTree, Compass, X } from "lucide-react";
import Image from "next/image";
import type { Locale, Direction } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { useGetDirectionsQuery } from "@/store/api/directionApi";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { t, getImageUrl } from "@/shared/lib/utils";

interface CatalogMenuProps {
  locale: Locale;
  dict: Dictionary;
}

export function CatalogMenu({ locale, dict }: CatalogMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeDirectionId, setActiveDirectionId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: directions, isLoading: dirLoading } = useGetDirectionsQuery(undefined, {
    skip: !open,
  });
  const { data: categories, isLoading: catLoading } = useGetCategoriesQuery(undefined, {
    skip: !open,
  });

  const sortedDirections = useMemo(
    () => (directions ?? []).slice().sort((a, b) => a.sortOrder - b.sortOrder),
    [directions],
  );
  const activeDirection =
    sortedDirections.find((d) => d.id === activeDirectionId) ?? sortedDirections[0];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  useEffect(() => {
    if (open && sortedDirections.length && !activeDirectionId) {
      setActiveDirectionId(sortedDirections[0].id);
    }
  }, [open, sortedDirections, activeDirectionId]);

  const isLoading = dirLoading || catLoading;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-xl px-4 h-11 text-sm font-semibold transition-colors ${
          open
            ? "bg-[var(--color-brand-strong)] text-white"
            : "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)]"
        }`}
      >
        {open ? <X className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
        <span>{dict.nav.catalog}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-full mt-2 w-[760px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white border border-slate-200/80 overflow-hidden z-50"
            style={{
              boxShadow:
                "0 16px 40px -8px rgba(0,0,0,0.12), 0 4px 12px -4px rgba(0,0,0,0.06)",
            }}
          >
            {isLoading ? (
              <CatalogSkeleton />
            ) : sortedDirections.length === 0 ? (
              <EmptyState dict={dict} />
            ) : (
              <div className="grid grid-cols-[240px_1fr] min-h-[360px] max-h-[480px]">
                {/* Directions */}
                <div className="border-r border-slate-100 bg-slate-50/50 overflow-y-auto py-2">
                  {sortedDirections.map((d) => (
                    <button
                      key={d.id}
                      onMouseEnter={() => setActiveDirectionId(d.id)}
                      onClick={() => setActiveDirectionId(d.id)}
                      className={`group flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-[13.5px] transition-colors ${
                        activeDirection?.id === d.id
                          ? "bg-white text-[var(--color-brand)] font-semibold"
                          : "text-slate-700 hover:bg-white hover:text-[var(--color-brand)]"
                      }`}
                    >
                      <span className="truncate">{t(d.name, locale)}</span>
                      <ChevronRight
                        className={`h-3.5 w-3.5 flex-shrink-0 transition-colors ${
                          activeDirection?.id === d.id
                            ? "text-[var(--color-brand)]"
                            : "text-slate-300 group-hover:text-[var(--color-brand)]/70"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Categories of active direction */}
                <div className="overflow-y-auto p-5">
                  {activeDirection && (
                    <DirectionColumn
                      direction={activeDirection}
                      categories={(categories ?? []).filter(
                        (c) => c.direction === activeDirection.id,
                      )}
                      locale={locale}
                      dict={dict}
                      onSelect={() => setOpen(false)}
                    />
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DirectionColumn({
  direction,
  categories,
  locale,
  dict,
  onSelect,
}: {
  direction: Direction;
  categories: { id: string; name: import("@/shared/types").TranslatedField; slug: string }[];
  locale: Locale;
  dict: Dictionary;
  onSelect: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Link
          href={`/${locale}/yonalish/${direction.slug}`}
          onClick={onSelect}
          className="group flex items-center gap-2 text-base font-bold text-slate-900 hover:text-[var(--color-brand)] transition-colors"
        >
          {direction.image ? (
            <span className="relative h-8 w-8 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
              <Image
                src={getImageUrl(direction.image)}
                alt={t(direction.name, locale)}
                fill
                className="object-cover"
                sizes="32px"
              />
            </span>
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)] flex-shrink-0">
              <Compass className="h-4 w-4" />
            </span>
          )}
          <span className="truncate">{t(direction.name, locale)}</span>
          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[var(--color-brand)] group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${locale}/yonalish/${direction.slug}/${cat.slug}`}
              onClick={onSelect}
              className="group flex items-center gap-2 px-3 py-2 rounded-lg text-[13.5px] text-slate-600 hover:bg-[var(--color-brand-soft)] hover:text-[var(--color-brand)] transition-colors"
            >
              <FolderTree className="h-3.5 w-3.5 text-slate-400 group-hover:text-[var(--color-brand)] flex-shrink-0" />
              <span className="truncate">{t(cat.name, locale)}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic">
          {dict.categories.noCategories}
        </p>
      )}

      <div className="mt-5 pt-4 border-t border-slate-100">
        <Link
          href={`/${locale}/yonalish/${direction.slug}`}
          onClick={onSelect}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]"
        >
          {dict.categories.viewAll}
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-[240px_1fr] min-h-[360px]">
      <div className="border-r border-slate-100 bg-slate-50/50 py-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-4 py-2.5">
            <div className="h-3.5 w-32 rounded bg-slate-200/80 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="p-5 space-y-3">
        <div className="h-5 w-44 rounded bg-slate-200/80 animate-pulse" />
        <div className="grid grid-cols-2 gap-2 pt-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 rounded-lg bg-slate-100 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ dict }: { dict: Dictionary }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
        <Compass className="h-6 w-6" />
      </div>
      <p className="text-sm text-slate-500">{dict.directions.empty}</p>
    </div>
  );
}
