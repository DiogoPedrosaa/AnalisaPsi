/**
 * Limite de caracteres da descrição (coluna `observacao`). Precisa bater com a restrição do banco
 * (supabase/migrations/0002_observacao_longa.sql).
 */
export const MAX_OBSERVACAO = 20_000;

/** A partir de quantos caracteres a descrição aparece recolhida nas listas, com "Ler tudo". */
const CARACTERES_RECOLHER = 280;
/** …ou a partir de quantas linhas (textos curtos mas com muitas quebras). */
const LINHAS_RECOLHER = 4;

/** Diz se a descrição é longa o bastante para começar recolhida na lista de atividades. */
export function observacaoLonga(texto: string) {
  const limpo = texto.trim();
  return limpo.length > CARACTERES_RECOLHER || limpo.split("\n").length > LINHAS_RECOLHER;
}

/**
 * Aviso do contador de caracteres, que só aparece perto do limite (90%):
 * "18.500 de 20.000 caracteres". Longe do limite, devolve null.
 */
export function avisoTamanho(n: number, max = MAX_OBSERVACAO) {
  if (n < max * 0.9) return null;
  const fmt = (v: number) => v.toLocaleString("pt-BR");
  return `${fmt(n)} de ${fmt(max)} caracteres`;
}
