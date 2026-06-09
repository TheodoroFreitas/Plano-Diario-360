export function toISODate(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return [
    local.getFullYear(),
    String(local.getMonth() + 1).padStart(2, "0"),
    String(local.getDate()).padStart(2, "0"),
  ].join("-");
}

export function parseISODate(dateIso) {
  const [year, month, day] = dateIso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateBR(dateIso, options = {}) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  }).format(parseISODate(dateIso));
}

export function formatLongDate(dateIso) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parseISODate(dateIso));
}

export function monthBounds(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start: toISODate(start), end: toISODate(end) };
}
