import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface Store {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
}

interface StoreContextData {
  stores: Store[];
  currentStore: Store | null;
  currentStoreId: number | null;
  setCurrentStore: (store: Store | null) => void;
  setCurrentStoreId: (id: number | null) => void;
  canManageMultipleStores: boolean;
  loading: boolean;
  refreshStores: () => Promise<void>;
}

const StoreContext = createContext<StoreContextData>({} as StoreContextData);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stores, setStores] = useState<Store[]>([]);
  const [currentStore, setCurrentStoreState] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Verificar se usuário pode gerenciar múltiplas lojas
  const canManageMultipleStores = user?.role === 'PLATFORM_ADMIN' || user?.role === 'COMPANY_ADMIN';

  useEffect(() => {
    loadStores();
  }, [user]);

  const loadStores = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stores/');
      const storesData = response.data;

      setStores(storesData);

      // Se o usuário tem uma store associada no perfil, usa ela
      if (user?.store_id) {
        const userStore = storesData.find((store: Store) => store.id === user.store_id);
        if (userStore) {
          setCurrentStoreState(userStore);
          localStorage.setItem('currentStoreId', userStore.id.toString());
          return;
        }
      }

      // Tentar recuperar do localStorage
      const storedStoreId = localStorage.getItem('currentStoreId');
      if (storedStoreId) {
        const storedStore = storesData.find((store: Store) => store.id === parseInt(storedStoreId));
        if (storedStore) {
          setCurrentStoreState(storedStore);
          return;
        }
      }

      // Se não tem store selecionada e tem lojas, seleciona a primeira
      if (storesData.length > 0) {
        setCurrentStoreState(storesData[0]);
        localStorage.setItem('currentStoreId', storesData[0].id.toString());
      }

    } catch (error) {
      console.error('Erro ao carregar lojas:', error);
    } finally {
      setLoading(false);
    }
  };

  const setCurrentStore = (store: Store | null) => {
    setCurrentStoreState(store);
    if (store) {
      localStorage.setItem('currentStoreId', store.id.toString());
    } else {
      localStorage.removeItem('currentStoreId');
    }
  };

  const setCurrentStoreId = (id: number | null) => {
    if (id === null) {
      setCurrentStoreState(null);
      localStorage.removeItem('currentStoreId');
    } else {
      const store = stores.find(s => s.id === id);
      if (store) {
        setCurrentStoreState(store);
        localStorage.setItem('currentStoreId', id.toString());
      }
    }
  };

  const refreshStores = async () => {
    await loadStores();
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        currentStore,
        currentStoreId: currentStore?.id || null,
        setCurrentStore,
        setCurrentStoreId,
        canManageMultipleStores,
        loading,
        refreshStores,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore deve ser usado dentro de StoreProvider');
  }
  return context;
}