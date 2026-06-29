'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Notification {
  id: string
  message: string
  read: boolean
  created_at: string
  item_id: string
  items?: {
    title: string
    status: string
  }
}

export default function NotificacoesPage() {
  const [email, setEmail] = useState('')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSearched(true)

    const { data } = await supabase
      .from('notifications')
      .select('*, items(title, status)')
      .order('created_at', { ascending: false })

    setNotifications(data || [])
    setLoading(false)
  }

  async function markAsRead(id: string) {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)

    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1e3a5f' }}>
          Notificações
        </h1>
        <p className="text-gray-600 mb-8">
          Veja as atualizações sobre seus itens reportados.
        </p>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email para ver notificações"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 hover:scale-[1.02]"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>

        {searched && (
          <div>
            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <BellOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notificação</h3>
                <p className="text-gray-500">Você receberá notificações quando seus itens forem encontrados.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {notifications.map((notif, i) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      onClick={() => !notif.read && markAsRead(notif.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        notif.read
                          ? 'bg-white border-gray-200'
                          : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${notif.read ? 'bg-gray-100' : 'bg-blue-100'}`}>
                          <Bell className={`w-4 h-4 ${notif.read ? 'text-gray-500' : 'text-blue-600'}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${notif.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notif.created_at).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
