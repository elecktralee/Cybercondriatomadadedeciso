import React from "react";
import { PESQUISADORA, CEP } from "../config/study";

// Bloco de seção usado nos termos (TCLE, TCLE do responsável e TALE)
export function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="font-semibold text-gray-900 text-base mb-3 pb-1.5 border-b border-gray-100">
        {titulo}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

// Lista de itens com marcador circular
export function Lista({ itens, cor = "indigo" }: { itens: string[]; cor?: "indigo" | "amber" }) {
  const bg = cor === "amber" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700";
  return (
    <ul className="space-y-2">
      {itens.map((t, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className={`flex-shrink-0 w-5 h-5 rounded-full ${bg} text-xs font-bold flex items-center justify-center mt-0.5`}>
            {i + 1}
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

// Contatos da pesquisadora e do CEP
export function Contatos({ mostrarOrientador = true }: { mostrarOrientador?: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm">
        <p className="font-semibold text-gray-800 mb-2">Equipe de Pesquisa</p>
        <p><span className="text-gray-500">Pesquisadora:</span> {PESQUISADORA.nome}</p>
        <p><span className="text-gray-500">E-mail:</span> {PESQUISADORA.email}</p>
        <p><span className="text-gray-500">Telefone:</span> {PESQUISADORA.telefone}</p>
        {mostrarOrientador && (
          <p className="pt-1 border-t border-gray-200 mt-1">
            <span className="text-gray-500">Orientador:</span> {PESQUISADORA.orientador}
          </p>
        )}
      </div>
      <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm">
        <p className="font-semibold text-gray-800 mb-2">Comitê de Ética em Pesquisa</p>
        <p className="font-medium text-gray-700">{CEP.nome}</p>
        <p className="text-gray-500">{CEP.endereco}</p>
        <p><span className="text-gray-500">Fone:</span> {CEP.fone}</p>
        <p><span className="text-gray-500">E-mail:</span> {CEP.email}</p>
        <p className="text-gray-400 text-xs pt-1">{CEP.atendimento}</p>
      </div>
    </div>
  );
}

export const TEXTO_CEP_DUVIDAS =
  "As dúvidas direcionadas ao Comitê de Ética em Pesquisa (CEP) são somente relativas aos aspectos éticos da pesquisa, incluindo denúncias ou reclamações sobre a conduta ética do estudo. Dúvidas sobre o conteúdo da pesquisa devem ser encaminhadas à pesquisadora responsável.";
