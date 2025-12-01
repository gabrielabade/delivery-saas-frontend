import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, Eye, EyeOff, Search } from 'lucide-react';
import productService, { Product } from '../../../services/product.service';
import { useStore } from '../../../contexts/StoreContext';
import AdminLayout from '../../../components/Layout/AdminLayout';

export default function ProductList() {
  const { currentStoreId, currentStore } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentStoreId) loadProducts();
  }, [currentStoreId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.list(currentStoreId!);
      setProducts(data);
    } catch {
      setError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await productService.delete(id, currentStoreId!);
      setProducts(prev => prev.filter(p => p.id !== id));
      setDeleteId(null);
    } catch {
      alert('Erro ao deletar produto');
    }
  };

  const toggleAvailability = async (product: Product) => {
    try {
      const updated = await productService.toggleAvailability(
        product.id,
        currentStoreId!,
        !product.is_available
      );
      setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
    } catch {
      alert('Erro ao alterar disponibilidade');
    }
  };

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout
      title="Produtos"
      subtitle={currentStore ? `Loja: ${currentStore.name}` : 'Selecione uma loja'}
      showBackButton={true}
    >
      {/* Mensagem quando não há loja selecionada */}
      {!currentStoreId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6 text-center">
          <Package className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            Selecione uma loja
          </h3>
          <p className="text-yellow-700">
            Escolha uma loja no seletor acima para ver os produtos
          </p>
        </div>
      )}

      {/* Cabeçalho da página de produtos */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gerenciar Produtos</h2>
          <p className="text-slate-600 mt-1">
            {currentStoreId
              ? `Total de produtos: ${products.length}`
              : 'Selecione uma loja para começar'}
          </p>
        </div>
        {currentStoreId && (
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus size={18} />
            Novo Produto
          </Link>
        )}
      </div>

      {/* Barra de busca e filtros */}
      {currentStoreId && (
        <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar produtos por nome, descrição ou SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-red-500"
            />
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando produtos...</p>
        </div>
      ) : !currentStoreId ? null : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
          </h3>
          <p className="text-slate-500 mb-6">
            {searchTerm
              ? 'Tente ajustar os termos da busca'
              : 'Comece adicionando seu primeiro produto ao cardápio'
            }
          </p>
          {!searchTerm && (
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus size={18} />
              Adicionar Primeiro Produto
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Produto</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Categoria</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Preço</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Estoque</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-900">{product.name}</div>
                          {product.sku && (
                            <div className="text-sm text-slate-500">SKU: {product.sku}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {product.category?.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">
                        R$ {parseFloat(product.current_price).toFixed(2)}
                      </div>
                      {product.promotional_price && (
                        <div className="text-xs text-slate-500 line-through">
                          R$ {parseFloat(product.price).toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-medium ${product.track_stock && product.stock <= product.min_stock
                          ? 'text-orange-600'
                          : 'text-slate-900'
                        }`}>
                        {product.track_stock ? product.stock : 'Não controlado'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleAvailability(product)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${product.is_available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-slate-100 text-slate-800'
                          }`}
                      >
                        {product.is_available ? <Eye size={14} /> : <EyeOff size={14} />}
                        {product.is_available ? 'Disponível' : 'Indisponível'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Confirmar exclusão</h3>
            <p className="text-slate-600 mb-6">
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
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
    </AdminLayout>
  );
}