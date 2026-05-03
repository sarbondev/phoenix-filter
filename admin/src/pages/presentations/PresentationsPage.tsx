import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, ExternalLink, Link2 } from 'lucide-react';
import { z } from 'zod';
import {
  useGetPresentationsQuery,
  useCreatePresentationMutation,
  useUpdatePresentationMutation,
  useDeletePresentationMutation,
} from '@/store/api/presentationApi';
import {
  Button, Card, Table, Badge, Modal, ConfirmDialog, Input,
} from '@/components/ui';
import type { Presentation } from '@/lib/types';

const presentationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  url: z.string().url('Invalid URL'),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export default function PresentationsPage() {
  const { t } = useTranslation();
  const { data: presentations, isLoading } = useGetPresentationsQuery();
  const [createPresentation, { isLoading: creating }] = useCreatePresentationMutation();
  const [updatePresentation, { isLoading: updating }] = useUpdatePresentationMutation();
  const [deletePresentation, { isLoading: deleting }] = useDeletePresentationMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Presentation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    title: '', url: '', isActive: true, sortOrder: 0,
  });

  const resetForm = () => {
    setForm({ title: '', url: '', isActive: true, sortOrder: 0 });
    setErrors({});
    setEditing(null);
  };

  const openCreate = () => { resetForm(); setModalOpen(true); };
  const openEdit = (p: Presentation) => {
    setEditing(p);
    setForm({
      title: p.title,
      url: p.url,
      isActive: p.isActive,
      sortOrder: p.sortOrder,
    });
    setErrors({});
    setModalOpen(true);
  };

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = presentationSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    try {
      if (editing) {
        await updatePresentation({ id: editing.id, data: result.data }).unwrap();
      } else {
        await createPresentation(result.data).unwrap();
      }
      setModalOpen(false);
      resetForm();
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setErrors({ url: apiErr.data?.message || t('common.error') });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('sidebar.presentations')}</h1>
        <Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>{t('common.add')}</Button>
      </div>

      <Card padding={false}>
        <Table<Presentation>
          loading={isLoading}
          columns={[
            {
              key: 'title',
              header: t('common.name'),
              render: (p) => (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 min-w-0 group"
                >
                  <Link2 className="h-4 w-4 text-slate-400 shrink-0 group-hover:text-blue-600" />
                  <span className="font-medium text-slate-900 truncate group-hover:text-blue-600 group-hover:underline">
                    {p.title}
                  </span>
                </a>
              ),
            },
            { key: 'sortOrder', header: t('common.order'), render: (p) => String(p.sortOrder) },
            {
              key: 'isActive',
              header: t('common.status'),
              render: (p) => (
                <Badge variant={p.isActive ? 'success' : 'default'}>
                  {p.isActive ? t('common.active') : t('common.inactive')}
                </Badge>
              ),
            },
            {
              key: 'actions',
              header: '',
              className: 'w-32',
              render: (p) => (
                <div className="flex gap-1 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    title={t('common.view')}
                    onClick={() => window.open(p.url, '_blank', 'noopener,noreferrer')}
                  >
                    <ExternalLink className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(p.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={presentations ?? []}
          keyExtractor={(p) => p.id}
          emptyMessage={t('common.noData')}
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t('common.edit') : t('common.add')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('common.name')}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            error={errors.title}
            placeholder="Phoenix Catalogue 2024"
          />
          <Input
            label="Google Sheets URL"
            type="url"
            value={form.url}
            onChange={(e) => set('url', e.target.value)}
            error={errors.url}
            placeholder="https://docs.google.com/spreadsheets/d/..."
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t('common.order')}
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
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
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
        onConfirm={async () => {
          if (deleteId) {
            await deletePresentation(deleteId);
            setDeleteId(null);
          }
        }}
        title={t('common.delete')}
        message={t('common.confirm')}
        loading={deleting}
      />
    </div>
  );
}
