import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  sub?: string
  icon: LucideIcon
  color?: 'green' | 'yellow' | 'red' | 'neutral'
  className?: string
}

const COLOR = {
  green:   { bg: 'bg-[#03a54e]/10', icon: 'text-[#03a54e]', value: 'text-[#025c2b]' },
  yellow:  { bg: 'bg-amber-50',     icon: 'text-amber-500',  value: 'text-amber-700' },
  red:     { bg: 'bg-red-50',       icon: 'text-red-500',    value: 'text-red-700'   },
  neutral: { bg: 'bg-stone-50',     icon: 'text-stone-400',  value: 'text-stone-800' },
}

export function MetricCard({ label, value, sub, icon: Icon, color = 'neutral', className }: MetricCardProps) {
  const c = COLOR[color]
  return (
    <div className={cn('bg-white rounded-2xl border border-stone-100 p-5 flex items-start gap-4', className)}>
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', c.bg)}>
        <Icon size={20} className={c.icon} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-1">{label}</p>
        <p className={cn('text-2xl font-bold leading-tight', c.value)}>{value}</p>
        {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
