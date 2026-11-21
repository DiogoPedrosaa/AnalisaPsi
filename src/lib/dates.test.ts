import { describe, expect, it } from "vitest";
import { formatarDataCurta, hojeNoFuso, horaNoFuso, quandoFoi, saudacao } from "@/lib/dates";

describe("saudacao", () => {
  it.each([
    [0, "Boa noite"],
    [4, "Boa noite"],
    [5, "Bom dia"],
    [11, "Bom dia"],
    [12, "Boa tarde"],
    [17, "Boa tarde"],
    [18, "Boa noite"],
    [23, "Boa noite"],
  ])("às %ih → %s", (hora, esperado) => {
    expect(saudacao(hora)).toBe(esperado);
  });
});

describe("horaNoFuso / hojeNoFuso", () => {
  // 02:30 UTC de 18/11 ainda é 23:30 de 17/11 em São Paulo (UTC−3).
  const agora = new Date("2026-11-18T02:30:00Z");

  it("converte a hora para o fuso", () => {
    expect(horaNoFuso(agora, "America/Sao_Paulo")).toBe(23);
    expect(horaNoFuso(agora, "UTC")).toBe(2);
  });

  it("meia-noite vira 0, não 24", () => {
    expect(horaNoFuso(new Date("2026-11-17T03:00:00Z"), "America/Sao_Paulo")).toBe(0);
  });

  it("usa o dia do fuso, não o do UTC", () => {
    expect(hojeNoFuso(agora, "America/Sao_Paulo")).toBe("2026-11-17");
    expect(hojeNoFuso(agora, "UTC")).toBe("2026-11-18");
  });
});

describe("quandoFoi", () => {
  const hoje = "2026-11-17";

  it("descreve dias recentes", () => {
    expect(quandoFoi("2026-11-17", hoje)).toBe("hoje");
    expect(quandoFoi("2026-11-16", hoje)).toBe("ontem");
    expect(quandoFoi("2026-11-11", hoje)).toBe("há 6 dias");
  });

  it("a partir de uma semana mostra a data", () => {
    expect(quandoFoi("2026-11-10", hoje)).toBe("em 10 de novembro");
  });

  it("atravessa a virada do mês", () => {
    expect(quandoFoi("2026-10-31", "2026-11-01")).toBe("ontem");
  });

  it("data no futuro conta como hoje", () => {
    expect(quandoFoi("2026-11-20", hoje)).toBe("hoje");
  });
});

describe("formatarDataCurta", () => {
  it("vira dd/mm/aaaa", () => {
    expect(formatarDataCurta("2026-03-05")).toBe("05/03/2026");
  });

  it("com o dia da semana abreviado na frente", () => {
    expect(formatarDataCurta("2026-11-18", true)).toBe("Qua, 18/11/2026");
    expect(formatarDataCurta("2026-11-22", true)).toBe("Dom, 22/11/2026");
  });

  it("devolve o texto original se não for uma data yyyy-mm-dd", () => {
    expect(formatarDataCurta("")).toBe("");
    expect(formatarDataCurta("18/11")).toBe("18/11");
  });
});
