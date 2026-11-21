import { caminhoFlor, caminhoRasgado, pontosEstrela } from "@/lib/formas";

/*
 * Enfeites do tema "doceria retrô" (ver DESIGN.md › Enfeites). Todos são decorativos
 * (aria-hidden), exceto o conteúdo que você coloca dentro da <Flor>.
 */

/** Diz se as classes já posicionam o elemento (absolute/fixed/sticky). */
const posicionada = (classes: string) => classes.split(/\s+/).some((c) => ["absolute", "fixed", "sticky"].includes(c));

/**
 * Selo em forma de flor (círculo de borda ondulada), como os preços "$399 / $8 / $99".
 * `cor` pinta a flor (ex.: `text-pessego`); `className` estiliza o conteúdo por cima.
 */
export function Flor({
  cor = "text-rosa-claro",
  petalas = 10,
  className = "",
  children,
}: {
  cor?: string;
  petalas?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    // `relative` só quando quem usa não posicionou a flor (senão ele anula o `absolute`).
    <span className={`inline-grid place-items-center ${posicionada(className) ? "" : "relative"} ${className}`}>
      <svg viewBox="0 0 100 100" className={`absolute inset-0 size-full ${cor}`} aria-hidden>
        <path d={caminhoFlor(petalas, 100)} fill="currentColor" />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}

/**
 * Borda de papel rasgado. Fica colada do lado de fora de uma seção da mesma cor:
 * em cima, `absolute bottom-full`; embaixo, `invertida` + `absolute top-full`.
 */
export function BordaRasgada({
  className = "text-rosa",
  semente = 7,
  invertida = false,
}: {
  className?: string;
  semente?: number;
  invertida?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1000 24"
      preserveAspectRatio="none"
      className={`pointer-events-none block h-4 w-full sm:h-5 ${invertida ? "-scale-y-100" : ""} ${className}`}
      aria-hidden
    >
      <path d={caminhoRasgado({ largura: 1000, altura: 24, dentes: 56, semente })} fill="currentColor" />
    </svg>
  );
}

type Adesivo = { className?: string };

/** Estrelinha de 5 pontas "desenhada à mão" (estampa rosa e marrom). */
export function Estrela({ className = "size-6 text-vinho" }: Adesivo) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <polygon points={pontosEstrela({ pontas: 5, raios: [48, 44, 50, 42, 46], interno: 20, giro: -8 })} fill="currentColor" strokeLinejoin="round" stroke="currentColor" strokeWidth={4} />
    </svg>
  );
}

/** Estrela de 8 pontas desiguais (estampa azul-céu). */
export function Estrela8({ className = "size-8 text-vinho" }: Adesivo) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <polygon points={pontosEstrela({ pontas: 8, raios: [50, 36, 46, 34], interno: 15, giro: 10 })} fill="currentColor" />
    </svg>
  );
}

/** Brilho de 4 pontas (estampa vermelha). */
export function Brilho({ className = "size-5 text-cereja" }: Adesivo) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 0Q13.4 10.6 24 12Q13.4 13.4 12 24Q10.6 13.4 0 12Q10.6 10.6 12 0Z" fill="currentColor" />
    </svg>
  );
}

/** Par de cerejas. */
export function Cereja({ className = "size-10" }: Adesivo) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path d="M30 6c-6 4-11 13-14 24M30 6c0 8 2 16 6 22" fill="none" stroke="var(--vinho)" strokeWidth={2.5} strokeLinecap="round" />
      <path d="M30 6c5-4 11-3 14 0-4 3-10 4-14 0Z" fill="var(--tag-6)" />
      <circle cx="15" cy="34" r="9" fill="var(--cereja)" stroke="var(--vinho)" strokeWidth={2} />
      <circle cx="35" cy="33" r="9" fill="var(--cereja)" stroke="var(--vinho)" strokeWidth={2} />
      <circle cx="12" cy="31" r="2.2" fill="var(--creme)" />
      <circle cx="32" cy="30" r="2.2" fill="var(--creme)" />
    </svg>
  );
}

/** Coração-adesivo com contorno (o "Just a lil something sweet"). */
export function Coracao({ className = "size-10" }: Adesivo) {
  return (
    <svg viewBox="0 0 48 44" className={className} aria-hidden>
      <path
        d="M24 41S3 28.5 3 14.5C3 8 8 3 14 3c4.4 0 8 2.6 10 6.2C26 5.6 29.6 3 34 3c6 0 11 5 11 11.5C45 28.5 24 41 24 41Z"
        fill="var(--cereja)"
        stroke="var(--creme)"
        strokeWidth={3}
      />
    </svg>
  );
}

/** Seta-rabisco com um laço, apontando para a direita (a do "JOIN THE CLUB → caminhão"). */
export function SetaRabisco({ className = "h-10 w-24 text-vinho" }: Adesivo) {
  return (
    <svg viewBox="0 0 120 50" className={className} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 14c10 22 30 30 42 22 10-7 4-22-6-16-11 7 2 26 24 26 18 0 34-6 48-14" />
      <path d="M100 26l13 5-11 9" />
    </svg>
  );
}

/**
 * Letreiro cereja que passa no topo, com as frases separadas por ✦ e ✿ alternados.
 * Para no hover e em `prefers-reduced-motion`.
 */
export function FaixaCorrida({ frases, className = "bg-cereja text-creme" }: { frases: string[]; className?: string }) {
  const linha = (copia: boolean) => (
    <span className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={copia || undefined}>
      {frases.map((f, i) => (
        <span key={i} className="whitespace-nowrap">
          <span aria-hidden>{i % 2 === 0 ? "✦" : "✿"}</span> {f}
        </span>
      ))}
    </span>
  );
  return (
    <div className={`overflow-hidden border-b-2 border-line py-2 text-xs font-bold tracking-widest uppercase ${className}`}>
      <div className="animate-correr flex w-max">
        {linha(false)}
        {linha(true)}
      </div>
    </div>
  );
}
