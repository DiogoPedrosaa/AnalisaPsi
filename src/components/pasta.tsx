import Link from "next/link";
import { Icone } from "@/components/icone";
import { BarraReceptividade } from "@/components/ranking";
import { aderenciaPasta, detalhePasta, type ResumoPasta } from "@/lib/pastas";

/** Cores das abas das pastas, em rodízio pela posição (enfeite, sem significado). */
const CORES_ABA = ["bg-rosa-claro", "bg-lavanda", "bg-pessego", "bg-ceu"];

/**
 * Cartão em forma de pasta de arquivo (ver DESIGN.md › Pasta): aba colorida com a quantidade de
 * atividades, nome da turma em serifa, quando foi a última e a barra de receptividade.
 */
export function Pasta({
  id,
  nome,
  resumo,
  hoje,
  indice,
}: {
  id: string;
  nome: string;
  resumo: ResumoPasta;
  hoje: string;
  indice: number;
}) {
  const aderencia = aderenciaPasta(resumo);
  return (
    <Link
      href={`/turmas/${id}`}
      className="group block rounded-2xl transition hover:-translate-y-1 hover:drop-shadow-[4px_4px_0_var(--vinho)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vinho/40"
    >
      <span
        aria-hidden
        className={`relative z-10 -mb-0.5 flex h-8 w-fit min-w-2/5 items-center gap-1.5 rounded-t-xl border-2 border-b-0 border-line px-4 text-[11px] font-bold tracking-[0.14em] text-ink uppercase tabular-nums ${CORES_ABA[indice % CORES_ABA.length]}`}
      >
        <Icone d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" className="size-3.5" />
        {resumo.total}
      </span>
      <span className="card flex min-h-40 flex-col rounded-tl-none p-5">
        <span className="font-display text-3xl leading-tight break-words">{nome}</span>
        <span className="mt-1 text-sm text-ink-2">{detalhePasta(resumo, hoje)}</span>

        <span className="mt-auto block pt-4">
          {resumo.total > 0 && <BarraReceptividade contagem={resumo} className="h-2" />}
          <span className="mt-1.5 flex items-baseline justify-between gap-2 text-xs text-muted">
            <span className={aderencia === "poucos dados" ? "italic" : "tabular-nums"}>{aderencia}</span>
            <span className="inline-flex items-center gap-1 font-script text-xl leading-none text-cereja">
              abrir
              <Icone d="M5 12h14M13 6l6 6-6 6" className="size-4 transition group-hover:translate-x-1" />
            </span>
          </span>
        </span>
      </span>
    </Link>
  );
}
