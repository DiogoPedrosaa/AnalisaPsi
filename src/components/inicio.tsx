import Link from "next/link";
import { BordaRasgada, Brilho, Cereja, Estrela, Flor, SetaRabisco } from "@/components/enfeites";
import { Icone } from "@/components/icone";
import { detalheModulo, MODULOS, type ResumoInicio, selosDoInicio } from "@/lib/modulos";

/* Peças visuais da tela de início (sem busca de dados), ver DESIGN.md › Telas de entrada. */

/** Cores dos três selos em flor, na ordem de `selosDoInicio` (pêssego, vinho, rosa). */
const CORES_SELO = [
  { flor: "text-pessego", texto: "text-ink", giro: "-rotate-6" },
  { flor: "text-vinho", texto: "text-creme", giro: "rotate-3" },
  { flor: "text-rosa-claro", texto: "text-ink", giro: "-rotate-2" },
];

/** Cartão de boas-vindas: papel quadriculado, saudação em serifa, recadinho à mão e selos em flor. */
export function CartaoBoasVindas({
  saudacao,
  nome,
  dataLonga,
  status,
  resumo,
}: {
  saudacao: string;
  nome: string;
  dataLonga: string;
  status: string;
  resumo: ResumoInicio;
}) {
  return (
    <section className="card quadriculado relative overflow-hidden">
      <Cereja className="absolute top-4 right-4 size-12 rotate-12 sm:top-6 sm:right-8" />
      <Estrela className="absolute top-[42%] right-[46%] hidden size-5 rotate-12 text-vinho lg:block" />
      <Brilho className="absolute bottom-10 left-[44%] size-5 text-cereja" />

      <div className="relative grid gap-10 p-6 pb-10 sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <p className="rotulo">({dataLonga})</p>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
            {saudacao}
            {nome ? (
              <>
                ,<br />
                <em className="text-accent">{nome}</em>!
              </>
            ) : (
              "!"
            )}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-2">
            Boas-vindas ao AnalisaPsi, seu caderno de atividades. {status}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/registrar" className="btn-primary">
              <Icone d="M12 5v14M5 12h14" className="size-4" />
              Registrar atividade
            </Link>
            <Link href="/dashboard" className="btn-secundario">
              Ver o painel
            </Link>
          </div>
          <p className="mt-4 flex items-start gap-1 font-script text-3xl leading-none text-cereja">
            <SetaRabisco className="h-10 w-20 shrink-0 -scale-y-100 rotate-[200deg] text-vinho" />
            <span className="mt-5 -rotate-3">leva menos de um minuto!</span>
          </p>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-1 sm:gap-3" aria-label="Seus números">
          {selosDoInicio(resumo).map((s, i) => (
            <li key={s.rotulo} className={`${CORES_SELO[i].giro} transition hover:rotate-0`}>
              <Flor cor={CORES_SELO[i].flor} petalas={11} className={`size-26 text-center sm:size-30 ${CORES_SELO[i].texto}`}>
                <span className="block font-display text-4xl leading-none sm:text-[2.6rem]">{s.valor}</span>
                <span className="mt-1 block text-[10px] font-bold tracking-[0.14em] uppercase">{s.rotulo}</span>
              </Flor>
            </li>
          ))}
        </ul>
      </div>
      <div className="faixa-xadrez h-4" aria-hidden />
    </section>
  );
}


/** Seção "Por onde começamos hoje…": grade vermelha sobre rosa com bordas de papel rasgado. */
export function SecaoModulos({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative -mx-4 mt-16 mb-8 sm:mx-0" aria-labelledby="titulo-modulos">
      <BordaRasgada className="absolute bottom-full text-rosa" semente={3} />
      <div className="grade-rosa px-4 pt-10 pb-12 sm:px-8">
        <h2
          id="titulo-modulos"
          className="-rotate-2 text-center font-script text-5xl leading-none text-creme [text-shadow:2px_2px_0_var(--vinho)] sm:text-6xl"
        >
          Por onde começamos hoje…
        </h2>
        {children}
      </div>
      <BordaRasgada className="absolute top-full text-rosa" semente={11} invertida />
    </section>
  );
}

/** Cartões dos módulos (borda cereja, ícone dentro de uma flor). Sem `resumo`, a linha de números fica carregando. */
export function Modulos({ resumo, hoje }: { resumo?: ResumoInicio; hoje?: string }) {
  return (
    <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {MODULOS.map((m) => (
        <Link
          key={m.href}
          href={m.href}
          className="group flex flex-col items-center rounded-2xl border-[3px] border-cereja bg-card p-5 text-center transition hover:-translate-y-1 hover:shadow-[5px_5px_0_0_var(--vinho)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vinho/40"
        >
          <Flor cor="text-rosa-claro" petalas={9} className="size-20 text-accent transition group-hover:rotate-12">
            <Icone d={m.icon} className="size-7" />
          </Flor>
          <span className="etiqueta mt-4">{m.label}</span>
          <span className="mt-3 block text-sm leading-relaxed text-ink-2">{m.descricao}</span>
          <span className="mt-auto flex w-full items-center justify-center gap-1.5 pt-4">
            {resumo && hoje ? (
              <span className="text-xs text-muted tabular-nums">{detalheModulo(m.href, resumo, hoje)}</span>
            ) : (
              <span className="block h-4 w-32 animate-pulse rounded bg-card-2" aria-hidden />
            )}
          </span>
          <span className="mt-3 inline-flex items-center gap-1 font-script text-xl leading-none text-cereja">
            abrir
            <Icone d="M5 12h14M13 6l6 6-6 6" className="size-4 transition group-hover:translate-x-1" />
          </span>
        </Link>
      ))}
    </div>
  );
}
