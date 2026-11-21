import { ORDEM_RECEPTIVIDADE, RECEPTIVIDADE } from "@/components/receptividade";
import { TagDot } from "@/components/tag-chip";
import type { ContagemReceptividade } from "@/lib/receptividade";
import { MIN_AMOSTRA, type Grupo } from "@/lib/stats";

export function pct(n: number) {
  return `${Math.round(n)}%`;
}

/** "Adoraram 2 · Neutro 1" (só as reações que aparecem). */
function detalhe(g: Grupo) {
  return ORDEM_RECEPTIVIDADE.filter((k) => g[k] > 0)
    .map((k) => `${RECEPTIVIDADE[k].label} ${g[k]}`)
    .join(" · ");
}

/** Barra empilhada das 4 reações (trilho `card-2`), proporcional às contagens. */
export function BarraReceptividade({
  contagem: c,
  className = "h-2.5",
}: {
  contagem: ContagemReceptividade;
  className?: string;
}) {
  return (
    <div className={`flex gap-[2px] overflow-hidden rounded-full bg-card-2 ${className}`}>
      {c.total > 0 &&
        ORDEM_RECEPTIVIDADE.map((k) =>
          c[k] > 0 ? (
            <div
              key={k}
              className={RECEPTIVIDADE[k].bg}
              style={{ width: `${(c[k] / c.total) * 100}%` }}
              title={`${RECEPTIVIDADE[k].label}: ${c[k]} (${pct((c[k] / c.total) * 100)})`}
            />
          ) : null,
        )}
    </div>
  );
}

/**
 * Lista de grupos com barra empilhada (Adoraram → Não curtiram) e a aderência à direita.
 * `destaque` marca o melhor e o pior da lista.
 */
export function Ranking({
  grupos,
  mostrarCor = false,
  destaque,
  vazio = "Sem dados no período.",
}: {
  grupos: Grupo[];
  mostrarCor?: boolean;
  destaque?: { melhor?: string; pior?: string };
  vazio?: string;
}) {
  if (grupos.every((g) => g.total === 0)) {
    return <p className="py-6 text-center text-sm text-muted">{vazio}</p>;
  }

  return (
    <ul className="space-y-4">
      {grupos.map((g) => {
        const poucos = g.total > 0 && g.total < MIN_AMOSTRA;
        const melhor = destaque?.melhor === g.chave;
        const pior = destaque?.pior === g.chave;
        return (
          <li key={g.chave} className={g.total === 0 ? "opacity-50" : ""}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2">
                {mostrarCor && <TagDot cor={g.cor} className="size-2.5" />}
                <span className="truncate font-medium">{g.nome}</span>
                {melhor && (
                  <span className="shrink-0 rounded-full bg-oliva-clara px-2 py-0.5 text-[11px] font-semibold text-ink">
                    ▲ melhor
                  </span>
                )}
                {pior && (
                  <span className="shrink-0 rounded-full bg-rosa-claro px-2 py-0.5 text-[11px] font-semibold text-ink">
                    ▼ pior
                  </span>
                )}
              </span>
              <span className="shrink-0 text-sm tabular-nums">
                {g.total > 0 ? <strong className="text-base">{pct(g.aderencia)}</strong> : <span className="text-muted">—</span>}
              </span>
            </div>

            <BarraReceptividade contagem={g} />

            <p className="mt-1 text-xs text-muted">
              {g.total === 0 ? (
                "nenhuma atividade"
              ) : (
                <>
                  {g.total} {g.total === 1 ? "atividade" : "atividades"} · {detalhe(g)}
                  {poucos && <span className="ml-1 italic">· poucos dados</span>}
                </>
              )}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
