// src/hooks/useCategories.ts
import { useApiList } from './useApiFetch';
import categoryService from '../services/category.service';

export function useCategories(storeId: number | null) {
  return useApiList(
    () => {
      if (!storeId) return Promise.resolve([]);
      return categoryService.list(storeId);
    },
    {
      enabled: !!storeId,
      cacheKey: storeId ? `categories_${storeId}` : undefined,
      cacheTime: 60000, // 1 minuto
      dependencies: [storeId]
    }
  );
}