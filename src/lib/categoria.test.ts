import { describe, expect, it } from "vitest";
import { CATEGORIA_PADRAO, CATEGORIAS, contarCategorias, ehCategoria, infoCategoria } from "./categoria";

describe("CATEGORIAS", () => {
  it("tem as 5 categorias da ficha, na ordem e com os textos do diário", () => {
    expect(CATEGORIAS.map((c) => `${c.emoji} ${c.label}`)).toEqual([
      "💬 Roda de Conversa",
      "🎨 Atividade Manual / Artística",
      "🎲 Dinâmica / Jogo Socioemocional",
      "🧠 Oficina / Debate",
      "📌 Outro",
    ]);
  });

  it("a padrão é Roda de Conversa (a primeira opção do select)", () => {
    expect(CATEGORIA_PADRAO).toBe(CATEGORIAS[0].id);
  });
});

describe("ehCategoria", () => {
  it("aceita as chaves válidas", () => {
    for (const c of CATEGORIAS) expect(ehCategoria(c.id)).toBe(true);
  });

  it("recusa rótulos, valores vazios e lixo", () => {
    for (const v of ["Roda de Conversa", "", "tag", undefined, null, 3]) expect(ehCategoria(v)).toBe(false);
  });
});

describe("infoCategoria", () => {
  it("devolve rótulo, versão curta e emoji", () => {
    expect(infoCategoria("dinamica_jogo")).toMatchObject({ label: "Dinâmica / Jogo Socioemocional", curto: "Dinâmica / Jogo", emoji: "🎲" });
  });

  it("valor desconhecido cai em Outro", () => {
    expect(infoCategoria("xyz").id).toBe("outro");
  });
});

describe("contarCategorias", () => {
  it("conta todas as 5 categorias, inclusive as zeradas, na ordem da ficha", () => {
    const contagem = contarCategorias([{ categoria: "oficina_debate" }, { categoria: "roda_conversa" }, { categoria: "oficina_debate" }]);
    expect(contagem.map((c) => [c.id, c.total])).toEqual([
      ["roda_conversa", 1],
      ["manual_artistica", 0],
      ["dinamica_jogo", 0],
      ["oficina_debate", 2],
      ["outro", 0],
    ]);
  });
});
