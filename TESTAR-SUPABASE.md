# 🧪 Como Testar se o Supabase Está Funcionando

## 1. Verificar Variáveis de Ambiente

Confirme que o arquivo `.env.local` existe e contém:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

⚠️ **IMPORTANTE**: 
- Reinicie o servidor (`npm run dev`) após criar/modificar o `.env.local`
- As variáveis `NEXT_PUBLIC_*` são expostas ao cliente
- A `SUPABASE_SERVICE_ROLE_KEY` deve ser mantida segura

## 2. Verificar Console do Servidor

Quando você submeter o formulário, veja o console onde o `npm run dev` está rodando. Você deve ver:

```
📥 Recebendo lead: { name: '...', email: '...' }
🔌 Cliente Supabase criado
💾 Tentando salvar no Supabase...
✅ Lead salvo no Supabase com sucesso!
```

Se aparecer erro, veja a mensagem completa.

## 3. Verificar no Supabase Dashboard

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Table Editor**
3. Selecione a tabela `leads`
4. Veja se os dados foram salvos

## 4. Problemas Comuns

### Erro: "new row violates row-level security policy"
**Solução**: Verifique se a política RLS está correta. Execute novamente o SQL:
```sql
DROP POLICY IF EXISTS "Permitir inserção de leads" ON leads;
CREATE POLICY "Permitir inserção de leads" ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

### Erro: "relation 'leads' does not exist"
**Solução**: Execute o arquivo `supabase-setup.sql` completo no SQL Editor do Supabase

### Erro: Variáveis não configuradas
**Solução**: 
- Verifique se o `.env.local` existe na raiz do projeto
- Reinicie o servidor (`Ctrl+C` e depois `npm run dev`)
- Não use espaços ao redor do `=` no `.env.local`

### Leads não aparecem no dashboard admin
**Solução**: Verifique se você está logado no `/admin/login` com um usuário criado no Supabase

## 5. Testar Manualmente via API

Você pode testar diretamente via curl:

```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@example.com",
    "handle": "@teste",
    "whatsapp": "(51) 99999-9999"
  }'
```

Ou via Postman/Insomnia.

## 6. Verificar Logs Detalhados

Os logs agora mostram:
- ✅ Se as variáveis estão configuradas
- ✅ Se o cliente Supabase foi criado
- ✅ Erros detalhados do Supabase (código, mensagem, detalhes)

Se ainda não funcionar, copie os logs completos do console e verifique o erro específico.

