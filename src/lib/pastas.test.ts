import { describe, expect, it } from "vitest";
import { aderenciaPasta, detalhePasta, filtrarAtividades, resumirPasta, tagsDasAtividades } from "@/lib/pastas";
import type { Atividade, Receptividade, Tag } from "@/lib/types";

const turma = { id: "t1", nome: "6º ano" };
const arte: Tag = { id: "arte", nome: "Arte", cor: 2 };
const roda: Tag = { id: "roda", nome: "Roda de conversa", cor: 7 };
const jogos: Tag = { id: "jogos", nome: "Jogos", cor: 6 };

function atv(id: string, data: string, receptividade: Receptividade, tags: Tag[] = []): Atividade {
  return { id, titulo: id, data, receptividade, observacao: null, turma, tags };
}

describe("resumirPasta", () => {
  it("pasta vazia não tem aderência nem data", () => {
    expect(resumirPasta([])).toEqual({ total: 0, boa: 0, neutra: 0, ruim: 0, aderencia: null, ultimaData: null });
  });

  it("conta por receptividade e calcula a aderência (boa 1, neutra ½, ruim 0)", () => {
    const r = resumirPasta([
      atv("a", "2026-11-10", "boa"),
      atv("b", "2026-11-11", "boa"),
      atv("c", "2026-11-12", "neutra"),
      atv("d", "2026-11-13", "ruim"),
    ]);
    expect(r).toMatchObject({ total: 4, boa: 2, neutra: 1, ruim: 1, aderencia: 62.5 });
  });

  it("pega a data mais recente mesmo fora de ordem", () => {
    const r = resumirPasta([atv("a", "2026-11-03", "boa"), atv("b", "2026-11-16", "ruim"), atv("c", "2026-10-30", "boa")]);
    expect(r.ultimaData).toBe("2026-11-16");
  });

  it("só ruins dá aderência zero, não null", () => {
    expect(resumirPasta([atv("a", "2026-11-03", "ruim")]).aderencia).toBe(0);
  });
});

describe("detalhePasta", () => {
  const hoje = "2026-11-18";

  it("pasta vazia", () => {
    expect(detalhePasta(resumirPasta([]), hoje)).toBe("Pasta vazia");
  });

  it("mostra quantidade e quando foi a última", () => {
    const r = resumirPasta([atv("a", "2026-11-15", "boa"), atv("b", "2026-11-17", "boa")]);
    expect(detalhePasta(r, hoje)).toBe("2 atividades · última ontem");
  });

  it("usa o singular", () => {
    expect(detalhePasta(resumirPasta([atv("a", hoje, "boa")]), hoje)).toBe("1 atividade · última hoje");
  });
});

describe("aderenciaPasta", () => {
  it("sem atividades não mostra nada", () => {
    expect(aderenciaPasta(resumirPasta([]))).toBeNull();
  });

  it("com menos de 3 atividades avisa que são poucos dados", () => {
    expect(aderenciaPasta(resumirPasta([atv("a", "2026-11-01", "boa"), atv("b", "2026-11-02", "boa")]))).toBe("poucos dados");
  });

  it("com amostra suficiente mostra a porcentagem arredondada", () => {
    const r = resumirPasta([atv("a", "2026-11-01", "boa"), atv("b", "2026-11-02", "neutra"), atv("c", "2026-11-03", "neutra")]);
    expect(aderenciaPasta(r)).toBe("67% de aderência");
  });
});

describe("tagsDasAtividades", () => {
  it("lista só as tags usadas, sem repetir, com a contagem, em ordem alfabética", () => {
    const tags = tagsDasAtividades([
      atv("a", "2026-11-01", "boa", [roda, arte]),
      atv("b", "2026-11-02", "boa", [roda]),
      atv("c", "2026-11-03", "ruim", [jogos]),
      atv("d", "2026-11-04", "ruim"),
    ]);
    expect(tags.map((t) => [t.nome, t.total])).toEqual([
      ["Arte", 1],
      ["Jogos", 1],
      ["Roda de conversa", 2],
    ]);
    expect(tags[0].cor).toBe(2);
  });

  it("sem tags devolve lista vazia", () => {
    expect(tagsDasAtividades([atv("a", "2026-11-01", "boa")])).toEqual([]);
  });
});

describe("filtrarAtividades", () => {
  const lista = [
    atv("a", "2026-11-01", "boa", [roda, arte]),
    atv("b", "2026-11-02", "ruim", [roda]),
    atv("c", "2026-11-03", "boa", [jogos]),
    atv("d", "2026-11-04", "neutra"),
  ];
  const ids = (as: Atividade[]) => as.map((a) => a.id);

  it("sem filtro devolve tudo, na mesma ordem", () => {
    expect(ids(filtrarAtividades(lista, {}))).toEqual(["a", "b", "c", "d"]);
  });

  it("filtra por tag (atividade com várias tags entra se tiver a escolhida)", () => {
    expect(ids(filtrarAtividades(lista, { tagId: "roda" }))).toEqual(["a", "b"]);
  });

  it("filtra por receptividade", () => {
    expect(ids(filtrarAtividades(lista, { receptividade: "boa" }))).toEqual(["a", "c"]);
  });

  it("combina tag e receptividade", () => {
    expect(ids(filtrarAtividades(lista, { tagId: "roda", receptividade: "ruim" }))).toEqual(["b"]);
    expect(ids(filtrarAtividades(lista, { tagId: "jogos", receptividade: "ruim" }))).toEqual([]);
  });
});
