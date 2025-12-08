import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import api from '../../../services/api';
import { useStore } from '../../../contexts/StoreContext';
import AdminPageWrapper from '../../../components/layouts/AdminPageWrapper';

interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  store_id: number;
  created_at: string;
}

const CategoryList = () => {
  const { currentStore, currentStoreId } = useStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentStoreId) {
      fetchCategories();
    } else {
      setCategories([]);
      setLoading(false);
    }
  }, [currentStoreId]);

  const fetchCategories = async () => {
    if (!currentStoreId) return;

    try {
      setLoading(true);
      setError('');
      console.log('Buscando categorias para loja:', currentStoreId);

      let categoriesData: Category[] = [];

      // Tente diferentes rotas
      try {
        // Primeira tentativa: rota de produtos/categories/admin
        const response = await api.get('/products/categories/admin', {
          params: {
            store_id: currentStoreId,
            with_products: false
          }
        });
        categoriesData = response.data || [];
        console.log('Categorias encontradas (admin):', categoriesData.length);
      } catch (error1: any) {
        console.log('Rota admin não funcionou, tentando pública...');

        try {
          // Segunda tentativa: rota pública de categories
          const response = await api.get('/products/categories', {
            params: {
              store_id: currentStoreId,
              limit: 100
            }
          });
          categoriesData = response.data || [];
          console.log('Categorias encontradas (pública):', categoriesData.length);
        } catch (error2: any) {
          console.error('Todas as rotas falharam:', error2);
          throw new Error('Não foi possível carregar as categorias');
        }
      }

      setCategories(categoriesData);

    } catch (error: any) {
      console.error('Erro ao buscar categorias:', error);
      setError(error.message || 'Erro ao carregar categorias');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleToggleActive = async (categoryId: number, isActive: boolean) => {
    if (!currentStoreId) return;

    try {
      // Primeiro tenta a rota específica de toggle
      try {
        await api.patch(`/categories/${categoryId}/toggle-active`);
      } catch (error1: any) {
        // Se não funcionar, tenta atualizar diretamente
        await api.put(`/categories/${categoryId}`, {
          is_active: !isActive
        });
      }

      fetchCategories(); // Recarrega a lista
    } catch (error: any) {
      console.error('Erro ao alterar status:', error);
      alert(`Erro: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      // Tenta a rota de products primeiro
      try {
        await api.delete(`/products/categories/${categoryId}`, {
          params: { store_id: currentStoreId }
        });
      } catch (error1: any) {
        // Se não funcionar, tenta a rota geral
        await api.delete(`/categories/${categoryId}`);
      }

      fetchCategories();
    } catch (error: any) {
      console.error('Erro ao excluir categoria:', error);
      alert(`Erro: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <AdminPageWrapper
      title="Categorias"
      subtitle={currentStore ? `Loja: ${currentStore.name}` : 'Selecione uma loja'}
      loading={loading}
      action={
        <Link
          to="/admin/categories/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <Plus size={16} />
          Nova Categoria
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

      {/* Barra de busca */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar categorias por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="overflow-x-auto">
        {!loading && !currentStoreId ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <FolderTree size={32} className="text-orange-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Selecione uma loja
            </h3>
            <p className="text-gray-500">
              Use o seletor de lojas no cabeçalho para gerenciar categorias
            </p>
          </div>
        ) : !loading && filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FolderTree size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria cadastrada'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Tente buscar com outros termos' : 'Comece criando sua primeira categoria'}
            </p>
            {!searchTerm && (
              <Link
                to="/admin/categories/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                <Plus size={16} />
                Criar Primeira Categoria
              </Link>
            )}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ordem
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
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg mr-3">
                        <FolderTree size={18} className="text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{category.name}</div>
                        <div className="text-xs text-gray-500">ID: {category.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {category.description || '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {category.sort_order}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(category.id, category.is_active)}
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors ${category.is_active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                    >
                      {category.is_active ? (
                        <>
                          <Check size={12} />
                          Ativa
                        </>
                      ) : (
                        <>
                          <X size={12} />
                          Inativa
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/categories/edit/${category.id}`}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
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
      {!loading && filteredCategories.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Mostrando <span className="font-medium">{filteredCategories.length}</span> de <span className="font-medium">{categories.length}</span> categorias
            </p>
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

export default CategoryList;