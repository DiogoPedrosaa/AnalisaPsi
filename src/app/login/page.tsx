import type { Metadata } from "next";
import { Brilho, Estrela8, FaixaCorrida, Flor, SetaRabisco } from "@/components/enfeites";
import { Icone } from "@/components/icone";
import { Marca } from "@/components/logo";
import { MODULOS } from "@/lib/modulos";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

const FRASES = [
  "Registre a atividade em menos de um minuto",
  "Descubra o que funciona com cada turma",
  "Seu caderno de atividades",
  "Dados de verdade, sem exagero",
];

export default function LoginPage() {
  return (
    <>
      <FaixaCorrida frases={FRASES} />
      <main className="flex flex-1 items-center justify-center overflow-x-clip px-4 py-10 sm:py-16">
        <div className="grid w-full max-w-5xl items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <section className="order-2 lg:order-1">
            <div className="hidden lg:block">
              <Marca tamanho="text-4xl" logo="size-11" />
              <p className="rotulo mt-10">(Seu caderno de atividades)</p>
              <p className="mt-3 font-display text-5xl leading-[1] tracking-tight xl:text-6xl">
                Descubra o que <em className="text-accent">funciona</em> com cada turma.
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-2">
                Registre as atividades do dia em menos de um minuto e acompanhe, com dados de verdade, o que
                engaja mais cada grupo.
              </p>
              <p className="mt-3 flex items-end gap-2 font-script text-3xl leading-none text-cereja">
                <span className="-rotate-3">é rapidinho, prometo!</span>
                <SetaRabisco className="h-10 w-24 text-vinho" />
              </p>
            </div>

            <p className="rotulo mb-4 lg:mt-10">O que você encontra aqui</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {MODULOS.map((m) => (
                <li key={m.href} className="flex gap-3 rounded-xl border-2 border-line bg-card p-4">
                  <Flor cor="text-rosa-claro" petalas={9} className="size-11 shrink-0 text-accent">
                    <Icone d={m.icon} className="size-4" />
                  </Flor>
                  <span>
                    <span className="block font-display text-xl leading-tight">{m.label}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-ink-2">{m.descricao}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
            <div className="mb-8 flex justify-center lg:hidden">
              <Marca tamanho="text-4xl" logo="size-10" />
            </div>

            <div className="estampa-estrelas relative rounded-[2rem] border-4 border-card p-5 shadow-[5px_5px_0_0_var(--line)] sm:p-9">
              <div className="card relative p-6 shadow-[4px_4px_0_0_var(--sombra)] sm:p-8">
                <span className="fita -top-3 -left-5 -rotate-[28deg]" aria-hidden />
                <span className="fita -right-5 -bottom-3 -rotate-[28deg]" aria-hidden />
                <Flor
                  cor="text-lavanda"
                  petalas={12}
                  className="absolute -top-9 -right-7 size-20 rotate-12 text-center font-script text-2xl leading-[0.85] text-ink sm:-right-10"
                >
                  <span aria-hidden>
                    oi!
                    <br />♥
                  </span>
                </Flor>

                <p className="rotulo flex items-center gap-1.5">
                  <Brilho className="size-3 text-cereja" /> Entrar
                </p>
                <h1 className="mt-2 font-display text-4xl leading-none tracking-tight">Que bom ver você!</h1>
                <p className="mt-2 mb-6 text-sm text-ink-2">Entre para continuar de onde parou.</p>
                <LoginForm />
              </div>
              <Estrela8 className="absolute -bottom-6 -left-5 size-12 -rotate-12 text-vinho" />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
