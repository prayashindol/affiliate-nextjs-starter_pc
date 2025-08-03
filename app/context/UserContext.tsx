'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

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
  // Simulate an "anonymous user" (not logged in)
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [orders, setOrders] = useState<UserOrder[]>([])
  const [favorites, setFavorites] = useState<UserFavorite[]>([])
  const [preferences, setPreferences] = useState<UserPreferences>({
    newsletter: false,
    emailNotifications: true,
    marketingEmails: false,
  })

  // Use a hardcoded guest userId for localStorage, or generate one on first use
  useEffect(() => {
    let uid = localStorage.getItem('guest_user_id')
    if (!uid) {
      uid = Date.now().toString()
      localStorage.setItem('guest_user_id', uid)
    }
    setUser({ id: uid })
  }, [])

  // Load user data from localStorage on mount
  useEffect(() => {
    if (user?.id) {
      const storedOrders = localStorage.getItem(`orders_${user.id}`)
      const storedFavorites = localStorage.getItem(`favorites_${user.id}`)
      const storedPreferences = localStorage.getItem(`preferences_${user.id}`)

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
  }, [user?.id])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`orders_${user.id}`, JSON.stringify(orders))
    }
  }, [orders, user?.id])

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites))
    }
  }, [favorites, user?.id])

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`preferences_${user.id}`, JSON.stringify(preferences))
    }
  }, [preferences, user?.id])

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
    // You can expand this for API use later
    setPreferences(prev => ({ ...prev, ...prefs }))
  }

  const deleteAccount = async () => {
    if (user?.id) {
      // Clear all user data
      localStorage.removeItem(`orders_${user.id}`)
      localStorage.removeItem(`favorites_${user.id}`)
      localStorage.removeItem(`preferences_${user.id}`)
      setOrders([])
      setFavorites([])
      setPreferences({
        newsletter: false,
        emailNotifications: true,
        marketingEmails: false,
      })
      // Optionally clear the guest_user_id and "logout" the guest user:
      // localStorage.removeItem('guest_user_id')
      // setUser(null)
    }
  }

  return (
    <UserContext.Provider
      value={{
        isAuthenticated: false, // No real user session
        user,
        orders,
        favorites,
        preferences,
        addOrder,
        addFavorite,
        removeFavorite,
        updatePreferences,
        deleteAccount,
        isLoading: false,
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
