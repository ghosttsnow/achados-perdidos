'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Calendar, MapPin, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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

  useEffect(() => {
    fetchDevolucoes()
  }, [])

  async function fetchDevolucoes() {
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('status', 'devolvido')
      .order('created_at', { ascending: false })

    setItems(data || [])
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1e3a5f' }}>
          Itens devolvidos
        </h1>
        <p className="text-gray-600 mb-8">
          Histórico de todos os itens que já foram devolvidos aos donos.
        </p>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma devolução ainda</h3>
            <p className="text-gray-500">Quando itens forem devolvidos, eles aparecerão aqui.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
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
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
