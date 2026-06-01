export type Category =
  | 'entradas'
  | 'sughi'
  | 'sughi_special'
  | 'sughi_al_mare'
  | 'pratos_compostos'
  | 'pratos_duplos'
  | 'risoto'
  | 'sobremesa'
  | 'bebidas'
  | 'menu_executivo'
  | 'preparos'

export const CATEGORY_LABELS: Record<Category, string> = {
  entradas: 'Entradas',
  sughi: 'Sughi',
  sughi_special: 'Sughi Special',
  sughi_al_mare: 'Sughi Al Mare',
  pratos_compostos: 'Pratos Compostos',
  pratos_duplos: 'Pratos Duplos',
  risoto: 'Risoto',
  sobremesa: 'Sobremesa',
  bebidas: 'Bebidas',
  menu_executivo: 'Menu Executivo',
  preparos: 'Preparos',
}

export interface Ingredient {
  id: string
  name: string
  unit: string
  unit_cost: number
  updated_at: string
}

export interface RecipeIngredient {
  id: string
  recipe_id: string
  ingredient_id: string
  ingredient_name: string
  gross_weight: number
  net_weight: number
  unit: string
  unit_cost: number
  total_cost: number
}

export interface Recipe {
  id: string
  name: string
  category: Category
  portion_size_g: number
  total_cost: number
  sale_price: number
  markup: number
  cmv_pct: number
  pdf_url: string | null
  created_at: string
  ingredients?: RecipeIngredient[]
}

export type Database = {
  public: {
    Tables: {
      ingredients: {
        Row: Ingredient
        Insert: Omit<Ingredient, 'id' | 'updated_at'>
        Update: Partial<Omit<Ingredient, 'id'>>
      }
      recipes: {
        Row: Recipe
        Insert: Omit<Recipe, 'id' | 'created_at' | 'ingredients'>
        Update: Partial<Omit<Recipe, 'id' | 'created_at' | 'ingredients'>>
      }
      recipe_ingredients: {
        Row: RecipeIngredient
        Insert: Omit<RecipeIngredient, 'id'>
        Update: Partial<Omit<RecipeIngredient, 'id'>>
      }
    }
  }
}
