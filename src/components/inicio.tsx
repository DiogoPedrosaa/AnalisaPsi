import Link from "next/link";
import { AtividadeLista } from "@/components/atividade-lista";
import { Brilho, Cereja } from "@/components/enfeites";
import { Icone } from "@/components/icone";
import { fundoDaPasta, Pasta } from "@/components/pasta";
import { ORDEM_RECEPTIVIDADE, RECEPTIVIDADE } from "@/components/receptividade";
import { TagDot } from "@/components/tag-chip";
import { aderenciaPasta, detalhePasta, type FiltroPasta, hrefDaPasta, type ResumoPasta } from "@/lib/pastas";
import { etapaDaTurma, rotuloEtapa } from "@/lib/turmas";
import type { Atividade, Tag, Turma } from "@/lib/types";

/* Peças visuais da tela de início (sem busca de dados), ver DESIGN.md › Tela de início. */

const ICONE_MAIS = "M12 5v14M5 12h14";

/** Topo da tela de início: data, saudação, status do último registro e o botão de registrar. */
export function CabecalhoInicio({
  saudacao,
  nome,
  dataLonga,
  status,
}: {
  saudacao: string;
  nome: string;
  dataLonga: string;
  status: string;
}) {
  return (
    <section className="card quadriculado relative overflow-hidden">
      <Cereja className="absolute top-3 right-4 hidden size-10 rotate-12 sm:block" />
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7 sm:pr-16">
        <div className="min-w-0">
          <p className="rotulo">({dataLonga})</p>
          <h1 className="mt-2 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            {saudacao}
            {nome ? (
              <>
                , <em className="text-accent">{nome}</em>!
              </>
            ) : (
              "!"
            )}
          </h1>
          <p className="mt-2 text-sm text-ink-2">{status}</p>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          <Link href="/registrar" className="btn-primary px-6 py-3.5 text-sm">
            <Icone d={ICONE_MAIS} className="size-4" />
            Registrar atividade
          </Link>
          <p className="hidden -rotate-2 font-script text-2xl leading-none text-cereja sm:block">leva menos de um minuto!</p>
        </div>
      </div>
      <div className="faixa-xadrez h-3" aria-hidden />
    </section>
  );
}

export type PastaDaGrade = { id: string; nome: string; resumo: ResumoPasta };

