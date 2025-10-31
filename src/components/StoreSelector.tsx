import { useState, useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Store, ChevronDown, Check } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  subdomain: string;
}

export default function StoreSelector() {
  const { currentStoreId, setCurrentStoreId, canManageMultipleStores } = useStore();
  const [stores, setStores] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (canManageMultipleStores) {
      loadStores();
    } else {
      setLoading(false);
    }
  }, [canManageMultipleStores]);

  const loadStores = async () => {
    try {
      const response = await api.get<Company[]>('/companies/');
      setStores(response.data);

      // Se não tem loja selecionada e tem lojas disponíveis, seleciona a primeira
      if (!currentStoreId && response.data.length > 0) {
        setCurrentStoreId(response.data[0].id);
      }
    } catch (err) {
      console.error('Erro ao carregar lojas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStore = (storeId: number) => {
    setCurrentStoreId(storeId);
    setIsOpen(false);
  };

  // Se não pode gerenciar múltiplas lojas, não mostra o seletor
  if (!canManageMultipleStores) {
    return null;
  }

  if (loading) {
    return (
      <div className="px-4 py-2 bg-slate-100 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          Carregando lojas...
        </div>
      </div>
    );
  }

  const currentStore = stores.find(s => s.id === currentStoreId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-white border-2 border-slate-200 rounded-lg hover:border-red-300 transition-colors min-w-[200px]"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Store className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-xs text-slate-500">Loja Atual</p>
          <p className="text-sm font-bold text-slate-900 truncate">
            {currentStore?.name || 'Selecione uma loja'}
          </p>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menu */}
          <div className="absolute top-full mt-2 left-0 right-0 bg-white border-2 border-slate-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
            {stores.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-sm">
                Nenhuma loja disponível
              </div>
            ) : (
              stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => handleSelectStore(store.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors ${currentStoreId === store.id ? 'bg-blue-50' : ''
                    }`}
                >
                  <div className="text-left">
                    <p className="font-medium text-slate-900">{store.name}</p>
                    <p className="text-xs text-slate-500">{store.subdomain}</p>
                  </div>
                  {currentStoreId === store.id && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}