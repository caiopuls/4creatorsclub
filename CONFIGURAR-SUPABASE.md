# 🔧 Configurar Supabase

## Passo 1: Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta (gratuita)
3. Crie um novo projeto
4. Anote as credenciais:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon/public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY) - para APIs server-side

## Passo 2: Criar Tabelas

1. No Supabase, vá em **SQL Editor**
2. Copie e cole o conteúdo do arquivo `supabase-setup.sql`
3. Execute o SQL

Isso criará:
- ✅ Tabela `leads` para armazenar os cadastros
- ✅ Tabela `page_views` para analytics (opcional)
- ✅ Políticas de segurança (RLS)
- ✅ Índices para performance

## Passo 3: Criar Usuário Admin

1. No Supabase, vá em **Authentication** → **Users**
2. Clique em **Add user** → **Create new user**
3. Crie um usuário admin:
   - **Email**: admin@4creatorsclub.com (ou seu email)
   - **Password**: crie uma senha forte
   - ✅ Marque "Auto Confirm User"

## Passo 4: Configurar Variáveis de Ambiente

### Localmente (.env.local)

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

### Em Produção (Vercel)

1. Acesse seu projeto no [Vercel](https://vercel.com)
2. Vá em **Settings** → **Environment Variables**
3. Adicione as mesmas variáveis:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Faça um novo deploy

## Passo 5: Testar

1. Execute `npm run dev`
2. Acesse `http://localhost:3000`
3. Preencha o formulário de cadastro
4. Acesse `http://localhost:3000/admin/login`
5. Faça login com o usuário admin criado
6. Veja os leads no dashboard!

## ✅ Pronto!

Agora todos os leads serão salvos no Supabase e você pode:
- ✅ Ver todos os leads no dashboard
- ✅ Exportar para Excel
- ✅ Ver estatísticas
- ✅ Acessar de qualquer lugar

## 🔒 Segurança

- ✅ RLS (Row Level Security) ativado
- ✅ Apenas admins podem ver os leads
- ✅ Formulário público pode cadastrar leads
- ✅ Autenticação obrigatória para admin

