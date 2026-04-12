/**
 * Normalize a product size string so that dimensionally-equivalent sizes
 * collapse to the same canonical form.
 *
 * Examples:
 *   "240×330"        -> "240×330"
 *   "330×240"        -> "240×330"
 *   "240x330"        -> "240×330"
 *   "240*330"        -> "240×330"
 *   "240 × 330"      -> "240×330"
 *   "160×160 (עגול)" -> "160×160 (עגול)"
 *
 * Non-dimension sizes are returned trimmed but otherwise unchanged.
 */
export function normalizeSize(size: string | null | undefined): string {
  if (!size) return '';
  const trimmed = String(size).trim();

  // Match a leading "N<sep>N" pattern where sep is ×, x, X, or *,
  // optionally surrounded by whitespace. Capture any suffix (e.g. "(עגול)").
  const match = trimmed.match(/^(\d+)\s*[×xX*]\s*(\d+)(.*)$/);
  if (!match) return trimmed;

  const a = parseInt(match[1], 10);
  const b = parseInt(match[2], 10);
  const suffix = (match[3] || '').trim();
  const smaller = Math.min(a, b);
  const larger = Math.max(a, b);
  const base = `${smaller}×${larger}`;
  return suffix ? `${base} ${suffix}` : base;
}

/**
 * Compare two sizes as physically equivalent (order-insensitive).
 */
export function sizesEqual(
  a: string | null | undefined,
  b: string | null | undefined,
): boolean {
  return normalizeSize(a) === normalizeSize(b);
}
