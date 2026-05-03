import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { useCreateProductMutation, useUpdateProductMutation } from '@/store/api/productApi';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { Button, Input, Textarea, Select, ImageUpload } from '@/components/ui';
import type { Product, CrossReference, ProductDimensions } from '@/lib/types';
import { useLocale, tf } from '@/hooks/useLocale';

const crossRefSchema = z.object({
  partNumber: z.string().min(1),
  manufacturer: z.string().min(1),
});

const dimensionsSchema = z.object({
  height: z.number().optional(),
  outerDiameter: z.number().optional(),
  innerDiameter: z.number().optional(),
  threadSize: z.string().optional(),
  inletDiameter: z.number().optional(),
  outletDiameter: z.number().optional(),
});

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  discountPercent: z.number().min(0).max(100).optional(),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().int().min(0).default(0),
  tags: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  oem: z.string().optional(),
  material: z.string().optional(),
  application: z.string().optional(),
  vehicleBrand: z.string().optional(),
  dimensions: dimensionsSchema.optional(),
  crossReferences: z.array(crossRefSchema).default([]),
});

interface Props {
  product: Product | null;
  onSuccess: () => void;
}

export default function ProductForm({ product, onSuccess }: Props) {
  const { t } = useTranslation();
  const locale = useLocale();

  const [form, setForm] = useState({
    name: tf(product?.name, locale),
    description: tf(product?.description, locale),
    price: product?.price ?? 0,
    discountPercent: product?.discountPercent ?? 0,
    category: typeof product?.category === 'string'
      ? product.category
      : product?.category?.id ?? product?.category?._id ?? '',
    stock: product?.stock ?? 0,
    tags: tf(product?.tags, locale),
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    images: product?.images ?? [] as string[],
    // Filter-specific fields
    oem: product?.oem ?? '',
    material: product?.material ?? '',
    application: product?.application ?? '',
    vehicleBrand: product?.vehicleBrand ?? '',
    dimensions: {
      height: product?.dimensions?.height,
      outerDiameter: product?.dimensions?.outerDiameter,
      innerDiameter: product?.dimensions?.innerDiameter,
      threadSize: product?.dimensions?.threadSize ?? '',
      inletDiameter: product?.dimensions?.inletDiameter,
      outletDiameter: product?.dimensions?.outletDiameter,
    } as ProductDimensions,
    crossReferences: (product?.crossReferences ?? []) as CrossReference[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: categories } = useGetCategoriesQuery();
  const [create, { isLoading: creating }] = useCreateProductMutation();
  const [update, { isLoading: updating }] = useUpdateProductMutation();

  const isLoading = creating || updating;

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));
  const setDim = (key: keyof ProductDimensions, value: number | string | undefined) =>
    setForm((f) => ({ ...f, dimensions: { ...f.dimensions, [key]: value } }));

  const addCrossRef = () =>
    setForm((f) => ({
      ...f,
      crossReferences: [...f.crossReferences, { partNumber: '', manufacturer: '' }],
    }));
  const updateCrossRef = (idx: number, key: keyof CrossReference, value: string) =>
    setForm((f) => ({
      ...f,
      crossReferences: f.crossReferences.map((r, i) =>
        i === idx ? { ...r, [key]: value } : r,
      ),
    }));
  const removeCrossRef = (idx: number) =>
    setForm((f) => ({
      ...f,
      crossReferences: f.crossReferences.filter((_, i) => i !== idx),
    }));

  const discountedPrice = form.discountPercent > 0
    ? Math.round(form.price * (1 - form.discountPercent / 100))
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Strip empty values from dimensions so server doesn't see {} when nothing was filled.
    const cleanDims: ProductDimensions = {};
    if (form.dimensions.height) cleanDims.height = Number(form.dimensions.height);
    if (form.dimensions.outerDiameter) cleanDims.outerDiameter = Number(form.dimensions.outerDiameter);
    if (form.dimensions.innerDiameter) cleanDims.innerDiameter = Number(form.dimensions.innerDiameter);
    if (form.dimensions.threadSize) cleanDims.threadSize = String(form.dimensions.threadSize);
    if (form.dimensions.inletDiameter) cleanDims.inletDiameter = Number(form.dimensions.inletDiameter);
    if (form.dimensions.outletDiameter) cleanDims.outletDiameter = Number(form.dimensions.outletDiameter);

    const cleanCrossRefs = form.crossReferences.filter(
      (r) => r.partNumber.trim() && r.manufacturer.trim(),
    );

    const payload = {
      ...form,
      images: form.images,
      discountPercent: form.discountPercent || undefined,
      tags: form.tags || undefined,
      oem: form.oem || undefined,
      material: form.material || undefined,
      application: form.application || undefined,
      vehicleBrand: form.vehicleBrand || undefined,
      dimensions: Object.keys(cleanDims).length > 0 ? cleanDims : undefined,
      crossReferences: cleanCrossRefs,
    };

    const result = productSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      if (product) {
        const updateData: Record<string, unknown> = { ...result.data, images: payload.images };
        // Only include translatable fields if they actually changed
        if (updateData.name === tf(product.name, locale)) delete updateData.name;
        if (updateData.description === tf(product.description, locale)) delete updateData.description;
        if ((updateData.tags ?? '') === tf(product.tags, locale)) delete updateData.tags;
        await update({ id: product.id, data: updateData }).unwrap();
      } else {
        await create({ ...result.data, images: payload.images }).unwrap();
      }
      onSuccess();
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setErrors({ name: apiErr.data?.message || t('common.failedToSave') });
    }
  };

  const formatPrice = (n: number) => new Intl.NumberFormat('uz-UZ').format(n);

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-2">
      {/* Basic info */}
      <Input label={t('common.name')} value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} placeholder={t('products.enterAnyLanguage')} />
      <Textarea label={t('common.description')} value={form.description} onChange={(e) => set('description', e.target.value)} error={errors.description} placeholder={t('products.enterAnyLanguage')} />

      <div className="grid grid-cols-2 gap-4">
        <Input label={t('common.price')} type="number" value={form.price} onChange={(e) => set('price', Number(e.target.value))} error={errors.price} />
        <div>
          <Input label={`${t('products.discountPrice')} (%)`} type="number" value={form.discountPercent} onChange={(e) => set('discountPercent', Math.min(100, Math.max(0, Number(e.target.value))))} placeholder="0" />
          {discountedPrice !== null && (
            <p className="mt-1 text-xs text-green-600">{formatPrice(discountedPrice)} UZS ({form.discountPercent}% off)</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Select label={t('common.category')} options={(categories ?? []).map((c) => ({ value: c.id, label: tf(c.name, locale) }))} value={form.category} onChange={(e) => set('category', e.target.value)} error={errors.category} placeholder="Select category" />
        <Input label={t('common.stock')} type="number" value={form.stock} onChange={(e) => set('stock', Number(e.target.value))} error={errors.stock} />
        <Input label={t('products.tags')} value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="filter, water, industrial" />
      </div>

      <ImageUpload value={form.images} onChange={(urls) => set('images', urls)} multiple label={t('products.images')} />

      {/* Filter-specific fields */}
      <fieldset className="rounded-xl border border-slate-200 p-4 space-y-4">
        <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t('products.filterDetails')}
        </legend>

        <div className="grid grid-cols-2 gap-4">
          <Input label={t('products.oem')} value={form.oem} onChange={(e) => set('oem', e.target.value)} placeholder="28113-37101" />
          <Input label={t('products.vehicleBrand')} value={form.vehicleBrand} onChange={(e) => set('vehicleBrand', e.target.value)} placeholder="HYUNDAI" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('products.material')} value={form.material} onChange={(e) => set('material', e.target.value)} placeholder="Aluminum Case" />
        </div>
        <Textarea label={t('products.application')} value={form.application} onChange={(e) => set('application', e.target.value)} placeholder="Sonata 99'~05' Trajet 2.0 2.7" rows={2} />

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{t('products.dimensions')}</p>
          <div className="grid grid-cols-3 gap-3">
            <Input label={t('products.height')} type="number" value={form.dimensions.height ?? ''} onChange={(e) => setDim('height', e.target.value ? Number(e.target.value) : undefined)} placeholder="mm" />
            <Input label={t('products.outerDiameter')} type="number" value={form.dimensions.outerDiameter ?? ''} onChange={(e) => setDim('outerDiameter', e.target.value ? Number(e.target.value) : undefined)} placeholder="mm" />
            <Input label={t('products.innerDiameter')} type="number" value={form.dimensions.innerDiameter ?? ''} onChange={(e) => setDim('innerDiameter', e.target.value ? Number(e.target.value) : undefined)} placeholder="mm" />
            <Input label={t('products.threadSize')} value={form.dimensions.threadSize ?? ''} onChange={(e) => setDim('threadSize', e.target.value)} placeholder='3/4"-16UNF' />
            <Input label={t('products.inletDiameter')} type="number" value={form.dimensions.inletDiameter ?? ''} onChange={(e) => setDim('inletDiameter', e.target.value ? Number(e.target.value) : undefined)} placeholder="mm" />
            <Input label={t('products.outletDiameter')} type="number" value={form.dimensions.outletDiameter ?? ''} onChange={(e) => setDim('outletDiameter', e.target.value ? Number(e.target.value) : undefined)} placeholder="mm" />
          </div>
        </div>
      </fieldset>

      {/* Cross-references */}
      <fieldset className="rounded-xl border border-slate-200 p-4 space-y-3">
        <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t('products.crossReferences')} ({form.crossReferences.length})
        </legend>
        <p className="text-xs text-slate-500 -mt-1">{t('products.crossReferencesHint')}</p>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {form.crossReferences.map((ref, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={ref.partNumber}
                onChange={(e) => updateCrossRef(i, 'partNumber', e.target.value)}
                placeholder={t('products.partNumber')}
                className="font-mono"
              />
              <Input
                value={ref.manufacturer}
                onChange={(e) => updateCrossRef(i, 'manufacturer', e.target.value)}
                placeholder={t('products.manufacturer')}
              />
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => removeCrossRef(i)}
                title={t('common.delete')}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>

        <Button variant="secondary" size="sm" type="button" onClick={addCrossRef} icon={<Plus className="h-3.5 w-3.5" />}>
          {t('products.addCrossReference')}
        </Button>
      </fieldset>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} className="rounded border-slate-300" />
          {t('common.active')}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="rounded border-slate-300" />
          {t('products.featured')}
        </label>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="submit" loading={isLoading}>
          {product ? t('products.updateProduct') : t('products.createProduct')}
        </Button>
      </div>
    </form>
  );
}
