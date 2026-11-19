import { describe, expect, it } from "vitest";
import { detalheModulo, itemAtivo, MODULOS, nomeDeExibicao, type ResumoInicio, selosDoInicio } from "@/lib/modulos";

describe("itemAtivo", () => {
  it("Início só fica ativo na raiz", () => {
    expect(itemAtivo("/", "/")).toBe(true);
    expect(itemAtivo("/historico", "/")).toBe(false);
  });

  it("ativa o módulo na própria rota e nas sub-rotas", () => {
    expect(itemAtivo("/historico", "/historico")).toBe(true);
    expect(itemAtivo("/dashboard/algo", "/dashboard")).toBe(true);
  });

  it("não confunde rotas com o mesmo prefixo", () => {
    expect(itemAtivo("/historico-antigo", "/historico")).toBe(false);
  });

  it("a edição de atividade conta como Registrar", () => {
    expect(itemAtivo("/atividades/123", "/registrar")).toBe(true);
    expect(itemAtivo("/atividades/123", "/historico")).toBe(false);
  });

  it("cada rota ativa exatamente um módulo", () => {
    for (const rota of ["/registrar", "/historico", "/dashboard", "/turmas-e-tags", "/atividades/abc"]) {
      expect(MODULOS.filter((m) => itemAtivo(rota, m.href))).toHaveLength(1);
    }
  });
});

describe("nomeDeExibicao", () => {
  it("prefere o primeiro nome dos metadados", () => {
    expect(nomeDeExibicao("x@y.com", { full_name: "  Maria Clara Souza " })).toBe("Maria");
    expect(nomeDeExibicao("x@y.com", { nome: "Bia", name: "Beatriz" })).toBe("Bia");
  });

  it("ignora metadados vazios ou que não são texto", () => {
    expect(nomeDeExibicao("ana@y.com", { nome: "   ", name: 42 })).toBe("Ana");
  });

  it("usa a primeira parte do e-mail, capitalizada", () => {
    expect(nomeDeExibicao("JOAO.silva@escola.com")).toBe("Joao");
    expect(nomeDeExibicao("prof_lu+turmas@x.com")).toBe("Prof");
    expect(nomeDeExibicao("123ana@x.com")).toBe("Ana");
  });

  it("devolve vazio quando não há nada aproveitável", () => {
    expect(nomeDeExibicao(undefined)).toBe("");
    expect(nomeDeExibicao(null, null)).toBe("");
    expect(nomeDeExibicao("1234@x.com")).toBe("");
  });
});

describe("detalheModulo", () => {
  const hoje = "2026-11-17";
  const vazio: ResumoInicio = { atividades: 0, turmas: 0, tags: 0, aderencia: null, ultimaData: null };
  const cheio: ResumoInicio = { atividades: 12, turmas: 3, tags: 7, aderencia: 62.5, ultimaData: "2026-11-16" };

  it("sem dados, convida a começar", () => {
    expect(detalheModulo("/registrar", vazio, hoje)).toBe("Nenhum registro ainda");
    expect(detalheModulo("/historico", vazio, hoje)).toBe("0 atividades registradas");
    expect(detalheModulo("/dashboard", vazio, hoje)).toBe("Aparece após os primeiros registros");
    expect(detalheModulo("/turmas-e-tags", vazio, hoje)).toBe("0 turmas · 0 tags");
  });

  it("com dados, mostra os números", () => {
    expect(detalheModulo("/registrar", cheio, hoje)).toBe("Último registro ontem");
    expect(detalheModulo("/historico", cheio, hoje)).toBe("12 atividades registradas");
    expect(detalheModulo("/dashboard", cheio, hoje)).toBe("Aderência geral de 63%");
    expect(detalheModulo("/turmas-e-tags", cheio, hoje)).toBe("3 turmas · 7 tags");
  });

  it("usa o singular quando é um só", () => {
    const um = { ...cheio, atividades: 1, turmas: 1, tags: 1 };
    expect(detalheModulo("/historico", um, hoje)).toBe("1 atividade registrada");
    expect(detalheModulo("/turmas-e-tags", um, hoje)).toBe("1 turma · 1 tag");
  });

  it("aderência zero ainda é número, não 'sem dados'", () => {
    expect(detalheModulo("/dashboard", { ...cheio, aderencia: 0 }, hoje)).toBe("Aderência geral de 0%");
  });

  it("todo módulo tem uma linha de detalhe", () => {
    for (const m of MODULOS) expect(detalheModulo(m.href, cheio, hoje)).not.toBe("");
  });
});

describe("selosDoInicio", () => {
  const base: ResumoInicio = { atividades: 12, turmas: 3, tags: 5, aderencia: 78.4, ultimaData: "2026-11-18" };

  it("mostra atividades, turmas e aderência arredondada, nessa ordem", () => {
    expect(selosDoInicio(base)).toEqual([
      { valor: "12", rotulo: "atividades" },
      { valor: "3", rotulo: "turmas" },
      { valor: "78%", rotulo: "aderência" },
    ]);
  });

  it("usa o singular quando há só uma", () => {
    const [atividades, turmas] = selosDoInicio({ ...base, atividades: 1, turmas: 1 });
    expect(atividades.rotulo).toBe("atividade");
    expect(turmas.rotulo).toBe("turma");
  });

  it("sem atividades, a aderência vira travessão em vez de 0%", () => {
    const selos = selosDoInicio({ atividades: 0, turmas: 0, tags: 0, aderencia: null, ultimaData: null });
    expect(selos.map((s) => s.valor)).toEqual(["0", "0", "—"]);
    expect(selos[0].rotulo).toBe("atividades");
  });

  it("arredonda 99,5% para 100%", () => {
    expect(selosDoInicio({ ...base, aderencia: 99.5 })[2].valor).toBe("100%");
  });
});
