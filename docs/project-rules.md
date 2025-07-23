# Project Rules | TaskFast AI

## Core Principles
- Follow SOLID principles and Clean Architecture patterns
- Apply Lean development practices with AI-first approach
- Code must be reviewed before completion
- All code comments must be in English
- Use conventional market naming conventions (camelCase for JS/TS)

## Project Structure | Next.js 15 | TypeScript | Tailwind CSS | Prisma | SQLite

task-fast-ai/
├── public/                     # Static assets (images, fonts)
├── src/                        # Our main application source
│   ├── app/                    # App Router: routes, layouts, pages, API routes
│   │   ├── api/                # API endpoints (route.ts files)
│   │   └── layout.tsx          # Root layout for the application
│   │
│   ├── components/             # Shared React components (UI-focused)
│   │   ├── ui/                 # Basic, reusable UI elements (Button, Input)
│   │   └── modules/            # (or features/) Larger, feature-specific components
│   │
│   ├── core/                   # Application-wide core logic & providers
│   │   ├── providers/          # Global context providers (QueryProvider, SessionProvider)
│   │   ├── hooks/              # Global custom hooks
│   │   ├── layouts/            # Foundational layout structures (CoreAppShell)
│   │   └── styles/             # Core/foundational styling (optional)
│   │
│   ├── lib/                    # Libraries, helpers, configurations, constants
│   │   ├── constants/          # App-wide static constants (e.g., asset paths)
│   │   ├── config/             # Configurations (e.g., API endpoints from env)
│   │   ├── utils/              # Utility functions
│   │   └── clients/            # API client configurations
│   │
│   ├── styles/                 # Global stylesheets (globals.css)
│   └── middleware.ts           # Next.js middleware
│
├── .env.local                  # Environment variables
├── next.config.js
├── package.json
└── tsconfig.json

## Setup Core
Project Setup:
 - Create Next.js project with TypeScript
 - Configure Prisma + SQLite
 - Setup Tailwind CSS + Shadcn UI
 - Configure environment variables (exists in root of project .env with OPENAI_API_KEY)
 - Organized folder structure

## Frontend Core

Objective: Functional and responsive interface
Tasks:
1. Base Layout:
 - Header with navigation
 - Responsive sidebar
 - Basic footer
2. Main Components:
 - Task list
 - Creation form
 - Task card with actions
 - Edit modal
 - Loading states

## Backend Core and integration with AI

Objective: Functional APIs with artificial intelligence
Tasks:
1. Basic APIs:
 - GET /api/tasks - List tasks
 - POST /api/tasks - Create task
 - PUT /api/tasks/[id] - Update task
 - DELETE /api/tasks/[id] - Delete task
2. AI Integration:
 - POST /api/tasks/prioritize - Suggest priority
 - Prompt engineering for task analysis
 - Retry system and error handling

### Prompt AI suggestions:
Analise esta tarefa e sugira uma prioridade (Alta/Média/Baixa):
  Título: {title}
  Descrição: {description}
  Prazo: {deadline}

Responda apenas: {'priority': 'Alta|Média|Baixa', 'reason': 'explicação breve'}

## Docker and Infrastructure

Objective: Containerized application with Docker

- Create docker-compose.yml
- Create optimized Dockerfile
- Scripts to build and run docker
- Connect all apis
- Global loading states
- client side validations
