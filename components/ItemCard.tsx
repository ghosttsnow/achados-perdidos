'use client'

import { MapPin, Calendar, Package } from 'lucide-react'
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

const categoryLabels: Record<string, string> = {
  uniforme: 'Uniforme',
  eletronico: 'Eletrônico',
  material: 'Material',
  outro: 'Outro',
}

export default function ItemCard({ item, index = 0 }: ItemCardProps) {
  const formattedDate = new Date(item.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })

  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-slate-200/60 hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      {/* Image */}
      <div className="h-44 bg-slate-50 relative overflow-hidden">
        {item.photo_url ? (
          <img
            src={item.photo_url}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-slate-200" strokeWidth={1} />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-slate-600 shadow-sm">
            {categoryLabels[item.category] || item.category}
          </span>
          <StatusBadge status={item.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1 group-hover:text-[#2563eb] transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-slate-500 mb-3 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
            {item.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  )
}
