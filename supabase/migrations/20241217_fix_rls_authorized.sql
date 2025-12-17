-- Liberar inserção via Webhook (público mas protegido pelo token no código)
CREATE POLICY "Allow public insert with token check"
ON authorized_signups FOR INSERT
TO public
WITH CHECK (true);

-- Liberar leitura para o usuário verificar o email no setup-account
CREATE POLICY "Allow public select for email verification"
ON authorized_signups FOR SELECT
TO public
USING (status = 'pending');
