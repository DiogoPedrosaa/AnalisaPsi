/* Ordem, etapa e cor das turmas (pastas da tela de início, chips do formulário, filtros). */

export type Etapa = "fundamental" | "medio";

/** Quantas cores de pasta existem (`--pasta-1` … `--pasta-7`, ver DESIGN.md › Cores das pastas). */
export const TOTAL_CORES_PASTA = 7;

const MEDIO = /m[eé]dio/i;
/** Sigla "EM" / "E.M." só em maiúsculas, para não confundir com a palavra "em". */
const SIGLA_MEDIO = /\bE\.?M\b/;
const FUNDAMENTAL = /fund/i;

/**
 * Lê a etapa e a série a partir do nome livre da turma:
 * "6º Ano" → fundamental 6; "1º Médio", "2ª série do Ensino Médio", "3º EM" → médio 1/2/3.
 * Nomes sem série reconhecível ("Turma de reforço") ficam com etapa e série nulas.
 */
export function etapaDaTurma(nome: string): { etapa: Etapa | null; serie: number | null } {
  const numero = nome.match(/\d+/);
  const n = numero ? Number(numero[0]) : null;

  if (MEDIO.test(nome) || SIGLA_MEDIO.test(nome)) return { etapa: "medio", serie: n !== null && n >= 1 && n <= 4 ? n : null };
  if (n !== null && n >= 1 && n <= 9) return { etapa: "fundamental", serie: n };
  if (FUNDAMENTAL.test(nome)) return { etapa: "fundamental", serie: null };
  return { etapa: null, serie: null };
}

/** Posição da turma na ordem escolar: 1º–9º ano, depois 1º–3º médio, depois o resto. */
function posicao(nome: string) {
  const { etapa, serie } = etapaDaTurma(nome);
  if (etapa === "fundamental") return serie ?? 9.5;
  if (etapa === "medio") return 10 + (serie ?? 5);
  return 100;
}

/**
 * Ordena as turmas na ordem da escola (6º, 7º, 8º, 9º, 1º médio, 2º médio, 3º médio), em vez da
 * ordem alfabética (que punha o médio na frente). Empates (6º A, 6º B) vão por nome. Não altera a lista.
 */
export function ordenarTurmas<T extends { nome: string }>(turmas: readonly T[]): T[] {
  return [...turmas].sort(
    (a, b) =>
      posicao(a.nome) - posicao(b.nome) ||
      a.nome.localeCompare(b.nome, "pt-BR", { numeric: true, sensitivity: "base" }),
  );
}

/**
 * Rótulo da etapa: curto para a aba da pasta ("Fund. II", "Médio") ou por extenso para o topo do
 * caderno ("Ensino Fundamental II", "Ensino Médio"). Null quando não dá para saber.
 */
export function rotuloEtapa(nome: string, extenso = false) {
  const { etapa, serie } = etapaDaTurma(nome);
  if (etapa === "medio") return extenso ? "Ensino Médio" : "Médio";
  if (etapa === "fundamental") {
    const ciclo = serie === null ? "" : serie <= 5 ? " I" : " II";
    return extenso ? `Ensino Fundamental${ciclo}` : `Fund.${ciclo}`;
  }
  return null;
}

/** Tira acentos, pontos e caixa, para comparar nomes ("Fund. II" ~ "fund ii"). */
function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\./g, "")
    .toLowerCase();
}

/** "8º Ano (Fund. II)"; sem repetir a etapa quando o nome já diz ("1º Médio") nem inventar uma. */
export function rotuloDaTurma(nome: string) {
  const etapa = rotuloEtapa(nome);
  if (!etapa || normalizar(nome).includes(normalizar(etapa))) return nome;
  return `${nome} (${etapa})`;
}

/** Cor da pasta (1 a 7) pela posição da turma na lista já ordenada; a partir da 8ª, as cores se repetem. */
export function corDaPasta(indice: number) {
  const i = Math.max(0, Math.floor(indice));
  return (i % TOTAL_CORES_PASTA) + 1;
}

/**
 * Turma que o formulário de registro já abre marcada: a pedida em `?turma=` (vindo do botão
 * "Registrar nesta turma"), se ela existir; senão, a única turma cadastrada; senão, nenhuma ("").
 */
export function turmaPreSelecionada(turmas: readonly { id: string }[], pedida?: string) {
  if (pedida && turmas.some((t) => t.id === pedida)) return pedida;
  return turmas.length === 1 ? turmas[0].id : "";
}
