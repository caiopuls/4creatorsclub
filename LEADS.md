# 📋 Gerenciamento de Leads

Os leads cadastrados na lista de espera são salvos automaticamente, mas de forma diferente dependendo do ambiente:

## 🖥️ Desenvolvimento (Local)

Os leads são salvos na pasta `data/` na raiz do projeto:
- `data/leads.json` - Formato JSON estruturado
- `data/leads.csv` - Formato CSV para abrir no Excel/Google Sheets

## 🌐 Produção (Vercel/Netlify)

⚠️ **IMPORTANTE**: Em produção, os arquivos locais são temporários e não persistem!

Você **DEVE** configurar um webhook para salvar os leads. Veja: `CONFIGURAR-PRODUCAO.md`

**Opções recomendadas:**
- ✅ Google Sheets via Webhook (Zapier/Make.com)
- ✅ Google Apps Script (100% gratuito)
- ✅ Enviar por email (Resend)
- ✅ Banco de dados (Supabase, MongoDB)

## 📊 Formato dos Dados

### JSON (`leads.json`)
```json
[
  {
    "id": "lead-1234567890-abc123",
    "name": "João Silva",
    "email": "joao@email.com",
    "handle": "@joaosilva",
    "whatsapp": "(51) 99999-9999",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "date": "15/01/2024 07:30"
  }
]
```

### CSV (`leads.csv`)
Arquivo CSV com colunas:
- ID
- Nome
- Email
- Instagram
- WhatsApp
- Data (formato brasileiro)
- Timestamp (ISO)

## ✅ Funcionalidades

- ✅ Salva automaticamente todos os leads
- ✅ Valida email duplicado (não permite cadastros repetidos)
- ✅ Formato JSON e CSV
- ✅ Data e hora em formato brasileiro
- ✅ ID único para cada lead

## 🔒 Segurança

A pasta `data/` está no `.gitignore`, então os leads não serão commitados no Git por questões de privacidade.

## 📧 Próximos Passos (Opcional)

Você pode adicionar integração com:
- **Email**: Resend, SendGrid, Nodemailer
- **Google Sheets**: Para visualização online
- **Notion**: Para gerenciamento de leads
- **Webhook**: Zapier, Make.com para automações

## 📂 Acessar os Leads

### Localmente (desenvolvimento)
Os arquivos estão em: `4c-club-lp/data/`

### Em produção (Vercel)
Os arquivos ficam no servidor temporariamente. Para persistência, recomenda-se:
1. Banco de dados (PostgreSQL, MongoDB)
2. Google Sheets API
3. Webhook para salvar externamente

