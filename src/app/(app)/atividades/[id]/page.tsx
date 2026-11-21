import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AtividadeForm } from "@/components/atividade-form";
import { FolhaFichario } from "@/components/fichario";
import { SkeletonBloco } from "@/components/skeleton";
import { getAtividade, getTurmas } from "@/lib/data";
import { caminhoDeVolta, isUuid } from "@/lib/params";

export const metadata: Metadata = { title: "Editar atividade" };

export default function EditarAtividadePage({ params, searchParams }: PageProps<"/atividades/[id]">) {
  return (
    <div className="max-w-2xl">
      <Suspense
        fallback={
          <FolhaFichario titulo="Editar Ficha de Atividade">
            <SkeletonBloco linhas={6} />
          </FolhaFichario>
        }
      >
        <Formulario params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Formulario({
  params,
  searchParams,
}: {
  params: PageProps<"/atividades/[id]">["params"];
  searchParams: PageProps<"/atividades/[id]">["searchParams"];
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  if (!isUuid(id)) notFound();

  const [atividade, turmas] = await Promise.all([getAtividade(id), getTurmas()]);
  if (!atividade) notFound();

  const voltar = caminhoDeVolta(sp.voltar);
  return (
    <FolhaFichario titulo="Editar Ficha de Atividade" fechar={voltar}>
      <AtividadeForm turmas={turmas} atividade={atividade} voltarPara={voltar} />
    </FolhaFichario>
  );
}
