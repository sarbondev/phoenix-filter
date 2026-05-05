import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  FolderTree,
  Star,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useGetDashboardStatsQuery } from '@/store/api/dashboardApi';
import { useGetOrdersQuery } from '@/store/api/orderApi';
import { StatCard, Card, CardHeader, CardTitle, Spinner, Badge, Table } from '@/components/ui';
import { useAppSelector } from '@/hooks/store';
import type { Order } from '@/lib/types';

const orderStatusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  PROCESSING: 'info',
  SHIPPED: 'info',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const user = useAppSelector((s) => s.auth.user);
  const isAdmin = user?.role === 'ADMIN';
  const { data: stats, isLoading, isError, refetch } = useGetDashboardStatsQuery();
  const { data: ordersRes } = useGetOrdersQuery({ page: 1, limit: 5, status: 'PENDING' });

  if (isLoading) return <Spinner size="lg" />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <AlertCircle className="h-12 w-12 mb-4 text-red-400" />
        <p className="text-lg font-medium">{t('common.error')}</p>
        <button onClick={refetch} className="mt-4 text-sm text-blue-600 hover:underline">
          {t('common.retry')}
        </button>
      </div>
    );
  }

  const recentOrders = ordersRes?.data ?? [];

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('uz-UZ').format(n) + ' UZS';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('dashboard.title')}</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isAdmin && (
          <StatCard
            title={t('dashboard.totalRevenue')}
            value={formatPrice(stats?.revenue ?? 0)}
            icon={<DollarSign className="h-6 w-6" />}
            color="green"
          />
        )}
        <StatCard
          title={t('dashboard.totalOrders')}
          value={stats?.orders?.total ?? 0}
          icon={<ShoppingCart className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title={t('dashboard.pendingOrders')}
          value={stats?.orders?.pending ?? 0}
          icon={<Clock className="h-6 w-6" />}
          color="amber"
        />
        <StatCard
          title={t('dashboard.reviews')}
          value={stats?.reviews?.total ?? 0}
          icon={<Star className="h-6 w-6" />}
          color="purple"
        />
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title={t('dashboard.products')}
            value={stats?.products?.active ?? 0}
            icon={<Package className="h-6 w-6" />}
            color="purple"
          />
          <StatCard
            title={t('dashboard.users')}
            value={stats?.users?.total ?? 0}
            icon={<Users className="h-6 w-6" />}
            color="amber"
          />
          <StatCard
            title={t('dashboard.categories')}
            value={stats?.categories?.total ?? 0}
            icon={<FolderTree className="h-6 w-6" />}
            color="blue"
          />
        </div>
      )}

      {/* Recent Pending Orders */}
      <Card padding={false}>
        <CardHeader className="px-6 pt-6 flex items-center justify-between">
          <CardTitle>{t('dashboard.recentPendingOrders')}</CardTitle>
          <Link
            to="/orders?status=PENDING"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {t('common.viewAll')}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <Table<Order>
          columns={[
            { key: 'orderNumber', header: t('orders.orderNumber') },
            {
              key: 'user',
              header: t('dashboard.customer'),
              render: (o) => {
                const u = o.user;
                return typeof u === 'object' && u !== null ? (u.name ?? '-') : '-';
              },
            },
            {
              key: 'totalAmount',
              header: t('common.total'),
              render: (o) => formatPrice(o.totalAmount),
            },
            {
              key: 'status',
              header: t('common.status'),
              render: (o) => (
                <Badge variant={orderStatusVariant[o.status] ?? 'default'}>{t(`orders.statuses.${o.status}`)}</Badge>
              ),
            },
            {
              key: 'createdAt',
              header: t('common.date'),
              render: (o) => new Date(o.createdAt).toLocaleDateString(),
            },
          ]}
          data={recentOrders}
          keyExtractor={(o) => o.id}
          emptyMessage={t('dashboard.noPendingOrders')}
        />
      </Card>
    </div>
  );
}
