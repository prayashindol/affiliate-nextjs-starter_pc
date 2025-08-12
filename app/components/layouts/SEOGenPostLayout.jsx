import React from 'react'
import AirbnbGenPost from '../posts/AirbnbGenPost'

export default function SEOGenPostLayout({ post }) {
  // Use the new dedicated component for regular airbnb-gen posts
  return <AirbnbGenPost post={post} />
}