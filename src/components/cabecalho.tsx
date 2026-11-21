import { LogOut, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { BotaoBackup } from "@/components/botao-backup";
import { FaixaCorrida } from "@/components/enfeites";
import { Medalhao } from "@/components/logo";
import { NavTopo, NavTopoEstatica } from "@/components/nav";
import { sair } from "@/lib/actions";

export const FRASES_LETREIRO = [
  "Caderno de atividades em psicologia escolar",
  "Descubra o que funciona com cada turma",
  "Ensino fundamental II & ensino médio",
  "Escuta, arte, acolhimento & desenvolvimento socioemocional",
];

/**
 * Topo de todas as telas (ver DESIGN.md › Layout): letreiro cereja e cabeçalho creme com borda
 * ondulada, medalhão Ψ, nome do app, ações (registrar e sair) e a navegação em chips.
 */
export function Cabecalho() {
  return (
    <>
      <FaixaCorrida frases={FRASES_LETREIRO} />
      <header className="babado relative z-10 border-b-2 border-line/15 bg-card px-4 pt-6 pb-6 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <Link
              href="/"
              className="flex items-center gap-4 rounded-2xl focus-visible:ring-2 focus-visible:ring-rosa-forte focus-visible:outline-none sm:gap-5"
            >
              <Medalhao className="size-16 sm:size-24" />
              <span className="min-w-0">
                <span className="mb-2 hidden items-center gap-2 rounded-full border border-line bg-lavanda/70 px-3 py-0.5 text-xs font-bold text-ink sm:inline-flex">
                  Caderno de campo & planejamento
                </span>
                <span className="block font-display text-3xl leading-tight font-extrabold tracking-tight text-vinho sm:text-4xl">
                  Analisa<em className="font-semibold text-oliva">Psi</em>
                  <span className="hidden font-semibold text-oliva italic md:inline"> — Psicologia Escolar</span>
                </span>
                <span className="mt-1 hidden font-script text-2xl leading-tight text-ink/90 sm:block">
                  Descubra o que{" "}
                  <span className="font-bold underline decoration-rosa-forte decoration-wavy decoration-2">funciona</span> com
                  cada turma
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/registrar" className="btn-primary flex-1 px-5 lg:flex-none">
                <PlusCircle className="size-4" aria-hidden />
                Registrar atividade
              </Link>
              <BotaoBackup />
              <form action={sair}>
                <button type="submit" className="btn-claro" title="Sair">
                  <LogOut className="size-4 text-cereja" aria-hidden />
                  <span className="max-sm:sr-only">Sair</span>
                </button>
              </form>
            </div>
          </div>

          <div className="mt-5">
            <Suspense fallback={<NavTopoEstatica />}>
              <NavTopo />
            </Suspense>
          </div>
        </div>
      </header>
    </>
  );
}

/** Rodapé listrado de rosa com o recado num cartão creme. */
export function Rodape() {
  return (
    <footer className="estampa-rosa border-t-2 border-line px-4 py-6 text-center">
      <div className="inline-block rounded-2xl border-2 border-line bg-card px-6 py-3 shadow-[3px_3px_0_0_var(--sombra)]">
        <p className="font-display text-sm font-bold text-ink">AnalisaPsi • Caderno de atividades</p>
        <p className="mt-0.5 text-xs text-ink-2">Seus registros ficam salvos na sua conta e aparecem em qualquer aparelho.</p>
      </div>
    </footer>
  );
}
