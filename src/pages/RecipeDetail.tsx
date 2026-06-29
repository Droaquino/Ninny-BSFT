import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, FileText, Loader2 } from 'lucide-react'
import { CategoryBadge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { useRecipe } from '@/hooks/useRecipes'

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>()
  const { recipe, loading } = useRecipe(id ?? '')

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[40vh] text-[#03a54e]">
      <Loader2 size={32} className="animate-spin" />
    </div>
  )

  if (!recipe) return (
    <div className="p-8 text-center text-stone-400">
      <p>Ficha não encontrada.</p>
      <Link to="/fichas" className="text-[#03a54e] text-sm mt-2 inline-block">← Voltar</Link>
    </div>
  )

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <Link to="/fichas" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-6 transition-colors">
        <ArrowLeft size={14} /> Fichas Técnicas
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6 flex items-start justify-between gap-4">
        <div>
          <CategoryBadge category={recipe.category} />
          <h1 className="text-2xl font-bold text-[#03a54e] mt-2">{recipe.name}</h1>
          <p className="text-stone-400 text-sm mt-0.5">Rendimento: {recipe.portion_size_g}g por porção</p>
        </div>
        {recipe.pdf_url ? (
          <a
            href={recipe.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-[#03a54e] text-white rounded-xl text-sm font-medium hover:bg-[#029443] transition-colors"
          >
            <Download size={14} /> Ver PDF
          </a>
        ) : (
          <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-400 rounded-xl text-sm">
            <FileText size={14} /> Sem PDF
          </div>
        )}
      </div>

      {/* Tabela de ingredientes */}
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Ingrediente</th>
                <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-right">Bruto</th>
                <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-right">Líq.</th>
                <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-right">Custo Unit.</th>
                <th className="px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {[...recipe.ingredients]
                .sort((a, b) => b.total_cost - a.total_cost)
                .map(ing => (
                  <tr key={ing.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-stone-800">{ing.ingredient_name}</td>
                    <td className="px-4 py-3 text-stone-500 text-right tabular-nums">{ing.gross_weight}{ing.unit}</td>
                    <td className="px-4 py-3 text-stone-500 text-right tabular-nums">{ing.net_weight}{ing.unit}</td>
                    <td className="px-4 py-3 text-stone-500 text-right tabular-nums">{formatCurrency(ing.unit_cost)}</td>
                    <td className="px-5 py-3 font-semibold text-stone-800 text-right tabular-nums">{formatCurrency(ing.total_cost)}</td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr className="bg-stone-50 border-t-2 border-stone-100">
                <td colSpan={4} className="px-5 py-3 font-semibold text-stone-700">Custo total</td>
                <td className="px-5 py-3 font-bold text-stone-900 text-right tabular-nums">{formatCurrency(recipe.total_cost)}</td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <div className="p-12 text-center text-stone-400">
            <FileText size={32} className="mx-auto mb-3 opacity-30" />
            <p>Ingredientes não cadastrados nesta ficha.</p>
          </div>
        )}
      </div>
    </div>
  )
}
