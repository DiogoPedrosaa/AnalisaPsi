"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { entrar } from "@/lib/actions";
import { CHAVE_LOGIN, lerPreferenciaLogin, salvarPreferenciaLogin } from "@/lib/sessao";

export function LoginForm() {
  const [state, action, pending] = useActionState(entrar, undefined);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);
  const lembrarRef = useRef<HTMLInputElement>(null);

  // Preenche com a última escolha (e o e-mail, se a pessoa pediu para lembrar). Só existe no navegador.
  useEffect(() => {
    let salvo: string | null = null;
    try {
      salvo = localStorage.getItem(CHAVE_LOGIN);
    } catch {}
    const pref = lerPreferenciaLogin(salvo);
    if (lembrarRef.current) lembrarRef.current.checked = pref.lembrar;
    if (pref.email && emailRef.current && !emailRef.current.value) {
      emailRef.current.value = pref.email;
      senhaRef.current?.focus();
    }
  }, []);

  function guardarPreferencia(e: React.FormEvent<HTMLFormElement>) {
    const dados = new FormData(e.currentTarget);
    try {
      localStorage.setItem(CHAVE_LOGIN, salvarPreferenciaLogin(dados.get("lembrar") === "on", String(dados.get("email") ?? "")));
    } catch {}
  }

  return (
    <form action={action} onSubmit={guardarPreferencia} className="space-y-4">
      <div>
        <label htmlFor="email" className="label">
          E-mail
        </label>
        <input
          ref={emailRef}
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
            ref={senhaRef}
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

      <label className="flex cursor-pointer items-center gap-3 select-none">
        <input ref={lembrarRef} type="checkbox" role="switch" name="lembrar" defaultChecked={state?.lembrar ?? true} className="peer sr-only" />
        <span
          aria-hidden
          className="relative h-6 w-10 shrink-0 rounded-full border border-line bg-card-2 transition peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40 after:absolute after:top-0.5 after:left-0.5 after:size-4.5 after:rounded-full after:bg-muted after:transition peer-checked:after:translate-x-4 peer-checked:after:bg-accent-ink"
        />
        <span className="text-sm">
          <span className="block font-medium text-ink">Lembrar de mim</span>
          <span className="block text-xs text-muted">Continua conectado ao fechar o navegador. Desligue em computador compartilhado.</span>
        </span>
      </label>

      {state?.error && (
        <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full py-3">
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
