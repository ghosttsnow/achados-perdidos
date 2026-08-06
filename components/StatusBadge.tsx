interface StatusBadgeProps {
  status: 'perdido' | 'encontrado' | 'devolvido'
}

const statusConfig = {
  perdido: { label: 'Perdido', color: 'bg-orange-500 text-white' },
  encontrado: { label: 'Encontrado', color: 'bg-emerald-500 text-white' },
  devolvido: { label: 'Devolvido', color: 'bg-[#2563eb] text-white' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold shadow-sm ${config.color}`}>
      {config.label}
    </span>
  )
}
