// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Admin/Dashboard';
import CategoryList from './pages/Admin/Categories/CategoryList';
import CategoryForm from './pages/Admin/Categories/CategoryForm';
// Importações dos produtos
import ProductList from './pages/Admin/Products/ProductList';
import ProductForm from './pages/Admin/Products/ProductForm';

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
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

            {/* Categorias */}
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_ADMIN', 'STORE_MANAGER']}>
                  <CategoryList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories/new"
              element={
                <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_ADMIN', 'STORE_MANAGER']}>
                  <CategoryForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_ADMIN', 'STORE_MANAGER']}>
                  <CategoryForm />
                </ProtectedRoute>
              }
            />

            {/* Produtos */}
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_ADMIN', 'STORE_MANAGER']}>
                  <ProductList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/new"
              element={
                <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_ADMIN', 'STORE_MANAGER']}>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_ADMIN', 'STORE_MANAGER']}>
                  <ProductForm />
                </ProtectedRoute>
              }
            />

            {/* Redirect padrão */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;