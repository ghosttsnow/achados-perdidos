'use client'

import { Shirt, Laptop, BookOpen, Package, Grid3X3 } from 'lucide-react'

const categories = [
  { value: 'todos', label: 'Todos', icon: Grid3X3 },
  { value: 'uniforme', label: 'Uniforme', icon: Shirt },
  { value: 'eletronico', label: 'Eletrônico', icon: Laptop },
  { value: 'material', label: 'Material', icon: BookOpen },
  { value: 'outro', label: 'Outro', icon: Package },
]

interface CategoryFilterProps {
  selected: string
  onChange: (category: string) => void
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((cat) => {
        const Icon = cat.icon
        const isActive = selected === cat.value
        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-[#16a34a] text-white shadow-sm shadow-green-500/25'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Icon className="w-4 h-4" strokeWidth={2} />
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
