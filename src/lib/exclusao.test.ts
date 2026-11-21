import { describe, expect, it } from "vitest";
import { avisoExcluirAtividade, avisoExcluirTurma } from "@/lib/exclusao";

describe("avisoExcluirAtividade", () => {
  it("cita a atividade e a turma e avisa que é irreversível", () => {
    expect(avisoExcluirAtividade("Colagem", "6º Ano")).toEqual({
      titulo: "Apagar atividade?",
      descricao: "“Colagem” (6º Ano) será apagada. Isso não pode ser desfeito.",
    });
  });
});

describe("avisoExcluirTurma", () => {
  it("turma vazia: aviso simples", () => {
    expect(avisoExcluirTurma("3º B", 0).descricao).toBe("A turma “3º B” será apagada. Isso não pode ser desfeito.");
  });

  it("avisa que as atividades da turma vão junto (singular e plural)", () => {
    expect(avisoExcluirTurma("3º B", 1).descricao).toBe(
      "A turma “3º B” e a atividade registrada nela serão apagadas. Isso não pode ser desfeito.",
    );
    expect(avisoExcluirTurma("3º B", 5).descricao).toBe(
      "A turma “3º B” e as 5 atividades registradas nela serão apagadas. Isso não pode ser desfeito.",
    );
  });
});
