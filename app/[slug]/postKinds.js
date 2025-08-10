export const CATEGORY_SLUGS = {
  SEO_GEN: 'airbnb-gen',
  VIATOR: 'airbnb-gen-viator',
};

export function isViatorByCategories(categories) {
  return Array.isArray(categories) && categories.some((c) => c?.slug?.current === CATEGORY_SLUGS.VIATOR);
}

export function isSeoGenByCategories(categories) {
  return Array.isArray(categories) && categories.some((c) => c?.slug?.current === CATEGORY_SLUGS.SEO_GEN);
}