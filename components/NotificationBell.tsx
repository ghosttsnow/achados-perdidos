'use client'

import { Bell } from 'lucide-react'
import Link from 'next/link'

export default function NotificationBell() {
  return (
    <Link
      href="/notificacoes"
      className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
    >
      <Bell className="w-5 h-5" />
    </Link>
  )
}
