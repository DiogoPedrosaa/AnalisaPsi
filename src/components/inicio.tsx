import { Layers, NotebookPen, PenTool, PlusCircle } from "lucide-react";
import Link from "next/link";
import { AtividadeLista } from "@/components/atividade-lista";
import { BotaoCopiarIA } from "@/components/botao-copiar-ia";
import { BordaRasgada } from "@/components/enfeites";
import { fundoDaPasta, Pasta } from "@/components/pasta";
import { ORDEM_RECEPTIVIDADE, RECEPTIVIDADE } from "@/components/receptividade";
import { TagDot } from "@/components/tag-chip";
import { aderenciaPasta, detalhePasta, type FiltroPasta, hrefDaPasta, type ResumoPasta } from "@/lib/pastas";
import { etapaDaTurma, rotuloEtapa } from "@/lib/turmas";
import type { Atividade, Tag, Turma } from "@/lib/types";

/* Peças visuais da tela de início (sem busca de dados), ver DESIGN.md › Telas de entrada. */

/** Topo da tela de início: data, saudação e status do último registro. */
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
    <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="rotulo">({dataLonga})</p>
        <h1 className="titulo-pagina mt-1">
          {saudacao}
          {nome ? (
            <>
              , <em>{nome}</em>!
            </>
          ) : (
            "!"
          )}
        </h1>
        <p className="mt-1 text-sm text-ink-2">{status}</p>
      </div>
      <p className="hidden shrink-0 -rotate-2 font-script text-2xl leading-none text-cereja sm:block">
        registrar leva menos de um minuto!
      </p>
    </section>
  );
}

export type PastaDaGrade = { id: string; nome: string; resumo: ResumoPasta };

/** Fileira de abas das turmas, na ordem da escola: 2 colunas no celular, 4 no tablet, todas numa linha no desktop. */
export function GradePastas({ pastas, abertaId }: { pastas: PastaDaGrade[]; abertaId?: string }) {
  return (
    <section aria-labelledby="titulo-pastas">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 id="titulo-pastas" className="washi -rotate-1 bg-rosa-claro px-3 py-1 text-xs">
            Escolha a pasta da turma
          </h2>
          <span className="hidden font-script text-xl text-ink/80 sm:inline">Clique em uma aba para abrir o fichário</span>
        </div>
        <span className="text-xs font-semibold text-ink-2 tabular-nums">
          {pastas.length} {pastas.length === 1 ? "turma" : "turmas"}
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
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

/** Abas das turmas enquanto carregam. */
export function GradePastasCarregando() {
  return (
    <div>
      <div className="mb-3 h-7 w-56 animate-pulse rounded bg-card-2" aria-hidden />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7" aria-hidden>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="h-[5.25rem] animate-pulse rounded-2xl border-2 border-line/20 bg-card-2" />
        ))}
      </div>
    </div>
  );
}

/**
 * Caderno da turma aberta (ver DESIGN.md › Caderno da turma): bloco espiral com capa listrada, filtros
 * em chips, termômetro da turma, cartões das atividades em papel quadriculado e a faixa rosa de dica.
 */
