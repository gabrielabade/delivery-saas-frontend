import api from './api';

export interface Store {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  is_open: boolean;
  delivery_enabled: boolean;
  pickup_enabled: boolean;
  is_active: boolean;
  created_at: string;
}

export interface StoreCreate {
  name: string;
  slug: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  is_open?: boolean;
  delivery_enabled?: boolean;
  pickup_enabled?: boolean;
}

export interface StoreUpdate {
  name?: string;
  slug?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  is_open?: boolean;
  delivery_enabled?: boolean;
  pickup_enabled?: boolean;
  is_active?: boolean;
}

const storeService = {
  // Listar todas as stores
  list: async (): Promise<Store[]> => {
    const response = await api.get('/stores/');
    return response.data;
  },

  // Buscar store por ID
  getById: async (id: number): Promise<Store> => {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },

  // Buscar store por slug (pública)
  getBySlug: async (slug: string): Promise<Store> => {
    const response = await api.get(`/stores/slug/${slug}`);
    return response.data;
  },

  // Criar store
  create: async (storeData: StoreCreate): Promise<Store> => {
    const response = await api.post('/stores/', storeData);
    return response.data;
  },

  // Atualizar store
  update: async (id: number, storeData: StoreUpdate): Promise<Store> => {
    const response = await api.patch(`/stores/${id}`, storeData);
    return response.data;
  },

  // Deletar store (soft delete)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/stores/${id}`);
  },
};

export default storeService;