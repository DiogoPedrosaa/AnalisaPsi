"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useState, useSyncExternalStore } from "react";
import { Icone } from "@/components/icone";
import { Brilho } from "@/components/enfeites";
import { Marca } from "@/components/logo";
import { sair } from "@/lib/actions";
import { CHAVE_MENU, itemAtivo, MODULOS } from "@/lib/modulos";

const PRINCIPAIS = MODULOS.filter((m) => m.grupo === "principal");
const MAIS = MODULOS.filter((m) => m.grupo === "mais");

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
      <header className="babado sticky top-0 z-20 flex h-14 items-center gap-3 bg-rosa px-4 text-ink">
        <button
          type="button"
          onClick={alternar}
          aria-controls="menu-lateral"
          aria-expanded={aberto}
          title={aberto ? "Esconder menu (Ctrl+B)" : "Mostrar menu (Ctrl+B)"}
          className="btn-ghost -ml-2 size-10 p-0 text-ink hover:bg-rosa-claro"
        >
          <span className="sr-only">{aberto ? "Esconder menu" : "Mostrar menu"}</span>
          <Icone d="M4 4h16v16H4zM9 4v16" />
        </button>
        <Link href="/" className="md:hidden md:menu-fechado:block">
          <Marca tamanho="text-2xl" logo="size-7" />
        </Link>
      </header>

      {gaveta && <div className="fixed inset-0 z-30 bg-ink/30 md:hidden" onClick={fechar} aria-hidden />}

      <aside
        id="menu-lateral"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r-2 border-line bg-card pb-[env(safe-area-inset-bottom)] transition-[translate,visibility] duration-200 md:menu-fechado:invisible md:menu-fechado:-translate-x-full ${
          gaveta ? "" : "max-md:invisible max-md:-translate-x-full"
        }`}
      >
        <div className="babado z-10 flex h-14 shrink-0 items-center justify-between bg-rosa px-4">
          <Link href="/" onClick={fechar}>
            <Marca tamanho="text-2xl" logo="size-7" />
          </Link>
          <button type="button" onClick={alternar} className="btn-ghost -mr-2 size-9 p-0 text-ink hover:bg-rosa-claro" title="Esconder menu (Ctrl+B)">
            <span className="sr-only">Esconder menu</span>
            <Icone d="M15 6l-6 6 6 6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pt-6 pb-3" aria-label="Principal">
          <div className="space-y-1">
            {PRINCIPAIS.map((item) => (
              <ItemMenu key={item.href} item={item} ativo={itemAtivo(pathname, item.href)} onClick={fechar} />
            ))}
          </div>
          <p className="rotulo mt-6 mb-1 px-3 text-muted">Mais</p>
          <div className="space-y-0.5">
            {MAIS.map((item) => (
              <ItemMenu key={item.href} item={item} ativo={itemAtivo(pathname, item.href)} onClick={fechar} pequeno />
            ))}
          </div>
        </nav>

        {/* Recorte da estampa com recadinho, só de enfeite */}
        <div className="relative mx-4 mb-4 hidden h-24 rotate-[-2deg] rounded-xl border-4 border-card shadow-[3px_3px_0_0_var(--line)] estampa-estrelas [@media(min-height:640px)]:block" aria-hidden>
          <span className="fita -top-3 left-1/2 w-16 -translate-x-1/2 rotate-[4deg]" />
          <span className="absolute -right-2 -bottom-3 rotate-[-6deg] rounded-md border-2 border-cereja bg-card px-2 py-0.5 font-script text-lg leading-tight text-cereja">
            seu caderno ♥
          </span>
        </div>

        <div className="faixa-xadrez h-3" aria-hidden />
        <form action={sair} className="p-3">
          <button type="submit" className="btn-ghost w-full justify-start gap-3 px-3">
            <Icone d="M9 4H5v16h4M14 8l4 4-4 4M18 12H8" />
            Sair
          </button>
        </form>
      </aside>
    </>
  );
}

/** Item do menu; os do grupo "Mais" são menores e mais discretos. */
function ItemMenu({
  item,
  ativo,
  onClick,
  pequeno = false,
}: {
  item: (typeof MODULOS)[number];
  ativo: boolean;
  onClick: () => void;
  pequeno?: boolean;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={ativo ? "page" : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 font-bold tracking-[0.14em] uppercase transition ${
        pequeno ? "py-2 text-[11px]" : "py-2.5 text-xs"
      } ${ativo ? "bg-accent-soft text-accent" : "text-ink-2 hover:bg-card-2 hover:text-ink"}`}
    >
      <Icone d={item.icon} className={pequeno ? "size-4" : "size-5"} />
      {item.label}
      {ativo && <Brilho className="ml-auto size-3.5 text-cereja" />}
    </Link>
  );
}
