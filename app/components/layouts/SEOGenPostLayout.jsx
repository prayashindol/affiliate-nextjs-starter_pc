import React from 'react'
import SeoGenPost from '../SeoGenPost'

export default function SEOGenPostLayout({ post }) {
  // Keep using your shared renderer for the base SEO Gen layout
  return <SeoGenPost post={post} />
}