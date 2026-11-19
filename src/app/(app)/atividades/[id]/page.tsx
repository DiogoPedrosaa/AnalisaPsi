import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AtividadeForm } from "@/components/atividade-form";
import { SkeletonBloco } from "@/components/skeleton";
import { getAtividade, getTags, getTurmas } from "@/lib/data";
import { isUuid } from "@/lib/params";

export const metadata: Metadata = { title: "Editar atividade" };

export default function EditarAtividadePage({ params }: PageProps<"/atividades/[id]">) {
  return (
    <div className="max-w-2xl">
      <h1 className="titulo-pagina mb-6">Editar atividade</h1>
      <div className="card p-5 sm:p-6">
        <Suspense fallback={<SkeletonBloco linhas={6} />}>
          <Formulario params={params} />
        </Suspense>
      </div>
    </div>
  );
}

async function Formulario({ params }: { params: PageProps<"/atividades/[id]">["params"] }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();

  const [atividade, turmas, tags] = await Promise.all([getAtividade(id), getTurmas(), getTags()]);
  if (!atividade) notFound();

  return <AtividadeForm turmas={turmas} tags={tags} atividade={atividade} />;
}
