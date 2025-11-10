// src/services/user.service.ts
import api from './api';

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: 'PLATFORM_ADMIN' | 'COMPANY_ADMIN' | 'STORE_MANAGER' | 'DELIVERY_PERSON' | 'CUSTOMER';
  is_active: boolean;
  store_id?: number | null;
}

export interface UserCreate {
  email: string;
  full_name: string;
  phone?: string;
  role: User['role'];
  password: string;
  store_id?: number | null;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  phone?: string;
  role?: User['role'];
  password?: string;
  store_id?: number | null;
}

const userService = {
  async list(filters?: { search?: string; role?: string }) {
    const params: any = {};
    if (filters?.search) params.search = filters.search;
    if (filters?.role) params.role = filters.role;

    const { data } = await api.get('/users/', { params });
    return data;
  },

  async getById(id: number): Promise<User> {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  async create(payload: UserCreate): Promise<User> {
    const { data } = await api.post('/users/', payload);
    return data;
  },

  async update(id: number, payload: UserUpdate): Promise<User> {
    const { data } = await api.put(`/users/${id}`, payload);
    return data;
  },

  async deactivate(id: number): Promise<void> {
    await api.patch(`/users/${id}/deactivate`);
  },

  async activate(id: number): Promise<void> {
    await api.patch(`/users/${id}/activate`);
  },
};

export default userService;