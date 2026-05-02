"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEditMode } from "./EditModeContext";

export function InlineEditPanel() {
  const { currentBlock, closeEditor } = useEditMode();

  return (
    <AnimatePresence>
      {currentBlock && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-black/55 backdrop-blur-sm"
            onClick={closeEditor}
          />

          {/* Slide-in panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className={`fixed inset-y-0 right-0 z-[91] bg-white shadow-2xl flex flex-col w-full ${
              currentBlock.wide
                ? "sm:max-w-2xl lg:max-w-3xl"
                : "sm:max-w-md lg:max-w-lg"
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[var(--color-border)] bg-white">
              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900 truncate">
                  {currentBlock.title}
                </h2>
                {currentBlock.description && (
                  <p className="text-[12px] text-slate-500 mt-0.5">
                    {currentBlock.description}
                  </p>
                )}
              </div>
              <button
                onClick={closeEditor}
                aria-label="Close"
                className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {currentBlock.render(closeEditor)}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
