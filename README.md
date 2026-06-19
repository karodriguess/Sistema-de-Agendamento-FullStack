<h1 align="center">📅 SasS de Agendamento</h1>

<p align="center">
  <img alt="Status" src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white">
</p>

<p align="center">
  Plataforma Full Stack para gerenciamento de atendimentos, profissionais, serviços e agendamentos em um único ambiente.
</p>

---

## Sobre o Projeto

O **Sistema de Agendamento Online** é uma aplicação web desenvolvida para centralizar e facilitar o gerenciamento de agendamentos. A plataforma permite organizar horários, acompanhar atendimentos e controlar informações de profissionais, serviços e clientes de forma eficiente.

O projeto foi construído com foco em boas práticas de desenvolvimento Full Stack, dividido em duas aplicações independentes — **frontend** e **backend** — que se comunicam via API REST com autenticação baseada em tokens JWT.

---

## Funcionalidades

- [x] Cadastro e autenticação de usuários (registro e login)
- [x] Controle de acesso por perfil — **Administrador** e **Cliente**
- [x] Dashboard administrativo com métricas do sistema
- [x] Gerenciamento completo de profissionais (CRUD)
- [x] Gerenciamento de serviços oferecidos
- [x] Criação e controle de agendamentos com verificação de conflitos de horário
- [x] Consulta dos próprios agendamentos (visão do cliente)
- [x] Proteção de rotas privadas no frontend e backend
- [x] Persistência de autenticação com token JWT (validade de 7 dias)
- [x] Integração frontend ↔ backend via API REST

---

## Tecnologias Utilizadas

### Frontend

