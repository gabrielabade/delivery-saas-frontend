import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../../contexts/StoreContext';
import categoryService, { Category } from '../../../services/category.service';
import { FolderTree, AlertCircle, PlusCircle } from 'lucide-react';

export default function CategoryList() {
  const { currentStoreId } = useStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentStoreId) loadCategories();
  }, [currentStoreId]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll(currentStoreId!);
      setCategories(data);
    } catch {
      setError('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  if (!currentStoreId) {
    return <div className="p-6 text-center">Selecione uma loja para continuar</div>;
  }

  if (loading) {
    return <div className="p-6 text-center">Carregando...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold flex gap-2 items-center">
          <FolderTree className="w-5 h-5" /> Categorias
        </h1>

        <Link
          to="/admin/categories/new"
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" /> Nova Categoria
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
          <AlertCircle className="text-red-600 w-5 h-5" /> {error}
        </div>
      )}

      <div className="space-y-2">
        {categories.map((category) => (
          <Link
            to={`/admin/categories/${category.id}`}
            key={category.id}
            className="block p-4 bg-white rounded-lg border hover:bg-slate-50"
          >
            <p className="font-medium">{category.name}</p>
            <p className="text-sm text-slate-500">{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
