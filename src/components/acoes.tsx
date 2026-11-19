"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState, useTransition } from "react";
import type { AvisoExclusao } from "@/lib/exclusao";
import type { ActionResult } from "@/lib/types";

const BOTAO_ICONE =
  "grid size-8 place-items-center rounded-lg text-ink-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-50";

/** Ação "editar" (caneta). Com `href` vira link; com `onClick`, botão. */
export function BotaoEditar({ rotulo, ...props }: { rotulo: string } & ({ href: string } | { onClick: () => void })) {
  const classe = `${BOTAO_ICONE} hover:bg-card-2 hover:text-ink`;
  const icone = <Pencil className="size-4" strokeWidth={2} aria-hidden />;
  if ("href" in props) {
    return (
      <Link href={props.href} className={classe} aria-label={rotulo} title={rotulo}>
        {icone}
      </Link>
    );
  }
  return (
    <button type="button" onClick={props.onClick} className={classe} aria-label={rotulo} title={rotulo}>
      {icone}
    </button>
  );
}

/**
 * Ação "apagar" (lixeira). Sempre abre um modal de confirmação antes de chamar `apagar`;
 * se der erro, a mensagem aparece no próprio modal.
 */
export function BotaoApagar({
  rotulo,
  aviso,
  apagar,
}: {
  rotulo: string;
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
      <button type="button" onClick={abrir} className={`${BOTAO_ICONE} hover:bg-ruim/10 hover:text-danger`} aria-label={rotulo} title={rotulo}>
        <Trash2 className="size-4" strokeWidth={2} aria-hidden />
      </button>

      <dialog
        ref={dialogo}
        aria-labelledby={`${id}-titulo`}
        aria-describedby={`${id}-descricao`}
        onCancel={(e) => pendente && e.preventDefault()}
        onClick={(e) => e.target === e.currentTarget && !pendente && dialogo.current?.close()}
        className="card m-auto w-[calc(100%-2rem)] max-w-sm p-6 text-ink shadow-[4px_4px_0_0_var(--sombra)] backdrop:bg-ink/40 backdrop:backdrop-blur-[2px]"
      >
        <div className="flex gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ruim/10 text-danger">
            <Trash2 className="size-5" strokeWidth={2} aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 id={`${id}-titulo`} className="titulo-secao">
              {aviso.titulo}
            </h2>
            <p id={`${id}-descricao`} className="mt-1 text-sm leading-relaxed text-ink-2">
              {aviso.descricao}
            </p>
          </div>
        </div>

        {erro && (
          <p role="alert" className="mt-4 rounded-xl bg-ruim/10 px-4 py-3 text-sm font-medium text-danger">
            {erro}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={() => dialogo.current?.close()} disabled={pendente} className="btn-ghost" autoFocus>
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
