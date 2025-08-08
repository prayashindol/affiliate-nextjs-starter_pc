'use client'

import { useSession } from 'next-auth/react'

export default function TestSessionPage() {
  console.log('TestSessionPage rendering...')
  
  const sessionResult = useSession()
  console.log('useSession result:', sessionResult)
  
  // Safe destructuring to avoid the error
  if (!sessionResult) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Session Test - ERROR</h1>
        <p className="text-red-600">useSession() returned undefined!</p>
        <p>This indicates that the SessionProvider is not properly configured.</p>
      </div>
    )
  }
  
  const { data: session, status } = sessionResult
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Test</h1>
      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {status}
        </div>
        <div>
          <strong>Session Data:</strong>
          <pre className="bg-gray-100 p-4 rounded mt-2">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        <div>
          <strong>useSession result type:</strong> {typeof sessionResult}
        </div>
      </div>
    </div>
  )
}