| Tecnologia                                    | Versão | Descrição                                      |
| --------------------------------------------- | ------ | ---------------------------------------------- |
| [React](https://react.dev/)                   | 19     | Biblioteca para construção de interfaces       |
| [TypeScript](https://www.typescriptlang.org/) | 6      | Tipagem estática                               |
| [Vite](https://vitejs.dev/)                   | 8      | Bundler e servidor de desenvolvimento          |
| [React Router DOM](https://reactrouter.com/)  | 7      | Roteamento client-side                         |
| [Axios](https://axios-http.com/)              | 1.x    | Cliente HTTP com interceptors de autenticação  |
| [Tailwind CSS](https://tailwindcss.com/)      | 4      | Estilização com utilitários CSS                |
| Context API                                   | —      | Gerenciamento de estado global de autenticação |

### Backend

| Tecnologia                                                 | Versão | Descrição                             |
| ---------------------------------------------------------- | ------ | ------------------------------------- |
| [Next.js](https://nextjs.org/)                             | 16     | Framework com App Router para as APIs |
| [Node.js](https://nodejs.org/)                             | —      | Runtime JavaScript                    |
| [MongoDB](https://www.mongodb.com/)                        | Atlas  | Banco de dados NoSQL em nuvem         |
| [Mongoose](https://mongoosejs.com/)                        | 9      | ODM para modelagem de dados           |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | 9      | Geração e validação de tokens JWT     |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js)           | 3      | Hash de senhas                        |
| [TypeScript](https://www.typescriptlang.org/)              | 5      | Tipagem estática                      |

---

## Estrutura do Projeto

```
Agendamento-master/
├── backend/                        # API Next.js (App Router)
│   ├── src/
│   │   ├── app/
│   │   │   └── api/
│   │   │       ├── auth/
│   │   │       │   ├── login/      # POST /api/auth/login
│   │   │       │   └── register/   # POST /api/auth/register
│   │   │       ├── agendamentos/   # GET, POST /api/agendamentos
│   │   │       │   └── [id]/       # PATCH /api/agendamentos/:id
│   │   │       ├── profissionais/  # GET, POST /api/profissionais
│   │   │       │   └── [id]/       # PUT, DELETE /api/profissionais/:id
│   │   │       ├── servicos/       # GET, POST /api/servicos
│   │   │       ├── dashboard/      # GET /api/dashboard
│   │   │       ├── disponibilidades/ # GET /api/disponibilidades
│   │   │       ├── me/
│   │   │       │   └── agendamentos/ # GET /api/me/agendamentos
│   │   │       ├── profile/        # GET /api/profile (rota protegida)
│   │   │       └── users/          # POST /api/users
│   │   ├── models/
│   │   │   ├── Agendamento.js      # Schema de agendamentos
│   │   │   ├── Disponibilidade.js  # Schema de disponibilidades
│   │   │   ├── Profissional.js     # Schema de profissionais
│   │   │   ├── Servico.js          # Schema de serviços
│   │   │   └── User.js             # Schema de usuários
│   │   └── lib/
│   │       └── mongodb.js          # Conexão com MongoDB (com cache)
│   ├── middleware.js                # Validação JWT para rotas protegidas
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── package.json
│
└── frontend/                       # SPA React + Vite
    ├── src/
    │   ├── pages/
    │   │   ├── Login/              # Tela de autenticação
    │   │   ├── Dashboard/          # Painel com métricas
    │   │   ├── Profissionais/      # CRUD de profissionais
    │   │   ├── Servicos/           # Gerenciamento de serviços
    │   │   ├── Agendamentos/       # Lista de todos os agendamentos
    │   │   └── MeusAgendamentos/   # Agendamentos do cliente logado
    │   ├── components/
    │   │   ├── Sidebar/            # Menu de navegação lateral
    │   │   └── ProtectedRoute/     # Guard de rotas privadas
    │   ├── contexts/
    │   │   └── AuthContext.tsx     # Estado global de autenticação
    │   ├── hooks/
    │   │   └── useAuth.ts          # Hook para acessar o AuthContext
    │   ├── services/
    │   │   ├── api.ts              # Instância Axios com interceptor JWT
    │   │   └── profissionais.ts    # Funções da API de profissionais
    │   ├── routes/
    │   │   └── AppRoutes.tsx       # Definição das rotas da aplicação
    │   ├── App.tsx
    │   └── main.tsx
    ├── vite.config.ts              # Proxy /api → localhost:3000
    ├── tsconfig.json
    └── package.json
```

---

## Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) — versão 18 ou superior
- npm (instalado junto com o Node.js)
- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas) com um cluster criado

---

## Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/karodriguess/Agendamento.git
cd Agendamento-master
```

### 2. Configure e execute o Backend

```bash
# Acesse a pasta do backend
cd backend

# Instale as dependências
npm install

# Crie o arquivo de variáveis de ambiente
# (veja a seção "Variáveis de Ambiente" abaixo)
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

O backend estará disponível em: `http://localhost:3000`

### 3. Configure e execute o Frontend

Abra um novo terminal na raiz do projeto:

```bash
# Acesse a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

> As requisições do frontend para `/api` são automaticamente redirecionadas ao backend em `localhost:3000` via proxy configurado no Vite.

---

## Variáveis de Ambiente

Crie o arquivo `.env.local` dentro da pasta `backend/` com as seguintes variáveis:

```env
# URI de conexão com o MongoDB Atlas
MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/?appName=Agendamento

# Chave secreta para geração e validação dos tokens JWT
JWT_SECRET=sua_chave_secreta_aqui
```

> **Atenção:** nunca exponha credenciais reais no repositório. Adicione `.env.local` ao `.gitignore`.

---

## Endpoints da API

### Autenticação (Público)

| Método | Rota                 | Descrição                                    |
| ------ | -------------------- | -------------------------------------------- |
| `POST` | `/api/auth/register` | Cadastro de novo usuário                     |
| `POST` | `/api/auth/login`    | Login — retorna token JWT e dados do usuário |

### Profissionais (Protegido)

| Método   | Rota                     | Perfil | Descrição                    |
| -------- | ------------------------ | ------ | ---------------------------- |
| `GET`    | `/api/profissionais`     | Todos  | Lista todos os profissionais |
| `POST`   | `/api/profissionais`     | Admin  | Cria novo profissional       |
| `PUT`    | `/api/profissionais/:id` | Admin  | Atualiza profissional        |
| `DELETE` | `/api/profissionais/:id` | Admin  | Remove profissional          |

### Serviços (Protegido)

| Método | Rota            | Perfil | Descrição             |
| ------ | --------------- | ------ | --------------------- |
| `GET`  | `/api/servicos` | Todos  | Lista serviços ativos |
| `POST` | `/api/servicos` | Admin  | Cria novo serviço     |

### Agendamentos (Protegido)

| Método  | Rota                    | Perfil  | Descrição                                |
| ------- | ----------------------- | ------- | ---------------------------------------- |
| `GET`   | `/api/agendamentos`     | Admin   | Lista todos os agendamentos              |
| `POST`  | `/api/agendamentos`     | Cliente | Cria novo agendamento (valida conflitos) |
| `PATCH` | `/api/agendamentos/:id` | Todos   | Atualiza status do agendamento           |
| `GET`   | `/api/me/agendamentos`  | Cliente | Lista agendamentos do usuário logado     |

### Dashboard (Protegido — Admin)

| Método | Rota             | Descrição                                                                                        |
| ------ | ---------------- | ------------------------------------------------------------------------------------------------ |
| `GET`  | `/api/dashboard` | Retorna métricas: total de clientes, profissionais, serviços, agendamentos e agendamentos do dia |

---

## Scripts Disponíveis

### Backend (`/backend`)

| Comando         | Descrição                                         |
| --------------- | ------------------------------------------------- |
| `npm run dev`   | Inicia o servidor Next.js em modo desenvolvimento |
| `npm run build` | Gera o build de produção                          |
| `npm run start` | Inicia o servidor em modo produção                |
| `npm run lint`  | Executa o ESLint                                  |

### Frontend (`/frontend`)

| Comando           | Descrição                                      |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Inicia o servidor Vite em modo desenvolvimento |
| `npm run build`   | Verifica tipos e gera o build de produção      |
| `npm run preview` | Pré-visualiza o build de produção localmente   |
| `npm run lint`    | Executa o ESLint                               |

---

## Status do Projeto

> Em desenvolvimento — novas funcionalidades sendo adicionadas continuamente.

| Módulo                           | Status             |
| -------------------------------- | ------------------ |
| Autenticação (login/registro)    | Concluído          |
| Dashboard administrativo         | Concluído          |
| Gerenciamento de Profissionais   | Concluído          |
| Gerenciamento de Serviços        | Concluído          |
| Agendamentos (listagem admin)    | Concluído |
| Disponibilidades                 | Concluído |
| Meus Agendamento (Cliente)       | Em desenvolvimento|

---

## Autora

Feito por **Kariny Rodrigues** — [karinyrodrigues2004@gmail.com](mailto:karinyrodrigues2004@gmail.com)
