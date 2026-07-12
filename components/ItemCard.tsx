'use client'

import { MapPin, Calendar } from 'lucide-react'
import StatusBadge from './StatusBadge'

interface Item {
  id: string
  title: string
  description: string
  category: string
  photo_url: string | null
  location: string
  status: 'perdido' | 'encontrado' | 'devolvido'
  reported_by: string
  created_at: string
}

interface ItemCardProps {
  item: Item
  index?: number
}

const categoryColors: Record<string, string> = {
  uniforme: 'bg-purple-100 text-purple-700',
  eletronico: 'bg-blue-100 text-blue-700',
  material: 'bg-amber-100 text-amber-700',
  outro: 'bg-gray-100 text-gray-600',
}

export default function ItemCard({ item, index = 0 }: ItemCardProps) {
  const formattedDate = new Date(item.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer animate-fade-in-up hover:-translate-y-1 group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {item.photo_url ? (
          <img
            src={item.photo_url}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-200 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <StatusBadge status={item.status} />
        </div>
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${categoryColors[item.category] || categoryColors.outro}`}>
            {item.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#2563eb] transition-colors">{item.title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {item.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  )
}
