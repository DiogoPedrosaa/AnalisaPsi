import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AtividadeLista } from "@/components/atividade-lista";
import { Filtros } from "@/components/filtros";
import { ORDEM_RECEPTIVIDADE, RECEPTIVIDADE } from "@/components/receptividade";
import { SkeletonBloco } from "@/components/skeleton";
import { CATEGORIAS, ehCategoria } from "@/lib/categoria";
import { getAtividades, getTurmas } from "@/lib/data";
import { param, uuidParam } from "@/lib/params";
import { ehReceptividade } from "@/lib/receptividade";

export const metadata: Metadata = { title: "Histórico" };

const LIMITE = 300;

export default function HistoricoPage({ searchParams }: PageProps<"/historico">) {
  return (
    <>
      <h1 className="titulo-pagina">Histórico</h1>
      <p className="subtitulo-pagina">Tudo o que já foi registrado, do mais recente para o mais antigo.</p>
      <Suspense fallback={<SkeletonBloco linhas={6} />}>
        <Conteudo searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Conteudo({ searchParams }: { searchParams: PageProps<"/historico">["searchParams"] }) {
  const sp = await searchParams;
  const turmaId = uuidParam(sp.turma);
  const cat = param(sp.categoria);
  const categoria = ehCategoria(cat) ? cat : undefined;
  const reacao = param(sp.receptividade);
  const receptividade = ehReceptividade(reacao) ? reacao : undefined;

  const [turmas, atividades] = await Promise.all([getTurmas(), getAtividades({ turmaId, categoria, receptividade }, LIMITE)]);
  const filtrando = Boolean(turmaId || categoria || receptividade);

  return (
    <div className="space-y-5">
      <div className="card p-4">
        <Filtros
          campos={[
            {
              nome: "turma",
              rotulo: "Turma",
              todos: "Todas as turmas",
              valor: turmaId ?? "",
              opcoes: turmas.map((t) => ({ valor: t.id, rotulo: t.nome })),
            },
            {
              nome: "categoria",
              rotulo: "Categoria",
              todos: "Todas as práticas",
              valor: categoria ?? "",
              opcoes: CATEGORIAS.map((c) => ({ valor: c.id, rotulo: `${c.emoji} ${c.label}` })),
            },
            {
              nome: "receptividade",
              rotulo: "Reação",
              todos: "Qualquer",
              valor: receptividade ?? "",
              opcoes: ORDEM_RECEPTIVIDADE.map((r) => ({
                valor: r,
                rotulo: `${RECEPTIVIDADE[r].emoji} ${RECEPTIVIDADE[r].label}`,
              })),
            },
          ]}
        />
      </div>

      {atividades.length === 0 ? (
        <div className="card px-5 py-12 text-center text-sm text-ink-2">
          {filtrando ? (
            "Nenhuma atividade com esses filtros."
          ) : (
            <>
              Nada registrado ainda.{" "}
              <Link href="/registrar" className="font-medium text-accent hover:underline">
                Registrar a primeira atividade
              </Link>
            </>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-ink-2">
            {atividades.length === LIMITE
              ? `Mostrando as ${LIMITE} mais recentes — use os filtros para encontrar as mais antigas.`
              : `${atividades.length} ${atividades.length === 1 ? "atividade" : "atividades"}`}
          </p>
          <AtividadeLista atividades={atividades} />
        </>
      )}
    </div>
  );
}
