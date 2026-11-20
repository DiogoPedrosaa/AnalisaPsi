import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CabecalhoInicio, CadernoDaTurma, GradePastas, GradePastasCarregando } from "@/components/inicio";
import { ORDEM_RECEPTIVIDADE } from "@/components/receptividade";
import { SkeletonBloco } from "@/components/skeleton";
import { getAtividades, getPastasDeTurmas } from "@/lib/data";
import { formatarDataLonga, hojeNoFuso, horaNoFuso, quandoFoi, saudacao } from "@/lib/dates";
import { nomeDeExibicao } from "@/lib/modulos";
import { param, uuidParam } from "@/lib/params";
import { filtrarAtividades, pastaMaisRecente, resumirPasta, tagsDasAtividades } from "@/lib/pastas";
import { createClient } from "@/lib/supabase/server";
import type { Receptividade } from "@/lib/types";

export const metadata: Metadata = { title: "Pastas" };

type Props = PageProps<"/">;

/**
 * Tela de início = tela das pastas (pedido da usuária: "algo prático, sem muitas telas").
 * Topo com "Registrar atividade", grade compacta das pastas e, embaixo, o caderno da pasta aberta
 * (`?turma=`), com filtros por tag e receptividade na própria URL.
 */
export default function InicioPage({ searchParams }: Props) {
  return (
    <div className="space-y-8">
      <Suspense
        fallback={
          <div className="card quadriculado p-5 sm:p-7">
            <SkeletonBloco linhas={3} />
          </div>
        }
      >
        <Cabecalho />
      </Suspense>

      <Suspense
        fallback={
          <>
            <GradePastasCarregando />
            <div className="card p-5 sm:p-6">
              <SkeletonBloco linhas={5} />
            </div>
          </>
        }
      >
        <Pastas searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Cabecalho() {
  const supabase = await createClient();
  const [{ data }, pastas] = await Promise.all([supabase.auth.getClaims(), getPastasDeTurmas()]);
  const nome = nomeDeExibicao(data?.claims?.email, data?.claims?.user_metadata);
  const agora = new Date();
  const hoje = hojeNoFuso(agora);
  const ultimaData = pastaMaisRecente(pastas)?.resumo.ultimaData;

  let status = "Que tal registrar a primeira atividade?";
  if (ultimaData === hoje) status = "Você já registrou atividade hoje. ✨";
  else if (ultimaData) status = `Seu último registro foi ${quandoFoi(ultimaData, hoje)}.`;

  return (
    <CabecalhoInicio saudacao={saudacao(horaNoFuso(agora))} nome={nome} dataLonga={formatarDataLonga(hoje)} status={status} />
  );
}

async function Pastas({ searchParams }: Pick<Props, "searchParams">) {
  const sp = await searchParams;
  const pedida = uuidParam(sp.turma);

  // Com `?turma=`, busca as atividades junto com as pastas (sem esperar uma pela outra).
  const [pastas, atividadesPedida] = await Promise.all([
    getPastasDeTurmas(),
    pedida ? getAtividades({ turmaId: pedida }) : null,
  ]);

  if (pastas.length === 0) {
    return (
      <div className="card px-5 py-12 text-center">
        <p className="text-3xl" aria-hidden>
          🗂️
        </p>
        <p className="mt-2 font-display text-2xl">Nenhuma turma cadastrada ainda</p>
        <p className="mt-1 text-sm text-ink-2">Cada turma ganha a sua pasta colorida.</p>
        <Link href="/turmas-e-tags" className="btn-primary mt-5">
          Cadastrar turmas
        </Link>
      </div>
    );
  }

  const aberta = pastas.find((p) => p.id === pedida) ?? pastaMaisRecente(pastas)!;
  const indice = pastas.indexOf(aberta);
  const todas = aberta.id === pedida && atividadesPedida ? atividadesPedida : await getAtividades({ turmaId: aberta.id });

  // Só aceita filtros que existem nesta pasta.
  const tags = tagsDasAtividades(todas);
  const tagParam = uuidParam(sp.tag);
  const tagId = tags.some((t) => t.id === tagParam) ? tagParam : undefined;
  const receptividade = ORDEM_RECEPTIVIDADE.find((r) => r === param(sp.receptividade)) as Receptividade | undefined;
  const filtro = { tagId, receptividade };

  return (
    <>
      <GradePastas pastas={pastas} abertaId={aberta.id} />
      <CadernoDaTurma
        turma={{ id: aberta.id, nome: aberta.nome }}
        indice={indice}
        resumo={resumirPasta(todas)}
        tags={tags}
        filtro={filtro}
        atividades={filtrarAtividades(todas, filtro)}
        hoje={hojeNoFuso(new Date())}
      />
    </>
  );
}