export function CadernoDaTurma({
  turma,
  indice,
  resumo,
  tags,
  filtro,
  atividades,
  hoje,
  textoIA,
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
  /** Relatório + prompt de todas as atividades da turma (botão "Copiar para IA"). */
  textoIA?: string;
}) {
  const { etapa } = etapaDaTurma(turma.nome);
  const estampa = etapa === "medio" ? "estampa-rosa" : etapa === "fundamental" ? "estampa-azul" : fundoDaPasta(indice);
  const etapaExtenso = rotuloEtapa(turma.nome, true);
  const aderencia = aderenciaPasta(resumo);
  const filtrando = Boolean(filtro.tagId || filtro.receptividade);
  const registrar = `/registrar?turma=${turma.id}`;

  return (
    <section
      id="caderno"
      aria-labelledby="titulo-caderno"
      className="painel overflow-hidden"
    >
      {/* Capa do bloco: furos de espiral sobre a estampa da etapa */}
      <div className={`espiral ${estampa} border-b-2 border-line px-5 pt-9 pb-6 sm:px-8`}>
        <div className="flex flex-col justify-between gap-5 rounded-2xl border-2 border-line bg-card/95 p-4 shadow-sm backdrop-blur-sm sm:p-6 lg:flex-row lg:items-center">
          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              {etapaExtenso && <span className="etiqueta">{etapaExtenso}</span>}
              <span className="rounded-md border border-line bg-rosa-claro px-2.5 py-0.5 text-xs font-bold text-ink tabular-nums">
                {resumo.total} {resumo.total === 1 ? "atividade registrada" : "atividades registradas"}
              </span>
            </div>
            <h2 id="titulo-caderno" className="font-display text-2xl font-extrabold break-words text-ink sm:text-3xl">
              {turma.nome}
            </h2>
            <p className="mt-1 text-sm text-ink/80">
              {resumo.total ? detalhePasta(resumo, hoje) : "Nada registrado nesta turma ainda."}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row sm:items-center">
            {textoIA && resumo.total > 0 && <BotaoCopiarIA texto={textoIA} />}
            <Link href={registrar} className="btn-primary px-5 py-3">
              <PlusCircle className="size-4" aria-hidden />
              Registrar nesta turma
            </Link>
          </div>
        </div>
      </div>

      {resumo.total > 0 && (
        <div className="border-b-2 border-line/15 bg-card-2/60 px-5 py-4 sm:px-8">
          {tags.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-line/10 pb-4" role="group" aria-label="Filtrar por tag">
              <ChipFiltro href={hrefDaPasta(turma.id, { receptividade: filtro.receptividade })} ativo={!filtro.tagId}>
                <Layers className="size-3.5" aria-hidden />
                Todas as práticas <Contagem n={resumo.total} ativo={!filtro.tagId} />
              </ChipFiltro>
              {tags.map((t) => {
                const ativo = filtro.tagId === t.id;
                return (
                  <ChipFiltro key={t.id} href={hrefDaPasta(turma.id, { ...filtro, tagId: ativo ? undefined : t.id })} ativo={ativo}>
                    <TagDot cor={t.cor} className="size-2.5 ring-1 ring-line/30" />
                    {t.nome} <Contagem n={t.total} ativo={ativo} />
                  </ChipFiltro>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por receptividade">
              <span className="font-bold text-ink-2">Termômetro da turma:</span>
              {ORDEM_RECEPTIVIDADE.map((k) => {
                const r = RECEPTIVIDADE[k];
                const ativo = filtro.receptividade === k;
                const classe = `inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 font-semibold text-ink tabular-nums ${r.fundo}`;
                const conteudo = (
                  <>
                    <span aria-hidden>{r.emoji}</span> {r.label}: {resumo[k]}
                  </>
                );
                if (resumo[k] === 0)
                  return (
                    <span key={k} className={`${classe} border-line/40 opacity-50`}>
                      {conteudo}
                    </span>
                  );
                return (
                  <Link
                    key={k}
                    href={hrefDaPasta(turma.id, { ...filtro, receptividade: ativo ? undefined : k })}
                    scroll={false}
                    aria-current={ativo ? "true" : undefined}
                    className={`${classe} transition-all focus-visible:ring-2 focus-visible:ring-rosa-forte focus-visible:outline-none ${
                      ativo ? "border-line shadow-[2px_2px_0_0_var(--sombra)]" : "border-line/40 hover:border-line"
                    }`}
                  >
                    {conteudo}
                  </Link>
                );
              })}
            </div>
            <p className="text-ink-2 italic">
              Da mais recente para a mais antiga
              {aderencia && <span className={aderencia === "poucos dados" ? "" : "not-italic tabular-nums"}> · {aderencia}</span>}
            </p>
          </div>
        </div>
      )}

      {/* Folhas do caderno: cartões sobre papel quadriculado */}
      <div className="quadriculado min-h-[380px] p-5 sm:p-8">
        {resumo.total === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <div className="mb-4 flex size-20 -rotate-3 items-center justify-center rounded-2xl border-2 border-line bg-rosa-claro shadow-[4px_4px_0_0_var(--sombra)]">
              <NotebookPen className="size-10 text-cereja" aria-hidden />
            </div>
            <p className="mb-1 font-display text-2xl font-bold text-ink">Nenhuma folha preenchida aqui ainda!</p>
            <p className="mb-5 max-w-md text-sm text-ink-2">
              Que tal registrar a primeira roda de conversa, dinâmica ou atividade artística feita com esta turma?
            </p>
            <Link href={registrar} className="btn-oliva">
              <PlusCircle className="size-4" aria-hidden />
              Registrar a primeira atividade
            </Link>
          </div>
        ) : (
          <>
            {filtrando && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink-2 tabular-nums">
                  {atividades.length} de {resumo.total} {resumo.total === 1 ? "atividade" : "atividades"}
                </p>
                <Link href={hrefDaPasta(turma.id)} scroll={false} className="btn-claro py-1.5 text-xs">
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

      {/* Pé do caderno: papel rasgado e faixa rosa quadriculada com uma dica */}
      <BordaRasgada className="text-rosa" semente={11} />
      <div className="grade-rosa flex flex-col items-center justify-between gap-4 px-6 py-5 sm:flex-row">
        <div className="flex items-center gap-3 rounded-2xl border-2 border-line bg-card px-4 py-2.5 shadow-sm">
          <span className="text-xl" aria-hidden>
            💡
          </span>
          <p className="text-xs font-medium text-ink sm:text-sm">
            <strong>Dica para o planejamento:</strong> no{" "}
            <Link href="/dashboard" className="font-bold text-cereja underline underline-offset-2">
              Painel
            </Link>{" "}
            você vê quais tags, turmas e dias da semana rendem mais. Toque no termômetro para filtrar pela reação da turma.
          </p>
        </div>
        <Link href={registrar} className="btn-claro shrink-0 text-xs sm:text-sm">
          <PenTool className="size-4 text-cereja" aria-hidden />
          Anotar nova prática
        </Link>
      </div>
    </section>
  );
}

/** Chip de filtro que é um link (o servidor refaz a lista); tocar no chip ativo tira o filtro. */
function ChipFiltro({ href, ativo, children }: { href: string; ativo: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} scroll={false} aria-current={ativo ? "true" : undefined} className={`chip ${ativo ? "chip-ativo" : "chip-inativo"}`}>
      {children}
    </Link>
  );
}

function Contagem({ n, ativo }: { n: number; ativo: boolean }) {
  return (
    <span className={`ml-0.5 rounded-full px-1.5 text-[10px] tabular-nums ${ativo ? "bg-card text-cereja" : "bg-ink/10 text-ink"}`}>
      {n}
    </span>
  );
}
