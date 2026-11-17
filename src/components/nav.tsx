"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useState, useSyncExternalStore } from "react";
import { Icone } from "@/components/icone";
import { Logo } from "@/components/logo";
import { sair } from "@/lib/actions";
import { CHAVE_MENU, ICONE_INICIO, itemAtivo, MODULOS } from "@/lib/modulos";

const ITENS = [{ href: "/", label: "Início", icon: ICONE_INICIO }, ...MODULOS];

const DESKTOP = "(min-width: 48rem)";

/** Menu escondido no desktop = `data-menu="fechado"` no <html> (estilizado pela variante `menu-fechado:`). */
function aplicarMenu(fechado: boolean) {
  if (fechado) document.documentElement.dataset.menu = "fechado";
  else delete document.documentElement.dataset.menu;
}

function inscreverMenu(avisar: () => void) {
  const obs = new MutationObserver(avisar);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-menu"] });
  return () => obs.disconnect();
}

function inscreverTela(avisar: () => void) {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener("change", avisar);
  return () => mq.removeEventListener("change", avisar);
}

function useDesktop() {
  return useSyncExternalStore(inscreverTela, () => window.matchMedia(DESKTOP).matches, () => true);
}

function useMenuFechado() {
  return useSyncExternalStore(
    inscreverMenu,
    () => document.documentElement.dataset.menu === "fechado",
    () => false,
  );
}

/**
 * Menu lateral + barra do topo com o botão que mostra/esconde o menu.
 * Desktop: menu fixo à esquerda, que pode ser escondido (botão ou Ctrl/⌘+B) e lembra a escolha.
 * Celular: o menu vira uma gaveta por cima do conteúdo.
 */
export function MenuLateral() {
  const pathname = usePathname();
  const desktop = useDesktop();
  const menuFechado = useMenuFechado();
  const [gaveta, setGaveta] = useState(false);

  // Em dev, o Strict Mode remonta e o React limpa o atributo que o script colocou no <html>.
  useLayoutEffect(() => {
    try {
      aplicarMenu(localStorage.getItem(CHAVE_MENU) === "fechado");
    } catch {}
  }, []);

  const alternar = useCallback(() => {
    if (!window.matchMedia(DESKTOP).matches) {
      setGaveta((v) => !v);
      return;
    }
    const fechar = document.documentElement.dataset.menu !== "fechado";
    aplicarMenu(fechar);
    try {
      localStorage.setItem(CHAVE_MENU, fechar ? "fechado" : "aberto");
    } catch {}
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setGaveta(false);
      if (e.key.toLowerCase() === "b" && (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        alternar();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [alternar]);

  const fechar = () => setGaveta(false);
  const aberto = desktop ? !menuFechado : gaveta;

  return (
    <>
      <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-page/90 px-4 backdrop-blur">
        <button
          type="button"
          onClick={alternar}
          aria-controls="menu-lateral"
          aria-expanded={aberto}
          title={aberto ? "Esconder menu (Ctrl+B)" : "Mostrar menu (Ctrl+B)"}
          className="btn-ghost -ml-2 size-10 p-0"
        >
          <span className="sr-only">{aberto ? "Esconder menu" : "Mostrar menu"}</span>
          <Icone d="M4 4h16v16H4zM9 4v16" />
        </button>
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight md:hidden md:menu-fechado:flex">
          <Logo className="size-7" />
          AnalisaPsi
        </Link>
      </header>

      {gaveta && <div className="fixed inset-0 z-30 bg-ink/30 md:hidden" onClick={fechar} aria-hidden />}

      <aside
        id="menu-lateral"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-card pb-[env(safe-area-inset-bottom)] transition-[translate,visibility] duration-200 md:menu-fechado:invisible md:menu-fechado:-translate-x-full ${
          gaveta ? "" : "max-md:invisible max-md:-translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between px-4">
          <Link href="/" onClick={fechar} className="flex items-center gap-2 font-bold tracking-tight">
            <Logo className="size-7" />
            AnalisaPsi
          </Link>
          <button type="button" onClick={alternar} className="btn-ghost -mr-2 size-9 p-0" title="Esconder menu (Ctrl+B)">
            <span className="sr-only">Esconder menu</span>
            <Icone d="M15 6l-6 6 6 6" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3" aria-label="Principal">
          {ITENS.map((item) => {
            const ativo = itemAtivo(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={fechar}
                aria-current={ativo ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  ativo ? "bg-accent-soft text-accent" : "text-ink-2 hover:bg-card-2 hover:text-ink"
                }`}
              >
                <Icone d={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form action={sair} className="border-t border-line p-3">
          <button type="submit" className="btn-ghost w-full justify-start gap-3 px-3">
            <Icone d="M9 4H5v16h4M14 8l4 4-4 4M18 12H8" />
            Sair
          </button>
        </form>
      </aside>
    </>
  );
}
