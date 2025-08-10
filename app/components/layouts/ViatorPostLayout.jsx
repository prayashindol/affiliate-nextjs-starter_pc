import React from 'react'
import SeoGenPost from '../SeoGenPost'

export default function ViatorPostLayout({ post, viatorTours = [] }) {
  // The underlying SeoGenPost already supports viatorTours; keep behavior intact
  return <SeoGenPost post={post} viatorTours={viatorTours} />
}