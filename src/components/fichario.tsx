/**
 * Folha de fichário (ver DESIGN.md › Folha de fichário): papel azul pautado com margem vermelha e
 * furos à esquerda, cabeçalho com fita washi lavanda e o título da tela. Usada nos formulários.
 */
export function FolhaFichario({
  etiqueta = "Ficha de registro de campo",
  titulo,
  subtitulo,
  children,
}: {
  etiqueta?: string;
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="folha-fichario overflow-hidden rounded-3xl border-2 border-line shadow-[8px_8px_0_0_var(--sombra)]">
      {/* Sem `relative` nas faixas abaixo: os furos (::before) ficam por cima delas, como no papel. */}
      <div className="border-b-2 border-line/20 bg-card/70 pt-6 pr-4 pb-4 pl-14 sm:pr-6">
        <span className="washi mb-1 bg-lavanda px-2.5 py-0.5 text-[11px]">{etiqueta}</span>
        <h1 className="font-display text-2xl leading-tight font-extrabold text-ink">{titulo}</h1>
        {subtitulo && <p className="mt-0.5 text-sm text-ink-2">{subtitulo}</p>}
      </div>
      <div className="py-6 pr-4 pl-14 sm:pr-6">{children}</div>
    </div>
  );
}
