import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Phone, MapPin, Search } from 'lucide-react';
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '@/store/api/orderApi';
import {
  Button, Select, Card, Table, Badge,
  Pagination, Modal, Input, ConfirmDialog,
} from '@/components/ui';
import type { Order } from '@/lib/types';
import { useLocale } from '@/hooks/useLocale';
import { useQueryParams } from '@/hooks/useQueryParams';

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  PENDING: 'warning', CONFIRMED: 'info', PROCESSING: 'info',
  SHIPPED: 'info', DELIVERED: 'success', CANCELLED: 'danger',
};

export default function OrdersPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { params, setParams } = useQueryParams();
  const page = Number(params.page) || 1;
  const statusFilter = params.status || '';
  const searchQ = params.search ?? '';
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [pendingStatus, setPendingStatus] = useState<{ orderId: string; status: string } | null>(null);

  const { data: res, isLoading } = useGetOrdersQuery({
    page, limit: 10, status: statusFilter || undefined,
    search: searchQ || undefined,
  });
  const [updateStatus, { isLoading: updatingStatus }] = useUpdateOrderStatusMutation();

  const orders = res?.data ?? [];
  const meta = res?.meta;

  const statusOptions: Array<{ value: string; label: string }> = [
    { value: 'PENDING', label: t('orders.statuses.PENDING') },
    { value: 'CONFIRMED', label: t('orders.statuses.CONFIRMED') },
    { value: 'PROCESSING', label: t('orders.statuses.PROCESSING') },
    { value: 'SHIPPED', label: t('orders.statuses.SHIPPED') },
    { value: 'DELIVERED', label: t('orders.statuses.DELIVERED') },
    { value: 'CANCELLED', label: t('orders.statuses.CANCELLED') },
  ];

  const formatPrice = (n: number) => new Intl.NumberFormat('uz-UZ').format(n) + ' UZS';

  const getCustomerName = (o: Order) => {
    const u = o.user;
    if (typeof u === 'object' && u !== null) return u.name ?? u.phoneNumber ?? '-';
    return '-';
  };

  const getCustomerPhone = (o: Order) => {
    const u = o.user;
    if (typeof u === 'object' && u !== null) return u.phoneNumber ?? '-';
    return '-';
  };

  const requestStatusChange = (orderId: string, status: string) => {
    if (!status || status === viewOrder?.status) return;
    setPendingStatus({ orderId, status });
  };

  const confirmStatusChange = async () => {
    if (!pendingStatus) return;
    try {
      const updated = await updateStatus({
        id: pendingStatus.orderId,
        status: pendingStatus.status,
      }).unwrap();
      setViewOrder((prev) => (prev ? { ...prev, ...updated } : prev));
      setPendingStatus(null);
    } catch {
      setPendingStatus(null);
    }
  };

  const buildMapsUrl = (a: Order['shippingAddress']) =>
    `https://yandex.com/maps/?text=${encodeURIComponent(`${a.region}, ${a.district}, ${a.address}`)}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('orders.title')}</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="sm:w-72">
            <Input
              icon={<Search className="h-4 w-4" />}
              placeholder={t('orders.searchPlaceholder')}
              value={searchQ}
              onChange={(e) => setParams({ search: e.target.value || undefined, page: undefined })}
            />
          </div>
          <div className="sm:w-48">
            <Select
              placeholder={t('orders.allStatuses')}
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => { setParams({ status: e.target.value || undefined, page: undefined }); }}
            />
          </div>
        </div>
      </div>

      <Card padding={false}>
        <Table<Order>
          loading={isLoading}
          columns={[
            { key: 'orderNumber', header: t('orders.orderNumber'), render: (o) => (
              <span className="font-mono text-sm font-medium">{o.orderNumber}</span>
            )},
            { key: 'customer', header: t('orders.customer'), render: (o) => {
              const phone = getCustomerPhone(o);
              return (
                <div>
                  <p className="font-medium">{getCustomerName(o)}</p>
                  {phone && phone !== '-' ? (
                    <a
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Phone className="h-3 w-3" />
                      {phone}
                    </a>
                  ) : (
                    <p className="text-xs text-slate-500">-</p>
                  )}
                </div>
              );
            }},
            { key: 'totalAmount', header: t('orders.totalAmount'), render: (o) => (
              <span className="font-medium">{formatPrice(o.totalAmount)}</span>
            )},
            { key: 'status', header: t('common.status'), render: (o) => (
              <Badge variant={statusVariant[o.status] ?? 'default'}>{t(`orders.statuses.${o.status}`)}</Badge>
            )},
            { key: 'date', header: t('common.date'), render: (o) => new Date(o.createdAt).toLocaleDateString() },
            { key: 'actions', header: '', className: 'w-16', render: (o) => (
              <Button variant="ghost" size="sm" onClick={() => setViewOrder(o)}>
                <Eye className="h-4 w-4" />
              </Button>
            )},
          ]}
          data={orders}
          keyExtractor={(o) => o.id}
          emptyMessage={t('orders.noOrders')}
        />
        {meta && <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={(p) => setParams({ page: p > 1 ? String(p) : undefined })} />}
      </Card>

      {/* Order Detail Modal */}
      <Modal open={!!viewOrder} onClose={() => setViewOrder(null)} title={`${t('orders.orderDetails')} ${viewOrder?.orderNumber ?? ''}`} size="lg">
        {viewOrder && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">{t('orders.customer')}</p>
                <p className="font-medium">{getCustomerName(viewOrder)}</p>
                {(() => {
                  const phone = getCustomerPhone(viewOrder);
                  return phone && phone !== '-' ? (
                    <a
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="mt-1 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {phone}
                    </a>
                  ) : (
                    <p className="text-sm text-slate-600">-</p>
                  );
                })()}
              </div>
              <div>
                <p className="text-xs text-slate-500">{t('orders.shippingAddress')}</p>
                <p className="text-sm">{viewOrder.shippingAddress.fullName}</p>
                <p className="text-sm text-slate-600">
                  {viewOrder.shippingAddress.region}, {viewOrder.shippingAddress.district}
                </p>
                <p className="text-sm text-slate-600">{viewOrder.shippingAddress.address}</p>
                <a
                  href={buildMapsUrl(viewOrder.shippingAddress)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {t('orders.openInMaps')}
                </a>
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">{t('orders.items')}</p>
              <div className="space-y-2">
                {viewOrder.items.map((item, i) => {
                  const prod = item.product;
                  const isObj = typeof prod === 'object' && prod !== null;
                  const name = isObj && prod.name ? prod.name[locale] : '-';
                  const image = isObj && prod.images && prod.images[0] ? prod.images[0] : null;
                  return (
                    <div key={i} className="flex items-center gap-3 text-sm bg-slate-50 rounded-lg p-3">
                      <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-white border border-slate-200">
                        {image ? (
                          <img src={image} alt={name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-300">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{name}</p>
                        <p className="text-xs text-slate-500">x{item.quantity} · {formatPrice(item.price)}</p>
                      </div>
                      <span className="font-semibold text-slate-900 flex-shrink-0">{formatPrice(item.total)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 space-y-1 text-sm text-right">
                <p>{t('orders.subtotal')}: {formatPrice(viewOrder.subtotal)}</p>
                <p>{t('orders.shipping')}: {formatPrice(viewOrder.shippingCost)}</p>
                <p className="font-bold text-base">{t('common.total')}: {formatPrice(viewOrder.totalAmount)}</p>
              </div>
            </div>

            {/* Status Action */}
            <div className="border-t pt-4">
              <Select
                label={t('orders.orderStatus')}
                options={statusOptions}
                value={viewOrder.status}
                onChange={(e) => requestStatusChange(viewOrder.id, e.target.value)}
                disabled={updatingStatus || viewOrder.status === 'CANCELLED' || viewOrder.status === 'DELIVERED'}
              />
            </div>

            {viewOrder.note && (
              <div>
                <p className="text-xs text-slate-500">{t('orders.note')}</p>
                <p className="text-sm">{viewOrder.note}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!pendingStatus}
        onClose={() => setPendingStatus(null)}
        onConfirm={confirmStatusChange}
        loading={updatingStatus}
        variant="primary"
        title={t('orders.confirmStatusTitle')}
        message={
          pendingStatus
            ? t('orders.confirmStatusMessage', { status: t(`orders.statuses.${pendingStatus.status}`) })
            : ''
        }
        confirmText={t('common.confirm')}
      />
    </div>
  );
}
