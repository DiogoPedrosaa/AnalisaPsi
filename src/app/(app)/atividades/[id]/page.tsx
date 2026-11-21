import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AtividadeForm } from "@/components/atividade-form";
import { FolhaFichario } from "@/components/fichario";
import { SkeletonBloco } from "@/components/skeleton";
import { getAtividade, getTags, getTurmas } from "@/lib/data";
import { caminhoDeVolta, isUuid } from "@/lib/params";

export const metadata: Metadata = { title: "Editar atividade" };

export default function EditarAtividadePage({ params, searchParams }: PageProps<"/atividades/[id]">) {
  return (
    <div className="max-w-2xl">
      <FolhaFichario titulo="Editar atividade" subtitulo="As mudanças valem para a pasta da turma, o histórico e o painel.">
        <Suspense fallback={<SkeletonBloco linhas={6} />}>
          <Formulario params={params} searchParams={searchParams} />
        </Suspense>
      </FolhaFichario>
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

  const [atividade, turmas, tags] = await Promise.all([getAtividade(id), getTurmas(), getTags()]);
  if (!atividade) notFound();

  return <AtividadeForm turmas={turmas} tags={tags} atividade={atividade} voltarPara={caminhoDeVolta(sp.voltar)} />;
}
