export function corDaTag(cor: number | undefined) {
  return `var(--tag-${cor ?? 1})`;
}

export function TagDot({ cor, className = "size-2" }: { cor?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 rounded-full ${className}`}
      style={{ background: corDaTag(cor) }}
    />
  );
}

export function TagChip({ nome, cor }: { nome: string; cor?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-card-2 px-2 py-0.5 text-xs font-medium text-ink-2">
      <TagDot cor={cor} className="size-1.5" />
      {nome}
    </span>
  );
}
