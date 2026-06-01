import { useState, useEffect } from 'react'
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

  return { recipes, loading, error }
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
