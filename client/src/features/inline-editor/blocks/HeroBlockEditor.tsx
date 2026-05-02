"use client";

import { useEffect, useState } from "react";
import {
  useGetHeroContentQuery,
  useUpdateHeroContentMutation,
  type HeroContent,
  type HeroMainCard,
  type HeroSmallCard,
  type HeroSmallCardVariant,
} from "@/store/api/heroContentApi";
import { useAppDispatch } from "@/shared/hooks";
import { addToast } from "@/store/toastSlice";
import type { TranslatedField } from "@/shared/types";
import {
  EditorShell,
  FieldGroup,
  PlainInput,
  PlainSelect,
  SmartTextField,
  SmartTextListField,
  ImageField,
  useEditorDict,
} from "../";

const EMPTY_TF: TranslatedField = { uz: "", ru: "", en: "", kz: "" };

const DEFAULT_HERO: HeroContent = {
  mainCard: {
    title: { ...EMPTY_TF },
    subtitle: { ...EMPTY_TF },
    features: [],
    ctaLabel: { ...EMPTY_TF },
    ctaHref: "/products",
    image: "",
  },
  smallCard1: {
    title: { ...EMPTY_TF },
    subtitle: { ...EMPTY_TF },
    description: { ...EMPTY_TF },
    ctaLabel: { ...EMPTY_TF },
    ctaHref: "/products",
    image: "",
    variant: "blue",
  },
  smallCard2: {
    title: { ...EMPTY_TF },
    subtitle: { ...EMPTY_TF },
    description: { ...EMPTY_TF },
    ctaLabel: { ...EMPTY_TF },
    ctaHref: "/products",
    image: "",
    variant: "ink",
  },
};

interface Props {
  close: () => void;
}

export function HeroBlockEditor({ close }: Props) {
  const dispatch = useAppDispatch();
  const t = useEditorDict();
  const { data, isLoading } = useGetHeroContentQuery();
  const [update, { isLoading: saving }] = useUpdateHeroContentMutation();

  const [form, setForm] = useState<HeroContent>(DEFAULT_HERO);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const setMain = <K extends keyof HeroMainCard>(
    key: K,
    value: HeroMainCard[K],
  ) =>
    setForm((f) => ({
      ...f,
      mainCard: { ...f.mainCard, [key]: value },
    }));

  const setSmall = (
    which: "smallCard1" | "smallCard2",
    patch: Partial<HeroSmallCard>,
  ) =>
    setForm((f) => ({
      ...f,
      [which]: { ...f[which], ...patch },
    }));

  const handleSave = async () => {
    setError(null);
    try {
      await update(form).unwrap();
      dispatch(addToast({ message: t.saved, type: "success" }));
      close();
    } catch (e) {
      const msg =
        e && typeof e === "object" && "data" in e
          ? ((e.data as { message?: string }).message ?? t.saveError)
          : t.saveError;
      setError(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">{t.loading}</div>
    );
  }

  return (
    <EditorShell
      onSave={handleSave}
      onCancel={close}
      saving={saving}
      errorMessage={error ?? undefined}
    >
      <FieldGroup title={t.mainCardTitle}>
        <SmartTextField
          label={t.title}
          value={form.mainCard.title}
          onChange={(v) => setMain("title", v)}
        />
        <SmartTextField
          label={t.subtitle}
          value={form.mainCard.subtitle}
          onChange={(v) => setMain("subtitle", v)}
        />
        <SmartTextListField
          label={t.features}
          values={form.mainCard.features}
          onChange={(v) => setMain("features", v)}
          itemLabel={t.feature}
        />
        <div className="grid grid-cols-1 gap-3">
          <SmartTextField
            label={t.ctaLabel}
            value={form.mainCard.ctaLabel}
            onChange={(v) => setMain("ctaLabel", v)}
          />
          <PlainInput
            label={t.ctaLink}
            value={form.mainCard.ctaHref}
            onChange={(v) => setMain("ctaHref", v)}
            placeholder="/products"
            hint={t.ctaLinkHint}
          />
        </div>
        <ImageField
          label={t.imageOptional}
          value={form.mainCard.image}
          onChange={(url) => setMain("image", url)}
          hint={t.mainImageHint}
        />
      </FieldGroup>

      <SmallCardEditor
        title={t.smallCard1Title}
        card={form.smallCard1}
        onChange={(p) => setSmall("smallCard1", p)}
      />

      <SmallCardEditor
        title={t.smallCard2Title}
        card={form.smallCard2}
        onChange={(p) => setSmall("smallCard2", p)}
      />
    </EditorShell>
  );
}

function SmallCardEditor({
  title,
  card,
  onChange,
}: {
  title: string;
  card: HeroSmallCard;
  onChange: (patch: Partial<HeroSmallCard>) => void;
}) {
  const t = useEditorDict();
  return (
    <FieldGroup title={title}>
      <SmartTextField
        label={t.title}
        value={card.title}
        onChange={(v) => onChange({ title: v })}
      />
      <SmartTextField
        label={t.brandSubtitle}
        value={card.subtitle}
        onChange={(v) => onChange({ subtitle: v })}
      />
      <SmartTextField
        label={t.description}
        value={card.description}
        onChange={(v) => onChange({ description: v })}
        multiline
        rows={2}
      />
      <div className="grid grid-cols-1 gap-3">
        <SmartTextField
          label={t.ctaLabel}
          value={card.ctaLabel}
          onChange={(v) => onChange({ ctaLabel: v })}
        />
        <PlainInput
          label={t.ctaLink}
          value={card.ctaHref}
          onChange={(v) => onChange({ ctaHref: v })}
          placeholder="/products"
        />
      </div>
      <PlainSelect<HeroSmallCardVariant>
        label={t.backgroundVariant}
        value={card.variant}
        onChange={(v) => onChange({ variant: v })}
        options={[
          { value: "blue", label: t.blueBrand },
          { value: "ink", label: t.darkInk },
        ]}
      />
      <ImageField
        label={t.imageOptional}
        value={card.image}
        onChange={(url) => onChange({ image: url })}
      />
    </FieldGroup>
  );
}
