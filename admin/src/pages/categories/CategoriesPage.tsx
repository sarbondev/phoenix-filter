import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, FolderTree } from 'lucide-react';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '@/store/api/categoryApi';
import { useGetDirectionsQuery } from '@/store/api/directionApi';
import {
  Button, Input, Card, Table, Badge, Select,
  Modal, ConfirmDialog, ImageUpload,
} from '@/components/ui';
import type { Category } from '@/lib/types';
import { useLocale, tf } from '@/hooks/useLocale';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  image: z.string().optional(),
  direction: z.string().min(1, 'Direction is required'),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

interface CategoryRow extends Category {
  directionName?: string;
}

export default function CategoriesPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const { data: directions } = useGetDirectionsQuery();
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: deleting }] = useDeleteCategoryMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [directionFilter, setDirectionFilter] = useState('');
  const [form, setForm] = useState({
    name: '', image: '', direction: '', isActive: true, sortOrder: 0,
  });

  const directionMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const d of directions ?? []) map.set(d.id, tf(d.name, locale));
    return map;
  }, [directions, locale]);

  const rows: CategoryRow[] = useMemo(() => {
    const list = (categories ?? [])
      .filter((c) => !directionFilter || c.direction === directionFilter)
      .map((c) => ({ ...c, directionName: directionMap.get(c.direction) ?? '—' }));
    return list;
  }, [categories, directionMap, directionFilter]);

  const resetForm = () => {
    setForm({ name: '', image: '', direction: '', isActive: true, sortOrder: 0 });
    setErrors({});
    setEditing(null);
  };

  const openCreate = (directionId?: string) => {
    resetForm();
    if (directionId) setForm((f) => ({ ...f, direction: directionId }));
    else if (directions && directions.length === 1) setForm((f) => ({ ...f, direction: directions[0].id }));
    setModalOpen(true);
  };
  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({
      name: tf(cat.name, locale),
      image: cat.image ?? '',
      direction: cat.direction ?? '',
      isActive: cat.isActive,
      sortOrder: cat.sortOrder,
    });
    setErrors({});
    setModalOpen(true);
  };

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = { ...form, image: form.image || undefined };
    const result = categorySchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
      setErrors(fieldErrors);
      return;
    }

    try {
      if (editing) {
        await updateCategory({ id: editing.id, data: result.data }).unwrap();
      } else {
        await createCategory(result.data).unwrap();
      }
      setModalOpen(false);
      resetForm();
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setErrors({ name: apiErr.data?.message || t('common.failedToSave') });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteCategory(deleteId);
    setDeleteId(null);
  };

  const directionOptions = (directions ?? []).map((d) => ({
    value: d.id,
    label: tf(d.name, locale),
  }));

  const noDirections = !directions || directions.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('categories.title')}</h1>
        <Button
          icon={<Plus className="h-4 w-4" />}
          onClick={() => openCreate()}
          disabled={noDirections}
          title={noDirections ? t('categories.noDirectionsHint') : undefined}
        >
          {t('categories.addCategory')}
        </Button>
      </div>

      {noDirections && (
        <Card>
          <p className="text-sm text-amber-700">
            {t('categories.noDirectionsHint')}
          </p>
        </Card>
      )}

      {directions && directions.length > 1 && (
        <div className="max-w-xs">
          <Select
            label={t('categories.filterByDirection')}
            options={[{ value: '', label: t('categories.allDirections') }, ...directionOptions]}
            value={directionFilter}
            onChange={(e) => setDirectionFilter(e.target.value)}
          />
        </div>
      )}

      <Card padding={false}>
        <Table<CategoryRow>
          loading={isLoading}
          columns={[
            {
              key: 'name', header: t('common.name'),
              render: (c) => (
                <div className="flex items-center gap-2">
                  <FolderTree className="h-4 w-4 text-[var(--color-brand,_#3b82f6)] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">{tf(c.name, locale)}</p>
                    <p className="text-xs text-slate-500">{c.name.uz} / {c.name.ru} / {c.name.kz}</p>
                  </div>
                </div>
              ),
            },
            { key: 'direction', header: t('categories.direction'), render: (c) => c.directionName ?? '—' },
            { key: 'slug', header: t('common.slug') },
            { key: 'sortOrder', header: t('common.order'), render: (c) => String(c.sortOrder) },
            {
              key: 'isActive', header: t('common.status'),
              render: (c) => <Badge variant={c.isActive ? 'success' : 'default'}>{c.isActive ? t('common.active') : t('common.inactive')}</Badge>,
            },
            {
              key: 'actions', header: '', className: 'w-24',
              render: (c) => (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(c.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={rows}
          keyExtractor={(c) => c.id}
          emptyMessage={t('categories.noCategories')}
        />
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('categories.editCategory') : t('categories.addCategory')}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label={t('common.name')} value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} placeholder={t('products.enterAnyLanguage')} />

          <Select
            label={t('categories.direction')}
            options={directionOptions}
            value={form.direction}
            onChange={(e) => set('direction', e.target.value)}
            error={errors.direction}
            placeholder={t('categories.selectDirection')}
          />

          <ImageUpload value={form.image ? [form.image] : []} onChange={(urls) => set('image', urls[0] || '')} label={t('categories.imageUrl')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('categories.sortOrder')} type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', Number(e.target.value))} />
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} className="rounded border-slate-300" />
                {t('common.active')}
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit" loading={creating || updating}>{editing ? t('common.update') : t('common.create')}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('categories.deleteCategory')}
        message={t('categories.deleteConfirm')}
        loading={deleting}
      />
    </div>
  );
}
