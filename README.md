# TaskFast AI

**Plataforma de Gerenciamento de Tarefas com Inteligência Artificial**

TaskFast AI é uma aplicação moderna de gerenciamento de tarefas que utiliza IA para sugerir prioridades automaticamente, ajudando usuários a organizarem melhor seu trabalho e aumentarem sua produtividade.

## 🚀 Tecnologias

- **Frontend**: Next.js 15 + TypeScript + TailwindCSS
- **UI Components**: ShadcnUI + Radix UI
- **Backend**: Next.js API Routes
- **Banco de Dados**: SQLite + Prisma ORM
- **IA**: OpenAI API (GPT-4o-mini)
- **Containerização**: Docker + Docker Compose
- **Autenticação**: NextAuth.js

## 📋 Funcionalidades

### MVP (Versão Atual)
- ✅ **CRUD de Tarefas**: Criar, visualizar, editar e excluir tarefas
- ✅ **Sugestões de IA**: Análise automática de prioridades usando OpenAI
- ✅ **Categorização**: Organização por categorias personalizadas
- ✅ **Soft Delete**: Recuperação de tarefas deletadas (30 dias)
- 🔄 **Dashboard**: Visão geral com estatísticas e métricas
- 🔄 **Notificações**: Alertas para prazos próximos
- 🔄 **Autenticação**: Sistema seguro de login/registro

### Funcionalidades Futuras
- 📊 Analytics avançados de produtividade
- 🔔 Notificações push e email
- 👥 Colaboração em equipe
- 📱 App mobile
- 🌐 Integração com calendários

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Docker (opcional, para containerização)
- Chave da API OpenAI

### 1. Clone o Repositório
```bash
git clone <repository-url>
cd task-fast-ai
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure as Variáveis de Ambiente
O arquivo `.env` já está configurado com:
```bash
OPENAI_API_KEY=sua_chave_openai_aqui
DATABASE_URL="file:./dev.db"
```

### 4. Configure o Banco de Dados
```bash
# Gerar o cliente Prisma
npx prisma generate

# Criar e sincronizar o banco de dados
npx prisma db push

# (Opcional) Visualizar o banco de dados
npx prisma studio
```

### 5. Execute o Projeto
```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm run build
npm start
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 🐳 Executar com Docker

### Docker Compose (Recomendado)
```bash
# Construir e executar
docker-compose up --build

# Executar em background
docker-compose up -d

# Parar os serviços
docker-compose down
```

### Docker Manual
```bash
# Construir a imagem
docker build -t taskfast-ai .

# Executar o container
docker run -p 3000:3000 --env-file .env taskfast-ai
```

## 📁 Estrutura do Projeto

```
task-fast-ai/
├── docs/                    # Documentação técnica
│   ├── PRD.md              # Product Requirements Document
│   ├── FRD.md              # Functional Requirements Document
│   ├── ERD.md              # Entity Relationship Diagram
│   ├── use-cases.md        # Casos de uso detalhados
│   ├── project-rules.md    # Regras e padrões do projeto
│   ├── docker-setup.md     # Configuração Docker
│   └── TODO.md             # Lista de tarefas do desenvolvimento
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API Routes
│   │   │   └── tasks/      # Endpoints de tarefas
│   │   └── layout.tsx      # Layout raiz
│   ├── components/         # Componentes React
│   │   ├── ui/             # Componentes base (ShadcnUI)
│   │   └── modules/        # Componentes específicos
│   ├── core/               # Lógica central da aplicação
│   │   ├── providers/      # Context providers
│   │   ├── hooks/          # Custom hooks
│   │   └── layouts/        # Layouts da aplicação
│   └── lib/                # Utilitários e configurações
│       ├── clients/        # Clientes de APIs externas
│       ├── config/         # Configurações
│       ├── utils/          # Funções utilitárias
│       └── prisma.ts       # Cliente Prisma
├── prisma/
│   └── schema.prisma       # Schema do banco de dados
├── docker-compose.yml      # Configuração Docker Compose
├── Dockerfile              # Configuração Docker
└── CHANGELOG.md            # Histórico de mudanças
```

## 🔌 API Endpoints

### Tarefas
- `GET /api/tasks` - Listar tarefas
- `POST /api/tasks` - Criar tarefa
- `GET /api/tasks/[id]` - Obter tarefa específica
- `PUT /api/tasks/[id]` - Atualizar tarefa
- `DELETE /api/tasks/[id]` - Deletar tarefa (soft delete)

### IA
- `POST /api/tasks/prioritize` - Sugerir prioridade com IA
- `GET /api/tasks/prioritize` - Documentação das regras de priorização

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes com coverage
npm run test:coverage

# Testes e2e
npm run test:e2e
```

## 📊 Monitoramento

- **Performance**: Tempo de resposta < 2s
- **IA**: Resposta < 700ms
- **Disponibilidade**: 99.5% uptime
- **Banco**: Query time < 100ms

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Documentação

- [Product Requirements](./docs/PRD.md)
- [Functional Requirements](./docs/FRD.md)
- [Use Cases](./docs/use-cases.md)
- [Database Schema](./docs/ERD.md)
- [Development TODO](./docs/TODO.md)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Rafael Naves**  
Engenheiro de Software Full-Stack

---

**Status do Projeto**: 🟡 Em Desenvolvimento Ativo  
**Versão Atual**: 0.1.0  
**Última Atualização**: 23/07/2025
