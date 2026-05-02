"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAppSelector } from "@/shared/hooks";

export interface EditorBlock {
  id: string;
  title: string;
  description?: string;
  /** Slot rendered inside the slide-over panel. Receives a `close` fn. */
  render: (close: () => void) => ReactNode;
  /** Wide panel for complex blocks (default: false → 480px). */
  wide?: boolean;
}

interface EditModeContextValue {
  /** True if the current user has admin privileges (auth.user.role === "ADMIN"). */
  canEdit: boolean;
  /** Global toggle: when on, every <Editable> shows hover overlay + pencil. */
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  /** Currently open block in the side panel (null = panel closed). */
  currentBlock: EditorBlock | null;
  openEditor: (block: EditorBlock) => void;
  closeEditor: () => void;
}

const EditModeContext = createContext<EditModeContextValue | null>(null);

const STORAGE_KEY = "pf_edit_mode";

export function EditModeProvider({ children }: { children: ReactNode }) {
  const auth = useAppSelector((s) => s.auth);
  const canEdit = auth.user?.role === "ADMIN";

  const [editMode, setEditModeState] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<EditorBlock | null>(null);

  // Restore persisted edit-mode preference (admin only).
  useEffect(() => {
    if (!canEdit) {
      setEditModeState(false);
      return;
    }
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "1") setEditModeState(true);
    } catch {
      /* ignore */
    }
  }, [canEdit]);

  const setEditMode = useCallback(
    (v: boolean) => {
      if (!canEdit) {
        setEditModeState(false);
        return;
      }
      setEditModeState(v);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
        } catch {
          /* ignore */
        }
      }
      if (!v) setCurrentBlock(null);
    },
    [canEdit],
  );

  const openEditor = useCallback(
    (block: EditorBlock) => {
      if (!canEdit || !editMode) return;
      setCurrentBlock(block);
    },
    [canEdit, editMode],
  );

  const closeEditor = useCallback(() => {
    setCurrentBlock(null);
  }, []);

  // Lock body scroll while panel open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (currentBlock) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [currentBlock]);

  const value = useMemo<EditModeContextValue>(
    () => ({
      canEdit,
      editMode: canEdit && editMode,
      setEditMode,
      currentBlock,
      openEditor,
      closeEditor,
    }),
    [canEdit, editMode, currentBlock, setEditMode, openEditor, closeEditor],
  );

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const ctx = useContext(EditModeContext);
  if (!ctx) {
    // Safe fallback for components rendered outside the provider (e.g. SSR).
    return {
      canEdit: false,
      editMode: false,
      setEditMode: () => {},
      currentBlock: null,
      openEditor: () => {},
      closeEditor: () => {},
    } satisfies EditModeContextValue;
  }
  return ctx;
}
