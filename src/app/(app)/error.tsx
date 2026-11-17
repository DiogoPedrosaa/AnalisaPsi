"use client";

export default function Erro({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="card mx-auto max-w-md px-6 py-10 text-center">
      <p className="text-3xl" aria-hidden>
        😕
      </p>
      <h1 className="mt-3 text-lg font-semibold">Algo deu errado</h1>
      <p className="mt-1 text-sm text-ink-2">Verifique sua conexão e tente de novo.</p>
      <button type="button" onClick={reset} className="btn-primary mt-5">
        Tentar de novo
      </button>
    </div>
  );
}
