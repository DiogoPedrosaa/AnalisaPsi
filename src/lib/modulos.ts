/**
 * Módulos do app: alimentam a navegação do cabeçalho e a vitrine do login. A tela de início (`/`) é a das
 * pastas. `principal` fica no topo do menu; `mais` vai num grupo menor abaixo, para o dia a dia
 * ter só duas telas (pastas e registrar).
 */
export const MODULOS = [
  {
    href: "/",
    label: "Pastas",
    descricao: "Uma pasta colorida para cada turma, com tudo o que já foi feito nela.",
    icon: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z",
    grupo: "principal",
  },
  {
    href: "/registrar",
    label: "Registrar",
    descricao: "Anote a atividade do dia e como a turma recebeu. Leva menos de um minuto.",
    icon: "M12 5v14M5 12h14",
    grupo: "principal",
  },
  {
    href: "/historico",
    label: "Histórico",
    descricao: "Reveja, filtre e edite tudo o que já foi registrado.",
    icon: "M4 6h16M4 12h16M4 18h10",
    grupo: "mais",
  },
  {
    href: "/dashboard",
    label: "Painel",
    descricao: "Descubra o que funciona melhor por turma, por tipo de atividade e por dia.",
    icon: "M5 20V11M12 20V5M19 20v-6",
    grupo: "mais",
  },
  {
    href: "/turmas-e-tags",
    label: "Turmas e tags",
    descricao: "Organize suas turmas e os tipos de atividade.",
    icon: "M3 7l4-4h6l8 8-10 10-8-8V7zM8.5 8.5h.01",
    grupo: "mais",
  },
] as const;

/**
 * Itens da navegação do cabeçalho. "Registrar" fica de fora porque já é o botão principal
 * (cereja) ao lado da navegação.
 */
export const MENU_TOPO = MODULOS.filter((m) => m.href !== "/registrar");

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
