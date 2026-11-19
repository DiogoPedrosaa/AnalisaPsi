"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export type CampoFiltro = {
  nome: string;
  rotulo: string;
  valor: string;
  opcoes: { valor: string; rotulo: string }[];
  /** Rótulo da opção "sem filtro". */
  todos: string;
};

/** Selects que atualizam a URL (?nome=valor) — o servidor recalcula a página. */
export function Filtros({ campos }: { campos: CampoFiltro[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pendente, startTransition] = useTransition();

  const ativos = campos.filter((c) => c.valor);

  function aplicar(nome: string, valor: string) {
    const params = new URLSearchParams();
    for (const c of campos) {
      const v = c.nome === nome ? valor : c.valor;
      if (v) params.set(c.nome, v);
    }
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  return (
    <div className={`flex flex-wrap items-end gap-3 transition ${pendente ? "opacity-60" : ""}`}>
      {campos.map((c) => (
        <label key={c.nome} className="min-w-36 flex-1 sm:flex-none">
          <span className="rotulo mb-1 block">{c.rotulo}</span>
          <select
            value={c.valor}
            onChange={(e) => aplicar(c.nome, e.target.value)}
            className={`input py-2 text-sm ${c.valor ? "border-accent" : ""}`}
          >
            <option value="">{c.todos}</option>
            {c.opcoes.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.rotulo}
              </option>
            ))}
          </select>
        </label>
      ))}
      {ativos.length > 0 && (
        <button
          type="button"
          onClick={() => startTransition(() => router.replace(pathname, { scroll: false }))}
          className="btn-ghost py-2"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
