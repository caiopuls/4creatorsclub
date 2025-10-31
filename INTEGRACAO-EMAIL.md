# 🔧 Guia de Integração de Email

Este guia mostra como configurar a integração de email para receber os leads.

## 🎯 Opções Disponíveis

### 1. Resend (Recomendado) ⭐

**Prós:** Simples, rápido, ótimo para começar
**Contras:** Requer configuração de domínio para produção

#### Configuração:

```bash
cd 4c-club-lp
npm install resend
```

Crie `.env.local`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

No arquivo `app/api/waitlist/route.ts`, descomente o código do Resend e configure seu email.

**IMPORTANTE**: O arquivo de exemplo está em `app/api/waitlist/example-resend.ts.txt` - use-o como referência!

### 2. SendGrid

**Prós:** Robusto, escalável, analytics completos
**Contras:** Mais complexo de configurar

```bash
npm install @sendgrid/mail
```

```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

await sgMail.send({
  to: 'seu-email@exemplo.com',
  from: 'noreply@seudominio.com',
  subject: `Nova inscrição: ${name}`,
  html: '...',
});
```

### 3. Webhook (Zapier / Make)

**Prós:** Visual, sem código, automações poderosas
**Contras:** Dependente de serviço externo

#### Configuração Zapier:

1. Crie um webhook no Zapier
2. Use a URL do webhook no `route.ts`:

```typescript
await fetch('https://hooks.zapier.com/hooks/catch/xxxxx/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

### 4. EmailJS

**Prós:** Não precisa de backend
**Contras:** Chaves expostas no cliente

```bash
npm install @emailjs/browser
```

Configure no componente `WaitlistModal.tsx`.

### 5. Google Sheets API

**Prós:** Salva tudo em planilha
**Contras:** Requer setup do Google Cloud

Importe: `npm install googleapis`

### 6. Notion API

**Prós:** Interface visual, banco de dados
**Contras:** Requer setup do Notion

Importe: `npm install @notionhq/client`

## 🚀 Setup Rápido (Resend)

1. **Crie conta no Resend**: https://resend.com
2. **Gere API Key** no dashboard
3. **Configure domínio** (ou use domínio de teste)
4. **Instale pacote**:
   ```bash
   cd 4c-club-lp
   npm install resend
   ```
5. **Configure .env.local**:
   ```env
   RESEND_API_KEY=re_sua_chave_aqui
   ```
6. **Descomente e edite o código** em `app/api/waitlist/route.ts`
7. **Insira seu email** na linha `to: "seu-email@exemplo.com"`

## 📧 Template de Email

O template incluído tem:
- ✅ Design responsivo
- ✅ Informações organizadas
- ✅ Timestamp da inscrição
- ✅ Suporte a campos opcionais

## 🧪 Teste Local

```bash
npm run dev
```

Abra http://localhost:3000 e teste o formulário.

## 🔒 Segurança

- ✅ Validação de formulário com Zod
- ✅ Proteção contra bots (adicionar reCAPTCHA se necessário)
- ✅ Rate limiting recomendado
- ✅ HTTPS obrigatório em produção

## 📊 Tracking

Para rastrear conversões, adicione:

- Google Analytics Events
- Facebook Pixel
- LinkedIn Insight Tag
- Hotjar
- etc.

## 🎯 Próximos Passos

1. Configure integração de email escolhida
2. Teste localmente
3. Deploy em produção
4. Configure tracking
5. A/B test de formulário
6. Automação de follow-up

## 💡 Dica

Para produção, considere:
- Armazenar leads em banco de dados
- Enviar confirmação automática para o lead
- Integrar com CRM (HubSpot, RD Station, etc.)
- Criar sequência de emails automatizados
