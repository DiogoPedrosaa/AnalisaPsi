import { describe, expect, it } from "vitest";
import { aleatorio, caminhoFlor, caminhoRasgado, pontosEstrela } from "@/lib/formas";

/** Pares de números (x y ou x,y) que aparecem num path/points. */
function coordenadas(s: string) {
  const nums = s.match(/-?\d+(\.\d+)?/g)!.map(Number);
  return nums;
}

describe("caminhoFlor", () => {
  it("tem uma pétala (arco) por pétala pedida e fecha o contorno", () => {
    const d = caminhoFlor(10, 100);
    expect(d.startsWith("M")).toBe(true);
    expect(d.endsWith("Z")).toBe(true);
    expect(d.match(/A/g)).toHaveLength(10);
  });

  it("começa no topo, centrado na horizontal", () => {
    const [x, y] = coordenadas(caminhoFlor(8, 100));
    expect(x).toBe(50);
    expect(y).toBeGreaterThan(0);
    expect(y).toBeLessThan(50);
  });

  it("cabe no quadrado: as pétalas encostam na borda sem passar", () => {
    for (const petalas of [3, 6, 10, 14]) {
      const d = caminhoFlor(petalas, 100);
      // Ponto mais distante = base da pétala + raio da pétala.
      const r = 50 / (Math.cos(Math.PI / petalas) + Math.sin(Math.PI / petalas));
      const alcance = r * Math.cos(Math.PI / petalas) + r * Math.sin(Math.PI / petalas);
      expect(alcance).toBeCloseTo(50, 5);
      expect(d).toContain(`A${Math.round(r * Math.sin(Math.PI / petalas) * 10) / 10}`);
    }
  });

  it("recusa menos de 3 pétalas ou número quebrado", () => {
    expect(() => caminhoFlor(2)).toThrow(RangeError);
    expect(() => caminhoFlor(4.5)).toThrow(RangeError);
  });
});

describe("pontosEstrela", () => {
  it("gera duas vezes o número de pontas (pontas + vales)", () => {
    expect(pontosEstrela({ pontas: 5 }).split(" ")).toHaveLength(10);
    expect(pontosEstrela({ pontas: 8 }).split(" ")).toHaveLength(16);
  });

  it("sem giro, a primeira ponta fica virada para cima", () => {
    expect(pontosEstrela({ cx: 50, cy: 50, raios: [40] }).split(" ")[0]).toBe("50,10");
  });

  it("usa os raios em rodízio nas pontas e o interno nos vales", () => {
    const pts = pontosEstrela({ pontas: 4, cx: 0, cy: 0, raios: [10, 20], interno: 5 })
      .split(" ")
      .map((p) => p.split(",").map(Number))
      .map(([x, y]) => Math.round(Math.hypot(x, y)));
    expect(pts).toEqual([10, 5, 20, 5, 10, 5, 20, 5]);
  });

  it("recusa estrela sem pontas suficientes ou sem raio", () => {
    expect(() => pontosEstrela({ pontas: 2 })).toThrow(RangeError);
    expect(() => pontosEstrela({ raios: [] })).toThrow(RangeError);
  });
});

describe("aleatorio", () => {
  it("é determinístico pela semente e fica entre 0 e 1", () => {
    const a = aleatorio(42);
    const b = aleatorio(42);
    const seqA = Array.from({ length: 50 }, a);
    expect(seqA).toEqual(Array.from({ length: 50 }, b));
    expect(seqA.every((n) => n >= 0 && n < 1)).toBe(true);
  });

  it("sementes diferentes dão sequências diferentes", () => {
    expect(aleatorio(1)()).not.toBe(aleatorio(2)());
  });
});

describe("caminhoRasgado", () => {
  it("é igual no servidor e no navegador (mesma semente, mesmo rasgo)", () => {
    expect(caminhoRasgado({ semente: 3 })).toBe(caminhoRasgado({ semente: 3 }));
    expect(caminhoRasgado({ semente: 3 })).not.toBe(caminhoRasgado({ semente: 4 }));
  });

  it("fecha pela base e vai de ponta a ponta na largura", () => {
    const d = caminhoRasgado({ largura: 500, altura: 20, dentes: 10 });
    expect(d.startsWith("M0 20L0 ")).toBe(true);
    expect(d.endsWith("L500 20Z")).toBe(true);
    expect(d.match(/L/g)).toHaveLength(10 + 2);
  });

  it("todos os pontos ficam dentro da faixa", () => {
    const nums = coordenadas(caminhoRasgado({ largura: 300, altura: 16, dentes: 30, semente: 99 }));
    for (let i = 0; i < nums.length; i += 2) {
      expect(nums[i]).toBeGreaterThanOrEqual(0);
      expect(nums[i]).toBeLessThanOrEqual(300);
      expect(nums[i + 1]).toBeGreaterThanOrEqual(0);
      expect(nums[i + 1]).toBeLessThanOrEqual(16);
    }
  });

  it("recusa rasgo sem dentes", () => {
    expect(() => caminhoRasgado({ dentes: 0 })).toThrow(RangeError);
  });
});
