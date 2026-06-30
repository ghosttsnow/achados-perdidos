'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Plus, User, X, LogOut, BookOpen, Package } from 'lucide-react'
import { useState } from 'react'
import NotificationBell from './NotificationBell'
import { useAuth } from '@/context/AuthContext'

const navLinks = [
  { href: '/', label: 'Início', icon: Search },
  { href: '/galeria', label: 'Galeria', icon: Search },
  { href: '/reportar', label: 'Reportar', icon: Plus },
  { href: '/perfil', label: 'Perfil', icon: User },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, signOut, loading } = useAuth()

  if (pathname.startsWith('/admin')) return null
  if (pathname.startsWith('/auth')) return null

  if (loading) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg" style={{ color: '#1e3a5f' }}>
            <BookOpen className="w-6 h-6" />
            Achados & Perdidos
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
            <NotificationBell />
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:bg-gray-50"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
                    {user.user_metadata?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.user_metadata?.name || 'Minha conta'}
                  </span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.user_metadata?.name || 'Usuário'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/perfil"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Meu Perfil
                  </Link>
                  <Link
                    href="/reportar"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    Reportar Item
                  </Link>
                  <Link
                    href="/galeria"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    Galeria
                  </Link>
                  <div className="border-t border-gray-100 my-2" />
              <button
                onClick={() => signOut?.()}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="px-4 py-2 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)' }}
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Package className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              )
            })}
            <div className="border-t border-gray-100 my-2" />
            {user ? (
              <>
                <Link
                  href="/perfil"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-5 h-5" />
                  Meu Perfil
                </Link>
                  <button
                    onClick={() => signOut?.()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                  <LogOut className="w-5 h-5" />
                  Sair
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors text-center"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 text-center"
                  style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)' }}
                >
                  Criar conta
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}