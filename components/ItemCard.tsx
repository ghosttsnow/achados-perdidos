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
  uniforme: 'bg-purple-50 text-purple-700',
  eletronico: 'bg-blue-50 text-blue-700',
  material: 'bg-amber-50 text-amber-700',
  outro: 'bg-gray-50 text-gray-700',
}

export default function ItemCard({ item, index = 0 }: ItemCardProps) {
  const formattedDate = new Date(item.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="h-48 bg-gray-100 relative overflow-hidden">
        {item.photo_url ? (
          <img
            src={item.photo_url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{item.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[item.category] || 'bg-gray-50 text-gray-700'}`}>
            {item.category}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {item.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  )
}
