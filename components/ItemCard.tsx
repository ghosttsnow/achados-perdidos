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

export default function ItemCard({ item, index = 0 }: ItemCardProps) {
  const formattedDate = new Date(item.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })

  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:border-slate-200 hover:-translate-y-1 transition-all duration-400 ease-out cursor-pointer"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
        {item.photo_url ? (
          <>
            <img
              src={item.photo_url}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-out" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-400 ease-out">
              <span className="text-3xl">{categoryIcons[item.category] || '📦'}</span>
            </div>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-[11px] font-semibold text-slate-600 shadow-sm border border-white/50 group-hover:bg-white group-hover:shadow-md transition-all duration-300 ease-out">
            {categoryLabels[item.category] || item.category}
          </span>
          <StatusBadge status={item.status} />
        </div>

        {/* Hover Arrow */}
        <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out shadow-sm">
          <ArrowRight className="w-4 h-4 text-slate-600" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="font-bold text-slate-900 mb-1.5 line-clamp-1 group-hover:text-[#16a34a] transition-colors duration-300 ease-out text-base">
          {item.title}
        </h3>
        <p className="text-sm text-slate-500 mb-3 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 group/location">
            <div className="w-6 h-6 rounded-lg bg-slate-50 group-hover/location:bg-green-50 flex items-center justify-center transition-colors duration-300 ease-out">
              <MapPin className="w-3 h-3 group-hover/location:text-[#16a34a] transition-colors duration-300 ease-out" strokeWidth={2} />
            </div>
            <span className="group-hover/location:text-slate-600 transition-colors duration-300 ease-out">{item.location}</span>
          </span>
          <span className="flex items-center gap-1.5 group/date">
            <div className="w-6 h-6 rounded-lg bg-slate-50 group-hover/date:bg-green-50 flex items-center justify-center transition-colors duration-300 ease-out">
              <Calendar className="w-3 h-3 group-hover/date:text-[#16a34a] transition-colors duration-300 ease-out" strokeWidth={2} />
            </div>
            <span className="group-hover/date:text-slate-600 transition-colors duration-300 ease-out">{formattedDate}</span>
          </span>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#16a34a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-out" />
    </div>
  )
}
