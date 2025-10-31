import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, FolderTree, AlertCircle, Search, ArrowLeft } from 'lucide-react';
import categoryService, { Category } from '../../../services/category.service';
import { useStore } from '../../../contexts/StoreContext';

export default function CategoryList() {
  const navigate = useNavigate();
  const { currentStoreId } = useStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentStoreId) loadCategories();
  }, [currentStoreId]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.list(currentStoreId!);
      setCategories(data);
    } catch {
      setError('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await categoryService.delete(id, currentStoreId!);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setDeleteId(null);
    } catch {
      alert('Erro ao deletar categoria');
    }
  };

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!currentStoreId) {
    return <div className="p-6 text-center">Selecione uma loja para ver as categorias</div>;
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="p-6">
      <header className="flex justify-between mb-6">
        <div className="flex gap-3 items-center">
          <button onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft />
          </button>
          <h1 className="text-xl font-bold">Categorias</h1>
        </div>

        <Link to="/admin/categories/new" className="bg-red-500 px-4 py-2 text-white rounded flex items-center gap-2">
          <Plus size={18} /> Nova Categoria
        </Link>
      </header>

      <input
        className="border px-3 py-2 mb-4 w-full"
        placeholder="Buscar categorias..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p>Nenhuma categoria encontrada</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cat) => (
            <div key={cat.id} className="border p-4 rounded-lg bg-white">
              <h2 className="font-bold">{cat.name}</h2>
              <p className="text-sm text-gray-500">{cat.description}</p>

              <div className="flex gap-2 mt-4">
                <Link to={`/admin/categories/edit/${cat.id}`} className="bg-blue-500 text-white px-3 py-1 rounded">
                  <Edit size={18} />
                </Link>

                <button onClick={() => setDeleteId(cat.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded">
            <p>Confirmar exclusão?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setDeleteId(null)}>Cancelar</button>
              <button onClick={() => handleDelete(deleteId)} className="bg-red-500 text-white px-3 py-1 rounded">
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
