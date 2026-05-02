"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  Pencil,
  Check,
  X as XIcon,
  Upload,
} from "lucide-react";
import {
  useGetAllCertificatesQuery,
  useCreateCertificateMutation,
  useUpdateCertificateMutation,
  useDeleteCertificateMutation,
  type Certificate,
} from "@/store/api/certificateApi";
import { useAppSelector, useAppDispatch, useLocaleParam } from "@/shared/hooks";
import { addToast } from "@/store/toastSlice";
import { t as tf, getImageUrl } from "@/shared/lib/utils";
import { useEditorDict } from "../useEditorDict";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface Props {
  close: () => void;
}

export function CertificatesBlockEditor({ close }: Props) {
  const dispatch = useAppDispatch();
  const locale = useLocaleParam();
  const t = useEditorDict();
  const token = useAppSelector((s) => s.auth.token);
  const { data: certs, isLoading } = useGetAllCertificatesQuery();
  const [createCert, { isLoading: creating }] = useCreateCertificateMutation();
  const [updateCert] = useUpdateCertificateMutation();
  const [deleteCert] = useDeleteCertificateMutation();

  const [showAdd, setShowAdd] = useState(false);
  const [newCaption, setNewCaption] = useState("");
  const [newImage, setNewImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const upload = async (file: File): Promise<string | null> => {
    if (!token) {
      setUploadError(t.authRequired);
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError(t.fileTooLarge);
      return null;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_URL}/upload/single`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error(`Upload ${res.status}`);
      const json = (await res.json()) as { data?: { url?: string } };
      return json.data?.url ?? null;
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : t.uploadFailed);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    if (!newImage) return;
    try {
      await createCert({
        caption: newCaption.trim(),
        image: newImage,
        sortOrder: (certs?.length ?? 0) * 10,
      }).unwrap();
      setNewCaption("");
      setNewImage("");
      setShowAdd(false);
      dispatch(addToast({ message: t.certificateAdded, type: "success" }));
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
        ) : (certs ?? []).length === 0 && !showAdd ? (
          <p className="text-center text-[13px] text-slate-500 py-8">
            {t.noCertsYet}
          </p>
        ) : (
          (certs ?? []).map((cert) => (
            <CertificateRow
              key={cert.id}
              cert={cert}
              locale={locale}
              token={token}
              onUpdate={async (data) => {
                await updateCert({ id: cert.id, data }).unwrap();
              }}
              onDelete={async () => {
                if (!confirm(t.deleteConfirm)) return;
                await deleteCert(cert.id).unwrap();
                dispatch(addToast({ message: t.deleted, type: "info" }));
              }}
            />
          ))
        )}

        {showAdd ? (
          <div className="rounded-xl border-2 border-dashed border-[var(--color-brand)] bg-[var(--color-brand-soft)]/30 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--color-brand)]">
                {t.newCertificate}
              </span>
            </div>

            {newImage ? (
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-white border border-[var(--color-border)]">
                <Image
                  src={getImageUrl(newImage)}
                  alt=""
                  fill
                  sizes="200px"
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={() => setNewImage("")}
                  className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const url = await upload(f);
                      if (url) setNewImage(url);
                    }
                    e.target.value = "";
                  }}
                />
                <div className="aspect-[3/4] cursor-pointer rounded-lg border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-brand)] hover:bg-white/50 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-[var(--color-brand)] transition-colors">
                  {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      <span className="text-[11px] font-semibold">
                        {t.uploadImage}
                      </span>
                    </>
                  )}
                </div>
              </label>
            )}
            {uploadError && (
              <p className="text-[12px] text-red-500">{uploadError}</p>
            )}

            <input
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder={t.captionDesc}
              className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-[13.5px] focus:outline-none focus:border-[var(--color-brand)]"
            />
            <p className="text-[10.5px] text-slate-500">{t.captionAiHint}</p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAdd(false);
                  setNewCaption("");
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
            onClick={() => setShowAdd(true)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-soft)]/40 py-3 text-[13px] font-semibold text-slate-500 hover:text-[var(--color-brand)] transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t.addNewCertificate}
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

function CertificateRow({
  cert,
  locale,
  onUpdate,
  onDelete,
}: {
  cert: Certificate;
  locale: import("@/shared/types").Locale;
  token: string | null;
  onUpdate: (
    data: Partial<{ caption: string; isActive: boolean; sortOrder: number }>,
  ) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);
  const [savingDelete, setSavingDelete] = useState(false);
  const [editCaption, setEditCaption] = useState(tf(cert.caption, locale));
  const dispatch = useAppDispatch();
  const t = useEditorDict();

  const handleSave = async () => {
    setSavingEdit(true);
    try {
      await onUpdate({ caption: editCaption.trim() });
      setEditing(false);
      dispatch(addToast({ message: t.saved, type: "success" }));
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div
      className={`rounded-xl border bg-white p-3 transition-colors ${
        cert.isActive
          ? "border-[var(--color-border)]"
          : "border-slate-200 opacity-60"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative h-20 w-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
          <Image
            src={getImageUrl(cert.image)}
            alt=""
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                className="flex-1 rounded-lg border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-[13px]"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={savingEdit}
                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md disabled:opacity-50"
              >
                {savingEdit ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setEditCaption(tf(cert.caption, locale));
                }}
                className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <p className="text-[13.5px] font-semibold text-slate-900 line-clamp-2">
              {tf(cert.caption, locale) || (
                <span className="italic text-slate-400">{t.captionFallback}</span>
              )}
            </p>
          )}
        </div>
        {!editing && (
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button
              type="button"
              onClick={async () => {
                setSavingToggle(true);
                try {
                  await onUpdate({ isActive: !cert.isActive });
                } finally {
                  setSavingToggle(false);
                }
              }}
              disabled={savingToggle}
              className="p-1.5 text-slate-400 hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] rounded-md transition-colors disabled:opacity-50"
              title={cert.isActive ? t.hide : t.show}
            >
              {savingToggle ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : cert.isActive ? (
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
              onClick={async () => {
                setSavingDelete(true);
                try {
                  await onDelete();
                } finally {
                  setSavingDelete(false);
                }
              }}
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
        )}
      </div>
    </div>
  );
}
