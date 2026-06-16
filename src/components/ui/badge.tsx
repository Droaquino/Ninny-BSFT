import { cn } from '@/lib/utils'
import type { Category } from '@/types/database'
import { CATEGORY_LABELS } from '@/types/database'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'good' | 'warning' | 'danger'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-stone-100 text-stone-700',
        variant === 'good' && 'bg-[#03a54e]/10 text-[#025c2b]',
        variant === 'warning' && 'bg-amber-100 text-amber-700',
        variant === 'danger' && 'bg-red-100 text-red-700',
        className
      )}
    >
      {children}
    </span>
  )
}

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <Badge className="bg-[#03a54e]/10 text-[#03a54e]">
      {CATEGORY_LABELS[category]}
    </Badge>
  )
}
