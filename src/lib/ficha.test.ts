import { describe, expect, it } from "vitest";
import { MAX_TEMA, MAX_TITULO, validarFicha } from "./ficha";
import { MAX_OBSERVACAO } from "./observacao";
import type { AtividadeInput } from "./types";

const ok: AtividadeInput = {
  turmaId: "t8",
  data: "2026-11-21",
  titulo: "Mito ou Verdade",
  categoria: "roda_conversa",
  tema: "Amizades e redes sociais",
  receptividade: "adoraram",
  descricao: "Plaquinhas de mito/verdade",
  observacoes: "",
};

describe("validarFicha", () => {
  it("ficha completa passa (observações são opcionais)", () => {
    expect(validarFicha(ok)).toBeNull();
    expect(validarFicha({ ...ok, observacoes: "Funcionou muito bem" })).toBeNull();
  });

  it.each([
    ["turmaId", "", "Escolha a pasta da turma."],
    ["data", "", "Escolha a data de aplicação."],
    ["data", "21/11/2026", "Escolha a data de aplicação."],
    ["titulo", "   ", "Dê um título para a atividade."],
    ["categoria", "tag", "Escolha a categoria da prática."],
    ["tema", " ", "Preencha o tema / objetivo socioemocional."],
    ["receptividade", "boa", "Marque a reação e o engajamento dos alunos."],
    ["descricao", "", "Descreva brevemente a atividade e os materiais utilizados."],
  ])("campo obrigatório %s = %j → %s", (campo, valor, mensagem) => {
    expect(validarFicha({ ...ok, [campo]: valor } as AtividadeInput)).toBe(mensagem);
  });

  it("respeita os limites de tamanho", () => {
    expect(validarFicha({ ...ok, titulo: "x".repeat(MAX_TITULO + 1) })).toBe(`O título passou de ${MAX_TITULO} caracteres.`);
    expect(validarFicha({ ...ok, tema: "x".repeat(MAX_TEMA + 1) })).toBe(`O tema passou de ${MAX_TEMA} caracteres.`);
    expect(validarFicha({ ...ok, descricao: "x".repeat(MAX_OBSERVACAO + 1) })).toMatch(/^A descrição passou de/);
    expect(validarFicha({ ...ok, observacoes: "x".repeat(MAX_OBSERVACAO + 1) })).toMatch(/^As observações passaram de/);
  });

  it("aponta o primeiro problema na ordem dos campos da tela", () => {
    expect(validarFicha({ ...ok, titulo: "", tema: "", descricao: "" })).toBe("Dê um título para a atividade.");
  });

  it("espaços em volta não contam para o limite", () => {
    expect(validarFicha({ ...ok, titulo: `  ${"x".repeat(MAX_TITULO)}  ` })).toBeNull();
  });
});
