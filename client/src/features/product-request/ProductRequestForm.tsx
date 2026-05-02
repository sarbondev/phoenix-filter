"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, PackageSearch, Loader2 } from "lucide-react";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { useSubmitProductRequestMutation } from "@/store/api/productRequestApi";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { addToast } from "@/store/toastSlice";

interface ProductRequestFormProps {
  locale: Locale;
  dict: Dictionary;
  searchQuery?: string;
  variant?: "card" | "inline";
}

export function ProductRequestForm({
  locale,
  dict,
  searchQuery = "",
  variant = "card",
}: ProductRequestFormProps) {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);
  const [submit, { isLoading }] = useSubmitProductRequestMutation();
  const [submitted, setSubmitted] = useState(false);

  const [productName, setProductName] = useState(searchQuery);
  const [name, setName] = useState(auth.user?.name ?? "");
  const [phone, setPhone] = useState(auth.user?.phoneNumber ?? "");
  const [note, setNote] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !phone.trim()) {
      dispatch(
        addToast({
          message: dict.checkout.fillRequired,
          type: "error",
        }),
      );
      return;
    }

    try {
      await submit({
        productName: productName.trim(),
        name: name.trim() || undefined,
        phoneNumber: phone.trim(),
        note: note.trim() || undefined,
        searchQuery: searchQuery || undefined,
        locale,
      }).unwrap();
      setSubmitted(true);
      dispatch(
        addToast({
          message: dict.productRequest.successToast,
          type: "success",
        }),
      );
    } catch {
      dispatch(
        addToast({
          message: dict.common.error,
          type: "error",
        }),
      );
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className={
          variant === "card"
            ? "rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 text-center"
            : "py-6 text-center"
        }
      >
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
        <h3 className="mt-3 text-base font-semibold text-slate-900">
          {dict.productRequest.successTitle}
        </h3>
        <p className="mt-1 text-sm text-slate-600 max-w-sm mx-auto">
          {dict.productRequest.successDesc}
        </p>
      </motion.div>
    );
  }

  return (
    <div
      className={
        variant === "card"
          ? "rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
          : ""
      }
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand)] flex-shrink-0">
          <PackageSearch className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-slate-900">
            {dict.productRequest.title}
          </h3>
          <p className="text-[13px] text-slate-500 mt-0.5">
            {dict.productRequest.description}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3">
        <div>
          <label className="block text-[12px] font-medium text-slate-600 mb-1">
            {dict.productRequest.productLabel}
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder={dict.productRequest.productPlaceholder}
            required
            maxLength={300}
            className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-[13.5px] text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[var(--color-brand)]/70 focus:ring-2 focus:ring-[var(--color-brand)]/10 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1">
              {dict.productRequest.nameLabel}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={dict.productRequest.namePlaceholder}
              maxLength={200}
              className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-[13.5px] text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[var(--color-brand)]/70 focus:ring-2 focus:ring-[var(--color-brand)]/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1">
              {dict.productRequest.phoneLabel}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={dict.productRequest.phonePlaceholder}
              required
              maxLength={30}
              className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-[13.5px] text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[var(--color-brand)]/70 focus:ring-2 focus:ring-[var(--color-brand)]/10 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-medium text-slate-600 mb-1">
            {dict.productRequest.noteLabel}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={dict.productRequest.notePlaceholder}
            rows={3}
            maxLength={2000}
            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[13.5px] text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[var(--color-brand)]/70 focus:ring-2 focus:ring-[var(--color-brand)]/10 transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-hover)] disabled:bg-[var(--color-brand)]/70 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {dict.productRequest.submit}
        </button>
      </form>
    </div>
  );
}
