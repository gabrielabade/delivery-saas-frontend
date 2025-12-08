import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, PlusCircle, Edit3, Trash2, RefreshCw } from "lucide-react";
import userService, { User } from "../../../services/user.service";
import { useAuth } from "../../../contexts/AuthContext";
import { useStore } from "../../../contexts/StoreContext";
import AdminLayout from "../../../components/Layout/AdminLayout"; 

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const { user: currentUser } = useAuth(); // Renomeei para currentUser para evitar confusão
  const { currentStoreId, currentStore } = useStore(); // ADICIONE currentStore

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.list();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = [...users];

    if (search) {
      filtered = filtered.filter((u) =>
        u.full_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (role) {
      filtered = filtered.filter((u) => u.role === role);
    }

    // REMOVA estas linhas se não existir company_id no User:
    // if (user?.role === "COMPANY_ADMIN" && user.company_id) {
    //   filtered = filtered.filter((u) => u.company_id === user.company_id);
    // }

    if (currentUser?.role === "STORE_MANAGER" && currentStoreId) {
      filtered = filtered.filter((u) => u.store_id === currentStoreId);
    }

    setFilteredUsers(filtered);
  }, [users, search, role, currentUser, currentStoreId]);

  const handleDeactivate = async (id: number) => {
    if (!confirm("Deseja desativar este usuário?")) return;
    await userService.deactivate(id);
    await loadUsers();
  };

  const handleActivate = async (id: number) => {
    if (!confirm("Deseja reativar este usuário?")) return;
    await userService.activate(id);
    await loadUsers();
  };

  return (
    <AdminLayout
      title="Usuários"
      subtitle={currentStore ? `Loja: ${currentStore.name}` : 'Todas as lojas'}
      showBackButton={true}
    >
      {/* Cabeçalho da página */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gerenciar Usuários</h2>
          <p className="text-slate-600 mt-1">
            {currentStoreId
              ? `Usuários da loja: ${filteredUsers.length}`
              : `Total de usuários: ${filteredUsers.length}`}
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/users/new")}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg hover:scale-105 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Novo Usuário
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar usuário..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:border-red-500 outline-none"
            />
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:border-red-500 outline-none"
          >
            <option value="">Todos os papéis</option>
            <option value="PLATFORM_ADMIN">Platform Admin</option>
            <option value="COMPANY_ADMIN">Company Admin</option>
            <option value="STORE_MANAGER">Store Manager</option>
            <option value="DELIVERY_PERSON">Delivery</option>
            <option value="CUSTOMER">Customer</option>
          </select>

          <button
            onClick={loadUsers}
            className="flex items-center gap-2 px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-16 text-slate-500">
            Carregando usuários...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            Nenhum usuário encontrado
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="py-3 px-4 text-left">Nome</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Função</th>
                  <th className="py-3 px-4 text-left">Loja</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-slate-50">
                    <td className="py-3 px-4">{user.full_name || "-"}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.role}</td>
                    <td className="py-3 px-4">{user.store_id || "-"}</td>
                    <td className="py-3 px-4 text-center">
                      {user.is_active ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                          Ativo
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                          Inativo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-slate-600" />
                      </button>
                      {user.is_active ? (
                        <button
                          onClick={() => handleDeactivate(user.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(user.id)}
                          className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          <RefreshCw className="w-4 h-4 text-green-600" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}