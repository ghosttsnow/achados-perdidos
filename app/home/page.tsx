'use client'

import { useEffect, useState } from 'react'
import { Search, Plus, Sparkles, LogOut, Package, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getItems } from '@/lib/storage'
import ItemCard from '@/components/ItemCard'
import CategoryFilter from '@/components/CategoryFilter'
import { useAuth } from '@/context/AuthContext'

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
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [loaded, setLoaded] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

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

  async function handleSignOut() {
    await signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Achados & Perdidos</h1>
              <p className="text-xs text-gray-500">Colégio Batista Nova Betânia</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/reportar"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white font-medium text-sm flex items-center gap-2 hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Reportar
            </Link>
            
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-dropdown-in z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.name || 'Usuário'}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    href="/admin"
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    onClick={() => setShowMenu(false)}
                  >
                    <Package className="w-4 h-4" />
                    Painel Admin
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar itens..."
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

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-10">
          <div className="bg-white rounded-2xl px-8 py-5 shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-bold text-[#2563eb]">{items.filter(i => i.status === 'perdido').length}</p>
            <p className="text-sm text-gray-500 mt-1">Perdidos</p>
          </div>
          <div className="bg-white rounded-2xl px-8 py-5 shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-bold text-green-600">{items.filter(i => i.status === 'encontrado').length}</p>
            <p className="text-sm text-gray-500 mt-1">Encontrados</p>
          </div>
          <div className="bg-white rounded-2xl px-8 py-5 shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-bold text-blue-600">{items.filter(i => i.status === 'devolvido').length}</p>
            <p className="text-sm text-gray-500 mt-1">Devolvidos</p>
          </div>
        </div>

        {/* Items Grid */}
        {!loaded ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum item encontrado</h3>
            <p className="text-gray-500">
              {search ? 'Tente buscar com outras palavras' : 'Nenhum item no momento'}
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
