# Teste de Performance no K6

## 📋 Descrição

Este projeto foi desenvolvido como desafio para ganhar 1 ponto na disciplina de Testes de Performance com K6. O objetivo é criar um teste de performance no K6 que realiza login e executa operações que exigem autenticação via token JWT em uma API REST.

O teste implementa os conceitos aprendidos na disciplina, incluindo:
- Autenticação com obtenção de token JWT
- Operações CRUD de tarefas utilizando o token de autenticação
- Configuração de stages (ramp-up, carga constante, ramp-down)
- Thresholds de performance
- Métricas customizadas (Rate, Trend, Counter)
- Geração de relatórios HTML e JSON

## 🚀 Tecnologias Utilizadas

- **Node.js** com Express.js
- **GraphQL** com Apollo Server
- **JWT** para autenticação
- **Mocha** e **Chai** para testes
- **Supertest** para testes E2E
- **Sinon** para mocks e stubs
- **K6** para testes de performance
- **GitHub Actions** para CI/CD

## 📁 Estrutura do Projeto

```
api_performance_K6/
├── src/                     # Código-fonte da aplicação
│   ├── controllers/         # Controladores REST
│   ├── middleware/           # Middlewares (auth, etc.)
│   ├── routes/              # Rotas REST
│   ├── graphql/             # Schema e resolvers GraphQL
│   │   ├── typeDefs/        # Definições de tipos
│   │   └── resolvers/       # Resolvers GraphQL
│   ├── config/              # Configurações (database, etc.)
│   ├── models/              # Modelos de dados (reservado)
│   ├── utils/               # Utilitários (reservado)
│   └── server.js            # Servidor principal
├── test/                    # Testes automatizados
│   ├── unit/                # Testes unitários
│   │   └── controllers/     # Testes de controllers
│   ├── e2e/                 # Testes end-to-end
│   └── integration/         # Testes de integração (reservado)
├── k6/                      # Testes de performance
│   └── performance-test.js  # Script de teste de carga
├── docs/                    # Documentação
│   └── API_Examples.md      # Exemplos de uso da API
├── .github/
│   └── workflows/           # Pipeline CI/CD
├── package.json             # Dependências e scripts
├── env.example              # Exemplo de variáveis de ambiente
├── validate-project.js      # Script de validação do projeto
└── README.md                # Este arquivo
```

## 🔧 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repo>
cd api_performance_K6
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp env.example .env
```

Edite o arquivo `.env`:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=sua_chave_secreta_super_segura_aqui_123
JWT_EXPIRES_IN=24h
API_VERSION=v1
```

### 4. Execute a aplicação

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

## 🧪 Executando os Testes

### Testes Unitários e E2E

**Todos os testes:**
```bash
npm test
```

**Testes com coverage:**
```bash
npm run test:coverage
```

**Testes em modo watch:**
```bash
npm run test:watch
```

**Validação completa do projeto:**
```bash
npm run test:validate
```

### Testes de Performance com K6

Este projeto inclui testes de performance usando **K6**, que testam a API sob carga simulando múltiplos usuários simultâneos.

#### Pré-requisitos

