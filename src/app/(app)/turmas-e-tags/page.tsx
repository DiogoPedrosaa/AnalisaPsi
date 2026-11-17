import type { Metadata } from "next";
import { Suspense } from "react";
import { SkeletonBloco } from "@/components/skeleton";
import { getTurmasETagsComContagem } from "@/lib/data";
import { ListaTags, ListaTurmas } from "./listas";

export const metadata: Metadata = { title: "Turmas e tags" };

export default function TurmasETagsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Turmas e tags</h1>
      <p className="mt-1 mb-5 text-sm text-ink-2">
        Cadastre, renomeie ou apague. Renomear não afeta as atividades já registradas.
      </p>
      <Suspense
        fallback={
          <div className="grid gap-6 md:grid-cols-2">
            <SkeletonBloco linhas={4} />
            <SkeletonBloco linhas={4} />
          </div>
        }
      >
        <Conteudo />
      </Suspense>
    </>
  );
}

async function Conteudo() {
  const { turmas, tags } = await getTurmasETagsComContagem();
  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      <ListaTurmas turmas={turmas} />
      <ListaTags tags={tags} />
    </div>
  );
}
