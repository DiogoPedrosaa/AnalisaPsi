import { quandoFoi } from "@/lib/dates";
import { calcularAderencia, type ContagemReceptividade, contagemVazia } from "@/lib/receptividade";
import { MIN_AMOSTRA } from "@/lib/stats";
import type { Atividade, Receptividade, Tag } from "@/lib/types";

/* Lógica das "pastas" das turmas (tela de início: grade de pastas + caderno da turma aberta). */

export type ResumoPasta = ContagemReceptividade & {
  /** 0–100 (ver `calcularAderencia`), ou null sem atividades. */
  aderencia: number | null;
  /** yyyy-mm-dd da atividade mais recente. */
  ultimaData: string | null;
};

/** Contagem por receptividade, aderência e data mais recente das atividades de uma turma. */
export function resumirPasta(atividades: { data: string; receptividade: Receptividade }[]): ResumoPasta {
  const r: ResumoPasta = { ...contagemVazia(), aderencia: null, ultimaData: null };
  for (const a of atividades) {
    r.total += 1;
    r[a.receptividade] += 1;
    if (!r.ultimaData || a.data > r.ultimaData) r.ultimaData = a.data;
  }
  r.aderencia = calcularAderencia(r);
  return r;
}

/** Linha de apoio do cartão da pasta: "12 atividades · última há 3 dias" ou "Pasta vazia". */
export function detalhePasta(r: ResumoPasta, hoje: string) {
  if (!r.total || !r.ultimaData) return "Pasta vazia";
  const qtd = `${r.total} ${r.total === 1 ? "atividade" : "atividades"}`;
  return `${qtd} · última ${quandoFoi(r.ultimaData, hoje)}`;
}

/** Aderência para o cartão: "78% de aderência", "poucos dados" (abaixo de MIN_AMOSTRA) ou null. */
export function aderenciaPasta(r: ResumoPasta) {
  if (r.aderencia === null) return null;
  if (r.total < MIN_AMOSTRA) return "poucos dados";
  return `${Math.round(r.aderencia)}% de aderência`;
}

/** Tags que aparecem nas atividades da turma, com quantas vezes cada uma, em ordem alfabética. */
export function tagsDasAtividades(atividades: Atividade[]) {
  const mapa = new Map<string, Tag & { total: number }>();
  for (const a of atividades) {
    for (const t of a.tags) {
      const atual = mapa.get(t.id);
      if (atual) atual.total += 1;
      else mapa.set(t.id, { ...t, total: 1 });
    }
  }
  return [...mapa.values()].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }));
}

export type FiltroPasta = { tagId?: string; receptividade?: Receptividade };

/** Filtra as atividades da pasta por tag e/ou receptividade (sem filtro, devolve todas). */
export function filtrarAtividades(atividades: Atividade[], { tagId, receptividade }: FiltroPasta) {
  return atividades.filter(
    (a) => (!tagId || a.tags.some((t) => t.id === tagId)) && (!receptividade || a.receptividade === receptividade),
  );
}

/**
 * Pasta que abre sozinha na tela de início (quando não há `?turma=`): a da atividade mais recente,
 * que costuma ser a que se quer ver. Sem nenhuma atividade, a primeira da lista. Lista vazia: null.
 */
export function pastaMaisRecente<T extends { resumo: { ultimaData: string | null } }>(pastas: readonly T[]): T | null {
  let escolhida: T | null = null;
  for (const p of pastas) {
    const data = p.resumo.ultimaData;
    if (data && (!escolhida?.resumo.ultimaData || data > escolhida.resumo.ultimaData)) escolhida = p;
  }
  return escolhida ?? pastas[0] ?? null;
}

/** Endereço da pasta aberta na tela de início, com os filtros: "/?turma=…&tag=…&receptividade=…". */
export function hrefDaPasta(turmaId: string, { tagId, receptividade }: FiltroPasta = {}) {
  const qs = new URLSearchParams({ turma: turmaId });
  if (tagId) qs.set("tag", tagId);
  if (receptividade) qs.set("receptividade", receptividade);
  return `/?${qs}`;
}
