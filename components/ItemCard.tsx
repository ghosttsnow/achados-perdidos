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
      className="group relative bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/80 hover:border-green-200 hover:-translate-y-2 transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) cursor-pointer"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Image */}
      <div className="h-52 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
        {item.photo_url ? (
          <>
            <img
              src={item.photo_url}
              alt={item.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-white/80 flex items-center justify-center shadow-sm group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)">
              <span className="text-4xl transition-transform duration-500 group-hover:scale-110">{categoryIcons[item.category] || '📦'}</span>
            </div>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-[11px] font-semibold text-slate-600 shadow-sm border border-white/50 group-hover:bg-white group-hover:shadow-lg group-hover:scale-105 transition-all duration-500">
            {categoryLabels[item.category] || item.category}
          </span>
          <div className="transition-all duration-500 group-hover:scale-110">
            <StatusBadge status={item.status} />
          </div>
        </div>

        {/* Hover Arrow */}
        <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 rotate-[-45deg] group-hover:rotate-0 transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) shadow-lg">
          <ArrowRight className="w-5 h-5 text-[#16a34a]" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <h3 className="font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-[#16a34a] transition-colors duration-500 text-lg">
          {item.title}
        </h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed group-hover:text-slate-600 transition-colors duration-300">
          {item.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 group/location">
            <div className="w-7 h-7 rounded-xl bg-slate-50 group-hover/location:bg-green-50 flex items-center justify-center transition-all duration-500 group-hover/location:scale-110">
              <MapPin className="w-3.5 h-3.5 group-hover/location:text-[#16a34a] transition-colors duration-300" strokeWidth={2} />
            </div>
            <span className="group-hover/location:text-slate-600 transition-colors duration-300">{item.location}</span>
          </span>
          <span className="flex items-center gap-1.5 group/date">
            <div className="w-7 h-7 rounded-xl bg-slate-50 group-hover/date:bg-green-50 flex items-center justify-center transition-all duration-500 group-hover/date:scale-110">
              <Calendar className="w-3.5 h-3.5 group-hover/date:text-[#16a34a] transition-colors duration-300" strokeWidth={2} />
            </div>
            <span className="group-hover/date:text-slate-600 transition-colors duration-300">{formattedDate}</span>
          </span>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#16a34a] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
    </div>
  )
}
