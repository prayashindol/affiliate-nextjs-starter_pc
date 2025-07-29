'use client'

import { useCart } from '../context/CartContext'
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { state, removeItem, updateQuantity } = useCart()

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m7.6 0L9 19H7.6M9 19c0 1.105.895 2 2 2s2-.895 2-2-.895-2-2-2-2 .895-2 2zm10 0c0 1.105.895 2 2 2s2-.895 2-2-.895-2-2-2-2 .895-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <Link 
              href="/products" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'} in your cart
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {state.items.map((item) => (
              <div key={item.id} className="p-6 flex items-center space-x-4">
                {/* Product Image */}
                <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-md overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{item.title}</h3>
                  <p className="text-sm text-gray-500 capitalize">{item.type} Product</p>
                  <p className="text-lg font-semibold text-indigo-600">${item.price.toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">${state.total.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="flex-1 px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 text-center"
              >
                Continue Shopping
              </Link>
              <Link
                href="/checkout"
                className="flex-1 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 text-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}