'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Mail, User, LogOut, Settings, Award, Shield, Heart, BookOpen, GraduationCap, Shirt } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import ItemCard from '@/components/ItemCard'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

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
  const { user, signOut, loading: authLoading } = useAuth()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [email, setEmail] = useState('')
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    if (user) {
      setEmail(user.email || '')
      fetchUserItems()
    }
  }, [user])

  async function fetchUserItems() {
    if (!isSupabaseConfigured()) return
    setLoading(true)
    const { data } = await supabase!
      .from('items')
      .select('*')
      .eq('contact', user?.email)
      .order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
    setSearched(true)
  }

  async function handleSignOut() {
    await signOut()
    setItems([])
    setSearched(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'perdido': return 'bg-orange-100 text-orange-700'
      case 'encontrado': return 'bg-green-100 text-green-700'
      case 'devolvido': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'perdido': return 'Perdido'
      case 'encontrado': return 'Encontrado'
      case 'devolvido': return 'Devolvido'
      default: return status
    }
  }

  const categoryIcons: Record<string, React.ReactNode> = {
    uniforme: <Shirt className="w-4 h-4" />,
    eletronico: <Package className="w-4 h-4" />,
    material: <BookOpen className="w-4 h-4" />,
    outro: <Package className="w-4 h-4" />,
  }

  const categoryLabels: Record<string, string> = {
    uniforme: 'Uniforme',
    eletronico: 'Eletrônico',
    material: 'Material',
    outro: 'Outro',
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl" style={{ color: '#1e3a5f' }}>
              <BookOpen className="w-7 h-7" />
              Achados & Perdidos
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/reportar" className="text-sm font-medium hover:text-blue-600 transition-colors" style={{ color: '#1e3a5f' }}>
                  Reportar Item
                </Link>
                <Link href="/galeria" className="text-sm font-medium hover:text-blue-600 transition-colors" style={{ color: '#1e3a5f' }}>
                  Galeria
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors" style={{ color: '#1e3a5f' }}>
                  Entrar
                </Link>
                <Link href="/cadastro" className="px-4 py-2 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)' }}>
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                    {user?.user_metadata?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user?.user_metadata?.name || 'Usuário'}
                  </h1>
                  <p className="text-gray-600 mt-1">{user?.email}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Conta verificada
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-xl font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <StatCard icon={Package} label="Total" value={items.length} color="from-blue-500 to-blue-600" />
          <StatCard icon={Award} label="Perdidos" value={items.filter(i => i.status === 'perdido').length} color="from-orange-500 to-orange-600" />
          <StatCard icon={Shield} label="Encontrados" value={items.filter(i => i.status === 'encontrado').length} color="from-green-500 to-green-600" />
          <StatCard icon={Award} label="Devolvidos" value={items.filter(i => i.status === 'devolvido').length} color="from-blue-500 to-blue-600" />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="border-b border-gray-100">
            <nav className="flex -mb-px" aria-label="Tabs">
              <button className="flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-all duration-200" style={{ borderColor: '#1e3a5f', color: '#1e3a5f' }}>
                <Package className="w-4 h-4" />
                Meus Itens
              </button>
              <button className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-200 transition-all duration-200" style={{ color: '#1e3a5f' }}>
                <Heart className="w-4 h-4" />
                Favoritos
              </button>
              <button className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-200 transition-all duration-200" style={{ color: '#1e3a5f' }}>
                <Settings className="w-4 h-4" />
                Configurações
              </button>
            </nav>
          </div>

          <div className="p-6">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item ainda</h3>
                <p className="text-gray-500 mb-6">Comece reportando seu primeiro item perdido ou achado!</p>
                <Link
                  href="/reportar"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)' }}
                >
                  <Package className="w-5 h-5" />
                  Reportar Item
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative h-40 bg-gray-50 overflow-hidden">
                      {item.photo_url ? (
                        <img
                          src={item.photo_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          {categoryIcons[item.category] || <Package className="w-10 h-10" />}
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 flex items-center gap-1">
                          {categoryIcons[item.category]}
                          {categoryLabels[item.category] || item.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          {item.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {new Date(item.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    )
  )
}