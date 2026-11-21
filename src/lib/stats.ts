import { CATEGORIAS } from "@/lib/categoria";
import { DIAS_SEMANA, diaDaSemana } from "@/lib/dates";
import { calcularAderencia, type ContagemReceptividade, contagemVazia } from "@/lib/receptividade";
import type { Atividade, Receptividade } from "@/lib/types";

/** Abaixo disso, o grupo aparece marcado como "poucos dados" e não entra nos destaques. */
export const MIN_AMOSTRA = 3;

export type Grupo = ContagemReceptividade & {
  chave: string;
  nome: string;
  /** Emoji da categoria (só nos grupos de categoria). */
  emoji?: string;
  /**
   * Aderência de 0 a 100 (Adoraram 1, Gostaram ⅔, Neutro ⅓, Não curtiram 0; ver `calcularAderencia`).
   * Ex.: 2 adoraram + 1 neutro + 1 não curtiram → (2 + ⅓) / 4 ≈ 58,3%. Sem atividades, 0.
   */
  aderencia: number;
};

function novoGrupo(chave: string, nome: string, emoji?: string): Grupo {
  return { chave, nome, emoji, ...contagemVazia(), aderencia: 0 };
}

function somar(grupo: Grupo, r: Receptividade) {
  grupo.total += 1;
  grupo[r] += 1;
}

function fechar(grupos: Grupo[]) {
  for (const g of grupos) {
    g.aderencia = calcularAderencia(g) ?? 0;
  }
  return grupos;
}

/** Ordena do melhor para o pior; empate → quem tem mais atividades vem antes. */
export function ranking(grupos: Grupo[]) {
  return [...grupos].sort((a, b) => b.aderencia - a.aderencia || b.total - a.total);
}

/** Grupos com amostra suficiente para destacar (cai para todos se nenhum tiver). */
function elegiveis(grupos: Grupo[]) {
  const comDados = grupos.filter((g) => g.total > 0);
  const fortes = comDados.filter((g) => g.total >= MIN_AMOSTRA);
  return fortes.length ? fortes : comDados;
}

export function melhor(grupos: Grupo[]) {
  return ranking(elegiveis(grupos))[0];
}

export function pior(grupos: Grupo[]) {
  const lista = ranking(elegiveis(grupos));
  return lista.length > 1 ? lista[lista.length - 1] : undefined;
}

export function calcularEstatisticas(atividades: Atividade[]) {
  const geral = novoGrupo("geral", "Geral");
  const turmas = new Map<string, Grupo>();
  const categorias = new Map(CATEGORIAS.map((c) => [c.id as string, novoGrupo(c.id, c.label, c.emoji)]));
  const dias = DIAS_SEMANA.map((nome, i) => novoGrupo(String(i), nome));

  for (const a of atividades) {
    somar(geral, a.receptividade);

    let turma = turmas.get(a.turma.id);
    if (!turma) turmas.set(a.turma.id, (turma = novoGrupo(a.turma.id, a.turma.nome)));
    somar(turma, a.receptividade);

    const categoria = categorias.get(a.categoria);
    if (categoria) somar(categoria, a.receptividade);

    somar(dias[diaDaSemana(a.data)], a.receptividade);
  }

  // Segunda a sexta sempre aparecem; sábado/domingo só se tiver registro.
  const diasVisiveis = [1, 2, 3, 4, 5, 6, 0]
    .map((i) => dias[i])
    .filter((d) => d.total > 0 || (d.chave !== "0" && d.chave !== "6"));

  return {
    geral: fechar([geral])[0],
    turmas: ranking(fechar([...turmas.values()])),
    /** As 5 categorias sempre aparecem (as sem atividade ficam no fim do ranking). */
    categorias: ranking(fechar([...categorias.values()])),
    dias: fechar(diasVisiveis),
  };
}
