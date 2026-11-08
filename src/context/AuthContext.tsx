import React, { createContext, useContext, useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { AuthUser } from '@/types/database'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isOwner: boolean
  login: (email: string, pass: string) => Promise<void>
  register: (name: string, email: string, pass: string) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  requestVerification: (email: string) => Promise<void>
  logout: () => void
  refreshUser: () => void
}

const OWNER_EMAIL = 'mqsantos@gmail.com'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const syncUser = () => {
    if (pb.authStore.isValid && pb.authStore.record) {
      const rec = pb.authStore.record
      setUser({
        id: rec.id,
        email: rec.email || '',
        name: rec.name || rec.email?.split('@')[0] || 'Usuário',
        avatar: rec.avatar ? pb.files.getUrl(rec, rec.avatar) : undefined,
        verified: rec.verified ?? false,
        created: rec.created || '',
      })
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    syncUser()
    setLoading(false)

    const unsubscribe = pb.authStore.onChange(() => {
      syncUser()
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const login = async (email: string, pass: string) => {
    await pb.collection('users').authWithPassword(email.trim(), pass)
    syncUser()
  }

  const register = async (name: string, email: string, pass: string) => {
    await pb.collection('users').create({
      name: name.trim(),
      email: email.trim(),
      password: pass,
      passwordConfirm: pass,
    })
    // Request verification email automatically
    try {
      await pb.collection('users').requestVerification(email.trim())
    } catch (_) {
      // ignore if dev mode or not configured
    }
    // Log in user right after signup
    await pb.collection('users').authWithPassword(email.trim(), pass)
    syncUser()
  }

  const requestPasswordReset = async (email: string) => {
    await pb.collection('users').requestPasswordReset(email.trim())
  }

  const requestVerification = async (email: string) => {
    await pb.collection('users').requestVerification(email.trim())
  }

  const logout = () => {
    pb.authStore.clear()
    setUser(null)
  }

  const refreshUser = () => {
    syncUser()
  }

  const isOwner = user?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isOwner,
        login,
        register,
        requestPasswordReset,
        requestVerification,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
