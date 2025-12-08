import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, ChevronDown, Store, User,
  LayoutDashboard, ShoppingCart, Package,
  FolderTree, Users, LogOut, Home
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';
import StoreSelector from '../common/StoreSelector';

const AdminHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { currentStore } = useStore();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Pedidos', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Produtos', href: '/admin/products', icon: Package },
    { name: 'Categorias', href: '/admin/categories', icon: FolderTree },
    { name: 'Usuários', href: '/admin/users', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    signOut();
    window.location.href = '/login';
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Mobile header */}
        <div className="flex items-center justify-between h-16 lg:hidden">
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/admin/dashboard" className="ml-2 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CF</span>
              </div>
              <span className="ml-2 font-bold text-gray-800 text-sm">ClickFome</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {currentStore && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-lg">
                <Store size={14} className="text-orange-600" />
                <span className="text-xs font-medium text-orange-700 truncate max-w-[80px]">
                  {currentStore.name}
                </span>
              </div>
            )}

            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              aria-label="Menu do usuário"
            >
              <User size={18} />
            </button>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:flex items-center justify-between h-16">
          <div className="flex items-center flex-1">
            <Link to="/admin/dashboard" className="flex items-center flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">CF</span>
              </div>
              <span className="ml-3 text-lg font-bold text-gray-900">ClickFome Admin</span>
            </Link>

            <nav className="ml-8 flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                >
                  <item.icon size={18} className="mr-2" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <StoreSelector />

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
                aria-label="Perfil do usuário"
              >
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-medium text-gray-900">{user?.full_name || 'Usuário'}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role?.toLowerCase().replace('_', ' ')}
                  </p>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                      <p className="text-xs text-gray-500">{user?.role}</p>
                    </div>
                    <Link
                      to="/"
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Home size={16} className="mr-2" />
                      Site Público
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sair
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
            <div className="lg:hidden absolute left-0 right-0 top-16 bg-white border-t mt-2 pt-4 pb-4 z-50">
              <div className="space-y-1 px-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 text-base font-medium rounded-lg ${isActive(item.href)
                        ? 'bg-orange-50 text-orange-700'
                        : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                  >
                    <item.icon size={20} className="mr-3" />
                    {item.name}
                  </Link>
                ))}

                <div className="px-4 py-3">
                  <StoreSelector />
                </div>

                <div className="px-4 pt-3 border-t">
                  <p className="text-sm text-gray-500 mb-1">Logado como</p>
                  <p className="font-medium text-gray-900">{user?.full_name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>

                <div className="flex gap-2 pt-3">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Site Público
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex-1 text-center px-4 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;