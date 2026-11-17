import { describe, expect, it } from "vitest";
import { ajustarCookieSessao, lerPreferenciaLogin, querLembrar, salvarPreferenciaLogin } from "@/lib/sessao";

const AGORA = new Date("2026-11-17T12:00:00Z").getTime();
const PADRAO = { path: "/", sameSite: "lax" as const, maxAge: 400 * 24 * 60 * 60 };

describe("querLembrar", () => {
  it("só desliga com o valor '0'", () => {
    expect(querLembrar("0")).toBe(false);
    expect(querLembrar("1")).toBe(true);
    expect(querLembrar(undefined)).toBe(true);
  });
});

describe("ajustarCookieSessao", () => {
  it("lembrando, mantém a validade longa", () => {
    expect(ajustarCookieSessao(PADRAO, true, AGORA)).toEqual(PADRAO);
  });

  it("sem lembrar, vira cookie de sessão (tira maxAge e expires) e preserva o resto", () => {
    const comExpires = { ...PADRAO, expires: new Date(AGORA + 60_000) };
    expect(ajustarCookieSessao(comExpires, false, AGORA)).toEqual({ path: "/", sameSite: "lax" });
  });

  it("não mexe em cookie sendo apagado (maxAge 0), senão o Sair falharia", () => {
    const apagar = { ...PADRAO, maxAge: 0 };
    expect(ajustarCookieSessao(apagar, false, AGORA)).toEqual(apagar);
  });

  it("não mexe em cookie com expires no passado", () => {
    const vencido = { path: "/", expires: new Date(AGORA - 1) };
    expect(ajustarCookieSessao(vencido, false, AGORA)).toEqual(vencido);
  });

  it("não altera o objeto original", () => {
    const opcoes = { ...PADRAO };
    ajustarCookieSessao(opcoes, false, AGORA);
    expect(opcoes).toEqual(PADRAO);
  });
});

describe("preferência de login no navegador", () => {
  it("sem nada salvo, o padrão é lembrar sem e-mail", () => {
    expect(lerPreferenciaLogin(null)).toEqual({ lembrar: true, email: "" });
  });

  it("ida e volta: lembrando guarda o e-mail (sem espaços)", () => {
    expect(lerPreferenciaLogin(salvarPreferenciaLogin(true, "  ana@escola.com "))).toEqual({
      lembrar: true,
      email: "ana@escola.com",
    });
  });

  it("sem lembrar, guarda só a escolha, não o e-mail", () => {
    const salvo = salvarPreferenciaLogin(false, "ana@escola.com");
    expect(salvo).not.toContain("ana@");
    expect(lerPreferenciaLogin(salvo)).toEqual({ lembrar: false, email: "" });
  });

  it("ignora conteúdo inválido ou adulterado", () => {
    expect(lerPreferenciaLogin("{quebrado")).toEqual({ lembrar: true, email: "" });
    expect(lerPreferenciaLogin("42")).toEqual({ lembrar: true, email: "" });
    expect(lerPreferenciaLogin('{"lembrar":true,"email":123}')).toEqual({ lembrar: true, email: "" });
    expect(lerPreferenciaLogin('{"lembrar":false,"email":"x@y.com"}')).toEqual({ lembrar: false, email: "" });
  });
});
