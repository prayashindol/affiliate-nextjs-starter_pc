import { createClient } from 'next-sanity'

export const sanityClient = createClient({
  projectId: 'ph27cqpd',
  dataset: 'production',
  apiVersion: '2023-07-01',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN, // Or your token directly (not recommended)
})

import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: 'ph27cqpd',
  dataset: 'production',
  apiVersion: '2023-07-01',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN, // Or your token directly (not recommended)
})

// Image URL builder
const builder = imageUrlBuilder(sanityClient)

export function urlFor(source) {
  return builder.image(source)
}
