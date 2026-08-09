'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Lock, User, GraduationCap, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'
import { createUser, findUserByEmail, saveSession, getSession, StoredUser } from '@/lib/storage'

interface AuthPopupProps {
  onAuth: (user: StoredUser) => void
}

export default function AuthPopup({ onAuth }: AuthPopupProps) {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState<'ask' | 'login' | 'register' | 'success'>('ask')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [className, setClassName] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (session) {
      onAuth(session)
      return
    }
    const alreadyAsked = localStorage.getItem('cbn_auth_asked')
    if (!alreadyAsked) {
      setTimeout(() => setVisible(true), 800)
    }
  }, [onAuth])

  function handleClose() {
    setVisible(false)
    localStorage.setItem('cbn_auth_asked', 'true')
    onAuth({ id: 'guest', email: '', password: '', name: 'Visitante', createdAt: '' })
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const user = findUserByEmail(email)
    if (!user) {
      setError('Email não encontrado. Você já se cadastrou?')
      return
    }
    if (user.password !== password) {
      setError('Senha incorreta')
      return
    }
    saveSession(user)
    setStep('success')
    setTimeout(() => {
      setVisible(false)
      onAuth(user)
    }, 1500)
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Digite seu nome'); return }
    if (!email.trim()) { setError('Digite seu email'); return }
    if (!password.trim() || password.length < 4) { setError('Senha deve ter pelo menos 4 caracteres'); return }
    
    const existing = findUserByEmail(email)
    if (existing) {
      setError('Este email já está cadastrado. Faça login!')
      return
    }

    const user = createUser(email, password, name, className)
    saveSession(user)
    setStep('success')
    setTimeout(() => {
      setVisible(false)
      onAuth(user)
    }, 1500)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md animate-bounce-in">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 border border-white/50 overflow-hidden">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 hover:scale-110 active:scale-95 transition-all duration-200 z-10"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>

          {/* Success State */}
          {step === 'success' && (
            <div className="p-8 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-400 to-[#16a34a] animate-pulse-glow" />
                <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-green-400 to-[#16a34a] flex items-center justify-center shadow-xl shadow-green-500/30">
                  <CheckCircle className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Bem-vindo!</h3>
              <p className="text-sm text-slate-500">Redirecionando...</p>
            </div>
          )}

          {/* Ask Step */}
          {step === 'ask' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="relative w-20 h-20 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#16a34a] to-[#15803d] animate-pulse-glow" />
                  <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-[#16a34a] to-[#15803d] flex items-center justify-center shadow-xl shadow-green-500/30">
                    <Sparkles className="w-9 h-9 text-white" strokeWidth={2} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Achados & Perdidos</h2>
                <p className="text-sm text-slate-500">Colégio Batista Nova Betânia</p>
              </div>

              <p className="text-center text-slate-600 mb-6 text-sm">
                Você já está cadastrado no sistema?
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setStep('login')}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white font-semibold text-base shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Lock className="w-5 h-5" />
                  Sim, já tenho conta
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setStep('register')}
                  className="w-full py-4 rounded-2xl bg-white text-slate-700 font-semibold text-base border-2 border-slate-200 hover:border-[#16a34a] hover:bg-green-50 hover:text-[#16a34a] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <User className="w-5 h-5" />
                  Não, quero me cadastrar
                </button>
              </div>

              <button
                onClick={handleClose}
                className="w-full mt-4 py-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                Pular por agora
              </button>
            </div>
          )}

          {/* Login Step */}
          {step === 'login' && (
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#16a34a] to-[#15803d] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
                  <Lock className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Entrar</h2>
                <p className="text-sm text-slate-500 mt-1">Use seu email e senha</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#16a34a] focus:ring-4 focus:ring-green-50 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#16a34a] focus:ring-4 focus:ring-green-50 focus:outline-none transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <Lock className="w-4 h-4" strokeWidth={2} /> : <Lock className="w-4 h-4" strokeWidth={2} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-medium animate-shake flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white font-semibold text-sm shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Entrar
                </button>
              </form>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => { setStep('ask'); setError(''); setEmail(''); setPassword('') }}
                  className="text-sm text-slate-500 hover:text-[#16a34a] transition-colors"
                >
                  ← Voltar
                </button>
                <span className="text-slate-300">·</span>
                <button
                  onClick={() => { setStep('register'); setError('') }}
                  className="text-sm text-[#16a34a] hover:text-[#15803d] font-medium transition-colors"
                >
                  Criar conta
                </button>
              </div>
            </div>
          )}

          {/* Register Step */}
          {step === 'register' && (
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#16a34a] to-[#15803d] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
                  <User className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Cadastrar</h2>
                <p className="text-sm text-slate-500 mt-1">Crie sua conta gratuita</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Nome completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#16a34a] focus:ring-4 focus:ring-green-50 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#16a34a] focus:ring-4 focus:ring-green-50 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Turma <span className="text-slate-400 font-normal">(opcional)</span></label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2} />
                    <input
                      type="text"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      placeholder="Ex: 3° ano A"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#16a34a] focus:ring-4 focus:ring-green-50 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 4 caracteres"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#16a34a] focus:ring-4 focus:ring-green-50 focus:outline-none transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <Lock className="w-4 h-4" strokeWidth={2} /> : <Lock className="w-4 h-4" strokeWidth={2} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-medium animate-shake flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white font-semibold text-sm shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Criar conta
                </button>
              </form>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => { setStep('ask'); setError(''); setEmail(''); setPassword(''); setName(''); setClassName('') }}
                  className="text-sm text-slate-500 hover:text-[#16a34a] transition-colors"
                >
                  ← Voltar
                </button>
                <span className="text-slate-300">·</span>
                <button
                  onClick={() => { setStep('login'); setError('') }}
                  className="text-sm text-[#16a34a] hover:text-[#15803d] font-medium transition-colors"
                >
                  Já tenho conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
