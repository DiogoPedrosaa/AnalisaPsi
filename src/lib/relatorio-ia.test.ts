import { describe, expect, it } from "vitest";
import { ordenarPorReacao, rotuloDaTurma, textoParaIA } from "./relatorio-ia";
import type { Atividade } from "./types";

const t8 = { id: "t8", nome: "8º Ano" };
const roda = { id: "roda", nome: "Roda de conversa", cor: 1 };
const oficina = { id: "oficina", nome: "Oficina / Debate", cor: 2 };

const leitura: Atividade = {
  id: "2",
  titulo: "Leitura de texto reflexivo sobre empatia",
  data: "2026-04-14",
  receptividade: "nao_curtiram",
  observacao: "Leitura coletiva de uma crônica curta. A turma ficou dispersa.",
  turma: t8,
  tags: [oficina],
};
const mito: Atividade = {
  id: "1",
  titulo: "Mito ou Verdade: Amizades e Redes Sociais",
  data: "2026-03-25",
  receptividade: "adoraram",
  observacao: "Cada aluno recebeu duas plaquinhas.\nEngajamento altíssimo!",
  turma: t8,
  tags: [roda],
};

describe("textoParaIA", () => {
  it("monta o relatório completo no formato do diário, do maior para o menor engajamento", () => {
    const texto = textoParaIA({ turma: t8, atividades: [leitura, mito], autora: "Thayanne Bernardi" });
    expect(texto.split("\n")).toEqual([
      "====================================================",
      "DIÁRIO DE ESTÁGIO — PSICOLOGIA ESCOLAR",
      "Estagiária: Thayanne Bernardi",
      "Relatório da Turma: 8º Ano (Fund. II)",
      "Total de atividades registradas: 2",
      "====================================================",
      "",
      "RESUMO POR TAG:",
      "- Oficina / Debate: 1",
      "- Roda de conversa: 1",
      "",
      "RESUMO POR ENGAJAMENTO:",
      "- Adoraram (Alto engajamento): 1",
      "- Gostaram (Bom engajamento): 0",
      "- Neutro (Regular / dispersos): 0",
      "- Não curtiram (Baixo engajamento): 1",
      "",
      "ATIVIDADES APLICADAS (ORDENADAS DO MAIOR PARA O MENOR ENGAJAMENTO):",
      "",
      "[1] MITO OU VERDADE: AMIZADES E REDES SOCIAIS",
      "Turma: 8º Ano (Fund. II) | Data: 25/03/2026 (Quarta-feira) | Tags: Roda de conversa",
      "Reação dos Alunos: Adoraram / Alto engajamento",
      "Descrição: Cada aluno recebeu duas plaquinhas.",
      "Engajamento altíssimo!",
      "",
      "[2] LEITURA DE TEXTO REFLEXIVO SOBRE EMPATIA",
      "Turma: 8º Ano (Fund. II) | Data: 14/04/2026 (Terça-feira) | Tags: Oficina / Debate",
      "Reação dos Alunos: Não curtiram / Baixo engajamento",
      "Descrição: Leitura coletiva de uma crônica curta. A turma ficou dispersa.",
      "",
      "====================================================",
      "PROMPT SUGERIDO PARA ANÁLISE POR IA (ChatGPT / Gemini / Claude):",
      '"Olá! Sou Thayanne Bernardi, estagiária de Psicologia Escolar. Acima está o relatório compilado das atividades que apliquei com a turma 8º Ano (Fund. II), ordenadas pelo nível de engajamento dos alunos e contendo minhas observações de campo.',
      "Com base nesses dados, por favor:",
      "1. Identifique padrões do que os alunos MAIS gostam (formatos, temas, dinâmicas e materiais com alto engajamento) e o que eles MENOS gostam ou gera resistência;",
      "2. Analise as observações qualitativas para apontar quais abordagens funcionam melhor para o perfil dessa faixa etária;",
      '3. Sugira 5 novas ideias criativas de atividades, rodas de conversa ou oficinas socioemocionais alinhadas às preferências dessa turma, incluindo objetivo, materiais simples e passo a passo."',
    ]);
  });

  it("sem nome, tira a linha da estagiária e o nome do prompt", () => {
    const texto = textoParaIA({ turma: t8, atividades: [mito], autora: "  " });
    expect(texto).not.toContain("Estagiária:");
    expect(texto).toContain('"Olá! Sou estagiária de Psicologia Escolar.');
  });

  it("conta atividades sem tag e não mostra linha de descrição vazia", () => {
    const solta: Atividade = { ...mito, id: "3", tags: [], observacao: "   " };
    const texto = textoParaIA({ turma: t8, atividades: [solta] });
    expect(texto).toContain("- Sem tag: 1");
    expect(texto).toContain("| Tags: (sem tag)");
    expect(texto).not.toContain("Descrição:");
  });

  it("turma vazia ainda gera um texto válido", () => {
    const texto = textoParaIA({ turma: t8, atividades: [] });
    expect(texto).toContain("Total de atividades registradas: 0");
    expect(texto).toContain("- (nenhuma atividade)");
    expect(texto).toContain("(Nenhuma atividade registrada nesta turma ainda.)");
  });
});

describe("ordenarPorReacao", () => {
  it("vai de Adoraram a Não curtiram e, no empate, da mais recente para a mais antiga", () => {
    const lista = [
      { id: "a", receptividade: "neutro", data: "2026-05-01" },
      { id: "b", receptividade: "adoraram", data: "2026-01-01" },
      { id: "c", receptividade: "nao_curtiram", data: "2026-06-01" },
      { id: "d", receptividade: "adoraram", data: "2026-03-01" },
      { id: "e", receptividade: "gostaram", data: "2026-02-01" },
    ] as const;
    expect(ordenarPorReacao([...lista]).map((x) => x.id)).toEqual(["d", "b", "e", "a", "c"]);
  });

  it("não altera a lista original", () => {
    const lista = [leitura, mito];
    ordenarPorReacao(lista);
    expect(lista.map((a) => a.id)).toEqual(["2", "1"]);
  });
});

describe("rotuloDaTurma", () => {
  it("acrescenta a etapa curta", () => {
    expect(rotuloDaTurma("8º Ano")).toBe("8º Ano (Fund. II)");
    expect(rotuloDaTurma("3º ano")).toBe("3º ano (Fund. I)");
  });

  it("não repete a etapa quando o nome já diz", () => {
    expect(rotuloDaTurma("1º Médio")).toBe("1º Médio");
    expect(rotuloDaTurma("6º ano Fund II")).toBe("6º ano Fund II");
  });

  it("turma sem etapa reconhecível fica como está", () => {
    expect(rotuloDaTurma("Turma B")).toBe("Turma B");
  });
});
