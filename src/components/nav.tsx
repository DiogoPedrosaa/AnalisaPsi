"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icone } from "@/components/icone";
import { itemAtivo, MENU_TOPO } from "@/lib/modulos";

/** Navegação do cabeçalho: chips com contorno, o ativo em cereja (como os filtros do caderno). */
export function NavTopo() {
  return <ListaNav ativo={usePathname()} />;
}

/** Mesma navegação sem item ativo (fallback enquanto a rota carrega). */
export function NavTopoEstatica() {
  return <ListaNav ativo={null} />;
}

function ListaNav({ ativo }: { ativo: string | null }) {
  return (
    <nav aria-label="Principal" className="-mx-1 flex gap-2 overflow-x-auto px-1 pt-0.5 pb-1.5">
      {MENU_TOPO.map((item) => {
        const atual = ativo !== null && itemAtivo(ativo, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={atual ? "page" : undefined}
            className={`chip shrink-0 py-2 ${atual ? "chip-ativo" : "chip-inativo"}`}
          >
            <Icone d={item.icon} className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
