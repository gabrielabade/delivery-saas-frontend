import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  FolderTree,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Store
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';

const AdminLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { currentStore } = useStore();
  const location = useLocation();

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { title: 'Pedidos', icon: ShoppingCart, path: '/admin/orders' },
    { title: 'Produtos', icon: Package, path: '/admin/products' },
    { title: 'Categorias', icon: FolderTree, path: '/admin/categories' },
    { title: 'Usuários', icon: Users, path: '/admin/users' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo e menu mobile */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <Link to="/admin/dashboard" className="ml-2 lg:ml-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">CF</span>
                  </div>
                  <span className="ml-2 text-lg font-bold text-gray-800 hidden md:block">
                    ClickFome Admin
                  </span>
                </div>
              </Link>
            </div>

            {/* Loja atual e usuário */}
            <div className="flex items-center gap-4">
              {currentStore && (
                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <Store size={16} className="text-gray-600" />
                  <span className="text-sm font-medium">{currentStore.name}</span>
                </div>
              )}

              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.full_name || 'Usuário'}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  signOut();
                  window.location.href = '/login';
                }}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r min-h-[calc(100vh-64px)]">
          <nav className="p-4">
            <div className="mb-8">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
                NAVEGAÇÃO
              </p>
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive(item.path)
                        ? 'bg-gray-100 text-gray-800 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                  >
                    <item.icon size={20} />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">CF</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">ClickFome Admin</h3>
                  <p className="text-sm text-gray-500">{user?.role}</p>
                </div>
              </div>
            </div>
            <nav className="p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                NAVEGAÇÃO
              </p>
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive(item.path)
                        ? 'bg-gray-100 text-gray-800 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
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

      {/* Bottom Navigation Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="flex justify-around py-2">
          {menuItems.slice(0, 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 ${isActive(item.path) ? 'text-gray-800' : 'text-gray-500'
                }`}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;