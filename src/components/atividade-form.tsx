"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useSyncExternalStore, useTransition } from "react";
import { RECEPTIVIDADE, ORDEM_RECEPTIVIDADE } from "@/components/receptividade";
import { salvarAtividade } from "@/lib/actions";
import { CATEGORIA_PADRAO, CATEGORIAS } from "@/lib/categoria";
import { hojeLocal } from "@/lib/dates";
import { MAX_TEMA, MAX_TITULO, validarFicha } from "@/lib/ficha";
import { avisoTamanho, MAX_OBSERVACAO } from "@/lib/observacao";
import { hrefDaPasta } from "@/lib/pastas";
import { rotuloDaTurma, turmaPreSelecionada } from "@/lib/turmas";
import type { Atividade, AtividadeInput, Categoria, Receptividade, Turma } from "@/lib/types";

/** Atividade já registrada com o mesmo título: o formulário reaproveita a categoria e o tema dela. */
export type Sugestao = { titulo: string; categoria: Categoria; tema: string };

type Props = {
  turmas: Turma[];
  sugestoes?: Sugestao[];
  /** Quando presente, o formulário edita essa atividade. */
  atividade?: Atividade;
  /** Para onde ir depois de salvar a edição (padrão: Histórico). */
  voltarPara?: string;
  /** Para onde vai o "Cancelar" (padrão: `voltarPara`). */
  cancelarPara?: string;
  /** Turma já marcada ao abrir (vem de "Registrar nesta turma", `?turma=`). */
  turmaInicial?: string;
};

const REACAO_PADRAO: Receptividade = "adoraram";

const semInscricao = () => () => {};

/** Data de hoje segundo o relógio do computador (vazia durante o render no servidor). */
function useHoje() {
  return useSyncExternalStore(semInscricao, () => hojeLocal(), () => "");
}

