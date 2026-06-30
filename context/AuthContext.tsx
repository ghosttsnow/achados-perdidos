'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { findUserByEmail, createUser, getSession, saveSession, clearSession } from '@/lib/storage'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: any
  loading: boolean
  signUp: (email: string, password: string, name: string, className?: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  updateProfile: (data: { name?: string }) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = getSession()
    if (stored) {
      setUser({
        id: stored.id,
        email: stored.email,
        user_metadata: { name: stored.name, class: stored.className },
        app_metadata: {},
        aud: 'authenticated',
        created_at: stored.createdAt,
      } as User)
    }
    setLoading(false)
  }, [])

  const signUp = async (email: string, password: string, name: string, className?: string) => {
    try {
      const exists = findUserByEmail(email)
      if (exists) {
        return { error: new Error('Este email já está cadastrado') }
      }
      const newUser = createUser(email, password, name, className)
      saveSession(newUser)
      setUser({
        id: newUser.id,
        email: newUser.email,
        user_metadata: { name: newUser.name, class: newUser.className },
        app_metadata: {},
        aud: 'authenticated',
        created_at: newUser.createdAt,
      } as User)
      return { error: null }
    } catch {
      return { error: new Error('Erro ao criar conta. Tente novamente.') }
    }
  }

  const signIn = async (email: string, password: string) => {
    const found = findUserByEmail(email)
    if (!found) {
      return { error: new Error('Email não encontrado. Verifique ou crie uma conta.') }
    }
    if (found.password !== password) {
      return { error: new Error('Senha incorreta. Tente novamente.') }
    }
    saveSession(found)
    setUser({
      id: found.id,
      email: found.email,
      user_metadata: { name: found.name, class: found.className },
      app_metadata: {},
      aud: 'authenticated',
      created_at: found.createdAt,
    } as User)
    return { error: null }
  }

  const signOut = async () => {
    clearSession()
    setUser(null)
  }

  const updateProfile = async (data: { name?: string }) => {
    const stored = getSession()
    if (!stored) return { error: new Error('Nenhum usuário logado') }

    const users = JSON.parse(localStorage.getItem('cbn_users') || '[]')
    const idx = users.findIndex((u: any) => u.id === stored.id)
    if (idx >= 0) {
      if (data.name) users[idx].name = data.name
      localStorage.setItem('cbn_users', JSON.stringify(users))
    }

    const updated = { ...stored, ...data }
    saveSession(updated)
    setUser(prev => prev ? { ...prev, user_metadata: { ...prev.user_metadata, ...data } } : null)
    return { error: null }
  }

  return (
    <AuthContext.Provider value={{
      user, session: user ? { user } : null, loading,
      signUp, signIn, signOut, updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}