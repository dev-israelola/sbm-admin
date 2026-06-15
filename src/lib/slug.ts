/** Converts arbitrary text into a URL-safe slug (mirrors the backend slugify). */
export function slugify(input: string): string {
  return (input ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/&amp;/g, "and")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

/**
 * Suggests a readable, mostly-unique SKU from a product name:
 * up to three word-prefixes + a short random suffix, e.g. "ALO-VRA-GEL-7F3K".
 * Editable by the user; the random suffix guards against collisions.
 */
export function suggestSku(name: string): string {
  const base = (name ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w.slice(0, 3))
    .join("-");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return base ? `${base}-${suffix}` : `SKU-${suffix}`;
}
