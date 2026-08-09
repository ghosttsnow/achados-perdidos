'use client'

import { Bell } from 'lucide-react'
import Link from 'next/link'

export default function NotificationBell() {
  return (
    <Link
      href="/notificacoes"
      className="relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
    >
      <Bell className="w-5 h-5" />
    </Link>
  )
}
