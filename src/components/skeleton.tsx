export function SkeletonBloco({ linhas = 3 }: { linhas?: number }) {
  return (
    <div className="animate-pulse space-y-3" aria-busy aria-label="Carregando">
      {Array.from({ length: linhas }, (_, i) => (
        <div key={i} className="h-10 rounded-xl bg-card-2" style={{ width: `${100 - ((i * 17) % 40)}%` }} />
      ))}
    </div>
  );
}
