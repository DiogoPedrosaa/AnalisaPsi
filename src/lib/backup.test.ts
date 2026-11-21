import { describe, expect, it } from "vitest";
import { ehBackup, montarBackup, nomeDoBackup, VERSAO_BACKUP } from "./backup";
import type { Atividade } from "./types";

const atividade = (id: string, extra: Partial<Atividade> = {}): Atividade => ({
  id,
  titulo: `Atividade ${id}`,
  data: "2026-11-18",
  receptividade: "boa",
  observacao: null,
  turma: { id: "t1", nome: "8º Ano" },
  tags: [],
  ...extra,
});

describe("montarBackup", () => {
  const agora = new Date("2026-11-21T13:45:00.000Z");

  it("tem cabeçalho com app, versão, data da exportação e total", () => {
    const b = montarBackup([atividade("1"), atividade("2")], agora);
    expect(b).toMatchObject({ app: "AnalisaPsi", versao: VERSAO_BACKUP, exportadoEm: "2026-11-21T13:45:00.000Z", total: 2 });
  });

  it("mantém a ordem e todos os campos de cada atividade, com turma e tags", () => {
    const a = atividade("1", {
      observacao: "Foi ótimo",
      receptividade: "ruim",
      tags: [{ id: "g1", nome: "Arte", cor: 3 }],
    });
    const b = montarBackup([a, atividade("2")], agora);
    expect(b.atividades.map((x) => x.id)).toEqual(["1", "2"]);
    expect(b.atividades[0]).toEqual(a);
  });

  it("não leva campos extras que venham grudados nos objetos", () => {
    const comLixo = { ...atividade("1"), segredo: "x", turma: { id: "t1", nome: "8º Ano", user_id: "u" } } as Atividade;
    const [a] = montarBackup([comLixo], agora).atividades;
    expect(a).not.toHaveProperty("segredo");
    expect(a.turma).toEqual({ id: "t1", nome: "8º Ano" });
  });

  it("sem atividades gera um backup vazio, mas válido", () => {
    const b = montarBackup([], agora);
    expect(b.total).toBe(0);
    expect(b.atividades).toEqual([]);
    expect(ehBackup(b)).toBe(true);
  });

  it("sobrevive a JSON.stringify/parse sem perder nada", () => {
    const b = montarBackup([atividade("1", { tags: [{ id: "g", nome: "Jogo", cor: 1 }] })], agora);
    expect(JSON.parse(JSON.stringify(b))).toEqual(b);
  });
});

describe("nomeDoBackup", () => {
  it("usa a data no nome do arquivo .json", () => {
    expect(nomeDoBackup("2026-11-21")).toBe("backup-analisapsi-2026-11-21.json");
  });
});

describe("ehBackup", () => {
  it("reconhece um backup", () => {
    expect(ehBackup(montarBackup([atividade("1")]))).toBe(true);
  });

  it("recusa respostas que não são backup (erro, HTML, nulo)", () => {
    expect(ehBackup(null)).toBe(false);
    expect(ehBackup("<html>")).toBe(false);
    expect(ehBackup({ erro: "falhou" })).toBe(false);
    expect(ehBackup({ app: "AnalisaPsi", atividades: "não é lista", total: 1 })).toBe(false);
  });
});
