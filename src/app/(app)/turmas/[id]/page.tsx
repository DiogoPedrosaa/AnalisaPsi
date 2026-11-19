import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AtividadeLista } from "@/components/atividade-lista";
import { Filtros } from "@/components/filtros";
import { Icone } from "@/components/icone";
import { BarraReceptividade } from "@/components/ranking";
import { ORDEM_RECEPTIVIDADE, RECEPTIVIDADE } from "@/components/receptividade";
import { SkeletonBloco } from "@/components/skeleton";
import { getAtividades, getTurma } from "@/lib/data";
import { hojeNoFuso } from "@/lib/dates";
import { isUuid, param, uuidParam } from "@/lib/params";
import { aderenciaPasta, detalhePasta, filtrarAtividades, resumirPasta, tagsDasAtividades } from "@/lib/pastas";
import type { Receptividade } from "@/lib/types";

export const metadata: Metadata = { title: "Pasta da turma" };

type Props = PageProps<"/turmas/[id]">;

export default function PastaDaTurmaPage({ params, searchParams }: Props) {
  return (
    <>
      <Link href="/turmas" className="btn-ghost -ml-3 mb-2 inline-flex items-center gap-1.5 py-1.5 text-sm">
        <Icone d="M19 12H5M11 18l-6-6 6-6" className="size-4" />
        Todas as pastas
      </Link>
      <Suspense fallback={<SkeletonBloco linhas={6} />}>
        <Conteudo params={params} searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Conteudo({ params, searchParams }: Pick<Props, "params" | "searchParams">) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  if (!isUuid(id)) notFound();

  const [turma, todas] = await Promise.all([getTurma(id), getAtividades({ turmaId: id })]);
  if (!turma) notFound();

  const hoje = hojeNoFuso(new Date());
  const resumo = resumirPasta(todas);
  const aderencia = aderenciaPasta(resumo);
  const tags = tagsDasAtividades(todas);

  // Só aceita filtros que existem nesta pasta.
  const tagParam = uuidParam(sp.tag);
  const tagId = tags.some((t) => t.id === tagParam) ? tagParam : undefined;
  const receptividade = ORDEM_RECEPTIVIDADE.find((r) => r === param(sp.receptividade)) as Receptividade | undefined;
  const atividades = filtrarAtividades(todas, { tagId, receptividade });
  const filtrando = Boolean(tagId || receptividade);

  // Ao editar uma atividade, volta para esta pasta com os mesmos filtros.
  const qs = new URLSearchParams();
  if (tagId) qs.set("tag", tagId);
  if (receptividade) qs.set("receptividade", receptividade);
  const aqui = qs.size ? `/turmas/${id}?${qs}` : `/turmas/${id}`;

  return (
    <div className="space-y-5">
      <header>
        <p className="rotulo">Pasta da turma</p>
        <h1 className="titulo-pagina mt-1">{turma.nome}</h1>
        <p className="subtitulo-pagina">
          {resumo.total ? detalhePasta(resumo, hoje) : "Nada registrado nesta turma ainda."}
        </p>
        {resumo.total > 0 && (
          <div className="max-w-sm">
            <BarraReceptividade contagem={resumo} />
            <p className="mt-1 text-xs text-muted">
              {ORDEM_RECEPTIVIDADE.filter((k) => resumo[k] > 0)
                .map((k) => `${resumo[k]} ${RECEPTIVIDADE[k].label.toLowerCase()}`)
                .join(" · ")}
              {aderencia && ` · ${aderencia}`}
            </p>
          </div>
        )}
      </header>

      {resumo.total === 0 ? (
        <div className="card px-5 py-12 text-center">
          <p className="text-3xl" aria-hidden>
            🗂️
          </p>
          <p className="mt-2 text-sm text-ink-2">Esta pasta ainda está vazia.</p>
          <Link href="/registrar" className="btn-primary mt-5">
            Registrar atividade
          </Link>
        </div>
      ) : (
        <>
          <div className="card p-4">
            <Filtros
              campos={[
                {
                  nome: "tag",
                  rotulo: "Tag",
                  todos: "Todas as tags",
                  valor: tagId ?? "",
                  opcoes: tags.map((t) => ({ valor: t.id, rotulo: `${t.nome} (${t.total})` })),
                },
                {
                  nome: "receptividade",
                  rotulo: "Receptividade",
                  todos: "Qualquer",
                  valor: receptividade ?? "",
                  opcoes: ORDEM_RECEPTIVIDADE.filter((r) => resumo[r] > 0).map((r) => ({
                    valor: r,
                    rotulo: `${RECEPTIVIDADE[r].emoji} ${RECEPTIVIDADE[r].label} (${resumo[r]})`,
                  })),
                },
              ]}
            />
          </div>

          {atividades.length === 0 ? (
            <div className="card px-5 py-12 text-center text-sm text-ink-2">
              Nenhuma atividade desta turma com esses filtros.
            </div>
          ) : (
            <>
              {filtrando && (
                <p className="text-sm text-ink-2">
                  {atividades.length} de {resumo.total} {resumo.total === 1 ? "atividade" : "atividades"}
                </p>
              )}
              <AtividadeLista atividades={atividades} mostrarTurma={false} voltarPara={aqui} />
            </>
          )}
        </>
      )}
    </div>
  );
}
