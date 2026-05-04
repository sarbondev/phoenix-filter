"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Loader2,
  Check,
  X as XIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  useGetAllPartnersQuery,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
  type Partner,
} from "@/store/api/partnerApi";
import { useAppDispatch } from "@/shared/hooks";
import { addToast } from "@/store/toastSlice";
import { getImageUrl } from "@/shared/lib/utils";
import { ImageField } from "../fields/ImageField";
import { useEditorDict } from "../useEditorDict";

interface Props {
  close: () => void;
}

export function PartnersBlockEditor({ close }: Props) {
  const dispatch = useAppDispatch();
  const t = useEditorDict();
  const { data: partners, isLoading } = useGetAllPartnersQuery();
  const [createPartner, { isLoading: creating }] = useCreatePartnerMutation();
  const [updatePartner] = useUpdatePartnerMutation();
  const [deletePartner] = useDeletePartnerMutation();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newImage, setNewImage] = useState("");

  const handleAdd = async () => {
    if (!newImage) return;
    try {
      await createPartner({
        image: newImage,
        isActive: true,
        sortOrder: (partners?.length ?? 0) * 10,
      }).unwrap();
      setNewImage("");
      setShowAddForm(false);
      dispatch(addToast({ message: t.partnerAdded, type: "success" }));
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
        ) : (partners ?? []).length === 0 && !showAddForm ? (
          <div className="text-center py-8">
            <p className="text-[13px] text-slate-500 mb-3">{t.noPartnersYet}</p>
          </div>
        ) : (
          (partners ?? []).map((partner) => (
            <PartnerRow
              key={partner.id}
              partner={partner}
              onUpdate={async (data) => {
                await updatePartner({ id: partner.id, data }).unwrap();
              }}
              onDelete={async () => {
                if (!confirm(t.deleteConfirm)) return;
                await deletePartner(partner.id).unwrap();
                dispatch(addToast({ message: t.partnerDeleted, type: "info" }));
              }}
            />
          ))
        )}

        {showAddForm ? (
          <div className="rounded-xl border-2 border-dashed border-[var(--color-brand)] bg-[var(--color-brand-soft)]/30 p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--color-brand)]">
                {t.newPartner}
              </span>
            </div>
            <ImageField label={t.partnerLogo} value={newImage} onChange={setNewImage} />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewImage("");
                }}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-slate-700 hover:bg-slate-100"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleAdd}
                disabled={!newImage || creating}
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
            {t.addNewPartner}
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

function PartnerRow({
  partner,
  onUpdate,
  onDelete,
}: {
  partner: Partner;
  onUpdate: (data: { image?: string; isActive?: boolean }) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const t = useEditorDict();
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);
  const [savingDelete, setSavingDelete] = useState(false);
  const [editImage, setEditImage] = useState(partner.image);

  const handleSave = async () => {
    if (!editImage) return;
    setSavingEdit(true);
    try {
      await onUpdate({ image: editImage });
      setEditing(false);
      dispatch(addToast({ message: t.saved, type: "success" }));
    } finally {
      setSavingEdit(false);
    }
  };

  const handleToggleActive = async () => {
    setSavingToggle(true);
    try {
      await onUpdate({ isActive: !partner.isActive });
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
        <ImageField label={t.partnerLogo} value={editImage} onChange={setEditImage} />
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setEditImage(partner.image);
            }}
            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-slate-700 hover:bg-slate-100"
          >
            <XIcon className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={savingEdit || !editImage}
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
        partner.isActive
          ? "border-[var(--color-border)]"
          : "border-slate-200 opacity-60"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="relative h-10 w-28 flex-shrink-0 rounded-lg bg-slate-50 overflow-hidden hover:ring-2 hover:ring-[var(--color-brand)]/40 transition-all"
        >
          <Image src={getImageUrl(partner.image)} alt="" fill className="object-contain" sizes="112px" />
        </button>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleToggleActive}
            disabled={savingToggle}
            className="p-1.5 text-slate-400 hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] rounded-md transition-colors disabled:opacity-50"
            title={partner.isActive ? t.hide : t.show}
          >
            {savingToggle ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : partner.isActive ? (
              <Eye className="h-3.5 w-3.5" />
            ) : (
              <EyeOff className="h-3.5 w-3.5" />
            )}
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
