import api from './api';

export interface Category {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  store_id: number;
  is_active: boolean;
  created_at: string;
}

export interface CategoryCreate {
  name: string;
  slug?: string | null;
  description?: string | null;
  image_url?: string | null;
  sort_order?: number;
}

export interface CategoryUpdate {
  name?: string | null;
  description?: string | null;
  image_url?: string | null;
  sort_order?: number | null;
}

class CategoryService {
  async list(storeId: number, skip = 0, limit = 100): Promise<Category[]> {
    const response = await api.get<Category[]>('/products/categories/admin', {
      params: { store_id: storeId, skip, limit }
    });
    return response.data;
  }

  async getById(categoryId: number, storeId: number): Promise<Category> {
    const response = await api.get<Category>(`/products/categories/admin/${categoryId}`, {
      params: { store_id: storeId }
    });
    return response.data;
  }

  async create(storeId: number, data: CategoryCreate): Promise<Category> {
    const response = await api.post<Category>('/products/categories', data, {
      params: { store_id: storeId }
    });
    return response.data;
  }

  async update(categoryId: number, storeId: number, data: CategoryUpdate): Promise<Category> {
    const response = await api.put<Category>(`/products/categories/${categoryId}`, data, {
      params: { store_id: storeId }
    });
    return response.data;
  }

  async delete(categoryId: number, storeId: number): Promise<void> {
    await api.delete(`/products/categories/${categoryId}`, {
      params: { store_id: storeId }
    });
  }
}

export default new CategoryService();