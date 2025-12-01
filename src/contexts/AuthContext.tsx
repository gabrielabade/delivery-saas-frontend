import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User } from '../services/auth.service';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log('🔄 AuthProvider: Iniciando carregamento do usuário...');

    const loadUser = async () => {
      try {
        const token = authService.getToken();
        console.log('🔑 Token no localStorage:', token ? 'Sim' : 'Não');

        if (token) {
          console.log('🔄 Buscando dados do usuário da API...');
          try {
            const userData = await authService.getCurrentUser();
            console.log('✅ Usuário carregado:', userData);
            setUser(userData);
          } catch (apiError: any) { // ADICIONE ': any' aqui
            console.error('❌ Erro ao buscar usuário da API:', apiError);

            // Use optional chaining para segurança
            if (apiError?.response?.status === 401) {
              console.warn('⚠️ Token inválido, limpando...');
              authService.logout();
            }

            const storedUser = authService.getStoredUser();
            if (storedUser) {
              console.warn('⚠️ Usando usuário do localStorage (cache):', storedUser);
              setUser(storedUser);
            }
          }
        } else {
          console.log('ℹ️ Nenhum token encontrado');
        }
      } catch (error) {
        console.error('💥 Erro inesperado no AuthProvider:', error);
      } finally {
        console.log('🏁 AuthProvider: Carregamento finalizado');
        setLoading(false);
        setInitialized(true);
      }
    };

    loadUser();
  }, []);

  const signIn = async (username: string, password: string) => {
    console.log('🔐 Iniciando login...');
    try {
      setLoading(true);
      await authService.login({ username, password });
      const userData = await authService.getCurrentUser();
      console.log('✅ Login bem-sucedido:', userData);
      setUser(userData);
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    console.log('🚪 Realizando logout...');
    authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    console.log('🔄 Atualizando dados do usuário...');
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      console.log('✅ Usuário atualizado:', userData);
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}