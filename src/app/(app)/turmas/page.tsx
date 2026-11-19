import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Pasta } from "@/components/pasta";
import { SkeletonBloco } from "@/components/skeleton";
import { getPastasDeTurmas } from "@/lib/data";
import { hojeNoFuso } from "@/lib/dates";

export const metadata: Metadata = { title: "Pastas" };

export default function PastasPage() {
  return (
    <>
      <h1 className="titulo-pagina">Pastas das turmas</h1>
      <p className="subtitulo-pagina">Abra a pasta de uma turma para ver tudo o que já foi feito com ela.</p>
      <Suspense
        fallback={
          <div className="grid gap-x-3 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonBloco linhas={3} />
            <SkeletonBloco linhas={3} />
            <SkeletonBloco linhas={3} />
          </div>
        }
      >
        <Conteudo />
      </Suspense>
    </>
  );
}

async function Conteudo() {
  const pastas = await getPastasDeTurmas();
  const hoje = hojeNoFuso(new Date());

  if (pastas.length === 0) {
    return (
      <div className="card px-5 py-12 text-center">
        <p className="text-3xl" aria-hidden>
          🗂️
        </p>
        <p className="mt-2 text-sm text-ink-2">Nenhuma turma cadastrada ainda. Cada turma ganha a sua pasta.</p>
        <Link href="/turmas-e-tags" className="btn-primary mt-5">
          Cadastrar turma
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-x-3 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
      {pastas.map((p, i) => (
        <li key={p.id}>
          <Pasta id={p.id} nome={p.nome} resumo={p.resumo} hoje={hoje} indice={i} />
        </li>
      ))}
    </ul>
  );
}
