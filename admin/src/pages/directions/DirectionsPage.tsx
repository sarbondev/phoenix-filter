import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Compass } from 'lucide-react';
import {
  useGetDirectionsQuery,
  useCreateDirectionMutation,
  useUpdateDirectionMutation,
  useDeleteDirectionMutation,
} from '@/store/api/directionApi';
import {
  Button, Input, Card, Table, Badge,
  Modal, ConfirmDialog, ImageUpload,
} from '@/components/ui';
import type { Direction } from '@/lib/types';
import { useLocale, tf } from '@/hooks/useLocale';
import { z } from 'zod';

const directionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  icon: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export default function DirectionsPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { data: directions, isLoading } = useGetDirectionsQuery();
  const [createDirection, { isLoading: creating }] = useCreateDirectionMutation();
  const [updateDirection, { isLoading: updating }] = useUpdateDirectionMutation();
  const [deleteDirection, { isLoading: deleting }] = useDeleteDirectionMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Direction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '', icon: '', image: '', isActive: true, sortOrder: 0,
  });

  const resetForm = () => {
    setForm({ name: '', icon: '', image: '', isActive: true, sortOrder: 0 });
    setErrors({});
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setModalOpen(true);
  };
  const openEdit = (d: Direction) => {
    setEditing(d);
    setForm({
      name: tf(d.name, locale),
      icon: d.icon ?? '',
      image: d.image ?? '',
      isActive: d.isActive,
      sortOrder: d.sortOrder,
    });
    setErrors({});
    setModalOpen(true);
  };

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      ...form,
      icon: form.icon || undefined,
      image: form.image || undefined,
    };
    const result = directionSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
      setErrors(fieldErrors);
      return;
    }

    try {
      if (editing) {
        await updateDirection({ id: editing.id, data: result.data }).unwrap();
      } else {
        await createDirection(result.data).unwrap();
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
    try {
      await deleteDirection(deleteId).unwrap();
      setDeleteId(null);
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      alert(apiErr.data?.message || t('common.failedToSave'));
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('directions.title')}</h1>
        <Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>{t('directions.addDirection')}</Button>
      </div>

      <Card padding={false}>
        <Table<Direction>
          loading={isLoading}
          columns={[
            {
              key: 'name', header: t('common.name'),
              render: (d) => (
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-[var(--color-brand,_#3b82f6)] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">{tf(d.name, locale)}</p>
                    <p className="text-xs text-slate-500">{d.name.uz} / {d.name.ru} / {d.name.kz}</p>
                  </div>
                </div>
              ),
            },
            { key: 'slug', header: t('common.slug') },
            { key: 'sortOrder', header: t('common.order'), render: (d) => String(d.sortOrder) },
            {
              key: 'isActive', header: t('common.status'),
              render: (d) => <Badge variant={d.isActive ? 'success' : 'default'}>{d.isActive ? t('common.active') : t('common.inactive')}</Badge>,
            },
            {
              key: 'actions', header: '', className: 'w-24',
              render: (d) => (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(d)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(d.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={directions ?? []}
          keyExtractor={(d) => d.id}
          emptyMessage={t('directions.noDirections')}
        />
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('directions.editDirection') : t('directions.addDirection')}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label={t('common.name')} value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} placeholder={t('products.enterAnyLanguage')} />
          <Input label={t('directions.icon')} value={form.icon} onChange={(e) => set('icon', e.target.value)} placeholder="🚗 yoki URL" />
          <ImageUpload value={form.image ? [form.image] : []} onChange={(urls) => set('image', urls[0] || '')} label={t('directions.image')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('common.sortOrder')} type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', Number(e.target.value))} />
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
        title={t('directions.deleteDirection')}
        message={t('directions.deleteConfirm')}
        loading={deleting}
      />
    </div>
  );
}
