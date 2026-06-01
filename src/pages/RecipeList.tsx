import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, FileText } from 'lucide-react'
import { MOCK_RECIPES } from '@/data/mock-recipes'
import { CATEGORY_LABELS, type Category } from '@/types/database'
import { CmvIndicator } from '@/components/ui/cmv-indicator'
import { CategoryBadge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[]

export function RecipeList() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'todas'>('todas')

  const filtered = useMemo(() => {
    return MOCK_RECIPES.filter((r) => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = activeCategory === 'todas' || r.category === activeCategory
      return matchSearch && matchCat
    })
  }, [search, activeCategory])

  const usedCategories = useMemo(() => {
    const cats = new Set(MOCK_RECIPES.map((r) => r.category))
    return ALL_CATEGORIES.filter((c) => cats.has(c))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Fichas Técnicas</h1>
        <p className="text-gray-500 mt-1">{MOCK_RECIPES.length} fichas cadastradas</p>
      </div>

      {/* Busca */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar prato..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
        />
      </div>

      {/* Filtros de categoria */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('todas')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeCategory === 'todas'
              ? 'bg-[#1a2e1f] text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          Todas
        </button>
        {usedCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-[#1a2e1f] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Grid de cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText size={40} className="mx-auto mb-3 opacity-40" />
          <p>Nenhuma ficha encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/fichas/${recipe.id}`}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-amber-200 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <CategoryBadge category={recipe.category} />
                {recipe.pdf_url && (
                  <FileText size={14} className="text-gray-300 group-hover:text-amber-400 transition-colors" />
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 leading-snug">{recipe.name}</h3>
              <p className="text-xs text-gray-400 mb-4">{recipe.portion_size_g}g • Venda: {formatCurrency(recipe.sale_price)}</p>
              <CmvIndicator cmvPct={recipe.cmv_pct} size="sm" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
