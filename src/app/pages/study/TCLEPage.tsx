import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { StudyLayout } from "../../components/StudyLayout";
import { Secao, Lista, Contatos, TEXTO_CEP_DUVIDAS, BotaoBaixarPDF } from "../../components/TermoBody";
import { studyApi } from "../../utils/api";
import { requireParticipant, markStepComplete, storage, STORAGE_KEYS } from "../../utils/storage";
import { TITULO_PESQUISA, TEMPO_ESTIMADO, PESQUISADORA } from "../../config/study";

type Faixa = "adulto" | "menor" | "fora" | null;

export default function TCLEPage() {
  const navigate = useNavigate();

  // Etapa 1: pergunta de idade. Etapa 2: TCLE (somente para 18 anos ou mais).
  const [etapa, setEtapa] = useState<"idade" | "termo">("idade");
  const [faixa, setFaixa] = useState<Faixa>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) setHasScrolled(true);
  };

  const continuarIdade = () => {
    if (faixa === "adulto") {
      storage.set(STORAGE_KEYS.AGE_GROUP, "adulto");
      setEtapa("termo");
    } else if (faixa === "menor") {
      storage.set(STORAGE_KEYS.AGE_GROUP, "menor");
      navigate("/responsavel");
    }
  };

  const handleAccept = async () => {
    setLoading(true);
    setError("");
    try {
      const id = requireParticipant();
      await studyApi.consent(id, "adulto");
      markStepComplete("tcle");
      navigate("/sociodemografico");
    } catch {
      setError("Erro ao registrar consentimento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // ── Etapa 1: idade ─────────────────────────────────────────────────────────
  if (etapa === "idade") {
    const opcoes: { v: Exclude<Faixa, null>; texto: React.ReactNode }[] = [
      { v: "adulto", texto: <>Tenho <strong>18 anos ou mais</strong></> },
      { v: "menor",  texto: <>Tenho <strong>16 ou 17 anos</strong></> },
      { v: "fora",   texto: <>Tenho <strong>menos de 16 anos</strong></> },
    ];
    return (
      <StudyLayout currentStep="tcle">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-indigo-600 px-6 py-5 text-white">
            <h2 className="text-lg font-semibold">Antes de começar</h2>
            <p className="text-indigo-200 text-sm mt-1">Esta informação define quais termos se aplicam à sua participação</p>
          </div>
          <div className="px-6 py-6 space-y-3">
            <p className="text-sm text-gray-700">Qual é a sua idade?</p>
            {opcoes.map(o => (
              <label key={o.v} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                faixa === o.v ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}>
                <input type="radio" name="faixa" checked={faixa === o.v} onChange={() => setFaixa(o.v)}
                  className="accent-indigo-600 w-4 h-4 flex-shrink-0" />
                <span className="text-sm text-gray-700">{o.texto}</span>
              </label>
            ))}

            {faixa === "menor" && (
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-xs text-amber-800 leading-relaxed">
                Participantes de 16 e 17 anos precisam da autorização de um responsável legal e do próprio
                assentimento. Na próxima tela, entregue o aparelho ao seu pai, à sua mãe ou ao seu responsável
                legal, para que ele(a) leia e autorize a sua participação.
              </div>
            )}

            {faixa === "fora" && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
                Muito obrigada pelo interesse. Esta pesquisa é destinada a pessoas com 16 anos ou mais, por isso
                não será possível participar. Você pode fechar esta janela.
              </div>
            )}
          </div>
          <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <button onClick={() => navigate("/")}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
              ← Voltar
            </button>
            <button onClick={continuarIdade} disabled={faixa !== "adulto" && faixa !== "menor"}
              className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
                faixa === "adulto" || faixa === "menor"
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}>
              Continuar →
            </button>
          </div>
        </div>
      </StudyLayout>
    );
  }

  // ── Etapa 2: TCLE para 18 anos ou mais ────────────────────────────────────
  return (
    <StudyLayout currentStep="tcle">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="bg-indigo-600 px-6 py-5 text-white">
          <h2 className="text-lg font-semibold">Termo de Consentimento Livre e Esclarecido (TCLE)</h2>
          <p className="text-indigo-200 text-sm mt-1">Para participantes com 18 anos ou mais · Resoluções CNS nº 466/2012 e nº 510/2016 · LGPD</p>
        </div>

        {!hasScrolled && (
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 text-amber-700 text-sm">
            Role até o final para habilitar o aceite
          </div>
        )}

        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="px-6 py-6 max-h-[60vh] overflow-y-auto text-sm text-gray-700 leading-relaxed space-y-6"
        >
          <Secao titulo="1. Apresentação da pesquisa">
            <p>
              Você está sendo convidado(a) a participar, de forma voluntária, da pesquisa intitulada{" "}
              <em>“{TITULO_PESQUISA}”</em>, desenvolvida por {PESQUISADORA.nome}, mestranda do Programa de
              Pós-Graduação em Psicobiologia da Universidade de São Paulo, Ribeirão Preto, sob orientação do{" "}
              {PESQUISADORA.orientador}.
            </p>
            <p>Antes de decidir sobre sua participação, leia atentamente as informações abaixo. Em caso de dúvida, não hesite em perguntar.</p>
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
            <p>
              Podem participar pessoas com idade entre 16 e 25 anos. Este Termo é destinado a participantes com
              18 anos ou mais. Quem tem 16 ou 17 anos participa com a autorização de um responsável legal e com
              o próprio assentimento, em termos específicos.
            </p>
            <p>Caso concorde em participar, você realizará as etapas abaixo em uma única sessão online.</p>
            <Lista itens={[
              "Questionário sociodemográfico, com informações como idade, gênero, escolaridade, ocupação, estado civil, renda familiar aproximada, estado onde mora (opcional), horas de uso da internet, frequência de busca de informações de saúde e tipo de acesso a serviços de saúde. Inclui também perguntas sobre saúde, como se você tem alguma condição crônica diagnosticada, se já recebeu diagnóstico de transtorno de ansiedade e se faz uso regular de medicamentos.",
              "Beck Anxiety Inventory (BAI), inventário de 21 itens sobre sintomas de ansiedade sentidos recentemente.",
              "Cyberchondria Severity Scale (CSS-33), escala de 33 itens sobre a busca de informações de saúde na internet e as reações a essa busca.",
              "General Self-Efficacy Scale (GSE), escala de 10 itens sobre a confiança na própria capacidade de lidar com desafios.",
              "Iowa Gambling Task (IGT), tarefa em que você faz 100 escolhas entre quatro baralhos de cartas, com dinheiro fictício, tentando ganhar o máximo possível. Não envolve dinheiro real.",
            ]} />
            <p>
              O tempo estimado de participação é de aproximadamente <strong>{TEMPO_ESTIMADO}</strong>. Não há
              respostas certas ou erradas. Responda com honestidade, de acordo com sua realidade. A pesquisa é
              realizada com um software desenvolvido especificamente para ela, de forma 100% online.
            </p>
          </Secao>

          <Secao titulo="4. Riscos e desconfortos">
            <p>
              Esta pesquisa apresenta riscos mínimos. Algumas perguntas tratam de sua saúde, de preocupações
              com saúde e de sintomas de ansiedade, o que pode gerar leve desconforto emocional. A tarefa do IGT
              também pode causar cansaço ou frustração, por envolver perdas fictícias. Você pode pausar ou
              interromper sua participação a qualquer momento, sem prejuízo, e pode deixar de responder a
              qualquer pergunta.
            </p>
            <p>
              Se, após participar, sentir necessidade de conversar sobre o que sentiu, entre em contato com a
              pesquisadora pelo e-mail {PESQUISADORA.email}, que orientará sobre serviços de apoio psicológico.
              Em caso de necessidade de apoio imediato, o Centro de Valorização da Vida atende gratuitamente,
              24 horas, pelo telefone 188.
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
              Sua participação contribuirá para a produção de conhecimento científico sobre saúde digital e
              comportamento humano. Os resultados desta pesquisa poderão subsidiar intervenções e políticas de
              saúde pública relacionadas ao uso responsável da internet para fins de saúde. Não há benefício
              direto e imediato para o(a) participante.
            </p>
          </Secao>

          <Secao titulo="6. Voluntariedade e direito de recusa">
            <p>
              Sua participação é totalmente voluntária. Você tem plena liberdade para recusar-se a participar ou
              para retirar seu consentimento em qualquer fase da pesquisa, sem que isso acarrete qualquer
              penalidade, prejuízo ou constrangimento. Você dispõe de tempo para refletir sobre a participação e
              pode consultar outras pessoas antes de decidir.
            </p>
            <p>
              Para solicitar a exclusão de seus dados após o preenchimento, basta enviar um e-mail para{" "}
              {PESQUISADORA.email} informando seu desejo. Como as respostas não são ligadas a nome ou a outro
              dado de identificação, poderá não ser possível localizar o seu questionário individual. Nesse caso,
              a pesquisadora esclarecerá a impossibilidade técnica de exclusão dos dados.
            </p>
          </Secao>

          <Secao titulo="7. Confidencialidade e sigilo">
            <p>
              Todas as informações fornecidas são confidenciais. Os dados serão analisados de forma agregada e
              nenhuma informação que permita sua identificação pessoal será divulgada. As respostas são
              codificadas por um número de identificação. Esta pesquisa não pede seu nome, CPF, e-mail ou
              endereço, e não registra seu endereço IP. Os arquivos com os dados brutos serão armazenados em
              ambiente protegido por senha, com acesso restrito à equipe de pesquisa, e mantidos por um período
              mínimo de 5 (cinco) anos, conforme a Resolução CNS n.º 510/2016.
            </p>
            <p>
              A plataforma também registra automaticamente informações técnicas de acesso, como o tipo de
              dispositivo, o navegador e o sistema operacional utilizados, que servem apenas para verificar o
              funcionamento do sistema. Se quiser saber os resultados da pesquisa quando forem publicados, basta
              pedir pelo e-mail {PESQUISADORA.email}.
            </p>
          </Secao>

          <Secao titulo="8. Ressarcimento e indenização">
            <p>
              A participação nesta pesquisa não acarretará custos, nem haverá qualquer gratificação financeira.
              Em caso de despesas necessárias decorrentes da pesquisa, como o consumo de dados de internet, você
              será devidamente ressarcido pela pesquisadora responsável, mediante comprovação, como determina a
              Resolução CNS n.º 466/2012. Para solicitar o ressarcimento, basta entrar em contato pelo e-mail{" "}
              {PESQUISADORA.email}.
            </p>
            <p>
              Você também terá direito à indenização, caso sofra eventuais danos decorrentes da sua participação
              na pesquisa.
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

          <Secao titulo="10. Registro do consentimento">
            <p>
              Por se tratar de pesquisa online, o consentimento será registrado digitalmente. Ao clicar no botão{" "}
              <strong>“SIM, ACEITO PARTICIPAR”</strong>, você estará manifestando seu consentimento para
              participar, de forma voluntária, após a leitura das informações contidas neste Termo. Caso não
              concorde, apenas feche a página em seu navegador.
            </p>
            <p>Este Termo pode ser baixado em PDF pelo botão abaixo, para impressão ou guarda.</p>
            <div className="pt-1">
              <BotaoBaixarPDF href="/termos/tcle-participante.pdf" />
            </div>
          </Secao>
        </div>

        <div className="px-6 py-5 border-t border-gray-100 bg-gray-50">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-3 text-sm">{error}</div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setEtapa("idade")}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                ← Voltar
              </button>
              <p className="text-xs text-gray-400">
                {!hasScrolled ? "Role até o final para continuar" : "Aceite habilitado"}
              </p>
            </div>
            <button onClick={handleAccept} disabled={!hasScrolled || loading}
              className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
                hasScrolled ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg" : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}>
              {loading ? "Registrando..." : "SIM, ACEITO PARTICIPAR →"}
            </button>
          </div>
        </div>
      </div>
    </StudyLayout>
  );
}
