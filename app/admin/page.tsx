'use client'

import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, Package, LogOut, Plus, Send, Upload, Shirt, Laptop, BookOpen, X, Search, TrendingUp, AlertTriangle, ClipboardCheck, ArrowLeft, Trash2 } from 'lucide-react'
import { getItems, updateItemStatus, createNotification, createItem, clearAll } from '@/lib/storage'
import { useRouter } from 'next/navigation'
import StatusBadge from '@/components/StatusBadge'
import { initEmailJS, sendItemFoundEmail } from '@/lib/notify'
import Link from 'next/link'

const categories = [
  { value: 'uniforme', label: 'Uniforme', icon: Shirt, emoji: '👕' },
  { value: 'eletronico', label: 'Eletrônico', icon: Laptop, emoji: '📱' },
  { value: 'material', label: 'Material', icon: BookOpen, emoji: '📚' },
  { value: 'outro', label: 'Outro', icon: Package, emoji: '📦' },
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
  const [focusedField, setFocusedField] = useState<string | null>(null)
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

  function handleClearAll() {
    if (confirm('Tem certeza? Isso vai apagar TODOS os itens e notificações.')) {
      clearAll()
      setItems([])
      addToast('Todos os itens foram apagados!', 'success')
    }
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
    { label: 'Total', value: stats.total, color: 'text-slate-700', bg: 'bg-gradient-to-br from-slate-50 to-slate-100', border: 'border-slate-200', icon: ClipboardCheck },
    { label: 'Perdidos', value: stats.perdidos, color: 'text-orange-500', bg: 'bg-gradient-to-br from-orange-50 to-orange-100', border: 'border-orange-200', icon: AlertTriangle },
    { label: 'Encontrados', value: stats.encontrados, color: 'text-[#16a34a]', bg: 'bg-gradient-to-br from-green-50 to-green-100', border: 'border-green-200', icon: Search },
    { label: 'Devolvidos', value: stats.devolvidos, color: 'text-[#2563eb]', bg: 'bg-gradient-to-br from-blue-50 to-blue-100', border: 'border-blue-200', icon: TrendingUp },
  ]

  const statusFilters = ['todos', 'perdido', 'encontrado', 'devolvido'] as const

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="group w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" strokeWidth={2} />
              </Link>
              <div>
                <h1 className="text-base font-bold text-slate-900 tracking-tight">Painel Admin</h1>
                <p className="text-[11px] text-slate-400 font-medium">Gerencie itens achados e perdidos</p>
              </div>
            </div>
            <button
              onClick={handleClearAll}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" strokeWidth={2} />
              <span className="hidden sm:inline">Limpar Tudo</span>
            </button>
            <button
              onClick={handleLogout}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-red-50 hover:text-red-600 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" strokeWidth={2} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className={`${stat.bg} ${stat.border} border rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg cursor-default group animate-fade-in-up`}
                style={{ animationDelay: `${idx * 75}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} strokeWidth={2} />
                  </div>
                </div>
                <p className={`text-3xl sm:text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1 group-hover:text-slate-700 transition-colors duration-200">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`group relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${
              showForm
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:shadow-md'
                : 'bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/35 hover:scale-[1.02]'
            }`}
          >
            <Plus className={`w-4 h-4 transition-transform duration-300 ${showForm ? 'rotate-45' : 'group-hover:rotate-90'}`} strokeWidth={2.5} />
            {showForm ? 'Fechar' : 'Item Encontrado'}
            {!showForm && <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />}
          </button>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar itens..."
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:border-[#16a34a] focus:ring-4 focus:ring-green-50 focus:outline-none transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 hover:scale-110 active:scale-95 transition-all duration-150"
              >
                <X className="w-3 h-3" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <div className={`overflow-hidden transition-all duration-500 ease-out ${showForm ? 'max-h-[1200px] opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}`}>
          <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm animate-fade-in-up">
            {formSuccess ? (
              <div className="text-center py-12 animate-scale-in">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-400 to-[#16a34a] animate-pulse-glow" />
                  <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-green-400 to-[#16a34a] flex items-center justify-center shadow-xl shadow-green-500/30">
                    <CheckCircle className="w-10 h-10 text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <p className="text-xl font-bold text-slate-900">Item reportado!</p>
                <p className="text-sm text-slate-500 mt-2">O item já aparece na galeria.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16a34a] to-[#15803d] flex items-center justify-center shadow-lg shadow-green-500/25">
                      <Package className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    Novo Item Encontrado
                  </h2>
                  <p className="text-sm text-slate-500 mt-2 ml-13">Preencha os dados do item encontrado.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${focusedField === 'title' ? 'bg-[#16a34a] text-white shadow-lg shadow-green-500/25' : 'bg-slate-100 text-slate-400'}`}>
                        <Package className="w-4 h-4" strokeWidth={2} />
                      </div>
                      Nome do item *
                    </label>
                    <input
                      type="text" required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      onFocus={() => setFocusedField('title')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Ex: Kimono preto, Caderneta..."
                      className="input-premium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${focusedField === 'category' ? 'bg-[#16a34a] text-white shadow-lg shadow-green-500/25' : 'bg-slate-100 text-slate-400'}`}>
                        <ClipboardCheck className="w-4 h-4" strokeWidth={2} />
                      </div>
                      Categoria *
                    </label>
                    <div className="flex gap-2">
                      {categories.map((cat) => {
                        const isSelected = formData.category === cat.value
                        return (
                          <button
                            key={cat.value} type="button"
                            onClick={() => setFormData({ ...formData, category: cat.value })}
                            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border-2 transition-all duration-300 text-xs font-medium ${
                              isSelected
                                ? 'border-[#16a34a] bg-green-50 text-[#16a34a] shadow-md shadow-green-500/10 scale-[1.02]'
                                : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm active:scale-[0.98]'
                            }`}
                          >
                            <span className="text-base">{cat.emoji}</span>
                            <span className="hidden sm:inline">{cat.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${focusedField === 'description' ? 'bg-[#16a34a] text-white shadow-lg shadow-green-500/25' : 'bg-slate-100 text-slate-400'}`}>
                      <ClipboardCheck className="w-4 h-4" strokeWidth={2} />
                    </div>
                    Descrição *
                  </label>
                  <textarea
                    required rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    onFocus={() => setFocusedField('description')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Descreva: cor, marca, detalhes..."
                    className="input-premium resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${focusedField === 'location' ? 'bg-[#16a34a] text-white shadow-lg shadow-green-500/25' : 'bg-slate-100 text-slate-400'}`}>
                        <Search className="w-4 h-4" strokeWidth={2} />
                      </div>
                      Local *
                    </label>
                    <input
                      type="text" required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      onFocus={() => setFocusedField('location')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Ex: Pátio, Sala 201..."
                      className="input-premium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${focusedField === 'reported_by' ? 'bg-[#16a34a] text-white shadow-lg shadow-green-500/25' : 'bg-slate-100 text-slate-400'}`}>
                        <ClipboardCheck className="w-4 h-4" strokeWidth={2} />
                      </div>
                      Quem encontrou
                    </label>
                    <input
                      type="text"
                      value={formData.reported_by}
                      onChange={(e) => setFormData({ ...formData, reported_by: e.target.value })}
                      onFocus={() => setFocusedField('reported_by')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Seu nome"
                      className="input-premium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${focusedField === 'contact' ? 'bg-[#16a34a] text-white shadow-lg shadow-green-500/25' : 'bg-slate-100 text-slate-400'}`}>
                        <ClipboardCheck className="w-4 h-4" strokeWidth={2} />
                      </div>
                      Contato
                    </label>
                    <input
                      type="text"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      onFocus={() => setFocusedField('contact')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Tel ou sala"
                      className="input-premium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${focusedField === 'photo' ? 'bg-[#16a34a] text-white shadow-lg shadow-green-500/25' : 'bg-slate-100 text-slate-400'}`}>
                      <Upload className="w-4 h-4" strokeWidth={2} />
                    </div>
                    Foto
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-dashed border-slate-200 bg-white hover:border-[#16a34a] hover:bg-green-50/50 cursor-pointer transition-all duration-300">
                      <Upload className="w-4 h-4 text-slate-400 group-hover:text-[#16a34a] transition-colors duration-300" strokeWidth={2} />
                      <span className="text-sm text-slate-500 group-hover:text-[#16a34a] transition-colors duration-300 font-medium">
                        {photoPreview ? 'Trocar foto' : 'Enviar foto'}
                      </span>
                      <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    </label>
                    {photoPreview && (
                      <div className="relative group animate-scale-in">
                        <img src={photoPreview} alt="Preview" className="w-14 h-14 rounded-xl object-cover ring-4 ring-slate-100 group-hover:ring-green-100 transition-all duration-300" />
                        <button
                          type="button"
                          onClick={() => setPhotoPreview(null)}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg"
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
                  className="group relative w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white font-semibold text-sm shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/35 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                filter === status
                  ? 'bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white shadow-lg shadow-green-500/25 scale-[1.02]'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md hover:scale-[1.01] active:scale-[0.98]'
              }`}
            >
              {statusLabels[status]} ({stats[status as keyof typeof stats]})
            </button>
          ))}
        </div>

        {/* Items List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 rounded-xl animate-shimmer" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center mx-auto mb-6 border border-slate-200">
              <Package className="w-8 h-8 text-slate-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {searchQuery ? 'Nenhum resultado' : 'Nenhum item'}
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              {searchQuery ? `Nenhum item para "${searchQuery}"` : 'Nenhum item com este filtro.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 hover:shadow-xl hover:shadow-slate-200/60 hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${Math.min(idx * 50, 300)}ms` }}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Photo */}
                  <div className="w-full sm:w-20 h-32 sm:h-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                    {item.photo_url ? (
                      <img src={item.photo_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-slate-300 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-slate-900 group-hover:text-[#16a34a] transition-colors duration-200 text-base">
                        {item.title}
                      </h3>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1 mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        {item.reported_by}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        {item.location}
                      </span>
                      {item.contact && (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          {item.contact}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        {new Date(item.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 flex-shrink-0">
                    {item.status === 'perdido' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'encontrado')}
                        className="group/btn inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                      >
                        <CheckCircle className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform duration-200" strokeWidth={2} />
                        Encontrei
                      </button>
                    )}
                    {item.status === 'encontrado' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'devolvido')}
                        className="group/btn inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                      >
                        <CheckCircle className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform duration-200" strokeWidth={2} />
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
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-sm font-medium animate-toast-in backdrop-blur-md ${
              toast.type === 'success' ? 'bg-slate-900/90 text-white' : 'bg-[#2563eb]/90 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" strokeWidth={2} />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <Package className="w-4 h-4" strokeWidth={2} />
              </div>
            )}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="ml-1 opacity-60 hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-150"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
