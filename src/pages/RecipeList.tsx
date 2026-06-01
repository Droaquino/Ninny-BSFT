import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, FileText, ArrowUpDown, ChevronRight } from 'lucide-react'
import { CATEGORY_LABELS, type Category } from '@/types/database'
import { CmvBar } from '@/components/ui/cmv-badge'
import { CategoryBadge } from '@/components/ui/badge'
import { formatCurrency, cmvStatus } from '@/lib/utils'
import { useRecipes } from '@/hooks/useRecipes'

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[]
type SortKey = 'name' | 'cmv_asc' | 'cmv_desc' | 'price_desc'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'name',       label: 'A–Z'          },
  { key: 'cmv_desc',   label: 'Maior CMV'    },
  { key: 'cmv_asc',    label: 'Menor CMV'    },
  { key: 'price_desc', label: 'Maior Preço'  },
]

export function RecipeList() {
  const { recipes, loading } = useRecipes()
  const [search, setSearch]   = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'todas'>('todas')
  const [sort, setSort] = useState<SortKey>('name')

  const usedCategories = useMemo(() => {
    const cats = new Set(recipes.map(r => r.category))
    return ALL_CATEGORIES.filter(c => cats.has(c))
  }, [recipes])

  const filtered = useMemo(() => {
    let list = recipes.filter(r => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = activeCategory === 'todas' || r.category === activeCategory
      return matchSearch && matchCat
    })
    if (sort === 'name')       list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'cmv_desc')   list = [...list].sort((a, b) => b.cmv_pct - a.cmv_pct)
    if (sort === 'cmv_asc')    list = [...list].sort((a, b) => a.cmv_pct - b.cmv_pct)
    if (sort === 'price_desc') list = [...list].sort((a, b) => b.sale_price - a.sale_price)
    return list
  }, [recipes, search, activeCategory, sort])

  const counts = useMemo(() => {
    const danger  = recipes.filter(r => cmvStatus(r.cmv_pct) === 'danger').length
    const warning = recipes.filter(r => cmvStatus(r.cmv_pct) === 'warning').length
    return { danger, warning }
  }, [recipes])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#03a54e]">Fichas Técnicas</h1>
          <p className="text-stone-400 mt-1">
            {loading ? 'Carregando...' : `${recipes.length} fichas`}
            {!loading && counts.danger  > 0 && <span className="ml-3 text-red-500 font-medium">{counts.danger} para revisar</span>}
            {!loading && counts.warning > 0 && <span className="ml-2 text-amber-500 font-medium">{counts.warning} em atenção</span>}
          </p>
        </div>
      </div>

      {/* Busca + Ordenação */}
      <div className="flex gap-3 mb-5">
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

      {/* Filtros de categoria */}
      <div className="flex flex-wrap gap-2 mb-7">
        <button
          onClick={() => setActiveCategory('todas')}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeCategory === 'todas'
              ? 'bg-[#025c2b] text-white shadow-sm'
              : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
          }`}
        >
          Todas ({recipes.length})
        </button>
        {usedCategories.map(cat => {
          const count = recipes.filter(r => r.category === cat).length
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

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-100 p-5 animate-pulse">
              <div className="h-5 bg-stone-100 rounded w-2/3 mb-3" />
              <div className="h-4 bg-stone-100 rounded w-1/2 mb-4" />
              <div className="h-10 bg-stone-100 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <FileText size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">Nenhuma ficha encontrada.</p>
          <p className="text-sm mt-1">Tente buscar por outro nome ou categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(recipe => {
            const status = cmvStatus(recipe.cmv_pct)
            const borderColor = status === 'danger' ? 'border-red-100 hover:border-red-200' : status === 'warning' ? 'border-amber-100 hover:border-amber-200' : 'border-stone-100 hover:border-[#03a54e]/30'
            return (
              <Link
                key={recipe.id}
                to={`/fichas/${recipe.id}`}
                className={`bg-white rounded-2xl border p-5 hover:shadow-md transition-all group flex flex-col gap-3 ${borderColor}`}
              >
                <div className="flex items-start justify-between">
                  <CategoryBadge category={recipe.category} />
                  <ChevronRight size={14} className="text-stone-300 group-hover:text-[#03a54e] transition-colors mt-0.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 leading-snug text-sm">{recipe.name}</h3>
                  <p className="text-xs text-stone-400 mt-0.5">{recipe.portion_size_g}g • {formatCurrency(recipe.sale_price)}</p>
                </div>
                <CmvBar cmvPct={recipe.cmv_pct} showLabel={false} size="sm" />
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>Custo: <span className="font-medium text-stone-600">{formatCurrency(recipe.total_cost)}</span></span>
                  <span>Margem: <span className="font-medium text-stone-600">{(100 - recipe.cmv_pct).toFixed(0)}%</span></span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
