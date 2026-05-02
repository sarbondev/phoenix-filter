"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pencil, X, Eye } from "lucide-react";
import { useEditMode } from "./EditModeContext";
import { useEditorDict } from "./useEditorDict";

export function EditModeToggle() {
  const { canEdit, editMode, setEditMode, currentBlock } = useEditMode();
  const t = useEditorDict();

  if (!canEdit) return null;

  // Hide while a block panel is open (would obscure the panel).
  if (currentBlock) return null;

  return (
    <AnimatePresence>
      <motion.button
        key={editMode ? "on" : "off"}
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={() => setEditMode(!editMode)}
        className={`fixed z-[80] bottom-20 right-4 lg:bottom-6 lg:right-6 flex items-center gap-2 rounded-full px-4 h-12 text-[13px] font-bold transition-colors shadow-lg ${
          editMode
            ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
            : "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)]"
        }`}
        style={{
          boxShadow: editMode
            ? "0 8px 24px -4px rgba(239, 37, 49, 0.45)"
            : "0 8px 24px -4px rgba(31, 77, 255, 0.45)",
        }}
        aria-label={editMode ? "Exit edit mode" : "Enter edit mode"}
      >
        {editMode ? (
          <>
            <X className="h-4 w-4" />
            <span>{t.finish}</span>
          </>
        ) : (
          <>
            <Pencil className="h-4 w-4" />
            <span>{t.edit}</span>
          </>
        )}
      </motion.button>

      {/* Edit-mode banner — small status pill above */}
      {editMode && (
        <motion.div
          key="edit-banner"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed z-[79] bottom-[152px] right-4 lg:bottom-[76px] lg:right-6 flex items-center gap-2 rounded-full bg-[var(--color-ink)] text-white px-3.5 py-1.5 text-[11.5px] font-semibold pointer-events-none"
        >
          <Eye className="h-3 w-3" />
          {t.editModeOn}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
