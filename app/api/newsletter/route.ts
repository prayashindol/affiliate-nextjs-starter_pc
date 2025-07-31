import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subscribe } = await request.json()
    
    // In a real application, you would save this to your database
    // For now, we'll just return a success response
    console.log(`User ${session.user.email} ${subscribe ? 'subscribed to' : 'unsubscribed from'} newsletter`)
    
    return NextResponse.json({ 
      success: true, 
      message: subscribe ? 'Successfully subscribed to newsletter' : 'Successfully unsubscribed from newsletter'
    })
  } catch (error) {
    console.error('Newsletter API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In a real application, you would fetch this from your database
    // For now, we'll return a default state
    return NextResponse.json({ 
      subscribed: false,
      email: session.user.email
    })
  } catch (error) {
    console.error('Newsletter API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}