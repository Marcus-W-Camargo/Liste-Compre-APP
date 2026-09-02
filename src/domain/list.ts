export function formatarEntradaDataPrevista(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function dataPrevistaValida(value: string) {
  if (!value) return true;
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
  const [dayText, monthText, yearText] = value.split('/');
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function normalizarDataPrevista(value: string) {
  const clean = value.trim();
  if (!clean || !dataPrevistaValida(clean)) return undefined;
  const [day, month, year] = clean.split('/');
  return `${year}-${month}-${day}`;
}

export function formatarDataPrevistaParaExibicao(value: string) {
  const clean = value.trim();
  if (!clean) return '';
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(clean)) return clean;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(clean);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : '';
}
