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
  useGetAllBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "@/store/api/blogApi";
import type { Blog } from "@/shared/types";
import { useAppDispatch, useLocaleParam } from "@/shared/hooks";
import { addToast } from "@/store/toastSlice";
import { getImageUrl, t as tf } from "@/shared/lib/utils";
import { ImageField } from "../fields/ImageField";
import { useEditorDict } from "../useEditorDict";

interface Props {
  close: () => void;
}

export function BlogsBlockEditor({ close }: Props) {
  const dispatch = useAppDispatch();
  const t = useEditorDict();
  const locale = useLocaleParam();
  const { data: blogs, isLoading } = useGetAllBlogsQuery();
  const [createBlog, { isLoading: creating }] = useCreateBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newPublished, setNewPublished] = useState(true);

  const handleAdd = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    try {
      await createBlog({
        title: newTitle.trim(),
        content: newContent.trim(),
        image: newImage || undefined,
        isPublished: newPublished,
      }).unwrap();
      setNewTitle("");
      setNewContent("");
      setNewImage("");
      setNewPublished(true);
      setShowAddForm(false);
      dispatch(addToast({ message: t.blogAdded, type: "success" }));
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
        ) : (blogs ?? []).length === 0 && !showAddForm ? (
          <div className="text-center py-8">
            <p className="text-[13px] text-slate-500 mb-3">{t.noBlogsYet}</p>
          </div>
        ) : (
          (blogs ?? []).map((blog) => (
            <BlogRow
              key={blog.id}
              blog={blog}
              locale={locale}
              onUpdate={async (data) => {
                await updateBlog({ id: blog.id, data }).unwrap();
              }}
              onDelete={async () => {
                if (!confirm(t.deleteConfirm)) return;
                await deleteBlog(blog.id).unwrap();
                dispatch(addToast({ message: t.blogDeleted, type: "info" }));
              }}
            />
          ))
        )}

        {showAddForm ? (
          <div className="rounded-xl border-2 border-dashed border-[var(--color-brand)] bg-[var(--color-brand-soft)]/30 p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--color-brand)]">
                {t.newBlog}
              </span>
              <span className="text-[10.5px] text-slate-500">{t.aiHintShort}</span>
            </div>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={t.blogTitleLabel}
              className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-[13.5px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--color-brand)]"
              autoFocus
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={t.blogContent}
              rows={6}
              className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-[13.5px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--color-brand)] resize-none"
            />
            <ImageField label={t.blogCover} value={newImage} onChange={setNewImage} />
            <label className="flex items-center gap-2 text-[12.5px] text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={newPublished}
                onChange={(e) => setNewPublished(e.target.checked)}
                className="h-3.5 w-3.5 accent-[var(--color-brand)]"
              />
              {newPublished ? t.publishedToggle : t.draft}
            </label>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewTitle("");
                  setNewContent("");
                  setNewImage("");
                  setNewPublished(true);
                }}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-slate-700 hover:bg-slate-100"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleAdd}
                disabled={!newTitle.trim() || !newContent.trim() || creating}
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
            {t.addNewBlog}
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

function BlogRow({
  blog,
  locale,
  onUpdate,
  onDelete,
}: {
  blog: Blog;
  locale: import("@/shared/types").Locale;
  onUpdate: (data: {
    title?: string;
    content?: string;
    image?: string;
    isPublished?: boolean;
  }) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const t = useEditorDict();
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);
  const [savingDelete, setSavingDelete] = useState(false);
  const [editTitle, setEditTitle] = useState(tf(blog.title, locale));
  const [editContent, setEditContent] = useState(tf(blog.content, locale));
  const [editImage, setEditImage] = useState(blog.image ?? "");

  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    setSavingEdit(true);
    try {
      const data: { title?: string; content?: string; image?: string } = {};
      if (editTitle.trim() !== tf(blog.title, locale)) data.title = editTitle.trim();
      if (editContent.trim() !== tf(blog.content, locale)) data.content = editContent.trim();
      if (editImage !== (blog.image ?? "")) data.image = editImage;
      if (Object.keys(data).length > 0) await onUpdate(data);
      setEditing(false);
      dispatch(addToast({ message: t.saved, type: "success" }));
    } finally {
      setSavingEdit(false);
    }
  };

  const handleTogglePublished = async () => {
    setSavingToggle(true);
    try {
      await onUpdate({ isPublished: !blog.isPublished });
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
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder={t.blogTitleLabel}
          className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-[13.5px] focus:outline-none focus:border-[var(--color-brand)]"
        />
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder={t.blogContent}
          rows={6}
          className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-[13.5px] focus:outline-none focus:border-[var(--color-brand)] resize-none"
        />
        <ImageField label={t.blogCover} value={editImage} onChange={setEditImage} />
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setEditTitle(tf(blog.title, locale));
              setEditContent(tf(blog.content, locale));
              setEditImage(blog.image ?? "");
            }}
            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-slate-700 hover:bg-slate-100"
          >
            <XIcon className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={savingEdit || !editTitle.trim() || !editContent.trim()}
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
        blog.isPublished
          ? "border-[var(--color-border)]"
          : "border-slate-200 opacity-60"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative h-12 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-50">
            {blog.image ? (
              <Image src={getImageUrl(blog.image)} alt="" fill className="object-cover" sizes="64px" />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold text-slate-900 line-clamp-1">
              {tf(blog.title, locale)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {blog.isPublished ? t.publishedToggle : t.draft}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleTogglePublished}
            disabled={savingToggle}
            className="p-1.5 text-slate-400 hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] rounded-md transition-colors disabled:opacity-50"
            title={blog.isPublished ? t.hide : t.show}
          >
            {savingToggle ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : blog.isPublished ? (
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
