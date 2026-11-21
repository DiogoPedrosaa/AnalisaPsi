import type { Metadata } from "next";
import { Suspense } from "react";
import { SkeletonBloco } from "@/components/skeleton";
import { getTurmasComContagem } from "@/lib/data";
import { ListaTurmas } from "./listas";

export const metadata: Metadata = { title: "Turmas" };

export default function TurmasPage() {
  return (
    <>
      <h1 className="titulo-pagina">Turmas</h1>
      <p className="subtitulo-pagina">
        Cada turma é uma pasta do fichário. Cadastre, renomeie ou apague; renomear não afeta as atividades já registradas.
      </p>
      <Suspense
        fallback={
          <div className="max-w-2xl">
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
  const turmas = await getTurmasComContagem();
  return (
    <div className="max-w-2xl">
      <ListaTurmas turmas={turmas} />
    </div>
  );
}
