/**
 * Converte um valor recebido em uma requisição para um ID inteiro.
 * Retorna null quando o valor não representa um ID positivo válido.
 */
export function converterId(valor: unknown): number | null {
  const id =
    typeof valor === "number"
      ? valor
      : typeof valor === "string" && valor.trim() !== ""
        ? Number(valor)
        : NaN;

  if (!Number.isSafeInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

/**
 * Verifica se uma string contém algum conteúdo
 * depois de remover espaços no início e no final.
 */
export function textoObrigatorio(
  valor: unknown
): string | null {
  if (typeof valor !== "string") {
    return null;
  }

  const texto = valor.trim();
  return texto.length > 0 ? texto : null;
}

/**
 * Verifica o formato de uma data AAAA-MM-DD
 * e confirma se a data realmente existe.
 */
export function dataIsoValida(valor: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return false;
  }

  const data = new Date(`${valor}T12:00:00.000Z`);

  return (
    !Number.isNaN(data.getTime()) &&
    data.toISOString().slice(0, 10) === valor
  );
}

/**
 * Valida horários no formato de 24 horas HH:mm.
 */
export function horarioValido(valor: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(valor);
}
