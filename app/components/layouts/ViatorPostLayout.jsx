import React from 'react'
import SeoGenPost from '../SeoGenPost'

export default function ViatorPostLayout({ post, viatorTours = [] }) {
  // Use the same renderer but now isolated in a Viator-specific wrapper.
  // You can evolve this independently (CTAs, widgets, etc.).
  return <SeoGenPost post={post} viatorTours={viatorTours} />
}