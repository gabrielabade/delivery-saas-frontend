// src/services/product.service.ts
import api from './api';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  category_id: number;
  store_id: number;
  sku?: string;
  image_url?: string;
  stock: number;
  track_stock: boolean;
  min_stock: number;
  is_available: boolean;
  is_active: boolean;
  created_at: string;
  category?: {
    id: number;
    name: string;
  };
}

export interface ProductCreate {
  name: string;
  description?: string | null;
  short_description?: string | null;
  price: number;
  cost_price?: number | null;
  promotional_price?: number | null;
  stock: number;
  min_stock: number;
  track_stock: boolean;
  sku?: string | null;
  barcode?: string | null;
  image_url?: string | null;
  sort_order: number;
  is_featured: boolean;
  is_available: boolean;
  category_id: number;
}

export interface ProductUpdate {
  name?: string;
  description?: string | null;
  short_description?: string | null;
  price?: number;
  cost_price?: number | null;
  promotional_price?: number | null;
  stock?: number;
  min_stock?: number;
  track_stock?: boolean;
  sku?: string | null;
  barcode?: string | null;
  image_url?: string | null;
  sort_order?: number;
  is_featured?: boolean;
  is_available?: boolean;
  category_id?: number;
}

class ProductService {
  async list(
    storeId: number,
    filters?: {
      category_id?: number | null;
      only_available?: boolean;
      search?: string;
      skip?: number;
      limit?: number;
    }
  ): Promise<Product[]> {
    const response = await api.get('/products/admin', {
      params: {
        store_id: storeId,
        ...filters,
        limit: filters?.limit || 100
      }
    });
    return response.data;
  }

  async getById(id: number, storeId: number): Promise<Product> {
    const response = await api.get(`/products/admin/${id}`, {
      params: { store_id: storeId }
    });
    return response.data;
  }

  async create(storeId: number, data: ProductCreate): Promise<Product> {
    const response = await api.post('/products/', {
      ...data,
      store_id: storeId
    }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async update(id: number, storeId: number, data: ProductUpdate): Promise<Product> {
    const response = await api.put(`/products/${id}`, {
      ...data,
      store_id: storeId
    }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async delete(id: number, storeId: number): Promise<void> {
    await api.delete(`/products/${id}`, {
      params: { store_id: storeId }
    });
  }

  async toggleAvailability(id: number, storeId: number, isAvailable: boolean): Promise<Product> {
    const response = await api.patch(`/products/${id}/availability`, null, {
      params: {
        is_available: isAvailable,
        store_id: storeId
      }
    });
    return response.data;
  }

  async updateStock(id: number, storeId: number, stock: number): Promise<Product> {
    const response = await api.patch(`/products/${id}/stock`, null, {
      params: {
        stock,
        store_id: storeId
      }
    });
    return response.data;
  }
}

export default new ProductService();