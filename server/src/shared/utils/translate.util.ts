import { geminiService } from "../services/gemini.service";
import { TranslatedField } from "../types/common.types";

const LANGS: (keyof TranslatedField)[] = ["ru", "uz", "en", "kz"];

/**
 * Returns a TranslatedField with all four languages populated.
 * Uses Gemini to translate from the first non-empty source language.
 * Manually-filled languages are preserved as-is.
 *
 * - Empty input → returns as-is.
 * - All four already filled → returns as-is.
 * - Otherwise → translates from first filled language; merges (keeps user values).
 */
export async function fillEmptyTranslations(
  tf: TranslatedField | undefined,
): Promise<TranslatedField | undefined> {
  if (!tf) return undefined;

  const trimmed: TranslatedField = {
    ru: tf.ru?.trim() ?? "",
    uz: tf.uz?.trim() ?? "",
    en: tf.en?.trim() ?? "",
    kz: tf.kz?.trim() ?? "",
  };

  const filledLangs = LANGS.filter((l) => trimmed[l]);
  // Nothing to translate from, or fully filled: return as-is.
  if (filledLangs.length === 0 || filledLangs.length === 4) {
    return trimmed;
  }

  // Use the first non-empty language as source.
  const sourceLang = filledLangs[0];
  const sourceText = trimmed[sourceLang];

  try {
    const translated = await geminiService.translateOne(sourceText);
    return {
      ru: trimmed.ru || translated.ru,
      uz: trimmed.uz || translated.uz,
      en: trimmed.en || translated.en,
      kz: trimmed.kz || translated.kz,
    };
  } catch {
    // Translation failed: copy source to the empty languages so site renders.
    return {
      ru: trimmed.ru || sourceText,
      uz: trimmed.uz || sourceText,
      en: trimmed.en || sourceText,
      kz: trimmed.kz || sourceText,
    };
  }
}

/**
 * Same logic, but for an array of TranslatedFields (e.g. hero feature list).
 * Translations are run in parallel for performance.
 */
export async function fillEmptyTranslationsArray(
  arr: TranslatedField[] | undefined,
): Promise<TranslatedField[] | undefined> {
  if (!arr) return undefined;
  return Promise.all(
    arr.map(async (t) => (await fillEmptyTranslations(t)) ?? t),
  );
}
