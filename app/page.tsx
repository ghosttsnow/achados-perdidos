'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Search, Plus, Shield, X, ArrowRight, ChevronDown, LogOut } from 'lucide-react'
import Link from 'next/link'
import { getItems, getSession, clearSession, StoredUser } from '@/lib/storage'
import ItemCard from '@/components/ItemCard'
import CategoryFilter from '@/components/CategoryFilter'
import AuthPopup from '@/components/AuthPopup'

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
    const duration = 600
    const increment = value / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [value, visible])

  return <span className="animate-counter">{count}</span>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30">
      {/* Auth Popup */}
      <AuthPopup onAuth={handleAuth} />

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-10 w-auto">
                <img
                  src="/logo-colegio.png"
                  alt="Colégio Batista Nova Betânia"
                  className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-[#16a34a] transition-colors duration-200">Achados & Perdidos</h1>
                <p className="text-[11px] text-slate-400 font-medium -mt-0.5">Colégio Batista Nova Betânia</p>
              </div>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/reportar"
                className="group relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white text-sm font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                <span className="hidden sm:inline">Reportar</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              
              <Link
                href="/admin"
                className="group w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                <Shield className="w-4 h-4" strokeWidth={2} />
              </Link>

              {/* User Menu */}
              {user && user.id !== 'guest' && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 border border-green-100 text-[#16a34a] text-sm font-medium hover:bg-green-100 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#16a34a] to-[#15803d] flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/60 border border-white/50 p-2 animate-dropdown-in">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-green-400/8 via-green-300/5 to-transparent rounded-full blur-3xl animate-float" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>

          {/* Logo + Title Unified */}
          <div className="animate-fade-in-up mb-6">
            <div className="relative inline-block group cursor-pointer">
              <img
                src="/logo-colegio.png"
                alt="Colégio Batista Nova Betânia"
                className="h-32 sm:h-40 w-auto mx-auto drop-shadow-xl group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute -inset-8 bg-gradient-to-b from-green-400/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-4 animate-fade-in-up delay-100">
            Encontre seus{' '}
            <span className="relative inline-block group cursor-pointer">
              <span className="gradient-text">pertences</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C40 3 80 2 100 4C120 6 160 8 198 3" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          
          <p className="text-slate-500 text-lg sm:text-xl max-w-lg mx-auto mb-10 animate-fade-in-up delay-200 leading-relaxed">
            Ajude a recuperar o que foi perdido na escola
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Link
              href="/reportar"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white font-bold text-base shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-400 ease-out"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500 ease-out" strokeWidth={2.5} />
              Reportar Item
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-out" />
            </Link>
            <button
              onClick={() => searchRef.current?.focus()}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-700 font-bold text-base border-2 border-slate-200 hover:border-green-300 hover:bg-green-50 hover:text-[#16a34a] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-400 ease-out"
            >
              <Search className="w-5 h-5 group-hover:rotate-12 transition-transform duration-400 ease-out" />
              Buscar Itens
            </button>
          </div>

          <div className="mt-10 animate-fade-in-up delay-400">
            <ChevronDown className="w-5 h-5 text-slate-300 mx-auto animate-bounce-subtle" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-400">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`${stat.bg} ${stat.border} border rounded-2xl p-4 sm:p-5 text-center transition-all duration-400 ease-out hover:scale-[1.03] hover:shadow-lg cursor-default group`}
            >
              <div className={`text-3xl sm:text-4xl font-bold ${stat.color} mb-1 transition-transform duration-400 ease-out group-hover:scale-105`}>
                <AnimatedCounter value={stat.value} delay={idx * 100} />
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors duration-300 ease-out">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8 animate-fade-in-up delay-500">
          <div className={`relative transition-all duration-400 ease-out ${searchFocused ? 'scale-[1.02]' : ''}`}>
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-400 ease-out ${searchFocused ? 'text-[#16a34a]' : 'text-slate-400'}`} strokeWidth={2} />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Buscar por título, descrição ou local..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#16a34a] focus:ring-4 focus:ring-green-50 focus:shadow-lg focus:outline-none transition-all duration-400 ease-out"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-100 hover:text-red-500 hover:scale-110 active:scale-95 transition-all duration-300 ease-out"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            )}
          </div>
          {search && (
            <p className="text-sm text-slate-500 mt-2 ml-1 animate-slide-down">
              {filteredItems.length} {filteredItems.length === 1 ? 'resultado' : 'resultados'} encontrado{filteredItems.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-10 animate-fade-in-up delay-500">
          <CategoryFilter
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        {/* Items Grid */}
        {!loaded ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-72 border border-slate-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-shimmer" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 animate-bounce-in">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center mx-auto mb-6 border border-slate-200">
              <Search className="w-8 h-8 text-slate-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhum item encontrado</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              {search ? 'Tente buscar com outras palavras ou verifique a ortografia' : 'Nenhum item perdido no momento. Seja o primeiro a reportar!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item, idx) => (
              <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                <ItemCard item={item} index={idx} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-100 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center gap-4">
            <img
              src="/logo-colegio.png"
              alt="Colégio Batista Nova Betânia"
              className="h-12 w-auto opacity-60"
            />
            <p className="text-sm text-slate-400">
              Colégio Batista Nova Betânia · Achados & Perdidos
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
