"use client";

import { useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Loader2,
  Check,
  X as XIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  useGetAllFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  type Faq,
} from "@/store/api/faqApi";
import { useAppDispatch } from "@/shared/hooks";
import { addToast } from "@/store/toastSlice";
import { useLocaleParam } from "@/shared/hooks";
import { t as tf } from "@/shared/lib/utils";
import { useEditorDict } from "../useEditorDict";

interface Props {
  close: () => void;
}

export function FaqBlockEditor({ close }: Props) {
  const dispatch = useAppDispatch();
  const t = useEditorDict();
  const { data: faqs, isLoading } = useGetAllFaqsQuery();
  const [createFaq, { isLoading: creating }] = useCreateFaqMutation();
  const [updateFaq] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();
  const locale = useLocaleParam();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");

  const handleAdd = async () => {
    if (!newQ.trim() || !newA.trim()) return;
    try {
      await createFaq({
        question: newQ.trim(),
        answer: newA.trim(),
        isActive: true,
        sortOrder: (faqs?.length ?? 0) * 10,
      }).unwrap();
      setNewQ("");
      setNewA("");
      setShowAddForm(false);
      dispatch(addToast({ message: t.faqAdded, type: "success" }));
    } catch {
      dispatch(addToast({ message: t.saveError, type: "error" }));
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Body */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        ) : (faqs ?? []).length === 0 && !showAddForm ? (
          <div className="text-center py-8">
            <p className="text-[13px] text-slate-500 mb-3">{t.noFaqsYet}</p>
          </div>
        ) : (
          (faqs ?? []).map((faq) => (
            <FaqItemRow
              key={faq.id}
              faq={faq}
              locale={locale}
              onUpdate={async (data) => {
                await updateFaq({ id: faq.id, data }).unwrap();
              }}
              onDelete={async () => {
                if (!confirm(t.deleteConfirm)) return;
                await deleteFaq(faq.id).unwrap();
                dispatch(addToast({ message: t.faqDeleted, type: "info" }));
              }}
            />
          ))
        )}

        {/* Add form */}
        {showAddForm ? (
          <div className="rounded-xl border-2 border-dashed border-[var(--color-brand)] bg-[var(--color-brand-soft)]/30 p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--color-brand)]">
                {t.newFaq}
              </span>
              <span className="text-[10.5px] text-slate-500">
                {t.aiHintShort}
              </span>
            </div>
            <input
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              placeholder={t.question}
              className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-[13.5px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--color-brand)]"
              autoFocus
            />
            <textarea
              value={newA}
              onChange={(e) => setNewA(e.target.value)}
              placeholder={t.answer}
              rows={3}
              className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-[13.5px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--color-brand)] resize-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewQ("");
                  setNewA("");
                }}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-slate-700 hover:bg-slate-100"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleAdd}
                disabled={!newQ.trim() || !newA.trim() || creating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white text-[12px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
                {t.add}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-soft)]/40 py-3 text-[13px] font-semibold text-slate-500 hover:text-[var(--color-brand)] transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t.addNewFaq}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--color-border)] bg-white px-5 py-3 flex items-center justify-end">
        <button
          type="button"
          onClick={close}
          className="px-4 py-2 rounded-lg bg-[var(--color-ink)] hover:bg-[var(--color-ink-2)] text-white text-[13px] font-semibold transition-colors"
        >
          {t.finish}
        </button>
      </div>
    </div>
  );
}

function FaqItemRow({
  faq,
  locale,
  onUpdate,
  onDelete,
}: {
  faq: Faq;
  locale: import("@/shared/types").Locale;
  onUpdate: (data: {
    question?: string;
    answer?: string;
    isActive?: boolean;
  }) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);
  const [savingDelete, setSavingDelete] = useState(false);
  const [editQ, setEditQ] = useState(tf(faq.question, locale));
  const [editA, setEditA] = useState(tf(faq.answer, locale));
  const dispatch = useAppDispatch();
  const t = useEditorDict();

  const handleSave = async () => {
    if (!editQ.trim() || !editA.trim()) return;
    setSavingEdit(true);
    try {
      await onUpdate({ question: editQ.trim(), answer: editA.trim() });
      setEditing(false);
      dispatch(addToast({ message: t.saved, type: "success" }));
    } finally {
      setSavingEdit(false);
    }
  };

  const handleToggleActive = async () => {
    setSavingToggle(true);
    try {
      await onUpdate({ isActive: !faq.isActive });
    } finally {
      setSavingToggle(false);
    }
  };

  const handleDelete = async () => {
    setSavingDelete(true);
    try {
      await onDelete();
    } finally {
      setSavingDelete(false);
    }
  };

  if (editing) {
    return (
      <div className="rounded-xl border-2 border-[var(--color-brand)] bg-white p-3 space-y-2.5">
        <input
          value={editQ}
          onChange={(e) => setEditQ(e.target.value)}
          placeholder={t.question}
          className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-[13.5px] focus:outline-none focus:border-[var(--color-brand)]"
        />
        <textarea
          value={editA}
          onChange={(e) => setEditA(e.target.value)}
          placeholder={t.answer}
          rows={3}
          className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-[13.5px] focus:outline-none focus:border-[var(--color-brand)] resize-none"
        />
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setEditQ(tf(faq.question, locale));
              setEditA(tf(faq.answer, locale));
            }}
            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-slate-700 hover:bg-slate-100"
          >
            <XIcon className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={savingEdit || !editQ.trim() || !editA.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white text-[12px] font-semibold disabled:opacity-50"
          >
            {savingEdit ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Check className="h-3 w-3" />
            )}
            {t.save}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border bg-white p-3 group hover:border-[var(--color-brand)]/40 transition-colors ${
        faq.isActive
          ? "border-[var(--color-border)]"
          : "border-slate-200 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold text-slate-900 line-clamp-1">
            {tf(faq.question, locale)}
          </p>
          <p className="text-[12px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
            {tf(faq.answer, locale)}
          </p>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleToggleActive}
            disabled={savingToggle}
            className="p-1.5 text-slate-400 hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] rounded-md transition-colors disabled:opacity-50"
            title={faq.isActive ? t.hide : t.show}
          >
            {savingToggle ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : faq.isActive ? (
              <Eye className="h-3.5 w-3.5" />
            ) : (
              <EyeOff className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="p-1.5 text-slate-400 hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] rounded-md transition-colors"
            title={t.edit}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={savingDelete}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            title={t.delete}
          >
            {savingDelete ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
