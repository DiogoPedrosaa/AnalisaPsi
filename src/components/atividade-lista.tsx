"use client";

import { CalendarDays, Sparkles } from "lucide-react";
import { useState } from "react";
import { BotaoApagar, BotaoEditar } from "@/components/acoes";
import { ReceptividadeBadge } from "@/components/receptividade";
import { excluirAtividade } from "@/lib/actions";
import { corDaFita } from "@/lib/cartao";
import { infoCategoria } from "@/lib/categoria";
import { formatarDataCurta } from "@/lib/dates";
import { avisoExcluirAtividade } from "@/lib/exclusao";
import { observacaoLonga } from "@/lib/observacao";
import type { Atividade } from "@/lib/types";

type Opcoes = {
  /** Esconde o nome da turma em cada cartão (ex.: dentro da pasta da turma). */
  mostrarTurma?: boolean;
  /** Para onde voltar depois de editar uma atividade (vai como `?voltar=`). */
  voltarPara?: string;
};

/**
 * Atividades como cartões-adesivo do diário (ver DESIGN.md › Cartão de atividade), na ordem recebida
 * (a mais recente primeiro). Duas colunas a partir do `md`; `compacta` força uma coluna só.
 */
export function AtividadeLista({ atividades, compacta = false, ...opcoes }: { atividades: Atividade[]; compacta?: boolean } & Opcoes) {
  return (
    <ul className={`grid grid-cols-1 gap-x-6 gap-y-9 pt-3 ${compacta ? "" : "md:grid-cols-2"}`}>
      {atividades.map((a, i) => (
        <CartaoAtividade key={a.id} atividade={a} indice={i} {...opcoes} />
      ))}
    </ul>
  );
}

function CartaoAtividade({
  atividade: a,
  indice,
  mostrarTurma = true,
  voltarPara,
}: { atividade: Atividade; indice: number } & Opcoes) {
  const editar = voltarPara ? `/atividades/${a.id}?voltar=${encodeURIComponent(voltarPara)}` : `/atividades/${a.id}`;
  const categoria = infoCategoria(a.categoria);
  const tema = a.tema.trim();

  return (
    <li className="adesivo relative flex flex-col rounded-2xl bg-card p-5 sm:p-6">
      {/* Fita adesiva com a categoria, colada no topo do cartão */}
      <span className={`washi -mt-8 mb-3 max-w-full self-start px-3 py-0.5 text-[11px] ${corDaFita(indice)}`}>
        <span aria-hidden>{categoria.emoji}</span>
        <span className="min-w-0 truncate">{categoria.label}</span>
      </span>

      <div className="flex-1">
        {/* Linha meta: data (e turma) e selo de engajamento */}
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-xs font-bold text-ink/70">
            <CalendarDays className="size-3.5 text-cereja" aria-hidden />
            {formatarDataCurta(a.data)}
            {mostrarTurma && <span className="text-ink-2">· {a.turma.nome}</span>}
          </span>
          <ReceptividadeBadge valor={a.receptividade} completo />
        </div>

        <h3 className="mb-2 font-display text-xl leading-snug font-extrabold break-words text-ink">{a.titulo}</h3>

        {tema && (
          <p className="mb-3 rounded-xl border border-line/25 bg-ceu-claro/70 px-3 py-1.5 text-xs font-semibold text-ink">
            <span className="font-extrabold text-vinho">Tema / Objetivo:</span> {tema}
          </p>
        )}

        {a.descricao && (
          <div className="mb-3">
            <h4 className="mb-1 text-[11px] font-extrabold tracking-wider text-ink/65 uppercase">Descrição & Materiais</h4>
            <TextoRecolhivel texto={a.descricao} className="text-sm text-ink/90" />
          </div>
        )}

        {a.observacoes && (
          <div className="mt-3 rounded-r-xl border-l-4 border-oliva bg-card-2 p-3">
            <h4 className="mb-1 flex items-center gap-1 text-[11px] font-extrabold tracking-wider text-oliva uppercase">
              <Sparkles className="size-3" aria-hidden />
              Observações da Estagiária
            </h4>
            <TextoRecolhivel texto={`“${a.observacoes}”`} className="text-xs text-ink/90 italic sm:text-sm" />
          </div>
        )}
      </div>

      {/* Rodapé do cartão: Editar e Excluir */}
      <div className="mt-5 flex items-center justify-end gap-2 border-t border-line/15 pt-3">
        <BotaoEditar href={editar} rotulo={`Editar “${a.titulo}”`} texto="Editar" />
        <BotaoApagar
          rotulo={`Apagar “${a.titulo}”`}
          texto="Excluir"
          aviso={avisoExcluirAtividade(a.titulo, a.turma.nome)}
          apagar={() => excluirAtividade(a.id)}
        />
      </div>
    </li>
  );
}

/** Texto do cartão; textos longos começam recolhidos (4 linhas) com "Ler tudo". */
function TextoRecolhivel({ texto, className }: { texto: string; className: string }) {
  const [aberto, setAberto] = useState(false);
  const longo = observacaoLonga(texto);

  return (
    <>
      <p className={`leading-relaxed whitespace-pre-line ${className} ${longo && !aberto ? "line-clamp-4" : ""}`}>{texto}</p>
      {longo && (
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          className="mt-1 text-xs font-bold text-cereja not-italic hover:underline"
        >
          {aberto ? "Mostrar menos" : "Ler tudo"}
        </button>
      )}
    </>
  );
}
