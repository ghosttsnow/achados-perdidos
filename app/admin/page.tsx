'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Package, LogOut } from 'lucide-react'
import { getItems, updateItemStatus, createNotification } from '@/lib/storage'
import { useRouter } from 'next/navigation'
import StatusBadge from '@/components/StatusBadge'

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

export default function AdminPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'todos' | 'perdido' | 'encontrado' | 'devolvido'>('todos')
  const router = useRouter()

  useEffect(() => {
    fetchItems()
  }, [filter])

  function fetchItems() {
    setLoading(true)
    const all = getItems().sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    setItems(filter === 'todos' ? all : all.filter(i => i.status === filter))
    setLoading(false)
  }

  function handleUpdateStatus(id: string, newStatus: 'encontrado' | 'devolvido') {
    updateItemStatus(id, newStatus)
    if (newStatus === 'encontrado') {
      const item = items.find(i => i.id === id)
      if (item) {
        createNotification({
          item_id: id,
          message: `Seu "${item.title}" foi encontrado! Procure a coordenação para buscar.`,
          read: false,
        })
      }
    }
    fetchItems()
  }

  function handleLogout() {
    sessionStorage.removeItem('admin-auth')
    router.push('/admin')
  }

  const stats = {
    total: items.length,
    perdidos: items.filter(i => i.status === 'perdido').length,
    encontrados: items.filter(i => i.status === 'encontrado').length,
    devolvidos: items.filter(i => i.status === 'devolvido').length,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1e3a5f' }}>
              Painel Admin
            </h1>
            <p className="text-gray-600">Gerencie os itens achados e perdidos</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'bg-gray-100 text-gray-700' },
            { label: 'Perdidos', value: stats.perdidos, color: 'bg-orange-100 text-orange-700' },
            { label: 'Encontrados', value: stats.encontrados, color: 'bg-green-100 text-green-700' },
            { label: 'Devolvidos', value: stats.devolvidos, color: 'bg-blue-100 text-blue-700' },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
              <p className="text-sm font-medium opacity-75">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {(['todos', 'perdido', 'encontrado', 'devolvido'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === status
                  ? 'text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
              style={filter === status ? { backgroundColor: '#1e3a5f' } : {}}
            >
              {status === 'todos' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item</h3>
            <p className="text-gray-500">Nenhum item encontrado com este filtro.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 hover:shadow-md transition-all duration-200 animate-fade-in-up"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-20 h-32 md:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.photo_url ? (
                      <img src={item.photo_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span>Reportado por: {item.reported_by}</span>
                      <span>Local: {item.location}</span>
                      <span>Contato: {item.contact}</span>
                      <span>Data: {new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 flex-shrink-0">
                    {item.status === 'perdido' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'encontrado')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200 text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Encontrei
                      </button>
                    )}
                    {item.status === 'encontrado' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'devolvido')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Devolvido
                      </button>
                    )}
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