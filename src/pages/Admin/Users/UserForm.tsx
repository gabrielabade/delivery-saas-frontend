import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import userService, { UserCreate, UserUpdate } from "../../../services/user.service";
import { useAuth } from "../../../contexts/AuthContext";
import { useStore } from "../../../contexts/StoreContext";
import AdminPageWrapper from "../../../components/layouts/AdminPageWrapper";

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { user: currentUser } = useAuth();
  const { currentStore, currentStoreId } = useStore();

  const [formData, setFormData] = useState<UserCreate>({
    email: "",
    full_name: "",
    phone: "",
    role: "CUSTOMER",
    password: "",
    store_id: null,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing && id) {
      loadUser(parseInt(id));
    } else {
      // Preencher store_id automaticamente se for STORE_MANAGER
      if (currentUser?.role === "STORE_MANAGER" && currentStoreId) {
        setFormData(prev => ({
          ...prev,
          store_id: currentStoreId
        }));
      }
    }
  }, [id, currentStoreId, currentUser?.role]);

  const loadUser = async (userId: number) => {
    try {
      setLoading(true);
      const data = await userService.getById(userId);
      setFormData({
        email: data.email || "",
        full_name: data.full_name || "",
        phone: data.phone || "",
        role: data.role,
        password: "",
        store_id: data.store_id || null,
      });
    } catch (err: any) {
      console.error("Erro ao carregar usuário:", err);
      setError("Erro ao carregar usuário.");
      toast.error("Erro ao carregar usuário.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // 🔒 Se o usuário atual for um gerente, força vincular à loja atual
      const finalData = { ...formData };
      if (currentUser?.role === "STORE_MANAGER" && currentStoreId) {
        finalData.store_id = currentStoreId;
      }

      // Validar dados
      if (!finalData.email && !finalData.phone) {
        throw new Error("Email ou telefone é obrigatório");
      }

      if (!isEditing && !finalData.password) {
        throw new Error("Senha é obrigatória para novos usuários");
      }

      if (isEditing && id) {
        const updateData: UserUpdate = { ...finalData };
        // Não enviar password vazio na atualização
        if (!updateData.password) {
          delete updateData.password;
        }
        await userService.update(parseInt(id), updateData);
        toast.success("Usuário atualizado com sucesso!");
      } else {
        await userService.create(finalData);
        toast.success("Usuário criado com sucesso!");
      }

      navigate("/admin/users");
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.detail || err.message || "Erro ao salvar usuário";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const getRoleOptions = () => {
    const roles = [
      { value: "CUSTOMER", label: "Cliente" },
      { value: "DELIVERY_PERSON", label: "Entregador" },
      { value: "STORE_MANAGER", label: "Gerente Loja" },
      { value: "COMPANY_ADMIN", label: "Admin Empresa" },
      { value: "PLATFORM_ADMIN", label: "Admin Plataforma" },
    ];

    // Filtrar roles baseado no usuário atual
    if (currentUser?.role === "STORE_MANAGER") {
      return roles.filter(r =>
        r.value === "CUSTOMER" ||
        r.value === "DELIVERY_PERSON" ||
        r.value === "STORE_MANAGER"
      );
    }

    if (currentUser?.role === "COMPANY_ADMIN") {
      return roles.filter(r => r.value !== "PLATFORM_ADMIN");
    }

    return roles;
  };

  return (
    <AdminPageWrapper
      title={isEditing ? "Editar Usuário" : "Novo Usuário"}
      subtitle={currentStore ? `Loja: ${currentStore.name}` : ''}
      loading={loading}
      action={
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      }
    >
      <div className="p-4 sm:p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2 items-start">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome completo *
              </label>
              <input
                type="text"
                value={formData.full_name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="Digite o nome completo"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="usuario@exemplo.com"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="(11) 99999-9999"
              />
            </div>

            {/* Senha (somente na criação) */}
            {!isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  placeholder="••••••••"
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 6 caracteres
                </p>
              </div>
            )}

            {/* Função */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Função *
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as UserCreate["role"],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              >
                {getRoleOptions().map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Loja (visível apenas para Admins de plataforma e Company) */}
            {(currentUser?.role === "PLATFORM_ADMIN" || currentUser?.role === "COMPANY_ADMIN") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loja
                </label>
                <input
                  type="number"
                  value={formData.store_id ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      store_id: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                  placeholder="ID da loja (opcional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Deixe em branco para usuário sem loja específica
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium"
            >
              <Save className="w-4 h-4" />
              {saving ? "Salvando..." : (isEditing ? "Atualizar" : "Criar Usuário")}
            </button>
          </div>
        </form>
      </div>
    </AdminPageWrapper>
  );
}