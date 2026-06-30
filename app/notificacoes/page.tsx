'use client'

import { useState } from 'react'
import { Bell, BellOff, Mail } from 'lucide-react'
import { getNotifications, markNotificationRead } from '@/lib/storage'

interface Notification {
  id: string
  message: string
  read: boolean
  created_at: string
  item_id: string
}

export default function NotificacoesPage() {
  const [email, setEmail] = useState('')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSearched(true)

    const all = getNotifications().sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    setNotifications(all)
    setLoading(false)
  }

  function handleMarkRead(id: string) {
    markNotificationRead(id)
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="animate-fade-in-up">
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
                type="text"
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
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => !notif.read && handleMarkRead(notif.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 animate-fade-in-up ${
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}