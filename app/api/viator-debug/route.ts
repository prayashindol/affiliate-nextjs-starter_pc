export const runtime = 'nodejs';

import { sanityClient } from '@/lib/sanity';
import { getViatorDestinationId, fetchViatorTours } from '@/lib/viator';

type ViatorOk = {
  products: any[];
  apiStatus: string;
  apiError: any;
  destinationId?: string | null;
  rawMeta?: { tried?: string[] };
};
type ViatorErr = { apiStatus: string; apiError: any; products: never[] };

function isViatorOk(x: any): x is ViatorOk {
  return x && typeof x === 'object' && 'products' in x;
}

async function getSeoGenPost(slug: string) {
  const query = `*[_type in ["seoGenPost","seoGenPostViator"] && slug.current == $slug][0]{
    _id,_type,title,slug,city,postType,category,
    categories[]->{title, slug}
  }`;
  return sanityClient.fetch(query, { slug });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug') || '';
  if (!slug) {
    return new Response(JSON.stringify({ error: 'missing ?slug=' }), { status: 400 });
  }

  const post = await getSeoGenPost(slug);
  if (!post) {
    return new Response(JSON.stringify({ slug, exists: false }), {
      headers: { 'content-type': 'application/json' },
      status: 200,
    });
  }

  const cats = Array.isArray(post?.categories)
    ? post.categories.map((c: any) => c?.slug?.current || c?.slug)
    : [];

  const viatorByStringCategory =
    Array.isArray(post?.category) && post.category.includes('airbnb-gen-viator');

  const isViatorByCategories = cats.includes('airbnb-gen-viator');

  const viator =
    post?._type === 'seoGenPostViator' || isViatorByCategories || viatorByStringCategory;

  const dest = post?.city ? getViatorDestinationId(post.city) : null;

  let viatorMeta: any = null;
  let count = 0;

  if (viator && post?.city) {
    const res = (await fetchViatorTours({ city: post.city, count: 6 }).catch((e: any) => ({
      apiStatus: 'exception',
      apiError: e?.message || String(e),
      products: [],
    }))) as ViatorOk | ViatorErr;

    // ✅ Type-safe access using the guard
    if (isViatorOk(res)) {
      viatorMeta = {
        apiStatus: res.apiStatus,
        apiError: res.apiError,
        destinationId: res.destinationId ?? null,
        tried: res.rawMeta?.tried ?? [],
      };
      count = Array.isArray(res.products) ? res.products.length : 0;
    } else {
      viatorMeta = {
        apiStatus: res.apiStatus,
        apiError: res.apiError,
        destinationId: dest,
        tried: [],
      };
      count = 0;
    }
  }

  return new Response(
    JSON.stringify(
      {
        slug,
        exists: true,
        city: post.city ?? null,
        type: post._type,
        categories: cats,
        categoryStringArray: post.category ?? null,
        viatorFlag: viator,
        destinationId: dest,
        viatorMeta,
        productCount: count,
      },
      null,
      2,
    ),
    { headers: { 'content-type': 'application/json' } },
  );
}
