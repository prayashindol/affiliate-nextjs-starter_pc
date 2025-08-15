/**
 * Safely derive a URL-friendly slug string from various tool object shapes.
 * Prevents accidental object coercion (e.g. /tools/[object Object]) when constructing hrefs.
 *
 * Order of precedence:
 * 1. string input itself
 * 2. tool.slug.current
 * 3. tool.slug
 * 4. tool.CleanedName
 * 5. tool.Name (normalized)
 * 6. tool.id
 * Returns '' if nothing usable is found.
 */
export function toolSlug(tool: any): string {
  if (!tool) return '';
  if (typeof tool === 'string') return normalize(tool);
  const candidate =
    tool?.slug?.current ||
    tool?.slug ||
    tool?.CleanedName ||
    tool?.Name ||
    tool?.id ||
    '';
  return normalize(String(candidate));
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}