"use client";

import { useState } from "react";
import Image from "next/image";
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
  useGetAllIndustriesQuery,
  useCreateIndustryMutation,
  useUpdateIndustryMutation,
  useDeleteIndustryMutation,
  type Industry,
} from "@/store/api/industryApi";
import { useAppDispatch, useLocaleParam } from "@/shared/hooks";
import { addToast } from "@/store/toastSlice";
import { getImageUrl, t as tf } from "@/shared/lib/utils";
import { ImageField } from "../fields/ImageField";
import { useEditorDict } from "../useEditorDict";

interface Props {
  close: () => void;
}

export function IndustriesBlockEditor({ close }: Props) {
  const dispatch = useAppDispatch();
  const t = useEditorDict();
  const locale = useLocaleParam();
  const { data: industries, isLoading } = useGetAllIndustriesQuery();
  const [createIndustry, { isLoading: creating }] = useCreateIndustryMutation();
  const [updateIndustry] = useUpdateIndustryMutation();
  const [deleteIndustry] = useDeleteIndustryMutation();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState("");

  const handleAdd = async () => {
    if (!newName.trim() || !newImage) return;
    try {
      await createIndustry({
        name: newName.trim(),
        image: newImage,
        isActive: true,
        sortOrder: (industries?.length ?? 0) * 10,
      }).unwrap();
      setNewName("");
      setNewImage("");
      setShowAddForm(false);
      dispatch(addToast({ message: t.industryAdded, type: "success" }));
    } catch {
      dispatch(addToast({ message: t.saveError, type: "error" }));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        ) : (industries ?? []).length === 0 && !showAddForm ? (
          <div className="text-center py-8">
            <p className="text-[13px] text-slate-500 mb-3">{t.noIndustriesYet}</p>
          </div>
        ) : (
          (industries ?? []).map((industry) => (
            <IndustryRow
              key={industry.id}
              industry={industry}
              locale={locale}
              onUpdate={async (data) => {
                await updateIndustry({ id: industry.id, data }).unwrap();
              }}
              onDelete={async () => {
                if (!confirm(t.deleteConfirm)) return;
                await deleteIndustry(industry.id).unwrap();
                dispatch(addToast({ message: t.industryDeleted, type: "info" }));
              }}
            />
          ))
        )}

        {showAddForm ? (
          <div className="rounded-xl border-2 border-dashed border-[var(--color-brand)] bg-[var(--color-brand-soft)]/30 p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--color-brand)]">
                {t.newIndustry}
              </span>
              <span className="text-[10.5px] text-slate-500">{t.aiHintShort}</span>
            </div>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t.industryName}
              className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-[13.5px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--color-brand)]"
              autoFocus
            />
            <ImageField label={t.industryImage} value={newImage} onChange={setNewImage} />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewName("");
                  setNewImage("");
                }}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-slate-700 hover:bg-slate-100"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleAdd}
                disabled={!newName.trim() || !newImage || creating}
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
            {t.addNewIndustry}
          </button>
        )}
      </div>

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

function IndustryRow({
  industry,
  locale,
  onUpdate,
  onDelete,
}: {
  industry: Industry;
  locale: import("@/shared/types").Locale;
  onUpdate: (data: { name?: string; image?: string; isActive?: boolean }) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const t = useEditorDict();
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);
  const [savingDelete, setSavingDelete] = useState(false);
  const [editName, setEditName] = useState(tf(industry.name, locale));
  const [editImage, setEditImage] = useState(industry.image);

  const handleSave = async () => {
    if (!editName.trim() || !editImage) return;
    setSavingEdit(true);
    try {
      const data: { name?: string; image?: string } = {};
      if (editName.trim() !== tf(industry.name, locale)) data.name = editName.trim();
      if (editImage !== industry.image) data.image = editImage;
      if (Object.keys(data).length > 0) await onUpdate(data);
      setEditing(false);
      dispatch(addToast({ message: t.saved, type: "success" }));
    } finally {
      setSavingEdit(false);
    }
  };

  const handleToggleActive = async () => {
    setSavingToggle(true);
    try {
      await onUpdate({ isActive: !industry.isActive });
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
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder={t.industryName}
          className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-[13.5px] focus:outline-none focus:border-[var(--color-brand)]"
        />
        <ImageField label={t.industryImage} value={editImage} onChange={setEditImage} />
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setEditName(tf(industry.name, locale));
              setEditImage(industry.image);
            }}
            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-slate-700 hover:bg-slate-100"
          >
            <XIcon className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={savingEdit || !editName.trim() || !editImage}
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
        industry.isActive
          ? "border-[var(--color-border)]"
          : "border-slate-200 opacity-60"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative h-12 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-50">
            <Image src={getImageUrl(industry.image)} alt="" fill className="object-cover" sizes="64px" />
          </div>
          <p className="text-[13.5px] font-semibold text-slate-900 line-clamp-1">
            {tf(industry.name, locale)}
          </p>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleToggleActive}
            disabled={savingToggle}
            className="p-1.5 text-slate-400 hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] rounded-md transition-colors disabled:opacity-50"
            title={industry.isActive ? t.hide : t.show}
          >
            {savingToggle ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : industry.isActive ? (
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
