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
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ease-out ${
              isActive
                ? 'bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white shadow-md shadow-green-500/20 scale-[1.02]'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-green-200 dark:hover:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-[#16a34a] dark:hover:text-green-400 hover:shadow-sm hover:scale-[1.01] active:scale-[0.98]'
            }`}
          >
            <span className="text-base transition-transform duration-200">{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        )
      })}
    </div>
  )
}
