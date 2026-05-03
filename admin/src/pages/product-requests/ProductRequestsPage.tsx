import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Trash2, MessageSquareText, CheckCircle2, XCircle } from 'lucide-react';
import {
  useGetProductRequestsQuery,
  useUpdateProductRequestStatusMutation,
  useDeleteProductRequestMutation,
} from '@/store/api/productRequestApi';
import { Button, Card, Table, Badge, ConfirmDialog, Select } from '@/components/ui';
import type { ProductRequest, ProductRequestStatus } from '@/lib/types';

const STATUS_VARIANT: Record<
  ProductRequestStatus,
  'default' | 'success' | 'warning' | 'danger' | 'info'
> = {
  NEW: 'warning',
  CONTACTED: 'info',
  RESOLVED: 'success',
  REJECTED: 'danger',
};

const STATUSES: ProductRequestStatus[] = ['NEW', 'CONTACTED', 'RESOLVED', 'REJECTED'];

export default function ProductRequestsPage() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<ProductRequestStatus | ''>('');
  const { data: requests, isLoading } = useGetProductRequestsQuery(
    statusFilter ? { status: statusFilter } : undefined,
  );
  const [updateStatus, { isLoading: updating }] = useUpdateProductRequestStatusMutation();
  const [deleteRequest, { isLoading: deleting }] = useDeleteProductRequestMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailRequest, setDetailRequest] = useState<ProductRequest | null>(null);

  const handleStatusChange = async (id: string, status: ProductRequestStatus) => {
    await updateStatus({ id, status }).unwrap();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('productRequests.title')}</h1>

        <div className="w-56">
          <Select
            placeholder={t('productRequests.allStatuses')}
            options={STATUSES.map((s) => ({
              value: s,
              label: t(`productRequests.statuses.${s}`),
            }))}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProductRequestStatus | '')}
          />
        </div>
      </div>

      <Card padding={false}>
        <Table<ProductRequest>
          loading={isLoading}
          columns={[
            {
              key: 'productName',
              header: t('productRequests.productName'),
              render: (r) => (
                <div className="max-w-[280px]">
                  <p className="font-medium text-slate-900 truncate">{r.productName}</p>
                  {r.searchQuery && r.searchQuery !== r.productName && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {t('productRequests.searchedFor')}: &ldquo;{r.searchQuery}&rdquo;
                    </p>
                  )}
                </div>
              ),
            },
            {
              key: 'name',
              header: t('productRequests.customer'),
              render: (r) => r.name || '-',
            },
            {
              key: 'phoneNumber',
              header: t('productRequests.phone'),
              render: (r) => (
                <a
                  href={`tel:${r.phoneNumber}`}
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {r.phoneNumber}
                </a>
              ),
            },
            {
              key: 'note',
              header: t('productRequests.note'),
              render: (r) =>
                r.note ? (
                  <button
                    onClick={() => setDetailRequest(r)}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800"
                  >
                    <MessageSquareText className="h-4 w-4" />
                  </button>
                ) : (
                  <span className="text-slate-300">—</span>
                ),
            },
            {
              key: 'status',
              header: t('common.status'),
              render: (r) => (
                <Badge variant={STATUS_VARIANT[r.status]}>
                  {t(`productRequests.statuses.${r.status}`)}
                </Badge>
              ),
            },
            {
              key: 'createdAt',
              header: t('productRequests.received'),
              render: (r) => (
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleString()}
                </span>
              ),
            },
            {
              key: 'actions',
              header: '',
              className: 'w-[260px]',
              render: (r) => (
                <div className="flex items-center gap-1.5">
                  {r.status === 'NEW' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusChange(r.id, 'CONTACTED')}
                      disabled={updating}
                      title={t('productRequests.markContacted')}
                    >
                      <Phone className="h-4 w-4 text-blue-600" />
                    </Button>
                  )}
                  {r.status !== 'RESOLVED' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusChange(r.id, 'RESOLVED')}
                      disabled={updating}
                      title={t('productRequests.markResolved')}
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </Button>
                  )}
                  {r.status !== 'REJECTED' && r.status !== 'RESOLVED' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusChange(r.id, 'REJECTED')}
                      disabled={updating}
                      title={t('productRequests.markRejected')}
                    >
                      <XCircle className="h-4 w-4 text-orange-500" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(r.id)}
                    title={t('common.delete')}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={requests ?? []}
          keyExtractor={(r) => r.id}
          emptyMessage={t('productRequests.noRequests')}
        />
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await deleteRequest(deleteId);
            setDeleteId(null);
          }
        }}
        title={t('productRequests.deleteRequest')}
        message={t('productRequests.deleteConfirm')}
        loading={deleting}
      />

      {detailRequest && (
        <DetailModal
          request={detailRequest}
          onClose={() => setDetailRequest(null)}
          t={t}
        />
      )}
    </div>
  );
}

function DetailModal({
  request,
  onClose,
  t,
}: {
  request: ProductRequest;
  onClose: () => void;
  t: (key: string) => string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          {t('productRequests.detailsTitle')}
        </h3>
        <dl className="space-y-3 text-sm">
          <Row label={t('productRequests.productName')}>{request.productName}</Row>
          {request.searchQuery && (
            <Row label={t('productRequests.searchedFor')}>{request.searchQuery}</Row>
          )}
          {request.name && <Row label={t('productRequests.customer')}>{request.name}</Row>}
          <Row label={t('productRequests.phone')}>
            <a href={`tel:${request.phoneNumber}`} className="text-blue-600 hover:underline">
              {request.phoneNumber}
            </a>
          </Row>
          {request.note && <Row label={t('productRequests.note')}>{request.note}</Row>}
          {request.locale && <Row label={t('productRequests.language')}>{request.locale.toUpperCase()}</Row>}
          <Row label={t('productRequests.received')}>
            {new Date(request.createdAt).toLocaleString()}
          </Row>
        </dl>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>{t('common.close')}</Button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-900 break-words">{children}</dd>
    </div>
  );
}
