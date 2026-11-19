import type { Metadata } from "next";
import { Suspense } from "react";
import { CartaoBoasVindas, Modulos, SecaoModulos } from "@/components/inicio";
import { SkeletonBloco } from "@/components/skeleton";
import { getResumoInicio } from "@/lib/data";
import { formatarDataLonga, hojeNoFuso, horaNoFuso, quandoFoi, saudacao } from "@/lib/dates";
import { nomeDeExibicao } from "@/lib/modulos";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Início" };

export default function InicioPage() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="card quadriculado p-6 sm:p-10">
            <SkeletonBloco linhas={4} />
          </div>
        }
      >
        <BoasVindas />
      </Suspense>

      <SecaoModulos>
        <Suspense fallback={<Modulos />}>
          <ModulosComResumo />
        </Suspense>
      </SecaoModulos>
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

  let status = "Que tal registrar a primeira atividade?";
  if (resumo.ultimaData === hoje) status = "Você já registrou atividade hoje. ✨";
  else if (resumo.ultimaData) status = `Seu último registro foi ${quandoFoi(resumo.ultimaData, hoje)}.`;

  return <CartaoBoasVindas saudacao={saudacao(horaNoFuso(agora))} nome={nome} dataLonga={dataLonga} status={status} resumo={resumo} />;
}

async function ModulosComResumo() {
  const resumo = await getResumoInicio();
  return <Modulos resumo={resumo} hoje={hojeNoFuso(new Date())} />;
}
