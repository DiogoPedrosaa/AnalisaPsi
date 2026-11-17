import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { NavInferior, NavTopo } from "@/components/nav";
import { sair } from "@/lib/actions";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-page/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <Logo className="size-7" />
            AnalisaPsi
          </Link>
          <Suspense>
            <NavTopo />
          </Suspense>
          <form action={sair}>
            <button type="submit" className="btn-ghost px-3 py-1.5">
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-28 md:pb-12">{children}</main>

      <Suspense>
        <NavInferior />
      </Suspense>
    </>
  );
}
