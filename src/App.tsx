import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Admin/Dashboard';
import CategoryList from './pages/Admin/Categories/CategoryList';
import CategoryForm from './pages/Admin/Categories/CategoryForm';
import ProductList from './pages/Admin/Products/ProductList';
import ProductForm from './pages/Admin/Products/ProductForm';
import UserList from './pages/Admin/Users/UserList';
import UserForm from './pages/Admin/Users/UserForm';

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
            <Route element={
              <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_ADMIN', 'STORE_MANAGER']} />
            }>
              <Route path="/admin/dashboard" element={<Dashboard />} />

              {/* Categorias */}
              <Route path="/admin/categories" element={<CategoryList />} />
              <Route path="/admin/categories/new" element={<CategoryForm />} />
              <Route path="/admin/categories/edit/:id" element={<CategoryForm />} />

              {/* Produtos */}
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/products/new" element={<ProductForm />} />
              <Route path="/admin/products/edit/:id" element={<ProductForm />} />
            </Route>

            {/* Usuários - com permissões diferentes */}
            <Route element={
              <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_ADMIN']} />
            }>
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/users/new" element={<UserForm />} />
              <Route path="/admin/users/edit/:id" element={<UserForm />} />
            </Route>

            {/* Rota de teste - remover em produção */}
            <Route path="/test" element={
              <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-red-600 mb-4">✅ Teste OK</h1>
                  <p className="text-lg text-gray-700">React está funcionando!</p>
                  <p className="text-sm text-gray-500 mt-2">Token no localStorage: {localStorage.getItem('token') ? 'Sim' : 'Não'}</p>
                </div>
              </div>
            } />

            {/* Redirect padrão */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;