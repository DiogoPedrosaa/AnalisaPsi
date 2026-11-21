import Link from "next/link";
import { corDaPasta } from "@/lib/turmas";

/** Classes das 7 cores de pasta (`--pasta-1` … `--pasta-7`), escritas por extenso para o Tailwind achar. */
const CORES_PASTA = ["bg-pasta-1", "bg-pasta-2", "bg-pasta-3", "bg-pasta-4", "bg-pasta-5", "bg-pasta-6", "bg-pasta-7"];

/** Fundo da pasta na posição `indice` da lista ordenada (cada turma tem a sua cor). */
export function fundoDaPasta(indice: number) {
  return CORES_PASTA[corDaPasta(indice) - 1];
}

/**
 * Aba de fichário de uma turma (ver DESIGN.md › Pasta): cartão com contorno cacau, a etapa num
 * selinho, a contagem numa bolinha cacau e o nome em serifa. Fechada fica creme; aberta ganha a cor
 * da turma, sobe, ganha sombra de recorte e uma setinha cereja apontando para o caderno.
 */
export function Pasta({
  href,
  nome,
  etapa,
  total,
  indice,
  aberta,
}: {
  href: string;
  nome: string;
  etapa: string | null;
  total: number;
  indice: number;
  aberta: boolean;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={aberta ? "page" : undefined}
      className={`relative flex h-full flex-col justify-between rounded-2xl border-2 border-line p-3 text-left transition-all focus-visible:ring-2 focus-visible:ring-rosa-forte focus-visible:outline-none ${
        aberta
          ? `${fundoDaPasta(indice)} -translate-y-1 shadow-[4px_4px_0_0_var(--sombra)]`
          : "bg-card opacity-90 shadow-[2px_2px_0_0_var(--sombra)] hover:bg-card-2/80 hover:opacity-100"
      }`}
    >
      <span className="mb-1 flex w-full items-center justify-between gap-1">
        {etapa ? (
          <span className="rounded border border-line/30 bg-card/80 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-ink uppercase">
            {etapa}
          </span>
        ) : (
          <span />
        )}
        <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-ink px-1.5 text-xs font-extrabold text-page tabular-nums">
          {total}
          <span className="sr-only">{total === 1 ? " atividade" : " atividades"}</span>
        </span>
      </span>
      <span className="mt-1 font-display text-base leading-tight font-extrabold break-words text-ink sm:text-lg">{nome}</span>
      {aberta && (
        <span
          aria-hidden
          className="absolute -bottom-2 left-1/2 size-3 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-line bg-cereja"
        />
      )}
    </Link>
  );
}
