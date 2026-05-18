# SyStock — Sistema de Gerenciamento de Estoque

> Sistema web completo para controle de estoque, desenvolvido como TCC do curso de Análise e Desenvolvimento de Sistemas da Faculdade de Tecnologia da Zona Leste (FATEC-ZL).

---

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Modelo de Dados](#modelo-de-dados)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [API — Endpoints](#api--endpoints)
- [Testes](#testes)
- [Fluxo de Autenticação](#fluxo-de-autenticação)
- [Papéis de Usuário](#papéis-de-usuário)

---

## Sobre o Projeto

O **SyStock** é uma aplicação web para gestão de estoque voltada a pequenas e médias empresas. Ele centraliza o controle de produtos, lotes, fornecedores, entradas de mercadoria (abastecimentos) e emite alertas proativos sobre itens vencidos, próximos ao vencimento, com estoque zerado ou abaixo do mínimo configurado.

O sistema possui arquitetura desacoplada com um **backend REST em Node.js/Fastify** e um **frontend em React**, se comunicando via HTTP e autenticando requisições com JWT.

---

## Funcionalidades

### Dashboard (Página Inicial)
- Painel de avisos exibindo em tempo real a contagem de produtos nas seguintes situações críticas:
  - **Vencidos** — lotes com data de validade ultrapassada
  - **Estoque Zerado** — produtos sem nenhuma unidade disponível
  - **Próximos ao Vencimento** — lotes expirando dentro de 7 dias
  - **Baixa Quantidade** — produtos abaixo do estoque mínimo configurado

### Produtos
- Cadastro com nome, preço de venda, preço de custo, quantidade mínima, categoria e observações
- Edição e exclusão lógica (soft delete via `excludedStatus`)
- Filtragem por categoria, nome e status especiais (vencido, zerado, baixo estoque)
- Visualização de lotes vinculados ao produto
- Controle de entrada e saída de unidades via lotes

### Lotes (Batches)
- Associação de lotes a produtos com data de validade (opcional), quantidade e status de validação
- Incremento e decremento de quantidade com atualização automática do estoque total do produto
- Registro de data em que o lote foi completamente zerado (`dateTimeEmptyStock`)

### Abastecimentos (Fills / Entradas de NF)
- Registro de entradas de mercadoria vinculando fornecedor, usuário responsável e lotes adquiridos
- Cada entrada (`Fill`) pode conter múltiplos lotes (`Batch_Fill`), com custo unitário e subtotal
- Se o lote já existe (mesma data de validade), a quantidade é incrementada automaticamente

### Fornecedores
- Cadastro com nome, telefone e e-mail
- Busca por nome e listagem completa
- Exclusão lógica

### Categorias
- Criação, edição e exclusão de categorias de produtos
- Associação opcional de categorias a produtos

### Usuários e Autenticação
- Dois papéis: **Admin** e **Funcionário**
- Cadastro de pré-usuários (`Pre_User`) como etapa de convite antes da criação da conta definitiva
- Login com `login` + `password`, retorno de JWT com validade de 24 horas
- **Recuperação de senha** via e-mail: geração de token UUID, envio de link por SMTP (Gmail), redefinição via interface
- Edição de perfil e troca de senha

### Histórico
- Auditoria de movimentações de estoque (`logProduct`)
- Histórico de abastecimentos (`logFill`)
- Tabela de vendas (`logSales`) — estrutura preparada

### Configurações
- Gerenciamento da lista de usuários do sistema pelo Admin

---

## Arquitetura

```
SyStock/
├── Server/     ← API REST (Node.js + Fastify + Prisma + SQLite)
└── Front/      ← SPA (React + Redux + Material UI)
```

A comunicação ocorre via HTTP. O frontend armazena o JWT no `localStorage` e o envia no header `Authorization: Bearer <token>` a cada requisição protegida. O backend valida o token em um middleware antes de qualquer rota autenticada.

### Camadas do Backend

```
src/
├── server.ts          ← Inicialização e bind de IP/porta
├── app.ts             ← Configuração do Fastify, CORS e registro de rotas
├── routes.ts          ← Declaração de todas as rotas agrupadas por domínio
├── middleware/        ← auth_middleware (JWT verification)
├── controllers/       ← Recebem a request, delegam para services, retornam resposta HTTP
├── service/           ← Regras de negócio (validações, orquestrações)
├── models/            ← Acesso ao banco via Prisma Client
├── interface/         ← Tipos TypeScript para cada entidade
├── errors/            ← AppError customizado
└── functions/         ← Utilitários: nodemailer, template de e-mail, funções base
```

### Camadas do Frontend

```
src/
├── App.js             ← Contexto global, verificação de token, roteamento raiz
├── Master.js          ← Declaração de rotas React Router
├── pages/             ← Uma pasta por tela (Home, Product, Category, Supplier…)
├── Service/           ← Actions e Mappers por entidade (chamadas à API + parse)
├── classes/           ← Modelos de dados do lado cliente (Account, Product, Batch…)
├── components/        ← Componentes reutilizáveis (inputs, dialogs, tabelas, snackbar)
└── utils/             ← Helpers de array, data, debounce e dados locais para debug
```

---

## Tecnologias

### Backend
| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | — | Runtime |
| TypeScript | ^4.9.5 | Tipagem estática |
| Fastify | ^4.14.1 | Framework HTTP |
| @fastify/cors | ^8.2.0 | Política de CORS |
| Prisma | 5.19.0 | ORM e migrations |
| SQLite | — | Banco de dados (arquivo `dev.db`) |
| bcryptjs | ^2.4.3 | Hash de senhas |
| jsonwebtoken | ^9.0.0 | Autenticação JWT |
| nodemailer | ^6.9.4 | Envio de e-mails SMTP |
| zod | ^3.20.2 | Validação de schemas |
| tsx / ts-node | — | Execução de TypeScript em dev |
| Jest | ^29.7.0 | Framework de testes |

### Frontend
| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18.2.0 | UI |
| React Router DOM | 6.8.1 | Navegação SPA |
| Redux + Redux Thunk | 4.2.1 / 2.4.2 | Gerenciamento de estado |
| Material UI (MUI) | 5.11.x | Componentes visuais |
| Emotion | 11.10.x | CSS-in-JS |
| react-virtuoso | 4.1.0 | Tabelas com virtualização |
| react-imask / react-input-mask | — | Máscaras de entrada (CEP, telefone) |
| react-currency-mask | 1.3.1 | Máscara de valor monetário |

---

## Modelo de Dados

O banco é gerenciado pelo Prisma com SQLite. Abaixo as entidades principais e suas relações:

```
eTypeUser ──┐
            ├─< User >──< Fill >──< Batch_Fill >──< Batch >──< Product >──< Category
            │           │                                        │
            │           └──< Sales >──< Product_Sales           └──< logProduct
            │           └──< logFill
            └─< token_Recovery

Supplier ──< Fill

eSalesStatus ──< Sales
ePaymentMethod ──< Sales
eValitadionStatus ──< Batch
eTypeAction (enum de ação de log)

Pre_User (pré-cadastro de convidados)
logSales (auditoria de vendas)
```

**Destaques do modelo:**
- `Product.totalQuantityInStock` é atualizado automaticamente nas operações de lote, nunca calculado on-the-fly
- `Batch.expirationDate` é opcional — produtos sem validade são suportados
- Exclusão lógica via `excludedStatus: Boolean` em `User`, `Product`, `Supplier` e `Sales`
- `token_Recovery` usa UUID como PK para tokens de redefinição de senha

---

## Estrutura de Pastas

```
SyStock-main/
├── README.md
├── Server/
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   ├── ERD.svg
│   │   └── migrations/
│   └── src/
│       ├── server.ts
│       ├── app.ts
│       ├── routes.ts
│       ├── config/prisma.ts
│       ├── controllers/
│       ├── service/
│       ├── models/
│       ├── interface/
│       ├── middleware/
│       ├── errors/
│       ├── functions/
│       ├── testControllers/      ← testes de integração HTTP
│       └── testService/          ← testes unitários de serviços
└── Front/
    └── systock/
        ├── package.json
        └── src/
            ├── App.js
            ├── Master.js
            ├── CustomTheme.js
            ├── apiBase.js
            ├── pages/
            │   ├── Home/
            │   ├── Login/
            │   ├── Product/
            │   ├── Category/
            │   ├── Supplier/
            │   ├── History/
            │   ├── SellRegisters/
            │   ├── Settings/
            │   ├── Support/
            │   └── Sidebar/
            ├── Service/
            │   ├── Product/
            │   ├── Category/
            │   ├── Supplier/
            │   ├── Batch/
            │   ├── Supply/
            │   ├── SellRegisters/
            │   ├── History/
            │   └── Users/
            ├── classes/
            ├── components/
            └── utils/
```

---

## Pré-requisitos

- **Node.js** >= 18
- **npm** >= 8
- Conta Gmail com **Senha de App** configurada (para recuperação de senha)

---

## Como Rodar Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/<seu-usuario>/SyStock.git
cd SyStock
```

### 2. Backend

```bash
cd Server

# Instale as dependências
npm install

# Configure as variáveis de ambiente (veja seção abaixo)
cp .env.example .env

# Crie o banco, rode as migrations e popule com dados iniciais
npm run localTest
# Equivale a: prisma db push --force-reset && prisma db seed

# Inicie o servidor em modo desenvolvimento
npm run dev
# O servidor sobe em http://<seu-IP-local>:PORT
```

### 3. Frontend

```bash
cd Front/systock

# Instale as dependências
npm install

# Ajuste o IP do servidor em src/apiBase.js
# export const apiBase = 'SEU_IP:3333';

# Inicie a aplicação
npm start
# Disponível em http://localhost:3000
```

### Usuário padrão (seed)

Após rodar o seed, o sistema cria automaticamente um usuário Admin:

| Campo | Valor |
|---|---|
| Login | `Admin HGB` |
| Senha | `Admin HGB` |
| E-mail | `hgbsystemstock@gmail.com` |
| Tipo | Admin |

> **Atenção:** altere a senha imediatamente após o primeiro acesso em ambiente produtivo.

---

## Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `Server/` com as seguintes chaves:

```env
# Porta em que o servidor vai escutar
PORT=3333

# Chave secreta para assinatura dos JWTs
JWTSecret=sua_chave_secreta_aqui

# Credenciais SMTP para envio de e-mail (recuperação de senha)
EMAIL=seu_email@gmail.com
PASSWORD=sua_senha_de_app_gmail
```

> O frontend não requer `.env`. O endereço da API é configurado diretamente em `src/apiBase.js`.

---

## API — Endpoints

Todas as rotas marcadas com 🔒 exigem o header `Authorization: Bearer <token>`.

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth` | Login — retorna JWT |
| POST | `/recovery` | Dispara e-mail de recuperação de senha |
| PUT | `/reset/password` | Redefine a senha via token de recuperação |

### Usuários
| Método | Rota | Descrição |
|---|---|---|
| GET | `/users` 🔒 | Lista todos os usuários |
| POST | `/user` | Cria usuário (aberto para uso pós-convite) |
| GET | `/user/findById/:id` 🔒 | Busca usuário por ID |
| GET | `/user/findByName/:name` 🔒 | Busca usuário por nome exato |
| GET | `/user/listByName/:name` 🔒 | Lista usuários cujo nome começa com `name` |
| PATCH | `/user` 🔒 | Edita dados do usuário |
| PATCH | `/user/editPassword` | Altera senha |
| DELETE | `/user/:id` 🔒 | Remove usuário (soft delete) |

### Pré-Usuários
| Método | Rota | Descrição |
|---|---|---|
| GET | `/preusers` 🔒 | Lista pré-usuários |
| POST | `/preuser` | Cria convite de pré-usuário |

### Categorias
| Método | Rota | Descrição |
|---|---|---|
| GET | `/categories` 🔒 | Lista todas as categorias |
| POST | `/category` 🔒 | Cria categoria |
| GET | `/category/:id` 🔒 | Busca por ID |
| GET | `/category/findByName/:name` 🔒 | Busca por nome exato |
| GET | `/category/listByName/:name` 🔒 | Lista categorias que começam com `name` |
| PUT | `/category` 🔒 | Edita categoria |
| DELETE | `/category/:id` 🔒 | Remove categoria |

### Fornecedores
| Método | Rota | Descrição |
|---|---|---|
| GET | `/suppliers` 🔒 | Lista todos os fornecedores |
| POST | `/supplier` 🔒 | Cria fornecedor |
| GET | `/supplier/:id` 🔒 | Busca por ID |
| GET | `/supplier/findByName/:name` 🔒 | Busca por nome exato |
| GET | `/supplier/listByName/:name` 🔒 | Lista fornecedores que começam com `name` |
| PATCH | `/supplier` 🔒 | Edita fornecedor |
| DELETE | `/supplier/:id` 🔒 | Remove fornecedor (soft delete) |

### Produtos
| Método | Rota | Descrição |
|---|---|---|
| GET | `/products` 🔒 | Lista todos os produtos |
| POST | `/product` 🔒 | Cria produto |
| GET | `/product/:id` 🔒 | Busca por ID |
| GET | `/product/findByName/:name` 🔒 | Busca por nome |
| GET | `/product/category/:category_id` 🔒 | Lista por categoria |
| PUT | `/product` 🔒 | Edita produto |
| DELETE | `/product/:id` 🔒 | Remove produto (soft delete) |
| GET | `/products/expired` 🔒 | Lista produtos com lotes vencidos |
| GET | `/products/zeroStock` 🔒 | Lista produtos com estoque zerado |
| GET | `/products/lowQuantity` 🔒 | Lista produtos abaixo do mínimo |
| GET | `/products/closeToExpiration` 🔒 | Lista produtos com lotes vencendo em ≤ 7 dias |

### Lotes (Batches)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/batchs` 🔒 | Lista todos os lotes |
| POST | `/batch` 🔒 | Cria lote vinculado a produto |
| GET | `/batch/product/:product_id` 🔒 | Lista lotes de um produto |
| POST | `/batch/addQuantity` 🔒 | Incrementa quantidade de um lote |
| POST | `/batch/subQuantity` 🔒 | Decrementa quantidade de um lote |
| DELETE | `/batch/:id` 🔒 | Remove lote |

### Abastecimentos (Fills)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/fill` 🔒 | Registra entrada de mercadoria (NF) |
| GET | `/fill` 🔒 | Lista todos os abastecimentos |
| GET | `/fill/findById/:id` 🔒 | Busca abastecimento por ID |
| GET | `/fill/findBySupplierName/:id` 🔒 | Lista abastecimentos por fornecedor |

---

## Testes

O projeto possui testes unitários (camada de serviço) e de integração (camada de controller) escritos com **Jest + ts-jest**.

```bash
cd Server
npm test
```

Cobertura de testes inclui:

- `testService/` — Product, Batch, Category, Supplier, User, PreUser
- `testControllers/` — BatchController, CategoryController, ProductController, SupplierController, UserController, LoginController, PreUserController

Os testes de serviço operam diretamente contra o banco (SQLite de teste) gerando dados com timestamps únicos para evitar colisões.

---

## Fluxo de Autenticação

```
[Login Form]
    │ POST /auth { login, password }
    ▼
[LoginService]
    │ bcrypt.compare(password, hash)
    │ jwt.sign({ id, name, email, user_type }, secret, { expiresIn: "24h" })
    ▼
[Frontend] ← recebe token → localStorage.setItem('tokenLogin', token)
    │
    │ (a cada requisição protegida)
    │ Authorization: Bearer <token>
    ▼
[auth_middleware] → jwt.verify() → injeta loggedUser na request
```

**Recuperação de senha:**
1. `POST /recovery { email }` → gera UUID, salva em `token_Recovery`, envia e-mail via SMTP com link
2. Usuário acessa `reset/password/:token` no frontend
3. `PUT /reset/password { token, newPassword }` → valida token, aplica hash, persiste

---

## Papéis de Usuário

| Tipo | Código | Permissões |
|---|---|---|
| Admin | `1` | Acesso total, incluindo gerenciamento de usuários |
| Funcionário | `2` | Operações de estoque, produtos, fornecedores e histórico |

O tipo padrão ao criar um usuário via seed é **Admin**. Novos usuários criados pelo endpoint público recebem o tipo **Funcionário** (`default: 2`) conforme definido no schema do Prisma.
