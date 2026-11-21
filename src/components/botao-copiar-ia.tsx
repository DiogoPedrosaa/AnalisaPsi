"use client";

import { Check, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

/** Cópia antiga (textarea + execCommand), para navegadores sem a API do clipboard ou sem permissão. */
function copiarAntigo(texto: string) {
  const area = document.createElement("textarea");
  area.value = texto;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.select();
  try {
    return document.execCommand("copy");
  } finally {
    area.remove();
  }
}

/**
 * "Copiar para IA" do caderno da turma: copia o relatório da turma + prompt (montado no servidor por
 * `textoParaIA`) para colar no ChatGPT, Gemini ou Claude. Mostra "Copiado!" ou o erro num balãozinho.
 */
export function BotaoCopiarIA({ texto }: { texto: string }) {
  const [estado, setEstado] = useState<"parado" | "copiado" | "erro">("parado");

  useEffect(() => {
    if (estado === "parado") return;
    const t = setTimeout(() => setEstado("parado"), estado === "copiado" ? 2500 : 6000);
    return () => clearTimeout(t);
  }, [estado]);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setEstado("copiado");
    } catch {
      setEstado(copiarAntigo(texto) ? "copiado" : "erro");
    }
  }

  const copiado = estado === "copiado";

  return (
    <span className="relative flex">
      <button
        type="button"
        onClick={copiar}
        title="Copia o relatório da turma com um prompt pronto para colar no ChatGPT, Gemini ou Claude"
        className="btn-secundario flex-1 px-5 py-3"
      >
        {copiado ? <Check className="size-4 text-oliva" aria-hidden /> : <Sparkles className="size-4 text-lavanda-escura" aria-hidden />}
        {copiado ? "Copiado! Cole na sua IA" : "Copiar para IA"}
      </button>
      {estado === "erro" && (
        <span
          role="alert"
          className="absolute top-full right-0 z-20 mt-2 w-64 rounded-xl border-2 border-line bg-card px-3 py-2 text-xs font-medium text-danger shadow-[3px_3px_0_0_var(--sombra)]"
        >
          O navegador não deixou copiar. Tente de novo ou use outro navegador.
        </span>
      )}
      <span className="sr-only" role="status">
        {copiado ? "Relatório e prompt copiados. Cole na sua IA." : ""}
      </span>
    </span>
  );
}
