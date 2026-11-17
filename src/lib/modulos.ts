import { quandoFoi } from "@/lib/dates";

/** Módulos do app: alimentam o menu lateral, a tela de início e a tela de login. */
export const MODULOS = [
  {
    href: "/registrar",
    label: "Registrar",
    descricao: "Anote a atividade do dia e como a turma recebeu. Leva menos de um minuto.",
    icon: "M12 5v14M5 12h14",
  },
  {
    href: "/historico",
    label: "Histórico",
    descricao: "Reveja, filtre e edite tudo o que já foi registrado.",
    icon: "M4 6h16M4 12h16M4 18h10",
  },
  {
    href: "/dashboard",
    label: "Painel",
    descricao: "Descubra o que funciona melhor por turma, por tipo de atividade e por dia.",
    icon: "M5 20V11M12 20V5M19 20v-6",
  },
  {
    href: "/turmas-e-tags",
    label: "Turmas e tags",
    descricao: "Organize suas turmas e os tipos de atividade.",
    icon: "M3 7l4-4h6l8 8-10 10-8-8V7zM8.5 8.5h.01",
  },
] as const;

/** Chave no localStorage do menu lateral; o script em `app/layout.tsx` lê a mesma chave antes da primeira pintura. */
export const CHAVE_MENU = "analisapsi:menu";

export const ICONE_INICIO = "M3 11l9-8 9 8M5 9.5V20h5v-6h4v6h5V9.5";

/** Diz se o item de menu `href` corresponde à rota atual. A edição de atividade conta como "Registrar". */
export function itemAtivo(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/registrar" && pathname.startsWith("/atividades/")) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Nome curto para a saudação: primeiro nome dos metadados do usuário ou, na falta dele,
 * a primeira parte do e-mail ("ana.souza@…" → "Ana"). Vazio se não houver nada.
 */
export function nomeDeExibicao(email?: string | null, metadados?: Record<string, unknown> | null) {
  for (const campo of ["nome", "name", "full_name"]) {
    const valor = metadados?.[campo];
    if (typeof valor === "string" && valor.trim()) return valor.trim().split(/\s+/)[0];
  }
  const local = email?.split("@")[0]?.split(/[._+\-\d]/).find(Boolean);
  if (!local) return "";
  return local.charAt(0).toLocaleUpperCase("pt-BR") + local.slice(1).toLocaleLowerCase("pt-BR");
}

export type ResumoInicio = {
  atividades: number;
  turmas: number;
  tags: number;
  /** 0–100, ou null se ainda não há atividades. */
  aderencia: number | null;
  /** yyyy-mm-dd da atividade mais recente. */
  ultimaData: string | null;
};

function plural(n: number, singular: string, pluralForma: string) {
  return `${n} ${n === 1 ? singular : pluralForma}`;
}

/** Linha de apoio de cada cartão da tela de início, com os números do usuário. */
export function detalheModulo(href: string, r: ResumoInicio, hoje: string) {
  switch (href) {
    case "/registrar":
      return r.ultimaData ? `Último registro ${quandoFoi(r.ultimaData, hoje)}` : "Nenhum registro ainda";
    case "/historico":
      return plural(r.atividades, "atividade registrada", "atividades registradas");
    case "/dashboard":
      return r.aderencia === null ? "Aparece após os primeiros registros" : `Aderência geral de ${Math.round(r.aderencia)}%`;
    case "/turmas-e-tags":
      return `${plural(r.turmas, "turma", "turmas")} · ${plural(r.tags, "tag", "tags")}`;
    default:
      return "";
  }
}
