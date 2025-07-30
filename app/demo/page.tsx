'use client'

import { useCart } from '../context/CartContext'
import { useRouter } from 'next/navigation'

export default function DemoPage() {
  const { addItem, state } = useCart()
  const router = useRouter()

  const addDigitalProduct = () => {
    addItem({
      id: 'digital-1',
      title: 'Digital Marketing E-book',
      price: 29.99,
      type: 'digital',
      image: '/placeholder.jpg',
      downloadFiles: [
        { url: '/demo-ebook.pdf', filename: 'marketing-ebook.pdf' }
      ]
    })
  }

  const addPhysicalProduct = () => {
    addItem({
      id: 'physical-1',
      title: 'Airbnb Starter Kit',
      price: 49.99,
      type: 'dropship',
      image: '/placeholder.jpg'
    })
  }

  const addAnotherDigitalProduct = () => {
    addItem({
      id: 'digital-2',
      title: 'SEO Tools Bundle',
      price: 19.99,
      type: 'digital',
      image: '/placeholder.jpg',
      downloadFiles: [
        { url: '/seo-tools.zip', filename: 'seo-tools-bundle.zip' }
      ]
    })
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Demo Products</h1>
        <p className="text-gray-600 mb-8">Add some demo products to test the checkout functionality.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Marketing E-book</h3>
            <p className="text-sm text-gray-600 mb-4">📱 Digital Product - $29.99</p>
            <button
              onClick={addDigitalProduct}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add to Cart
            </button>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">SEO Tools Bundle</h3>
            <p className="text-sm text-gray-600 mb-4">📱 Digital Product - $19.99</p>
            <button
              onClick={addAnotherDigitalProduct}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add to Cart
            </button>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Airbnb Starter Kit</h3>
            <p className="text-sm text-gray-600 mb-4">📦 Physical Product - $49.99</p>
            <button
              onClick={addPhysicalProduct}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add to Cart
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cart Status</h2>
          <p className="text-gray-600 mb-2">Items in cart: {state.itemCount}</p>
          <p className="text-gray-600 mb-4">Total: ${state.total.toFixed(2)}</p>
          
          {state.items.length > 0 && (
            <div className="space-y-2 mb-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span>{item.title} ({item.type})</span>
                  <span>Qty: {item.quantity} • ${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/cart')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              View Cart
            </button>
            <button
              onClick={() => router.push('/checkout')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              disabled={state.items.length === 0}
            >
              Go to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}