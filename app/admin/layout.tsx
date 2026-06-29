'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

const ADMIN_PASSWORD = 'achados2024'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#1e3a5f' }}>
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
              <p className="text-gray-600 mt-1">Digite a senha para acessar</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg text-white font-medium transition-all duration-200 hover:scale-[1.02]"
                style={{ backgroundColor: '#1e3a5f' }}
              >
                Entrar
              </button>
            </form>

            <button
              onClick={() => router.push('/')}
              className="w-full mt-4 py-2 text-gray-600 text-sm hover:text-gray-900 transition-colors"
            >
              ← Voltar ao site
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
