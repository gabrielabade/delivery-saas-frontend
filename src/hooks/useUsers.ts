// src/hooks/useUsers.ts
import { useApiFetch } from './useApiFetch';
import userService, { UserListResponse } from '../services/user.service';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';

interface UserFilters {
  search?: string;
  role?: string;
}

export function useUsers(filters?: UserFilters) {
  const { user: currentUser } = useAuth();
  const { currentStoreId } = useStore();

  return useApiFetch<UserListResponse>({
    fetchFn: () => {
      const params: any = {
        limit: 100,
        ...filters
      };

      // Filtrar por loja se for STORE_MANAGER
      if (currentUser?.role === 'STORE_MANAGER' && currentStoreId) {
        params.store_id = currentStoreId;
      }

      console.log('📋 Buscando usuários com params:', params);
      return userService.list(params);
    },
    enabled: true,
    cacheKey: currentStoreId ? `users_${currentStoreId}` : 'users_all',
    dependencies: [currentStoreId, currentUser?.role, filters?.search, filters?.role]
  });
}