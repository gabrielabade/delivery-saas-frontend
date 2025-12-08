import React, { useState, ReactNode } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  FolderTree,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  ChefHat,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';
import StoreSelector from '../StoreSelector';

interface AdminLayoutProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  children?: ReactNode;
}

const AdminLayout = ({
  title,
  subtitle,
  showBackButton = false,
  children
}: AdminLayoutProps) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { currentStore } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { title: 'Pedidos', icon: ShoppingCart, path: '/admin/orders' },
    { title: 'Produtos', icon: Package, path: '/admin/products' },
    { title: 'Categorias', icon: FolderTree, path: '/admin/categories' },
    { title: 'Usuários', icon: Users, path: '/admin/users' },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* HEADER SUPERIOR */}
      <header className="bg-white border-b-2 border-slate-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* MENU MOBILE + LOGO */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 lg:hidden"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <Link to="/admin/dashboard" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-lg font-black bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                    ClickFome
                  </h1>
                  <p className="text-xs text-slate-500">Admin Dashboard</p>
                </div>
              </Link>
            </div>

            {/* LOJA + USUÁRIO */}
            <div className="flex items-center gap-4">
              <StoreSelector />

              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {user?.full_name || user?.email || 'Usuário'}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {user?.role?.toLowerCase().replace('_', ' ') || 'Usuário'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  signOut();
                  window.location.href = '/login';
                }}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* HEADER DA PÁGINA */}
        {(title || subtitle) && (
          <div className="bg-white border-t border-slate-200 px-4 py-3">
            <div className="container mx-auto flex items-center gap-3">

              {showBackButton && (
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
                >
                  <ArrowLeft size={20} />
                </button>
              )}

              <div>
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                {subtitle && (
                  <p className="text-slate-600 text-sm">{subtitle}</p>
                )}
              </div>

            </div>
          </div>
        )}
      </header>

      <div className="flex flex-1">

        {/* MENU LATERAL DESKTOP */}
        <aside className="hidden lg:block w-64 bg-white border-r min-h-full">
          <nav className="p-4">
            <div className="mb-8">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
                Navegação
              </p>
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive(item.path)
                      ? 'bg-orange-50 text-orange-600 font-medium border-l-4 border-orange-500'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                  >
                    <item.icon size={20} />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* INFO DA LOJA ATUAL */}
            {currentStore && (
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                <p className="text-xs font-medium text-orange-700 mb-2">Loja Atual</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {currentStore.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{currentStore.name}</p>
                    <p className="text-xs text-slate-600 truncate">Selecionada para gestão</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-orange-100">
                  <p className="text-xs text-slate-500">
                    Todos os dados exibidos são desta loja
                  </p>
                </div>
              </div>
            )}
          </nav>
        </aside>

        {/* CONTEÚDO DA PÁGINA */}
        <main className="flex-1 p-4">
          {children || <Outlet />}
        </main>

      </div>

      {/* MENU MOBILE */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">ClickFome Admin</h3>
                  <p className="text-sm text-slate-500 capitalize">
                    {user?.role?.toLowerCase().replace('_', ' ') || 'Usuário'}
                  </p>
                </div>
              </div>
            </div>

            <nav className="p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Navegação
              </p>
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl ${isActive(item.path)
                      ? 'bg-orange-50 text-orange-600 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon size={20} />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminLayout;
