/** Reação dos alunos à atividade (ver lib/receptividade.ts). */
export type Receptividade = "adoraram" | "gostaram" | "neutro" | "nao_curtiram";

/** Categoria da Prática (ver lib/categoria.ts). */
export type Categoria = "roda_conversa" | "manual_artistica" | "dinamica_jogo" | "oficina_debate" | "outro";

export type Turma = { id: string; nome: string };

/** Uma ficha de registro de campo. */
export type Atividade = {
  id: string;
  titulo: string;
  /** yyyy-mm-dd (Data de Aplicação) */
  data: string;
  categoria: Categoria;
  /** Tema / Objetivo Socioemocional (vazio em atividades antigas). */
  tema: string;
  receptividade: Receptividade;
  /** Descrição Breve & Materiais Utilizados. */
  descricao: string | null;
  /** Observações da Estagiária (o que funcionou, o que adaptar, falas marcantes). */
  observacoes: string | null;
  turma: Turma;
};

export type AtividadeInput = {
  id?: string;
  turmaId: string;
  titulo: string;
  data: string;
  categoria: Categoria;
  tema: string;
  receptividade: Receptividade;
  descricao: string;
  observacoes: string;
};

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };
