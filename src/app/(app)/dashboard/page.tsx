import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Filtros } from "@/components/filtros";
import { pct, Ranking } from "@/components/ranking";
import { LegendaReceptividade } from "@/components/receptividade";
import { SkeletonBloco } from "@/components/skeleton";
import { getAtividades, getTurmas } from "@/lib/data";
import { adicionarDias, hojeLocal } from "@/lib/dates";
import { param, uuidParam } from "@/lib/params";
import { calcularEstatisticas, type Grupo, melhor, pior } from "@/lib/stats";

export const metadata: Metadata = { title: "Painel" };

const PERIODOS = [
  { valor: "30", rotulo: "Últimos 30 dias", dias: 30 },
  { valor: "90", rotulo: "Últimos 3 meses", dias: 90 },
  { valor: "365", rotulo: "Últimos 12 meses", dias: 365 },
] as const;

export default function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  return (
    <>
      <h1 className="titulo-pagina">Painel</h1>
      <p className="subtitulo-pagina">O que está funcionando melhor — por turma, por categoria da prática e por dia.</p>
      <Suspense fallback={<SkeletonBloco linhas={8} />}>
        <Conteudo searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Conteudo({ searchParams }: { searchParams: PageProps<"/dashboard">["searchParams"] }) {
  const sp = await searchParams;
  const periodo = PERIODOS.find((p) => p.valor === param(sp.periodo));
  const turmaId = uuidParam(sp.turma);
  const desde = periodo ? adicionarDias(hojeLocal(), -periodo.dias) : undefined;

  const [turmas, atividades] = await Promise.all([getTurmas(), getAtividades({ turmaId, desde })]);
  const stats = calcularEstatisticas(atividades);
  const turmaSelecionada = turmas.find((t) => t.id === turmaId);

  const melhorTurma = melhor(stats.turmas);
  const piorTurma = pior(stats.turmas);
  const melhorCategoria = melhor(stats.categorias);
  const piorCategoria = pior(stats.categorias);
  const melhorDia = melhor(stats.dias);
  const piorDia = pior(stats.dias);

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <Filtros
          campos={[
            {
              nome: "periodo",
              rotulo: "Período",
              todos: "Todo o período",
              valor: periodo?.valor ?? "",
              opcoes: PERIODOS.map((p) => ({ valor: p.valor, rotulo: p.rotulo })),
            },
            {
              nome: "turma",
              rotulo: "Turma",
              todos: "Todas as turmas",
              valor: turmaId ?? "",
              opcoes: turmas.map((t) => ({ valor: t.id, rotulo: t.nome })),
            },
          ]}
        />
      </div>

      {atividades.length === 0 ? (
        <div className="card px-5 py-12 text-center">
          <p className="text-3xl" aria-hidden>
            📊
          </p>
          <p className="mt-3 font-display text-xl font-extrabold">Ainda não há atividades {periodo || turmaId ? "com esses filtros" : "registradas"}.</p>
          <p className="mt-1 text-sm text-ink-2">Os gráficos aparecem assim que você registrar as primeiras atividades.</p>
          <Link href="/registrar" className="btn-primary mt-5">
            Registrar atividade
          </Link>
        </div>
      ) : (
        <>
          {/* Resumo em texto */}
          <div className="card furos mt-4 bg-accent-soft/60 p-5 pt-7">
            <p className="mb-2 -rotate-1 font-script text-2xl leading-none text-cereja">em resumo…</p>
            <p className="leading-relaxed">
              {resumo({
                total: stats.geral.total,
                melhorTurma: turmaSelecionada ? undefined : melhorTurma,
                melhorCategoria,
                piorCategoria,
                melhorDia,
                piorDia,
              })}
            </p>
          </div>

          {/* Destaques */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <Destaque
              titulo="Aderência geral"
              valor={pct(stats.geral.aderencia)}
              detalhe={`${stats.geral.total} ${stats.geral.total === 1 ? "atividade" : "atividades"}${turmaSelecionada ? ` · ${turmaSelecionada.nome}` : ""}`}
            />
            {!turmaSelecionada && (
              <Destaque titulo="Turma que mais se deu bem" grupo={melhorTurma} sinal="melhor" />
            )}
            <Destaque titulo="Categoria com mais adesão" grupo={melhorCategoria} sinal="melhor" />
            <Destaque titulo="Categoria com menos adesão" grupo={piorCategoria} sinal="pior" />
            <Destaque titulo="Melhor dia da semana" grupo={melhorDia} sinal="melhor" />
            <Destaque titulo="Dia mais difícil" grupo={piorDia} sinal="pior" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-2">
            <LegendaReceptividade />
            <span>Aderência: adoraram conta 100%, gostaram 67%, neutro 33%, não curtiram 0%.</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {!turmaSelecionada && (
              <Secao titulo="Turmas" subtitulo="Da que mais aderiu para a que menos aderiu">
                <Ranking grupos={stats.turmas} destaque={{ melhor: melhorTurma?.chave, pior: piorTurma?.chave }} />
              </Secao>
            )}
            <Secao titulo="Categorias" subtitulo="Categorias da prática, da maior para a menor adesão">
              <Ranking grupos={stats.categorias} destaque={{ melhor: melhorCategoria?.chave, pior: piorCategoria?.chave }} />
            </Secao>
            <Secao titulo="Dias da semana" subtitulo="Como cada dia costuma render">
              <Ranking grupos={stats.dias} destaque={{ melhor: melhorDia?.chave, pior: piorDia?.chave }} />
            </Secao>
          </div>
        </>
      )}
    </div>
  );
}

function Secao({ titulo, subtitulo, children }: { titulo: string; subtitulo: string; children: React.ReactNode }) {
  return (
    <section className="painel p-5 sm:p-6">
      <h2 className="titulo-secao">{titulo}</h2>
      <p className="mb-5 text-sm text-ink-2">{subtitulo}</p>
      {children}
    </section>
  );
}

function Destaque({
  titulo,
  grupo,
  valor,
  detalhe,
  sinal,
}: {
  titulo: string;
  grupo?: Grupo;
  valor?: string;
  detalhe?: string;
  sinal?: "melhor" | "pior";
}) {
  const principal = valor ?? grupo?.nome;
  return (
    <div className="card relative overflow-hidden p-4 shadow-[3px_3px_0_0_var(--sombra)]">
      {sinal && (
        <span aria-hidden className={`absolute inset-y-0 left-0 w-1 ${sinal === "melhor" ? "bg-adoraram" : "bg-nao-curtiram"}`} />
      )}
      <p className="rotulo">{titulo}</p>
      {principal ? (
        <>
          <p className="mt-2 flex items-center gap-2 font-display text-2xl leading-tight font-extrabold sm:text-3xl">
            {grupo?.emoji && <span aria-hidden>{grupo.emoji}</span>}
            <span className="truncate">{principal}</span>
          </p>
          <p className="mt-1 text-xs text-muted">
            {detalhe ?? (grupo ? `${pct(grupo.aderencia)} de aderência · ${grupo.total} ativ.` : "")}
          </p>
        </>
      ) : (
        <p className="mt-1.5 text-sm text-muted">Precisa de mais dados</p>
      )}
    </div>
  );
}

function resumo({
  total,
  melhorTurma,
  melhorCategoria,
  piorCategoria,
  melhorDia,
  piorDia,
}: {
  total: number;
  melhorTurma?: Grupo;
  melhorCategoria?: Grupo;
  piorCategoria?: Grupo;
  melhorDia?: Grupo;
  piorDia?: Grupo;
}) {
  const frases: React.ReactNode[] = [
    <>
      Com base em <strong>{total}</strong> {total === 1 ? "atividade" : "atividades"}:
    </>,
  ];
  if (melhorTurma)
    frases.push(
      <>
        a turma <strong>{melhorTurma.nome}</strong> é a que mais aderiu ({pct(melhorTurma.aderencia)})
      </>,
    );
  if (melhorCategoria)
    frases.push(
      <>
        atividades de <strong>{melhorCategoria.nome}</strong> são as mais bem recebidas
      </>,
    );
  if (piorCategoria)
    frases.push(
      <>
        <strong>{piorCategoria.nome}</strong> é a que menos funciona
      </>,
    );
  if (melhorDia && piorDia)
    frases.push(
      <>
        <strong>{melhorDia.nome.toLowerCase()}</strong> costuma ser o melhor dia e{" "}
        <strong>{piorDia.nome.toLowerCase()}</strong> o mais difícil
      </>,
    );

  if (frases.length === 1) return <>{frases[0]} registre mais algumas para ver os padrões aparecerem.</>;

  return frases.map((f, i) => (
    <span key={i}>
      {i > 1 && (i === frases.length - 1 ? " e " : "; ")}
      {i === 1 && " "}
      {f}
      {i === frases.length - 1 && "."}
    </span>
  ));
}
