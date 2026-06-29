import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Ingredient } from '@/types/database'

const MOCK_INGREDIENTS: Ingredient[] = [
  { id: '1', name: 'Farinha de trigo', unit: 'kg', unit_cost: 4.5, updated_at: '' },
  { id: '2', name: 'Ovos', unit: 'un', unit_cost: 0.9, updated_at: '' },
  { id: '3', name: 'Queijo parmesão', unit: 'kg', unit_cost: 65, updated_at: '' },
  { id: '4', name: 'Carne moída', unit: 'kg', unit_cost: 38, updated_at: '' },
  { id: '5', name: 'Tomate pelado', unit: 'kg', unit_cost: 12, updated_at: '' },
  { id: '6', name: 'Azeite', unit: 'L', unit_cost: 45, updated_at: '' },
]

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetch() {
      if (!isSupabaseConfigured || !supabase) {
        setIngredients(MOCK_INGREDIENTS)
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name')
      if (error) { setError(error.message); setIngredients(MOCK_INGREDIENTS) }
      else setIngredients(data ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  const updateCost = useCallback(async (id: string, newCost: number) => {
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, unit_cost: newCost } : i))

    if (!isSupabaseConfigured || !supabase) return { error: null }

    const { data, error } = await supabase
      .from('ingredients')
      .update({ unit_cost: newCost } as never)
      .eq('id', id)
      .select()

    if (error) return { error }
    if (!data || data.length === 0) {
      return { error: { message: 'Sem permissão para salvar (RLS).' } }
    }

    // Recalcula recipe_ingredients que usam este insumo
    const { data: ris } = await supabase
      .from('recipe_ingredients')
      .select('id, gross_weight')
      .eq('ingredient_id', id)

    if (ris && ris.length > 0) {
      await Promise.all(ris.map(ri =>
        supabase
          .from('recipe_ingredients')
          .update({
            unit_cost: newCost,
            total_cost: parseFloat((ri.gross_weight * newCost / 1000).toFixed(4)),
          } as never)
          .eq('id', ri.id)
      ))
    }

    return { error: null }
  }, [])

  return { ingredients, loading, error, updateCost }
}
