import { describe, expect, it } from "vitest";
import {
  aderenciaPasta,
  detalhePasta,
  filtrarAtividades,
  hrefDaPasta,
  pastaMaisRecente,
  resumirPasta,
} from "@/lib/pastas";
import type { Atividade, Categoria, Receptividade } from "@/lib/types";

const turma = { id: "t1", nome: "6º ano" };

function atv(id: string, data: string, receptividade: Receptividade, categoria: Categoria = "outro"): Atividade {
  return { id, titulo: id, data, categoria, tema: "", receptividade, descricao: null, observacoes: null, turma };
}

describe("resumirPasta", () => {
  it("pasta vazia não tem aderência nem data", () => {
    expect(resumirPasta([])).toEqual({ total: 0, adoraram: 0, gostaram: 0, neutro: 0, nao_curtiram: 0, aderencia: null, ultimaData: null });
  });

  it("conta por reação e calcula a aderência (adoraram 1, gostaram ⅔, neutro ⅓, não curtiram 0)", () => {
    const r = resumirPasta([
      atv("a", "2026-11-10", "adoraram"),
      atv("b", "2026-11-11", "adoraram"),
      atv("c", "2026-11-12", "gostaram"),
      atv("d", "2026-11-13", "neutro"),
      atv("e", "2026-11-14", "nao_curtiram"),
      atv("f", "2026-11-15", "nao_curtiram"),
    ]);
    expect(r).toMatchObject({ total: 6, adoraram: 2, gostaram: 1, neutro: 1, nao_curtiram: 2 });
    expect(r.aderencia).toBeCloseTo(50); // (2 + ⅔ + ⅓) / 6
  });

  it("pega a data mais recente mesmo fora de ordem", () => {
    const r = resumirPasta([atv("a", "2026-11-03", "adoraram"), atv("b", "2026-11-16", "nao_curtiram"), atv("c", "2026-10-30", "adoraram")]);
    expect(r.ultimaData).toBe("2026-11-16");
  });

  it("só 'não curtiram' dá aderência zero, não null", () => {
    expect(resumirPasta([atv("a", "2026-11-03", "nao_curtiram")]).aderencia).toBe(0);
  });
});

describe("detalhePasta", () => {
  const hoje = "2026-11-18";

  it("pasta vazia", () => {
    expect(detalhePasta(resumirPasta([]), hoje)).toBe("Pasta vazia");
  });

  it("mostra quantidade e quando foi a última", () => {
    const r = resumirPasta([atv("a", "2026-11-15", "adoraram"), atv("b", "2026-11-17", "adoraram")]);
    expect(detalhePasta(r, hoje)).toBe("2 atividades · última ontem");
  });

  it("usa o singular", () => {
    expect(detalhePasta(resumirPasta([atv("a", hoje, "adoraram")]), hoje)).toBe("1 atividade · última hoje");
  });
});

describe("aderenciaPasta", () => {
  it("sem atividades não mostra nada", () => {
    expect(aderenciaPasta(resumirPasta([]))).toBeNull();
  });

  it("com menos de 3 atividades avisa que são poucos dados", () => {
    expect(aderenciaPasta(resumirPasta([atv("a", "2026-11-01", "adoraram"), atv("b", "2026-11-02", "adoraram")]))).toBe("poucos dados");
  });

  it("com amostra suficiente mostra a porcentagem arredondada", () => {
    const r = resumirPasta([atv("a", "2026-11-01", "adoraram"), atv("b", "2026-11-02", "gostaram"), atv("c", "2026-11-03", "neutro")]);
    expect(aderenciaPasta(r)).toBe("67% de aderência"); // (1 + ⅔ + ⅓) / 3 = 66,7%
  });
});

describe("filtrarAtividades", () => {
  const lista = [
    atv("a", "2026-11-01", "adoraram", "roda_conversa"),
    atv("b", "2026-11-02", "nao_curtiram", "roda_conversa"),
    atv("c", "2026-11-03", "adoraram", "dinamica_jogo"),
    atv("d", "2026-11-04", "neutro"),
  ];
  const ids = (as: Atividade[]) => as.map((a) => a.id);

  it("sem filtro devolve tudo, na mesma ordem", () => {
    expect(ids(filtrarAtividades(lista, {}))).toEqual(["a", "b", "c", "d"]);
  });

  it("filtra por categoria", () => {
    expect(ids(filtrarAtividades(lista, { categoria: "roda_conversa" }))).toEqual(["a", "b"]);
    expect(ids(filtrarAtividades(lista, { categoria: "oficina_debate" }))).toEqual([]);
  });

  it("filtra por reação", () => {
    expect(ids(filtrarAtividades(lista, { receptividade: "adoraram" }))).toEqual(["a", "c"]);
  });

  it("combina categoria e reação", () => {
    expect(ids(filtrarAtividades(lista, { categoria: "roda_conversa", receptividade: "nao_curtiram" }))).toEqual(["b"]);
    expect(ids(filtrarAtividades(lista, { categoria: "dinamica_jogo", receptividade: "nao_curtiram" }))).toEqual([]);
  });
});

describe("pastaMaisRecente", () => {
  const pasta = (id: string, ultimaData: string | null) => ({ id, resumo: { ultimaData } });

  it("abre a pasta com a atividade mais recente", () => {
    const p = pastaMaisRecente([pasta("6", "2026-11-10"), pasta("7", null), pasta("8", "2026-11-18"), pasta("9", "2026-11-01")]);
    expect(p?.id).toBe("8");
  });

  it("sem nenhuma atividade, abre a primeira", () => {
    expect(pastaMaisRecente([pasta("6", null), pasta("7", null)])?.id).toBe("6");
  });

  it("em empate de data, fica com a que vem antes na ordem", () => {
    expect(pastaMaisRecente([pasta("6", "2026-11-18"), pasta("7", "2026-11-18")])?.id).toBe("6");
  });

  it("lista vazia devolve null", () => {
    expect(pastaMaisRecente([])).toBeNull();
  });
});

describe("hrefDaPasta", () => {
  it("só a turma", () => {
    expect(hrefDaPasta("t1")).toBe("/?turma=t1");
  });

  it("com categoria e reação", () => {
    expect(hrefDaPasta("t1", { categoria: "manual_artistica", receptividade: "adoraram" })).toBe(
      "/?turma=t1&categoria=manual_artistica&receptividade=adoraram",
    );
  });

  it("ignora filtros vazios", () => {
    expect(hrefDaPasta("t1", { categoria: undefined, receptividade: "nao_curtiram" })).toBe("/?turma=t1&receptividade=nao_curtiram");
  });
});