/** Grade compacta das pastas, na ordem da escola: 3 colunas no celular, 4 no tablet, todas numa linha no desktop. */
export function GradePastas({ pastas, abertaId }: { pastas: PastaDaGrade[]; abertaId?: string }) {
  return (
    <section aria-labelledby="titulo-pastas">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 id="titulo-pastas" className="titulo-secao">
          Pastas das turmas
        </h2>
        <span className="text-xs text-muted tabular-nums">
          {pastas.length} {pastas.length === 1 ? "turma" : "turmas"}
        </span>
      </div>
      <ul className="grid grid-cols-3 gap-x-2 gap-y-3 sm:grid-cols-4 sm:gap-x-3 lg:grid-cols-7">
        {pastas.map((p, i) => (
          <li key={p.id}>
            <Pasta
              href={hrefDaPasta(p.id)}
              nome={p.nome}
              etapa={rotuloEtapa(p.nome)}
              total={p.resumo.total}
              indice={i}
              aberta={p.id === abertaId}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Grade de pastas enquanto carrega. */
export function GradePastasCarregando() {
  return (
    <div>
      <div className="mb-3 h-7 w-48 animate-pulse rounded bg-card-2" aria-hidden />
      <div className="grid grid-cols-3 gap-x-2 gap-y-3 sm:grid-cols-4 sm:gap-x-3 lg:grid-cols-7" aria-hidden>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="h-[4.5rem] animate-pulse rounded-xl bg-card-2" />
        ))}
      </div>
    </div>
  );
}

/**
 * Caderno da turma aberta (ver DESIGN.md › Caderno da turma): topo listrado com o nome e o botão de
 * registrar nesta turma, filtros em chips (tags e termômetro de receptividade) e a lista de atividades.
 */
export function CadernoDaTurma({
  turma,
  indice,
  resumo,
  tags,
  filtro,
  atividades,
  hoje,
}: {
  turma: Turma;
  /** Posição da turma na grade (define a cor). */
  indice: number;
  resumo: ResumoPasta;
  /** Tags usadas nas atividades da turma, com a contagem. */
  tags: (Tag & { total: number })[];
  filtro: FiltroPasta;
  /** Atividades já filtradas. */
  atividades: Atividade[];
  hoje: string;
}) {
  const { etapa } = etapaDaTurma(turma.nome);
  const estampa = etapa === "medio" ? "estampa-estrelas" : etapa === "fundamental" ? "estampa-ceu" : fundoDaPasta(indice);
  const etapaExtenso = rotuloEtapa(turma.nome, true);
  const aderencia = aderenciaPasta(resumo);
  const filtrando = Boolean(filtro.tagId || filtro.receptividade);
  const registrar = `/registrar?turma=${turma.id}`;

  return (
    <section
      id="caderno"
      aria-labelledby="titulo-caderno"
      className="card overflow-hidden shadow-[4px_4px_0_0_var(--line)]"
    >
      {/* Topo listrado, como a capa de um caderno */}
      <div className={`${estampa} border-b-2 border-line p-3 sm:p-5`}>
        <div className="card relative flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <Brilho className="absolute -top-2 -left-2 size-5 text-cereja" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {etapaExtenso && <span className="etiqueta">{etapaExtenso}</span>}
              <span
                className={`inline-flex items-center rounded-md border-2 border-line px-2.5 py-1 text-[11px] font-bold tracking-[0.16em] text-ink uppercase tabular-nums ${fundoDaPasta(indice)}`}
              >
                {resumo.total} {resumo.total === 1 ? "atividade" : "atividades"}
              </span>
            </div>
            <h2 id="titulo-caderno" className="mt-2 font-display text-4xl leading-tight break-words">
              {turma.nome}
            </h2>
            <p className="mt-0.5 text-sm text-ink-2">
              {resumo.total ? detalhePasta(resumo, hoje) : "Nada registrado nesta turma ainda."}
            </p>
          </div>
          <Link href={registrar} className="btn-primary shrink-0 py-3">
            <Icone d={ICONE_MAIS} className="size-4" />
            Registrar nesta turma
          </Link>
        </div>
      </div>

      {resumo.total > 0 && (
        <div className="space-y-3 border-b-2 border-line bg-card-2/50 px-4 py-4 sm:px-6">
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por tag">
              <span className="rotulo mr-1 w-full sm:w-auto">Tags</span>
              <ChipFiltro
                href={hrefDaPasta(turma.id, { receptividade: filtro.receptividade })}
                ativo={!filtro.tagId}
                classeAtivo="border-ink bg-ink text-page"
              >
                Todas <Contagem n={resumo.total} />
              </ChipFiltro>
              {tags.map((t) => {
                const ativo = filtro.tagId === t.id;
                return (
                  <ChipFiltro
                    key={t.id}
                    href={hrefDaPasta(turma.id, { ...filtro, tagId: ativo ? undefined : t.id })}
                    ativo={ativo}
                    classeAtivo="border-ink bg-ink text-page"
                  >
                    <TagDot cor={t.cor} />
                    {t.nome} <Contagem n={t.total} />
                  </ChipFiltro>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por receptividade">
            <span className="rotulo mr-1 w-full sm:w-auto">Termômetro da turma</span>
            {ORDEM_RECEPTIVIDADE.map((k) => {
              const r = RECEPTIVIDADE[k];
              const ativo = filtro.receptividade === k;
              const conteudo = (
                <>
                  <span aria-hidden>{r.emoji}</span>
                  {r.label} <Contagem n={resumo[k]} />
                </>
              );
              if (resumo[k] === 0)
                return (
                  <span key={k} className="chip border-line bg-card text-ink opacity-50">
                    {conteudo}
                  </span>
                );
              return (
                <ChipFiltro
                  key={k}
                  href={hrefDaPasta(turma.id, { ...filtro, receptividade: ativo ? undefined : k })}
                  ativo={ativo}
                  classeAtivo={r.soft}
                >
                  {conteudo}
                </ChipFiltro>
              );
            })}
            {aderencia && (
              <span className={`text-xs text-muted ${aderencia === "poucos dados" ? "italic" : "tabular-nums"}`}>
                · {aderencia}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6">
        {resumo.total === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-3xl" aria-hidden>
              🗂️
            </p>
            <p className="mt-2 font-display text-2xl">Nenhuma folha preenchida aqui ainda!</p>
            <p className="mt-1 text-sm text-ink-2">Que tal registrar a primeira atividade com esta turma?</p>
            <Link href={registrar} className="btn-primary mt-5">
              <Icone d={ICONE_MAIS} className="size-4" />
              Registrar nesta turma
            </Link>
          </div>
        ) : (
          <>
            {filtrando && (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-ink-2 tabular-nums">
                  {atividades.length} de {resumo.total} {resumo.total === 1 ? "atividade" : "atividades"}
                </p>
                <Link href={hrefDaPasta(turma.id)} scroll={false} className="btn-ghost py-1.5">
                  Limpar filtros
                </Link>
              </div>
            )}
            {atividades.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-2">Nenhuma atividade desta turma com esses filtros.</p>
            ) : (
              <AtividadeLista atividades={atividades} mostrarTurma={false} voltarPara={hrefDaPasta(turma.id, filtro)} />
            )}
          </>
        )}
      </div>
    </section>
  );
}

/** Chip de filtro que é um link (o servidor refaz a lista); tocar no chip ativo tira o filtro. */
function ChipFiltro({
  href,
  ativo,
  classeAtivo,
  children,
}: {
  href: string;
  ativo: boolean;
  classeAtivo: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={ativo ? "true" : undefined}
      className={`chip ${ativo ? classeAtivo : "border-line bg-card text-ink hover:border-ink/40"}`}
    >
      {children}
    </Link>
  );
}

function Contagem({ n }: { n: number }) {
  return <span className="text-xs opacity-70 tabular-nums">({n})</span>;
}
