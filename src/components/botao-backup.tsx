"use client";

import { Check, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { ehBackup, nomeDoBackup } from "@/lib/backup";
import { hojeLocal } from "@/lib/dates";

type Estado = { tipo: "parado" } | { tipo: "baixando" } | { tipo: "pronto" } | { tipo: "erro"; mensagem: string };

/**
 * "Backup JSON" do cabeçalho: faz GET em /api/atividades (todas as atividades) e baixa o resultado
 * como um arquivo .json formatado. Mostra "Baixando…", "Baixado!" ou o erro num balãozinho.
 */
export function BotaoBackup() {
  const [estado, setEstado] = useState<Estado>({ tipo: "parado" });

  // "Baixado!" e o erro somem sozinhos depois de um tempo.
  useEffect(() => {
    if (estado.tipo !== "pronto" && estado.tipo !== "erro") return;
    const t = setTimeout(() => setEstado({ tipo: "parado" }), estado.tipo === "pronto" ? 2500 : 6000);
    return () => clearTimeout(t);
  }, [estado]);

  async function baixar() {
    setEstado({ tipo: "baixando" });
    try {
      const res = await fetch("/api/atividades", { cache: "no-store" });
      // Sessão expirada: o proxy redireciona para a página de login (HTML), não para o JSON.
      if (res.redirected || !res.headers.get("content-type")?.includes("application/json")) {
        return setEstado({ tipo: "erro", mensagem: "Sua sessão expirou. Entre de novo para baixar o backup." });
      }
      const dados: unknown = await res.json();
      if (!res.ok || !ehBackup(dados)) {
        return setEstado({ tipo: "erro", mensagem: "Não foi possível gerar o backup agora. Tente de novo." });
      }

      const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = nomeDoBackup(hojeLocal());
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setEstado({ tipo: "pronto" });
    } catch {
      setEstado({ tipo: "erro", mensagem: "Sem conexão. Verifique a internet e tente de novo." });
    }
  }

  const baixando = estado.tipo === "baixando";
  const pronto = estado.tipo === "pronto";

  return (
    <span className="relative">
      <button
        type="button"
        onClick={baixar}
        disabled={baixando}
        aria-busy={baixando}
        title="Baixar uma cópia de segurança de todas as atividades"
        className="btn-claro"
      >
        {pronto ? <Check className="size-4 text-oliva" aria-hidden /> : <Download className="size-4 text-cereja" aria-hidden />}
        <span className="max-sm:sr-only">{baixando ? "Baixando…" : pronto ? "Baixado!" : "Backup JSON"}</span>
      </button>
      {estado.tipo === "erro" && (
        <span
          role="alert"
          className="absolute top-full right-0 z-20 mt-2 w-60 rounded-xl border-2 border-line bg-card px-3 py-2 text-xs font-medium text-danger shadow-[3px_3px_0_0_var(--sombra)]"
        >
          {estado.mensagem}
        </span>
      )}
      {/* Leitores de tela ouvem o fim do download (o botão só troca de rótulo). */}
      <span className="sr-only" role="status">
        {pronto ? "Backup baixado." : ""}
      </span>
    </span>
  );
}
