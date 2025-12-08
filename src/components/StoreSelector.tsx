import { useState, useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Store, ChevronDown, Check } from 'lucide-react';

interface StoreType {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
}

export default function StoreSelector() {
  const { stores, currentStore, setCurrentStore, canManageMultipleStores } = useStore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Se não pode gerenciar múltiplas lojas ou só tem uma, mostra apenas o nome
  if (!canManageMultipleStores || stores.length <= 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg">
        <Store size={16} className="text-orange-600" />
        <div>
          <p className="text-sm font-medium text-orange-700">
            {currentStore?.name || 'Loja atual'}
          </p>
          {user?.role && (
            <p className="text-xs text-orange-500 capitalize">
              {user.role.toLowerCase().replace('_', ' ')}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-4 py-2 bg-slate-100 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-white border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors min-w-[220px]"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Store className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-xs text-orange-600 font-medium">Loja Selecionada</p>
          <p className="text-sm font-bold text-slate-900 truncate">
            {currentStore?.name || 'Selecione uma loja'}
          </p>
        </div>
        <ChevronDown className={`w-5 h-5 text-orange-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-full mt-2 left-0 right-0 bg-white border-2 border-orange-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
            <div className="p-3 border-b border-orange-50 bg-orange-50">
              <p className="text-xs font-medium text-orange-700">Selecione uma loja</p>
              <p className="text-xs text-orange-600">Total: {stores.length} lojas</p>
            </div>

            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => {
                  setCurrentStore(store);
                  setIsOpen(false);
                  // Recarregar a página para atualizar dados
                  window.location.reload();
                }}
                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-orange-50 transition-colors ${currentStore?.id === store.id ? 'bg-orange-50 border-l-4 border-orange-500' : ''
                  }`}
              >
                <div className="text-left flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{store.name}</p>
                  <p className="text-xs text-slate-500 truncate">{store.email}</p>
                </div>
                {currentStore?.id === store.id && (
                  <Check className="w-5 h-5 text-orange-600 flex-shrink-0" />
                )}
              </button>
            ))}

            <div className="p-3 border-t border-orange-50 bg-slate-50">
              <p className="text-xs text-slate-600">
                Ao mudar de loja, todos os dados listados serão atualizados
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}