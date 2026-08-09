'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Search, Plus, Shield, X, ArrowRight, LogOut, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { getItems, getSession, clearSession, StoredUser } from '@/lib/storage'
import ItemCard from '@/components/ItemCard'
import CategoryFilter from '@/components/CategoryFilter'
import AuthPopup from '@/components/AuthPopup'
import { useTheme } from '@/context/ThemeContext'

interface Item {
  id: string
  title: string
  description: string
  category: string
  photo_url: string | null
  location: string
  status: 'perdido' | 'encontrado' | 'devolvido'
  reported_by: string
  contact: string
  created_at: string
}

function AnimatedCounter({ value, delay = 0 }: { value: number; delay?: number }) {
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!visible) return
    if (value === 0) { setCount(0); return }
    let start = 0
    const duration = 500
    const increment = value / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [value, visible])

  return <span>{count}</span>
}

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [loaded, setLoaded] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [user, setUser] = useState<StoredUser | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()

  const fetchItems = () => {
    const all = getItems()
    setItems(all)
    setFilteredItems(all)
    setLoaded(true)
  }

  useEffect(() => { fetchItems() }, [])

  useEffect(() => {
    const session = getSession()
    if (session) setUser(session)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAuth = useCallback((u: StoredUser) => {
    setUser(u)
  }, [])

  const handleLogout = () => {
    clearSession()
    setUser(null)
    setShowUserMenu(false)
    localStorage.removeItem('cbn_auth_asked')
  }

  useEffect(() => {
    let result = items
    if (selectedCategory !== 'todos') {
      result = result.filter(i => i.category === selectedCategory)
    }
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(i =>
        i.title.toLowerCase().includes(s) ||
        i.description.toLowerCase().includes(s) ||
        i.location.toLowerCase().includes(s)
      )
    }
    setFilteredItems(result)
  }, [search, selectedCategory, items])

  const stats = [
    { label: 'Perdidos', value: items.filter(i => i.status === 'perdido').length, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
    { label: 'Encontrados', value: items.filter(i => i.status === 'encontrado').length, color: 'text-[#16a34a]', bg: 'bg-green-50', border: 'border-green-100' },
    { label: 'Devolvidos', value: items.filter(i => i.status === 'devolvido').length, color: 'text-[#2563eb]', bg: 'bg-blue-50', border: 'border-blue-100' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Auth Popup */}
      <AuthPopup onAuth={handleAuth} />

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-lg overflow-hidden bg-white flex-shrink-0">
                <img
                  src="/logo-colegio.png"
                  alt="Colégio Batista Nova Betânia"
                  className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-200 mix-blend-multiply"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-[#16a34a] transition-colors duration-200">Achados & Perdidos</h1>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium -mt-0.5">Colégio Batista Nova Betânia</p>
              </div>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-white transition-all duration-200"
                aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4" strokeWidth={2} />
                ) : (
                  <Sun className="w-4 h-4" strokeWidth={2} />
                )}
              </button>

              <Link
                href="/reportar"
                className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#16a34a] text-white text-sm font-semibold shadow-sm shadow-green-500/20 hover:bg-[#15803d] hover:shadow-md hover:shadow-green-500/25 active:scale-[0.97] transition-all duration-200"
              >
                <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" strokeWidth={2.5} />
                <span className="hidden sm:inline">Reportar</span>
              </Link>
              
              <Link
                href="/admin"
                className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-white transition-all duration-200"
              >
                <Shield className="w-4 h-4" strokeWidth={2} />
              </Link>

              {/* User Menu */}
              {user && user.id !== 'guest' && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 text-[#16a34a] dark:text-green-400 text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-all duration-200"
                  >
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#16a34a] to-[#15803d] flex items-center justify-center text-white text-[10px] font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 p-1.5 animate-dropdown-in z-50">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                      >
                        <LogOut className="w-4 h-4" strokeWidth={2} />
                        Sair da conta
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="relative text-center mb-12 sm:mb-16 py-8">
          {/* Background Glow */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-400/5 dark:bg-green-400/10 rounded-full blur-3xl" />
          </div>

          {/* Logo */}
          <div className="animate-fade-in-up mb-6">
            <div className="h-28 sm:h-36 w-28 sm:w-36 mx-auto rounded-2xl overflow-hidden bg-white flex items-center justify-center shadow-lg">
              <img
                src="/logo-colegio.png"
                alt="Colégio Batista Nova Betânia"
                className="h-24 sm:h-32 w-auto mix-blend-multiply"
              />
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4 animate-fade-in-up delay-75">
            Encontre seus{' '}
            <span className="relative inline-block">
              <span className="gradient-text">pertences</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C40 3 80 2 100 4C120 6 160 8 198 3" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          
          <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl max-w-lg mx-auto mb-10 animate-fade-in-up delay-150">
            Ajude a recuperar o que foi perdido na escola
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up delay-200">
            <Link
              href="/reportar"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#16a34a] text-white font-semibold text-sm shadow-md shadow-green-500/20 hover:bg-[#15803d] hover:shadow-lg hover:shadow-green-500/30 active:scale-[0.97] transition-all duration-200"
            >
              <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" strokeWidth={2.5} />
              Reportar Item
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <button
              onClick={() => searchRef.current?.focus()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md active:scale-[0.97] transition-all duration-200"
            >
              <Search className="w-4 h-4" />
              Buscar Itens
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10 max-w-2xl mx-auto">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`${stat.bg} dark:bg-opacity-30 ${stat.border} dark:border-opacity-50 border rounded-xl p-4 sm:p-5 text-center transition-all duration-200 hover:shadow-md cursor-default animate-fade-in-up`}
              style={{ animationDelay: `${250 + idx * 75}ms` }}
            >
              <div className={`text-2xl sm:text-3xl font-bold ${stat.color} mb-0.5`}>
                <AnimatedCounter value={stat.value} delay={300 + idx * 100} />
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${searchFocused ? 'text-[#16a34a]' : 'text-slate-400 dark:text-slate-500'}`} strokeWidth={2} />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Buscar por título, descrição ou local..."
              className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#16a34a] focus:ring-2 focus:ring-green-50 dark:focus:ring-green-900/30 focus:outline-none transition-all duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-600 dark:hover:text-slate-200 transition-all duration-150"
              >
                <X className="w-3 h-3" strokeWidth={2.5} />
              </button>
            )}
          </div>
          {search && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 ml-1 animate-fade-in">
              {filteredItems.length} resultado{filteredItems.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-10">
          <CategoryFilter
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        {/* Items Grid */}
        {!loaded ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-card dark:bg-slate-800 dark:border-slate-700">
                <div className="skeleton-image" />
                <div className="skeleton-content">
                  <div className="skeleton-text h-4 w-3/4" />
                  <div className="skeleton-text h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Nenhum item encontrado</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {search ? 'Tente buscar com outras palavras' : 'Nenhum item perdido no momento'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(idx * 50, 300)}ms` }}
              >
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-lg overflow-hidden bg-white flex items-center justify-center opacity-60">
              <img
                src="/logo-colegio.png"
                alt="Colégio Batista Nova Betânia"
                className="h-10 w-auto mix-blend-multiply"
              />
            </div>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Colégio Batista Nova Betânia · Achados & Perdidos
            </p>
            <p className="text-xs text-slate-300 dark:text-slate-600">
              Feito por João Henrique Misael Roque
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
