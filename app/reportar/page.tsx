'use client'

import { useState, useEffect } from 'react'
import { Send, Upload, Shirt, Laptop, BookOpen, Package, AlertCircle, CheckCircle } from 'lucide-react'
import { createItem } from '@/lib/storage'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

const categories = [
  { value: 'uniforme', label: 'Uniforme', icon: Shirt },
  { value: 'eletronico', label: 'Eletrônico', icon: Laptop },
  { value: 'material', label: 'Material', icon: BookOpen },
  { value: 'outro', label: 'Outro', icon: Package },
]

interface ValidationErrors {
  title?: string
  description?: string
  location?: string
  reported_by?: string
  contact?: string
}

export default function ReportarPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'uniforme',
    location: '',
    reported_by: '',
    contact: '',
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        reported_by: prev.reported_by || user.user_metadata?.name || '',
        contact: prev.contact || user.email || '',
      }))
    }
  }, [user])

  function isRealWord(word: string): boolean {
    const lower = word.toLowerCase()
    
    if (lower.length < 3) return false
    
    const repeatedChars = /(.)\1{2,}/
    if (repeatedChars.test(lower)) return false
    
    const gibberishPatterns = /^[bcdfghjklmnpqrstvxyz]{3,}$/i
    if (gibberishPatterns.test(lower)) return false
    
    const keyboardPatterns = /^(qwerty|asdf|zxcv|qazwsx|123|abc|def|ghi|jkl|mno|pqr|stu|vwx|yza)/i
    if (keyboardPatterns.test(lower)) return false
    
    const vowels = lower.match(/[aeiou]/g) || []
    const consonants = lower.match(/[bcdfghjklmnpqrstvxyz]/g) || []
    
    if (vowels.length === 0 && consonants.length >= 3) return false
    if (consonants.length > vowels.length * 3) return false
    
    return true
  }

  function validateField(name: string, value: string): string | undefined {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'O nome do item é obrigatório'
        if (value.trim().length < 3) return 'O nome deve ter pelo menos 3 caracteres'
        if (value.trim().length > 100) return 'O nome deve ter no máximo 100 caracteres'
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value.trim())) return 'Use apenas letras e espaços'
        
        const words = value.trim().split(/\s+/)
        if (words.length < 1) return 'Digite um nome válido para o item'
        
        for (const word of words) {
          if (!isRealWord(word)) {
            return 'Digite um nome real para o item (ex: Kimono, Caderneta, Mochila)'
          }
        }
        return undefined
      
      case 'description':
        if (!value.trim()) return 'A descrição é obrigatória'
        if (value.trim().length > 500) return 'A descrição deve ter no máximo 500 caracteres'
        return undefined
      
      case 'location':
        if (!value.trim()) return 'O local é obrigatório'
        if (value.trim().length < 3) return 'O local deve ter pelo menos 3 caracteres'
        if (!/^[a-zA-ZÀ-ÿ\s0-9]+$/.test(value.trim())) return 'Use apenas letras, números e espaços'
        
        const locationWords = value.trim().split(/\s+/)
        for (const word of locationWords) {
          if (word.length >= 3 && !isRealWord(word)) {
            return 'Digite um local válido (ex: Pátio, Sala 3B, Biblioteca)'
          }
        }
        return undefined
      
      case 'reported_by':
        if (!value.trim()) return 'Seu nome é obrigatório'
        if (value.trim().length < 3) return 'O nome deve ter pelo menos 3 caracteres'
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value.trim())) return 'Use apenas letras e espaços'
        
        const nameWords = value.trim().split(/\s+/)
        if (nameWords.length < 2) return 'Digite seu nome completo'
        
        for (const word of nameWords) {
          if (!isRealWord(word)) {
            return 'Digite um nome real (ex: João Silva)'
          }
        }
        return undefined
      
      case 'contact':
        if (!value.trim()) return 'O email é obrigatório'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Email inválido'
        return undefined
      
      default:
        return undefined
    }
  }

  function validateAll(): ValidationErrors {
    const newErrors: ValidationErrors = {}
    
    const titleError = validateField('title', formData.title)
    if (titleError) newErrors.title = titleError
    
    const descError = validateField('description', formData.description)
    if (descError) newErrors.description = descError
    
    const locError = validateField('location', formData.location)
    if (locError) newErrors.location = locError
    
    const nameError = validateField('reported_by', formData.reported_by)
    if (nameError) newErrors.reported_by = nameError
    
    const emailError = validateField('contact', formData.contact)
    if (emailError) newErrors.contact = emailError
    
    return newErrors
  }

  function handleBlur(name: string) {
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, formData[name as keyof typeof formData])
    setErrors(prev => {
      const newErrors = { ...prev }
      if (error) {
        newErrors[name as keyof ValidationErrors] = error
      } else {
        delete newErrors[name as keyof ValidationErrors]
      }
      return newErrors
    })
  }

  function handleChange(name: string, value: string) {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => {
        const newErrors = { ...prev }
        if (error) {
          newErrors[name as keyof ValidationErrors] = error
        } else {
          delete newErrors[name as keyof ValidationErrors]
        }
        return newErrors
      })
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('A foto deve ter no máximo 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const newErrors = validateAll()
    setErrors(newErrors)
    setTouched({ title: true, description: true, location: true, reported_by: true, contact: true })
    
    if (Object.keys(newErrors).length > 0) {
      return
    }

    setSubmitting(true)

    createItem({
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      location: formData.location.trim(),
      reported_by: formData.reported_by.trim(),
      contact: formData.contact.trim(),
      photo_url: photoPreview,
      status: 'perdido',
    })

    setSuccess(true)
    setSubmitting(false)
  }

  function getFieldStatus(name: string): 'error' | 'valid' | 'neutral' {
    if (!touched[name]) return 'neutral'
    if (errors[name as keyof ValidationErrors]) return 'error'
    if (formData[name as keyof typeof formData]?.trim()) return 'valid'
    return 'neutral'
  }

  function getInputClasses(name: string) {
    const status = getFieldStatus(name)
    const baseClasses = 'w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none'
    
    switch (status) {
      case 'error':
        return `${baseClasses} border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200 focus:border-red-400`
      case 'valid':
        return `${baseClasses} border-green-300 bg-green-50 focus:ring-2 focus:ring-green-200 focus:border-green-400`
      default:
        return `${baseClasses} border-gray-200 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 hover:border-gray-300`
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-bounce-in">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Item reportado com sucesso!
        </h2>
        <p className="text-gray-600 mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          Quando alguém encontrar, você será notificado por email.
        </p>
        <Link
          href="/home"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          Voltar ao início
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="animate-fade-in-up">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reportar item perdido
          </h1>
          <p className="text-gray-600">
            Preencha as informações abaixo para ajudar a encontrar seu item.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome do item */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do item *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                onBlur={() => handleBlur('title')}
                placeholder="Ex: Kimono preto, Caderneta azul, Mochila..."
                className={getInputClasses('title')}
              />
              {getFieldStatus('title') === 'valid' && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {getFieldStatus('title') === 'error' && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {errors.title && touched.title && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição *</label>
            <div className="relative">
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                placeholder="Descreva o item com detalhes: cor, marca, tamanho..."
                className={`${getInputClasses('description')} resize-none`}
              />
              {getFieldStatus('description') === 'valid' && (
                <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-500" />
              )}
              {getFieldStatus('description') === 'error' && (
                <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
              )}
            </div>
            {errors.description && touched.description && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {errors.description}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400">{formData.description.length}/500 caracteres</p>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Categoria *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon
                const isSelected = formData.category === cat.value
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-[#2563eb] bg-blue-50 text-[#2563eb] shadow-md shadow-blue-500/10'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Local */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Onde perdeu? *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                onBlur={() => handleBlur('location')}
                placeholder="Ex: Pátio principal, Sala 3B, Biblioteca..."
                className={getInputClasses('location')}
              />
              {getFieldStatus('location') === 'valid' && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {getFieldStatus('location') === 'error' && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {errors.location && touched.location && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {errors.location}
              </p>
            )}
          </div>

          {/* Foto */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Foto (opcional)</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#2563eb] hover:bg-blue-50/50 transition-all duration-200">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {photoPreview ? 'Foto adicionada ✓' : 'Clique para adicionar foto'}
                </span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
              {photoPreview && (
                <div className="relative">
                  <img src={photoPreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl ring-2 ring-green-200" />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Seu nome *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.reported_by}
                onChange={(e) => handleChange('reported_by', e.target.value)}
                onBlur={() => handleBlur('reported_by')}
                placeholder="Nome completo"
                className={getInputClasses('reported_by')}
              />
              {getFieldStatus('reported_by') === 'valid' && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {getFieldStatus('reported_by') === 'error' && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {errors.reported_by && touched.reported_by && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {errors.reported_by}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Seu email para notificações *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.contact}
                onChange={(e) => handleChange('contact', e.target.value)}
                onBlur={() => handleBlur('contact')}
                placeholder="seu@email.com"
                className={getInputClasses('contact')}
              />
              {getFieldStatus('contact') === 'valid' && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {getFieldStatus('contact') === 'error' && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {errors.contact && touched.contact && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {errors.contact}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400">Você receberá um email quando seu item for encontrado</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || Object.keys(errors).length > 0}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Reportar item
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
