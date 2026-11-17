"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS = [
  { href: "/", label: "Registrar", icon: "M12 5v14M5 12h14" },
  { href: "/historico", label: "Histórico", icon: "M4 6h16M4 12h16M4 18h10" },
  { href: "/dashboard", label: "Painel", icon: "M5 20V11M12 20V5M19 20v-6" },
  {
    href: "/turmas-e-tags",
    label: "Turmas e tags",
    icon: "M3 7l4-4h6l8 8-10 10-8-8V7zM8.5 8.5h.01",
  },
] as const;

function Icone({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function useAtivo() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/" ? pathname === "/" || pathname.startsWith("/atividades") : pathname.startsWith(href);
}

/** Navegação no topo (telas médias e grandes). */
export function NavTopo() {
  const ativo = useAtivo();
  return (
    <nav className="hidden items-center gap-1 md:flex">
      {ITENS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={ativo(item.href) ? "page" : undefined}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            ativo(item.href) ? "bg-accent-soft text-accent" : "text-ink-2 hover:bg-card-2 hover:text-ink"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

/** Barra inferior fixa (celular). */
export function NavInferior() {
  const ativo = useAtivo();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {ITENS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={ativo(item.href) ? "page" : undefined}
            className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
              ativo(item.href) ? "text-accent" : "text-muted"
            }`}
          >
            <Icone d={item.icon} />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
