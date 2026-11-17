import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AtividadeForm, type Sugestao } from "@/components/atividade-form";
import { AtividadeLista } from "@/components/atividade-lista";
import { SkeletonBloco } from "@/components/skeleton";
import { getAtividades, getTags, getTurmas } from "@/lib/data";

export const metadata: Metadata = { title: "Registrar" };

export default function RegistrarPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
      <section>
        <h1 className="text-2xl font-bold tracking-tight">Registrar atividade</h1>
        <p className="mt-1 mb-5 text-sm text-ink-2">Leva menos de um minuto. O dia da semana é preenchido sozinho.</p>
        <div className="card p-5 sm:p-6">
          <Suspense fallback={<SkeletonBloco linhas={6} />}>
            <Formulario />
          </Suspense>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between lg:mt-[4.25rem]">
          <h2 className="text-lg font-semibold">Últimos registros</h2>
          <Link href="/historico" className="text-sm font-medium text-accent hover:underline">
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

async function Formulario() {
  const [turmas, tags, anteriores] = await Promise.all([getTurmas(), getTags(), getAtividades({}, 300)]);

  // Títulos já usados (mais recentes primeiro) com as tags da última vez.
  const sugestoes: Sugestao[] = [];
  const vistos = new Set<string>();
  for (const a of anteriores) {
    const chave = a.titulo.toLowerCase();
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    sugestoes.push({ titulo: a.titulo, tagIds: a.tags.map((t) => t.id) });
  }

  return <AtividadeForm turmas={turmas} tags={tags} sugestoes={sugestoes} />;
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
  return <AtividadeLista atividades={atividades} />;
}
