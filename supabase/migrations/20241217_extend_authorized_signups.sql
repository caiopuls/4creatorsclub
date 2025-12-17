-- Adicionar colunas para rastrear status de pagamento e assinatura
ALTER TABLE authorized_signups 
ADD COLUMN IF NOT EXISTS order_status TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT,
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;
