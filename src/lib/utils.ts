import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export function cmvStatus(cmvPct: number): 'good' | 'warning' | 'danger' {
  if (cmvPct <= 30) return 'good'
  if (cmvPct <= 38) return 'warning'
  return 'danger'
}
