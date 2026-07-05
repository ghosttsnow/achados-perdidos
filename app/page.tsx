'use client'

import { useEffect, useState } from 'react'
import { Search, Plus, ArrowRight } from 'lucide-react'
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
      <section className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1e3a5f' }}>
          Encontrou? Perdeu?
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A gente ajuda. Reporte itens perdidos ou veja se o seu já foi encontrado.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/reportar"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-95"
            style={{ backgroundColor: '#1e3a5f' }}
          >
            <Plus className="w-5 h-5" />
            Reportar item perdido
          </Link>
          <Link
            href="/galeria"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-medium border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
            style={{ color: '#1e3a5f' }}
          >
            <Search className="w-5 h-5" />
            Ver itens achados
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Itens recentes</h2>
        <CategoryFilter selected={category} onChange={setCategory} />
      </section>

      {loading || filtering ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 animate-fade-in-up">
          <div className="relative inline-block">
            <Search className="w-20 h-20 text-gray-200 mx-auto mb-4 animate-float" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum item ainda</h3>
          <p className="text-gray-500 mb-6">Seja o primeiro a reportar um item perdido!</p>
          <Link
            href="/reportar"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-medium shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-95"
            style={{ backgroundColor: '#1e3a5f' }}
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
