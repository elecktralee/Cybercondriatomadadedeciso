import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { StudyLayout } from "../../components/StudyLayout";
import { Secao, Lista, Contatos, TEXTO_CEP_DUVIDAS, BotaoBaixarPDF } from "../../components/TermoBody";
import { requireParticipant, markStepComplete } from "../../utils/storage";
import { TITULO_PESQUISA, TEMPO_ESTIMADO, PESQUISADORA } from "../../config/study";

// TCLE para o pai, a mãe ou o responsável legal de participantes de 16 e 17 anos.
export default function ResponsavelPage() {
  const navigate = useNavigate();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [autorizo, setAutorizo] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => { requireParticipant(); }, []);

  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) setHasScrolled(true);
  };

  const handleAccept = () => {
    markStepComplete("responsavel");
    navigate("/tale");
  };

  return (
    <StudyLayout currentStep="tcle">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="bg-amber-500 px-6 py-5 text-white">
          <h2 className="text-lg font-semibold">TCLE para o responsável legal</h2>
          <p className="text-amber-100 text-sm mt-1">Para pais ou responsáveis legais de participantes de 16 e 17 anos · Resoluções CNS nº 466/2012 e nº 510/2016</p>
        </div>

        <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 text-amber-800 text-sm">
          Esta etapa deve ser lida e aceita pelo pai, pela mãe ou pelo responsável legal. O(A) adolescente
          só poderá continuar depois da sua autorização.
        </div>

        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="px-6 py-6 max-h-[60vh] overflow-y-auto text-sm text-gray-700 leading-relaxed space-y-6"
        >
          <Secao titulo="1. Apresentação da pesquisa">
            <p>
              Prezado(a) responsável, o(a) adolescente sob sua responsabilidade está sendo convidado(a) a
              participar, de forma voluntária, da pesquisa científica intitulada <em>“{TITULO_PESQUISA}”</em>,
              desenvolvida por {PESQUISADORA.nome}, mestranda do Programa de Pós-Graduação em Psicobiologia da
              Universidade de São Paulo, Ribeirão Preto, sob orientação do {PESQUISADORA.orientador}.
            </p>
            <p>
              A participação depende da sua autorização e também do assentimento (aceite) do próprio
              adolescente, que receberá um Termo escrito em linguagem acessível. Antes de decidir, leia
              atentamente as informações abaixo. Em caso de dúvida, não hesite em perguntar.
            </p>
          </Secao>

          <Secao titulo="2. Objetivo da pesquisa">
            <p>
              Esta pesquisa tem como objetivo investigar a relação entre comportamentos de busca de informações
              de saúde na internet (cybercondria), a ansiedade, a autoeficácia e os processos de tomada de
              decisão em jovens de 16 a 25 anos. Busca-se compreender de que forma o uso excessivo ou ansioso
              de fontes digitais de saúde pode influenciar julgamentos e escolhas cotidianas.
            </p>
          </Secao>

          <Secao titulo="3. Procedimentos">
            <p>O(A) adolescente realizará as etapas abaixo em uma única sessão online, e você pode acompanhar se desejar.</p>
            <Lista cor="amber" itens={[
              "Questionário sociodemográfico, com informações como idade, gênero, escolaridade, ocupação, estado civil, renda familiar aproximada, estado onde mora (opcional), horas de uso da internet, frequência de busca de informações de saúde e tipo de acesso a serviços de saúde. Inclui também perguntas sobre saúde, como se há alguma condição crônica diagnosticada, se já recebeu diagnóstico de transtorno de ansiedade e se faz uso regular de medicamentos.",
              "Beck Anxiety Inventory (BAI), inventário de 21 itens sobre sintomas de ansiedade sentidos recentemente.",
              "Cyberchondria Severity Scale (CSS-33), escala de 33 itens sobre a busca de informações de saúde na internet e as reações a essa busca.",
              "General Self-Efficacy Scale (GSE), escala de 10 itens sobre a confiança na própria capacidade de lidar com desafios.",
              "Iowa Gambling Task (IGT), tarefa em que são feitas 100 escolhas entre quatro baralhos de cartas, com dinheiro fictício. Não envolve dinheiro real.",
            ]} />
            <p>O tempo estimado de participação é de aproximadamente {TEMPO_ESTIMADO}. Não há respostas certas ou erradas.</p>
          </Secao>

          <Secao titulo="4. Riscos e desconfortos">
            <p>
              Esta pesquisa apresenta riscos mínimos. Algumas perguntas tratam da saúde, de preocupações com
              saúde e de sintomas de ansiedade, o que pode gerar leve desconforto emocional. A tarefa do IGT
              também pode causar cansaço ou frustração, por envolver perdas fictícias. O(A) adolescente pode
              pausar ou interromper a participação a qualquer momento, sem prejuízo, e pode deixar de responder
              a qualquer pergunta.
            </p>
            <p>
              Se, após participar, o(a) adolescente sentir necessidade de conversar sobre o que sentiu, você pode
              entrar em contato com a pesquisadora pelo e-mail {PESQUISADORA.email}, que orientará sobre serviços
              de apoio psicológico. Em caso de necessidade de apoio imediato, o Centro de Valorização da Vida
              atende gratuitamente, 24 horas, pelo telefone 188.
            </p>
            <p>
              Por se tratar de pesquisa online, existe também um risco, embora pequeno, de violação dos dados
              devido às limitações das tecnologias utilizadas. Para reduzir esse risco, os dados são armazenados
              em ambiente protegido por senha, com acesso restrito à equipe de pesquisa.
            </p>
            <p>Não há coleta de amostras biológicas, nem qualquer procedimento invasivo.</p>
          </Secao>

          <Secao titulo="5. Benefícios">
            <p>
              A participação contribuirá para a produção de conhecimento científico sobre saúde digital e
              comportamento humano, e poderá subsidiar intervenções e políticas de saúde pública relacionadas ao
              uso responsável da internet para fins de saúde. Não há benefício direto e imediato para o(a)
              participante.
            </p>
          </Secao>

          <Secao titulo="6. Voluntariedade e direito de recusa">
            <p>
              A participação é totalmente voluntária. Você e o(a) adolescente têm plena liberdade para recusar a
              participação ou retirar o consentimento em qualquer fase da pesquisa, sem que isso acarrete
              qualquer penalidade, prejuízo ou constrangimento.
            </p>
            <p>
              Para solicitar a exclusão dos dados após o preenchimento, basta enviar um e-mail para{" "}
              {PESQUISADORA.email}. Como as respostas não são ligadas a nome ou a outro dado de identificação,
              poderá não ser possível localizar o questionário individual. Nesse caso, a pesquisadora esclarecerá
              a impossibilidade técnica de exclusão dos dados.
            </p>
          </Secao>

          <Secao titulo="7. Confidencialidade e sigilo">
            <p>
              Todas as informações fornecidas são confidenciais. Os dados serão analisados de forma agregada e
              nenhuma informação que permita a identificação do(a) adolescente será divulgada. As respostas são
              codificadas por um número de identificação. Esta pesquisa não pede nome, CPF, e-mail ou endereço, e
              não registra o endereço IP. Os arquivos com os dados brutos serão armazenados em ambiente protegido
              por senha, com acesso restrito à equipe de pesquisa, e mantidos por um período mínimo de 5 (cinco)
              anos, conforme a Resolução CNS n.º 510/2016.
            </p>
            <p>
              A plataforma também registra automaticamente informações técnicas de acesso, como o tipo de
              dispositivo, o navegador e o sistema operacional utilizados, que servem apenas para verificar o
              funcionamento do sistema.
            </p>
          </Secao>

          <Secao titulo="8. Ressarcimento e indenização">
            <p>
              A participação não acarretará custos, nem haverá qualquer gratificação financeira. Em caso de
              despesas necessárias decorrentes da participação, como o consumo de dados de internet, você ou
              o(a) adolescente serão devidamente ressarcidos pela pesquisadora responsável, mediante
              comprovação, como determina a Resolução CNS n.º 466/2012. Para solicitar o ressarcimento, basta
              entrar em contato pelo e-mail {PESQUISADORA.email}.
            </p>
            <p>
              O(A) participante também terá direito à indenização, caso sofra eventuais danos decorrentes da
              participação na pesquisa.
            </p>
          </Secao>

          <Secao titulo="9. Contatos">
            <p>Para informações, dúvidas ou solicitações relacionadas à pesquisa, entre em contato com a pesquisadora. {TEXTO_CEP_DUVIDAS}</p>
            <Contatos />
            <p className="text-xs text-gray-500">
              CONEP (Comissão Nacional de Ética em Pesquisa): SEPN 510, Norte, Bloco A, 3º Andar, Ed. Ex-INAN,
              Brasília-DF. CEP: 70750-521. Tel.: (61) 3315-5878/5879.
            </p>
          </Secao>

          <Secao titulo="10. Registro da autorização">
            <p>
              Por se tratar de pesquisa online, a autorização será registrada digitalmente. Ao marcar a caixa de
              autorização abaixo, você estará manifestando que é o pai, a mãe ou o responsável legal do(a)
              adolescente e que autoriza, de forma voluntária, a sua participação, após a leitura das informações
              contidas neste Termo. Caso não concorde, apenas feche a página em seu navegador.
            </p>
            <p>Este Termo pode ser baixado em PDF pelo botão abaixo, para impressão ou guarda.</p>
            <div className="pt-1">
              <BotaoBaixarPDF href="/termos/tcle-responsavel.pdf" cor="amber" />
            </div>
          </Secao>

          <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            autorizo ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/50"
          }`}>
            <input type="checkbox" checked={autorizo} onChange={e => setAutorizo(e.target.checked)}
              className="accent-amber-500 w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-800">
              Sou o pai, a mãe ou o responsável legal do(a) adolescente, li este Termo e{" "}
              <strong>autorizo a participação</strong> na pesquisa.
            </span>
          </label>
        </div>

        <div className="px-6 py-5 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/tcle")}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                ← Voltar
              </button>
              <p className="text-xs text-gray-400">
                {!hasScrolled ? "Role até o final para continuar" : !autorizo ? "Marque a autorização para continuar" : "Tudo certo"}
              </p>
            </div>
            <button onClick={handleAccept} disabled={!hasScrolled || !autorizo}
              className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
                hasScrolled && autorizo ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg" : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}>
              Autorizar e continuar →
            </button>
          </div>
        </div>
      </div>
    </StudyLayout>
  );
}
