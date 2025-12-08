import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  Filter
} from 'lucide-react';
import api from '../../../services/api';
import { useStore } from '../../../contexts/StoreContext';
import { formatCurrency } from '../../../utils/format';
import AdminPageWrapper from '../../../components/layouts/AdminPageWrapper';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  category_id: number;
  store_id: number;
  sku?: string;
  image_url?: string;
  stock: number;
  track_stock: boolean;
  min_stock: number;
  is_available: boolean;
  is_active: boolean;
  created_at: string;
  category?: {
    id: number;
    name: string;
  };
}

const ProductList = () => {
  const { currentStore, currentStoreId } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<boolean | ''>('');

  useEffect(() => {
    if (currentStoreId) {
      fetchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [currentStoreId]);

  const fetchProducts = async () => {
    if (!currentStoreId) {
      setError('Selecione uma loja primeiro');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('Buscando produtos para loja:', currentStoreId);

      let productsData: Product[] = [];

      // Tente a rota admin primeiro
      try {
        const response = await api.get('/products/admin', {
          params: {
            store_id: currentStoreId,
            only_available: false,
            limit: 100
          }
        });
        productsData = response.data || [];
        console.log('Produtos encontrados (admin):', productsData.length);
      } catch (error1: any) {
        console.log('Rota admin não funcionou, tentando pública...');

        try {
          const response = await api.get('/products/', {
            params: {
              store_id: currentStoreId,
              limit: 100
            }
          });
          productsData = response.data || [];
          console.log('Produtos encontrados (pública):', productsData.length);
        } catch (error2: any) {
          console.error('Todas as rotas falharam:', error2);
          throw new Error('Não foi possível carregar os produtos');
        }
      }

      setProducts(productsData);

    } catch (error: any) {
      console.error('Erro ao buscar produtos:', error);
      setError(error.message || 'Erro ao carregar produtos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Obter categorias únicas para filtro
  const categories = Array.from(
    new Set(
      products
        .map(p => p.category)
        .filter(Boolean)
        .map(c => ({ id: c!.id, name: c!.name }))
    )
  );

  const filteredProducts = products.filter(product => {
    // Filtro de busca
    const matchesSearch = !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro de categoria
    const matchesCategory = !categoryFilter || product.category_id === categoryFilter;

    // Filtro de disponibilidade
    const matchesAvailability = availabilityFilter === '' || product.is_available === availabilityFilter;

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const handleToggleAvailability = async (productId: number, isAvailable: boolean) => {
    if (!currentStoreId) return;

    try {
      await api.patch(`/products/${productId}/availability`, null, {
        params: {
          is_available: !isAvailable,
          store_id: currentStoreId
        }
      });
      fetchProducts();
    } catch (error: any) {
      console.error('Erro ao alterar disponibilidade:', error);
      alert(`Erro: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await api.delete(`/products/${productId}`, {
        params: { store_id: currentStoreId }
      });
      fetchProducts();
    } catch (error: any) {
      console.error('Erro ao excluir produto:', error);
      alert(`Erro: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <AdminPageWrapper
      title="Produtos"
      subtitle={currentStore ? `Loja: ${currentStore.name}` : 'Selecione uma loja'}
      loading={loading}
      action={
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <Plus size={16} />
          Novo Produto
        </Link>
      }
    >
      {error && (
        <div className="p-4 border-b border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={18} />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          {/* Barra de busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar produtos por nome, descrição ou SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
            />
          </div>

          {/* Filtros adicionais */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value ? Number(e.target.value) : '')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 outline-none text-sm"
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={availabilityFilter === '' ? '' : availabilityFilter.toString()}
              onChange={(e) => setAvailabilityFilter(e.target.value === '' ? '' : e.target.value === 'true')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 outline-none text-sm"
            >
              <option value="">Todos os status</option>
              <option value="true">Disponíveis</option>
              <option value="false">Indisponíveis</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="overflow-x-auto">
        {!loading && !currentStoreId ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Package size={32} className="text-orange-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Selecione uma loja
            </h3>
            <p className="text-gray-500">
              Use o seletor de lojas no cabeçalho para gerenciar produtos
            </p>
          </div>
        ) : !loading && filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || categoryFilter || availabilityFilter !== ''
                ? 'Nenhum produto encontrado'
                : 'Nenhum produto cadastrado'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || categoryFilter || availabilityFilter !== ''
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando seu primeiro produto'}
            </p>
            {!searchTerm && !categoryFilter && availabilityFilter === '' && (
              <Link
                to="/admin/products/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                <Plus size={16} />
                Criar Primeiro Produto
              </Link>
            )}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover mr-3 border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3 border border-orange-200">
                          <Package size={18} className="text-orange-600" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">
                          {product.sku ? `SKU: ${product.sku}` : `ID: ${product.id}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">
                      {product.category?.name || 'Sem categoria'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-gray-900">
                      {formatCurrency(parseFloat(product.price))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <span className={`font-medium ${product.track_stock && product.stock <= product.min_stock
                        ? 'text-red-600'
                        : 'text-gray-900'
                        }`}>
                        {product.stock}
                      </span>
                      {product.track_stock && product.stock <= product.min_stock && (
                        <span className="ml-2 text-xs text-red-500 font-medium">BAIXO</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${product.is_available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {product.is_available ? 'Disponível' : 'Indisponível'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleAvailability(product.id, product.is_available)}
                        className={`p-1.5 rounded transition-colors ${product.is_available
                            ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        title={product.is_available ? 'Tornar indisponível' : 'Tornar disponível'}
                      >
                        {product.is_available ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      {!loading && filteredProducts.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-sm text-gray-600">
                Mostrando <span className="font-medium">{filteredProducts.length}</span> de <span className="font-medium">{products.length}</span> produtos
              </p>
              {products.some(p => p.track_stock && p.stock <= p.min_stock) && (
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ {products.filter(p => p.track_stock && p.stock <= p.min_stock).length} produto(s) com estoque baixo
                </p>
              )}
            </div>
            {currentStore && (
              <p className="text-xs text-gray-500">
                Loja: {currentStore.name}
              </p>
            )}
          </div>
        </div>
      )}
    </AdminPageWrapper>
  );
};

export default ProductList;