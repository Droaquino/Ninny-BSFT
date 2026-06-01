import { cn, cmvStatus, formatPercent } from '@/lib/utils'

interface CmvIndicatorProps {
  cmvPct: number
  showLabel?: boolean
  size?: 'sm' | 'md'
}

const STATUS_CONFIG = {
  good: {
    label: 'Saudável',
    bar: 'bg-green-500',
    text: 'text-green-700',
    bg: 'bg-green-50',
  },
  warning: {
    label: 'Atenção',
    bar: 'bg-yellow-400',
    text: 'text-yellow-700',
    bg: 'bg-yellow-50',
  },
  danger: {
    label: 'Alto',
    bar: 'bg-red-500',
    text: 'text-red-700',
    bg: 'bg-red-50',
  },
}

export function CmvIndicator({ cmvPct, showLabel = true, size = 'md' }: CmvIndicatorProps) {
  const status = cmvStatus(cmvPct)
  const config = STATUS_CONFIG[status]
  const barWidth = Math.min(cmvPct, 60) / 60 * 100

  return (
    <div className={cn('rounded-lg p-3', config.bg, size === 'sm' && 'p-2')}>
      <div className="flex items-center justify-between mb-1.5">
        <span className={cn('font-semibold', config.text, size === 'sm' ? 'text-sm' : 'text-base')}>
          CMV {formatPercent(cmvPct)}
        </span>
        {showLabel && (
          <span className={cn('text-xs font-medium', config.text)}>
            {config.label}
          </span>
        )}
      </div>
      <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', config.bar)}
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  )
}
