import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Truck, X } from 'lucide-react';
import { z } from 'zod';
import {
  useGetEquipmentTypesQuery,
  useCreateEquipmentTypeMutation,
  useUpdateEquipmentTypeMutation,
  useDeleteEquipmentTypeMutation,
} from '@/store/api/equipmentTypeApi';
import {
  Button,
  Input,
  Card,
  Table,
  Badge,
  Modal,
  ConfirmDialog,
  ImageUpload,
} from '@/components/ui';
import type { EquipmentType } from '@/lib/types';
import { useLocale, tf } from '@/hooks/useLocale';

const equipmentTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
  image: z.string().optional(),
  icon: z.string().optional(),
  machineBrands: z.array(z.string().min(1)).default([]),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

const EMPTY = {
  name: '',
  slug: '',
  image: '',
  icon: '',
  machineBrands: [] as string[],
  isActive: true,
  sortOrder: 0,
};

export default function EquipmentTypesPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { data: items, isLoading } = useGetEquipmentTypesQuery();
  const [createOne, { isLoading: creating }] = useCreateEquipmentTypeMutation();
  const [updateOne, { isLoading: updating }] = useUpdateEquipmentTypeMutation();
  const [deleteOne, { isLoading: deleting }] = useDeleteEquipmentTypeMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EquipmentType | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState(EMPTY);
  const [brandDraft, setBrandDraft] = useState('');

  const resetForm = () => {
    setForm(EMPTY);
    setBrandDraft('');
    setErrors({});
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (et: EquipmentType) => {
    setEditing(et);
    setForm({
      name: tf(et.name, locale),
      slug: et.slug,
      image: et.image ?? '',
      icon: et.icon ?? '',
      machineBrands: et.machineBrands ?? [],
      isActive: et.isActive,
      sortOrder: et.sortOrder,
    });
    setErrors({});
    setModalOpen(true);
  };

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const addBrand = () => {
    const t = brandDraft.trim().toUpperCase();
    if (!t) return;
    if (form.machineBrands.includes(t)) {
      setBrandDraft('');
      return;
    }
    set('machineBrands', [...form.machineBrands, t]);
    setBrandDraft('');
  };
  const removeBrand = (b: string) =>
    set('machineBrands', form.machineBrands.filter((x) => x !== b));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      ...form,
      slug: form.slug || undefined,
      image: form.image || undefined,
      icon: form.icon || undefined,
    };
    const result = equipmentTypeSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      if (editing) {
        await updateOne({ id: editing.id, data: result.data }).unwrap();
      } else {
        await createOne(result.data).unwrap();
      }
      setModalOpen(false);
      resetForm();
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setErrors({ name: apiErr.data?.message ?? t('common.failedToSave') });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteOne(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          {t('equipmentTypes.title')}
        </h1>
        <Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          {t('equipmentTypes.addEquipmentType')}
        </Button>
      </div>

      <Card padding={false}>
        <Table<EquipmentType>
          loading={isLoading}
          columns={[
            {
              key: 'name',
              header: t('common.name'),
              render: (et) => (
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">
                      {tf(et.name, locale)}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">{et.slug}</p>
                  </div>
                </div>
              ),
            },
            {
              key: 'brands',
              header: t('equipmentTypes.machineBrands'),
              render: (et) => (
                <div className="flex flex-wrap gap-1">
                  {(et.machineBrands ?? []).slice(0, 5).map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono"
                    >
                      {b}
                    </span>
                  ))}
                  {(et.machineBrands?.length ?? 0) > 5 && (
                    <span className="text-[11px] text-slate-400">
                      +{(et.machineBrands?.length ?? 0) - 5}
                    </span>
                  )}
                </div>
              ),
            },
            {
              key: 'sortOrder',
              header: t('common.order'),
              render: (et) => String(et.sortOrder),
            },
            {
              key: 'isActive',
              header: t('common.status'),
              render: (et) => (
                <Badge variant={et.isActive ? 'success' : 'default'}>
                  {et.isActive ? t('common.active') : t('common.inactive')}
                </Badge>
              ),
            },
            {
              key: 'actions',
              header: '',
              className: 'w-24',
              render: (et) => (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(et)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(et.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={items ?? []}
          keyExtractor={(et) => et.id}
          emptyMessage={t('equipmentTypes.noEquipmentTypes')}
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editing
            ? t('equipmentTypes.editEquipmentType')
            : t('equipmentTypes.addEquipmentType')
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('common.name')}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            error={errors.name}
            placeholder={t('equipmentTypes.namePlaceholder')}
          />
          <Input
            label={t('equipmentTypes.slug')}
            value={form.slug}
            onChange={(e) => set('slug', e.target.value)}
            placeholder={t('equipmentTypes.slugPlaceholder')}
          />

          <ImageUpload
            value={form.image ? [form.image] : []}
            onChange={(urls) => set('image', urls[0] ?? '')}
            label={t('equipmentTypes.image')}
          />

          {/* Machine brands — chips editor */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              {t('equipmentTypes.machineBrands')}{' '}
              <span className="text-xs font-normal text-slate-400">
                — {t('equipmentTypes.machineBrandsHint')}
              </span>
            </label>
            <div className="flex gap-2">
              <Input
                value={brandDraft}
                onChange={(e) => setBrandDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addBrand();
                  }
                }}
                placeholder={t('equipmentTypes.brandPlaceholder')}
              />
              <Button type="button" variant="secondary" size="sm" onClick={addBrand}>
                <Plus className="h-3.5 w-3.5" />
                {t('equipmentTypes.addBrand')}
              </Button>
            </div>
            {form.machineBrands.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {form.machineBrands.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[12px] font-mono"
                  >
                    {b}
                    <button
                      type="button"
                      onClick={() => removeBrand(b)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t('equipmentTypes.sortOrder')}
              type="number"
              value={form.sortOrder}
              onChange={(e) => set('sortOrder', Number(e.target.value))}
            />
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => set('isActive', e.target.checked)}
                  className="rounded border-slate-300"
                />
                {t('common.active')}
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={creating || updating}>
              {editing ? t('common.update') : t('common.create')}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('equipmentTypes.deleteEquipmentType')}
        message={t('equipmentTypes.deleteConfirm')}
        loading={deleting}
      />
    </div>
  );
}
