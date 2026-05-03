"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string; // last item typically has no href
}

interface Props {
  items: BreadcrumbItem[];
  homeHref: string;
  homeLabel?: string;
  className?: string;
}

export function Breadcrumbs({ items, homeHref, homeLabel, className = "" }: Props) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-[12.5px] text-slate-500">
        <li className="flex items-center">
          <Link
            href={homeHref}
            className="inline-flex items-center gap-1 hover:text-[var(--color-brand)] transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            {homeLabel && <span className="hidden sm:inline">{homeLabel}</span>}
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" aria-hidden />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-[var(--color-brand)] transition-colors truncate max-w-[180px]"
                  title={item.label}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="font-medium text-slate-700 truncate max-w-[280px]"
                  aria-current={isLast ? "page" : undefined}
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
