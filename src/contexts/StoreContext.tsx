import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface StoreContextData {
  currentStoreId: number | null;
  setCurrentStoreId: (storeId: number) => void;
  canManageMultipleStores: boolean;
}

const StoreContext = createContext<StoreContextData>({} as StoreContextData);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentStoreId, setCurrentStoreIdState] = useState<number | null>(null);

  const canManageMultipleStores =
    user?.role === 'PLATFORM_ADMIN' || user?.role === 'COMPANY_ADMIN';

  useEffect(() => {
    if (!user) {
      setCurrentStoreIdState(null);
      localStorage.removeItem('current_store_id');
      return;
    }

    if (!canManageMultipleStores) {
      setCurrentStoreIdState(user.store_id || null);
      return;
    }

    const savedStoreId = localStorage.getItem('current_store_id');
    if (savedStoreId) {
      setCurrentStoreIdState(parseInt(savedStoreId));
    }

  }, [user, canManageMultipleStores]);

  const setCurrentStoreId = (storeId: number) => {
    setCurrentStoreIdState(storeId);
    localStorage.setItem('current_store_id', storeId.toString());
  };

  return (
    <StoreContext.Provider value={{ currentStoreId, setCurrentStoreId, canManageMultipleStores }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
