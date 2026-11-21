import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AtividadeForm, type Sugestao } from "@/components/atividade-form";
import { AtividadeLista } from "@/components/atividade-lista";
import { FolhaFichario } from "@/components/fichario";
import { SkeletonBloco } from "@/components/skeleton";
import { getAtividades, getTurmas } from "@/lib/data";
import { uuidParam } from "@/lib/params";
import { hrefDaPasta } from "@/lib/pastas";

export const metadata: Metadata = { title: "Registrar" };

export default function RegistrarPage({ searchParams }: PageProps<"/registrar">) {
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
      <section>
        <Suspense
          fallback={
            <FolhaFichario titulo="Nova Atividade Escolar">
              <SkeletonBloco linhas={6} />
            </FolhaFichario>
          }
        >
          <Formulario searchParams={searchParams} />
        </Suspense>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="washi -rotate-1 bg-ceu px-3 py-1 text-xs">Últimos registros</h2>
          <Link href="/historico" className="text-sm font-bold text-cereja hover:underline">
            Ver tudo
          </Link>
        </div>
        <Suspense fallback={<SkeletonBloco linhas={4} />}>
          <Recentes />
        </Suspense>
      </section>
    </div>
  );
}

async function Formulario({ searchParams }: { searchParams: PageProps<"/registrar">["searchParams"] }) {
  const [turmas, anteriores, sp] = await Promise.all([getTurmas(), getAtividades({}, 300), searchParams]);

  // Títulos já usados (mais recentes primeiro) com a categoria e o tema da última vez.
  const sugestoes: Sugestao[] = [];
  const vistos = new Set<string>();
  for (const a of anteriores) {
    const chave = a.titulo.toLowerCase();
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    sugestoes.push({ titulo: a.titulo, categoria: a.categoria, tema: a.tema });
  }

  const turmaInicial = uuidParam(sp.turma);
  const fechar = turmaInicial ? hrefDaPasta(turmaInicial) : "/";
  return (
    <FolhaFichario titulo="Nova Atividade Escolar" fechar={fechar}>
      <AtividadeForm turmas={turmas} sugestoes={sugestoes} turmaInicial={turmaInicial} cancelarPara={fechar} />
    </FolhaFichario>
  );
}

async function Recentes() {
  const atividades = await getAtividades({}, 8);
  if (atividades.length === 0) {
    return (
      <div className="card px-5 py-10 text-center text-sm text-ink-2">
        Nenhuma atividade ainda. Registre a primeira ao lado! ✏️
      </div>
    );
  }
  return <AtividadeLista atividades={atividades} compacta />;
}
