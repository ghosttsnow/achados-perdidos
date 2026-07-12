'use client'

import { useEffect, useState } from 'react'
import { Search, Plus, ArrowRight, Sparkles } from 'lucide-react'
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
    const perdidos = all.filter((i: Item) => i.status === 'perdido')
    setItems(perdidos)
    setFilteredItems(perdidos)
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

  const stats = {
    total: items.length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <Sparkles className="w-4 h-4 text-[#2563eb]" />
            <span className="text-sm font-medium text-[#2563eb]">Colégio Batista Nova Betânia</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Encontre seus <span className="text-[#2563eb]">pertences</span>
          </h1>
          <p className="text-gray-600 text-lg">Ajudamos você a recuperar o que foi perdido</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-10">
          <div className="bg-white rounded-2xl px-8 py-5 shadow-sm border border-gray-100 text-center hover:scale-105 transition-all duration-300">
            <p className="text-3xl font-bold text-[#2563eb]">{stats.total}</p>
            <p className="text-sm text-gray-500 mt-1">Itens perdidos</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link
            href="/reportar"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
            Reportar item perdido
          </Link>
          <Link
            href="/galeria"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-[#2563eb] hover:text-[#2563eb] transition-all duration-300 hover:scale-[1.02]"
          >
            Ver galeria
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar itens perdidos..."
              className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        {/* Items Grid */}
        {!loaded ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4 animate-float">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum item encontrado</h3>
            <p className="text-gray-500">
              {search ? 'Tente buscar com outras palavras' : 'Nenhum item perdido no momento'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
