'use client'

import { MapPin, Calendar, ArrowRight } from 'lucide-react'
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

const categoryIcons: Record<string, string> = {
  uniforme: '👕',
  eletronico: '📱',
  material: '📚',
  outro: '📦',
}

export default function ItemCard({ item }: ItemCardProps) {
  const formattedDate = new Date(item.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })

  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-200 transition-all duration-200 ease-out cursor-pointer"
    >
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
        {item.photo_url ? (
          <>
            <img
              src={item.photo_url}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm transition-transform duration-200 ease-out group-hover:scale-105">
              <span className="text-2xl">{categoryIcons[item.category] || '📦'}</span>
            </div>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-slate-600 shadow-sm">
            {categoryLabels[item.category] || item.category}
          </span>
          <StatusBadge status={item.status} />
        </div>

        {/* Hover Arrow */}
        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 ease-out shadow-sm">
          <ArrowRight className="w-4 h-4 text-slate-600" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-[#16a34a] transition-colors duration-200 ease-out text-base">
          {item.title}
        </h3>
        <p className="text-sm text-slate-500 mb-3 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3" strokeWidth={2} />
            {item.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" strokeWidth={2} />
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  )
}
