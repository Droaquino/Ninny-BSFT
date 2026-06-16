import { UtensilsCrossed } from 'lucide-react'
import type { ReactNode } from 'react'

/** Spinner centralizado padrão das páginas. */
export function LoadingState({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="w-9 h-9 border-[3px] border-[#03a54e] border-t-transparent rounded-full animate-spin" />
      <p className="text-stone-400 text-sm">{label}</p>
    </div>
  )
}

/** Skeleton de cartões para grades (ex.: fichas). */
export function CardSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-stone-100 p-5 animate-pulse">
          <div className="h-5 bg-stone-100 rounded w-2/3 mb-3" />
          <div className="h-4 bg-stone-100 rounded w-1/2 mb-4" />
          <div className="h-10 bg-stone-100 rounded" />
        </div>
      ))}
    </div>
  )
}

/** Skeleton de linhas para tabelas. */
export function RowSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="p-6 space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-12 bg-stone-50 rounded-xl animate-pulse" />
      ))}
    </div>
  )
}

/** Estado vazio amigável, sem jargão técnico. */
export function EmptyState({
  title = 'Nada por aqui ainda',
  message = 'Quando houver itens, eles aparecem aqui.',
  icon,
  action,
}: {
  title?: string
  message?: string
  icon?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-[#03a54e]/10 flex items-center justify-center mx-auto mb-4 text-[#03a54e]">
        {icon ?? <UtensilsCrossed size={28} />}
      </div>
      <p className="font-semibold text-stone-700">{title}</p>
      <p className="text-sm text-stone-400 mt-1 max-w-xs mx-auto">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
