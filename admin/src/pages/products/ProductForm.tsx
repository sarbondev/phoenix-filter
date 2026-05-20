import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { useCreateProductMutation, useUpdateProductMutation } from '@/store/api/productApi';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { useGetDirectionsQuery } from '@/store/api/directionApi';
import { Button, Input, Textarea, Select, ImageUpload } from '@/components/ui';
import type {
  Product,
  CrossReference,
  ProductApplication,
  ProductDimensions,
  StockStatus,
} from '@/lib/types';
import { useLocale, tf } from '@/hooks/useLocale';

const crossRefSchema = z.object({
  partNumber: z.string().min(1),
  manufacturer: z.string().min(1),
});

const applicationSchema = z.object({
  machineBrand: z.string().min(1),
  model: z.string().optional(),
  engine: z.string().optional(),
  year: z.string().optional(),
});

const dimensionsSchema = z.object({
  height: z.number().optional(),
  outerDiameter: z.number().optional(),
  innerDiameter: z.number().optional(),
  threadSize: z.string().optional(),
  inletDiameter: z.number().optional(),
  outletDiameter: z.number().optional(),
  gasketOuterDiameter: z.number().optional(),
  gasketInnerDiameter: z.number().optional(),
  weight: z.number().optional(),
});

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  priceOnRequest: z.boolean().default(false),
  discountPercent: z.number().min(0).max(100).optional(),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().int().min(0).default(0),
  stockStatus: z.enum(['in_stock', 'under_order']).default('in_stock'),
  datasheetUrl: z.string().optional(),
  tags: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  oem: z.string().optional(),
  oemNumbers: z.array(z.string().min(1)).default([]),
  material: z.string().optional(),
  application: z.string().optional(),
  applications: z.array(applicationSchema).default([]),
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

  const initialCategoryId = typeof product?.category === 'string'
    ? product.category
    : product?.category?.id ?? product?.category?._id ?? '';

  const [form, setForm] = useState({
    name: tf(product?.name, locale),
    description: tf(product?.description, locale),
    price: product?.price ?? 0,
    priceOnRequest: product?.priceOnRequest ?? false,
    discountPercent: product?.discountPercent ?? 0,
    category: initialCategoryId,
    stock: product?.stock ?? 0,
    stockStatus: (product?.stockStatus ?? 'in_stock') as StockStatus,
    datasheetUrl: product?.datasheetUrl ?? '',
    tags: tf(product?.tags, locale),
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    images: product?.images ?? [] as string[],
    // Filter-specific fields
    oem: product?.oem ?? '',
    oemNumbers: (product?.oemNumbers ?? []) as string[],
    material: product?.material ?? '',
    application: product?.application ?? '',
    applications: (product?.applications ?? []) as ProductApplication[],
    vehicleBrand: product?.vehicleBrand ?? '',
    dimensions: {
      height: product?.dimensions?.height,
      outerDiameter: product?.dimensions?.outerDiameter,
      innerDiameter: product?.dimensions?.innerDiameter,
      threadSize: product?.dimensions?.threadSize ?? '',
      inletDiameter: product?.dimensions?.inletDiameter,
      outletDiameter: product?.dimensions?.outletDiameter,
      gasketOuterDiameter: product?.dimensions?.gasketOuterDiameter,
      gasketInnerDiameter: product?.dimensions?.gasketInnerDiameter,
      weight: product?.dimensions?.weight,
    } as ProductDimensions,
    crossReferences: (product?.crossReferences ?? []) as CrossReference[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [oemDraft, setOemDraft] = useState('');

  const { data: categories } = useGetCategoriesQuery();
  const { data: directions } = useGetDirectionsQuery();
  const [create, { isLoading: creating }] = useCreateProductMutation();
  const [update, { isLoading: updating }] = useUpdateProductMutation();

  const [directionFilter, setDirectionFilter] = useState('');

  // When editing, derive direction from the product's category once categories load.
  useEffect(() => {
    if (!initialCategoryId || !categories) return;
    const cat = categories.find((c) => c.id === initialCategoryId);
    if (cat && !directionFilter) setDirectionFilter(cat.direction);
  }, [initialCategoryId, categories, directionFilter]);

  const filteredCategories = useMemo(() => {
    const list = categories ?? [];
    if (!directionFilter) return list;
    return list.filter((c) => c.direction === directionFilter);
  }, [categories, directionFilter]);

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

  const addOemNumber = () => {
    const trimmed = oemDraft.trim();
    if (!trimmed) return;
    setForm((f) => ({
      ...f,
      oemNumbers: Array.from(new Set([...f.oemNumbers, trimmed])),
    }));
    setOemDraft('');
  };
  const removeOemNumber = (val: string) =>
    setForm((f) => ({
      ...f,
      oemNumbers: f.oemNumbers.filter((v) => v !== val),
    }));

  const addApplication = () =>
    setForm((f) => ({
      ...f,
      applications: [...f.applications, { machineBrand: '', model: '', engine: '', year: '' }],
    }));
  const updateApplication = (
    idx: number,
    key: keyof ProductApplication,
    value: string,
  ) =>
    setForm((f) => ({
      ...f,
      applications: f.applications.map((r, i) =>
        i === idx ? { ...r, [key]: value } : r,
      ),
    }));
  const removeApplication = (idx: number) =>
    setForm((f) => ({
      ...f,
      applications: f.applications.filter((_, i) => i !== idx),
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
    if (form.dimensions.gasketOuterDiameter)
      cleanDims.gasketOuterDiameter = Number(form.dimensions.gasketOuterDiameter);
    if (form.dimensions.gasketInnerDiameter)
      cleanDims.gasketInnerDiameter = Number(form.dimensions.gasketInnerDiameter);
    if (form.dimensions.weight) cleanDims.weight = Number(form.dimensions.weight);

    const cleanCrossRefs = form.crossReferences.filter(
      (r) => r.partNumber.trim() && r.manufacturer.trim(),
    );

    const cleanApplications = form.applications
      .filter((a) => a.machineBrand.trim())
      .map((a) => ({
        machineBrand: a.machineBrand.trim().toUpperCase(),
        model: a.model?.trim() || undefined,
        engine: a.engine?.trim() || undefined,
        year: a.year?.trim() || undefined,
      }));

    const payload = {
      ...form,
      images: form.images,
      discountPercent: form.discountPercent || undefined,
      tags: form.tags || undefined,
      oem: form.oem || undefined,
      oemNumbers: form.oemNumbers,
      material: form.material || undefined,
      application: form.application || undefined,
      applications: cleanApplications,
      vehicleBrand: form.vehicleBrand || undefined,
      datasheetUrl: form.datasheetUrl || undefined,
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

      <div className="grid grid-cols-4 gap-4">
        <Select
          label={t('directions.title')}
          options={(directions ?? []).map((d) => ({ value: d.id, label: tf(d.name, locale) }))}
          value={directionFilter}
          onChange={(e) => {
            setDirectionFilter(e.target.value);
            // Reset category when direction changes (the current category may
            // not belong to the newly-selected direction).
            const stillValid = categories?.find(
              (c) => c.id === form.category && c.direction === e.target.value,
            );
            if (!stillValid) set('category', '');
          }}
          placeholder={t('categories.selectDirection')}
        />
        <Select
          label={t('common.category')}
          options={filteredCategories.map((c) => ({ value: c.id, label: tf(c.name, locale) }))}
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          error={errors.category}
          placeholder={directionFilter ? t('categories.selectCategory') : t('categories.selectDirectionFirst')}
          disabled={!directionFilter}
        />
        <Input label={t('common.stock')} type="number" value={form.stock} onChange={(e) => set('stock', Number(e.target.value))} error={errors.stock} />
        <Input label={t('products.tags')} value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="filter, water, industrial" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Select
          label={t('products.stockStatus')}
          options={[
            { value: 'in_stock', label: t('products.inStock') },
            { value: 'under_order', label: t('products.underOrder') },
          ]}
          value={form.stockStatus}
          onChange={(e) => set('stockStatus', e.target.value as StockStatus)}
        />
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input
            type="checkbox"
            checked={form.priceOnRequest}
            onChange={(e) => set('priceOnRequest', e.target.checked)}
            className="rounded border-slate-300"
          />
          {t('products.priceOnRequest')}
        </label>
        <Input
          label={t('products.datasheetUrl')}
          value={form.datasheetUrl}
          onChange={(e) => set('datasheetUrl', e.target.value)}
          placeholder="https://…/datasheet.pdf"
        />
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

        {/* OEM numbers — chips */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t('products.additionalOemNumbers')} ({form.oemNumbers.length})
          </p>
          <div className="flex gap-2">
            <Input
              value={oemDraft}
              onChange={(e) => setOemDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addOemNumber();
                }
              }}
              placeholder="CAT 1R-1808, Fleetguard FF5320…"
            />
            <Button type="button" variant="secondary" size="sm" onClick={addOemNumber}>
              <Plus className="h-3.5 w-3.5" />
              {t('equipmentTypes.addBrand')}
            </Button>
          </div>
          {form.oemNumbers.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {form.oemNumbers.map((n) => (
                <span
                  key={n}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[12px] font-mono"
                >
                  {n}
                  <button
                    type="button"
                    onClick={() => removeOemNumber(n)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
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
            <Input label={t('products.gasketOuterDiameter')} type="number" value={form.dimensions.gasketOuterDiameter ?? ''} onChange={(e) => setDim('gasketOuterDiameter', e.target.value ? Number(e.target.value) : undefined)} placeholder="mm" />
            <Input label={t('products.gasketInnerDiameter')} type="number" value={form.dimensions.gasketInnerDiameter ?? ''} onChange={(e) => setDim('gasketInnerDiameter', e.target.value ? Number(e.target.value) : undefined)} placeholder="mm" />
            <Input label={t('products.weight')} type="number" value={form.dimensions.weight ?? ''} onChange={(e) => setDim('weight', e.target.value ? Number(e.target.value) : undefined)} placeholder="g" />
          </div>
        </div>
      </fieldset>

      {/* Applications — structured machine compatibility list */}
      <fieldset className="rounded-xl border border-slate-200 p-4 space-y-3">
        <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t('products.applications')} ({form.applications.length})
        </legend>
        <p className="text-xs text-slate-500 -mt-1">
          {t('products.applicationsHint')}
        </p>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {form.applications.map((app, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center">
              <Input
                value={app.machineBrand}
                onChange={(e) => updateApplication(i, 'machineBrand', e.target.value)}
                placeholder={t('products.machineBrandPlaceholder')}
                className="font-mono"
              />
              <Input
                value={app.model ?? ''}
                onChange={(e) => updateApplication(i, 'model', e.target.value)}
                placeholder={t('products.modelPlaceholder')}
              />
              <Input
                value={app.engine ?? ''}
                onChange={(e) => updateApplication(i, 'engine', e.target.value)}
                placeholder={t('products.enginePlaceholder')}
              />
              <Input
                value={app.year ?? ''}
                onChange={(e) => updateApplication(i, 'year', e.target.value)}
                placeholder={t('products.yearPlaceholder')}
              />
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => removeApplication(i)}
                title={t('common.delete')}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={addApplication}
          icon={<Plus className="h-3.5 w-3.5" />}
        >
          {t('products.addApplication')}
        </Button>
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
