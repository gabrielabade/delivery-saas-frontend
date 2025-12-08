// No seu App.tsx ou routes.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Admin/Dashboard';
import UserList from './pages/Admin/Users/UserList';
import UserForm from './pages/Admin/Users/UserForm';
import ProductList from './pages/Admin/Products/ProductList';
import ProductForm from './pages/Admin/Products/ProductForm';
import CategoryList from './pages/Admin/Categories/CategoryList';
import CategoryForm from './pages/Admin/Categories/CategoryForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas do admin */}
        <Route element={<ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_ADMIN', 'STORE_MANAGER', 'DELIVERY_PERSON']} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/orders" element={<div>Pedidos (em construção)</div>} />

          {/* Produtos */}
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/products/new" element={<ProductForm />} />
          <Route path="/admin/products/edit/:id" element={<ProductForm />} />

          {/* Categorias */}
          <Route path="/admin/categories" element={<CategoryList />} />
          <Route path="/admin/categories/new" element={<CategoryForm />} />
          <Route path="/admin/categories/edit/:id" element={<CategoryForm />} />

          {/* Usuários */}
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/admin/users/new" element={<UserForm />} />
          <Route path="/admin/users/edit/:id" element={<UserForm />} />
        </Route>

        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;