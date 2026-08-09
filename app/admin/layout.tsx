'use client'

import { useState, useEffect } from 'react'
import { Lock, ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react'
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
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState(false)

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-green-50/30 px-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse-glow" />
        </div>
        
        <div className="w-full max-w-sm animate-modal-in">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl shadow-slate-200/50 p-8">
            <div className="text-center mb-8">
              <div className="relative w-16 h-16 mx-auto mb-5">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#16a34a] to-[#15803d] animate-pulse-glow" />
                <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#16a34a] to-[#15803d] flex items-center justify-center shadow-xl shadow-green-500/30">
                  <Shield className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Painel Admin</h1>
              <p className="text-sm text-slate-500 mt-2">Digite a senha para acessar</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <div className={`relative transition-all duration-200 ${focused ? 'scale-[1.02]' : ''}`}>
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Digite a senha"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#16a34a] focus:ring-4 focus:ring-green-50 focus:outline-none transition-all duration-200"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={2} /> : <Eye className="w-4 h-4" strokeWidth={2} />}
                  </button>
                </div>
                {error && (
                  <p className="text-red-500 text-sm font-medium animate-shake flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {error}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="group relative w-full py-3.5 rounded-xl bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white font-semibold text-sm shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Entrar</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
            </form>

            <Link
              href="/"
              className="group flex items-center justify-center gap-2 w-full mt-6 py-2 text-sm text-slate-500 hover:text-[#16a34a] transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" strokeWidth={2} />
              Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
