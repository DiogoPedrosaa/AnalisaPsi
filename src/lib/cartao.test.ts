import { describe, expect, it } from "vitest";
import { CORES_FITA, corDaFita } from "./cartao";

describe("corDaFita", () => {
  it("segue o rodízio rosa → lavanda → céu → oliva", () => {
    expect([0, 1, 2, 3].map(corDaFita)).toEqual(["bg-rosa-claro", "bg-lavanda", "bg-ceu", "bg-oliva-clara"]);
  });

  it("recomeça depois da quarta cor", () => {
    expect(corDaFita(4)).toBe(CORES_FITA[0]);
    expect(corDaFita(9)).toBe(CORES_FITA[1]);
  });

  it("nunca devolve undefined para índices estranhos", () => {
    for (const i of [-1, -6, 2.7, Number.NaN]) expect(CORES_FITA).toContain(corDaFita(i));
  });
});
