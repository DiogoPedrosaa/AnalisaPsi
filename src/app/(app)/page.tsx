import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Icone } from "@/components/icone";
import { SkeletonBloco } from "@/components/skeleton";
import { getResumoInicio } from "@/lib/data";
import { formatarDataLonga, hojeNoFuso, horaNoFuso, quandoFoi, saudacao } from "@/lib/dates";
import { detalheModulo, MODULOS, nomeDeExibicao, type ResumoInicio } from "@/lib/modulos";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Início" };

export default function InicioPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<div className="card p-6 sm:p-8"><SkeletonBloco linhas={3} /></div>}>
        <BoasVindas />
      </Suspense>

      <section>
        <h2 className="text-lg font-semibold">Módulos</h2>
        <p className="mt-1 mb-4 text-sm text-ink-2">Escolha por onde começar.</p>
        <Suspense fallback={<Modulos />}>
          <ModulosComResumo />
        </Suspense>
      </section>
    </div>
  );
}

async function BoasVindas() {
  const supabase = await createClient();
  const [{ data }, resumo] = await Promise.all([supabase.auth.getClaims(), getResumoInicio()]);
  const nome = nomeDeExibicao(data?.claims?.email, data?.claims?.user_metadata);
  const agora = new Date();
  const hoje = hojeNoFuso(agora);
  const dataLonga = formatarDataLonga(hoje);

  let status = "Que tal registrar a primeira atividade? Leva menos de um minuto.";
  if (resumo.ultimaData === hoje) status = "Você já registrou atividade hoje. ✨";
  else if (resumo.ultimaData) status = `Seu último registro foi ${quandoFoi(resumo.ultimaData, hoje)}.`;

  return (
    <section className="card relative overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-accent-soft" aria-hidden />
      <div className="relative">
        <p className="text-sm font-medium text-accent">{dataLonga.charAt(0).toUpperCase() + dataLonga.slice(1)}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {saudacao(horaNoFuso(agora))}
          {nome && `, ${nome}`}! <span aria-hidden>👋</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-2">
          Boas-vindas ao AnalisaPsi, seu caderno de atividades. {status}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/registrar" className="btn-primary">
            <Icone d="M12 5v14M5 12h14" className="size-4" />
            Registrar atividade
          </Link>
          <Link href="/dashboard" className="btn-ghost">
            Ver o painel
          </Link>
        </div>
      </div>
    </section>
  );
}

async function ModulosComResumo() {
  const resumo = await getResumoInicio();
  return <Modulos resumo={resumo} hoje={hojeNoFuso(new Date())} />;
}

/** Grade de cartões dos módulos. Sem `resumo`, mostra os cartões com a linha de números carregando. */
function Modulos({ resumo, hoje }: { resumo?: ResumoInicio; hoje?: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {MODULOS.map((m) => (
        <Link key={m.href} href={m.href} className="card group flex gap-4 p-5 transition hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Icone d={m.icon} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-2">
              <span className="font-semibold">{m.label}</span>
              <Icone d="M5 12h14M13 6l6 6-6 6" className="size-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
            </span>
            <span className="mt-1 block text-sm text-ink-2">{m.descricao}</span>
            {resumo && hoje ? (
              <span className="mt-3 block text-xs text-muted tabular-nums">{detalheModulo(m.href, resumo, hoje)}</span>
            ) : (
              <span className="mt-3 block h-4 w-32 animate-pulse rounded bg-card-2" aria-hidden />
            )}
          </span>
        </Link>
      ))}
    </div>
  );
}
