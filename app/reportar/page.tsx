'use client'

import { useState } from 'react'
import { ArrowLeft, CheckCircle, Upload, X, User, FileText, MapPin, Mail, Tag } from 'lucide-react'
import Link from 'next/link'
import { createItem } from '@/lib/storage'

const categories = [
  { value: 'uniforme', label: 'Uniforme' },
  { value: 'eletronico', label: 'Eletrônico' },
  { value: 'material', label: 'Material' },
  { value: 'outro', label: 'Outro' },
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
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="text-center animate-scale-in max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Item reportado!</h1>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Quando alguém encontrar, você será notificado por email.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563eb] text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:bg-[#1d4ed8] hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 h-16">
            <Link
              href="/"
              className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            </Link>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">Reportar item perdido</h1>
              <p className="text-xs text-slate-400">Descreva o item para ajudar a encontrar</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <User className="w-4 h-4 text-slate-400" strokeWidth={2} />
              Seu nome
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como você se chama?"
              className="input-premium"
            />
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FileText className="w-4 h-4 text-slate-400" strokeWidth={2} />
              Título do item
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Caderno azul, Kimono preto..."
              className="input-premium"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FileText className="w-4 h-4 text-slate-400" strokeWidth={2} />
              Descrição
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o item com detalhes: cor, marca, características..."
              rows={3}
              className="input-premium resize-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Tag className="w-4 h-4 text-slate-400" strokeWidth={2} />
              Categoria
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                    category === cat.value
                      ? 'border-[#2563eb] bg-blue-50 text-[#2563eb]'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400" strokeWidth={2} />
              Local
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Sala 5, Biblioteca, Pátio..."
              className="input-premium"
            />
          </div>

          {/* Contact */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Mail className="w-4 h-4 text-slate-400" strokeWidth={2} />
              Email para contato
            </label>
            <input
              type="email"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="seu@email.com"
              className="input-premium"
            />
          </div>

          {/* Photo */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Upload className="w-4 h-4 text-slate-400" strokeWidth={2} />
              Foto <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            {photo ? (
              <div className="relative inline-block">
                <img src={photo} alt="Preview" className="h-32 rounded-xl object-cover ring-2 ring-slate-100" />
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-3 w-full px-4 py-8 rounded-xl border-2 border-dashed border-slate-200 bg-white hover:border-[#2563eb] hover:bg-blue-50/50 cursor-pointer transition-all duration-200 group">
                <Upload className="w-5 h-5 text-slate-400 group-hover:text-[#2563eb] transition-colors" strokeWidth={2} />
                <span className="text-sm text-slate-500 group-hover:text-[#2563eb] transition-colors font-medium">Clique para adicionar foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 mt-4"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              'Reportar item perdido'
            )}
          </button>
        </form>
      </main>
    </div>
  )
}
