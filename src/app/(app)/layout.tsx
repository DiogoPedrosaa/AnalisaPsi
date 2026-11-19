import { Suspense } from "react";
import { MenuLateral } from "@/components/nav";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-1 flex-col transition-[padding] duration-200 md:pl-64 md:menu-fechado:pl-0">
      <Suspense fallback={<div className="babado h-14 bg-rosa" />}>
        <MenuLateral />
      </Suspense>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-9 pb-14">{children}</main>
    </div>
  );
}
