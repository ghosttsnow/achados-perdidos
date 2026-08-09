'use client'

import { useEffect, useState, useRef } from 'react'
import { Search, Plus, Shield, Package, X, ArrowRight, Sparkles, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { getItems } from '@/lib/storage'
import ItemCard from '@/components/ItemCard'
import CategoryFilter from '@/components/CategoryFilter'

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
  const searchRef = useRef<HTMLInputElement>(null)

  const fetchItems = () => {
    const all = getItems()
    setItems(all)
    setFilteredItems(all)
    setLoaded(true)
  }

  useEffect(() => { fetchItems() }, [])

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
    { label: 'Perdidos', value: items.filter(i => i.status === 'perdido').length, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100', icon: 'lost' },
    { label: 'Encontrados', value: items.filter(i => i.status === 'encontrado').length, color: 'text-[#16a34a]', bg: 'bg-green-50', border: 'border-green-100', icon: 'found' },
    { label: 'Devolvidos', value: items.filter(i => i.status === 'devolvido').length, color: 'text-[#2563eb]', bg: 'bg-blue-50', border: 'border-blue-100', icon: 'returned' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#16a34a] to-[#15803d] flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:shadow-xl group-hover:shadow-green-500/40 transition-all duration-300 group-hover:scale-105">
                <Package className="w-5 h-5 text-white" strokeWidth={2.5} />
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-[#16a34a] transition-colors duration-200">Achados & Perdidos</h1>
                <p className="text-[11px] text-slate-400 font-medium -mt-0.5">Colégio Batista Nova Betânia</p>
              </div>
            </div>

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
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="relative text-center mb-12 sm:mb-16">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse-glow" />
          </div>
          
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Sistema de Achados e Perdidos
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-4 animate-fade-in-up delay-100">
            Encontre seus{' '}
            <span className="relative inline-block">
              <span className="gradient-text">pertences</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C40 3 80 2 100 4C120 6 160 8 198 3" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" className="animate-draw" />
              </svg>
            </span>
          </h2>
          
          <p className="text-slate-500 text-lg max-w-md mx-auto mb-8 animate-fade-in-up delay-200">
            Ajude a recuperar o que foi perdido na escola
          </p>

          <div className="flex items-center justify-center gap-3 animate-fade-in-up delay-300">
            <Link
              href="/reportar"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white font-semibold text-sm shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Reportar Item
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <button
              onClick={() => searchRef.current?.focus()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-700 font-semibold text-sm border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <Search className="w-4 h-4" />
              Buscar Itens
            </button>
          </div>

          <div className="mt-8 animate-fade-in-up delay-400">
            <ChevronDown className="w-5 h-5 text-slate-300 mx-auto animate-bounce-subtle" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-300">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`${stat.bg} ${stat.border} border rounded-2xl p-4 sm:p-5 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-lg cursor-default group`}
            >
              <div className={`text-3xl sm:text-4xl font-bold ${stat.color} mb-1`}>
                <AnimatedCounter value={stat.value} delay={idx * 100} />
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors duration-200">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8 animate-fade-in-up delay-400">
          <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-[1.02]' : ''}`}>
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${searchFocused ? 'text-[#16a34a]' : 'text-slate-400'}`} strokeWidth={2} />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Buscar por título, descrição ou local..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#16a34a] focus:ring-4 focus:ring-green-50 focus:shadow-lg focus:outline-none transition-all duration-300"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 hover:scale-110 active:scale-95 transition-all duration-200"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            )}
          </div>
          {search && (
            <p className="text-sm text-slate-500 mt-2 ml-1 animate-fade-in">
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
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-slate-400 text-sm">
              <Package className="w-4 h-4" />
              <span>Colégio Batista Nova Betânia</span>
              <span className="text-slate-300">·</span>
              <span>Achados & Perdidos</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
