// app/api/viator-probe/route.ts
import { NextRequest } from 'next/server'
import { sanityClient } from '@/lib/sanity'
import { getViatorDestinationId } from '@/lib/viator'

// --- keep these two helpers in sync with lib/viator.js if you’ve customized them
function stripDiacritics(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
function normalizeCity(raw?: string) {
  if (!raw) return ''
  return stripDiacritics(
    String(raw)
      .toLowerCase()
      .trim()
      .replace(/[\u00a0\u2000-\u200b\u202f]/g, ' ') // normalize unicode spaces
      .replace(/[-_]+/g, ' ')
      .replace(/[.,()/]/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;|</g, '<')
      .replace(/&gt;|>/g, '>')
      .replace(/&quot;|"/g, '"')
      .replace(/&#39;|’|‘|'/g, "'")
      .replace(/\s+/g, ' ')
  )
}
function variantsFor(norm: string) {
  const v = new Set<string>()
  v.add(norm)
  if (norm.startsWith('the ')) v.add(norm.replace(/^the\s+/, ''))
  if (norm.includes(' & ')) v.add(norm.replace(/ & /g, ' and '))
  if (norm.includes(' and ')) v.add(norm.replace(/ and /g, ' & '))
  if (norm.includes(' ')) v.add(norm.replace(/\s+/g, '-'))
  if (norm.includes('-')) v.add(norm.replace(/-+/g, ' '))
  v.add(norm.replace(/\bcity\b/g, '').replace(/\s+/g, ' ').trim())
  // extra fallbacks
  if (norm.includes(',')) variantsFor(norm.split(',')[0].trim()).forEach(v.add, v)
  if (/\(.*\)/.test(norm)) variantsFor(norm.replace(/\(.*?\)/g, '').trim()).forEach(v.add, v)
  const firstWord = norm.split(/\s+/)[0]
  if (firstWord) variantsFor(firstWord).forEach(v.add, v)
  return Array.from(v)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  let city = searchParams.get('city') || ''
  const slug = searchParams.get('slug')

  let from = 'query'
  if (!city && slug) {
    from = 'sanity'
    const q = `*[_type in ["seoGenPost","seoGenPostViator"] && slug.current==$slug][0]{city, _type, slug, title}`
    const doc = await sanityClient.fetch(q, { slug })
    city = doc?.city || ''
  }

  const raw = city
  const norm = normalizeCity(raw)
  const candidates = variantsFor(norm)
  const dest = getViatorDestinationId(raw)
  const codepoints = Array.from(raw || '').map(c => c.charCodeAt(0))

  return new Response(
    JSON.stringify(
      { from, raw, codepoints, normalized: norm, candidates, destinationId: dest },
      null,
      2
    ),
    { headers: { 'content-type': 'application/json' } }
  )
}
