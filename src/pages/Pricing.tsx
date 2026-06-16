import { useState, useMemo, useRef } from 'react'
import { toast } from 'sonner'
import { Search, ArrowUpDown, TrendingUp, TrendingDown, Minus, CheckSquare, Square, Zap, Loader2, Check, AlertTriangle } from 'lucide-react'
import { CATEGORY_LABELS, type Category } from '@/types/database'
import { CategoryBadge } from '@/components/ui/badge'
import { RowSkeleton, EmptyState } from '@/components/ui/states'
import { formatCurrency, cmvStatus } from '@/lib/utils'
import { useRecipes } from '@/hooks/useRecipes'

const OPERATIONAL_COST = 0.445
const DEFAULT_MARKUP    = 3.90
const MARGIN_OPTIONS    = [25, 27.5, 30, 32.5, 35, 37.5, 40, 42.5, 45]

function suggestedPrice(cmv: number, targetMargin: number) {
  const d = 1 - OPERATIONAL_COST - targetMargin / 100
  return d > 0 ? cmv / d : 0
}

function priceDiff(current: number, suggested: number) {
  if (suggested <= 0) return null
  return ((current - suggested) / suggested) * 100
}

type SortKey = 'name' | 'cmv_desc' | 'cmv_asc' | 'price_desc' | 'diff_desc' | 'diff_asc'
type CmvFilter = 'todos' | 'bom' | 'atencao' | 'critico'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'name',      label: 'A–Z'          },
  { key: 'cmv_desc',  label: 'Maior CMV%'   },
  { key: 'cmv_asc',   label: 'Menor CMV%'   },
  { key: 'price_desc',label: 'Maior Preço'  },
  { key: 'diff_desc', label: 'Mais acima'   },
  { key: 'diff_asc',  label: 'Mais abaixo'  },
]

