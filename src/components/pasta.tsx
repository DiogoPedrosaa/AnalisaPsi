import Link from "next/link";
import { corDaPasta } from "@/lib/turmas";

/** Classes das 7 cores de pasta (`--pasta-1` … `--pasta-7`), escritas por extenso para o Tailwind achar. */
const CORES_PASTA = ["bg-pasta-1", "bg-pasta-2", "bg-pasta-3", "bg-pasta-4", "bg-pasta-5", "bg-pasta-6", "bg-pasta-7"];

/** Fundo da pasta na posição `indice` da lista ordenada (cada turma tem a sua cor). */
export function fundoDaPasta(indice: number) {
  return CORES_PASTA[corDaPasta(indice) - 1];
}

/**
 * Pasta compacta da grade da tela de início (ver DESIGN.md › Pasta): aba de arquivo pequena na cor
 * da turma, nome em serifa, quantidade de atividades e a etapa. A pasta aberta ganha borda escura,
 * sombra de recorte e uma setinha apontando para o caderno abaixo.
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
  const cor = fundoDaPasta(indice);
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={aberta ? "page" : undefined}
      className={`group relative block h-full rounded-xl transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vinho/40 ${
        aberta ? "-translate-y-1 drop-shadow-[3px_3px_0_var(--sombra)]" : "hover:-translate-y-0.5"
      }`}
    >
      <span
        aria-hidden
        className={`relative z-10 -mb-0.5 block h-3 w-2/5 rounded-t-md border-2 border-b-0 ${cor} ${aberta ? "border-ink" : "border-line group-hover:border-ink/40"}`}
      />
      <span
        className={`flex h-[calc(100%-0.625rem)] flex-col rounded-xl rounded-tl-none border-2 px-2.5 pt-2 pb-2.5 ${cor} ${
          aberta ? "border-ink" : "border-line group-hover:border-ink/40"
        }`}
      >
        <span className="flex items-start justify-between gap-1">
          <span className="min-w-0 font-display text-lg leading-tight break-words sm:text-xl">{nome}</span>
          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-ink px-1.5 text-[11px] font-bold text-page tabular-nums">
            {total}
            <span className="sr-only">{total === 1 ? " atividade" : " atividades"}</span>
          </span>
        </span>
        {etapa && <span className="mt-auto pt-1 text-[10px] font-bold tracking-[0.12em] text-ink-2 uppercase">{etapa}</span>}
      </span>
      {aberta && (
        <span aria-hidden className="absolute -bottom-2 left-1/2 size-3 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-ink bg-cereja" />
      )}
    </Link>
  );
}
