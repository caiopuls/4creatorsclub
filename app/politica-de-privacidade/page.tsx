"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PoliticaPrivacidade() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#a9a9a9] hover:text-white transition-colors mb-8"
            >
              ← Voltar para a página inicial
            </Link>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Política de Privacidade
            </h1>

            <p className="text-sm text-[#a9a9a9] mb-8">
              Última atualização: {new Date().toLocaleDateString("pt-BR")}
            </p>

            <div className="prose prose-invert max-w-none space-y-6 text-[#d0d0d0]">
              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">1. Introdução</h2>
                <p>
                  O 4Creators Club (&quot;nós&quot;, &quot;nosso&quot; ou &quot;clube&quot;) está comprometido em proteger sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">2. Informações que Coletamos</h2>
                <p className="mb-4">Coletamos as seguintes informações quando você se inscreve em nossa lista de espera ou utiliza nossos serviços:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Nome completo</li>
                  <li>Endereço de e-mail</li>
                  <li>Número de telefone/WhatsApp (opcional)</li>
                  <li>Instagram handle (opcional)</li>
                  <li>Dados de navegação e interação com o site</li>
                  <li>Informações de pagamento (quando aplicável)</li>
                  <li>Informações profissionais e de negócios (para anúncios no Marketplace)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">3. Dados Públicos no Marketplace</h2>
                <p className="mb-4">
                  Ao criar anúncios de jobs ou startups, certas informações (como nome, empresa, descrição do projeto e valores) tornam-se públicas para outros membros da plataforma. Você reconhece que essas informações são compartilhadas deliberadamente por você para fins de networking e negócios.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">4. Como Utilizamos suas Informações</h2>
                <p className="mb-4">Utilizamos suas informações pessoais para:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Enviar comunicações sobre vagas e novidades do clube</li>
                  <li>Processar inscrições e gerenciar sua conta</li>
                  <li>Melhorar nossos serviços e experiência do usuário</li>
                  <li>Enviar conteúdo relevante e atualizações</li>
                  <li>Cumprir obrigações legais e regulatórias</li>
                  <li>Prevenir fraudes e garantir a segurança dos nossos serviços</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">4. Compartilhamento de Informações</h2>
                <p>
                  Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto nas seguintes situações:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Com seu consentimento explícito</li>
                  <li>Para cumprir obrigações legais ou responder a processos judiciais</li>
                  <li>Com prestadores de serviços confiáveis que nos auxiliam na operação do clube (ex: plataformas de e-mail, processamento de pagamentos), sempre sob rigorosos acordos de confidencialidade</li>
                  <li>Em caso de fusão, aquisição ou venda de ativos, mediante notificação prévia</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">5. Segurança dos Dados</h2>
                <p>
                  Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">6. Seus Direitos</h2>
                <p className="mb-4">De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem o direito de:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Acessar suas informações pessoais</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li>Solicitar a exclusão de dados desnecessários ou tratados em desconformidade com a LGPD</li>
                  <li>Solicitar a portabilidade dos seus dados</li>
                  <li>Revogar seu consentimento a qualquer momento</li>
                  <li>Informar-se sobre entidades públicas e privadas com as quais compartilhamos dados</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">7. Cookies e Tecnologias Similares</h2>
                <p>
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o tráfego do site e personalizar conteúdo. Você pode gerenciar as preferências de cookies através das configurações do seu navegador.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">8. Retenção de Dados</h2>
                <p>
                  Mantemos suas informações pessoais pelo tempo necessário para cumprir os propósitos descritos nesta política, exceto quando um período de retenção mais longo for exigido ou permitido por lei.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">9. Alterações nesta Política</h2>
                <p>
                  Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações significativas publicando a nova política nesta página e atualizando a data de &quot;Última atualização&quot;.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">10. Contato</h2>
                <p className="mb-4">
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade, entre em contato conosco:
                </p>
                <p>
                  <strong>4Creators Club</strong><br />
                  E-mail: contato@4creatorsclub.com<br />
                  WhatsApp: <a href="https://wa.me/5551992615201" className="text-white hover:underline">+55 51 99261-5201</a>
                </p>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-[#1a1a1a]">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#a9a9a9] hover:text-white transition-colors"
              >
                ← Voltar para a página inicial
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

