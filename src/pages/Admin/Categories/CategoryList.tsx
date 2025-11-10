// pages/Admin/Categories/CategoryList.tsx - VERSÃO CORRIGIDA
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowLeft, RefreshCw } from 'lucide-react';
import categoryService, { Category } from '../../../services/category.service';
import { useStore } from '../../../contexts/StoreContext';

export default function CategoryList() {
  const navigate = useNavigate();
  const { currentStoreId } = useStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>(''); // Garantir que é string
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentStoreId) {
      console.log('🔄 Store ID mudou, carregando categorias...', currentStoreId);
      loadCategories();
    }
  }, [currentStoreId]);

  const loadCategories = async () => {
    if (!currentStoreId) {
      console.log('❌ Nenhuma store selecionada');
      return;
    }

    try {
      setLoading(true);
      setError(''); // Limpar erro anterior
      console.log('📡 Carregando categorias para store:', currentStoreId);

      const data = await categoryService.list(currentStoreId);
      console.log('✅ Categorias carregadas:', data);

      setCategories(data);
    } catch (err: any) {
      console.error('❌ Erro ao carregar categorias:', err);

      // CORREÇÃO: Garantir que o erro seja uma string
      const errorMessage = err.response?.data?.detail
        ? String(err.response.data.detail) // Converter para string
        : 'Erro ao carregar categorias';

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await categoryService.delete(id, currentStoreId!);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setDeleteId(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail
        ? String(err.response.data.detail)
        : 'Erro ao deletar categoria';
      alert(errorMessage);
    }
  };

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!currentStoreId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowLeft className="w-8 h-8 text-slate-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Selecione uma loja</h2>
          <p className="text-slate-600">Escolha uma loja no seletor acima para ver as categorias</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando categorias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Categorias</h1>
                <p className="text-sm text-slate-500">Store ID: {currentStoreId}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={loadCategories}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                Recarregar
              </button>

              <Link
                to="/admin/categories/new"
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus size={18} />
                Nova Categoria
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="font-medium text-red-800 mb-1">Erro ao carregar categorias</h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Barra de Busca */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar categorias por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-red-500"
          />
        </div>

        {/* Grid de Categorias */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📁</span>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {searchTerm ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria cadastrada'}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm
                ? 'Tente ajustar os termos da busca'
                : 'Comece criando sua primeira categoria'
              }
            </p>
            {!searchTerm && (
              <Link
                to="/admin/categories/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus size={18} />
                Criar Primeira Categoria
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-slate-900 text-lg">{cat.name}</h3>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    Ordem: {cat.sort_order}
                  </span>
                </div>

                {cat.description && (
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{cat.description}</p>
                )}

                {cat.image_url && (
                  <div className="mb-4">
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Link
                    to={`/admin/categories/edit/${cat.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit size={16} />
                    Editar
                  </Link>

                  <button
                    onClick={() => setDeleteId(cat.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Confirmação de Exclusão */}
        {deleteId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Confirmar exclusão</h3>
              <p className="text-slate-600 mb-6">
                Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}