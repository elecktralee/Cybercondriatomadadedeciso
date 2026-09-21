import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { StudyLayout } from "../../components/StudyLayout";
import { Secao, Contatos, TEXTO_CEP_DUVIDAS } from "../../components/TermoBody";
import { studyApi } from "../../utils/api";
import { requireParticipant, markStepComplete, isStepComplete } from "../../utils/storage";
import { TITULO_PESQUISA, TEMPO_ESTIMADO, PESQUISADORA } from "../../config/study";

// Termo de Assentimento para participantes de 16 e 17 anos.
export default function TALEPage() {
  const navigate = useNavigate();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  // O TALE só é mostrado depois da autorização do responsável.
  useEffect(() => {
    requireParticipant();
    if (!isStepComplete("responsavel")) navigate("/tcle");
  }, [navigate]);

  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) setHasScrolled(true);
  };

  const handleAccept = async () => {
    setLoading(true);
    setError("");
    try {
      const id = requireParticipant();
      await studyApi.consent(id, "menor_responsavel_assentimento");
      markStepComplete("tale");
      markStepComplete("tcle");
      navigate("/sociodemografico");
    } catch {
      setError("Erro ao registrar o assentimento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudyLayout currentStep="tcle">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="bg-amber-500 px-6 py-5 text-white">
          <h2 className="text-lg font-semibold">Termo de Assentimento Livre e Esclarecido (TALE)</h2>
          <p className="text-amber-100 text-sm mt-1">Para participantes de 16 e 17 anos · Resolução CNS nº 466/2012</p>
        </div>

        {!hasScrolled && (
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 text-amber-700 text-sm">
            Role até o final para habilitar o assentimento
          </div>
        )}

        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="px-6 py-6 max-h-[60vh] overflow-y-auto text-sm text-gray-700 leading-relaxed space-y-6"
        >
          <section>
            <p className="text-base text-gray-800">
              Eu, {PESQUISADORA.nome.split(" ")[0]}, pesquisadora da Universidade de São Paulo, convido você a
              participar do estudo <em>“{TITULO_PESQUISA}”</em>. Antes disso, o seu pai, a sua mãe ou o seu
              responsável legal foi informado sobre a pesquisa e autorizou a sua participação. Agora queremos
              saber se você também quer participar.
            </p>
          </section>

          <Secao titulo="O que queremos saber?">
            <p>
              Você já pesquisou algum sintoma ou doença na internet e ficou preocupado achando que tinha algo
              grave? Muitas pessoas fazem isso, e algumas ficam tão ansiosas que não conseguem parar de buscar.
              Isso tem um nome, <strong>cybercondria</strong>.
            </p>
            <p>
              Queremos entender como esse hábito se relaciona com a ansiedade, com a confiança que a pessoa tem
              em si mesma e com a forma como cada um toma decisões. Com isso, esperamos ajudar outras pessoas a
              usar a internet de forma mais saudável.
            </p>
          </Secao>

          <Secao titulo="Como vai ser sua participação?">
            <p>
              A pesquisa é feita completamente pela internet, direto no seu computador, celular ou tablet. Vai
              levar de {TEMPO_ESTIMADO}. Você vai:
            </p>
            <ul className="space-y-2.5">
              {[
                "Responder a perguntas sobre você, como idade, gênero, escolaridade, renda da família, estado onde mora (se quiser) e alguns cuidados com a saúde, como se você usa remédio todo dia, se tem alguma doença de longa duração ou se já teve diagnóstico de ansiedade. Não pedimos seu nome.",
                "Responder a questionários sobre ansiedade, sobre como você busca informações de saúde na internet e sobre o quanto você confia em si mesmo para resolver problemas.",
                "Participar de um jogo de tomada de decisão. Você vai escolher entre quatro baralhos virtuais, com dinheiro de mentira, tentando ganhar o maior saldo possível. Não tem resposta certa, é apenas para entender como cada pessoa decide.",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <p>
              Para isso, será usado um software desenvolvido especialmente para esta pesquisa. Ele funciona
              direto no navegador, sem precisar instalar nada, e registra também o tipo de aparelho e de
              navegador que você usa, só para conferir se o sistema está funcionando bem.
            </p>
          </Secao>

          <Secao titulo="Tem algum risco?">
            <p>
              Não tem nenhum risco físico. É possível que alguma pergunta sobre saúde, sobre ansiedade ou sobre
              hábitos de internet faça você pensar em coisas que te deixem um pouco desconfortável, e o jogo
              pode cansar ou frustrar um pouco. Se isso acontecer, você pode parar quando quiser, e tudo bem.
              Não vai acontecer nada de ruim se você desistir, e você também pode pular qualquer pergunta.
            </p>
            <p>
              Se depois da participação você quiser conversar sobre o que sentiu, você, seus pais ou seu
              responsável podem escrever para a pesquisadora, que vai indicar onde encontrar apoio psicológico.
              Se precisar de ajuda na hora, o Centro de Valorização da Vida atende de graça, 24 horas, pelo
              telefone 188.
            </p>
          </Secao>

          <Secao titulo="Por que sua participação é importante?">
            <p>
              A sua participação vai ajudar os pesquisadores a entender melhor como jovens se comportam quando
              buscam informações de saúde na internet. Com isso, será possível criar formas de ajudar quem sofre
              com ansiedade causada pelo uso excessivo da internet.
            </p>
          </Secao>

          <Secao titulo="Suas informações ficam em sigilo">
            <p>
              Suas respostas não serão mostradas a ninguém fora da equipe de pesquisa. Elas ficam guardadas com
              segurança, ligadas a um número e não ao seu nome, por pelo menos 5 anos. Não pedimos seu nome, seu
              e-mail nem seu endereço, e não registramos o endereço IP do seu aparelho. Os resultados serão
              publicados de forma conjunta, sem identificar nenhum participante.
            </p>
          </Secao>

          <Secao titulo="Você não é obrigado a participar">
            <p>
              Participar é uma escolha sua. Você pode dizer “sim” e participar, mas a qualquer momento pode dizer
              “não” e desistir, e ninguém vai ficar com raiva ou chateado com você. Não tem nenhuma punição ou
              consequência por desistir. Se depois quiser que suas respostas sejam apagadas, escreva para a
              pesquisadora. Como as respostas não têm nome, pode ser que não seja possível achar as suas, e nesse
              caso ela vai explicar.
            </p>
          </Secao>

          <Secao titulo="E se eu gastar alguma coisa?">
            <p>
              Participar não custa nada e não há pagamento. Se você tiver algum gasto por causa da pesquisa, como
              o uso de dados de internet, a pesquisadora devolve o valor, mediante comprovação. Se acontecer
              algum dano por causa da pesquisa, você tem direito a indenização.
            </p>
          </Secao>

          <Secao titulo="Fale com a gente">
            <p>Em caso de dúvidas sobre a pesquisa, você, seus pais ou seu responsável podem falar com a pesquisadora. {TEXTO_CEP_DUVIDAS}</p>
            <Contatos mostrarOrientador={false} />
          </Secao>

          <div className="border-2 border-amber-300 rounded-xl overflow-hidden">
            <div className="bg-amber-50 px-5 py-3 border-b border-amber-200">
              <p className="font-semibold text-amber-900 text-sm">Assentimento</p>
            </div>
            <div className="px-5 py-4 space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                Entendi as coisas ruins e as coisas boas que podem acontecer. Entendi que posso dizer “sim” e
                participar, mas que, a qualquer momento, posso dizer “não” e desistir, e que ninguém vai ficar
                com raiva ou chateado comigo. Os pesquisadores esclareceram minhas dúvidas.
              </p>
              <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                accepted ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/50"
              }`}>
                <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)}
                  className="accent-amber-500 w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-800">
                  Li este Termo de Assentimento, entendi o que foi explicado e <strong>aceito participar da pesquisa</strong>.
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-gray-100 bg-gray-50">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-3 text-sm">{error}</div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/responsavel")}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                ← Voltar
              </button>
              <p className="text-xs text-gray-400">
                {!hasScrolled ? "Role até o final para continuar" : !accepted ? "Marque o assentimento para continuar" : "Tudo certo"}
              </p>
            </div>
            <button onClick={handleAccept} disabled={!hasScrolled || !accepted || loading}
              className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
                hasScrolled && accepted ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg" : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}>
              {loading ? "Registrando..." : "Confirmar assentimento →"}
            </button>
          </div>
        </div>
      </div>
    </StudyLayout>
  );
}
