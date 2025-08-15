/**
 * Safely derive a slug string from various tool object shapes.
 * Prevents accidental object coercion in href (e.g. /tools/[object Object]).
 */
export function toolSlug(tool: any): string {
  if (!tool) return ''
  if (typeof tool === 'string') return tool
  return (
    tool.slug?.current ||
    tool.slug ||
    tool.CleanedName ||
    tool.Name?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') ||
    tool.id ||
    ''
  )
}