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
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ease-out ${
              isActive
                ? 'bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white shadow-md shadow-green-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-green-200 hover:bg-green-50 hover:text-[#16a34a]'
            }`}
          >
            <span className="text-base">{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        )
      })}
    </div>
  )
}
