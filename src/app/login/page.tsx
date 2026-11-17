import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="size-12" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight">AnalisaPsi</h1>
          <p className="mt-1 text-sm text-ink-2">
            Registre as atividades e veja o que funciona com cada turma.
          </p>
        </div>
        <div className="card p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
