"use client";

import { useEffect, useState } from "react";
import { useLocaleParam } from "@/shared/hooks";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import enDict from "@/shared/i18n/dictionaries/en";

const cache = new Map<string, Dictionary["inlineEditor"]>();
cache.set("en", enDict.inlineEditor);

/**
 * Sync hook that returns the inlineEditor namespace for the current locale.
 * Falls back to English while the dynamic import resolves.
 */
export function useEditorDict(): Dictionary["inlineEditor"] {
  const locale = useLocaleParam();
  const [dict, setDict] = useState<Dictionary["inlineEditor"]>(
    cache.get(locale) ?? enDict.inlineEditor,
  );

  useEffect(() => {
    if (cache.has(locale)) {
      setDict(cache.get(locale)!);
      return;
    }
    let cancelled = false;
    import(`@/shared/i18n/dictionaries/${locale}`).then((m) => {
      if (cancelled) return;
      const editorDict = (m.default as Dictionary).inlineEditor;
      cache.set(locale, editorDict);
      setDict(editorDict);
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return dict;
}
