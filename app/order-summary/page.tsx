'use client'

import { useEffect, useState } from 'react'
import { CheckCircleIcon, ArrowDownTrayIcon, LinkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import { CartItem } from '../context/CartContext'

interface OrderData {
  orderNumber: string
  customerInfo: {
    email: string
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  items: CartItem[]
  total: number
  timestamp: string
}

export default function OrderSummaryPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get order data from localStorage
    const storedOrderData = localStorage.getItem('orderData')
    if (storedOrderData) {
      setOrderData(JSON.parse(storedOrderData))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn&apos;t find your order information.</p>
          <Link 
            href="/products" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const digitalItems = orderData.items.filter(item => item.type === 'digital')
  const affiliateItems = orderData.items.filter(item => item.type === 'affiliate')
  const otherItems = orderData.items.filter(item => item.type !== 'digital' && item.type !== 'affiliate')

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Order Confirmation Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-600" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mt-2">
            Thank you for your purchase, {orderData.customerInfo.firstName}!
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Order #{orderData.orderNumber} • {new Date(orderData.timestamp).toLocaleDateString()}
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Customer Information</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{orderData.customerInfo.email}</p>
                  <p>{orderData.customerInfo.firstName} {orderData.customerInfo.lastName}</p>
                  <p>{orderData.customerInfo.address}</p>
                  <p>{orderData.customerInfo.city}, {orderData.customerInfo.state} {orderData.customerInfo.zipCode}</p>
                  <p>{orderData.customerInfo.country}</p>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Order Summary</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${orderData.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-900 pt-2 border-t">
                    <span>Total:</span>
                    <span>${orderData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Products - Download Links */}
        {digitalItems.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Digital Downloads
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Your digital products are ready for download. Links will remain active for 30 days.
              </p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {digitalItems.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">Digital Product • Quantity: {item.quantity}</p>
                      
                      {item.downloadFiles && item.downloadFiles.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Available Downloads:</p>
                          {item.downloadFiles.map((file, index) => (
                            <a
                              key={index}
                              href={file.url}
                              download={file.filename}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2 mb-2"
                            >
                              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                              {file.filename || `Download ${index + 1}`}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                          <p className="text-sm text-yellow-800">
                            Download links will be sent to your email address within 24 hours.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Affiliate Products - External Links */}
        {affiliateItems.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <LinkIcon className="h-5 w-5 mr-2" />
                Affiliate Products
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Complete your purchase by visiting the product pages below.
              </p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {affiliateItems.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">Affiliate Product • Quantity: {item.quantity}</p>
                      
                      {item.affiliateLink ? (
                        <a
                          href={item.affiliateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Complete Purchase
                        </a>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                          <p className="text-sm text-yellow-800">
                            Purchase instructions will be sent to your email address.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Products */}
        {otherItems.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {otherItems.map((item) => (
                <div key={item.id} className="p-6 flex items-center space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  
                  <div className="text-lg font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="text-center">
          <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex sm:justify-center">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Print Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}