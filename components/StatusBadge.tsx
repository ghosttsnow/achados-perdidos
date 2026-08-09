interface StatusBadgeProps {
  status: 'perdido' | 'encontrado' | 'devolvido'
}

const statusConfig = {
  perdido: { label: 'Perdido', color: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm' },
  encontrado: { label: 'Encontrado', color: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm' },
  devolvido: { label: 'Devolvido', color: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide ${config.color}`}>
      {config.label}
    </span>
  )
}
