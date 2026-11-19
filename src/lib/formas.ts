/**
 * Geometria dos enfeites retrô (selos em flor, estrelas, borda de papel rasgado).
 * Tudo devolve strings prontas para `<path d>` / `<polygon points>` de SVG.
 */

const r1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Contorno de "flor" (círculo com bordas onduladas, como os selos de preço do site de doces),
 * centrado num quadrado `tamanho × tamanho`. Cada pétala é um semicírculo apoiado entre dois
 * pontos de um círculo interno, e o conjunto todo cabe exatamente no quadrado.
 */
export function caminhoFlor(petalas = 10, tamanho = 100) {
  if (!Number.isInteger(petalas) || petalas < 3) throw new RangeError("A flor precisa de pelo menos 3 pétalas.");
  const c = tamanho / 2;
  const meioAngulo = Math.PI / petalas;
  // Distância máxima do centro = r·cos(π/n) + r·sin(π/n) (base da pétala + raio da pétala) = tamanho/2.
  const r = c / (Math.cos(meioAngulo) + Math.sin(meioAngulo));
  const raioPetala = r * Math.sin(meioAngulo);
  const ponto = (i: number) => {
    const a = (2 * Math.PI * i) / petalas - Math.PI / 2;
    return `${r1(c + r * Math.cos(a))} ${r1(c + r * Math.sin(a))}`;
  };
  let d = `M${ponto(0)}`;
  for (let i = 1; i <= petalas; i++) d += `A${r1(raioPetala)} ${r1(raioPetala)} 0 0 1 ${ponto(i)}`;
  return `${d}Z`;
}

/**
 * Pontos de uma estrela de `pontas` pontas centrada em (`cx`, `cy`). `raios` pode ter vários
 * valores, usados em rodízio, para pontas de tamanhos diferentes (estrela "desenhada à mão").
 * `giro` em graus; 0 deixa a primeira ponta virada para cima.
 */
export function pontosEstrela({
  pontas = 5,
  cx = 50,
  cy = 50,
  raios = [50],
  interno = 20,
  giro = 0,
}: {
  pontas?: number;
  cx?: number;
  cy?: number;
  raios?: number[];
  interno?: number;
  giro?: number;
} = {}) {
  if (!Number.isInteger(pontas) || pontas < 3) throw new RangeError("A estrela precisa de pelo menos 3 pontas.");
  if (raios.length === 0) throw new RangeError("Informe ao menos um raio.");
  const pts: string[] = [];
  for (let i = 0; i < pontas * 2; i++) {
    const a = (Math.PI * i) / pontas + (giro * Math.PI) / 180 - Math.PI / 2;
    const r = i % 2 === 0 ? raios[(i / 2) % raios.length] : interno;
    pts.push(`${r1(cx + r * Math.cos(a))},${r1(cy + r * Math.sin(a))}`);
  }
  return pts.join(" ");
}

/** Gerador pseudoaleatório determinístico (mulberry32): mesma semente, mesmos números. */
export function aleatorio(semente: number) {
  let s = semente >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Faixa de "papel rasgado" no viewBox `largura × altura`: a parte de baixo é cheia e a de cima
 * tem o rasgo irregular, com `dentes` picos. Determinística pela `semente`, para o servidor e o
 * navegador desenharem o mesmo rasgo. Para o rasgo de baixo de uma seção, vire o SVG (`-scale-y-100`).
 */
export function caminhoRasgado({ largura = 1000, altura = 24, dentes = 40, semente = 7 } = {}) {
  if (!Number.isInteger(dentes) || dentes < 1) throw new RangeError("O rasgo precisa de pelo menos 1 dente.");
  const sorteio = aleatorio(semente);
  const passo = largura / dentes;
  let d = `M0 ${altura}L0 ${r1(altura * (0.35 + sorteio() * 0.4))}`;
  for (let i = 1; i <= dentes; i++) {
    // Alterna picos altos e vales, com um empurrão aleatório no x para não parecer serrote.
    const x = i === dentes ? largura : r1(i * passo + (sorteio() - 0.5) * passo * 0.6);
    const y = i % 2 === 0 ? altura * (0.05 + sorteio() * 0.35) : altura * (0.5 + sorteio() * 0.4);
    d += `L${x} ${r1(y)}`;
  }
  return `${d}L${largura} ${altura}Z`;
}
