import { useState, useMemo } from 'react'
import { Search, ArrowUpDown, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { CATEGORY_LABELS, type Category } from '@/types/database'
import { CategoryBadge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { useRecipes } from '@/hooks/useRecipes'

const OPERATIONAL_COST = 0.445

const MARGIN_OPTIONS = [25, 27.5, 30, 32.5, 35, 37.5, 40, 42.5, 45]

function suggestedPrice(cmv: number, targetMargin: number): number {
  const denominator = 1 - OPERATIONAL_COST - targetMargin / 100
  if (denominator <= 0) return 0
  return cmv / denominator
}

function priceDiff(current: number, suggested: number) {
  if (suggested <= 0) return null
  return ((current - suggested) / suggested) * 100
}

type SortKey = 'name' | 'cmv_desc' | 'cmv_asc' | 'diff_desc' | 'diff_asc'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'name',      label: 'A–Z'         },
  { key: 'cmv_desc',  label: 'Maior CMV'   },
  { key: 'cmv_asc',   label: 'Menor CMV'   },
  { key: 'diff_desc', label: 'Mais acima'  },
  { key: 'diff_asc',  label: 'Mais abaixo' },
]

export function Pricing() {
  const { recipes, loading } = useRecipes()
  const [targetMargin, setTargetMargin] = useState(35)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'todas'>('todas')
  const [sort, setSort] = useState<SortKey>('name')

  const multiplier = useMemo(() => {
    const d = 1 - OPERATIONAL_COST - targetMargin / 100
    return d > 0 ? 1 / d : 0
  }, [targetMargin])

  const usedCategories = useMemo(() => {
    const cats = new Set(recipes.map(r => r.category))
    return (Object.keys(CATEGORY_LABELS) as Category[]).filter(c => cats.has(c))
  }, [recipes])

  const filtered = useMemo(() => {
    let list = recipes
      .filter(r => r.category !== 'preparos')
      .filter(r => {
        const matchSearch = r.name.toLowerCase().includes(search.toLowerCase())
        const matchCat = activeCategory === 'todas' || r.category === activeCategory
        return matchSearch && matchCat
      })
      .map(r => {
        const suggested = suggestedPrice(r.total_cost, targetMargin)
        const diff = priceDiff(r.sale_price, suggested)
        return { ...r, suggested, diff }
      })

    if (sort === 'name')       list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'cmv_desc')   list = [...list].sort((a, b) => b.total_cost - a.total_cost)
    if (sort === 'cmv_asc')    list = [...list].sort((a, b) => a.total_cost - b.total_cost)
    if (sort === 'diff_desc')  list = [...list].sort((a, b) => (b.diff ?? 0) - (a.diff ?? 0))
    if (sort === 'diff_asc')   list = [...list].sort((a, b) => (a.diff ?? 0) - (b.diff ?? 0))
    return list
  }, [recipes, search, activeCategory, sort, targetMargin])

  const summary = useMemo(() => {
    const abaixo = filtered.filter(r => (r.diff ?? 0) < -5).length
    const acima  = filtered.filter(r => (r.diff ?? 0) > 5).length
    const ok     = filtered.length - abaixo - acima
    return { abaixo, acima, ok }
  }, [filtered])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#03a54e]">Precificação</h1>
        <p className="text-stone-400 mt-1 text-sm">
          Preço sugerido = CMV ÷ (1 − 44,5% custo op. − margem pretendida)
        </p>
      </div>

      {/* Margem alvo */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-stone-600 mb-3">Margem de lucro pretendida</p>
            <div className="flex flex-wrap gap-2">
              {MARGIN_OPTIONS.map(m => (
                <button
                  key={m}
                  onClick={() => setTargetMargin(m)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    targetMargin === m
                      ? 'bg-[#025c2b] text-white shadow-sm'
                      : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {m}%
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4 shrink-0">
            <div className="text-center px-5 py-3 bg-[#03a54e]/10 rounded-xl">
              <p className="text-xs text-[#03a54e] uppercase tracking-wide mb-0.5">Multiplicador</p>
              <p className="text-2xl font-bold text-[#025c2b]">{multiplier.toFixed(2)}×</p>
            </div>
            <div className="text-center px-5 py-3 bg-stone-50 rounded-xl">
              <p className="text-xs text-stone-400 uppercase tracking-wide mb-0.5">Custo op.</p>
              <p className="text-2xl font-bold text-stone-700">44,5%</p>
            </div>
          </div>
        </div>

        {/* Summary chips */}
        {!loading && (
          <div className="flex gap-3 mt-5 pt-5 border-t border-stone-100">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#03a54e]/10 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-[#03a54e]" />
              <span className="text-sm text-[#025c2b] font-medium">{summary.ok} no alvo</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-sm text-amber-700 font-medium">{summary.acima} acima do sugerido</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-sm text-red-700 font-medium">{summary.abaixo} abaixo do sugerido</span>
            </div>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar prato..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#03a54e]/30 focus:border-[#03a54e]"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-xl px-1">
          <ArrowUpDown size={13} className="text-stone-400 ml-2" />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            className="py-2.5 pr-3 pl-1 text-sm text-stone-600 bg-transparent focus:outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Categorias */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory('todas')}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeCategory === 'todas'
              ? 'bg-[#025c2b] text-white shadow-sm'
              : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
          }`}
        >
          Todas ({filtered.length})
        </button>
        {usedCategories.filter(c => c !== 'preparos').map(cat => {
          const count = filtered.filter(r => r.category === cat).length
          if (count === 0) return null
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#025c2b] text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
              }`}
            >
              {CATEGORY_LABELS[cat]} ({count})
            </button>
          )
        })}
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-stone-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            <p>Nenhum prato encontrado.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left border-b border-stone-100">
                <th className="px-6 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Prato</th>
                <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-right">CMV</th>
                <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-right">Preço Atual</th>
                <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-right">
                  Sugerido ({targetMargin}%)
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-right">Diferença</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filtered.map(recipe => {
                const diff = recipe.diff
                const isAbove = diff !== null && diff > 5
                const isBelow = diff !== null && diff < -5

                return (
                  <tr key={recipe.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2.5">
                        <CategoryBadge category={recipe.category} />
                        <span className="font-medium text-stone-800 text-xs">{recipe.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-600 text-right tabular-nums">
                      {formatCurrency(recipe.total_cost)}
                    </td>
                    <td className="px-4 py-3 text-stone-800 font-semibold text-right tabular-nums">
                      {formatCurrency(recipe.sale_price)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className="font-semibold text-[#025c2b]">
                        {formatCurrency(recipe.suggested)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {diff === null ? (
                        <span className="text-stone-300">—</span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isBelow  ? 'bg-red-50 text-red-700' :
                          isAbove  ? 'bg-amber-50 text-amber-700' :
                          'bg-[#03a54e]/10 text-[#025c2b]'
                        }`}>
                          {isBelow  ? <TrendingDown size={11} /> :
                           isAbove  ? <TrendingUp size={11} /> :
                           <Minus size={11} />}
                          {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-stone-400 mt-4 text-center">
        Diferença = (preço atual − sugerido) ÷ sugerido. Verde: dentro de ±5%.
      </p>
    </div>
  )
}
