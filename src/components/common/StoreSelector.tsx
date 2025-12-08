import { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { useAuth } from '../../contexts/AuthContext';
import { Store, ChevronDown, Check } from 'lucide-react';

export default function StoreSelector() {
  const { stores, currentStore, setCurrentStore, canManageMultipleStores } = useStore();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!canManageMultipleStores || stores.length <= 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200">
        <Store size={16} className="text-orange-600 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-orange-700 truncate">
            {currentStore?.name || 'Loja atual'}
          </p>
          <p className="text-xs text-orange-500 truncate">
            {user?.role?.toLowerCase().replace('_', ' ') || 'usuário'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 bg-white border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        aria-label="Selecionar loja"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Store className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-xs text-orange-600 font-medium truncate">Loja Atual</p>
          <p className="text-sm font-bold text-gray-900 truncate">
            {currentStore?.name || 'Selecione'}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-orange-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border-2 border-orange-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
            <div className="p-2 border-b border-orange-50 bg-orange-50">
              <p className="text-xs font-medium text-orange-700">Selecione uma loja</p>
              <p className="text-xs text-orange-600">{stores.length} lojas disponíveis</p>
            </div>

            <div className="py-1">
              {stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => {
                    setCurrentStore(store);
                    setIsOpen(false);
                    window.location.reload();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 hover:bg-orange-50 transition-colors text-left focus:outline-none focus:bg-orange-50 ${currentStore?.id === store.id ? 'bg-orange-50' : ''
                    }`}
                  aria-label={`Selecionar loja ${store.name}`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{store.name}</p>
                    <p className="text-xs text-gray-500 truncate">{store.email}</p>
                  </div>
                  {currentStore?.id === store.id && (
                    <Check className="w-4 h-4 text-orange-600 flex-shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-2 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500">
                Ao mudar de loja, todos os dados serão atualizados
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}