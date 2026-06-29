'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name: string, className?: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  updateProfile: (data: { name?: string; avatar_url?: string }) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase!.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name: string, className?: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { error: new Error('Supabase não configurado') }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          class: className,
        },
      },
    })

    if (error) return { error }

    // Create user profile in users table
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        name,
        class: className,
      })
    }

    return { error: null }
  }

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { error: new Error('Supabase não configurado') }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { error }
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  const updateProfile = async (data: { name?: string; avatar_url?: string }) => {
    if (!supabase) return { error: new Error('Supabase não configurado') }

    const { error } = await supabase.auth.updateUser({
      data: {
        name: data.name,
        avatar_url: data.avatar_url,
      },
    })

    // Also update users table if name changed
    if (data.name && !error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('users').upsert({
          id: user.id,
          name: data.name,
        })
      }
    }

    return { error }
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}