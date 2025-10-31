# 🔧 Configurar Salvamento de Leads em Produção

## ⚠️ Problema

Em produção (Vercel, Netlify, etc), os arquivos locais são **temporários** e não persistem entre deployments. Por isso, precisamos de uma solução externa.

## ✅ Solução: Google Sheets (Recomendado - Gratuito)

### Passo 1: Criar Planilha no Google Sheets

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha chamada "Leads 4Creators Club"
3. Na primeira linha, adicione os cabeçalhos:
   ```
   Nome | Email | Instagram | WhatsApp | Data | Timestamp
   ```

### Passo 2: Configurar Webhook (Zapier ou Make.com)

#### Opção A: Zapier (Mais Fácil)

1. Crie conta no [Zapier](https://zapier.com) (plano gratuito disponível)
2. Crie um novo "Zap":
   - **Trigger**: "Webhooks by Zapier" → "Catch Hook"
   - **Action**: "Google Sheets" → "Create Spreadsheet Row"
3. Configure:
   - Cole o webhook URL do Zapier
   - Conecte com sua planilha do Google Sheets
   - Mapeie os campos:
     - `name` → Nome
     - `email` → Email
     - `instagram` → Instagram
     - `whatsapp` → WhatsApp
     - `date` → Data
     - `timestamp` → Timestamp

#### Opção B: Make.com (Gratuito até 1000 operações/mês)

1. Crie conta no [Make.com](https://make.com)
2. Crie um novo cenário:
   - **Trigger**: "Webhook" → "Custom webhook"
   - **Action**: "Google Sheets" → "Add a row"
3. Configure da mesma forma que o Zapier

#### Opção C: Google Apps Script (100% Gratuito, sem limites)

1. Na sua planilha do Google Sheets
2. Vá em **Extensões** → **Apps Script**
3. Cole este código:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.name,
      data.email,
      data.instagram || '',
      data.whatsapp || '',
      data.date,
      data.timestamp
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Salve e faça **Deploy** → **Web app**
5. Execute como: "Eu"
6. Permissão de acesso: "Qualquer pessoa"
7. Copie a URL do web app

### Passo 3: Configurar Variável de Ambiente na Vercel

1. Acesse seu projeto no [Vercel](https://vercel.com)
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   - **Nome**: `GOOGLE_SHEETS_WEBHOOK_URL` ou `WEBHOOK_URL`
   - **Valor**: Cole a URL do webhook que você criou
4. Salve e faça um novo deploy

## 🎯 Alternativas (Se não quiser usar Google Sheets)

### Opção 1: Resend (Enviar por Email)
- Envia um email para você a cada lead
- Setup em 5 minutos
- Ver: `INTEGRACAO-EMAIL.md`

### Opção 2: Banco de Dados
- **Supabase** (gratuito até 500MB)
- **MongoDB Atlas** (gratuito até 512MB)
- **PlanetScale** (gratuito para começar)

### Opção 3: Notion
- Usa Notion API para salvar em um banco de dados visual
- Mais organizado e fácil de gerenciar

## 🧪 Testar

1. Faça o deploy na Vercel
2. Preencha o formulário no site
3. Verifique se o lead apareceu:
   - No Google Sheets (se configurou)
   - Ou no email (se configurou Resend)

## ✅ Pronto!

Agora todos os leads em **produção** serão salvos automaticamente! 🎉

