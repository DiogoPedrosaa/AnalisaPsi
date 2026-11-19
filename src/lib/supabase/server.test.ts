import { beforeEach, describe, expect, it, vi } from "vitest";

const ordem: string[] = [];

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => {
    ordem.push("cookies");
    return { get: () => undefined, getAll: () => [], set: vi.fn() };
  }),
}));
vi.mock("next/server", () => ({
  connection: vi.fn(async () => {
    ordem.push("connection");
  }),
}));
vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => {
    ordem.push("createServerClient");
    return {};
  }),
}));

const { createClient } = await import("./server");

describe("createClient", () => {
  beforeEach(() => {
    ordem.length = 0;
  });

  it("espera a requisição real antes de criar o cliente (o auth lê Date.now())", async () => {
    await createClient();
    expect(ordem).toEqual(["cookies", "connection", "createServerClient"]);
  });

  it("também espera a requisição quando o modo lembrar é forçado", async () => {
    await createClient({ lembrar: true });
    expect(ordem).toEqual(["cookies", "connection", "createServerClient"]);
  });
});
