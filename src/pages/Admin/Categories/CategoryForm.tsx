// pages/Admin/Categories/CategoryForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../../contexts/StoreContext';
import categoryService, { CategoryCreate, CategoryUpdate } from '../../../services/category.service';
import { ArrowLeft, AlertCircle, Save } from 'lucide-react';

export default function CategoryForm() {
  const { currentStoreId } = useStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    sort_order: 0
  });

  useEffect(() => {
    if (isEditing && id && currentStoreId) {
      loadCategory(Number(id));
    }
  }, [id, currentStoreId]);

  const loadCategory = async (categoryId: number) => {
    try {
      setLoading(true);
      setError('');
      const data = await categoryService.getById(categoryId, currentStoreId!);
      setFormData({
        name: data.name,
        description: data.description || '',
        image_url: data.image_url || '',
        sort_order: data.sort_order
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar categoria');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentStoreId) {
      setError('Selecione uma loja antes de salvar.');
      return;
    }

    if (!formData.name.trim()) {
      setError('O nome da categoria é obrigatório.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      if (isEditing && id) {
        const updateData: CategoryUpdate = {
          name: formData.name,
          description: formData.description || null,
          image_url: formData.image_url || null,
          sort_order: formData.sort_order
        };
        await categoryService.update(Number(id), currentStoreId, updateData);
      } else {
        const createData: CategoryCreate = {
          name: formData.name,
          description: formData.description || null,
          image_url: formData.image_url || null,
          sort_order: formData.sort_order
        };
        await categoryService.create(currentStoreId, createData);
      }

      navigate('/admin/categories');
    } catch (err: any) {
      console.error('Erro ao salvar categoria:', err);
      setError(err.response?.data?.detail || 'Erro ao salvar categoria');
    } finally {
      setSaving(false);
    }
  };

  if (!currentStoreId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Selecione uma loja</h2>
          <p className="text-slate-600">Escolha uma loja para criar ou editar categorias</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/categories')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
              </h1>
              <p className="text-sm text-slate-500">
                {isEditing ? 'Atualize os dados da categoria' : 'Preencha os dados da nova categoria'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome da Categoria *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-red-500 focus:ring-0"
                placeholder="Ex: Lanches, Bebidas, Sobremesas..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-red-500 focus:ring-0"
                rows={3}
                placeholder="Descreva brevemente esta categoria..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                URL da Imagem
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-red-500 focus:ring-0"
                placeholder="https://exemplo.com/imagem.jpg"
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ordem de Exibição
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-red-500 focus:ring-0"
                min="0"
              />
              <p className="text-sm text-slate-500 mt-1">
                Categorias com menor número aparecem primeiro
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/admin/categories')}
              className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar Categoria')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}