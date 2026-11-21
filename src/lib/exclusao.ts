/** Textos do modal de confirmação de exclusão (título + o que acontece ao apagar). */
export type AvisoExclusao = { titulo: string; descricao: string };

function plural(n: number) {
  return `${n} ${n === 1 ? "atividade" : "atividades"}`;
}

const IRREVERSIVEL = "Isso não pode ser desfeito.";

export function avisoExcluirAtividade(titulo: string, turma: string): AvisoExclusao {
  return {
    titulo: "Apagar atividade?",
    descricao: `“${titulo}” (${turma}) será apagada. ${IRREVERSIVEL}`,
  };
}

export function avisoExcluirTurma(nome: string, total: number): AvisoExclusao {
  return {
    titulo: "Apagar turma?",
    descricao: total
      ? `A turma “${nome}” e ${total === 1 ? "a atividade registrada" : `as ${plural(total)} registradas`} nela serão apagadas. ${IRREVERSIVEL}`
      : `A turma “${nome}” será apagada. ${IRREVERSIVEL}`,
  };
}
