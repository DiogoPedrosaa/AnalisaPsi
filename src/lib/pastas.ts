import { quandoFoi } from "@/lib/dates";
import { calcularAderencia, type ContagemReceptividade, contagemVazia } from "@/lib/receptividade";
import { MIN_AMOSTRA } from "@/lib/stats";
import type { Atividade, Categoria, Receptividade } from "@/lib/types";

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

export type FiltroPasta = { categoria?: Categoria; receptividade?: Receptividade };

/** Filtra as atividades da pasta por categoria e/ou reação (sem filtro, devolve todas). */
export function filtrarAtividades<T extends Pick<Atividade, "categoria" | "receptividade">>(
  atividades: T[],
  { categoria, receptividade }: FiltroPasta,
) {
  return atividades.filter(
    (a) => (!categoria || a.categoria === categoria) && (!receptividade || a.receptividade === receptividade),
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

/** Endereço da pasta aberta na tela de início, com os filtros: "/?turma=…&categoria=…&receptividade=…". */
export function hrefDaPasta(turmaId: string, { categoria, receptividade }: FiltroPasta = {}) {
  const qs = new URLSearchParams({ turma: turmaId });
  if (categoria) qs.set("categoria", categoria);
  if (receptividade) qs.set("receptividade", receptividade);
  return `/?${qs}`;
}
