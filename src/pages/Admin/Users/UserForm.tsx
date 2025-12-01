import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import userService, { UserCreate, UserUpdate } from "../../../services/user.service";
import { useAuth } from "../../../contexts/AuthContext";
import { useStore } from "../../../contexts/StoreContext";

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { user } = useAuth();
  const { currentStore } = useStore();

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
    if (isEditing && id) loadUser(parseInt(id));
  }, [id]);

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
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
      setError("Erro ao carregar usuário.");
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
      if (user?.role === "STORE_MANAGER") {
        finalData.store_id = currentStore?.id || null;
      }

      if (isEditing && id) {
        const updateData: UserUpdate = { ...finalData };
        delete (updateData as any).password;
        await userService.update(parseInt(id), updateData);
        toast.success("Usuário atualizado com sucesso!");
      } else {
        await userService.create(finalData);
        toast.success("Usuário criado com sucesso!");
      }

      navigate("/admin/users");
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.detail || "Erro ao salvar usuário";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-16 text-slate-500">Carregando usuário...</div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/users")}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">
            {isEditing ? "Editar Usuário" : "Novo Usuário"}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2 items-center">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">
              {typeof error === "string" ? error : JSON.stringify(error)}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 sm:p-8">
          <div className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium mb-2">Nome completo *</label>
              <input
                type="text"
                value={formData.full_name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                required
                className="w-full border px-4 py-3 rounded-lg focus:border-red-500 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full border px-4 py-3 rounded-lg focus:border-red-500 outline-none"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium mb-2">Telefone</label>
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full border px-4 py-3 rounded-lg focus:border-red-500 outline-none"
              />
            </div>

            {/* Senha (somente na criação) */}
            {!isEditing && (
              <div>
                <label className="block text-sm font-medium mb-2">Senha *</label>
                <input
                  type="password"
                  required
                  value={formData.password || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border px-4 py-3 rounded-lg focus:border-red-500 outline-none"
                />
              </div>
            )}

            {/* Função */}
            <div>
              <label className="block text-sm font-medium mb-2">Função *</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as UserCreate["role"],
                  })
                }
                className="w-full border px-4 py-3 rounded-lg focus:border-red-500 outline-none"
              >
                <option value="PLATFORM_ADMIN">Platform Admin</option>
                <option value="COMPANY_ADMIN">Company Admin</option>
                <option value="STORE_MANAGER">Store Manager</option>
                <option value="DELIVERY_PERSON">Delivery</option>
                <option value="CUSTOMER">Customer</option>
              </select>
            </div>

            {/* Loja (visível apenas para Admins de plataforma) */}
            {user?.role === "PLATFORM_ADMIN" && (
              <div>
                <label className="block text-sm font-medium mb-2">Loja (opcional)</label>
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
                  placeholder="ID da loja"
                  className="w-full border px-4 py-3 rounded-lg focus:border-red-500 outline-none"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="flex-1 border border-slate-200 py-3 rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 rounded-lg hover:scale-105 transition-all"
            >
              {saving ? (
                "Salvando..."
              ) : (
                <>
                  <Save className="inline w-5 h-5 mr-2" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
