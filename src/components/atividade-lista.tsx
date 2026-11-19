"use client";

import { useState } from "react";
import { BotaoApagar, BotaoEditar } from "@/components/acoes";
import { ReceptividadeBadge } from "@/components/receptividade";
import { TagChip } from "@/components/tag-chip";
import { excluirAtividade } from "@/lib/actions";
import { formatarDataLonga } from "@/lib/dates";
import { avisoExcluirAtividade } from "@/lib/exclusao";
import { observacaoLonga } from "@/lib/observacao";
import type { Atividade } from "@/lib/types";

type Opcoes = {
  /** Esconde o nome da turma em cada item (ex.: dentro da pasta da turma). */
  mostrarTurma?: boolean;
  /** Para onde voltar depois de editar uma atividade (vai como `?voltar=`). */
  voltarPara?: string;
};

/** Lista de atividades agrupadas por dia. */
export function AtividadeLista({ atividades, ...opcoes }: { atividades: Atividade[] } & Opcoes) {
  const grupos: { data: string; itens: Atividade[] }[] = [];
  for (const a of atividades) {
    const ultimo = grupos.at(-1);
    if (ultimo?.data === a.data) ultimo.itens.push(a);
    else grupos.push({ data: a.data, itens: [a] });
  }

  return (
    <div className="space-y-6">
      {grupos.map((g) => (
        <section key={g.data}>
          <h3 className="rotulo mb-2">
            {formatarDataLonga(g.data, true)}
          </h3>
          <ul className="card divide-y divide-line overflow-hidden">
            {g.itens.map((a) => (
              <AtividadeItem key={a.id} atividade={a} {...opcoes} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function AtividadeItem({ atividade: a, mostrarTurma = true, voltarPara }: { atividade: Atividade } & Opcoes) {
  const editar = voltarPara ? `/atividades/${a.id}?voltar=${encodeURIComponent(voltarPara)}` : `/atividades/${a.id}`;
  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-semibold">{a.titulo}</span>
          {mostrarTurma && <span className="text-sm text-ink-2">· {a.turma.nome}</span>}
        </div>
        {a.tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {a.tags.map((t) => (
              <TagChip key={t.id} nome={t.nome} cor={t.cor} />
            ))}
          </div>
        )}
        {a.observacao && <Descricao texto={a.observacao} />}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <ReceptividadeBadge valor={a.receptividade} />
        <div className="-mr-1.5 flex gap-0.5">
          <BotaoEditar href={editar} rotulo={`Editar “${a.titulo}”`} />
          <BotaoApagar
            rotulo={`Apagar “${a.titulo}”`}
            aviso={avisoExcluirAtividade(a.titulo, a.turma.nome)}
            apagar={() => excluirAtividade(a.id)}
          />
        </div>
      </div>
    </li>
  );
}

/** Descrição da atividade; textos longos começam recolhidos (4 linhas) com "Ler tudo". */
function Descricao({ texto }: { texto: string }) {
  const [aberta, setAberta] = useState(false);
  const longa = observacaoLonga(texto);

  return (
    <div className="mt-1.5">
      <p className={`text-sm leading-relaxed whitespace-pre-line text-ink-2 ${longa && !aberta ? "line-clamp-4" : ""}`}>
        {texto}
      </p>
      {longa && (
        <button
          type="button"
          onClick={() => setAberta((v) => !v)}
          aria-expanded={aberta}
          className="mt-1 text-xs font-semibold text-accent hover:underline"
        >
          {aberta ? "Mostrar menos" : "Ler tudo"}
        </button>
      )}
    </div>
  );
}
