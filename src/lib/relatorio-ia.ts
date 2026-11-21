import { formatarDataCurta, nomeDiaSemana } from "@/lib/dates";
import { tagsDasAtividades } from "@/lib/pastas";
import { RECEPTIVIDADES, ROTULO_RECEPTIVIDADE } from "@/lib/receptividade";
import { rotuloEtapa } from "@/lib/turmas";
import type { Atividade, Turma } from "@/lib/types";

/*
 * Texto do botão "Copiar para IA" do caderno da turma: um relatório com as atividades da turma,
 * ordenadas da reação mais alta para a mais baixa, e um prompt pronto para colar no ChatGPT,
 * Gemini ou Claude.
 */

const LINHA = "=".repeat(52);

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

/** Da reação mais alta (Adoraram) para a mais baixa; empate → a mais recente primeiro. */
export function ordenarPorReacao<T extends Pick<Atividade, "receptividade" | "data">>(atividades: T[]) {
  const posicao = (a: T) => RECEPTIVIDADES.indexOf(a.receptividade);
  return [...atividades].sort((a, b) => posicao(a) - posicao(b) || b.data.localeCompare(a.data));
}

/** Monta o relatório + prompt de uma turma. `autora` é o nome de quem registrou (pode ser vazio). */
export function textoParaIA({ turma, atividades, autora = "" }: { turma: Turma; atividades: Atividade[]; autora?: string }) {
  const nomeTurma = rotuloDaTurma(turma.nome);
  const quem = autora.trim();
  const linhas: string[] = [];

  linhas.push(LINHA, "DIÁRIO DE ESTÁGIO — PSICOLOGIA ESCOLAR");
  if (quem) linhas.push(`Estagiária: ${quem}`);
  linhas.push(`Relatório da Turma: ${nomeTurma}`, `Total de atividades registradas: ${atividades.length}`, LINHA, "");

  // Resumo por tag (as tags fazem o papel das "categorias").
  linhas.push("RESUMO POR TAG:");
  const tags = tagsDasAtividades(atividades);
  const semTag = atividades.filter((a) => a.tags.length === 0).length;
  for (const t of tags) linhas.push(`- ${t.nome}: ${t.total}`);
  if (semTag) linhas.push(`- Sem tag: ${semTag}`);
  if (!tags.length && !semTag) linhas.push("- (nenhuma atividade)");

  linhas.push("", "RESUMO POR ENGAJAMENTO:");
  for (const k of RECEPTIVIDADES) {
    const r = ROTULO_RECEPTIVIDADE[k];
    linhas.push(`- ${r.label} (${r.descricao}): ${atividades.filter((a) => a.receptividade === k).length}`);
  }

  linhas.push("", "ATIVIDADES APLICADAS (ORDENADAS DO MAIOR PARA O MENOR ENGAJAMENTO):");
  if (atividades.length === 0) linhas.push("(Nenhuma atividade registrada nesta turma ainda.)");
  ordenarPorReacao(atividades).forEach((a, i) => {
    const r = ROTULO_RECEPTIVIDADE[a.receptividade];
    const tagsAtv = a.tags.length ? a.tags.map((t) => t.nome).join(", ") : "(sem tag)";
    linhas.push(
      "",
      `[${i + 1}] ${a.titulo.toLocaleUpperCase("pt-BR")}`,
      `Turma: ${nomeTurma} | Data: ${formatarDataCurta(a.data)} (${nomeDiaSemana(a.data)}) | Tags: ${tagsAtv}`,
      `Reação dos Alunos: ${r.label} / ${r.descricao}`,
    );
    const descricao = a.observacao?.trim();
    if (descricao) linhas.push(`Descrição: ${descricao}`);
  });

  linhas.push(
    "",
    LINHA,
    "PROMPT SUGERIDO PARA ANÁLISE POR IA (ChatGPT / Gemini / Claude):",
    `"Olá! Sou ${quem ? `${quem}, ` : ""}estagiária de Psicologia Escolar. Acima está o relatório compilado das atividades que apliquei com a turma ${nomeTurma}, ordenadas pelo nível de engajamento dos alunos e contendo minhas observações de campo.`,
    "Com base nesses dados, por favor:",
    "1. Identifique padrões do que os alunos MAIS gostam (formatos, temas, dinâmicas e materiais com alto engajamento) e o que eles MENOS gostam ou gera resistência;",
    "2. Analise as observações qualitativas para apontar quais abordagens funcionam melhor para o perfil dessa faixa etária;",
    '3. Sugira 5 novas ideias criativas de atividades, rodas de conversa ou oficinas socioemocionais alinhadas às preferências dessa turma, incluindo objetivo, materiais simples e passo a passo."',
  );

  return linhas.join("\n");
}