export function Pricing() {
  const { recipes, loading, updatePrice } = useRecipes()
  const [targetMargin, setTargetMargin]   = useState(35)
  const [search, setSearch]               = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'todas'>('todas')
  const [cmvFilter, setCmvFilter]         = useState<CmvFilter>('todos')
  const [sort, setSort]                   = useState<SortKey>('name')
  const [selected, setSelected]           = useState<Set<string>>(new Set())
  const [editingId, setEditingId]         = useState<string | null>(null)
  const [editValue, setEditValue]         = useState('')
  const [saving, setSaving]               = useState<Set<string>>(new Set())
  const [saved, setSaved]                 = useState<Set<string>>(new Set())
  const [batchLoading, setBatchLoading]   = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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
      .filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
      .filter(r => activeCategory === 'todas' || r.category === activeCategory)
      .filter(r => {
        if (cmvFilter === 'todos') return true
        const s = cmvStatus(r.cmv_pct)
        return cmvFilter === 'bom' ? s === 'good' : cmvFilter === 'atencao' ? s === 'warning' : s === 'danger'
      })
      .map(r => ({
        ...r,
        suggested: suggestedPrice(r.total_cost, targetMargin),
        diff: priceDiff(r.sale_price, suggestedPrice(r.total_cost, targetMargin)),
      }))

    if (sort === 'name')       list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'cmv_desc')   list = [...list].sort((a, b) => b.cmv_pct - a.cmv_pct)
    if (sort === 'cmv_asc')    list = [...list].sort((a, b) => a.cmv_pct - b.cmv_pct)
    if (sort === 'price_desc') list = [...list].sort((a, b) => b.sale_price - a.sale_price)
    if (sort === 'diff_desc')  list = [...list].sort((a, b) => (b.diff ?? 0) - (a.diff ?? 0))
    if (sort === 'diff_asc')   list = [...list].sort((a, b) => (a.diff ?? 0) - (b.diff ?? 0))
    return list
  }, [recipes, search, activeCategory, cmvFilter, sort, targetMargin])

  const summary = useMemo(() => ({
    bom:     filtered.filter(r => cmvStatus(r.cmv_pct) === 'good').length,
    atencao: filtered.filter(r => cmvStatus(r.cmv_pct) === 'warning').length,
    critico: filtered.filter(r => cmvStatus(r.cmv_pct) === 'danger').length,
  }), [filtered])

  const allSelected = filtered.length > 0 && filtered.every(r => selected.has(r.id))

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map(r => r.id)))
    }
  }

  function toggleRow(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function startEdit(id: string, currentPrice: number) {
    setEditingId(id)
    setEditValue(currentPrice.toFixed(2))
    setTimeout(() => inputRef.current?.select(), 0)
  }

  async function commitEdit(recipe: { id: string; name: string; total_cost: number }) {
    const newPrice = parseFloat(editValue.replace(',', '.'))
    setEditingId(null)
    if (isNaN(newPrice) || newPrice <= 0) return

    setSaving(prev => new Set(prev).add(recipe.id))
    const { error } = await updatePrice(recipe.id, newPrice, recipe.total_cost)
    setSaving(prev => { const n = new Set(prev); n.delete(recipe.id); return n })

    if (error) {
      toast.error('Não foi possível salvar', { description: 'Tente novamente em instantes.' })
      return
    }
    toast.success('Preço salvo!', { description: `${recipe.name} agora custa ${formatCurrency(newPrice)}` })
    setSaved(prev => new Set(prev).add(recipe.id))
    setTimeout(() => setSaved(prev => { const n = new Set(prev); n.delete(recipe.id); return n }), 2000)
  }

  async function applyBatchMarkup() {
    if (selected.size === 0) return
    setBatchLoading(true)
    const targets = filtered.filter(r => selected.has(r.id))
    const results = await Promise.all(targets.map(r => {
      const newPrice = parseFloat((r.total_cost * DEFAULT_MARKUP).toFixed(2))
      return updatePrice(r.id, newPrice, r.total_cost)
    }))
    setSelected(new Set())
    setBatchLoading(false)

    const falhas = results.filter(r => r.error).length
    if (falhas > 0) {
      toast.error(`${falhas} preço(s) não salvaram`, { description: 'Verifique a conexão e tente de novo.' })
    } else {
      toast.success(`Markup ${DEFAULT_MARKUP}× aplicado!`, { description: `${targets.length} prato${targets.length > 1 ? 's atualizados' : ' atualizado'}.` })
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#03a54e]">Precificação</h1>
        <p className="text-stone-400 mt-1 text-sm">
          Preço sugerido = CMV ÷ (1 − 44,5% custo op. − margem pretendida)
        </p>
      </div>

      {/* Painel de margem alvo */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-stone-600 mb-3">Margem de lucro pretendida</p>
            <div className="flex flex-wrap gap-2">
              {MARGIN_OPTIONS.map(m => (
                <button key={m} onClick={() => setTargetMargin(m)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    targetMargin === m
                      ? 'bg-[#025c2b] text-white shadow-sm'
                      : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-stone-300'
                  }`}>
                  {m}%
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
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
        {!loading && (
          <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-stone-100">
            <button onClick={() => setCmvFilter('todos')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${cmvFilter === 'todos' ? 'bg-stone-100 border-stone-300' : 'bg-white border-stone-100 hover:border-stone-200'}`}>
              <span className="text-stone-500">{filtered.length} pratos</span>
            </button>
            <button onClick={() => setCmvFilter(cmvFilter === 'bom' ? 'todos' : 'bom')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${cmvFilter === 'bom' ? 'bg-[#03a54e]/20 border-[#03a54e]/30' : 'bg-[#03a54e]/10 border-transparent hover:border-[#03a54e]/20'}`}>
              <span className="w-2 h-2 rounded-full bg-[#03a54e]" />
              <span className="text-[#025c2b]">{summary.bom} bom</span>
            </button>
            <button onClick={() => setCmvFilter(cmvFilter === 'atencao' ? 'todos' : 'atencao')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${cmvFilter === 'atencao' ? 'bg-amber-100 border-amber-300' : 'bg-amber-50 border-transparent hover:border-amber-200'}`}>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-amber-700">{summary.atencao} atenção</span>
            </button>
            <button onClick={() => setCmvFilter(cmvFilter === 'critico' ? 'todos' : 'critico')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${cmvFilter === 'critico' ? 'bg-red-100 border-red-300' : 'bg-red-50 border-transparent hover:border-red-200'}`}>
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-red-700">{summary.critico} crítico</span>
            </button>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input type="text" placeholder="Buscar prato..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#03a54e]/30 focus:border-[#03a54e]" />
        </div>
        <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-xl px-1">
          <ArrowUpDown size={13} className="text-stone-400 ml-2" />
          <select value={sort} onChange={e => setSort(e.target.value as SortKey)}
            className="py-2.5 pr-3 pl-1 text-sm text-stone-600 bg-transparent focus:outline-none cursor-pointer">
            {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Filtros por categoria */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setActiveCategory('todas')}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === 'todas' ? 'bg-[#025c2b] text-white shadow-sm' : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'}`}>
          Todas
        </button>
        {usedCategories.filter(c => c !== 'preparos').map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-[#025c2b] text-white shadow-sm' : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'}`}>
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Barra de ação em lote */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-[#025c2b] text-white rounded-2xl px-5 py-3 mb-4">
          <span className="text-sm font-medium flex-1">{selected.size} prato{selected.size > 1 ? 's' : ''} selecionado{selected.size > 1 ? 's' : ''}</span>
          <button onClick={applyBatchMarkup} disabled={batchLoading}
            className="flex items-center gap-2 bg-white text-[#025c2b] px-4 py-1.5 rounded-xl text-sm font-bold hover:bg-stone-50 transition-colors disabled:opacity-60">
            {batchLoading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
            Aplicar markup {DEFAULT_MARKUP}×
          </button>
          <button onClick={() => setSelected(new Set())} className="text-white/60 hover:text-white text-sm px-2">
            Cancelar
          </button>
        </div>
      )}

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        {loading ? (
          <RowSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Nenhum prato encontrado"
            message="Tente ajustar a busca, a categoria ou o filtro de CMV."
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left border-b border-stone-100">
                <th className="px-4 py-3 w-10">
                  <button onClick={toggleAll} className="text-stone-400 hover:text-[#025c2b] transition-colors">
                    {allSelected ? <CheckSquare size={16} className="text-[#025c2b]" /> : <Square size={16} />}
                  </button>
                </th>
                <th className="px-3 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Prato</th>
                <th className="px-3 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-right">CMV</th>
                <th className="px-3 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-right">CMV%</th>
                <th className="px-3 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-right">Preço Atual</th>
                <th className="px-3 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-right">Sugerido ({targetMargin}%)</th>
                <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-right">Diferença</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filtered.map(recipe => {
                const status   = cmvStatus(recipe.cmv_pct)
                const isCrit   = status === 'danger'
                const isWarn   = status === 'warning'
                const isEdit   = editingId === recipe.id
                const isSaving = saving.has(recipe.id)
                const isSaved  = saved.has(recipe.id)
                const isSelect = selected.has(recipe.id)
                const diff     = recipe.diff

                return (
                  <tr key={recipe.id}
                    className={`transition-colors ${
                      isCrit   ? 'bg-red-50/40 hover:bg-red-50/70' :
                      isWarn   ? 'bg-amber-50/30 hover:bg-amber-50/60' :
                      isSelect ? 'bg-[#03a54e]/5' :
                      'hover:bg-stone-50/50'
                    }`}>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleRow(recipe.id)} className="text-stone-300 hover:text-[#025c2b] transition-colors">
                        {isSelect ? <CheckSquare size={16} className="text-[#025c2b]" /> : <Square size={16} />}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        {isCrit && <AlertTriangle size={13} className="text-red-400 shrink-0" />}
                        <CategoryBadge category={recipe.category} />
                        <span className="font-medium text-stone-800 text-xs leading-snug">{recipe.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-stone-500 text-right tabular-nums text-xs">
                      {formatCurrency(recipe.total_cost)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className={`text-xs font-bold tabular-nums px-2 py-0.5 rounded-full ${
                        isCrit ? 'bg-red-100 text-red-700' :
                        isWarn ? 'bg-amber-100 text-amber-700' :
                        'bg-[#03a54e]/10 text-[#025c2b]'
                      }`}>
                        {recipe.cmv_pct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      {isEdit ? (
                        <input
                          ref={inputRef}
                          type="number"
                          step="0.01"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onBlur={() => commitEdit(recipe)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') commitEdit(recipe)
                            if (e.key === 'Escape') setEditingId(null)
                          }}
                          className="w-24 text-right tabular-nums text-sm font-semibold border-b-2 border-[#03a54e] bg-transparent focus:outline-none text-stone-900"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => startEdit(recipe.id, recipe.sale_price)}
                          className="group flex items-center gap-1 ml-auto hover:text-[#025c2b] transition-colors"
                          title="Clique para editar">
                          {isSaving && <Loader2 size={11} className="animate-spin text-[#03a54e]" />}
                          {isSaved  && <Check size={11} className="text-[#03a54e]" />}
                          <span className="font-semibold tabular-nums text-stone-800 group-hover:text-[#025c2b] border-b border-dashed border-transparent group-hover:border-stone-300 transition-all">
                            {formatCurrency(recipe.sale_price)}
                          </span>
                        </button>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-xs font-semibold text-[#025c2b]">
                      {formatCurrency(recipe.suggested)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {diff === null ? <span className="text-stone-300 text-xs">—</span> : (
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          diff < -5  ? 'bg-red-100 text-red-700' :
                          diff >  5  ? 'bg-amber-100 text-amber-700' :
                          'bg-[#03a54e]/10 text-[#025c2b]'
                        }`}>
                          {diff < -5 ? <TrendingDown size={10} /> : diff > 5 ? <TrendingUp size={10} /> : <Minus size={10} />}
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
        Clique no preço para editar · Selecione pratos e aplique o markup padrão {DEFAULT_MARKUP}× em lote · Linhas vermelhas = CMV acima de 38%
      </p>
    </div>
  )
}
