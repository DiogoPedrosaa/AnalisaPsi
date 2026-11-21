import { describe, expect, it } from "vitest";
import { calcularEstatisticas, melhor, pior } from "./stats";
import type { Atividade, Categoria, Receptividade } from "./types";

const t8 = { id: "t8", nome: "8º Ano" };
const t9 = { id: "t9", nome: "9º Ano" };

let n = 0;
const atv = (receptividade: Receptividade, turma = t8, categoria: Categoria = "roda_conversa", data = "2026-11-18"): Atividade => ({
  id: String(++n),
  titulo: `Atividade ${n}`,
  data,
  categoria,
  tema: "",
  receptividade,
  descricao: null,
  observacoes: null,
  turma,
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

  it("ranqueia as categorias e sempre mostra as 5 (as vazias no fim)", () => {
    const { categorias } = calcularEstatisticas([atv("gostaram", t8, "manual_artistica"), atv("neutro", t8, "roda_conversa")]);
    expect(categorias).toHaveLength(5);
    expect(categorias.slice(0, 2).map((c) => c.chave)).toEqual(["manual_artistica", "roda_conversa"]);
    expect(categorias[0]).toMatchObject({ nome: "Atividade Manual / Artística", emoji: "🎨", total: 1 });
    expect(categorias.slice(2).every((c) => c.total === 0)).toBe(true);
  });

  it("categorias vazias não viram 'pior' categoria", () => {
    const { categorias } = calcularEstatisticas([atv("adoraram", t8, "roda_conversa"), atv("nao_curtiram", t8, "oficina_debate")]);
    expect(melhor(categorias)?.chave).toBe("roda_conversa");
    expect(pior(categorias)?.chave).toBe("oficina_debate");
  });
});
