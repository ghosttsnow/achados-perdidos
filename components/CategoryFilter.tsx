'use client'

const categories = [
  { value: 'todos', label: 'Todos', emoji: '🎯' },
  { value: 'uniforme', label: 'Uniforme', emoji: '👕' },
  { value: 'eletronico', label: 'Eletrônico', emoji: '📱' },
  { value: 'material', label: 'Material', emoji: '📚' },
  { value: 'outro', label: 'Outro', emoji: '📦' },
]

interface CategoryFilterProps {
  selected: string
  onChange: (category: string) => void
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {categories.map((cat) => {
        const isActive = selected === cat.value
        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={`group inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white shadow-lg shadow-green-500/25 scale-[1.02]'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md hover:scale-[1.01]'
            }`}
          >
            <span className={`text-base transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
              {cat.emoji}
            </span>
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
