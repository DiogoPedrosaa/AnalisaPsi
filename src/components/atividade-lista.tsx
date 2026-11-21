"use client";

import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { BotaoApagar, BotaoEditar } from "@/components/acoes";
import { ReceptividadeBadge } from "@/components/receptividade";
import { TagDot } from "@/components/tag-chip";
import { excluirAtividade } from "@/lib/actions";
import { corDaFita, rotuloDaFita } from "@/lib/cartao";
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
 * Atividades como cartões-adesivo (ver DESIGN.md › Cartão de atividade), na ordem recebida
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
  return (
    <li className="adesivo relative flex flex-col rounded-2xl bg-card p-5 sm:p-6">
      {/* Fita adesiva com as tags, colada no topo do cartão */}
      <span className={`washi -mt-8 mb-3 max-w-full self-start px-3 py-0.5 text-[11px] ${corDaFita(indice)}`}>
        {a.tags.length > 0 ? (
          a.tags.map((t) => <TagDot key={t.id} cor={t.cor} className="size-2 ring-1 ring-line/40" />)
        ) : (
          <span aria-hidden>✨</span>
        )}
        <span className="min-w-0 truncate">{rotuloDaFita(a.tags)}</span>
      </span>

      <div className="flex-1">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-xs font-bold text-ink-2">
            <CalendarDays className="size-3.5 text-cereja" aria-hidden />
            {formatarDataCurta(a.data, true)}
          </span>
          <ReceptividadeBadge valor={a.receptividade} />
        </div>

        <h3 className="mb-2 font-display text-xl leading-snug font-extrabold break-words text-ink">{a.titulo}</h3>

        {mostrarTurma && (
          <p className="mb-3 rounded-xl border border-line/25 bg-ceu-claro/70 px-3 py-1.5 text-xs font-semibold text-ink">
            <span className="font-extrabold text-vinho">Turma:</span> {a.turma.nome}
          </p>
        )}

        {a.observacao && (
          <div>
            <h4 className="rotulo mb-1">Descrição</h4>
            <Descricao texto={a.observacao} />
          </div>
        )}
      </div>

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

/** Descrição da atividade; textos longos começam recolhidos (4 linhas) com "Ler tudo". */
function Descricao({ texto }: { texto: string }) {
  const [aberta, setAberta] = useState(false);
  const longa = observacaoLonga(texto);

  return (
    <>
      <p className={`text-sm leading-relaxed whitespace-pre-line text-ink/90 ${longa && !aberta ? "line-clamp-4" : ""}`}>{texto}</p>
      {longa && (
        <button
          type="button"
          onClick={() => setAberta((v) => !v)}
          aria-expanded={aberta}
          className="mt-1 text-xs font-bold text-cereja hover:underline"
        >
          {aberta ? "Mostrar menos" : "Ler tudo"}
        </button>
      )}
    </>
  );
}
