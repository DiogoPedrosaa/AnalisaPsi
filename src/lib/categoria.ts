import type { Categoria } from "@/lib/types";

/*
 * Categoria da Prática (substitui as tags). Ordem, chaves e rótulos iguais aos da ficha do
 * Diário de Estágio. As chaves batem com o CHECK do banco (migração 0004).
 */

export const CATEGORIAS = [
  { id: "roda_conversa", label: "Roda de Conversa", curto: "Roda de Conversa", emoji: "💬" },
  { id: "manual_artistica", label: "Atividade Manual / Artística", curto: "Manual / Artística", emoji: "🎨" },
  { id: "dinamica_jogo", label: "Dinâmica / Jogo Socioemocional", curto: "Dinâmica / Jogo", emoji: "🎲" },
  { id: "oficina_debate", label: "Oficina / Debate", curto: "Oficina / Debate", emoji: "🧠" },
  { id: "outro", label: "Outro", curto: "Outro", emoji: "📌" },
] as const satisfies readonly { id: Categoria; label: string; curto: string; emoji: string }[];

export const CATEGORIA_PADRAO: Categoria = "roda_conversa";

export type InfoCategoria = (typeof CATEGORIAS)[number];

const POR_ID = new Map<string, InfoCategoria>(CATEGORIAS.map((c) => [c.id, c]));

/** Diz se o valor (URL, formulário…) é uma categoria válida. */
export function ehCategoria(valor: unknown): valor is Categoria {
  return typeof valor === "string" && POR_ID.has(valor);
}

/** Rótulo, versão curta e emoji da categoria (valor desconhecido cai em "Outro"). */
export function infoCategoria(id: string): InfoCategoria {
  return POR_ID.get(id) ?? CATEGORIAS[CATEGORIAS.length - 1];
}

/** Quantas atividades há em cada categoria, sempre com as 5 categorias, na ordem da ficha. */
export function contarCategorias(atividades: { categoria: Categoria }[]) {
  return CATEGORIAS.map((c) => ({ ...c, total: atividades.filter((a) => a.categoria === c.id).length }));
}
