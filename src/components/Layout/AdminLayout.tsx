import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Package, FolderTree, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import StoreSelector from '../StoreSelector';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export default function AdminLayout({
  children,
  title,
  subtitle,
  showBackButton = false
}: AdminLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Fixo */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo e Nome */}
            <div className="flex items-center gap-3">
              {showBackButton ? (
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5 text-slate-600" />
                </button>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  {title || 'Dashboard Admin'}
                </h1>
                {subtitle && (
                  <p className="text-xs text-slate-500">{subtitle}</p>
                )}
              </div>
            </div>

            {/* Seletor de Loja - SEMPRE VISÍVEL */}
            <div className="flex-1 max-w-md mx-6">
              <StoreSelector />
            </div>

            {/* User Info e Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-900">
                  {user?.full_name || user?.email}
                </p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>

          {/* Menu de Navegação */}
          <div className="mt-3 flex gap-1">
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/admin/dashboard')
                  ? 'bg-red-50 text-red-600'
                  : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/admin/products')
                  ? 'bg-red-50 text-red-600'
                  : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <Package className="w-4 h-4" />
              Produtos
            </Link>
            <Link
              to="/admin/categories"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/admin/categories')
                  ? 'bg-red-50 text-red-600'
                  : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <FolderTree className="w-4 h-4" />
              Categorias
            </Link>
            <Link
              to="/admin/users"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/admin/users')
                  ? 'bg-red-50 text-red-600'
                  : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <Users className="w-4 h-4" />
              Usuários
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo da Página */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}