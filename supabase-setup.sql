-- SQL para criar as tabelas no Supabase
-- Execute este SQL no SQL Editor do Supabase

-- 1. Criar tabela de leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  instagram TEXT,
  whatsapp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar tabela para analytics (page views)
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT,
  page_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Criar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- 5. Remover política existente se houver e criar nova
DROP POLICY IF EXISTS "Permitir inserção de leads" ON leads;
CREATE POLICY "Permitir inserção de leads" ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 5.1. Também permitir inserção com service_role (para APIs server-side)
DROP POLICY IF EXISTS "Permitir inserção de leads service_role" ON leads;
CREATE POLICY "Permitir inserção de leads service_role" ON leads
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 6. Política: Apenas usuários autenticados podem ler leads
CREATE POLICY "Permitir leitura de leads para admins" ON leads
  FOR SELECT
  TO authenticated
  USING (true);

-- 7. Política: Qualquer um pode inserir page views
CREATE POLICY "Permitir inserção de page views" ON page_views
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 8. Política: Apenas usuários autenticados podem ler page views
CREATE POLICY "Permitir leitura de page views para admins" ON page_views
  FOR SELECT
  TO authenticated
  USING (true);

