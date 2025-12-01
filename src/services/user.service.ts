import api from "./api";

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: 'PLATFORM_ADMIN' | 'COMPANY_ADMIN' | 'STORE_MANAGER' | 'DELIVERY_PERSON' | 'CUSTOMER';
  is_active: boolean;
  store_id?: number | null;
  company_id?: number | null; 
}

export interface UserCreate {
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  password: string;
  store_id?: number | null;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  phone?: string;
  role?: string;
  password?: string;
  store_id?: number | null;
}

export interface UserListParams {
  search?: string;
  role?: string;
  store_id?: number | null;
}

const userService = {
  async list(params?: UserListParams): Promise<{ users: User[] }> {
    const res = await api.get("/users/", { params });
    return res.data;
  },

  async getById(id: number): Promise<User> {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  async create(data: UserCreate): Promise<User> {
    const res = await api.post("/users/", data);
    return res.data;
  },

  async update(id: number, data: UserUpdate): Promise<User> {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },

  async deactivate(id: number) {
    await api.post(`/users/${id}/deactivate`);
  },

  async activate(id: number) {
    await api.post(`/users/${id}/activate`);
  },
};

export default userService;
