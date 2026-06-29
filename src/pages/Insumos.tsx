import { useState, useRef, useMemo } from 'react'
import { toast } from 'sonner'
import { Search, Loader2, Check, Package } from 'lucide-react'
import { useIngredients } from '@/hooks/useIngredients'
import { LoadingState, EmptyState } from '@/components/ui/states'
import { formatCurrency } from '@/lib/utils'

export function Insumos() {
  const { ingredients, loading, updateCost } = useIngredients()
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState<Set<string>>(new Set())
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() =>
    ingredients.filter(i => i.name.toLowerCase().includes(search.toLowerCase())),
    [ingredients, search]
  )

  function startEdit(id: string, current: number) {
    setEditingId(id)
    setEditValue(current.toFixed(4).replace('.', ','))
    setTimeout(() => inputRef.current?.select(), 0)
  }

  async function commitEdit(ing: { id: string; name: string; unit: string }) {
    const newCost = parseFloat(editValue.replace(',', '.'))
    setEditingId(null)
    if (isNaN(newCost) || newCost < 0) return

    setSaving(prev => new Set(prev).add(ing.id))
    const { error } = await updateCost(ing.id, newCost)
    setSaving(prev => { const n = new Set(prev); n.delete(ing.id); return n })

    if (error) {
      toast.error('Não foi possível salvar', { description: (error as { message: string }).message })
      return
    }
    toast.success('Insumo atualizado!', {
      description: `${ing.name}: ${formatCurrency(newCost)}/${ing.unit} — CMV dos pratos recalculado.`,
    })
    setSaved(prev => new Set(prev).add(ing.id))
    setTimeout(() => setSaved(prev => { const n = new Set(prev); n.delete(ing.id); return n }), 2500)
  }

  if (loading) return <LoadingState label="Carregando insumos…" />

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#03a54e]">Insumos</h1>
        <p className="text-stone-400 mt-1 text-sm">
          Atualize o custo de um ingrediente e o CMV de todos os pratos é recalculado automaticamente.
        </p>
      </div>

      {/* Busca + contador */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar insumo…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#03a54e]/30 focus:border-[#03a54e] bg-white"
          />
        </div>
        <p className="text-sm text-stone-400 self-center">
          {filtered.length} insumo{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Package size={28} />}
            title="Nenhum insumo encontrado"
            message="Tente outro termo de busca."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Insumo</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Unidade</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Custo unitário</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide w-32">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filtered.map(ing => {
                  const isEditing = editingId === ing.id
                  const isSaving  = saving.has(ing.id)
                  const isSaved   = saved.has(ing.id)

                  return (
                    <tr
                      key={ing.id}
                      className={`transition-colors ${isSaved ? 'bg-[#03a54e]/5' : 'hover:bg-stone-50/60'}`}
                    >
                      <td className="px-4 py-3 font-medium text-stone-800">{ing.name}</td>
                      <td className="px-4 py-3 text-center text-stone-500">{ing.unit}</td>

                      {/* Custo editável */}
                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <input
                            ref={inputRef}
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onBlur={() => commitEdit(ing)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') commitEdit(ing)
                              if (e.key === 'Escape') setEditingId(null)
                            }}
                            className="w-28 text-right px-2 py-1 rounded-lg border border-[#03a54e] text-sm focus:outline-none focus:ring-2 focus:ring-[#03a54e]/30"
                          />
                        ) : (
                          <button
                            onClick={() => startEdit(ing.id, ing.unit_cost)}
                            className="font-mono text-stone-700 hover:text-[#03a54e] transition-colors cursor-pointer rounded px-1"
                            title="Clique para editar"
                          >
                            {formatCurrency(ing.unit_cost)}
                          </button>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-right">
                        {isSaving ? (
                          <span className="inline-flex items-center gap-1 text-stone-400 text-xs">
                            <Loader2 size={13} className="animate-spin" /> Salvando…
                          </span>
                        ) : isSaved ? (
                          <span className="inline-flex items-center gap-1 text-[#03a54e] text-xs font-medium">
                            <Check size={13} /> Salvo
                          </span>
                        ) : (
                          <button
                            onClick={() => startEdit(ing.id, ing.unit_cost)}
                            className="text-xs text-stone-400 hover:text-[#03a54e] transition-colors"
                          >
                            Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-stone-400 mt-4">
        * Ao salvar, o custo de cada porção nos pratos é recalculado com base no novo preço do insumo.
        O CMV% é atualizado automaticamente pelo banco de dados.
      </p>
    </div>
  )
}
