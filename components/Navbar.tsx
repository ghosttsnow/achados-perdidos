'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Plus, User, X, LogOut, BookOpen, Package, Home, Image } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import NotificationBell from './NotificationBell'
import { useAuth } from '@/context/AuthContext'

const navLinks = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/galeria', label: 'Galeria', icon: Image },
  { href: '/reportar', label: 'Reportar', icon: Plus },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownClosing, setDropdownClosing] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, signOut, loading } = useAuth()

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  function closeDropdown() {
    if (!dropdownOpen || dropdownClosing) return
    setDropdownClosing(true)
    setTimeout(() => {
      setDropdownOpen(false)
      setDropdownClosing(false)
    }, 150)
  }

  function toggleDropdown() {
    if (dropdownOpen) {
      closeDropdown()
    } else {
      setDropdownOpen(true)
      setDropdownClosing(false)
    }
  }

  if (pathname.startsWith('/admin')) return null
  if (pathname.startsWith('/auth')) return null

  if (loading) {
    return (
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
        </div>
      </nav>
    )
  }

  return (
    <nav className={`bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-gray-100 shadow-sm' : 'border-b border-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-105">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 hidden sm:block">
              Achados <span className="text-[#2563eb]">&</span> Perdidos
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-gray-50/80 rounded-2xl p-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/25'
                      : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <NotificationBell />
            
            {/* User Menu / Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563eb] to-[#7c3aed] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
                      {user.user_metadata?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {user.user_metadata?.name || 'Minha conta'}
                    </span>
                  </button>

                  {/* Dropdown */}
                  {(dropdownOpen || dropdownClosing) && (
                    <div className={`absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 py-2 z-50 ${dropdownClosing ? 'animate-dropdown-out' : 'animate-dropdown-in'}`}>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.user_metadata?.name || 'Usuário'}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/perfil"
                          onClick={closeDropdown}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2563eb] transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Meu Perfil
                        </Link>
                        <Link
                          href="/reportar"
                          onClick={closeDropdown}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2563eb] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Reportar Item
                        </Link>
                        <Link
                          href="/galeria"
                          onClick={closeDropdown}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2563eb] transition-colors"
                        >
                          <Image className="w-4 h-4" />
                          Galeria
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={() => { closeDropdown(); signOut?.() }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-xl font-medium text-gray-700 hover:text-[#2563eb] hover:bg-blue-50 transition-all duration-200"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastro"
                    className="px-5 py-2 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02]"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Package className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md animate-slide-down">
          <div className="px-4 py-4 space-y-2">
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
                      ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/25'
                      : 'text-gray-700 hover:bg-gray-50'
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
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-5 h-5" />
                  Meu Perfil
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); signOut?.() }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sair
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
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
                  className="px-4 py-3 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] shadow-md shadow-blue-500/25 text-center"
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
