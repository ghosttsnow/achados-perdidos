'use client'

import { useState, useRef } from 'react'
import { ArrowLeft, CheckCircle, Upload, X, User, FileText, MapPin, Mail, Tag, Camera, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { createItem } from '@/lib/storage'

const categories = [
  { value: 'uniforme', label: 'Uniforme', icon: '👕' },
  { value: 'eletronico', label: 'Eletrônico', icon: '📱' },
  { value: 'material', label: 'Material', icon: '📚' },
  { value: 'outro', label: 'Outro', icon: '📦' },
]

export default function ReportarPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('uniforme')
  const [location, setLocation] = useState('')
  const [contact, setContact] = useState('')
  const [name, setName] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPhoto(ev.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    createItem({
      title,
      description,
      category,
      location,
      contact,
      photo_url: photo,
      status: 'perdido',
      reported_by: name || 'Anônimo',
    })

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 flex items-center justify-center px-4">
        <div className="text-center animate-scale-in max-w-sm">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-400 to-[#16a34a] animate-pulse-glow" />
            <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-green-400 to-[#16a34a] flex items-center justify-center shadow-xl shadow-green-500/30">
              <CheckCircle className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Item reportado!</h1>
          <p className="text-slate-500 text-base mb-8 leading-relaxed">
            Quando alguém encontrar, você será notificado por email.
          </p>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white font-semibold shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            Voltar ao início
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 h-16">
            <Link
              href="/"
              className="group w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" strokeWidth={2} />
            </Link>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">Reportar item perdido</h1>
              <p className="text-xs text-slate-400">Descreva o item para ajudar a encontrar</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${focusedField === 'name' ? 'bg-[#16a34a] text-white shadow-lg shadow-green-500/25' : 'bg-slate-100 text-slate-400'}`}>
                <User className="w-4 h-4" strokeWidth={2} />
              </div>
              Seu nome
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              placeholder="Como você se chama?"
              className="input-premium"
            />
          </div>

          {/* Title */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${focusedField === 'title' ? 'bg-[#16a34a] text-white shadow-lg shadow-green-500/25' : 'bg-slate-100 text-slate-400'}`}>
                <FileText className="w-4 h-4" strokeWidth={2} />
              </div>
              Título do item
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setFocusedField('title')}
              onBlur={() => setFocusedField(null)}
              placeholder="Ex: Caderno azul, Kimono preto..."
              className="input-premium"
            />
          </div>

          {/* Description */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${focusedField === 'description' ? 'bg-[#16a34a] text-white shadow-lg shadow-green-500/25' : 'bg-slate-100 text-slate-400'}`}>
                <FileText className="w-4 h-4" strokeWidth={2} />
              </div>
              Descrição
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setFocusedField('description')}
              onBlur={() => setFocusedField(null)}
              placeholder="Descreva o item com detalhes: cor, marca, características..."
              rows={3}
              className="input-premium resize-none"
            />
          </div>

          {/* Category */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${focusedField === 'category' ? 'bg-[#16a34a] text-white shadow-lg shadow-green-500/25' : 'bg-slate-100 text-slate-400'}`}>
                <Tag className="w-4 h-4" strokeWidth={2} />
              </div>
              Categoria
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`group relative overflow-hidden px-4 py-4 rounded-2xl text-sm font-medium border-2 transition-all duration-300 ${
                    category === cat.value
                      ? 'border-[#16a34a] bg-gradient-to-br from-green-50 to-green-100/50 text-[#16a34a] shadow-lg shadow-green-500/10 scale-[1.02]'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md hover:scale-[1.01] active:scale-[0.98]'
                  }`}
                >
                  <span className="text-xl mb-1 block transition-transform duration-200 group-hover:scale-110">{cat.icon}</span>
                  <span>{cat.label}</span>
                  {category === cat.value && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${focusedField === 'location' ? 'bg-[#16a34a] text-white shadow-lg shadow-green-500/25' : 'bg-slate-100 text-slate-400'}`}>
                <MapPin className="w-4 h-4" strokeWidth={2} />
              </div>
              Local
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setFocusedField('location')}
              onBlur={() => setFocusedField(null)}
              placeholder="Ex: Sala 5, Biblioteca, Pátio..."
              className="input-premium"
            />
          </div>

          {/* Contact */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${focusedField === 'contact' ? 'bg-[#16a34a] text-white shadow-lg shadow-green-500/25' : 'bg-slate-100 text-slate-400'}`}>
                <Mail className="w-4 h-4" strokeWidth={2} />
              </div>
              Email para contato
            </label>
            <input
              type="email"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              onFocus={() => setFocusedField('contact')}
              onBlur={() => setFocusedField(null)}
              placeholder="seu@email.com"
              className="input-premium"
            />
          </div>

          {/* Photo */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${focusedField === 'photo' ? 'bg-[#16a34a] text-white shadow-lg shadow-green-500/25' : 'bg-slate-100 text-slate-400'}`}>
                <Camera className="w-4 h-4" strokeWidth={2} />
              </div>
              Foto <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            {photo ? (
              <div className="relative inline-block group">
                <img src={photo} alt="Preview" className="h-40 rounded-2xl object-cover ring-4 ring-slate-100 group-hover:ring-green-100 transition-all duration-300" />
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 active:scale-95 transition-all duration-200"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/10 transition-all duration-200" />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group w-full px-4 py-10 rounded-2xl border-2 border-dashed border-slate-200 bg-white hover:border-[#16a34a] hover:bg-green-50/50 cursor-pointer transition-all duration-300"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-green-100 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-[#16a34a] transition-colors duration-300" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-[#16a34a] transition-colors duration-300">
                      Clique para adicionar foto
                    </p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG até 5MB</p>
                  </div>
                </div>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* Submit */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-4 rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white font-semibold text-base shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/35 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-xl disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Reportar item perdido
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
