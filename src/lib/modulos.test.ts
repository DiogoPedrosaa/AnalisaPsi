import { describe, expect, it } from "vitest";
import { itemAtivo, MODULOS, nomeDeExibicao } from "@/lib/modulos";

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
    expect(itemAtivo("/turmas-e-tags", "/turmas")).toBe(false);
    expect(itemAtivo("/turmas/abc", "/turmas-e-tags")).toBe(false);
  });

  it("a tela de pastas é o próprio início", () => {
    expect(MODULOS[0]).toMatchObject({ href: "/", label: "Pastas" });
    expect(itemAtivo("/", MODULOS[0].href)).toBe(true);
    expect(itemAtivo("/registrar", MODULOS[0].href)).toBe(false);
  });

  it("o menu do dia a dia tem só Pastas e Registrar", () => {
    expect(MODULOS.filter((m) => m.grupo === "principal").map((m) => m.label)).toEqual(["Pastas", "Registrar"]);
  });

  it("a edição de atividade conta como Registrar", () => {
    expect(itemAtivo("/atividades/123", "/registrar")).toBe(true);
    expect(itemAtivo("/atividades/123", "/historico")).toBe(false);
  });

  it("cada rota ativa exatamente um módulo", () => {
    for (const rota of ["/", "/registrar", "/historico", "/dashboard", "/turmas-e-tags", "/atividades/abc"]) {
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
