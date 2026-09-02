export const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizarEmail(value: string) {
  return value.trim().toLowerCase();
}

export function emailValido(value: string) {
  const normalized = normalizarEmail(value);
  return normalized.length <= 254 && EMAIL_VALIDO.test(normalized);
}

export function nomeValido(value: string) {
  const normalized = value.normalize('NFC');
  return Array.from(normalized).length <= 21 && /^\p{L}+ \p{L}+$/u.test(normalized);
}

export function senhaValida(value: string) {
  return (
    value.length >= 6 &&
    value.length <= 128 &&
    /\d/.test(value) &&
    /[!@#$%&*/?_-]/.test(value) &&
    /[a-zA-ZÀ-ÿ]/.test(value)
  );
}