/** Campos e textos iguais à "Ficha de Registro de Campo" do Diário de Estágio (ver DESIGN.md › Ficha). */
export function AtividadeForm({
  turmas,
  sugestoes = [],
  atividade,
  voltarPara = "/historico",
  cancelarPara = voltarPara,
  turmaInicial,
}: Props) {
  const router = useRouter();
  const editando = Boolean(atividade);
  const tituloRef = useRef<HTMLInputElement>(null);
  const hoje = useHoje();

  const [turmaId, setTurmaId] = useState(atividade?.turma.id ?? turmaPreSelecionada(turmas, turmaInicial));
  const [dataEscolhida, setDataEscolhida] = useState<string | null>(atividade?.data ?? null);
  const [titulo, setTitulo] = useState(atividade?.titulo ?? "");
  const [categoria, setCategoria] = useState<Categoria>(atividade?.categoria ?? CATEGORIA_PADRAO);
  const [tema, setTema] = useState(atividade?.tema ?? "");
  const [receptividade, setReceptividade] = useState<Receptividade>(atividade?.receptividade ?? REACAO_PADRAO);
  const [descricao, setDescricao] = useState(atividade?.descricao ?? "");
  const [observacoes, setObservacoes] = useState(atividade?.observacoes ?? "");

  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<{ texto: string; turmaId: string } | null>(null);
  const [salvando, startSalvar] = useTransition();

  const data = dataEscolhida ?? hoje;

  function aoMudarTitulo(valor: string) {
    setTitulo(valor);
    // Atividade repetida: reaproveita a categoria e o tema da última vez (se o tema ainda está vazio).
    if (!tema.trim()) {
      const igual = sugestoes.find((s) => s.titulo.toLowerCase() === valor.trim().toLowerCase());
      if (igual) {
        setCategoria(igual.categoria);
        setTema(igual.tema);
      }
    }
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    const ficha: AtividadeInput = { id: atividade?.id, turmaId, titulo, data, categoria, tema, receptividade, descricao, observacoes };
    const problema = validarFicha(ficha);
    if (problema) return setErro(problema);

    startSalvar(async () => {
      const res = await salvarAtividade(ficha);
      if (!res.ok) return setErro(res.error);

      if (editando) {
        router.push(voltarPara);
        return;
      }

      const turma = turmas.find((t) => t.id === turmaId)?.nome;
      setSucesso({ texto: `“${titulo.trim()}” guardada no fichário de ${turma}.`, turmaId });
      // Mantém a turma e a data para registrar a próxima atividade mais rápido.
      setTitulo("");
      setCategoria(CATEGORIA_PADRAO);
      setTema("");
      setReceptividade(REACAO_PADRAO);
      setDescricao("");
      setObservacoes("");
      tituloRef.current?.focus();
    });
  }

  return (
    <form onSubmit={enviar} className="space-y-5" noValidate>
      {/* Linha 1: Turma e Data */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="form-turma" className="label">
            Pasta da Turma *
          </label>
          <select
            id="form-turma"
            value={turmaId}
            onChange={(e) => setTurmaId(e.target.value)}
            required
            disabled={turmas.length === 0}
            className="input font-semibold sm:text-sm"
          >
            {turmas.length === 0 && <option value="">Nenhuma turma cadastrada</option>}
            {turmas.length > 0 && !turmaId && (
              <option value="" disabled>
                Escolha a pasta da turma…
              </option>
            )}
            {turmas.map((t) => (
              <option key={t.id} value={t.id}>
                {rotuloDaTurma(t.nome)}
              </option>
            ))}
          </select>
          {turmas.length === 0 && (
            <p className="mt-1.5 text-xs text-ink-2">
              <Link href="/turmas-e-tags" className="font-bold text-cereja underline underline-offset-2">
                Cadastre uma turma
              </Link>{" "}
              para começar a registrar.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="form-data" className="label">
            Data de Aplicação *
          </label>
          <input
            id="form-data"
            type="date"
            value={data}
            onChange={(e) => setDataEscolhida(e.target.value || null)}
            required
            className="input font-semibold sm:text-sm"
          />
        </div>
      </div>

      {/* Linha 2: Título da Atividade */}
      <div>
        <label htmlFor="form-titulo" className="label">
          Título da Atividade *
        </label>
        <input
          ref={tituloRef}
          id="form-titulo"
          value={titulo}
          onChange={(e) => aoMudarTitulo(e.target.value)}
          required
          placeholder="Ex.: Mito ou Verdade: Amizades e Redes Sociais"
          list="sugestoes-atividades"
          autoComplete="off"
          maxLength={MAX_TITULO}
          className="input sm:text-sm"
        />
        <datalist id="sugestoes-atividades">
          {sugestoes.map((s) => (
            <option key={s.titulo} value={s.titulo} />
          ))}
        </datalist>
      </div>

      {/* Linha 3: Categoria e Tema Socioemocional */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="form-categoria" className="label">
            Categoria da Prática *
          </label>
          <select
            id="form-categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as Categoria)}
            required
            className="input font-semibold sm:text-sm"
          >
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="form-tema" className="label">
            Tema / Objetivo Socioemocional *
          </label>
          <input
            id="form-tema"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            required
            placeholder="Ex.: Alfabetização emocional, Ansiedade/ENEM..."
            maxLength={MAX_TEMA}
            className="input sm:text-sm"
          />
        </div>
      </div>

      {/* Linha 4: Seletor visual de engajamento */}
      <fieldset>
        <legend className="label mb-2">Reação e Engajamento dos Alunos *</legend>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {ORDEM_RECEPTIVIDADE.map((k) => {
            const r = RECEPTIVIDADE[k];
            const sel = receptividade === k;
            return (
              <label key={k} className="cursor-pointer">
                <input
                  type="radio"
                  name="engajamento"
                  value={k}
                  checked={sel}
                  onChange={() => setReceptividade(k)}
                  className="peer sr-only"
                />
                <span
                  className={`block rounded-xl border-2 p-2.5 text-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-rosa-forte ${
                    sel ? `${r.soft} ring-2 ${r.anel}` : "border-line bg-card text-ink hover:bg-card-2"
                  }`}
                >
                  <span className="mb-0.5 block text-xl leading-tight" aria-hidden>
                    {r.emoji}
                  </span>
                  <span className="block text-xs leading-tight font-extrabold">{r.label}</span>
                  <span className="block text-[10px] text-ink/75">{r.descricao}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Linha 5: Descrição Breve & Materiais */}
      <CampoTexto
        id="form-descricao"
        rotulo="Descrição Breve & Materiais Utilizados *"
        valor={descricao}
        mudar={setDescricao}
        obrigatorio
        placeholder="Como a atividade foi conduzida e quais materiais foram usados (ex.: cartolina, canetinhas, plaquinhas de mito/verdade, caixa de perguntas)..."
      />

      {/* Linha 6: Observações da Estagiária */}
      <CampoTexto
        id="form-observacoes"
        rotulo="Observações da Estagiária (O que funcionou, o que adaptar, falas marcantes)"
        valor={observacoes}
        mudar={setObservacoes}
        placeholder="Anote aqui percepções clínicas/escolares, resistências, falas espontâneas dos alunos e sugestões de melhoria..."
      />

      {erro && (
        <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {erro}
        </p>
      )}
      {sucesso && (
        <p role="status" className="rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
          ✓ {sucesso.texto}{" "}
          <Link href={hrefDaPasta(sucesso.turmaId)} className="font-semibold whitespace-nowrap underline underline-offset-2">
            Ver na pasta →
          </Link>
        </p>
      )}

      {/* Botões do formulário */}
      <div className="flex items-center justify-end gap-3 border-t border-line/15 pt-4">
        <Link href={cancelarPara} className="btn-claro">
          Cancelar
        </Link>
        <button type="submit" disabled={salvando || turmas.length === 0} className="btn-primary px-6">
          <CheckCircle2 className="size-4" aria-hidden />
          {salvando ? "Salvando…" : "Salvar no Fichário"}
        </button>
      </div>
    </form>
  );
}

/** Textarea de 3 linhas que cresce com o texto, com o contador perto do limite. */
function CampoTexto({
  id,
  rotulo,
  valor,
  mudar,
  placeholder,
  obrigatorio = false,
}: {
  id: string;
  rotulo: string;
  valor: string;
  mudar: (v: string) => void;
  placeholder: string;
  obrigatorio?: boolean;
}) {
  const aviso = avisoTamanho(valor.length);
  return (
    <div>
      <label htmlFor={id} className="label">
        {rotulo}
      </label>
      <textarea
        id={id}
        rows={3}
        value={valor}
        onChange={(e) => mudar(e.target.value)}
        required={obrigatorio}
        placeholder={placeholder}
        maxLength={MAX_OBSERVACAO}
        aria-describedby={aviso ? `${id}-tamanho` : undefined}
        className="input field-sizing-content max-h-[70vh] min-h-[5.75rem] resize-y leading-relaxed sm:text-sm"
      />
      {aviso && (
        <p id={`${id}-tamanho`} className="mt-1 text-right text-xs text-muted tabular-nums">
          {aviso}
        </p>
      )}
    </div>
  );
}
