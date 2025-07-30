'use client'

import { useCart, CartItem } from '../context/CartContext'
import { useState } from 'react'

interface AddToCartProps {
  product: {
    id: string
    title: string
    price: number
    type: 'digital' | 'affiliate' | 'dropship'
    image?: string
    downloadFiles?: Array<{ url: string; filename: string }>
    affiliateLink?: string
  }
  className?: string
}

export default function AddToCart({ product, className = '' }: AddToCartProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    
    const cartItem: Omit<CartItem, 'quantity'> = {
      id: product.id,
      title: product.title,
      price: product.price,
      type: product.type,
      image: product.image,
      downloadFiles: product.downloadFiles,
      affiliateLink: product.affiliateLink
    }

    addItem(cartItem)
    
    setIsAdding(false)
    setShowSuccess(true)
    
    // Hide success message after 2 seconds
    setTimeout(() => setShowSuccess(false), 2000)
  }

  if (showSuccess) {
    return (
      <button 
        disabled 
        className={`px-6 py-3 bg-green-600 text-white rounded-lg font-semibold ${className}`}
      >
        ✓ Added to Cart
      </button>
    )
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-semibold transition-colors duration-200 ${className}`}
    >
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}