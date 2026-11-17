"use client";

import { useActionState, useState } from "react";
import { entrar } from "@/lib/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(entrar, undefined);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="label">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          autoFocus
          defaultValue={state?.email}
          className="input"
          placeholder="voce@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="label">
          Senha
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={mostrarSenha ? "text" : "password"}
            autoComplete="current-password"
            required
            className="input pr-20"
          />
          <button
            type="button"
            onClick={() => setMostrarSenha((v) => !v)}
            className="absolute inset-y-0 right-2 my-auto h-8 rounded-lg px-2 text-xs font-medium text-ink-2 hover:bg-card-2"
          >
            {mostrarSenha ? "Ocultar" : "Mostrar"}
          </button>
        </div>
      </div>

      {state?.error && (
        <p role="alert" className="rounded-lg bg-ruim/10 px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full py-3">
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
