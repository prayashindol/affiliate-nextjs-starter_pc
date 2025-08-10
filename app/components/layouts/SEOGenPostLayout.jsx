import React from 'react'
import SeoGenPost from '../SeoGenPost'

export default function SEOGenPostLayout({ post }) {
  return <SeoGenPost post={post} isViatorPost={false} city={post?.city} />
}