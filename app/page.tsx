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
  created_at: string
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [category, setCategory] = useState('todos')
  const [loading, setLoading] = useState(true)
  const [filtering, setFiltering] = useState(false)

  useEffect(() => {
    setFiltering(true)
    const t = setTimeout(() => {
      fetchItems()
      setFiltering(false)
    }, 250)
    return () => clearTimeout(t)
  }, [category])

  function fetchItems() {
    setLoading(true)
    const all = getItems().sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 9)
    setItems(category === 'todos' ? all : all.filter(i => i.category === category))
    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#2563eb] text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Colégio Batista Nova Betânia
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900" style={{ textWrap: 'balance' }}>
          Encontrou? <span className="text-[#2563eb]">Perdeu?</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto" style={{ textWrap: 'pretty' }}>
          A gente ajuda. Reporte itens perdidos ou veja se o seu já foi encontrado.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/reportar"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Reportar item perdido
          </Link>
          <Link
            href="/galeria"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-[#2563eb] hover:text-[#2563eb] hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
          >
            <Search className="w-5 h-5" />
            Ver itens achados
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 text-center border border-orange-100 max-w-xs mx-auto">
          <div className="text-3xl md:text-4xl font-bold text-orange-600">0</div>
          <div className="text-sm text-orange-700/70 font-medium mt-1">Itens perdidos</div>
        </div>
      </section>

      {/* Filters */}
      <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Itens recentes</h2>
          <Link href="/galeria" className="text-sm font-medium text-[#2563eb] hover:text-[#1d4ed8] transition-colors">
            Ver todos →
          </Link>
        </div>
        <CategoryFilter selected={category} onChange={setCategory} />
      </section>

      {/* Items Grid */}
      {loading || filtering ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse shadow-sm" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-50" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-100 rounded-lg w-3/4" />
                <div className="h-4 bg-gray-100 rounded-lg w-full" />
                <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 animate-fade-in-up">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100/50 flex items-center justify-center mx-auto">
              <Search className="w-12 h-12 text-[#2563eb]/40 animate-float" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum item ainda</h3>
          <p className="text-gray-500 mb-6">Seja o primeiro a reportar um item perdido!</p>
          <Link
            href="/reportar"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Reportar item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <ItemCard key={item.id} item={item} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
