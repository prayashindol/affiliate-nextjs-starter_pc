export const CATEGORY_SLUGS = {
  SEO_GEN: 'airbnb-gen',
  VIATOR: 'airbnb-gen-viator',
};

export function isViatorByCategories(categories) {
  if (!Array.isArray(categories)) return false;
  // Prefer slug-based detection
  const hasSlugMatch = categories.some((c) => c?.slug?.current === CATEGORY_SLUGS.VIATOR);
  if (hasSlugMatch) return true;
  // Fallback to title-based detection (legacy)
  return categories.some((c) => c?.title === 'SEO Gen Post (Viator)');
}

export function isSeoGenByCategories(categories) {
  if (!Array.isArray(categories)) return false;
  const hasSlugMatch = categories.some((c) => c?.slug?.current === CATEGORY_SLUGS.SEO_GEN);
  if (hasSlugMatch) return true;
  return categories.some((c) => c?.title === 'SEO Gen Post');
}