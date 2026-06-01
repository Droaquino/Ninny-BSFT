import { cn, cmvStatus } from '@/lib/utils'

const CONFIG = {
  good:    { label: 'Excelente', bg: 'bg-[#03a54e]/10', text: 'text-[#025c2b]', bar: 'bg-[#03a54e]', border: 'border-[#03a54e]/20' },
  warning: { label: 'Atenção',   bg: 'bg-amber-50',     text: 'text-amber-800',  bar: 'bg-amber-400',  border: 'border-amber-200'    },
  danger:  { label: 'Revisar',   bg: 'bg-red-50',       text: 'text-red-800',    bar: 'bg-red-500',    border: 'border-red-200'      },
}

interface CmvBarProps {
  cmvPct: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function CmvBar({ cmvPct, showLabel = true, size = 'md' }: CmvBarProps) {
  const status = cmvStatus(cmvPct)
  const c = CONFIG[status]
  const fill = Math.min((cmvPct / 55) * 100, 100)

  return (
    <div className={cn('rounded-xl border px-3 py-2.5', c.bg, c.border)}>
      <div className="flex items-center justify-between mb-1.5">
        <span className={cn('font-bold tabular-nums', c.text, size === 'sm' ? 'text-sm' : 'text-base')}>
          CMV {cmvPct.toFixed(1)}%
        </span>
        {showLabel && (
          <span className={cn('text-xs font-medium', c.text)}>{c.label}</span>
        )}
      </div>
      <div className="h-1.5 bg-white/70 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-500', c.bar)} style={{ width: `${fill}%` }} />
      </div>
    </div>
  )
}

export function CmvDot({ cmvPct }: { cmvPct: number }) {
  const status = cmvStatus(cmvPct)
  const colors = { good: 'bg-[#03a54e]', warning: 'bg-amber-400', danger: 'bg-red-500' }
  return <span className={cn('inline-block w-2 h-2 rounded-full', colors[status])} />
}
