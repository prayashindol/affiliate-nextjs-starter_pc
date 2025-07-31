'use client'

import { useState } from 'react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useUser } from '../context/UserContext'
import { useSession } from 'next-auth/react'

interface FavoriteButtonProps {
  item: {
    id: string
    title: string
    type: 'tool' | 'post' | 'product'
    url: string
  }
  className?: string
}

export default function FavoriteButton({ item, className = '' }: FavoriteButtonProps) {
  const { data: session } = useSession()
  const { favorites, addFavorite, removeFavorite } = useUser()
  const [isAnimating, setIsAnimating] = useState(false)

  const isFavorited = favorites.some(fav => fav.itemId === item.id)

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session?.user) {
      // Redirect to login if not authenticated
      window.location.href = '/login'
      return
    }

    setIsAnimating(true)
    
    try {
      if (isFavorited) {
        removeFavorite(item.id)
      } else {
        addFavorite({
          itemId: item.id,
          type: item.type,
          title: item.title,
          url: item.url,
        })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }

    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <button
      onClick={handleToggleFavorite}
      className={`group relative p-2 rounded-full transition-all duration-200 hover:bg-gray-100 ${className} ${
        isAnimating ? 'scale-110' : ''
      }`}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorited ? (
        <HeartIconSolid className="h-5 w-5 text-red-500 transition-transform group-hover:scale-110" />
      ) : (
        <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" />
      )}
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {session?.user ? (
          isFavorited ? 'Remove from favorites' : 'Add to favorites'
        ) : (
          'Sign in to save favorites'
        )}
      </div>
    </button>
  )
}