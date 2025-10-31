import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../../contexts/StoreContext'; 
import productService, { ProductCreate, ProductUpdate } from '../../../services/product.service'; 
import categoryService, { Category } from '../../../services/category.service';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'; 

export default function ProductForm() {
  const { currentStoreId } = useStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    price: '',
    cost_price: '',
    promotional_price: '',
    stock: 0,
    min_stock: 0,
    track_stock: true,
    sku: '',
    barcode: '',
    image_url: '',
    sort_order: 0,
    is_featured: false,
    is_available: true,
    category_id: 0
  });

  useEffect(() => {
    if (currentStoreId) {
      loadCategories();
      if (isEditing && id) {
        loadProduct(Number(id));
      }
    }
  }, [id, currentStoreId]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.list(currentStoreId!);
      setCategories(data);
      if (data.length > 0 && !isEditing) {
        setFormData(prev => ({ ...prev, category_id: data[0].id }));
      }
    } catch (err) {
      setError('Erro ao carregar categorias');
    }
  };

  const loadProduct = async (productId: number) => {
    try {
      setLoading(true);
      const data = await productService.getById(productId, currentStoreId!);
      setFormData({
        name: data.name,
        description: data.description || '',
        short_description: data.short_description || '',
        price: data.price,
        cost_price: data.cost_price || '',
        promotional_price: data.promotional_price || '',
        stock: data.stock,
        min_stock: data.min_stock,
        track_stock: data.track_stock,
        sku: data.sku || '',
        barcode: data.barcode || '',
        image_url: data.image_url || '',
        sort_order: data.sort_order,
        is_featured: data.is_featured,
        is_available: data.is_available,
        category_id: data.category_id
      });
    } catch (err) {
      setError('Erro ao carregar produto');
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

    if (!formData.category_id) {
      setError('Selecione uma categoria.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      const numericPrice = parseFloat(formData.price) || 0;
      const numericCostPrice = formData.cost_price ? parseFloat(formData.cost_price) : null;
      const numericPromotionalPrice = formData.promotional_price ? parseFloat(formData.promotional_price) : null;

      if (isEditing && id) {
        const updateData: ProductUpdate = {
          name: formData.name,
          description: formData.description || null,
          short_description: formData.short_description || null,
          price: numericPrice,
          cost_price: numericCostPrice,
          promotional_price: numericPromotionalPrice,
          stock: formData.stock,
          min_stock: formData.min_stock,
          track_stock: formData.track_stock,
          sku: formData.sku || null,
          barcode: formData.barcode || null,
          image_url: formData.image_url || null,
          sort_order: formData.sort_order,
          is_featured: formData.is_featured,
          is_available: formData.is_available,
          category_id: formData.category_id
        };
        await productService.update(Number(id), currentStoreId, updateData);
      } else {
        const createData: ProductCreate = {
          name: formData.name,
          description: formData.description || null,
          short_description: formData.short_description || null,
          price: numericPrice,
          cost_price: numericCostPrice,
          promotional_price: numericPromotionalPrice,
          stock: formData.stock,
          min_stock: formData.min_stock,
          track_stock: formData.track_stock,
          sku: formData.sku || null,
          barcode: formData.barcode || null,
          image_url: formData.image_url || null,
          sort_order: formData.sort_order,
          is_featured: formData.is_featured,
          is_available: formData.is_available,
          category_id: formData.category_id
        };
        await productService.create(currentStoreId, createData);
      }

      navigate('/admin/products');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao salvar produto');
    } finally {
      setSaving(false);
    }
  };

  if (!currentStoreId) {
    return <div className="p-6 text-center">Selecione uma loja para continuar</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
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
              onClick={() => navigate('/admin/products')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {isEditing ? 'Editar Produto' : 'Novo Produto'}
              </h1>
              <p className="text-sm text-slate-500">
                {isEditing ? 'Atualize os dados do produto' : 'Preencha os dados do novo produto'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna 1 - Informações Básicas */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nome *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Descrição Curta</label>
                <input
                  type="text"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Categoria *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-red-500"
                  required
                >
                  <option value={0}>Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">URL da Imagem</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>

            {/* Coluna 2 - Preços e Estoque */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Preço *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Preço Promocional</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.promotional_price}
                    onChange={(e) => setFormData({ ...formData, promotional_price: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Preço de Custo</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cost_price}
                  onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Estoque</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Estoque Mínimo</label>
                  <input
                    type="number"
                    value={formData.min_stock}
                    onChange={(e) => setFormData({ ...formData, min_stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Código de Barras</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Ordem</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg"
                  min="0"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.track_stock}
                    onChange={(e) => setFormData({ ...formData, track_stock: e.target.checked })}
                    className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Controlar estoque</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Produto em destaque</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Disponível para venda</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="flex-1 px-6 py-3 border-2 border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}