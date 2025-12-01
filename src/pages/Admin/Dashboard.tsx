import AdminLayout from '../../components/Layout/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Package, FolderTree, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Bem-vindo ao painel administrativo"
    >
      {/* Cards de Boas-vindas */}
      <div className="bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl p-8 text-white mb-8">
        <h2 className="text-3xl font-bold mb-2">
          Olá, {user?.full_name?.split(' ')[0] || 'Usuário'}! 👋
        </h2>
        <p className="text-white/90 text-lg">
          Seja bem-vindo ao painel administrativo do ClickFome
        </p>
      </div>

      {/* Menu Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Dashboard */}
        <Link
          to="/admin/dashboard"
          className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-red-500 hover:shadow-lg transition-all cursor-pointer group block"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Dashboard</h3>
          <p className="text-sm text-slate-600">Visão geral do negócio</p>
        </Link>

        {/* Produtos */}
        <Link
          to="/admin/products"
          className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-red-500 hover:shadow-lg transition-all cursor-pointer group block"
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Produtos</h3>
          <p className="text-sm text-slate-600">Gerenciar cardápio</p>
        </Link>

        {/* Categorias */}
        <Link
          to="/admin/categories"
          className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-red-500 hover:shadow-lg transition-all cursor-pointer group block"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FolderTree className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Categorias</h3>
          <p className="text-sm text-slate-600">Organizar produtos</p>
        </Link>

        {/* Usuários */}
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-red-500 hover:shadow-lg transition-all cursor-pointer group block"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Usuários</h3>
          <p className="text-sm text-slate-600">Gerenciar equipe</p>
        </Link>
      </div>

      {/* Info do Usuário */}
      <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Informações da Conta</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500 mb-1">Email</p>
            <p className="font-medium text-slate-900">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Nome</p>
            <p className="font-medium text-slate-900">{user?.full_name || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Função</p>
            <p className="font-medium text-slate-900">{user?.role}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Status</p>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {user?.is_active ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}