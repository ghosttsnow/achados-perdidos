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

  useEffect(() => {
    fetchItems()
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
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
            style={{ backgroundColor: '#1e3a5f' }}
          >
            <Plus className="w-5 h-5" />
            Reportar item perdido
          </Link>
          <Link
            href="/galeria"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
            style={{ color: '#1e3a5f' }}
          >
            <Search className="w-5 h-5" />
            Ver itens achados
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Itens recentes</h2>
        <CategoryFilter selected={category} onChange={setCategory} />
      </section>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
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
        <div className="text-center py-16 animate-fade-in-up">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item ainda</h3>
          <p className="text-gray-500 mb-6">Seja o primeiro a reportar um item perdido!</p>
          <Link
            href="/reportar"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium"
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