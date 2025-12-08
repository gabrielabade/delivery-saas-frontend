// src/hooks/useProducts.ts
import { useApiList } from './useApiFetch';
import productService from '../services/product.service';

interface ProductFilters {
  categoryId?: number | null;
  onlyAvailable?: boolean;
  search?: string;
}

export function useProducts(storeId: number | null, filters?: ProductFilters) {
  return useApiList(
    () => {
      if (!storeId) return Promise.resolve([]);

      // Chama o método correto do service
      return productService.list(storeId, {
        category_id: filters?.categoryId,
        only_available: filters?.onlyAvailable,
        search: filters?.search
      });
    },
    {
      enabled: !!storeId,
      cacheKey: storeId ? `products_${storeId}_${filters?.categoryId || 'all'}` : undefined,
      dependencies: [storeId, filters?.categoryId, filters?.search]
    }
  );
}