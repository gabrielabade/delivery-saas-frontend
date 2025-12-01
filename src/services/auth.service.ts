import api from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  role: 'PLATFORM_ADMIN' | 'COMPANY_ADMIN' | 'STORE_MANAGER' | 'DELIVERY_PERSON' | 'CUSTOMER';
  store_id: number | null;
  is_active: boolean;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    // ⚠️ IMPORTANTE: Use caminho RELATIVO (sem /api no início)
    const response = await api.post<LoginResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    }

    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    // ⚠️ IMPORTANTE: Use caminho RELATIVO
    const response = await api.get<User>('/auth/me');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();