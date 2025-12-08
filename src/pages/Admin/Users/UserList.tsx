import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, PlusCircle, Edit3, Trash2, RefreshCw, Users as UsersIcon } from "lucide-react";
import userService, { User } from "../../../services/user.service";
import { useAuth } from "../../../contexts/AuthContext";
import { useStore } from "../../../contexts/StoreContext";
import AdminPageWrapper from "../../../components/layouts/AdminPageWrapper";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const { user: currentUser } = useAuth();
  const { currentStoreId, currentStore } = useStore();

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Construir parâmetros baseados no perfil do usuário
      const params: any = {
        limit: 100
      };

      // Se for STORE_MANAGER, força filtro por loja atual
      if (currentUser?.role === "STORE_MANAGER" && currentStoreId) {
        params.store_id = currentStoreId;
      }

      // Se for COMPANY_ADMIN, usar lógica específica (ajuste conforme necessário)
      if (currentUser?.role === "COMPANY_ADMIN" && currentStoreId) {
        params.store_id = currentStoreId;
      }

      // Aplicar filtros adicionais
      if (search) params.search = search;
      if (role) params.role = role;

      console.log("📋 Parâmetros da busca:", params);

      const data = await userService.list(params);
      const userList = data.users || [];
      setUsers(userList);

      // Filtrar localmente para garantir consistência
      let filtered = [...userList];

      if (search) {
        filtered = filtered.filter((u) =>
          u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase()) ||
          u.phone?.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (role) {
        filtered = filtered.filter((u) => u.role === role);
      }

      setFilteredUsers(filtered);

    } catch (error: any) {
      console.error("❌ Erro ao carregar usuários:", error);
      alert(`Erro: ${error.response?.data?.detail || error.message}`);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentStoreId]);

  // Filtragem em tempo real
  useEffect(() => {
    let filtered = [...users];

    if (search) {
      filtered = filtered.filter((u) =>
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (role) {
      filtered = filtered.filter((u) => u.role === role);
    }

    setFilteredUsers(filtered);
  }, [users, search, role]);

  const handleDeactivate = async (id: number) => {
    if (!confirm("Deseja desativar este usuário?")) return;
    try {
      await userService.deactivate(id);
      await loadUsers();
    } catch (error: any) {
      console.error("Erro ao desativar usuário:", error);
      alert(`Erro: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleActivate = async (id: number) => {
    if (!confirm("Deseja reativar este usuário?")) return;
    try {
      await userService.activate(id);
      await loadUsers();
    } catch (error: any) {
      console.error("Erro ao ativar usuário:", error);
      alert(`Erro: ${error.response?.data?.detail || error.message}`);
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'PLATFORM_ADMIN': 'Admin Plataforma',
      'COMPANY_ADMIN': 'Admin Empresa',
      'STORE_MANAGER': 'Gerente Loja',
      'DELIVERY_PERSON': 'Entregador',
      'CUSTOMER': 'Cliente'
    };
    return labels[role] || role;
  };

  return (
    <AdminPageWrapper
      title="Usuários"
      subtitle={currentStore ? `Loja: ${currentStore.name}` : 'Todas as lojas'}
      loading={loading}
      action={
        <button
          onClick={() => navigate("/admin/users/new")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <PlusCircle className="w-4 h-4" />
          Novo Usuário
        </button>
      }
    >
      {/* Filtros */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou telefone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
            />
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
          >
            <option value="">Todos os papéis</option>
            <option value="PLATFORM_ADMIN">Admin Plataforma</option>
            <option value="COMPANY_ADMIN">Admin Empresa</option>
            <option value="STORE_MANAGER">Gerente Loja</option>
            <option value="DELIVERY_PERSON">Entregador</option>
            <option value="CUSTOMER">Cliente</option>
          </select>

          <button
            onClick={loadUsers}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="overflow-x-auto">
        {!loading && filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UsersIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum usuário encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              {search || role ? 'Tente ajustar os filtros de busca' : 'Comece adicionando um novo usuário'}
            </p>
            {!search && !role && (
              <button
                onClick={() => navigate("/admin/users/new")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Criar Primeiro Usuário
              </button>
            )}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loja
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">
                      {user.full_name || '-'}
                    </div>
                    <div className="text-xs text-gray-500">ID: {user.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">
                      {user.email || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user.phone || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${user.role === 'PLATFORM_ADMIN' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'COMPANY_ADMIN' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'STORE_MANAGER' ? 'bg-green-100 text-green-800' :
                            user.role === 'DELIVERY_PERSON' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                      }`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user.store_id || '-'}
                  </td>
                  <td className="px-4 py-3">
                    {user.is_active ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 font-medium">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                        Inativo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {user.is_active ? (
                        <button
                          onClick={() => handleDeactivate(user.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Desativar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(user.id)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Ativar"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer com contador */}
      {!loading && filteredUsers.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Mostrando <span className="font-medium">{filteredUsers.length}</span> de <span className="font-medium">{users.length}</span> usuários
            </p>
            {currentUser?.role === 'STORE_MANAGER' && currentStore && (
              <p className="text-xs text-gray-500">
                Filtrado para: {currentStore.name}
              </p>
            )}
          </div>
        </div>
      )}
    </AdminPageWrapper>
  );
}