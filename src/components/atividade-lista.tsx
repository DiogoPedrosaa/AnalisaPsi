"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ReceptividadeBadge } from "@/components/receptividade";
import { TagChip } from "@/components/tag-chip";
import { excluirAtividade } from "@/lib/actions";
import { formatarDataLonga } from "@/lib/dates";
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
  const [excluindo, startExcluir] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function excluir() {
    if (!confirm(`Apagar “${a.titulo}” (${a.turma.nome})?`)) return;
    startExcluir(async () => {
      const res = await excluirAtividade(a.id);
      if (!res.ok) setErro(res.error);
    });
  }

  return (
    <li className={`flex items-start gap-3 px-4 py-3 transition ${excluindo ? "opacity-40" : ""}`}>
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
        {erro && <p className="mt-1 text-xs text-danger">{erro}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <ReceptividadeBadge valor={a.receptividade} />
        <div className="flex gap-0.5">
          <Link href={`/atividades/${a.id}`} className="rounded-md px-1.5 py-0.5 text-xs font-medium text-ink-2 hover:bg-card-2 hover:text-ink">
            Editar
          </Link>
          <button
            type="button"
            onClick={excluir}
            disabled={excluindo}
            className="rounded-md px-1.5 py-0.5 text-xs font-medium text-ink-2 hover:bg-ruim/10 hover:text-danger"
          >
            Apagar
          </button>
        </div>
      </div>
    </li>
  );
}
