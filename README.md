# 4Creators Club - Landing Page

Landing page profissional e responsiva para o 4Creators Club, uma lista de espera para creators do mercado digital.

## 🚀 Tecnologias

- **Next.js 16** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização moderna
- **Framer Motion** - Animações fluidas
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de dados

## ✨ Funcionalidades

- ✅ Design moderno e responsivo
- ✅ Animações suaves e profissionais
- ✅ Modal de formulário funcional
- ✅ Validação de formulário em tempo real
- ✅ Seção de estatísticas animadas
- ✅ Social proof com depoimentos
- ✅ Navegação fluida e intuitiva
- ✅ SEO otimizado

## 🎨 Seções

1. **Hero** - Chamada principal com CTA
2. **Stats** - Estatísticas animadas
3. **Benefits** - Benefícios e diferenciais
4. **Testimonials** - Depoimentos de membros
5. **CTA** - Chamada final para ação
6. **Footer** - Rodapé simples

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start
```

## 🔧 Configuração

### Integração de Email

A API está configurada para receber formulários em `/api/waitlist`. Você pode integrar com:

- **Resend** - Recomendado para envio de emails
- **SendGrid** - Alternativa robusta
- **EmailJS** - Solução simples sem backend
- **Webhook** - Zapier, Make, etc.
- **Google Sheets API** - Salvar em planilha
- **Notion API** - Banco de dados

Exemplo com Resend no arquivo `app/api/waitlist/route.ts`:

```typescript
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: "noreply@4creatorsclub.com",
  to: "seu-email@exemplo.com",
  subject: `Nova inscrição: ${name}`,
  html: `...`,
});
```

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
RESEND_API_KEY=seu_api_key_aqui
```

## 📱 Responsividade

- Mobile First
- Breakpoints: 640px, 900px, 1024px
- Grid adaptativo
- Tipografia fluida

## 🎯 Performance

- Otimização de imagens com Next/Image
- Lazy loading automático
- Animações otimizadas com Framer Motion
- CSS custom properties
- Fontes otimizadas

## 📝 Próximos Passos

1. Configurar integração de email real
2. Adicionar Google Analytics
3. Implementar A/B testing
4. Adicionar pixel de rastreamento (Meta, Google, etc.)
5. Configurar CRM (HubSpot, RD Station, etc.)
6. Adicionar mais animações
7. Criar versões de landing page diferentes

## 🤝 Contribuindo

Sinta-se à vontade para abrir issues e pull requests!

## 📄 Licença

MIT