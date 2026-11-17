const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(valor: string) {
  return UUID.test(valor);
}

/** Primeiro valor não vazio de um search param. */
export function param(valor: string | string[] | undefined) {
  const v = Array.isArray(valor) ? valor[0] : valor;
  return v?.trim() || undefined;
}

/** Search param que só é aceito se for um UUID válido (ids de turma/tag). */
export function uuidParam(valor: string | string[] | undefined) {
  const v = param(valor);
  return v && isUuid(v) ? v : undefined;
}
