import { Suspense } from "react";
import { MenuLateral } from "@/components/nav";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-1 flex-col transition-[padding] duration-200 md:pl-64 md:menu-fechado:pl-0">
      <Suspense fallback={<div className="h-14 border-b border-line" />}>
        <MenuLateral />
      </Suspense>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-12">{children}</main>
    </div>
  );
}
