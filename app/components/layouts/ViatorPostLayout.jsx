import React from 'react'
import ViatorGenPost from '../posts/ViatorGenPost'

export default function ViatorPostLayout({ post, viatorTours = [] }) {
  // Use the new dedicated component for Viator posts
  return <ViatorGenPost post={post} viatorTours={viatorTours} city={post?.city} />
}