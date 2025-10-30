import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Admin/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas Protegidas (Admin) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_ADMIN', 'STORE_MANAGER']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirect padrão */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;