'use client'

import { useEffect, useState } from 'react'
import { Search, Plus, Shield, Package, X } from 'lucide-react'
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

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [loaded, setLoaded] = useState(false)

  const fetchItems = () => {
    const all = getItems()
    setItems(all)
    setFilteredItems(all)
    setLoaded(true)
  }

  useEffect(() => {
    fetchItems()
  }, [])

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
    { label: 'Perdidos', value: items.filter(i => i.status === 'perdido').length, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Encontrados', value: items.filter(i => i.status === 'encontrado').length, color: 'text-[#16a34a]', bg: 'bg-green-50' },
    { label: 'Devolvidos', value: items.filter(i => i.status === 'devolvido').length, color: 'text-[#2563eb]', bg: 'bg-blue-50' },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#16a34a] flex items-center justify-center shadow-sm shadow-green-500/20">
                <Package className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">Achados & Perdidos</h1>
                <p className="text-[11px] text-slate-400 font-medium -mt-0.5">Colégio Batista Nova Betânia</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/reportar"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#16a34a] text-white text-sm font-semibold shadow-sm shadow-green-500/25 hover:bg-[#15803d] hover:shadow-md hover:shadow-green-500/30 active:scale-[0.98] transition-all duration-200"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                <span className="hidden sm:inline">Reportar</span>
              </Link>
              
              <Link
                href="/admin"
                className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all duration-200"
              >
                <Shield className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Encontre seus <span className="text-[#16a34a]">pertences</span>
          </h2>
          <p className="text-slate-500 text-base max-w-md mx-auto">
            Ajude a recuperar o que foi perdido na escola
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} rounded-xl p-4 text-center transition-all duration-300 hover:scale-[1.03] cursor-default`}
            >
              <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs font-medium text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, descrição ou local..."
              className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#16a34a] focus:ring-4 focus:ring-green-50 focus:outline-none transition-all duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CategoryFilter
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        {/* Items Grid */}
        {!loaded ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-72 border border-slate-100 overflow-hidden">
                <div className="h-48 bg-slate-100 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-slate-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Nenhum item encontrado</h3>
            <p className="text-sm text-slate-500">
              {search ? 'Tente buscar com outras palavras' : 'Nenhum item perdido no momento'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item, idx) => (
              <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.04}s` }}>
                <ItemCard item={item} index={idx} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
