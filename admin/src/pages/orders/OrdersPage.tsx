import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '@/store/api/orderApi';
import {
  Button, Select, Card, Table, Badge,
  Pagination, Modal,
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
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const { data: res, isLoading } = useGetOrdersQuery({
    page, limit: 10, status: statusFilter || undefined,
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

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      const updated = await updateStatus({ id: orderId, status }).unwrap();
      setViewOrder((prev) => prev ? { ...prev, ...updated } : prev);
    } catch { /* error handled by RTK Query */ }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('orders.title')}</h1>
        <div className="w-48">
          <Select
            placeholder={t('orders.allStatuses')}
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => { setParams({ status: e.target.value || undefined, page: undefined }); }}
          />
        </div>
      </div>

      <Card padding={false}>
        <Table<Order>
          loading={isLoading}
          columns={[
            { key: 'orderNumber', header: t('orders.orderNumber'), render: (o) => (
              <span className="font-mono text-sm font-medium">{o.orderNumber}</span>
            )},
            { key: 'customer', header: t('orders.customer'), render: (o) => (
              <div>
                <p className="font-medium">{getCustomerName(o)}</p>
                <p className="text-xs text-slate-500">{getCustomerPhone(o)}</p>
              </div>
            )},
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
                <p className="text-sm text-slate-600">{getCustomerPhone(viewOrder)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t('orders.shippingAddress')}</p>
                <p className="text-sm">{viewOrder.shippingAddress.fullName}</p>
                <p className="text-sm text-slate-600">
                  {viewOrder.shippingAddress.region}, {viewOrder.shippingAddress.district}
                </p>
                <p className="text-sm text-slate-600">{viewOrder.shippingAddress.address}</p>
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
                onChange={(e) => handleStatusChange(viewOrder.id, e.target.value)}
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
    </div>
  );
}
