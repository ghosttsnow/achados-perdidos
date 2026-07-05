'use client'

import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, Package, LogOut, Plus, Send, Upload, Shirt, Laptop, BookOpen, X, Search, TrendingUp, AlertTriangle, ClipboardCheck } from 'lucide-react'
import { getItems, updateItemStatus, createNotification, createItem } from '@/lib/storage'
import { useRouter } from 'next/navigation'
import StatusBadge from '@/components/StatusBadge'

const categories = [
  { value: 'uniforme', label: 'Uniforme', icon: Shirt },
  { value: 'eletronico', label: 'Eletrônico', icon: Laptop },
  { value: 'material', label: 'Material', icon: BookOpen },
  { value: 'outro', label: 'Outro', icon: Package },
]

const statusLabels: Record<string, string> = {
  todos: 'Todos',
  perdido: 'Perdidos',
  encontrado: 'Encontrados',
  devolvido: 'Devolvidos',
}

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

interface Toast {
  id: string
  message: string
  type: 'success' | 'info'
}

export default function AdminPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'todos' | 'perdido' | 'encontrado' | 'devolvido'>('todos')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'uniforme', location: '', reported_by: '', contact: '',
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const addToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now().toString(36)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  useEffect(() => {
    fetchItems()
  }, [filter])

  function fetchItems() {
    setLoading(true)
    const all = getItems().sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    setTimeout(() => {
      setItems(filter === 'todos' ? all : all.filter(i => i.status === filter))
      setLoading(false)
    }, 250)
  }

  function handleUpdateStatus(id: string, newStatus: 'encontrado' | 'devolvido') {
    const item = items.find(i => i.id === id)
    updateItemStatus(id, newStatus)
    if (newStatus === 'encontrado' && item) {
      createNotification({
        item_id: id,
        message: `Seu "${item.title}" foi encontrado! Procure a coordenação para buscar.`,
        read: false,
      })
      addToast(`"${item.title}" marcado como encontrado!`, 'success')
    }
    if (newStatus === 'devolvido' && item) {
      addToast(`"${item.title}" devolvido com sucesso!`, 'success')
    }
    fetchItems()
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    createItem({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      reported_by: formData.reported_by || 'Administrador',
      contact: formData.contact,
      photo_url: photoPreview,
      status: 'encontrado',
    })
    setSubmitting(false)
    setFormSuccess(true)
    addToast('Item reportado com sucesso!', 'success')
    setTimeout(() => {
      setFormSuccess(false)
      setShowForm(false)
      setFormData({ title: '', description: '', category: 'uniforme', location: '', reported_by: '', contact: '' })
      setPhotoPreview(null)
      fetchItems()
    }, 1800)
  }

  function handleLogout() {
    router.push('/admin')
    setTimeout(() => sessionStorage.removeItem('admin-auth'), 50)
  }

  const filteredItems = searchQuery
    ? items.filter(i =>
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items

  const stats = {
    total: items.length,
    perdidos: items.filter(i => i.status === 'perdido').length,
    encontrados: items.filter(i => i.status === 'encontrado').length,
    devolvidos: items.filter(i => i.status === 'devolvido').length,
  }

  const statCards = [
    { label: 'Total', value: stats.total, color: 'bg-gray-100 text-gray-700', icon: ClipboardCheck, delay: 100 },
    { label: 'Perdidos', value: stats.perdidos, color: 'bg-orange-100 text-orange-700', icon: AlertTriangle, delay: 200 },
    { label: 'Encontrados', value: stats.encontrados, color: 'bg-green-100 text-green-700', icon: Search, delay: 300 },
    { label: 'Devolvidos', value: stats.devolvidos, color: 'bg-blue-100 text-blue-700', icon: TrendingUp, delay: 400 },
  ]

  const statusFilters = ['todos', 'perdido', 'encontrado', 'devolvido'] as const

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="animate-slide-in-left">
            <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: '#1e3a5f' }}>
              <Package className="w-8 h-8 animate-float" style={{ color: '#1e3a5f' }} />
              Painel Admin
            </h1>
            <p className="text-gray-600 mt-1">Gerencie os itens achados e perdidos da escola</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-red-600 border border-gray-300 rounded-xl hover:border-red-200 hover:bg-red-50 transition-all duration-300 group animate-slide-in-right"
          >
            <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Sair
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className={`rounded-xl p-5 ${stat.color} transition-all duration-300 hover:scale-[1.05] hover:shadow-lg cursor-default animate-fade-in-up`}
                style={{ animationDelay: `${stat.delay}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-75">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1 transition-all duration-300">{stat.value}</p>
                  </div>
                  <Icon className="w-8 h-8 opacity-30" />
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-lg shadow-blue-900/20 ${showForm ? 'bg-red-500 hover:bg-red-600' : ''}`}
            style={showForm ? {} : { backgroundColor: '#1e3a5f' }}
          >
            <Plus className={`w-5 h-5 transition-transform duration-300 ${showForm ? 'rotate-45' : ''}`} />
            {showForm ? 'Fechar formulário' : 'Reportar Item Encontrado'}
          </button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar itens..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showForm ? 'max-h-[700px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg animate-fade-in-up">
            {formSuccess ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 animate-bounce-in">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <p className="text-xl font-semibold text-gray-900 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Item reportado com sucesso!</p>
                <p className="text-gray-500 mt-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>O item já aparece na galeria como encontrado.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#1e3a5f' }}>
                      <Package className="w-5 h-5" />
                      Novo Item Encontrado
                    </h2>
                    <p className="text-sm text-gray-500">Preencha os dados do item que foi encontrado na escola.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome do item *</label>
                    <input
                      type="text" required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ex: Kimono preto, Caderneta azul..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none hover:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria *</label>
                    <div className="flex gap-2">
                      {categories.map((cat) => {
                        const Icon = cat.icon
                        const isSelected = formData.category === cat.value
                        return (
                          <button
                            key={cat.value} type="button"
                            onClick={() => setFormData({ ...formData, category: cat.value })}
                            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{cat.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição *</label>
                  <textarea
                    required rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o item: cor, marca, detalhes..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none hover:border-gray-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Local *</label>
                    <input
                      type="text" required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Ex: Pátio, Sala 201..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none hover:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Quem encontrou</label>
                    <input
                      type="text"
                      value={formData.reported_by}
                      onChange={(e) => setFormData({ ...formData, reported_by: e.target.value })}
                      placeholder="Seu nome"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none hover:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Contato</label>
                    <input
                      type="text"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="Tel ou sala"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none hover:border-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2.5 px-5 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 group">
                      <Upload className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                      <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                        {photoPreview ? 'Trocar foto' : 'Enviar foto'}
                      </span>
                      <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    </label>
                    {photoPreview && (
                      <div className="flex items-center gap-2 animate-scale-in">
                        <div className="relative group">
                          <img src={photoPreview} alt="Preview" className="w-14 h-14 rounded-xl object-cover ring-2 ring-gray-200" />
                          <button
                            type="button"
                            onClick={() => setPhotoPreview(null)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-medium transition-all duration-300 hover:scale-[1.03] active:scale-95 disabled:opacity-60 disabled:hover:scale-100 shadow-lg"
                  style={{ backgroundColor: '#1e3a5f' }}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Reportar Item Encontrado
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 animate-fade-in-up ${
                filter === status
                  ? 'text-white shadow-lg shadow-blue-900/20 scale-105'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5'
              }`}
              style={filter === status ? { backgroundColor: '#1e3a5f' } : {}}
            >
              {statusLabels[status]} ({stats[status as keyof typeof stats]})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="relative inline-block">
              <Package className="w-20 h-20 text-gray-200 mx-auto mb-4 animate-float" />
              <Search className="w-8 h-8 text-gray-300 absolute -bottom-2 -right-2 animate-pulse-subtle" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchQuery ? 'Nenhum resultado' : 'Nenhum item'}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? `Nenhum item encontrado para "${searchQuery}"`
                : 'Nenhum item encontrado com este filtro.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 animate-fade-in-up group"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-20 h-32 md:h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
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
                      <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-900 transition-colors duration-200">
                        {item.title}
                      </h3>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        {item.reported_by}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        {item.location}
                      </span>
                      {item.contact && (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          {item.contact}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        {new Date(item.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 flex-shrink-0">
                    {item.status === 'perdido' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'encontrado')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 hover:shadow-md transition-all duration-200 text-sm font-medium active:scale-95"
                      >
                        <CheckCircle className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                        Encontrei
                      </button>
                    )}
                    {item.status === 'encontrado' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'devolvido')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 hover:shadow-md transition-all duration-200 text-sm font-medium active:scale-95"
                      >
                        <CheckCircle className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
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

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium animate-slide-in-right ${
              toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Package className="w-5 h-5" />
            )}
            {toast.message}
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
