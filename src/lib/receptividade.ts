import type { Receptividade } from "@/lib/types";

/*
 * Escala de reação dos alunos (receptividade), do melhor para o pior: ordem, rótulos, pesos e
 * aderência. As classes de cor ficam em components/receptividade.tsx.
 */

/** Ordem fixa: Adoraram → Gostaram → Neutro → Não curtiram. Bate com o CHECK do banco (migração 0003). */
export const RECEPTIVIDADES = ["adoraram", "gostaram", "neutro", "nao_curtiram"] as const satisfies readonly Receptividade[];

/**
 * Rótulo, emoji e descrição de cada reação, como na ficha do diário (as classes de cor ficam em
 * components/receptividade.tsx). `nivel` é a versão usada nos relatórios ("Neutro (Regular)").
 */
export const ROTULO_RECEPTIVIDADE: Record<Receptividade, { label: string; emoji: string; descricao: string; nivel: string }> = {
  adoraram: { label: "Adoraram", emoji: "🤩", descricao: "Alto Engajamento", nivel: "Alto Engajamento" },
  gostaram: { label: "Gostaram", emoji: "🙂", descricao: "Bom Engajamento", nivel: "Bom Engajamento" },
  neutro: { label: "Neutro", emoji: "😐", descricao: "Regular / Dispersos", nivel: "Regular" },
  nao_curtiram: { label: "Não curtiram", emoji: "😕", descricao: "Baixo Engajamento", nivel: "Baixo Engajamento" },
};

/** Quanto cada reação vale na aderência (degraus iguais: 100%, 67%, 33%, 0%). */
export const PESO_RECEPTIVIDADE: Record<Receptividade, number> = {
  adoraram: 1,
  gostaram: 2 / 3,
  neutro: 1 / 3,
  nao_curtiram: 0,
};

export type ContagemReceptividade = Record<Receptividade, number> & { total: number };

/** Diz se o valor (vindo da URL, de um formulário…) é uma reação válida. */
export function ehReceptividade(valor: unknown): valor is Receptividade {
  return typeof valor === "string" && (RECEPTIVIDADES as readonly string[]).includes(valor);
}

/** Contagem zerada de cada reação. */
export function contagemVazia(): ContagemReceptividade {
  return { total: 0, adoraram: 0, gostaram: 0, neutro: 0, nao_curtiram: 0 };
}

/**
 * Aderência de 0 a 100 pela média dos pesos (Adoraram 1, Gostaram ⅔, Neutro ⅓, Não curtiram 0),
 * ou null sem atividades. Ex.: 1 adoraram + 1 não curtiram → 50%.
 */
export function calcularAderencia(c: ContagemReceptividade): number | null {
  if (!c.total) return null;
  const pontos = RECEPTIVIDADES.reduce((soma, k) => soma + c[k] * PESO_RECEPTIVIDADE[k], 0);
  return (pontos / c.total) * 100;
}
