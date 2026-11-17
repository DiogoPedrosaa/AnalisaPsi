"use client";

import { BotaoApagar, BotaoEditar } from "@/components/acoes";
import { ReceptividadeBadge } from "@/components/receptividade";
import { TagChip } from "@/components/tag-chip";
import { excluirAtividade } from "@/lib/actions";
import { formatarDataLonga } from "@/lib/dates";
import { avisoExcluirAtividade } from "@/lib/exclusao";
import type { Atividade } from "@/lib/types";

/** Lista de atividades agrupadas por dia. */
export function AtividadeLista({ atividades }: { atividades: Atividade[] }) {
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
          <h3 className="mb-2 text-sm font-semibold text-ink-2 first-letter:uppercase">
            {formatarDataLonga(g.data, true)}
          </h3>
          <ul className="card divide-y divide-line overflow-hidden">
            {g.itens.map((a) => (
              <AtividadeItem key={a.id} atividade={a} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function AtividadeItem({ atividade: a }: { atividade: Atividade }) {
  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-semibold">{a.titulo}</span>
          <span className="text-sm text-ink-2">· {a.turma.nome}</span>
        </div>
        {a.tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {a.tags.map((t) => (
              <TagChip key={t.id} nome={t.nome} cor={t.cor} />
            ))}
          </div>
        )}
        {a.observacao && <p className="mt-1.5 text-sm whitespace-pre-line text-ink-2">{a.observacao}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <ReceptividadeBadge valor={a.receptividade} />
        <div className="-mr-1.5 flex gap-0.5">
          <BotaoEditar href={`/atividades/${a.id}`} rotulo={`Editar “${a.titulo}”`} />
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
