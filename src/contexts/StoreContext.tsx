import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Store {
  id: number;
  name: string;
  subdomain: string;
}

interface StoreContextData {
  currentStoreId: number | null;
  currentStore: Store | null;
  setCurrentStoreId: (storeId: number) => void;
  setCurrentStore: (store: Store | null) => void;
  canManageMultipleStores: boolean;
}

const StoreContext = createContext<StoreContextData>({} as StoreContextData);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentStoreId, setCurrentStoreIdState] = useState<number | null>(null);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);

  const canManageMultipleStores =
    user?.role === 'PLATFORM_ADMIN' || user?.role === 'COMPANY_ADMIN';

  useEffect(() => {
    if (!user) {
      setCurrentStoreIdState(null);
      setCurrentStore(null);
      localStorage.removeItem('current_store_id');
      return;
    }

    if (!canManageMultipleStores) {
      if (user.store_id) {
        setCurrentStoreIdState(user.store_id);
        setCurrentStore({
          id: user.store_id,
          name: `Loja ${user.store_id}`,
          subdomain: `loja-${user.store_id}`,
        });
      }
      return;
    }

    const savedStoreId = localStorage.getItem('current_store_id');
    if (savedStoreId) {
      const storeId = parseInt(savedStoreId);
      setCurrentStoreIdState(storeId);
      setCurrentStore({
        id: storeId,
        name: `Loja ${storeId}`,
        subdomain: `loja-${storeId}`,
      });
    }
  }, [user, canManageMultipleStores]);

  const setCurrentStoreId = (storeId: number) => {
    setCurrentStoreIdState(storeId);
    localStorage.setItem('current_store_id', storeId.toString());

    // Atualiza currentStore também
    setCurrentStore({
      id: storeId,
      name: `Loja ${storeId}`,
      subdomain: `loja-${storeId}`,
    });
  };

  return (
    <StoreContext.Provider value={{
      currentStoreId,
      currentStore,
      setCurrentStoreId,
      setCurrentStore,
      canManageMultipleStores
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}