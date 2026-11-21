import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Atividade } from "@/lib/types";

const getAtividades = vi.fn<(...args: unknown[]) => Promise<Atividade[]>>();
vi.mock("@/lib/data", () => ({ getAtividades: (...args: unknown[]) => getAtividades(...args) }));

const { GET } = await import("./route");

const atividade: Atividade = {
  id: "a1",
  titulo: "Mito ou Verdade",
  data: "2026-03-25",
  categoria: "roda_conversa",
  tema: "Amizades e redes sociais",
  receptividade: "adoraram",
  descricao: "Plaquinhas de mito/verdade",
  observacoes: "Engajamento altíssimo",
  turma: { id: "t1", nome: "8º Ano" },
};

describe("GET /api/atividades", () => {
  beforeEach(() => {
    getAtividades.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("devolve todas as atividades no formato de backup, sem cache", async () => {
    getAtividades.mockResolvedValue([atividade]);
    const res = await GET();

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    expect(res.headers.get("cache-control")).toBe("no-store");
    const corpo = await res.json();
    expect(corpo).toMatchObject({ app: "AnalisaPsi", total: 1, atividades: [atividade] });
  });

  it("busca sem filtro e sem limite (todas as atividades)", async () => {
    getAtividades.mockResolvedValue([]);
    await GET();
    expect(getAtividades).toHaveBeenCalledTimes(1);
    expect(getAtividades).toHaveBeenCalledWith();
  });

  it("responde 500 com mensagem quando o banco falha", async () => {
    getAtividades.mockRejectedValue(new Error("banco fora do ar"));
    const res = await GET();

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ erro: "Não foi possível buscar as atividades." });
  });

  it("deixa passar o redirecionamento para o login", async () => {
    const redirect = Object.assign(new Error("NEXT_REDIRECT"), { digest: "NEXT_REDIRECT;replace;/login;307;" });
    getAtividades.mockRejectedValue(redirect);
    await expect(GET()).rejects.toBe(redirect);
  });
});
