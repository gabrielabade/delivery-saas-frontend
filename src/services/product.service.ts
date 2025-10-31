import api from './api';
import { Category } from './category.service';

export interface Product {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  short_description: string | null;
  price: string;
  cost_price: string | null;
  promotional_price: string | null;
  stock: number;
  min_stock: number;
  track_stock: boolean;
  sku: string | null;
  barcode: string | null;
  image_url: string | null;
  sort_order: number;
  is_featured: boolean;
  is_available: boolean;
  category_id: number;
  store_id: number;
  is_active: boolean;
  created_at: string;
  category: Category;
  current_price: string;
}

export interface ProductCreate {
  name: string;
  slug?: string | null;
  description?: string | null;
  short_description?: string | null;
  price: number | string;
  cost_price?: number | string | null;
  promotional_price?: number | string | null;
  stock?: number;
  min_stock?: number;
  track_stock?: boolean;
  sku?: string | null;
  barcode?: string | null;
  image_url?: string | null;
  sort_order?: number;
  is_featured?: boolean;
  is_available?: boolean;
  category_id: number;
}

export interface ProductUpdate {
  name?: string;
  description?: string | null;
  short_description?: string | null;
  price?: number | string;
  cost_price?: number | string | null;
  promotional_price?: number | string | null;
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
  async list(storeId: number, skip = 0, limit = 100): Promise<Product[]> {
    const response = await api.get<Product[]>('/products/admin', {
      params: { store_id: storeId, skip, limit }
    });
    return response.data;
  }

  async getById(productId: number, storeId: number): Promise<Product> {
    const response = await api.get<Product>(`/products/admin/${productId}`, {
      params: { store_id: storeId }
    });
    return response.data;
  }

  async create(storeId: number, data: ProductCreate): Promise<Product> {
    const response = await api.post<Product>('/products', data, {
      params: { store_id: storeId }
    });
    return response.data;
  }

  async update(productId: number, storeId: number, data: ProductUpdate): Promise<Product> {
    const response = await api.put<Product>(`/products/${productId}`, data, {
      params: { store_id: storeId }
    });
    return response.data;
  }

  async delete(productId: number, storeId: number): Promise<void> {
    await api.delete(`/products/${productId}`, {
      params: { store_id: storeId }
    });
  }

  async updateStock(productId: number, storeId: number, stock: number): Promise<Product> {
    const response = await api.patch<Product>(`/products/${productId}/stock`, null, {
      params: { store_id: storeId, stock }
    });
    return response.data;
  }

  async toggleAvailability(productId: number, storeId: number, isAvailable: boolean): Promise<Product> {
    const response = await api.patch<Product>(`/products/${productId}/availability`, null, {
      params: { store_id: storeId, is_available: isAvailable }
    });
    return response.data;
  }
}

export default new ProductService();