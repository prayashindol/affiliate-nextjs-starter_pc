'use client'

import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FaCreditCard, FaPaypal } from 'react-icons/fa'
import { SiApplepay } from 'react-icons/si'
import SecurePaymentSeal from '../components/SecurePaymentSeal'

interface CheckoutForm {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentInfo {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  paymentMethod: 'card' | 'paypal' | 'apple_pay'
}

export default function CheckoutPage() {
  const { state, clearCart } = useCart()
  const router = useRouter()
  
  // Check if cart contains only digital products
//  const isDigitalOnly = state.items.length > 0 && state.items.every(item => item.type === 'digital')

  // Redirect if cart is empty
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
          <p className="text-gray-600 mb-6">Your cart is empty. Please add some items before checkout.</p>
          <Link 
            href="/products" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const [formData, setFormData] = useState<CheckoutForm>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  })
  const [paymentData, setPaymentData] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    paymentMethod: 'card'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<CheckoutForm & PaymentInfo>>({})
  const [currentStep, setCurrentStep] = useState<'info' | 'payment'>('info')

  // Check if cart contains only digital products
  const isDigitalOnly = state.items.length > 0 && state.items.every(item => item.type === 'digital')

  // Redirect if cart is empty (unless in demo mode)
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
          <p className="text-gray-600 mb-6">Your cart is empty. Please add some items before checkout.</p>
          <Link 
            href="/products" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name in paymentData) {
      setPaymentData(prev => ({ ...prev, [name]: value }))
      // Clear error when user starts typing
      if (errors[name as keyof PaymentInfo]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
      // Clear error when user starts typing
      if (errors[name as keyof CheckoutForm]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm & PaymentInfo> = {}
    
    // Always require email
    if (!formData.email) newErrors.email = 'Email is required'
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // For non-digital products, require shipping information
    if (!isDigitalOnly) {
      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.lastName) newErrors.lastName = 'Last name is required'
      if (!formData.address) newErrors.address = 'Address is required'
      if (!formData.city) newErrors.city = 'City is required'
      if (!formData.state) newErrors.state = 'State is required'
      if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required'
      if (!formData.country) newErrors.country = 'Country is required'
    }

    // Payment validation
    if (currentStep === 'payment') {
      if (paymentData.paymentMethod === 'card') {
        if (!paymentData.cardNumber) newErrors.cardNumber = 'Card number is required'
        if (!paymentData.expiryDate) newErrors.expiryDate = 'Expiry date is required'
        if (!paymentData.cvv) newErrors.cvv = 'CVV is required'
        if (!paymentData.cardholderName) newErrors.cardholderName = 'Cardholder name is required'
        
        // Basic card number validation (remove spaces and check if it's 16 digits)
        const cardNum = paymentData.cardNumber.replace(/\s/g, '')
        if (cardNum && !/^\d{16}$/.test(cardNum)) {
          newErrors.cardNumber = 'Please enter a valid 16-digit card number'
        }
        
        // CVV validation
        if (paymentData.cvv && !/^\d{3,4}$/.test(paymentData.cvv)) {
          newErrors.cvv = 'Please enter a valid 3 or 4-digit CVV'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    if (currentStep === 'info') {
      setCurrentStep('payment')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Store order data for confirmation page
      const orderData = {
        orderNumber: Math.random().toString(36).substr(2, 9).toUpperCase(),
        customerInfo: isDigitalOnly ? { 
          email: formData.email,
          firstName: '',
          lastName: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        } : formData,
        paymentInfo: {
          method: paymentData.paymentMethod,
          last4: paymentData.paymentMethod === 'card' ? paymentData.cardNumber.slice(-4) : '',
        },
        items: state.items,
        total: state.total,
        timestamp: new Date().toISOString(),
        isDigitalOnly
      }
      
      // Store in localStorage for the confirmation page
      localStorage.setItem('orderData', JSON.stringify(orderData))
      
      // Clear cart
      clearCart()
      
      // Redirect to order summary
      router.push('/order-summary')
      
    } catch (error) {
      console.error('Order submission failed:', error)
      alert('Order submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToInfo = () => {
    setCurrentStep('info')
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentStep === 'info' ? (isDigitalOnly ? 'Customer Email' : 'Customer Information') : 'Payment Information'}
              </h2>
              {currentStep === 'payment' && (
                <button
                  type="button"
                  onClick={handleBackToInfo}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  ← Back to Info
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentStep === 'info' && (
                <>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {!isDigitalOnly && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name *
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              errors.firstName ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                        </div>

                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              errors.lastName ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Address *
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            errors.address ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              errors.city ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                        </div>

                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              errors.state ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
                        </div>

                        <div>
                          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              errors.zipCode ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                          Country *
                        </label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            errors.country ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country}</p>}
                      </div>
                    </>
                  )}
                </>
              )}

              {currentStep === 'payment' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: 'card' }))}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border text-sm font-medium ${
                          paymentData.paymentMethod === 'card'
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <FaCreditCard className="w-4 h-4" />
                        Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: 'paypal' }))}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border text-sm font-medium ${
                          paymentData.paymentMethod === 'paypal'
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <FaPaypal className="w-4 h-4 text-blue-600" />
                        PayPal
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: 'apple_pay' }))}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border text-sm font-medium ${
                          paymentData.paymentMethod === 'apple_pay'
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <SiApplepay className="w-4 h-4 text-black" />
                        Apple Pay
                      </button>
                    </div>
                  </div>

                  {paymentData.paymentMethod === 'card' && (
                    <>
                      <div>
                        <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          id="cardholderName"
                          name="cardholderName"
                          value={paymentData.cardholderName}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            errors.cardholderName ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors.cardholderName && <p className="text-red-600 text-sm mt-1">{errors.cardholderName}</p>}
                      </div>

                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={paymentData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors.cardNumber && <p className="text-red-600 text-sm mt-1">{errors.cardNumber}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={paymentData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {errors.expiryDate && <p className="text-red-600 text-sm mt-1">{errors.expiryDate}</p>}
                        </div>

                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV *
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={paymentData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              errors.cvv ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {errors.cvv && <p className="text-red-600 text-sm mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                    </>
                  )}

                  {paymentData.paymentMethod === 'paypal' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <p className="text-sm text-yellow-800">
                        You will be redirected to PayPal to complete your payment.
                      </p>
                    </div>
                  )}

                  {paymentData.paymentMethod === 'apple_pay' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <p className="text-sm text-blue-800">
                        You will use Apple Pay to complete your payment securely.
                      </p>
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isSubmitting 
                  ? 'Processing...' 
                  : currentStep === 'info' 
                    ? 'Continue to Payment' 
                    : 'Complete Order'
                }
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            {isDigitalOnly && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  📱 Digital products only - No shipping address required!
                </p>
              </div>
            )}
            
            <div className="space-y-4 mb-6">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {item.type === 'digital' && '📱 Digital'} 
                      {item.type === 'affiliate' && '🔗 Affiliate'} 
                      {item.type === 'dropship' && '📦 Dropship'} 
                      • Qty: {item.quantity}
                    </p>
                  </div>
                  
                  <div className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm text-gray-900">${state.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Tax</span>
                <span className="text-sm text-gray-900">$0.00</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-semibold text-gray-900">${state.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> This is a demo checkout. No actual payment will be processed.
              </p>
            </div>

            {/* Secure Payment Seal */}
            <div className="mt-4">
              <SecurePaymentSeal />
            </div>

            {/* Progress Indicator */}
            <div className="mt-6">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep === 'info' ? 'bg-indigo-600 text-white' : 'bg-green-600 text-white'
                }`}>
                  {currentStep === 'payment' ? '✓' : '1'}
                </div>
                <div className="flex-1 ml-4">
                  <div className={`h-1 rounded ${currentStep === 'payment' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                </div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep === 'payment' ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {isDigitalOnly ? 'Email' : 'Info'}
                </span>
                <span className="text-xs text-gray-500">Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}