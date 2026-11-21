/**
 * Medalhão do AnalisaPsi: aro verde-oliva com miolo creme tracejado, o Ψ em cereja e um recadinho
 * em letra de mão, mais uma estrelinha rosa no canto. `grande` mostra o recadinho (cabeçalho).
 */
export function Medalhao({ className = "size-24", grande = true }: { className?: string; grande?: boolean }) {
  return (
    <span
      aria-hidden
      className={`relative flex shrink-0 items-center justify-center rounded-full border-2 border-line bg-oliva shadow-md ${
        grande ? "p-2" : "p-1"
      } ${className}`}
    >
      <span className="flex size-full flex-col items-center justify-center rounded-full border-2 border-dashed border-oliva bg-card">
        <span className={`font-display leading-none font-extrabold text-cereja ${grande ? "text-2xl" : "text-base"}`}>Ψ</span>
        {grande && <span className="mt-0.5 font-script text-sm leading-none font-bold text-oliva max-sm:hidden">caderno</span>}
      </span>
      <span
        className={`absolute -top-1 -right-1 flex items-center justify-center rounded-full border-2 border-line bg-rosa-claro text-ink shadow-sm ${
          grande ? "size-7 text-xs" : "size-4 text-[8px]"
        }`}
      >
        ✦
      </span>
    </span>
  );
}

/** Medalhão + nome, com o "Psi" em itálico oliva (letreiro da marca). */
export function Marca({ className = "", tamanho = "text-3xl", logo = "size-10" }: { className?: string; tamanho?: string; logo?: string }) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <Medalhao className={logo} grande={false} />
      <span className={`font-display leading-none font-extrabold tracking-tight text-vinho ${tamanho}`}>
        Analisa<em className="font-semibold text-oliva">Psi</em>
      </span>
    </span>
  );
}
