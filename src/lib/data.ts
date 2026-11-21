import "server-only";
import { cache } from "react";
import { requireUser } from "@/lib/supabase/server";
import { resumirPasta } from "@/lib/pastas";
import { ordenarTurmas } from "@/lib/turmas";
import type { Atividade, Categoria, Receptividade, Turma } from "@/lib/types";

const ATIVIDADE_SELECT =
  "id, titulo, data, categoria, tema, receptividade, descricao, observacoes, turma:turmas!inner(id, nome)";

type AtividadeRow = {
  id: string;
  titulo: string;
  data: string;
  categoria: Categoria;
  tema: string | null;
  receptividade: Receptividade;
  descricao: string | null;
  observacoes: string | null;
  turma: Turma;
};

function toAtividade(row: AtividadeRow): Atividade {
  return {
    id: row.id,
    titulo: row.titulo,
    data: row.data,
    categoria: row.categoria,
    tema: row.tema ?? "",
    receptividade: row.receptividade,
    descricao: row.descricao,
    observacoes: row.observacoes,
    turma: row.turma,
  };
}

export async function getTurmas(): Promise<Turma[]> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("turmas").select("id, nome");
  if (error) throw error;
  return ordenarTurmas(data);
}

/** Turmas com a quantidade de atividades de cada uma (tela de gerenciamento). */
export async function getTurmasComContagem() {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("turmas").select("id, nome, atividades(count)");
  if (error) throw error;
  return ordenarTurmas(
    data.map((t) => ({
      id: t.id as string,
      nome: t.nome as string,
      total: (t.atividades as { count: number }[])[0]?.count ?? 0,
    })),
  );
}

/** Uma turma pelo id (null se não existir ou não for da usuária). */
export const getTurma = cache(async (id: string): Promise<Turma | null> => {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("turmas").select("id, nome").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
});

/** Turmas na ordem da escola, com o resumo das atividades de cada uma (pastas da tela de início). */
export const getPastasDeTurmas = cache(async () => {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("turmas").select("id, nome, atividades(data, receptividade)");
  if (error) throw error;
  return ordenarTurmas(
    data.map((t) => ({
      id: t.id as string,
      nome: t.nome as string,
      resumo: resumirPasta(t.atividades as { data: string; receptividade: Receptividade }[]),
    })),
  );
});

export type FiltrosAtividades = {
  turmaId?: string;
  categoria?: Categoria;
  receptividade?: Receptividade;
  desde?: string;
  ate?: string;
};

export async function getAtividades(filtros: FiltrosAtividades = {}, limite?: number) {
  const { supabase } = await requireUser();

  const PAGINA = 1000;
  const resultado: Atividade[] = [];
  for (let inicio = 0; ; inicio += PAGINA) {
    const fim = limite ? Math.min(inicio + PAGINA, limite) - 1 : inicio + PAGINA - 1;
    let query = supabase
      .from("atividades")
      .select(ATIVIDADE_SELECT)
      .order("data", { ascending: false })
      .order("created_at", { ascending: false })
      .range(inicio, fim);

    if (filtros.turmaId) query = query.eq("turma_id", filtros.turmaId);
    if (filtros.categoria) query = query.eq("categoria", filtros.categoria);
    if (filtros.receptividade) query = query.eq("receptividade", filtros.receptividade);
    if (filtros.desde) query = query.gte("data", filtros.desde);
    if (filtros.ate) query = query.lte("data", filtros.ate);

    const { data, error } = await query.overrideTypes<AtividadeRow[], { merge: false }>();
    if (error) throw error;
    resultado.push(...data.map(toAtividade));

    const pediu = fim - inicio + 1;
    if (data.length < pediu || (limite && resultado.length >= limite)) break;
  }
  return resultado;
}

export async function getAtividade(id: string) {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("atividades")
    .select(ATIVIDADE_SELECT)
    .eq("id", id)
    .overrideTypes<AtividadeRow[], { merge: false }>();
  if (error) throw error;
  return data[0] ? toAtividade(data[0]) : null;
}
