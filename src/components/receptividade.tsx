import { RECEPTIVIDADES, ROTULO_RECEPTIVIDADE } from "@/lib/receptividade";
import type { Receptividade } from "@/lib/types";

/**
 * Rótulos e classes das reações dos alunos, no estilo do "termômetro da turma":
 * Adoraram = oliva, Gostaram = azul-bebê, Neutro = lavanda, Não curtiram = cereja.
 * - `bg`: cor cheia (barras dos gráficos e legendas).
 * - `fundo`: fundo pastel das pílulas do termômetro.
 * - `soft`: selo/opção marcada (borda + fundo pastel + texto).
 * - `anel`: anel da opção marcada no formulário.
 */
export const RECEPTIVIDADE: Record<
  Receptividade,
  { label: string; emoji: string; descricao: string; nivel: string; bg: string; fundo: string; soft: string; anel: string }
> = {
  adoraram: {
    ...ROTULO_RECEPTIVIDADE.adoraram,
    bg: "bg-adoraram",
    fundo: "bg-oliva-clara",
    soft: "border-oliva bg-oliva-clara text-ink",
    anel: "ring-oliva",
  },
  gostaram: {
    ...ROTULO_RECEPTIVIDADE.gostaram,
    bg: "bg-gostaram",
    fundo: "bg-ceu",
    soft: "border-line bg-ceu text-ink",
    anel: "ring-line",
  },
  neutro: {
    ...ROTULO_RECEPTIVIDADE.neutro,
    bg: "bg-neutro",
    fundo: "bg-lavanda",
    soft: "border-lavanda-escura bg-lavanda text-ink",
    anel: "ring-lavanda-escura",
  },
  nao_curtiram: {
    ...ROTULO_RECEPTIVIDADE.nao_curtiram,
    bg: "bg-nao-curtiram",
    fundo: "bg-rosa-claro",
    soft: "border-cereja bg-rosa-claro text-vinho",
    anel: "ring-cereja",
  },
};

/** Ordem fixa, da melhor para a pior reação. */
export const ORDEM_RECEPTIVIDADE: readonly Receptividade[] = RECEPTIVIDADES;

/** Selo da reação. `completo` mostra também o nível ("Adoraram / Alto Engajamento"), como nos cartões. */
export function ReceptividadeBadge({ valor, completo = false }: { valor: Receptividade; completo?: boolean }) {
  const r = RECEPTIVIDADE[valor];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-extrabold ${r.soft}`}>
      <span aria-hidden>{r.emoji}</span>
      {completo ? `${r.label} / ${r.nivel}` : r.label}
    </span>
  );
}

export function LegendaReceptividade() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-2">
      {ORDEM_RECEPTIVIDADE.map((k) => (
        <span key={k} className="inline-flex items-center gap-1.5">
          <span className={`size-2.5 rounded-sm border border-line/40 ${RECEPTIVIDADE[k].bg}`} />
          {RECEPTIVIDADE[k].label}
        </span>
      ))}
    </div>
  );
}
