'use client'

import { useState, Suspense } from 'react'
import { Mail, Lock, Eye, EyeOff, User, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

function LoginForm() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
    } else {
      document.cookie = 'cbn_session=1; path=/; max-age=2592000'
      router.push('/home')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4 py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-xl" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}>
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo!</h1>
          <p className="text-gray-600">Entre na sua conta para acessar o sistema</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none bg-gray-50"
                  disabled={loading}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none bg-gray-50"
                  disabled={loading}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl animate-fade-in">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold text-white text-lg bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">ou</span>
            </div>
          </div>

          <Link
            href="/cadastro"
            className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-[#2563eb] hover:text-[#2563eb] text-gray-700"
          >
            <User className="w-5 h-5" />
            Criar conta
          </Link>

          <div className="mt-8 p-4 rounded-xl text-center bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100">
            <BookOpen className="w-5 h-5 mx-auto mb-2 text-[#2563eb]" />
            <p className="text-sm text-gray-600">Colégio Batista Nova Betânia</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
