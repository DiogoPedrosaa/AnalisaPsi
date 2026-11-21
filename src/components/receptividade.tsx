import type { Receptividade } from "@/lib/types";

/**
 * Rótulos e classes da receptividade, no estilo do "termômetro da turma":
 * boa = oliva, neutra = lavanda, ruim = cereja.
 * - `bg`: cor cheia (barras dos gráficos e legendas).
 * - `fundo`: fundo pastel das pílulas do termômetro.
 * - `soft`: selo/opção marcada (borda + fundo pastel + texto).
 * - `anel`: anel da opção marcada no formulário.
 */
export const RECEPTIVIDADE: Record<
  Receptividade,
  { label: string; emoji: string; descricao: string; bg: string; fundo: string; soft: string; anel: string }
> = {
  boa: {
    label: "Boa",
    emoji: "😊",
    descricao: "Turma engajou",
    bg: "bg-boa",
    fundo: "bg-oliva-clara",
    soft: "border-oliva bg-oliva-clara text-ink",
    anel: "ring-oliva",
  },
  neutra: {
    label: "Neutra",
    emoji: "😐",
    descricao: "Nem bem, nem mal",
    bg: "bg-neutra",
    fundo: "bg-lavanda",
    soft: "border-lavanda-escura bg-lavanda text-ink",
    anel: "ring-lavanda-escura",
  },
  ruim: {
    label: "Ruim",
    emoji: "😕",
    descricao: "Não rolou",
    bg: "bg-ruim",
    fundo: "bg-rosa-claro",
    soft: "border-cereja bg-rosa-claro text-vinho",
    anel: "ring-cereja",
  },
};

export const ORDEM_RECEPTIVIDADE: Receptividade[] = ["boa", "neutra", "ruim"];

export function ReceptividadeBadge({ valor }: { valor: Receptividade }) {
  const r = RECEPTIVIDADE[valor];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-extrabold ${r.soft}`}>
      <span aria-hidden>{r.emoji}</span>
      {r.label}
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
