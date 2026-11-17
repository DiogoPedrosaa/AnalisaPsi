import type { Receptividade } from "@/lib/types";

export const RECEPTIVIDADE: Record<
  Receptividade,
  { label: string; emoji: string; descricao: string; bg: string; soft: string }
> = {
  boa: {
    label: "Boa",
    emoji: "😊",
    descricao: "Turma engajou",
    bg: "bg-boa",
    soft: "border-boa bg-boa/12 text-ink",
  },
  neutra: {
    label: "Neutra",
    emoji: "😐",
    descricao: "Nem bem, nem mal",
    bg: "bg-neutra",
    soft: "border-neutra bg-neutra/20 text-ink",
  },
  ruim: {
    label: "Ruim",
    emoji: "😕",
    descricao: "Não rolou",
    bg: "bg-ruim",
    soft: "border-ruim bg-ruim/12 text-ink",
  },
};

export const ORDEM_RECEPTIVIDADE: Receptividade[] = ["boa", "neutra", "ruim"];

export function ReceptividadeBadge({ valor }: { valor: Receptividade }) {
  const r = RECEPTIVIDADE[valor];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${r.soft}`}
    >
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
          <span className={`size-2.5 rounded-sm ${RECEPTIVIDADE[k].bg}`} />
          {RECEPTIVIDADE[k].label}
        </span>
      ))}
    </div>
  );
}
