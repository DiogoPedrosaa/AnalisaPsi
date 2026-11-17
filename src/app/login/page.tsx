import type { Metadata } from "next";
import { Icone } from "@/components/icone";
import { Logo } from "@/components/logo";
import { MODULOS } from "@/lib/modulos";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
      <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <section className="order-2 lg:order-1">
          <div className="hidden items-center gap-3 lg:flex">
            <Logo className="size-10" />
            <span className="text-xl font-bold tracking-tight">AnalisaPsi</span>
          </div>
          <p className="mt-6 hidden text-3xl font-bold tracking-tight lg:block">
            Descubra o que funciona com cada turma.
          </p>
          <p className="mt-3 hidden max-w-md text-ink-2 lg:block">
            Registre as atividades do dia em menos de um minuto e acompanhe, com dados de verdade, o que
            engaja mais cada grupo.
          </p>

          <p className="mb-3 text-sm font-semibold text-ink-2 lg:mt-8">O que você encontra aqui</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {MODULOS.map((m) => (
              <li key={m.href} className="card flex gap-3 p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icone d={m.icon} className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{m.label}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink-2">{m.descricao}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="order-1 mx-auto w-full max-w-sm lg:order-2 lg:max-w-none">
          <div className="mb-6 flex flex-col items-center text-center lg:hidden">
            <Logo className="size-12" />
            <p className="mt-3 text-xl font-bold tracking-tight">AnalisaPsi</p>
          </div>
          <div className="card p-6 shadow-sm sm:p-8">
            <h1 className="text-2xl font-bold tracking-tight">
              Que bom ver você! <span aria-hidden>👋</span>
            </h1>
            <p className="mt-1 mb-6 text-sm text-ink-2">Entre para continuar de onde parou.</p>
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
