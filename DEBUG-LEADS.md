# 🔍 Debug: Leads Não Estão Sendo Salvos

## ✅ Checklist Rápido

### 1. Variáveis de Ambiente (.env.local)

Confirme que o arquivo `.env.local` existe na **raiz do projeto** com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE:**
- Não use aspas nas variáveis
- Não deixe espaços ao redor do `=`
- Reinicie o servidor após criar/modificar `.env.local`

### 2. Reiniciar Servidor

```bash
# Pare o servidor (Ctrl+C)
# Depois:
npm run dev
```

### 3. Verificar Console

Ao submeter o formulário, veja o console do servidor (`npm run dev`). Você deve ver:

```
📥 Recebendo lead: { name: '...', email: '...' }
🔌 Cliente Supabase criado
   URL: https://xxxxx.supabase.co...
   Usando: SERVICE_ROLE_KEY (bypass RLS) ou ANON_KEY (com RLS)
💾 Tentando salvar no Supabase...
✅ Lead salvo no Supabase com sucesso!
```

### 4. Erros Comuns e Soluções

#### Erro: "new row violates row-level security policy"
**Solução**: 
1. Acesse o Supabase Dashboard → SQL Editor
2. Execute:
```sql
DROP POLICY IF EXISTS "Permitir inserção de leads" ON leads;
CREATE POLICY "Permitir inserção de leads" ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

#### Erro: "relation 'leads' does not exist"
**Solução**: Execute o arquivo `supabase-setup.sql` completo no SQL Editor do Supabase

#### Erro: "Configuração do servidor incompleta"
**Solução**: 
- Verifique se o `.env.local` existe
- Verifique se as variáveis têm nomes corretos (exatamente como escrito)
- Reinicie o servidor

#### Nenhum erro, mas não salva
**Solução**:
1. Use a `SUPABASE_SERVICE_ROLE_KEY` (bypassa RLS)
2. Verifique no Supabase Dashboard → Table Editor → leads
3. Veja os logs detalhados no console do servidor

### 5. Testar Diretamente no Supabase

Execute no SQL Editor do Supabase:

```sql
-- Testar inserção direta
INSERT INTO leads (name, email, instagram, whatsapp)
VALUES ('Teste Manual', 'teste@example.com', '@teste', '(51) 99999-9999');

-- Ver se foi salvo
SELECT * FROM leads;
```

Se isso funcionar, o problema está no código. Se não funcionar, o problema está nas políticas RLS.

### 6. Verificar Políticas RLS

No Supabase Dashboard:
1. Vá em **Authentication** → **Policies**
2. Selecione a tabela `leads`
3. Verifique se existe uma política de INSERT para `anon`
4. Se não existir, execute o SQL de setup novamente

### 7. Usar Service Role Key (Mais Fácil)

A forma mais simples é usar `SUPABASE_SERVICE_ROLE_KEY` que bypassa completamente o RLS:

1. No Supabase Dashboard → **Settings** → **API**
2. Copie a **service_role key** (não a anon key!)
3. Cole no `.env.local` como `SUPABASE_SERVICE_ROLE_KEY`
4. Reinicie o servidor

⚠️ **Segurança**: Nunca exponha a service_role_key no cliente! Ela só deve estar no `.env.local` (que não vai pro Git).

## 📞 Se Nada Funcionar

1. Copie todos os logs do console quando você submete o formulário
2. Verifique se apareceu algum erro específico
3. Confirme que as tabelas existem no Supabase Dashboard

