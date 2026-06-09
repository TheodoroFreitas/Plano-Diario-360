export function makeId(prefix = "item") {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
