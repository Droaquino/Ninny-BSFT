import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { MOCK_RECIPES } from '@/data/mock-recipes'
import type { Recipe } from '@/types/database'

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecipes() {
      if (!isSupabaseConfigured || !supabase) {
        setRecipes(MOCK_RECIPES)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('category')
        .order('name')

      if (error) {
        setError(error.message)
        setRecipes(MOCK_RECIPES)
      } else {
        setRecipes(data ?? [])
      }
      setLoading(false)
    }

    fetchRecipes()
  }, [])

  const updatePrice = useCallback(async (id: string, newPrice: number, totalCost: number) => {
    const markup   = totalCost > 0 ? parseFloat((newPrice / totalCost).toFixed(2)) : 0
    const cmv_pct  = newPrice  > 0 ? parseFloat(((totalCost / newPrice) * 100).toFixed(2)) : 0

    setRecipes(prev => prev.map(r =>
      r.id === id ? { ...r, sale_price: newPrice, markup, cmv_pct } : r
    ))

    if (!isSupabaseConfigured || !supabase) return { error: null }

    const { error } = await supabase
      .from('recipes')
      .update({ sale_price: newPrice, markup, cmv_pct })
      .eq('id', id)

    return { error }
  }, [])

  return { recipes, loading, error, updatePrice }
}

export function useRecipe(id: string) {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecipe() {
      if (!isSupabaseConfigured || !supabase) {
        const found = MOCK_RECIPES.find(r => r.id === id) ?? null
        setRecipe(found)
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('recipes')
        .select(`*, recipe_ingredients(*)`)
        .eq('id', id)
        .single()

      setRecipe(data ?? null)
      setLoading(false)
    }

    fetchRecipe()
  }, [id])

  return { recipe, loading }
}
