"use client";

import type { ReactNode } from "react";
import { Pencil } from "lucide-react";
import { useEditMode, type EditorBlock } from "./EditModeContext";

interface EditableProps {
  /** Stable id for this block — useful for analytics/debug. */
  id: string;
  /** Short label shown in the hover overlay (e.g. "Hero"). */
  label: string;
  /** Builder for the editor — invoked only when admin clicks the pencil. */
  block: Omit<EditorBlock, "id"> | (() => Omit<EditorBlock, "id">);
  /** Children — the actual content rendered as-is in normal mode. */
  children: ReactNode;
  /** Optional className applied to the outer wrapper. */
  className?: string;
}

/**
 * Wraps any block of content. When edit mode is on AND user is admin,
 * a hover overlay with a pencil icon appears. Click → opens the slide-over
 * editor configured by `block`.
 */
export function Editable({
  id,
  label,
  block,
  children,
  className = "",
}: EditableProps) {
  const { editMode, openEditor } = useEditMode();

  if (!editMode) {
    // Zero overhead for regular users — render children plainly.
    return className ? <div className={className}>{children}</div> : <>{children}</>;
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cfg = typeof block === "function" ? block() : block;
    openEditor({ ...cfg, id });
  };

  return (
    <div
      className={`relative group/editable transition-colors ${className}`}
      data-editable={id}
    >
      {/* Dashed outline on hover (subtle) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[var(--color-brand)]/0 group-hover/editable:ring-[var(--color-brand)]/40 transition-all z-[5]"
        aria-hidden
      />

      {/* Edit pill — top-right */}
      <button
        type="button"
        onClick={handleEdit}
        className="absolute top-3 right-3 z-[15] inline-flex items-center gap-1.5 rounded-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white text-[11.5px] font-bold px-3 py-1.5 opacity-0 group-hover/editable:opacity-100 transition-opacity"
        style={{
          boxShadow: "0 4px 14px -2px rgba(31, 77, 255, 0.4)",
        }}
      >
        <Pencil className="h-3 w-3" />
        {label}
      </button>

      {children}
    </div>
  );
}
