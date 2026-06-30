'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import ItemCard from '@/components/ItemCard'
import CategoryFilter from '@/components/CategoryFilter'

export const dynamic = 'force-dynamic'

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

export default function GaleriaPage() {
  const [items, setItems] = useState<Item[]>([])
  const [category, setCategory] = useState('todos')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [category])

  async function fetchItems() {
    if (!isSupabaseConfigured()) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    let query = supabase!
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })

    if (category !== 'todos') {
      query = query.eq('category', category)
    }

    const { data } = await query
    setItems(data || [])
    setLoading(false)
  }

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1e3a5f' }}>
          Galeria de itens
        </h1>
        <p className="text-gray-600 mb-8">
          Veja todos os itens reportados. Encontrou o seu? Entre em contato!
        </p>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou descrição..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
          />
        </div>

        <div className="mb-8">
          <CategoryFilter selected={category} onChange={setCategory} />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 animate-fade-in-up">
            <Search className="w-16 h-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item encontrado</h3>
            <p className="text-gray-500">
              {search ? 'Tente buscar com outras palavras' : 'Ainda não há itens nesta categoria'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}