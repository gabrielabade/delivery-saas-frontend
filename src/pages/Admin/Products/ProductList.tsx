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
  AlertCircle
} from 'lucide-react';
import api from '../../../services/api';
import { useStore } from '../../../contexts/StoreContext';
import { formatCurrency } from '../../../utils/format';

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
  const { currentStore } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentStore) {
      fetchProducts();
    }
  }, [currentStore]);

  const fetchProducts = async () => {
    if (!currentStore) {
      setError('Selecione uma loja primeiro');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('Buscando produtos para loja:', currentStore.id);

      let productsData = [];

      // Tente diferentes rotas
      try {
        // Primeiro tenta a rota admin
        const response = await api.get('/products/admin', {
          params: {
            store_id: currentStore.id,
            only_available: false
          }
        });
        productsData = response.data || [];
        console.log('Produtos encontrados (admin):', productsData.length);
      } catch (error1: any) {
        console.log('Rota /products/admin não funcionou, tentando /products...');

        try {
          // Tenta rota pública com mais parâmetros
          const response = await api.get('/products/', {
            params: {
              store_id: currentStore.id,
              limit: 100
            }
          });
          productsData = response.data || [];
          console.log('Produtos encontrados (pública):', productsData.length);
        } catch (error2: any) {
          console.error('Todas as rotas falharam:', error2);
          throw error2;
        }
      }

      setProducts(productsData);

    } catch (error: any) {
      console.error('Erro ao buscar produtos:', error);
      setError(`Erro ao carregar produtos: ${error.message || 'Verifique sua conexão'}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleAvailability = async (productId: number, isAvailable: boolean) => {
    if (!currentStore) return;

    try {
      await api.patch(`/products/${productId}/availability`, null, {
        params: {
          is_available: !isAvailable,
          store_id: currentStore.id
        }
      });
      fetchProducts(); // Recarrega a lista
    } catch (error: any) {
      console.error('Erro ao alterar disponibilidade:', error);
      alert(`Erro: ${error.message}`);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await api.delete(`/products/${productId}`, {
        params: { store_id: currentStore!.id }
      });
      fetchProducts();
    } catch (error: any) {
      console.error('Erro ao excluir produto:', error);
      alert(`Erro: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 border-b-4 border-orange-600">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">Produtos</h1>
              <p className="text-orange-100">
                {currentStore ? `Loja: ${currentStore.name}` : 'Selecione uma loja'}
              </p>
            </div>

            <Link
              to="/admin/products/new"
              className="flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-colors"
            >
              <Plus size={20} />
              Novo Produto
            </Link>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Barra de busca */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Gerenciar Produtos</h2>
              <p className="text-slate-600">
                Total de produtos: <span className="font-bold text-orange-600">{products.length}</span>
              </p>
            </div>

            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Buscar produtos por nome, descrição ou SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-96 pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:ring-0 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {!currentStore ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Package size={40} className="text-orange-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Selecione uma loja primeiro
            </h3>
            <p className="text-slate-500 mb-6">
              Use o seletor de lojas no cabeçalho para escolher qual loja gerenciar
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Package size={40} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm
                ? 'Tente buscar com outros termos'
                : `Esta loja ainda não tem produtos cadastrados`
              }
            </p>
            {!searchTerm && (
              <Link
                to="/admin/products/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-bold hover:shadow-xl transition-all"
              >
                <Plus size={20} />
                Criar Primeiro Produto
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y-2 divide-slate-100">
                <thead className="bg-gradient-to-r from-slate-50 to-orange-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Estoque
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-orange-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover mr-3 border border-slate-200"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-3 border border-orange-200">
                              <Package size={24} className="text-orange-600" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900">{product.name}</div>
                            <div className="text-sm text-slate-500">
                              {product.sku && `SKU: ${product.sku}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">
                          {product.category?.name || 'Sem categoria'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">
                          {formatCurrency(parseFloat(product.price))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className={`font-medium ${product.track_stock && product.stock <= product.min_stock
                              ? 'text-red-600'
                              : 'text-slate-900'
                            }`}>
                            {product.stock}
                          </span>
                          {product.track_stock && product.stock <= product.min_stock && (
                            <span className="ml-2 text-xs text-red-500 font-bold">BAIXO</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.is_available
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                          }`}>
                          {product.is_available ? 'Disponível' : 'Indisponível'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleAvailability(product.id, product.is_available)}
                            className={`p-2 rounded-lg transition-colors ${product.is_available
                                ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                              }`}
                            title={product.is_available ? 'Tornar indisponível' : 'Tornar disponível'}
                          >
                            {product.is_available ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;