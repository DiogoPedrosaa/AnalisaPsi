import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <div className="card mx-auto max-w-md px-6 py-10 text-center">
      <h1 className="titulo-secao">Não encontramos essa página</h1>
      <p className="mt-1 text-sm text-ink-2">Ela pode ter sido apagada.</p>
      <Link href="/" className="btn-primary mt-5">
        Voltar ao início
      </Link>
    </div>
  );
}
