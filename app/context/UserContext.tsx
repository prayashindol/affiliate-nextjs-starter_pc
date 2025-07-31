'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

export interface UserOrder {
  id: string
  date: string
  items: Array<{
    id: string
    title: string
    price: number
    quantity: number
  }>
  total: number
  status: 'completed' | 'pending' | 'cancelled'
}

export interface UserFavorite {
  id: string
  itemId: string // Original item ID for identification
  type: 'tool' | 'post' | 'product'
  title: string
  url: string
  dateAdded: string
}

export interface UserPreferences {
  newsletter: boolean
  emailNotifications: boolean
  marketingEmails: boolean
}

interface UserContextType {
  isAuthenticated: boolean
  user: { id: string; name?: string | null; email?: string | null; image?: string | null } | null
  orders: UserOrder[]
  favorites: UserFavorite[]
  preferences: UserPreferences
  addOrder: (order: Omit<UserOrder, 'id' | 'date'>) => void
  addFavorite: (favorite: Omit<UserFavorite, 'id' | 'dateAdded'>) => void
  removeFavorite: (id: string) => void
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>
  deleteAccount: () => Promise<void>
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<UserOrder[]>([])
  const [favorites, setFavorites] = useState<UserFavorite[]>([])
  const [preferences, setPreferences] = useState<UserPreferences>({
    newsletter: false,
    emailNotifications: true,
    marketingEmails: false,
  })

  // Load user data from localStorage on mount
  useEffect(() => {
    if (session?.user?.id) {
      const userId = session.user.id
      const storedOrders = localStorage.getItem(`orders_${userId}`)
      const storedFavorites = localStorage.getItem(`favorites_${userId}`)
      const storedPreferences = localStorage.getItem(`preferences_${userId}`)

      if (storedOrders) {
        setOrders(JSON.parse(storedOrders))
      }
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      }
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences))
      }
    }
  }, [session?.user?.id])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (session?.user?.id) {
      const userId = session.user.id
      localStorage.setItem(`orders_${userId}`, JSON.stringify(orders))
    }
  }, [orders, session?.user?.id])

  useEffect(() => {
    if (session?.user?.id) {
      const userId = session.user.id
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites))
    }
  }, [favorites, session?.user?.id])

  useEffect(() => {
    if (session?.user?.id) {
      const userId = session.user.id
      localStorage.setItem(`preferences_${userId}`, JSON.stringify(preferences))
    }
  }, [preferences, session?.user?.id])

  const addOrder = (orderData: Omit<UserOrder, 'id' | 'date'>) => {
    const newOrder: UserOrder = {
      ...orderData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }
    setOrders(prev => [newOrder, ...prev])
  }

  const addFavorite = (favoriteData: Omit<UserFavorite, 'id' | 'dateAdded'>) => {
    const newFavorite: UserFavorite = {
      ...favoriteData,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString(),
    }
    setFavorites(prev => [newFavorite, ...prev])
  }

  const removeFavorite = (itemId: string) => {
    setFavorites(prev => prev.filter(fav => fav.itemId !== itemId))
  }

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences: { ...preferences, ...prefs } }),
      })

      if (response.ok) {
        setPreferences(prev => ({ ...prev, ...prefs }))
      } else {
        console.error('Failed to update preferences')
      }
    } catch (error) {
      console.error('Error updating preferences:', error)
      // Fallback to local update
      setPreferences(prev => ({ ...prev, ...prefs }))
    }
  }

  const deleteAccount = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'DELETE',
      })

      if (response.ok) {
        if (session?.user?.id) {
          const userId = session.user.id
          // Clear all user data
          localStorage.removeItem(`orders_${userId}`)
          localStorage.removeItem(`favorites_${userId}`)
          localStorage.removeItem(`preferences_${userId}`)
          
          // Reset state
          setOrders([])
          setFavorites([])
          setPreferences({
            newsletter: false,
            emailNotifications: true,
            marketingEmails: false,
          })
        }
        
        // Sign out the user
        const { signOut } = await import('next-auth/react')
        await signOut({ callbackUrl: '/' })
      } else {
        throw new Error('Failed to delete account')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      throw error
    }
  }

  return (
    <UserContext.Provider
      value={{
        isAuthenticated: !!session?.user,
        user: session?.user || null,
        orders,
        favorites,
        preferences,
        addOrder,
        addFavorite,
        removeFavorite,
        updatePreferences,
        deleteAccount,
        isLoading: status === 'loading',
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}