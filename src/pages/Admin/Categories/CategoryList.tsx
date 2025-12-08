import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X
} from 'lucide-react';
import api from '../../../services/api';
import { useStore } from '../../../contexts/StoreContext';

interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  store_id: number;
}

const CategoryList = () => {
  const { currentStore } = useStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentStore) {
      fetchCategories();
    }
  }, [currentStore]);

  const fetchCategories = async () => {
    if (!currentStore) {
      console.error('Nenhuma loja selecionada');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Buscando categorias para loja:', currentStore.id);

      // TENTE ESTAS ROTAS EM ORDEM:
      let categoriesData = [];

      try {
        // Primeira tentativa: rota específica por store
        const response = await api.get(`/categories/store/${currentStore.id}`);
        categoriesData = response.data || [];
        console.log('Categorias encontradas (rota store):', categoriesData.length);
      } catch (error1: any) {
        console.log('Rota /categories/store não funcionou, tentando produtos/categories...');

        try {
          // Segunda tentativa: rota de produtos/categories
          const response = await api.get('/products/categories/admin', {
            params: { store_id: currentStore.id }
          });
          categoriesData = response.data || [];
          console.log('Categorias encontradas (rota products):', categoriesData.length);
        } catch (error2: any) {
          console.log('Rota /products/categories não funcionou, tentando /categories...');

          try {
            // Terceira tentativa: rota geral de categories
            const response = await api.get('/categories/');
            categoriesData = (response.data || []).filter((cat: Category) =>
              cat.store_id === currentStore.id
            );
            console.log('Categorias filtradas:', categoriesData.length);
          } catch (error3: any) {
            console.error('Todas as rotas falharam:', error3);
          }
        }
      }

      setCategories(categoriesData);

    } catch (error: any) {
      console.error('Erro ao buscar categorias:', error);
      alert(`Erro ao buscar categorias: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleToggleActive = async (categoryId: number, isActive: boolean) => {
    if (!currentStore) return;

    try {
      // Primeiro tenta a rota específica
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
      alert(`Erro: ${error.message}`);
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      await api.delete(`/categories/${categoryId}`);
      fetchCategories();
    } catch (error: any) {
      console.error('Erro ao excluir categoria:', error);
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
              <h1 className="text-3xl font-black text-white mb-2">Categorias</h1>
              <p className="text-orange-100">
                {currentStore ? `Loja: ${currentStore.name}` : 'Selecione uma loja'}
              </p>
            </div>

            <Link
              to="/admin/categories/new"
              className="flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-colors"
            >
              <Plus size={20} />
              Nova Categoria
            </Link>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-8">
        {/* Barra de busca e info */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Gerenciar Categorias</h2>
              <p className="text-slate-600">
                Total de categorias: <span className="font-bold text-orange-600">{categories.length}</span>
              </p>
            </div>

            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Buscar categorias por nome ou descrição..."
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
              <FolderTree size={40} className="text-orange-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Selecione uma loja primeiro
            </h3>
            <p className="text-slate-500 mb-6">
              Use o seletor de lojas no cabeçalho para escolher qual loja gerenciar
            </p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FolderTree size={40} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Nenhuma categoria encontrada
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm
                ? 'Tente buscar com outros termos'
                : `Esta loja ainda não tem categorias cadastradas`
              }
            </p>
            {!searchTerm && (
              <Link
                to="/admin/categories/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-bold hover:shadow-xl transition-all"
              >
                <Plus size={20} />
                Criar Primeira Categoria
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
                      Categoria
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Ordem
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
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-orange-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-orange-100 rounded-lg mr-3">
                            <FolderTree size={20} className="text-orange-600" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{category.name}</div>
                            <div className="text-xs text-slate-500">ID: {category.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 max-w-xs">
                          {category.description || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                          {category.sort_order}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(category.id, category.is_active)}
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${category.is_active
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
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
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/categories/edit/${category.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

export default CategoryList;