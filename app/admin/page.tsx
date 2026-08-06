'use client'

import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, Package, LogOut, Plus, Send, Upload, Shirt, Laptop, BookOpen, X, Search, TrendingUp, AlertTriangle, ClipboardCheck, ArrowLeft } from 'lucide-react'
import { getItems, updateItemStatus, createNotification, createItem } from '@/lib/storage'
import { useRouter } from 'next/navigation'
import StatusBadge from '@/components/StatusBadge'
import { initEmailJS, sendItemFoundEmail } from '@/lib/notify'
import Link from 'next/link'

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
    initEmailJS()
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

      const allItems = getItems()
      const lostItem = allItems.find(
        i => i.status === 'perdido' && i.title.toLowerCase() === item.title.toLowerCase() && i.contact?.includes('@')
      )
      if (lostItem && lostItem.contact) {
        sendItemFoundEmail({
          to_name: lostItem.reported_by || 'Aluno(a)',
          to_email: lostItem.contact,
          item_name: item.title,
          item_location: item.location || 'não informado',
          found_by: item.reported_by || 'Administrador',
        }).then(sent => {
          if (sent) addToast(`Email enviado para ${lostItem.reported_by}!`, 'success')
        })
      }

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
    const newItem = createItem({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      reported_by: formData.reported_by || 'Administrador',
      contact: formData.contact,
      photo_url: photoPreview,
      status: 'encontrado',
    })

    const allItems = getItems()
    const lostItem = allItems.find(
      i => i.id !== newItem.id && i.status === 'perdido' && i.title.toLowerCase() === newItem.title.toLowerCase() && i.contact?.includes('@')
    )
    if (lostItem && lostItem.contact) {
      sendItemFoundEmail({
        to_name: lostItem.reported_by || 'Aluno(a)',
        to_email: lostItem.contact,
        item_name: newItem.title,
        item_location: newItem.location || 'não informado',
        found_by: newItem.reported_by || 'Administrador',
      }).then(sent => {
        if (sent) addToast(`Email enviado para ${lostItem.reported_by}!`, 'success')
      })
    }

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
    { label: 'Total', value: stats.total, color: 'text-slate-700', bg: 'bg-slate-50', icon: ClipboardCheck },
    { label: 'Perdidos', value: stats.perdidos, color: 'text-orange-500', bg: 'bg-orange-50', icon: AlertTriangle },
    { label: 'Encontrados', value: stats.encontrados, color: 'text-emerald-500', bg: 'bg-emerald-50', icon: Search },
    { label: 'Devolvidos', value: stats.devolvidos, color: 'text-[#2563eb]', bg: 'bg-blue-50', icon: TrendingUp },
  ]

  const statusFilters = ['todos', 'perdido', 'encontrado', 'devolvido'] as const

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              </Link>
              <div>
                <h1 className="text-base font-bold text-slate-900 tracking-tight">Painel Admin</h1>
                <p className="text-[11px] text-slate-400 font-medium">Gerencie itens achados e perdidos</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" strokeWidth={2} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 animate-fade-in-up">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className={`${stat.bg} rounded-xl p-4 transition-all duration-300 hover:scale-[1.03] cursor-default`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${stat.color}`} strokeWidth={2} />
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
              showForm
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                : 'bg-[#2563eb] text-white shadow-sm shadow-blue-500/25 hover:bg-[#1d4ed8] hover:shadow-md'
            }`}
          >
            <Plus className={`w-4 h-4 transition-transform duration-200 ${showForm ? 'rotate-45' : ''}`} strokeWidth={2.5} />
            {showForm ? 'Fechar' : 'Item Encontrado'}
          </button>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar itens..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              >
                <X className="w-3 h-3" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <div className={`overflow-hidden transition-all duration-400 ease-out ${showForm ? 'max-h-[1200px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-fade-in-up">
            {formSuccess ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4 animate-bounce-in">
                  <CheckCircle className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />
                </div>
                <p className="text-lg font-semibold text-slate-900">Item reportado!</p>
                <p className="text-sm text-slate-500 mt-1">O item já aparece na galeria.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#2563eb]" strokeWidth={2} />
                    Novo Item Encontrado
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Preencha os dados do item encontrado.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Nome do item *</label>
                    <input
                      type="text" required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ex: Kimono preto, Caderneta..."
                      className="input-premium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Categoria *</label>
                    <div className="flex gap-2">
                      {categories.map((cat) => {
                        const Icon = cat.icon
                        const isSelected = formData.category === cat.value
                        return (
                          <button
                            key={cat.value} type="button"
                            onClick={() => setFormData({ ...formData, category: cat.value })}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 transition-all duration-200 text-xs font-medium ${
                              isSelected
                                ? 'border-[#2563eb] bg-blue-50 text-[#2563eb]'
                                : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                            <span className="hidden sm:inline">{cat.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Descrição *</label>
                  <textarea
                    required rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva: cor, marca, detalhes..."
                    className="input-premium resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Local *</label>
                    <input
                      type="text" required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Ex: Pátio, Sala 201..."
                      className="input-premium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Quem encontrou</label>
                    <input
                      type="text"
                      value={formData.reported_by}
                      onChange={(e) => setFormData({ ...formData, reported_by: e.target.value })}
                      placeholder="Seu nome"
                      className="input-premium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Contato</label>
                    <input
                      type="text"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="Tel ou sala"
                      className="input-premium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Foto</label>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 bg-white hover:border-[#2563eb] hover:bg-blue-50/50 cursor-pointer transition-all duration-200 group">
                      <Upload className="w-4 h-4 text-slate-400 group-hover:text-[#2563eb] transition-colors" strokeWidth={2} />
                      <span className="text-sm text-slate-500 group-hover:text-[#2563eb] transition-colors font-medium">
                        {photoPreview ? 'Trocar foto' : 'Enviar foto'}
                      </span>
                      <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    </label>
                    {photoPreview && (
                      <div className="relative group animate-scale-in">
                        <img src={photoPreview} alt="Preview" className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100" />
                        <button
                          type="button"
                          onClick={() => setPhotoPreview(null)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <X className="w-3 h-3" strokeWidth={2.5} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" strokeWidth={2} />
                      Reportar Item Encontrado
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === status
                  ? 'bg-[#2563eb] text-white shadow-sm shadow-blue-500/25'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {statusLabels[status]} ({stats[status as keyof typeof stats]})
            </button>
          ))}
        </div>

        {/* Items List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-slate-100 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Package className="w-7 h-7 text-slate-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {searchQuery ? 'Nenhum resultado' : 'Nenhum item'}
            </h3>
            <p className="text-sm text-slate-500">
              {searchQuery ? `Nenhum item para "${searchQuery}"` : 'Nenhum item com este filtro.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-100 p-4 sm:p-5 hover:shadow-md hover:border-slate-200 transition-all duration-300 animate-fade-in-up group"
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Photo */}
                  <div className="w-full sm:w-16 h-32 sm:h-16 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                    {item.photo_url ? (
                      <img src={item.photo_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Package className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 group-hover:text-[#2563eb] transition-colors">
                        {item.title}
                      </h3>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1 mb-2">{item.description}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
                      <span>{item.reported_by}</span>
                      <span>·</span>
                      <span>{item.location}</span>
                      {item.contact && (
                        <>
                          <span>·</span>
                          <span>{item.contact}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 flex-shrink-0">
                    {item.status === 'perdido' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'encontrado')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-600 text-sm font-medium hover:bg-emerald-100 active:scale-[0.98] transition-all duration-200"
                      >
                        <CheckCircle className="w-3.5 h-3.5" strokeWidth={2} />
                        Encontrei
                      </button>
                    )}
                    {item.status === 'encontrado' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'devolvido')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-50 text-[#2563eb] text-sm font-medium hover:bg-blue-100 active:scale-[0.98] transition-all duration-200"
                      >
                        <CheckCircle className="w-3.5 h-3.5" strokeWidth={2} />
                        Devolvido
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-in-right ${
              toast.type === 'success' ? 'bg-slate-900 text-white' : 'bg-[#2563eb] text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-4 h-4" strokeWidth={2} />
            ) : (
              <Package className="w-4 h-4" strokeWidth={2} />
            )}
            {toast.message}
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
