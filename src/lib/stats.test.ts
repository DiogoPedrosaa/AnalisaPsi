import { describe, expect, it } from "vitest";
import { calcularEstatisticas, melhor, pior } from "./stats";
import type { Atividade, Receptividade } from "./types";

const t8 = { id: "t8", nome: "8º Ano" };
const t9 = { id: "t9", nome: "9º Ano" };
const roda = { id: "roda", nome: "Roda de conversa", cor: 1 };

let n = 0;
const atv = (receptividade: Receptividade, turma = t8, tags = [roda], data = "2026-11-18"): Atividade => ({
  id: String(++n),
  titulo: `Atividade ${n}`,
  data,
  receptividade,
  observacao: null,
  turma,
  tags,
});

describe("calcularEstatisticas", () => {
  it("conta as 4 reações no geral e calcula a aderência ponderada", () => {
    const { geral } = calcularEstatisticas([atv("adoraram"), atv("gostaram"), atv("neutro"), atv("nao_curtiram")]);
    expect(geral).toMatchObject({ total: 4, adoraram: 1, gostaram: 1, neutro: 1, nao_curtiram: 1 });
    expect(geral.aderencia).toBeCloseTo(50);
  });

  it("sem atividades, aderência 0", () => {
    expect(calcularEstatisticas([]).geral.aderencia).toBe(0);
  });

  it("ranqueia as turmas pela aderência e acha a melhor e a pior", () => {
    const { turmas } = calcularEstatisticas([
      atv("adoraram", t9),
      atv("adoraram", t9),
      atv("gostaram", t9),
      atv("neutro", t8),
      atv("nao_curtiram", t8),
      atv("gostaram", t8),
    ]);
    expect(turmas.map((t) => t.chave)).toEqual(["t9", "t8"]);
    expect(turmas[0].aderencia).toBeCloseTo(88.89, 1); // (1 + 1 + ⅔) / 3
    expect(turmas[1].aderencia).toBeCloseTo(33.33, 1); // (⅓ + 0 + ⅔) / 3
    expect(melhor(turmas)?.chave).toBe("t9");
    expect(pior(turmas)?.chave).toBe("t8");
  });

  it("'gostaram' conta mais que 'neutro' nas tags", () => {
    const arte = { id: "arte", nome: "Artística", cor: 5 };
    const { tags } = calcularEstatisticas([atv("gostaram", t8, [arte]), atv("neutro", t8, [roda])]);
    expect(tags.map((t) => t.chave)).toEqual(["arte", "roda"]);
  });
});
