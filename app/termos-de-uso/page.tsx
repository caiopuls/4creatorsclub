"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TermosUso() {
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
              Termos de Uso
            </h1>

            <p className="text-sm text-[#a9a9a9] mb-8">
              Última atualização: {new Date().toLocaleDateString("pt-BR")}
            </p>

            <div className="prose prose-invert max-w-none space-y-6 text-[#d0d0d0]">
              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">1. Aceitação dos Termos</h2>
                <p>
                  Ao acessar e utilizar o site do 4Creators Club (&quot;Site&quot;) e nossos serviços, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve utilizar nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">2. Descrição do Serviço</h2>
                <p className="mb-4">
                  O 4Creators Club é um clube privado que oferece:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Conteúdos gravados sobre marketing orgânico, criação de conteúdo e negócios digitais</li>
                  <li>Cases reais de creators e estratégias comprovadas</li>
                  <li>Ferramentas e softwares com desconto</li>
                  <li>Networking entre creators e empresários</li>
                  <li>Acesso a uma comunidade exclusiva</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">3. Elegibilidade e Inscrição</h2>
                <p className="mb-4">
                  Para utilizar nossos serviços, você deve:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Ter pelo menos 18 anos de idade ou ter autorização de um responsável legal</li>
                  <li>Fornecer informações precisas e completas durante o cadastro</li>
                  <li>Manter a segurança de sua conta e senha</li>
                  <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</li>
                  <li>Ser responsável por todas as atividades que ocorram sob sua conta</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">4. Uso Adequado</h2>
                <p className="mb-4">Você concorda em não:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Usar o serviço para fins ilegais ou não autorizados</li>
                  <li>Violar qualquer lei local, estadual, nacional ou internacional</li>
                  <li>Infringir direitos de propriedade intelectual de terceiros</li>
                  <li>Transmitir vírus, malware ou qualquer código malicioso</li>
                  <li>Interferir ou interromper o funcionamento do serviço</li>
                  <li>Compartilhar, revender ou redistribuir conteúdo exclusivo sem autorização</li>
                  <li>Usar bots, scripts automatizados ou métodos similares para acessar o serviço</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">5. Propriedade Intelectual</h2>
                <p className="mb-4">
                  Todo o conteúdo disponibilizado pelo 4Creators Club, incluindo mas não limitado a textos, gráficos, logos, imagens, áudios, vídeos e softwares, é propriedade do clube ou de seus fornecedores de conteúdo e é protegido por leis de direitos autorais e outras leis de propriedade intelectual.
                </p>
                <p>
                  Você recebe uma licença limitada, não exclusiva, não transferível e revogável para acessar e usar o conteúdo exclusivamente para fins pessoais e educacionais, conforme previsto nestes termos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">6. Pagamentos e Reembolsos</h2>
                <p className="mb-4">
                  Caso seja necessário pagamento para acessar certos serviços:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Os preços são estabelecidos no momento da compra e podem estar sujeitos a alterações</li>
                  <li>O pagamento deve ser feito através dos métodos aceitos pelo clube</li>
                  <li>Política de reembolso está sujeita aos termos específicos de cada produto ou serviço</li>
                  <li>Reservamo-nos o direito de modificar preços com aviso prévio</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">7. Marketplace (Jobs e Startups)</h2>
                <p className="mb-4">
                  O 4Creators Club disponibiliza um espaço para que membros anunciem serviços (Jobs) e oportunidades de negócio (Startups). Ao utilizar essa funcionalidade, você concorda que:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Você é o único responsável pela veracidade das informações publicadas em seus anúncios.</li>
                  <li>O 4Creators Club atua apenas como facilitador da conexão e não participa, intermedeia ou garante qualquer transação, contratação ou pagamento entre as partes.</li>
                  <li>Qualquer acordo, contrato ou pagamento é de responsabilidade exclusiva dos usuários envolvidos.</li>
                  <li>Reservamo-nos o direito de remover qualquer anúncio que viole nossas diretrizes ou a legislação vigente, sem aviso prévio.</li>
                  <li>É proibido anunciar serviços ou produtos ilegais, fraudulentos ou que violem direitos de terceiros.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">8. Limitação de Responsabilidade</h2>
                <p>
                  O 4Creators Club não se responsabiliza por danos diretos, indiretos, incidentais, especiais ou consequenciais resultantes do uso ou incapacidade de usar nossos serviços, incluindo negociações no Marketplace. O uso do conteúdo e das ferramentas é por sua conta e risco.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">8. Modificações do Serviço</h2>
                <p>
                  Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer aspecto do serviço a qualquer momento, com ou sem aviso prévio. Não seremos responsáveis por você ou por terceiros por qualquer modificação, suspensão ou descontinuação do serviço.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">9. Rescisão</h2>
                <p className="mb-4">
                  Podemos encerrar ou suspender seu acesso imediatamente, sem aviso prévio ou responsabilidade, por qualquer motivo, incluindo, entre outros, se você violar estes Termos de Uso.
                </p>
                <p>
                  Ao encerrar, seu direito de usar o serviço cessará imediatamente. Todas as disposições dos Termos que, por sua natureza, devem sobreviver à rescisão, permanecerão em vigor após a rescisão.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">10. Lei Aplicável</h2>
                <p>
                  Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer disputa relacionada a estes termos será resolvida nos tribunais competentes do Brasil.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">11. Alterações nos Termos</h2>
                <p>
                  Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Alterações significativas serão notificadas através do site ou por e-mail. O uso continuado do serviço após as alterações constitui aceitação dos novos termos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 mt-8">12. Contato</h2>
                <p className="mb-4">
                  Para questões sobre estes Termos de Uso, entre em contato:
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

