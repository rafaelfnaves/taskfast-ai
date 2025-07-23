# Changelog - TaskFast AI

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-07-23

### Corrigido
- **Layout:** A sidebar de navegação não é mais exibida para usuários não autenticados, garantindo que apenas as páginas de login e registro sejam acessíveis.
- **UI:** O título da página agora é atualizado dinamicamente para refletir a seção atual em que o usuário está navegando (ex: "Tarefas", "Analytics").

## [Unreleased]

### Adicionado
- **Interface Frontend Completa**: Layout responsivo com AppLayout, dashboard e navegação
- **Dashboard Interativo**: Cards de estatísticas, tarefas recentes e alertas
- **Design System**: Tema dark/light mode e componentes acessíveis

### Em Desenvolvimento
- **Sistema de Autenticação**: NextAuth.js com providers e middleware de proteção
- **Integração Frontend-Backend**: Conexão da UI com as APIs implementadas

## [0.2.0] - 2025-07-23

### Adicionado
- **APIs Backend Completas**:
  - `GET /api/tasks` - Listar tarefas com filtros, ordenação e paginação
  - `POST /api/tasks` - Criar nova tarefa com validação completa
  - `GET /api/tasks/[id]` - Obter tarefa específica
  - `PUT /api/tasks/[id]` - Atualizar tarefa existente
  - `DELETE /api/tasks/[id]` - Soft delete com recuperação em 30 dias
  - `POST /api/tasks/prioritize` - Sugestão de prioridade usando OpenAI
  - `GET /api/tasks/prioritize` - Documentação das regras de priorização

- **Integração OpenAI**:
  - Cliente OpenAI configurado com GPT-4o-mini
  - Prompt engineering em português para análise de tarefas
  - Sistema de fallback baseado em regras quando IA não disponível
  - Cache de sugestões para melhor performance
  - Mapeamento de prioridades PT → EN (Alta/Média/Baixa → HIGH/MEDIUM/LOW)

- **Containerização Docker**:
  - Dockerfile otimizado com Node.js 22 Alpine
  - docker-compose.yml com health checks
  - Volume para persistência de dados
  - Configuração de ambiente para produção

- **Componentes ShadcnUI**:
  - 13 componentes base instalados (Button, Input, Card, Dialog, etc.)
  - Sistema de temas configurado (Neutral)
  - Componentes acessíveis com Radix UI

### Melhorado
- **Estrutura do Projeto**:
  - Organização completa src/app, src/components, src/core, src/lib
  - Cliente Prisma singleton para melhor performance
  - Tipos TypeScript definidos para todas as APIs
  - Tratamento de erros padronizado

- **Documentação**:
  - README.md completo com instruções detalhadas
  - Estrutura do projeto documentada
  - Endpoints da API documentados
  - Instruções Docker e desenvolvimento

### Corrigido
- **Tipos TypeScript**: Correção de imports de enums Prisma
- **Validação**: Validação robusta de dados de entrada nas APIs
- **Error Handling**: Tratamento consistente de erros em todas as rotas

## [0.1.0] - 2025-07-23

### Adicionado
- **Projeto Next.js 15**: Criado projeto base com TypeScript, TailwindCSS e ESLint
- **ShadcnUI**: Configurado sistema de componentes com cor base Neutral
- **Prisma ORM**: 
  - Configurado com SQLite como banco de dados
  - Schema criado com tabelas Users e Tasks
  - Enums Priority (HIGH, MEDIUM, LOW) e Status (PENDING, IN_PROGRESS, COMPLETED)
  - Relacionamento one-to-many entre Users e Tasks
  - Suporte a soft delete para tarefas
- **Dependências Principais**:
  - OpenAI SDK para integração com IA
  - Radix UI para componentes acessíveis
  - Next-Auth para autenticação
  - bcryptjs e jsonwebtoken para segurança
  - date-fns para manipulação de datas
- **Estrutura do Projeto**:
  - Pasta docs movida para dentro do projeto
  - Arquivo .env configurado com OPENAI_API_KEY e DATABASE_URL
  - Estrutura de pastas seguindo Next.js 15 App Router

### Configurado
- **Banco de Dados**: SQLite inicializado e sincronizado com schema Prisma
- **Ambiente**: Variáveis de ambiente configuradas (.env)
- **Git**: Repositório inicializado com .gitignore apropriado

### Documentação
- **TODO.md**: Criado na pasta docs com mapeamento completo das tarefas
- **CHANGELOG.md**: Criado na raiz do projeto para rastreamento de mudanças
- **Documentação Técnica**: Todos os arquivos de requisitos mantidos na pasta docs

---

## Próximos Passos

### Em Desenvolvimento
1. **Estrutura de Componentes**: Organização das pastas src/components, src/core, src/lib
2. **Componentes ShadcnUI**: Instalação dos componentes base necessários
3. **Sistema de Autenticação**: Configuração do NextAuth.js
4. **APIs Backend**: Implementação das rotas CRUD para tarefas
5. **Integração IA**: Configuração da OpenAI API para sugestões de prioridade

### Planejado
- Interface de usuário completa
- Dashboard com analytics
- Sistema de notificações
- Containerização com Docker
- Testes e validações

---

## [0.4.0] - 2025-07-23

### Added
- Implementação completa do sistema de autenticação com NextAuth.js
- Páginas de login e registro com validação robusta
- Middleware de proteção de rotas
- Integração com Prisma para gerenciamento de usuários
- Validação de senha com requisitos de segurança
- Feedback visual com notificações toast
- Redirecionamento automático baseado em status de autenticação

### Enhanced
- Interface de usuário aprimorada com componentes ShadcnUI
- Sistema de notificações integrado
- Experiência do usuário otimizada
  - Componentes acessíveis seguindo padrões WCAG

- **Layout e Navegação**:
  - Sidebar colapsável com navegação principal
  - Header com menu de usuário e notificações
  - Breadcrumbs e indicadores de página ativa
  - Menu mobile com overlay para dispositivos pequenos

### Melhorado
- **Experiência do Usuário**:
  - Interface intuitiva e moderna
  - Feedback visual para todas as interações
  - Loading states e transições suaves
  - Mensagens de toast para notificações

- **Performance**:
  - Componentes otimizados com React Server Components
  - Lazy loading para componentes pesados
  - Otimização de bundle com Next.js 15

### Configurado
- **Projeto Executando**: Aplicação rodando em http://localhost:3000
- **Browser Preview**: Interface acessível e testável
- **Estrutura Completa**: Frontend e backend integrados

**Versão Atual:** 0.3.0  
**Status:** 🟡 Em Desenvolvimento Ativo  
**Última Atualização:** 23/07/2025
