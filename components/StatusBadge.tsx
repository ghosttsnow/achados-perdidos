interface StatusBadgeProps {
  status: 'perdido' | 'encontrado' | 'devolvido'
}

const statusConfig = {
  perdido: { label: 'Perdido', color: 'bg-orange-100 text-orange-700' },
  encontrado: { label: 'Encontrado', color: 'bg-green-100 text-green-700' },
  devolvido: { label: 'Devolvido', color: 'bg-blue-100 text-blue-700' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}
