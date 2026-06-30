'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Package, LogOut, Plus, Send, Upload, Shirt, Laptop, BookOpen } from 'lucide-react'
import { getItems, updateItemStatus, createNotification, createItem } from '@/lib/storage'
import { useRouter } from 'next/navigation'
import StatusBadge from '@/components/StatusBadge'

const categories = [
  { value: 'uniforme', label: 'Uniforme', icon: Shirt },
  { value: 'eletronico', label: 'Eletrônico', icon: Laptop },
  { value: 'material', label: 'Material', icon: BookOpen },
  { value: 'outro', label: 'Outro', icon: Package },
]

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
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'uniforme', location: '', reported_by: '', contact: '',
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
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
    setTimeout(() => {
      setFormSuccess(false)
      setShowForm(false)
      setFormData({ title: '', description: '', category: 'uniforme', location: '', reported_by: '', contact: '' })
      setPhotoPreview(null)
      fetchItems()
    }, 1500)
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

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium mb-6 transition-all duration-200 hover:scale-[1.02]"
          style={{ backgroundColor: '#1e3a5f' }}
        >
          <Plus className="w-5 h-5" />
          {showForm ? 'Fechar' : 'Reportar Item Encontrado'}
        </button>

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 animate-fade-in-up">
            {formSuccess ? (
              <div className="text-center py-8 animate-scale-in">
                <div className="text-5xl text-green-500 mb-4">&#10003;</div>
                <p className="text-lg font-medium text-gray-900">Item reportado com sucesso!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-lg font-semibold" style={{ color: '#1e3a5f' }}>Novo Item Encontrado</h2>
                <p className="text-sm text-gray-500 -mt-3">Preencha os dados do item que foi encontrado na escola.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do item *</label>
                    <input
                      type="text" required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ex: Kimono preto, Caderneta..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                    <div className="flex gap-2">
                      {categories.map((cat) => {
                        const Icon = cat.icon
                        const isSelected = formData.category === cat.value
                        return (
                          <button
                            key={cat.value} type="button"
                            onClick={() => setFormData({ ...formData, category: cat.value })}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                  <textarea
                    required rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o item: cor, marca, detalhes..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Local *</label>
                    <input
                      type="text" required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Ex: Pátio, Sala 201..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quem encontrou</label>
                    <input
                      type="text"
                      value={formData.reported_by}
                      onChange={(e) => setFormData({ ...formData, reported_by: e.target.value })}
                      placeholder="Seu nome"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contato</label>
                    <input
                      type="text"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="Tel ou sala"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200">
                      <Upload className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">{photoPreview ? 'Trocar foto' : 'Enviar foto'}</span>
                      <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    </label>
                    {photoPreview && (
                      <div className="flex items-center gap-2">
                        <img src={photoPreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                        <button type="button" onClick={() => setPhotoPreview(null)} className="text-xs text-red-500 hover:text-red-700">Remover</button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
                  style={{ backgroundColor: '#1e3a5f' }}
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Salvando...' : 'Reportar Item Encontrado'}
                </button>
              </form>
            )}
          </div>
        )}

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