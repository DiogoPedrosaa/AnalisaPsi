import { describe, expect, it } from "vitest";
import { avisoTamanho, MAX_OBSERVACAO, observacaoLonga } from "@/lib/observacao";

describe("observacaoLonga", () => {
  it("textos curtos aparecem inteiros", () => {
    expect(observacaoLonga("Turma participou bem.")).toBe(false);
    expect(observacaoLonga("")).toBe(false);
  });

  it("recolhe textos com mais de 280 caracteres", () => {
    expect(observacaoLonga("a".repeat(280))).toBe(false);
    expect(observacaoLonga("a".repeat(281))).toBe(true);
  });

  it("recolhe textos curtos com muitas linhas", () => {
    expect(observacaoLonga("1\n2\n3\n4")).toBe(false);
    expect(observacaoLonga("1\n2\n3\n4\n5")).toBe(true);
  });

  it("ignora espaços e quebras nas pontas", () => {
    expect(observacaoLonga(`\n\n\n\nCurto\n\n\n\n`)).toBe(false);
    expect(observacaoLonga(`   ${"a".repeat(280)}   `)).toBe(false);
  });
});

describe("avisoTamanho", () => {
  it("fica quieto longe do limite", () => {
    expect(avisoTamanho(0)).toBeNull();
    expect(avisoTamanho(5_800)).toBeNull();
    expect(avisoTamanho(MAX_OBSERVACAO * 0.9 - 1)).toBeNull();
  });

  it("avisa a partir de 90% do limite, com milhar em pt-BR", () => {
    expect(avisoTamanho(18_000)).toBe("18.000 de 20.000 caracteres");
    expect(avisoTamanho(MAX_OBSERVACAO)).toBe("20.000 de 20.000 caracteres");
  });

  it("aceita outro limite", () => {
    expect(avisoTamanho(95, 100)).toBe("95 de 100 caracteres");
  });
});

describe("MAX_OBSERVACAO", () => {
  it("cabe um relato longo de verdade (planejamento + relato da aplicação)", () => {
    expect(MAX_OBSERVACAO).toBeGreaterThanOrEqual(10_000);
  });
});
