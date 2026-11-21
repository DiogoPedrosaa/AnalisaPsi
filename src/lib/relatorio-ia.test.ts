import { describe, expect, it } from "vitest";
import { ordenarPorReacao, textoParaIA } from "./relatorio-ia";
import type { Atividade } from "./types";

const t8 = { id: "t8", nome: "8º Ano" };

const leitura: Atividade = {
  id: "2",
  titulo: "Leitura de Texto Reflexivo sobre Empatia",
  data: "2026-04-14",
  categoria: "oficina_debate",
  tema: "Empatia e convivência escolar",
  receptividade: "nao_curtiram",
  descricao:
    "Leitura coletiva de uma crônica curta sobre conflitos na adolescência seguida de perguntas dirigidas em folha impressa. Materiais: cópias impressas do texto e canetas.",
  observacoes:
    "A turma achou o formato muito parecido com aula tradicional de português e ficou dispersa na metade da leitura. Aprendizado importante: no 8º ano, textos longos sem recursos lúdicos ou visuais geram resistência.",
  turma: t8,
};
const mito: Atividade = {
  id: "1",
  titulo: "Mito ou Verdade: Amizades e Redes Sociais",
  data: "2026-03-25",
  categoria: "roda_conversa",
  tema: "Amizades, cyberbullying, validação online e limites",
  receptividade: "adoraram",
  descricao:
    'Cada aluno recebeu duas plaquinhas ("MITO" em rosa e "VERDADE" em azul). Foram lidas afirmações como "Se meu amigo não curtiu minha foto, ele está bravo comigo" e "Comparar minha vida com o Instagram afeta minha autoestima". Após levantarem as placas, abrimos debate mediado. Materiais: plaquinhas plastificadas e caixa anônima para dúvidas.',
  observacoes:
    "Engajamento altíssimo! Como não precisavam se expor inicialmente — apenas levantar a placa — todos participaram sem medo de julgamento. A caixa de perguntas anônimas rendeu temas ótimos sobre pressão estética e exclusão em grupos de WhatsApp.",
  turma: t8,
};

/** O texto do exemplo enviado (relatório do 8º Ano no Diário de Estágio). */
const ESPERADO = `====================================================
DIÁRIO DE ESTÁGIO — PSICOLOGIA ESCOLAR
Estagiária: Thayanne Bernardi
Relatório da Turma: 8º Ano (Fund. II)
Total de atividades registradas: 2
====================================================

RESUMO POR CATEGORIA:
- Roda de Conversa: 1
- Atividade Manual / Artística: 0
- Dinâmica / Jogo Socioemocional: 0
- Oficina / Debate: 1
- Outro: 0

RESUMO POR ENGAJAMENTO:
- Adoraram (Alto Engajamento): 1
- Gostaram (Bom Engajamento): 0
- Neutro (Regular): 0
- Não curtiram (Baixo Engajamento): 1

ATIVIDADES APLICADAS (ORDENADAS DO MAIOR PARA O MENOR ENGAJAMENTO):

[1] MITO OU VERDADE: AMIZADES E REDES SOCIAIS
Turma: 8º Ano (Fund. II) | Data: 25/03/2026 | Categoria: Roda de Conversa
Reação dos Alunos: Adoraram / Alto Engajamento
Tema / Objetivo Socioemocional: Amizades, cyberbullying, validação online e limites
Descrição & Materiais: Cada aluno recebeu duas plaquinhas ("MITO" em rosa e "VERDADE" em azul). Foram lidas afirmações como "Se meu amigo não curtiu minha foto, ele está bravo comigo" e "Comparar minha vida com o Instagram afeta minha autoestima". Após levantarem as placas, abrimos debate mediado. Materiais: plaquinhas plastificadas e caixa anônima para dúvidas.
Observações da Estagiária: Engajamento altíssimo! Como não precisavam se expor inicialmente — apenas levantar a placa — todos participaram sem medo de julgamento. A caixa de perguntas anônimas rendeu temas ótimos sobre pressão estética e exclusão em grupos de WhatsApp.

[2] LEITURA DE TEXTO REFLEXIVO SOBRE EMPATIA
Turma: 8º Ano (Fund. II) | Data: 14/04/2026 | Categoria: Oficina / Debate
Reação dos Alunos: Não curtiram / Baixo Engajamento
Tema / Objetivo Socioemocional: Empatia e convivência escolar
Descrição & Materiais: Leitura coletiva de uma crônica curta sobre conflitos na adolescência seguida de perguntas dirigidas em folha impressa. Materiais: cópias impressas do texto e canetas.
Observações da Estagiária: A turma achou o formato muito parecido com aula tradicional de português e ficou dispersa na metade da leitura. Aprendizado importante: no 8º ano, textos longos sem recursos lúdicos ou visuais geram resistência.

====================================================
PROMPT SUGERIDO PARA ANÁLISE POR IA (ChatGPT / Gemini / Claude):
"Olá! Sou Thayanne Bernardi, estagiária de Psicologia Escolar. Acima está o relatório compilado das atividades que apliquei com a turma 8º Ano (Fund. II), ordenadas pelo nível de engajamento dos alunos e contendo minhas observações de campo.
Com base nesses dados, por favor:
1. Identifique padrões do que os alunos MAIS gostam (formatos, temas, dinâmicas e materiais com alto engajamento) e o que eles MENOS gostam ou gera resistência;
2. Analise as observações qualitativas para apontar quais abordagens funcionam melhor para o perfil dessa faixa etária;
3. Sugira 5 novas ideias criativas de atividades, rodas de conversa ou oficinas socioemocionais alinhadas às preferências dessa turma, incluindo objetivo, materiais simples e passo a passo."`;

describe("textoParaIA", () => {
  it("gera exatamente o relatório do exemplo, do maior para o menor engajamento", () => {
    // A lista chega da mais recente para a mais antiga; o relatório reordena pela reação.
    const texto = textoParaIA({ turma: t8, atividades: [leitura, mito], autora: "Thayanne Bernardi" });
    expect(texto.split("\n")).toEqual(ESPERADO.split("\n"));
  });

  it("sem nome, tira a linha da estagiária e o nome do prompt", () => {
    const texto = textoParaIA({ turma: t8, atividades: [mito], autora: "  " });
    expect(texto).not.toMatch(/^Estagiária:/m);
    expect(texto).toContain('"Olá! Sou estagiária de Psicologia Escolar.');
  });

  it("atividade antiga, sem tema, descrição ou observações, não gera linhas vazias", () => {
    const antiga: Atividade = { ...mito, id: "3", tema: "", descricao: "   ", observacoes: null };
    const texto = textoParaIA({ turma: t8, atividades: [antiga] });
    expect(texto).not.toContain("Tema / Objetivo Socioemocional:");
    expect(texto).not.toContain("Descrição & Materiais:");
    expect(texto).not.toContain("Observações da Estagiária:");
  });

  it("turma vazia ainda gera um texto válido, com as 5 categorias zeradas", () => {
    const texto = textoParaIA({ turma: t8, atividades: [] });
    expect(texto).toContain("Total de atividades registradas: 0");
    expect(texto).toContain("- Roda de Conversa: 0\n- Atividade Manual / Artística: 0");
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
