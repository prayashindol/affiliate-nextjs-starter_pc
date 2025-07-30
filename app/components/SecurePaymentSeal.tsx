"use client"

import { FaLock, FaShieldAlt } from 'react-icons/fa'

interface SecurePaymentSealProps {
  variant?: 'compact' | 'full'
  className?: string
}

export default function SecurePaymentSeal({ variant = 'full', className = '' }: SecurePaymentSealProps) {
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1 text-green-600 text-sm ${className}`}>
        <FaLock className="w-3 h-3" />
        <span className="font-medium">Secure Payment</span>
      </div>
    )
  }

  return (
    <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <FaShieldAlt className="w-4 h-4 text-green-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <FaLock className="w-3 h-3 text-green-600" />
            <h3 className="text-sm font-semibold text-green-800">Secure Payment</h3>
          </div>
          <p className="text-xs text-green-700">
            Your payment information is encrypted and secure. We accept all major payment methods.
          </p>
        </div>
      </div>
    </div>
  )
}