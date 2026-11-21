import { X } from "lucide-react";
import Link from "next/link";

/**
 * Folha de fichário (ver DESIGN.md › Folha de fichário): papel azul pautado com margem vermelha e
 * furos à esquerda, cabeçalho com fita washi lavanda, o título da tela e, com `fechar`, o botão ✕.
 * Usada nos formulários.
 */
export function FolhaFichario({
  etiqueta = "Ficha de Registro de Campo",
  titulo,
  subtitulo,
  fechar,
  children,
}: {
  etiqueta?: string;
  titulo: string;
  subtitulo?: string;
  /** Endereço do botão ✕ (fecha a ficha sem salvar). */
  fechar?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="folha-fichario overflow-hidden rounded-3xl border-2 border-line shadow-[8px_8px_0_0_var(--sombra)]">
      {/* Sem `relative` nas faixas abaixo: os furos (::before) ficam por cima delas, como no papel. */}
      <div className="flex items-center justify-between gap-3 border-b-2 border-line/20 bg-card/70 pt-6 pr-4 pb-4 pl-14 sm:pr-6">
        <div>
          <span className="washi mb-1 bg-lavanda px-2.5 py-0.5 text-[11px]">{etiqueta}</span>
          <h1 className="font-display text-2xl leading-tight font-extrabold text-ink">{titulo}</h1>
          {subtitulo && <p className="mt-0.5 text-sm text-ink-2">{subtitulo}</p>}
        </div>
        {fechar && (
          <Link
            href={fechar}
            aria-label="Fechar"
            title="Fechar"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border-2 border-line bg-card transition-colors hover:bg-rosa-claro focus-visible:ring-2 focus-visible:ring-rosa-forte focus-visible:outline-none"
          >
            <X className="size-5 text-ink" aria-hidden />
          </Link>
        )}
      </div>
      <div className="py-6 pr-4 pl-14 sm:pr-6">{children}</div>
    </div>
  );
}
