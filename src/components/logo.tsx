import { caminhoFlor } from "@/lib/formas";

/** Selo do AnalisaPsi: flor vinho (como os selos do tema) com três barras crescentes. */
export function Logo({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d={caminhoFlor(12, 32)} fill="var(--accent)" />
      <rect x="9" y="17" width="3.6" height="6.5" rx="1.4" fill="var(--accent-ink)" opacity="0.65" />
      <rect x="14.2" y="12.5" width="3.6" height="11" rx="1.4" fill="var(--accent-ink)" opacity="0.85" />
      <rect x="19.4" y="8.5" width="3.6" height="15" rx="1.4" fill="var(--accent-ink)" />
    </svg>
  );
}

/** Logo + nome, com o "Psi" em itálico (letreiro da marca). */
export function Marca({ className = "", tamanho = "text-2xl", logo = "size-8" }: { className?: string; tamanho?: string; logo?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <Logo className={logo} />
      <span className={`font-display leading-none tracking-tight text-ink ${tamanho}`}>
        Analisa<em className="text-accent">Psi</em>
      </span>
    </span>
  );
}
