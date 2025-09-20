# IdiomaX - Instruções para Agentes IA

## Arquitetura Geral
Este é um sistema de gestão para escolas de idiomas com arquitetura **monorepo pnpm** dividida em:
- `api/` - Backend Fastify + Prisma + PostgreSQL + Stripe
- `app/` - Frontend React + Vite + shadcn/ui + TailwindCSS  
- `packages/http-schemas/` - Schemas Zod compartilhados entre API e frontend

## Comandos Essenciais
```bash
# Desenvolvimento completo
pnpm dev                 # Inicia API + frontend simultaneamente
pnpm docker             # Inicia PostgreSQL local (porta 5433)

# Backend específico  
cd api && pnpm dev      # API em localhost:3030 (porta configurável via ENV)
pnpm db:migrate:dev     # Migração Prisma + nome descritivo
pnpm db:studio          # Interface visual do banco
pnpm db:seed            # Popular dados iniciais

# Frontend específico
cd app && pnpm dev      # Frontend em localhost:5173
```

## Padrões de Código

### Backend (Fastify + Prisma)
- **Controllers**: Um arquivo por endpoint em `/controllers/[area]/[acao].ts`
- **Schemas**: Importados de `@idiomax/http-schemas/[endpoint]` 
- **Autenticação**: Middleware `auth.ts` com hook `request.getCurrentUserId()`
- **Validação**: Zod schemas com `fastify-type-provider-zod`
- **Tratamento de erros**: Classes customizadas em `controllers/_errors/`

Exemplo de controller:
```typescript
export async function MinhaRota(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
    .post('/rota', {
      schema: {
        tags: ['Categoria'],
        body: meuRequestSchema,
        response: { 200: meuResponseSchema }
      }
    }, async (request) => {
      const userId = await request.getCurrentUserId()
      // lógica aqui
    })
}
```

### Frontend (React + shadcn/ui)
- **Rotas**: Declaradas em `/routes/index.tsx` com `PrivateRoute` e `PaidRoute`
- **Autenticação**: Context `SessionProvider` com perfil + empresa atual
- **API**: Cliente axios em `/lib/api.ts` + React Query para cache
- **UI**: Componentes shadcn/ui em `/components/ui/`
- **Formulários**: react-hook-form + Zod resolvers

Estrutura de página típica:
```tsx
export function MinhaPagina() {
  const { userProfile, currentCompanyMember } = useSession()
  const { data } = useQuery({
    queryKey: ['meus-dados'],
    queryFn: () => minhaApiCall()
  })
  
  return <div>...</div>
}
```

## Modelos de Dados Importantes
- **users** → **members** → **companies** (relação many-to-many com roles)
- **companies** → **courses** → **levels** → **disciplines** → **tasks**
- **registrations** (matrículas) com **monthly_fee** e **records_of_students**  
- **Stripe*** models para assinaturas SaaS: produtos, preços, customers, subscriptions

## Integrações Críticas
- **Stripe**: Webhooks em `/stripe/stripe-web-hooks.ts`, produtos/preços sincronizados no DB
- **Nodemailer**: Recovery de senha com templates em `/mails/`
- **JWT**: Tokens com expiração de 7 dias, secret em env
- **Vercel**: Deploy configurado com `vercel.json` no backend e frontend

## Convenções Específicas
- Workspace schemas em `packages/http-schemas/` são importados como `@idiomax/http-schemas/[file]`
- Migrações Prisma sempre com nomes descritivos via `pnpm db:migrate:dev`
- Roles: `STUDENT`, `TEACHER`, `ADMIN` (enum no Prisma)
- Multi-tenancy por `companies_id` em quase todas as entidades
- Autenticação por `username` (não email) no login

## Desenvolvimento
- PostgreSQL local via Docker na porta 5433
- Hot reload em ambos os projetos via `tsx watch` e Vite
- Documentação automática da API em `/docs` (Swagger)
- Session context gerencia empresa ativa via query params `?company=id`

## Estrutura de Permissões
Sistema baseado em **members** table que relaciona users ↔ companies com role específica. O contexto de sessão sempre inclui a empresa ativa e role do usuário atual.