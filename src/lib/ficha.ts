import { ehCategoria } from "@/lib/categoria";
import { MAX_OBSERVACAO } from "@/lib/observacao";
import { ehReceptividade } from "@/lib/receptividade";
import type { AtividadeInput } from "@/lib/types";

/* Regras da Ficha de Registro de Campo, iguais no formulário (navegador) e na action (servidor). */

/** Limites que batem com o banco (migrações 0001 e 0004). */
export const MAX_TITULO = 120;
export const MAX_TEMA = 200;

const fmt = (n: number) => n.toLocaleString("pt-BR");

/** Primeiro problema da ficha, na ordem dos campos na tela, ou null se estiver tudo certo. */
export function validarFicha(f: AtividadeInput): string | null {
  if (!f.turmaId) return "Escolha a pasta da turma.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f.data)) return "Escolha a data de aplicação.";
  const titulo = f.titulo.trim();
  if (!titulo) return "Dê um título para a atividade.";
  if (titulo.length > MAX_TITULO) return `O título passou de ${MAX_TITULO} caracteres.`;
  if (!ehCategoria(f.categoria)) return "Escolha a categoria da prática.";
  const tema = f.tema.trim();
  if (!tema) return "Preencha o tema / objetivo socioemocional.";
  if (tema.length > MAX_TEMA) return `O tema passou de ${MAX_TEMA} caracteres.`;
  if (!ehReceptividade(f.receptividade)) return "Marque a reação e o engajamento dos alunos.";
  const descricao = f.descricao.trim();
  if (!descricao) return "Descreva brevemente a atividade e os materiais utilizados.";
  if (descricao.length > MAX_OBSERVACAO) return `A descrição passou de ${fmt(MAX_OBSERVACAO)} caracteres.`;
  if (f.observacoes.trim().length > MAX_OBSERVACAO) return `As observações passaram de ${fmt(MAX_OBSERVACAO)} caracteres.`;
  return null;
}
