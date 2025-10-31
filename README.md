# 🍔 ClickFome - Sistema Multi-Tenant de Delivery

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4)

Sistema SaaS completo para gerenciamento de delivery, permitindo que múltiplas lanchonetes/restaurantes operem de forma independente na mesma plataforma.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Funcionalidades Implementadas](#-funcionalidades-implementadas)
- [Sistema de Permissões](#-sistema-de-permissões)
- [Contextos Globais](#-contextos-globais)
- [Serviços de API](#-serviços-de-api)
- [Rotas da Aplicação](#-rotas-da-aplicação)
- [Próximos Passos](#-próximos-passos)
- [Como Contribuir](#-como-contribuir)

---

## 🎯 Visão Geral

O **ClickFome** é uma plataforma SaaS multi-tenant que permite que restaurantes e lanchonetes criem suas próprias lojas de delivery online sem pagar comissões por pedido (diferente do iFood que cobra 27%).

### **Modelo de Negócio:**
- Mensalidade fixa (R$ 97 a R$ 397/mês)
- Sem taxas por pedido
- White-label (cada loja tem sua identidade visual)
- Subdomínios personalizados

### **Público-Alvo:**
- Pequenos e médios restaurantes
- Lanchonetes
- Food trucks
- Estabelecimentos que querem independência de marketplaces

---

## 🏗️ Arquitetura
```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Landing   │  │    Admin     │  │  Storefront   │  │
│  │   (Público) │  │  (Protegido) │  │   (Público)   │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (FastAPI/Python)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Auth    │  │ Products │  │  Orders  │  │  Users  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│               DATABASE (PostgreSQL)                      │
│        Multi-tenant com store_id em todas tabelas        │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologias

### **Frontend:**
- **React 18.3** - Biblioteca UI
- **TypeScript 5.6** - Tipagem estática
- **Vite 5.4** - Build tool ultrarrápido
- **React Router DOM 6** - Navegação SPA
- **TailwindCSS 3.4** - Estilização utility-first
- **Axios** - Cliente HTTP
- **TanStack Query** - Gerenciamento de estado servidor
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Lucide React** - Ícones modernos

### **Backend (Python/FastAPI):**
- **FastAPI** - Framework web assíncrono
- **SQLAlchemy** - ORM
- **PostgreSQL** - Banco de dados
- **OAuth2 + JWT** - Autenticação

### **DevOps (Planejado):**
- **Vercel** - Deploy frontend
- **Railway/Render** - Deploy backend
- **Cloudflare** - DNS e CDN

---

## 📁 Estrutura do Projeto
```
clickfome/
├── public/                    # Arquivos estáticos
├── src/
│   ├── assets/               # Imagens, logos
│   ├── components/           # Componentes reutilizáveis
│   │   ├── ProtectedRoute.tsx   # Proteção de rotas
│   │   └── StoreSelector.tsx    # Seletor de loja (multi-tenant)
│   ├── contexts/             # Contextos React
│   │   ├── AuthContext.tsx      # Estado de autenticação
│   │   └── StoreContext.tsx     # Estado de loja atual
│   ├── pages/                # Páginas da aplicação
│   │   ├── Landing.tsx          # Landing page pública
│   │   ├── Auth/
│   │   │   ├── Login.tsx        # Tela de login
│   │   │   └── Register.tsx     # Registro (planejado)
│   │   └── Admin/
│   │       ├── Dashboard.tsx    # Dashboard principal
│   │       └── Categories/
│   │           ├── CategoryList.tsx    # Lista de categorias
│   │           └── CategoryForm.tsx    # Criar/editar categoria
│   ├── services/             # Serviços de API
│   │   ├── api.ts               # Configuração Axios
│   │   ├── auth.service.ts      # Serviços de autenticação
│   │   └── category.service.ts  # Serviços de categorias
│   ├── App.tsx               # Componente raiz + rotas
│   ├── main.tsx              # Entry point
│   └── index.css             # Estilos globais (Tailwind)
├── .gitignore
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md                 # Este arquivo
```

---

## 🚀 Instalação

### **Pré-requisitos:**
- Node.js 18+ ([Download](https://nodejs.org/))
- npm ou yarn
- Git

### **Passo a Passo:**

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd delivery-saas-frontend/clickfome
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz:
```env
VITE_API_URL=http://localhost:8000
```

4. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

5. **Acesse no navegador:**
```
http://localhost:3001
```

---

## ✅ Funcionalidades Implementadas

### **🌐 Landing Page**
- [x] Design moderno e responsivo
- [x] Hero section com CTAs
- [x] Seção de benefícios (6 cards)
- [x] Como funciona (4 passos)
- [x] Planos e preços (3 opções)
- [x] Depoimentos de clientes
- [x] FAQ (6 perguntas)
- [x] Footer completo
- [x] Menu mobile responsivo
- [x] Gradientes e animações modernas

**Tecnologias:** TailwindCSS, Mobile-first, SEO otimizado

---

### **🔐 Sistema de Autenticação**
- [x] Tela de login profissional
- [x] Validação de formulários
- [x] Integração com backend (OAuth2)
- [x] Armazenamento de token (localStorage)
- [x] Refresh automático de token
- [x] Proteção de rotas por role
- [x] Logout com limpeza de sessão
- [x] Feedback visual (loading, erros)

**Arquivos principais:**
- `src/services/auth.service.ts` - Lógica de autenticação
- `src/contexts/AuthContext.tsx` - Estado global do usuário
- `src/pages/Auth/Login.tsx` - Interface de login
- `src/components/ProtectedRoute.tsx` - HOC de proteção

---

### **🏪 Sistema Multi-Tenant**
- [x] Context de loja atual (StoreContext)
- [x] Seletor de loja para PLATFORM_ADMIN
- [x] Isolamento de dados por loja
- [x] Persistência de loja selecionada (localStorage)
- [x] Suporte a múltiplas lojas por usuário

**Arquivos principais:**
- `src/contexts/StoreContext.tsx` - Gerenciamento de loja atual
- `src/components/StoreSelector.tsx` - Componente de seleção

**Como funciona:**
```typescript
// PLATFORM_ADMIN e COMPANY_ADMIN podem selecionar lojas
// STORE_MANAGER, DELIVERY_PERSON, CUSTOMER têm store_id fixo

const { currentStoreId, setCurrentStoreId } = useStore();
```

---

### **📂 CRUD de Categorias**
- [x] Listagem de categorias (grid responsivo)
- [x] Criar categoria
- [x] Editar categoria
- [x] Deletar categoria (soft delete)
- [x] Busca por nome/descrição
- [x] Ordenação personalizável (sort_order)
- [x] Upload de imagem por URL
- [x] Validações de formulário
- [x] Feedback visual (loading, sucesso, erro)
- [x] Modal de confirmação de exclusão

**Endpoints consumidos:**
```
GET    /products/categories/admin?store_id={id}    # Listar
POST   /products/categories?store_id={id}          # Criar
GET    /products/categories/admin/{id}?store_id={} # Buscar
PUT    /products/categories/{id}?store_id={}       # Atualizar
DELETE /products/categories/{id}?store_id={}       # Deletar
```

**Arquivos principais:**
- `src/services/category.service.ts` - Comunicação com API
- `src/pages/Admin/Categories/CategoryList.tsx` - Listagem
- `src/pages/Admin/Categories/CategoryForm.tsx` - Formulário

---

### **📊 Dashboard Admin**
- [x] Cards de navegação (Produtos, Categorias, Usuários)
- [x] Informações do usuário logado
- [x] Seletor de loja (para admins)
- [x] Botão de logout
- [x] Design responsivo

**Próximas melhorias:**
- [ ] Métricas em tempo real (vendas, pedidos)
- [ ] Gráficos de desempenho
- [ ] Alertas de estoque baixo
- [ ] Últimos pedidos

---

## 🔐 Sistema de Permissões

### **Hierarquia de Roles:**

| Role | Descrição | Permissões | store_id |
|------|-----------|------------|----------|
| **PLATFORM_ADMIN** | Super administrador da plataforma | • Gerenciar todas as lojas<br>• Criar/editar empresas<br>• Acesso total ao sistema | null (seleciona) |
| **COMPANY_ADMIN** | Administrador de empresa | • Gerenciar lojas da empresa<br>• Criar usuários<br>• Gerenciar produtos/categorias | null (múltiplas lojas) |
| **STORE_MANAGER** | Gerente de loja | • Gerenciar pedidos<br>• Gerenciar estoque<br>• Ver relatórios | fixo (1 loja) |
| **DELIVERY_PERSON** | Entregador | • Ver pedidos atribuídos<br>• Atualizar status de entrega | fixo (1 loja) |
| **CUSTOMER** | Cliente | • Fazer pedidos<br>• Ver histórico | fixo (1 loja) |

### **Exemplo de Uso:**
```typescript
// Proteger rota apenas para admins
<ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'COMPANY_ADMIN']}>
  <CategoryList />
</ProtectedRoute>

// Verificar permissão manualmente
const { user } = useAuth();
if (user.role === 'PLATFORM_ADMIN') {
  // Mostrar opções avançadas
}
```

---

## 🌍 Contextos Globais

### **1. AuthContext**

Gerencia o estado de autenticação do usuário.
```typescript
import { useAuth } from './contexts/AuthContext';

const { user, loading, signIn, signOut, isAuthenticated } = useAuth();

// Fazer login
await signIn('email@example.com', 'senha123');

// Fazer logout
signOut();

// Verificar se está autenticado
if (isAuthenticated) {
  console.log('Usuário logado:', user.email);
}
```

**Dados disponíveis:**
```typescript
interface User {
  id: number;
  email: string;
  full_name: string | null;
  role: UserRole;
  store_id: number | null;
  is_active: boolean;
  created_at: string;
}
```

---

### **2. StoreContext**

Gerencia a loja atual sendo administrada (multi-tenant).
```typescript
import { useStore } from './contexts/StoreContext';

const { currentStoreId, setCurrentStoreId, canManageMultipleStores } = useStore();

// Trocar de loja (apenas PLATFORM_ADMIN ou COMPANY_ADMIN)
setCurrentStoreId(2);

// Usar em requisições
const products = await productService.list(currentStoreId);
```

**Como funciona:**
- PLATFORM_ADMIN/COMPANY_ADMIN: Podem selecionar qualquer loja
- Outros usuários: `currentStoreId` é igual ao `user.store_id`
- Persiste no localStorage

---

## 🔌 Serviços de API

Todos os serviços usam `axios` com interceptors configurados.

### **Configuração Base (api.ts):**
```typescript
const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Adiciona token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Trata erro 401 (token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### **Serviços Implementados:**

#### **auth.service.ts**
```typescript
class AuthService {
  login(credentials)      // POST /auth/login
  getCurrentUser()        // GET /auth/me
  logout()                // Limpa localStorage
  getToken()              // Retorna token atual
  isAuthenticated()       // Verifica se tem token
}
```

#### **category.service.ts**
```typescript
class CategoryService {
  list(storeId)           // GET /products/categories/admin
  getById(id, storeId)    // GET /products/categories/admin/{id}
  create(storeId, data)   // POST /products/categories
  update(id, storeId, data) // PUT /products/categories/{id}
  delete(id, storeId)     // DELETE /products/categories/{id}
}
```

---

## 🛣️ Rotas da Aplicação

### **Rotas Públicas:**
| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | Landing | Landing page de marketing |
| `/login` | Login | Tela de autenticação |

### **Rotas Protegidas (Admin):**
| Rota | Componente | Roles Permitidos | Descrição |
|------|------------|------------------|-----------|
| `/admin/dashboard` | Dashboard | PLATFORM_ADMIN<br>COMPANY_ADMIN<br>STORE_MANAGER | Dashboard principal |
| `/admin/categories` | CategoryList | PLATFORM_ADMIN<br>COMPANY_ADMIN<br>STORE_MANAGER | Lista de categorias |
| `/admin/categories/new` | CategoryForm | PLATFORM_ADMIN<br>COMPANY_ADMIN<br>STORE_MANAGER | Criar categoria |
| `/admin/categories/edit/:id` | CategoryForm | PLATFORM_ADMIN<br>COMPANY_ADMIN<br>STORE_MANAGER | Editar categoria |

### **Próximas Rotas (Planejadas):**
```
/admin/products              # Lista de produtos
/admin/products/new          # Criar produto
/admin/products/edit/:id     # Editar produto
/admin/orders                # Lista de pedidos
/admin/orders/:id            # Detalhes do pedido
/admin/users                 # Gerenciar usuários
/store/:subdomain            # Storefront público (cardápio)
/store/:subdomain/cart       # Carrinho de compras
/store/:subdomain/checkout   # Finalizar pedido
```

---

## 🎨 Padrões de Design

### **1. Componentes Reutilizáveis:**

Sempre extraia lógica repetida em componentes:
```typescript
// ❌ Ruim
<div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>

// ✅ Bom
<LoadingSpinner />
```

### **2. Hooks Customizados:**

Use hooks para lógica complexa:
```typescript
// hooks/useCategories.ts
export function useCategories(storeId: number) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadCategories();
  }, [storeId]);
  
  return { categories, loading, refresh: loadCategories };
}
```

### **3. Tratamento de Erros:**

Sempre mostre feedback ao usuário:
```typescript
try {
  await api.post('/endpoint', data);
  toast.success('Sucesso!');
} catch (error) {
  const message = error.response?.data?.detail || 'Erro desconhecido';
  toast.error(message);
}
```

### **4. TypeScript Strict:**

Sempre use tipos explícitos:
```typescript
// ❌ Ruim
const [data, setData] = useState(null);

// ✅ Bom
const [data, setData] = useState<Category[]>([]);
```

---

## 📊 Estado da Aplicação

### **Dados no localStorage:**
```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIs...",      // JWT token
  "user": "{\"id\":1,\"email\":\"...\"}",  // Dados do usuário
  "current_store_id": "1"                   // Loja selecionada
}
```

### **Fluxo de Dados:**
```
1. Usuário faz login
   └─> authService.login()
       └─> Salva token no localStorage
           └─> Carrega dados do usuário (/auth/me)
               └─> AuthContext.user atualizado
                   └─> StoreContext define currentStoreId
                       └─> Componentes podem fazer requisições
```

---

## 🐛 Debug e Troubleshooting

### **Problema: "Token inválido" após algum tempo**

O token JWT expira. Solução:
1. Implementar refresh token
2. Ou fazer logout automático e redirecionar para /login

### **Problema: "store_id não existe"**

PLATFORM_ADMIN não tem `store_id` fixo. Solução:
1. Usar `useStore()` ao invés de `user.store_id`
2. Garantir que `StoreProvider` envolve a aplicação

### **Problema: Categorias não carregam**

Verificar:
1. Backend está rodando? (`http://localhost:8000/docs`)
2. Token está válido? (ver localStorage)
3. Loja está selecionada? (ver `currentStoreId`)
4. Console do navegador (F12) tem erros?

### **Problema: Build falha**
```bash
# Limpar cache
rm -rf node_modules/.vite
rm -rf dist

# Reinstalar dependências
npm install

# Tentar build novamente
npm run build
```

---

## 🚀 Próximos Passos

### **Prioridade Alta (Essencial para MVP):**

- [ ] **CRUD de Produtos**
  - [ ] Listagem com filtros (categoria, busca, disponibilidade)
  - [ ] Criar produto (nome, preço, estoque, categoria)
  - [ ] Editar produto
  - [ ] Deletar produto (soft delete)
  - [ ] Upload de imagem
  - [ ] Gestão de estoque (alertas de baixo estoque)
  - [ ] Preço promocional

- [ ] **Sistema de Pedidos (Orders)**
  - [ ] Listagem de pedidos (filtros por status, data)
  - [ ] Detalhes do pedido
  - [ ] Atualizar status (Pendente → Confirmado → Preparando → Pronto → Entregue)
  - [ ] Cancelar pedido
  - [ ] Notificações em tempo real (opcional: WebSocket)

- [ ] **Storefront (Cardápio Público)**
  - [ ] Página pública sem login
  - [ ] Lista produtos por categoria
  - [ ] Busca de produtos
  - [ ] Carrinho de compras (localStorage)
  - [ ] Checkout (criar pedido sem autenticação)
  - [ ] Integração com WhatsApp (enviar pedido)

### **Prioridade Média (Melhoria UX):**

- [ ] **Dashboard com Métricas**
  - [ ] Vendas do dia/mês
  - [ ] Produtos mais vendidos
  - [ ] Gráficos (Chart.js ou Recharts)
  - [ ] Alertas (estoque baixo, novos pedidos)

- [ ] **Gestão de Usuários**
  - [ ] Listar usuários da loja
  - [ ] Criar usuário (roles: manager, delivery)
  - [ ] Editar/desativar usuário

- [ ] **Upload de Imagens Real**
  - [ ] Integração com Cloudinary ou AWS S3
  - [ ] Preview antes de enviar
  - [ ] Crop/resize de imagem

- [ ] **Melhorias na Landing**
  - [ ] Formulário de contato
  - [ ] Chat online (Tawk.to ou similar)
  - [ ] Vídeo demonstração

### **Prioridade Baixa (Futuro):**

- [ ] PWA (Progressive Web App)
- [ ] App mobile React Native
- [ ] Sistema de cupons/descontos
- [ ] Programa de fidelidade
- [ ] Integração com iFood/Rappi (importar cardápio)
- [ ] Multi-idioma (i18n)
- [ ] Tema dark mode
- [ ] Testes automatizados (Jest, Cypress)

---

## 🧪 Testes

### **Estrutura (a implementar):**
```
src/
├── __tests__/
│   ├── components/
│   │   └── StoreSelector.test.tsx
│   ├── services/
│   │   └── auth.service.test.ts
│   └── pages/
│       └── Login.test.tsx
```

### **Comandos:**
```bash
# Instalar dependências de teste
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Rodar testes
npm test

# Cobertura
npm run test:coverage
```

---

## 📚 Documentação Adicional

### **Links Úteis:**

- **Backend API:** http://localhost:8000/docs (Swagger)
- **React Docs:** https://react.dev
- **TailwindCSS:** https://tailwindcss.com/docs
- **React Router:** https://reactrouter.com
- **TanStack Query:** https://tanstack.com/query

### **Padrões de Commit:**

Use conventional commits:
```
feat: adiciona CRUD de produtos
fix: corrige erro no login
docs: atualiza README
style: formata código com prettier
refactor: reorganiza estrutura de pastas
test: adiciona testes do StoreSelector
chore: atualiza dependências
```

---

## 🤝 Como Contribuir

### **1. Clone o projeto**
```bash
git clone <url>
cd clickfome
```

### **2. Crie uma branch**
```bash
git checkout -b feature/nome-da-feature
```

### **3. Faça suas alterações**
```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
```

### **4. Push e Pull Request**
```bash
git push origin feature/nome-da-feature
```

### **Regras:**

- Sempre teste antes de commitar
- Siga os padrões de código (TypeScript, ESLint)
- Documente funções complexas
- Mantenha componentes pequenos e focados
- Não commite `node_modules` ou arquivos de build

---

## 📝 Licença

Este projeto é proprietário da **GBConnect Digital**.

Todos os direitos reservados © 2024

---

## 👥 Equipe

- **Frontend:** Gabriela (React/TypeScript)
- **Backend:** Bruno (Python/FastAPI)

---

## 📞 Suporte

- **Email:** contato@gbconnect.digital
- **Site:** https://gbconnect.digital

---

## 🔄 Changelog

### **v0.1.0 (30/10/2024)**

**Adicionado:**
- ✅ Landing page completa
- ✅ Sistema de autenticação
- ✅ Dashboard admin
- ✅ CRUD de categorias
- ✅ Sistema multi-tenant (StoreContext)
- ✅ Proteção de rotas por role

**Próximo:** CRUD de Produtos

---

## 🎯 Metas do Projeto

- **MVP (4 semanas):** Landing + Auth + CRUD Completo + Storefront básico
- **Beta (8 semanas):** Sistema de pedidos + Dashboard com métricas
- **Produção (12 semanas):** Testes completos + Deploy + Primeiros clientes

---

**🚀 Vamos criar o melhor sistema de delivery do Brasil!**

Feito com 🧡 por GBConnect Digital