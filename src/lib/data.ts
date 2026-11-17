import "server-only";
import { cache } from "react";
import { requireUser } from "@/lib/supabase/server";
import type { ResumoInicio } from "@/lib/modulos";
import type { Atividade, Receptividade, Tag, Turma } from "@/lib/types";

const ATIVIDADE_SELECT =
  "id, titulo, data, receptividade, observacao, turma:turmas!inner(id, nome), atividade_tags(tag:tags(id, nome, cor))";

type AtividadeRow = {
  id: string;
  titulo: string;
  data: string;
  receptividade: Receptividade;
  observacao: string | null;
  turma: Turma;
  atividade_tags: { tag: Tag | null }[];
};

function toAtividade(row: AtividadeRow): Atividade {
  return {
    id: row.id,
    titulo: row.titulo,
    data: row.data,
    receptividade: row.receptividade,
    observacao: row.observacao,
    turma: row.turma,
    tags: row.atividade_tags
      .map((at) => at.tag)
      .filter((t): t is Tag => t !== null)
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
  };
}

export async function getTurmas(): Promise<Turma[]> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("turmas").select("id, nome").order("nome");
  if (error) throw error;
  return sortByNome(data);
}

export async function getTags(): Promise<Tag[]> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("tags").select("id, nome, cor").order("nome");
  if (error) throw error;
  return sortByNome(data);
}

/** Turmas/tags com a quantidade de atividades de cada uma (tela de gerenciamento). */
export async function getTurmasETagsComContagem() {
  const { supabase } = await requireUser();
  const [turmas, tags] = await Promise.all([
    supabase.from("turmas").select("id, nome, atividades(count)"),
    supabase.from("tags").select("id, nome, cor, atividade_tags(count)"),
  ]);
  if (turmas.error) throw turmas.error;
  if (tags.error) throw tags.error;

  return {
    turmas: sortByNome(
      turmas.data.map((t) => ({
        id: t.id as string,
        nome: t.nome as string,
        total: (t.atividades as { count: number }[])[0]?.count ?? 0,
      })),
    ),
    tags: sortByNome(
      tags.data.map((t) => ({
        id: t.id as string,
        nome: t.nome as string,
        cor: t.cor as number,
        total: (t.atividade_tags as { count: number }[])[0]?.count ?? 0,
      })),
    ),
  };
}

export type FiltrosAtividades = {
  turmaId?: string;
  tagId?: string;
  receptividade?: Receptividade;
  desde?: string;
  ate?: string;
};

export async function getAtividades(filtros: FiltrosAtividades = {}, limite?: number) {
  const { supabase } = await requireUser();

  let ids: string[] | undefined;
  if (filtros.tagId) {
    const { data, error } = await supabase
      .from("atividade_tags")
      .select("atividade_id")
      .eq("tag_id", filtros.tagId);
    if (error) throw error;
    ids = data.map((r) => r.atividade_id as string);
    if (ids.length === 0) return [];
  }

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
    if (filtros.receptividade) query = query.eq("receptividade", filtros.receptividade);
    if (filtros.desde) query = query.gte("data", filtros.desde);
    if (filtros.ate) query = query.lte("data", filtros.ate);
    if (ids) query = query.in("id", ids);

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

function sortByNome<T extends { nome: string }>(items: T[]) {
  return [...items].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR", { numeric: true, sensitivity: "base" }),
  );
}

/** Números rápidos para a tela de início (só contagens, sem carregar atividades). */
export const getResumoInicio = cache(async (): Promise<ResumoInicio> => {
  const { supabase } = await requireUser();
  const contar = (tabela: string, receptividade?: Receptividade) => {
    let query = supabase.from(tabela).select("id", { count: "exact", head: true });
    if (receptividade) query = query.eq("receptividade", receptividade);
    return query;
  };

  const [atividades, boas, neutras, turmas, tags, ultima] = await Promise.all([
    contar("atividades"),
    contar("atividades", "boa"),
    contar("atividades", "neutra"),
    contar("turmas"),
    contar("tags"),
    supabase.from("atividades").select("data").order("data", { ascending: false }).limit(1),
  ]);
  for (const r of [atividades, boas, neutras, turmas, tags, ultima]) if (r.error) throw r.error;

  const total = atividades.count ?? 0;
  return {
    atividades: total,
    turmas: turmas.count ?? 0,
    tags: tags.count ?? 0,
    /** Mesma fórmula de `stats.ts`: boa = 1, neutra = ½, ruim = 0. */
    aderencia: total ? (((boas.count ?? 0) + (neutras.count ?? 0) * 0.5) / total) * 100 : null,
    ultimaData: (ultima.data?.[0]?.data as string | undefined) ?? null,
  };
});
