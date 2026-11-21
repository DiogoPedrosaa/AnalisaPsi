import { describe, expect, it } from "vitest";
import {
  corDaPasta,
  etapaDaTurma,
  ordenarTurmas,
  rotuloDaTurma,
  rotuloEtapa,
  TOTAL_CORES_PASTA,
  turmaPreSelecionada,
} from "@/lib/turmas";

const nomes = (ts: { nome: string }[]) => ts.map((t) => t.nome);
const turmas = (...ns: string[]) => ns.map((nome, i) => ({ id: String(i), nome }));

describe("etapaDaTurma", () => {
  it("reconhece os anos do fundamental", () => {
    expect(etapaDaTurma("6º Ano")).toEqual({ etapa: "fundamental", serie: 6 });
    expect(etapaDaTurma("9° ano B")).toEqual({ etapa: "fundamental", serie: 9 });
    expect(etapaDaTurma("7 ano")).toEqual({ etapa: "fundamental", serie: 7 });
  });

  it("reconhece o médio escrito de vários jeitos", () => {
    expect(etapaDaTurma("1º Médio")).toEqual({ etapa: "medio", serie: 1 });
    expect(etapaDaTurma("2ª série do Ensino Medio")).toEqual({ etapa: "medio", serie: 2 });
    expect(etapaDaTurma("3º EM")).toEqual({ etapa: "medio", serie: 3 });
    expect(etapaDaTurma("1º ano (Ensino Médio)")).toEqual({ etapa: "medio", serie: 1 });
  });

  it("não confunde a palavra 'em' com Ensino Médio", () => {
    expect(etapaDaTurma("Turma em reforço")).toEqual({ etapa: null, serie: null });
  });

  it("nome sem série fica sem etapa (ou só com a etapa, se ela estiver escrita)", () => {
    expect(etapaDaTurma("Oficina de artes")).toEqual({ etapa: null, serie: null });
    expect(etapaDaTurma("Ensino Médio")).toEqual({ etapa: "medio", serie: null });
    expect(etapaDaTurma("Fundamental integral")).toEqual({ etapa: "fundamental", serie: null });
  });

  it("número fora das séries não vira série", () => {
    expect(etapaDaTurma("Sala 12")).toEqual({ etapa: null, serie: null });
    expect(etapaDaTurma("7º Médio")).toEqual({ etapa: "medio", serie: null });
  });
});

describe("ordenarTurmas", () => {
  it("põe o fundamental em ordem crescente e o médio depois (6 7 8 9 1 2 3)", () => {
    const embaralhadas = turmas("3º Médio", "1º Médio", "9º Ano", "6º Ano", "2º Médio", "8º Ano", "7º Ano");
    expect(nomes(ordenarTurmas(embaralhadas))).toEqual([
      "6º Ano",
      "7º Ano",
      "8º Ano",
      "9º Ano",
      "1º Médio",
      "2º Médio",
      "3º Médio",
    ]);
  });

  it("corrige a ordem alfabética antiga, que punha o médio na frente", () => {
    const alfabetica = turmas("1º Médio", "2º Médio", "3º Médio", "6º Ano", "7º Ano", "8º Ano", "9º Ano");
    expect(nomes(ordenarTurmas(alfabetica)).slice(0, 2)).toEqual(["6º Ano", "7º Ano"]);
  });

  it("desempata turmas da mesma série pelo nome", () => {
    expect(nomes(ordenarTurmas(turmas("6º ano B", "6º ano A", "1º EM B", "1º EM A")))).toEqual([
      "6º ano A",
      "6º ano B",
      "1º EM A",
      "1º EM B",
    ]);
  });

  it("deixa turmas sem série no fim, em ordem alfabética", () => {
    expect(nomes(ordenarTurmas(turmas("Reforço", "2º Médio", "Artes", "8º Ano")))).toEqual([
      "8º Ano",
      "2º Médio",
      "Artes",
      "Reforço",
    ]);
  });

  it("não altera a lista original e aceita lista vazia", () => {
    const lista = turmas("2º Médio", "6º Ano");
    ordenarTurmas(lista);
    expect(nomes(lista)).toEqual(["2º Médio", "6º Ano"]);
    expect(ordenarTurmas([])).toEqual([]);
  });

  it("mantém os outros campos de cada turma", () => {
    const [primeira] = ordenarTurmas([
      { id: "b", nome: "1º Médio", total: 3 },
      { id: "a", nome: "6º Ano", total: 5 },
    ]);
    expect(primeira).toEqual({ id: "a", nome: "6º Ano", total: 5 });
  });
});

describe("rotuloEtapa", () => {
  it("curto, para a aba da pasta", () => {
    expect(rotuloEtapa("6º Ano")).toBe("Fund. II");
    expect(rotuloEtapa("3º ano")).toBe("Fund. I");
    expect(rotuloEtapa("2º Médio")).toBe("Médio");
    expect(rotuloEtapa("Fundamental")).toBe("Fund.");
  });

  it("por extenso, para o topo do caderno", () => {
    expect(rotuloEtapa("9º Ano", true)).toBe("Ensino Fundamental II");
    expect(rotuloEtapa("1º EM", true)).toBe("Ensino Médio");
  });

  it("null quando não dá para saber a etapa", () => {
    expect(rotuloEtapa("Artes")).toBeNull();
    expect(rotuloEtapa("Artes", true)).toBeNull();
  });
});

describe("corDaPasta", () => {
  it("dá uma cor diferente para cada uma das 7 turmas", () => {
    const cores = Array.from({ length: TOTAL_CORES_PASTA }, (_, i) => corDaPasta(i));
    expect(cores).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("repete as cores a partir da 8ª pasta", () => {
    expect(corDaPasta(7)).toBe(1);
    expect(corDaPasta(15)).toBe(2);
  });

  it("índices estranhos não quebram", () => {
    expect(corDaPasta(-3)).toBe(1);
    expect(corDaPasta(2.7)).toBe(3);
  });
});

describe("turmaPreSelecionada", () => {
  const varias = [{ id: "a" }, { id: "b" }];

  it("marca a turma pedida no endereço", () => {
    expect(turmaPreSelecionada(varias, "b")).toBe("b");
  });

  it("ignora turma pedida que não existe", () => {
    expect(turmaPreSelecionada(varias, "zzz")).toBe("");
  });

  it("sem pedido, marca a única turma (se só houver uma)", () => {
    expect(turmaPreSelecionada([{ id: "a" }])).toBe("a");
    expect(turmaPreSelecionada([{ id: "a" }], "zzz")).toBe("a");
    expect(turmaPreSelecionada(varias)).toBe("");
  });

  it("sem turmas, nenhuma", () => {
    expect(turmaPreSelecionada([], "a")).toBe("");
  });
});

describe("rotuloDaTurma", () => {
  it("acrescenta a etapa curta", () => {
    expect(rotuloDaTurma("8º Ano")).toBe("8º Ano (Fund. II)");
    expect(rotuloDaTurma("3º ano")).toBe("3º ano (Fund. I)");
  });

  it("não repete a etapa quando o nome já diz", () => {
    expect(rotuloDaTurma("1º Médio")).toBe("1º Médio");
    expect(rotuloDaTurma("6º ano Fund II")).toBe("6º ano Fund II");
  });

  it("turma sem etapa reconhecível fica como está", () => {
    expect(rotuloDaTurma("Turma B")).toBe("Turma B");
  });
});
