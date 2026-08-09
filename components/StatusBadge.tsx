interface StatusBadgeProps {
  status: 'perdido' | 'encontrado' | 'devolvido'
}

const statusConfig = {
  perdido: { label: 'Perdido', color: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' },
  encontrado: { label: 'Encontrado', color: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' },
  devolvido: { label: 'Devolvido', color: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-300 ease-out hover:scale-105 ${config.color}`}>
      {config.label}
    </span>
  )
}
