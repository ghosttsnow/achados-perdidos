'use client'

import { Shirt, Laptop, BookOpen, Package } from 'lucide-react'

const categories = [
  { value: 'todos', label: 'Todos', icon: Package },
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
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const Icon = cat.icon
        const isActive = selected === cat.value
        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/25'
                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
