import { describe, expect, it } from "vitest";
import { calcularAderencia, contagemVazia, ehReceptividade, PESO_RECEPTIVIDADE, RECEPTIVIDADES } from "./receptividade";

describe("RECEPTIVIDADES", () => {
  it("tem as 4 reações, da melhor para a pior", () => {
    expect(RECEPTIVIDADES).toEqual(["adoraram", "gostaram", "neutro", "nao_curtiram"]);
  });

  it("os pesos descem em degraus iguais de 1 a 0", () => {
    expect(RECEPTIVIDADES.map((k) => PESO_RECEPTIVIDADE[k])).toEqual([1, 2 / 3, 1 / 3, 0]);
  });
});

describe("ehReceptividade", () => {
  it("aceita as 4 reações", () => {
    for (const k of RECEPTIVIDADES) expect(ehReceptividade(k)).toBe(true);
  });

  it("recusa os valores antigos (boa, neutra, ruim) e lixo", () => {
    for (const v of ["boa", "neutra", "ruim", "", "Adoraram", undefined, null, 1]) expect(ehReceptividade(v)).toBe(false);
  });
});

describe("calcularAderencia", () => {
  const com = (parcial: Partial<Record<(typeof RECEPTIVIDADES)[number], number>>) => {
    const c = { ...contagemVazia(), ...parcial };
    c.total = RECEPTIVIDADES.reduce((s, k) => s + c[k], 0);
    return c;
  };

  it("sem atividades é null", () => {
    expect(calcularAderencia(contagemVazia())).toBeNull();
  });

  it("cada reação sozinha vale 100, 67, 33 e 0", () => {
    expect(calcularAderencia(com({ adoraram: 3 }))).toBe(100);
    expect(calcularAderencia(com({ gostaram: 3 }))).toBeCloseTo(66.67, 1);
    expect(calcularAderencia(com({ neutro: 3 }))).toBeCloseTo(33.33, 1);
    expect(calcularAderencia(com({ nao_curtiram: 3 }))).toBe(0);
  });

  it("faz a média ponderada", () => {
    expect(calcularAderencia(com({ adoraram: 1, nao_curtiram: 1 }))).toBe(50);
    expect(calcularAderencia(com({ adoraram: 2, neutro: 1, nao_curtiram: 1 }))).toBeCloseTo(58.33, 1);
  });

  it("uma de cada dá 50%", () => {
    expect(calcularAderencia(com({ adoraram: 1, gostaram: 1, neutro: 1, nao_curtiram: 1 }))).toBeCloseTo(50);
  });
});
