'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Calendar, MapPin, User, Search } from 'lucide-react'
import { getItems } from '@/lib/storage'

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

export default function DevolucoesPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchDevolucoes()
  }, [])

  function fetchDevolucoes() {
    const all = getItems().filter(i => i.status === 'devolvido').sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    setItems(all)
    setLoading(false)
  }

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3" style={{ color: '#1e3a5f' }}>
          <CheckCircle className="w-8 h-8 text-green-500 animate-float" />
          Itens devolvidos
        </h1>
        <p className="text-gray-600 mb-8">
          Histórico de todos os itens que já foram devolvidos aos donos.
        </p>

        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou descrição..."
            className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none hover:border-gray-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 text-xs font-medium">X</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="relative inline-block">
              <CheckCircle className="w-20 h-20 text-gray-200 mx-auto mb-4 animate-float" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {search ? `Nenhum resultado para "${search}"` : 'Nenhuma devolução ainda'}
            </h3>
            <p className="text-gray-500">
              {search ? 'Tente buscar com outras palavras' : 'Quando itens forem devolvidos, eles aparecerão aqui.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item, i) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 animate-fade-in-up hover:-translate-y-0.5 group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                    {item.photo_url ? (
                      <img src={item.photo_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-200">{item.title}</h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex-shrink-0">
                        Devolvido
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">{item.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {item.reported_by}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
