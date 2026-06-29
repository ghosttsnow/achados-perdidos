import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'Achados e Perdidos',
  description: 'Encontrou? Perdeu? A gente ajuda.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}