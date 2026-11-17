export const DIAS_SEMANA = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
] as const;

export const DIAS_SEMANA_CURTO = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Data local (do computador) no formato yyyy-mm-dd. */
export function hojeLocal(now = new Date()) {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Converte yyyy-mm-dd em Date local, sem o deslocamento de fuso que `new Date(str)` causa. */
export function parseData(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** 0 = domingo … 6 = sábado */
export function diaDaSemana(iso: string) {
  return parseData(iso).getDay();
}

export function nomeDiaSemana(iso: string) {
  return DIAS_SEMANA[diaDaSemana(iso)];
}

/** "segunda-feira, 17 de novembro" */
export function formatarDataLonga(iso: string, comAno = false) {
  return parseData(iso).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(comAno ? { year: "numeric" } : {}),
  });
}

export function adicionarDias(iso: string, dias: number) {
  const d = parseData(iso);
  d.setDate(d.getDate() + dias);
  return hojeLocal(d);
}
