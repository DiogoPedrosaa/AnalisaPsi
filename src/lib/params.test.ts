import { describe, expect, it } from "vitest";
import { caminhoDeVolta } from "@/lib/params";

describe("caminhoDeVolta", () => {
  it("aceita caminhos internos", () => {
    expect(caminhoDeVolta("/turmas/123")).toBe("/turmas/123");
    expect(caminhoDeVolta("/turmas/123?tag=abc")).toBe("/turmas/123?tag=abc");
    expect(caminhoDeVolta(["/historico", "/x"])).toBe("/historico");
  });

  it("sem valor, volta para o Histórico", () => {
    expect(caminhoDeVolta(undefined)).toBe("/historico");
    expect(caminhoDeVolta("   ")).toBe("/historico");
  });

  it("recusa endereços externos (evita redirecionamento aberto)", () => {
    expect(caminhoDeVolta("https://exemplo.com")).toBe("/historico");
    expect(caminhoDeVolta("//exemplo.com")).toBe("/historico");
    expect(caminhoDeVolta("/\\exemplo.com")).toBe("/historico");
    expect(caminhoDeVolta("turmas")).toBe("/historico");
  });

  it("aceita outro padrão", () => {
    expect(caminhoDeVolta(undefined, "/turmas")).toBe("/turmas");
  });
});
