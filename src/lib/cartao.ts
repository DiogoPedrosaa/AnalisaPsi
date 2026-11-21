/*
 * Detalhes visuais dos cartões de atividade (ver DESIGN.md › Cartão de atividade).
 */

/** Cores da fita washi, em rodízio pela posição do cartão (escritas por extenso para o Tailwind achar). */
export const CORES_FITA = ["bg-rosa-claro", "bg-lavanda", "bg-ceu", "bg-oliva-clara"] as const;

/** Cor da fita do cartão na posição `indice` (0, 1, 2… → rosa, lavanda, céu, oliva, rosa…). */
export function corDaFita(indice: number) {
  const i = Math.abs(Math.trunc(indice)) % CORES_FITA.length;
  return CORES_FITA[Number.isNaN(i) ? 0 : i];
}
