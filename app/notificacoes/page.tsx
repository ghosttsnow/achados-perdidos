'use client'

import { useState } from 'react'
import { Bell, BellOff, Mail, X } from 'lucide-react'
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
  const [successToast, setSuccessToast] = useState<string | null>(null)

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
    setSuccessToast('Notificação marcada como lida!')
    setTimeout(() => setSuccessToast(null), 2500)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3" style={{ color: '#1e3a5f' }}>
          <Bell className="w-8 h-8 animate-float" style={{ color: '#1e3a5f' }} />
          Notificações
        </h1>
        <p className="text-gray-600 mb-8">
          Veja as atualizações sobre seus itens reportados.
        </p>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email para ver notificações"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none hover:border-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-xl text-white font-medium transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-lg shadow-blue-900/20"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Buscando...
                </span>
              ) : 'Buscar'}
            </button>
          </div>
        </form>

        {searched && (
          <div>
            {notifications.length === 0 ? (
              <div className="text-center py-20 animate-fade-in-up">
                <div className="relative inline-block">
                  <BellOff className="w-20 h-20 text-gray-200 mx-auto mb-4 animate-float" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhuma notificação</h3>
                <p className="text-gray-500">Você receberá notificações quando seus itens forem encontrados.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif, i) => (
                  <div
                    key={notif.id}
                    onClick={() => !notif.read && handleMarkRead(notif.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 animate-fade-in-up ${
                      notif.read
                        ? 'bg-white border-gray-200 hover:shadow-md'
                        : 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:shadow-lg'
                    } ${!notif.read ? 'hover:-translate-y-0.5' : ''}`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-full transition-all duration-200 ${notif.read ? 'bg-gray-100' : 'bg-blue-100'}`}>
                        <Bell className={`w-4 h-4 ${notif.read ? 'text-gray-500' : 'text-blue-600'}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${notif.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1.5">
                          {new Date(notif.created_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-2 animate-pulse-subtle" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium bg-green-600 text-white animate-slide-in-right">
          <Bell className="w-5 h-5" />
          {successToast}
          <button onClick={() => setSuccessToast(null)} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
