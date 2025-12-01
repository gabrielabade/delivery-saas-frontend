import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  console.log('🔒 ProtectedRoute:', {
    loading,
    user: user ? { id: user.id, email: user.email, role: user.role } : null,
    allowedRoles,
    pathname: window.location.pathname,
  });

  if (loading) {
    console.log('⏳ ProtectedRoute: Mostrando loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando...</p>
          <p className="text-xs text-slate-400 mt-2">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🚫 ProtectedRoute: Usuário não autenticado, redirecionando para /login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log('🚫 ProtectedRoute: Acesso negado. Role:', user.role, 'Permitido:', allowedRoles);
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md">
          <h1 className="text-6xl mb-4">🚫</h1>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Acesso Negado</h2>
          <p className="text-slate-600 mb-4">
            Você ({user.role}) não tem permissão para acessar esta página.
          </p>
          <p className="text-sm text-slate-500">
            Permissões necessárias: {allowedRoles.join(', ')}
          </p>
        </div>
      </div>
    );
  }

  console.log('✅ ProtectedRoute: Acesso permitido para', user.email);
  return <Outlet />;
}