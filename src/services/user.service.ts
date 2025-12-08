// services/user.service.ts (atualização)
import api from './api';

export interface User {
  id: number;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: string;
  store_id: number | null;
  is_active: boolean;
  created_at: string;
}

export interface UserCreate {
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  role?: string;
  password?: string | null;
  store_id?: number | null;
}

export interface UserUpdate {
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  password?: string | null;
  role?: string | null;
  store_id?: number | null;
  is_active?: boolean | null;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

class UserService {
  async list(params?: {
    skip?: number;
    limit?: number;
    store_id?: number | null;
    role?: string | null;
    search?: string | null;
  }): Promise<UserListResponse> {
    const response = await api.get('/users/', { params });
    return response.data;
  }

  async getById(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }

  async create(data: UserCreate): Promise<User> {
    const response = await api.post('/users/', data);
    return response.data;
  }

  async update(id: number, data: UserUpdate): Promise<User> {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  }

  async deactivate(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  }

  async activate(id: number): Promise<void> {
    await api.post(`/users/${id}/activate`);
  }
}

export default new UserService();