Instale o K6:
- **macOS**: `brew install k6`
- **Linux**: Siga as [instruções oficiais](https://k6.io/docs/getting-started/installation/)
- **Windows**: Baixe o instalador em [k6.io](https://k6.io/docs/getting-started/installation/)

#### Executando os Testes de Performance

**1. Certifique-se de que a API está rodando:**
```bash
npm start
```

**2. Execute o teste de performance:**

**Opção A - Usando npm script (recomendado):**
```bash
npm run test:performance
```

**Opção B - Comando direto:**
```bash
k6 run k6/performance-test.js
```

**3. Com variáveis de ambiente personalizadas:**
```bash
BASE_URL=http://localhost:3000 \
TEST_EMAIL=user@test.com \
TEST_PASSWORD=user123 \
k6 run k6/performance-test.js
```

#### O que o Teste Faz

O teste de performance realiza o seguinte cenário:

1. **Autenticação**: Faz login e obtém token JWT
2. **Operações CRUD de Tarefas**:
   - Cria uma nova tarefa
   - Busca a tarefa criada
   - Lista todas as tarefas
   - Atualiza a tarefa
   - Deleta a tarefa

#### Padrão de Carga

O teste utiliza um padrão de carga progressivo:
- **Ramp-up inicial**: 0 → 5 usuários em 30s
- **Carga constante baixa**: 5 usuários por 1min
- **Ramp-up para carga maior**: 5 → 10 usuários em 30s
- **Carga constante alta**: 10 usuários por 1min
- **Ramp-down**: 10 → 0 usuários em 30s

**Duração total**: ~3 minutos

#### Relatórios Gerados

Após a execução, o K6 gera:
- **Console**: Resumo formatado no terminal
- **k6-report.html**: Relatório HTML visual (abre no navegador)
- **summary.json**: Dados brutos em JSON para análise

#### Thresholds de Performance

O teste valida os seguintes limites:
- ✅ **Taxa de sucesso do login**: > 90%
- ✅ **Taxa de sucesso das operações**: > 90%
- ✅ **Tempo de resposta (p95)**: 
  - Login: < 1000ms
  - Operações CRUD: < 500ms
- ✅ **Taxa de falhas HTTP**: < 5%

#### Conceitos Aplicados

O teste demonstra os seguintes conceitos de testes de performance:
- ✅ **Stages** (ramp-up, carga constante, ramp-down)
- ✅ **Thresholds** (limites de performance)
- ✅ **Checks** (validações de resposta)
- ✅ **Grupos** (organização de testes)
- ✅ **Métricas customizadas** (Rate, Trend, Counter)
- ✅ **Relatórios HTML e JSON**
- ✅ **Variáveis de ambiente**
- ✅ **Tratamento de erros**

## 📚 Documentação da API

### Endpoints REST

**Base URL:** `http://localhost:3000/api`

#### Autenticação
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Fazer login
- `GET /auth/profile` - Obter perfil (requer token)
- `POST /auth/refresh` - Renovar token (requer token)

#### Tarefas
- `GET /tasks` - Listar tarefas (requer token)
- `GET /tasks/my` - Minhas tarefas (requer token)
- `GET /tasks/:id` - Obter tarefa por ID (requer token)
- `POST /tasks` - Criar tarefa (requer token)
- `PUT /tasks/:id` - Atualizar tarefa (requer token)
- `DELETE /tasks/:id` - Deletar tarefa (requer token)

#### Usuários
- `GET /users` - Listar usuários (admin apenas)
- `GET /users/:id` - Obter usuário por ID (requer token)
- `PUT /users/:id` - Atualizar usuário (requer token)
- `DELETE /users/:id` - Deletar usuário (requer token)
- `POST /users/change-password` - Alterar senha (requer token)

### GraphQL

**Endpoint:** `http://localhost:3000/graphql`

**Playground:** Acesse `http://localhost:3000/graphql` no navegador

#### Exemplos de Queries

**Fazer login:**
```graphql
mutation Login {
  login(input: {
    email: "user@test.com"
    password: "user123"
  }) {
    user {
      id
      name
      email
      role
    }
    token
    expiresIn
  }
}
```

**Listar tarefas:**
```graphql
query GetTasks {
  tasks {
    tasks {
      id
      title
      description
      completed
      priority
      user {
        name
        email
      }
    }
    pagination {
      current
      total
      count
      totalItems
    }
  }
}
```

**Criar tarefa:**
```graphql
mutation CreateTask {
  createTask(input: {
    title: "Nova tarefa"
    description: "Descrição da tarefa"
    priority: HIGH
  }) {
    id
    title
    description
    completed
    priority
    createdAt
  }
}
```

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. 

### Para REST:
Inclua o token no header `Authorization`:
```
Authorization: Bearer <seu-token-jwt>
```

### Para GraphQL:
Inclua o token no header `Authorization` ou use o playground.

### Usuários Padrão:
- **Admin**: `admin@test.com` / `admin123`
- **Usuário**: `user@test.com` / `user123`

## 🔄 Pipeline CI/CD

A pipeline está configurada no GitHub Actions e executa:

1. **Testes Unitários** - Testes dos controllers com Sinon
2. **Testes de Integração** - Testes E2E com Supertest
3. **Análise de Código** - ESLint
4. **Cobertura de Código** - NYC/Istanbul
5. **Auditoria de Segurança** - npm audit
6. **Build e Deploy** - Criação de artefatos

### Status dos Testes:
Os testes são executados automaticamente em:
- Push para `main` ou `develop`
- Pull Requests para `main`
- Múltiplas versões do Node.js (16.x, 18.x, 20.x)

## 📊 Cobertura de Testes

O projeto inclui:

- **Testes E2E (External)**: Testam toda a aplicação via HTTP usando Supertest
- **Testes Unitários**: Testam controllers isoladamente com mocks usando Sinon
- **Testes REST e GraphQL**: Cobertura completa de ambas as interfaces
- **Testes de Performance**: Testes de carga e stress usando K6
- **Mocks e Stubs**: Usando Sinon para isolar dependências

## 🏗️ Arquitetura

### Padrões Utilizados:
- **MVC Pattern**: Controllers, Models e Views bem separados
- **Repository Pattern**: Abstração do acesso aos dados
- **Middleware Pattern**: Autenticação e validação
- **Dependency Injection**: Facilita testes unitários

### Características:
- **Banco em Memória**: Para simplicidade e testes
- **Validação de Dados**: Joi para validação robusta
- **Tratamento de Erros**: Middleware centralizado
- **Rate Limiting**: Proteção contra abuso
- **Segurança**: Helmet, CORS, JWT

## 🚦 Health Check

**Endpoint:** `GET /health`

Retorna status da aplicação:
```json
{
  "status": "OK",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

## 🤝 Contribuição

Este projeto foi desenvolvido como prova acadêmica para demonstrar conhecimentos em:
- Desenvolvimento de APIs REST e GraphQL
- Testes automatizados (unitários, E2E e performance)
- Integração contínua com GitHub Actions
- Testes de performance e carga com K6
- Boas práticas de desenvolvimento Node.js

## 📖 Documentação Adicional

- **Exemplos de API**: Veja `docs/API_Examples.md` para exemplos práticos de uso
- **Validação do Projeto**: Execute `npm run test:validate` para validar toda a estrutura
