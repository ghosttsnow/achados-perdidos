'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Package } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import ItemCard from '@/components/ItemCard'

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

export default function PerfilPage() {
  const [email, setEmail] = useState('')
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!isSupabaseConfigured()) {
      setItems([])
      setLoading(false)
      setSearched(true)
      return
    }
    setLoading(true)
    setSearched(true)

    const { data } = await supabase!
      .from('items')
      .select('*')
      .eq('contact', email)
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
          Meu perfil
        </h1>
        <p className="text-gray-600 mb-8">
          Veja os itens que você reportou e seu status.
        </p>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email para ver seus itens"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 hover:scale-[1.02]"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>

        {searched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {items.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item encontrado</h3>
                <p className="text-gray-500">Você ainda não reportou nenhum item.</p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Seus itens ({items.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map((item, i) => (
                    <ItemCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
