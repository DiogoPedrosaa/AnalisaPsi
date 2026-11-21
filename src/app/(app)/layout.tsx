import { Cabecalho, Rodape } from "@/components/cabecalho";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Cabecalho />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-10 pb-16 sm:px-8">{children}</main>
      <Rodape />
    </>
  );
}
