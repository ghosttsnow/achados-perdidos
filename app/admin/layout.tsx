'use client'

import { useState, useEffect } from 'react'
import { Lock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const ADMIN_PASSWORD = 'achados2024'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('admin-auth')
    if (isLoggedIn === 'true') {
      setAuthenticated(true)
    }
  }, [])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin-auth', 'true')
      setAuthenticated(true)
      setError('')
    } else {
      setError('Senha incorreta')
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
        <div className="w-full max-w-sm animate-scale-in">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#2563eb] flex items-center justify-center mx-auto mb-4 shadow-sm shadow-blue-500/20">
                <Lock className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Painel Admin</h1>
              <p className="text-sm text-slate-500 mt-1">Digite a senha para acessar</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha"
                  className="input-premium"
                  autoFocus
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2 animate-shake">{error}</p>
                )}
              </div>
              <button
                type="submit"
                className="btn-primary w-full"
              >
                Entrar
              </button>
            </form>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full mt-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
