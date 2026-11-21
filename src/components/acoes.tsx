"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState, useTransition } from "react";
import type { AvisoExclusao } from "@/lib/exclusao";
import type { ActionResult } from "@/lib/types";

const FOCO = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosa-forte disabled:opacity-50";

/** Botão só de ícone (listas de turmas e tags). */
const BOTAO_ICONE = `grid size-8 place-items-center rounded-lg text-ink-2 transition ${FOCO}`;

/** Botão pequeno com ícone + texto, contornado (rodapé dos cartões de atividade). */
const BOTAO_TEXTO = `inline-flex items-center gap-1 rounded-lg border border-line bg-card-2 px-3 py-1.5 text-xs font-bold transition-colors ${FOCO}`;

type ComTexto = {
  /** Ação de editar ou apagar. Vira `aria-label` e `title`. */
  rotulo: string;
  /** Com texto, o botão mostra ícone + texto (estilo dos cartões); sem, só o ícone. */
  texto?: string;
};

/** Ação "editar" (caneta). Com `href` vira link; com `onClick`, botão. */
export function BotaoEditar({ rotulo, texto, ...props }: ComTexto & ({ href: string } | { onClick: () => void })) {
  const classe = texto ? `${BOTAO_TEXTO} text-ink hover:bg-ceu` : `${BOTAO_ICONE} hover:bg-card-2 hover:text-ink`;
  const conteudo = (
    <>
      <Pencil className={texto ? "size-3.5" : "size-4"} strokeWidth={2} aria-hidden />
      {texto}
    </>
  );
  const a11y = { title: rotulo, "aria-label": rotulo };
  if ("href" in props) {
    return (
      <Link href={props.href} className={classe} {...a11y}>
        {conteudo}
      </Link>
    );
  }
  return (
    <button type="button" onClick={props.onClick} className={classe} {...a11y}>
      {conteudo}
    </button>
  );
}

/**
 * Ação "apagar" (lixeira). Sempre abre um modal de confirmação antes de chamar `apagar`;
 * se der erro, a mensagem aparece no próprio modal.
 */
export function BotaoApagar({
  rotulo,
  texto,
  aviso,
  apagar,
}: ComTexto & {
  aviso: AvisoExclusao;
  apagar: () => Promise<ActionResult>;
}) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, startTransition] = useTransition();

  function abrir() {
    setErro(null);
    dialogo.current?.showModal();
  }

  function confirmar() {
    startTransition(async () => {
      const res = await apagar();
      if (!res.ok) return setErro(res.error);
      dialogo.current?.close();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        className={texto ? `${BOTAO_TEXTO} text-vinho hover:bg-rosa-claro` : `${BOTAO_ICONE} hover:bg-rosa-claro hover:text-danger`}
        aria-label={rotulo}
        title={rotulo}
      >
        <Trash2 className={texto ? "size-3.5" : "size-4"} strokeWidth={2} aria-hidden />
        {texto}
      </button>

      <dialog
        ref={dialogo}
        aria-labelledby={`${id}-titulo`}
        aria-describedby={`${id}-descricao`}
        onCancel={(e) => pendente && e.preventDefault()}
        onClick={(e) => e.target === e.currentTarget && !pendente && dialogo.current?.close()}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border-2 border-line bg-card p-6 text-center text-ink shadow-[6px_6px_0_0_var(--sombra)] backdrop:bg-ink/60 backdrop:backdrop-blur-[2px]"
      >
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border-2 border-line bg-rosa-claro">
          <Trash2 className="size-7 text-cereja" strokeWidth={2} aria-hidden />
        </span>
        <h2 id={`${id}-titulo`} className="mb-2 font-display text-xl font-extrabold">
          {aviso.titulo}
        </h2>
        <p id={`${id}-descricao`} className="text-sm leading-relaxed text-ink/80">
          {aviso.descricao}
        </p>

        {erro && (
          <p role="alert" className="mt-4 rounded-xl bg-ruim/10 px-4 py-3 text-left text-sm font-medium text-danger">
            {erro}
          </p>
        )}

        <div className="mt-6 flex items-center justify-center gap-3">
          <button type="button" onClick={() => dialogo.current?.close()} disabled={pendente} className="btn-claro" autoFocus>
            Cancelar
          </button>
          <button type="button" onClick={confirmar} disabled={pendente} className="btn-danger">
            {pendente ? "Apagando…" : "Apagar"}
          </button>
        </div>
      </dialog>
    </>
  );
}
