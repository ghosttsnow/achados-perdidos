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
            className={`group inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ease-out ${
              isActive
                ? 'bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white shadow-lg shadow-green-500/25 scale-105'
                : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-green-300 hover:bg-green-50 hover:text-[#16a34a] hover:shadow-md hover:scale-[1.02]'
            }`}
          >
            <span className={`text-lg transition-all duration-300 ease-out ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
              {cat.emoji}
            </span>
            <span>{cat.label}</span>
          </button>
        )
      })}
    </div>
  )
}
