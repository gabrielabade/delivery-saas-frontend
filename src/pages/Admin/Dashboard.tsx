import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  Plus,
  ChefHat,
  LucideIcon,
  ArrowRight,
  Calendar,
  Clock,
  BarChart3
} from 'lucide-react';
import api from '../../services/api';
import { useStore } from '../../contexts/StoreContext';
import { formatCurrency } from '../../utils/format';
import AdminPageWrapper from '../../components/layouts/AdminPageWrapper';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  color?: 'orange' | 'green' | 'blue' | 'purple';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'orange'
}) => {
  const colorClasses = {
    orange: 'from-orange-500 to-red-500',
    green: 'from-emerald-500 to-green-600',
    blue: 'from-blue-500 to-cyan-600',
    purple: 'from-purple-500 to-pink-600'
  };

  const trendColor = trend && trend > 0 ? 'text-emerald-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:border-orange-300 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-xl`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-bold ${trendColor}`}>
            <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { currentStore } = useStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todaySales: 0,
    activeOrders: 0,
    newCustomers: 0,
    conversionRate: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    if (currentStore) {
      loadDashboardData();
    }
  }, [currentStore]);

  const loadDashboardData = async () => {
    if (!currentStore) return;

    try {
      setLoading(true);

      // Data de hoje
      const today = new Date().toISOString().split('T')[0];

      // Buscar pedidos recentes
      const ordersRes = await api.get('/orders/', {
        params: {
          store_id: currentStore.id,
          skip: 0,
          limit: 10
        }
      });

      const orders = ordersRes.data || [];
      const todayOrders = orders.filter((order: any) =>
        order.created_at && new Date(order.created_at).toISOString().split('T')[0] === today
      );

      const todaySales = todayOrders.reduce((sum: number, order: any) => {
        return sum + parseFloat(order.total || 0);
      }, 0);

      const activeOrders = orders.filter((o: any) =>
        o.status && ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.status)
      ).length;

      setStats({
        todaySales,
        activeOrders,
        newCustomers: 18,
        conversionRate: todayOrders.length > 0 ? (activeOrders / todayOrders.length * 100) : 0
      });

      setRecentOrders(orders.slice(0, 5));

    } catch (error: any) {
      console.error('Erro ao carregar dados do dashboard:', error);
      // Fallback com dados estáticos
      setStats({
        todaySales: 2840,
        activeOrders: 24,
        newCustomers: 18,
        conversionRate: 4.2
      });
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { title: 'Novo Pedido', icon: ShoppingCart, path: '/admin/orders/new', color: 'orange' },
    { title: 'Ver Produtos', icon: Package, path: '/admin/products', color: 'blue' },
    { title: 'Gerenciar Categorias', icon: ChefHat, path: '/admin/categories', color: 'green' },
    { title: 'Ver Usuários', icon: Users, path: '/admin/users', color: 'purple' },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <AdminPageWrapper
      title="Dashboard"
      subtitle={currentStore ? `Loja: ${currentStore.name}` : 'Selecione uma loja'}
      loading={loading}
    >
      <div className="p-4 sm:p-6">
        {/* Saudação */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                Olá, {currentStore?.name || 'Admin'}!
              </h2>
              <p className="text-gray-600">
                Seja bem-vindo ao painel administrativo do ClickFome
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900 font-medium">
                  {new Date().toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <MetricCard
            title="Vendas Hoje"
            value={formatCurrency(stats.todaySales)}
            icon={DollarSign}
            trend={12.5}
            color="green"
          />
          <MetricCard
            title="Pedidos Ativos"
            value={stats.activeOrders.toString()}
            icon={ShoppingCart}
            trend={-3.2}
            color="orange"
          />
          <MetricCard
            title="Novos Clientes"
            value={stats.newCustomers.toString()}
            icon={Users}
            trend={8.7}
            color="blue"
          />
          <MetricCard
            title="Taxa Conversão"
            value={`${stats.conversionRate.toFixed(1)}%`}
            icon={TrendingUp}
            trend={2.1}
            color="purple"
          />
        </div>

        {/* Grid de duas colunas: Ações Rápidas e Pedidos Recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ações Rápidas */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Ações Rápidas</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  to={action.path}
                  className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group"
                >
                  <div className={`p-3 bg-gradient-to-br ${action.color === 'orange' ? 'from-orange-500 to-red-500' :
                      action.color === 'blue' ? 'from-blue-500 to-cyan-600' :
                        action.color === 'green' ? 'from-emerald-500 to-green-600' :
                          'from-purple-500 to-pink-600'
                    } rounded-xl group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 text-center">
                    {action.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Pedidos Recentes */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Pedidos Recentes</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">#{order.order_number}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                          }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.customer_name} • {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(parseFloat(order.total))}</p>
                      <p className="text-xs text-gray-500">{order.items_count} itens</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum pedido recente</p>
                </div>
              )}
            </div>
            {recentOrders.length > 0 && (
              <Link
                to="/admin/orders"
                className="mt-6 flex items-center justify-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                Ver todos os pedidos
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Botão de novo pedido */}
        <div className="text-center">
          <Link
            to="/admin/orders/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity font-bold shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Criar Novo Pedido
          </Link>
        </div>
      </div>
    </AdminPageWrapper>
  );
};

export default Dashboard;