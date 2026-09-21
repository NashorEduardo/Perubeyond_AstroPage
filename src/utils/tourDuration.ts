/**
 * Convierte el texto de duración de un tour ("3 Días / 2 Noches", "1/2 Day",
 * "Meio Dia", "10 Dias / 9 Noites"...) a un número de días comparable.
 * Independiente del idioma. Si no puede interpretarlo, avisa y devuelve
 * Infinity para que el tour quede al final sin romper el build.
 */
export function getDurationDays(duration: string): number {
  const text = String(duration ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

  if (/(^|\s)(1\/2|meio|medio|half)(\s|$)/.test(text)) return 0.5;

  const match = text.match(/(\d+(?:[.,]\d+)?)\s*(?:dias?|days?)/) ?? text.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) {
    console.warn(`[WARN] Could not parse duration: "${duration}"`);
    return Number.POSITIVE_INFINITY;
  }
  return parseFloat(match[1].replace(',', '.'));
}

/** Ordena de menor a mayor duración sin mutar el arreglo original (estable). */
export function sortToursByDuration<T extends { id: string; data: { duration: string } }>(tours: T[]): T[] {
  return [...tours].sort((a, b) => {
    const diff = getDurationDays(a.data.duration) - getDurationDays(b.data.duration);
    if (diff !== 0 && !Number.isNaN(diff)) return diff;
    return a.id.localeCompare(b.id);
  });
}
