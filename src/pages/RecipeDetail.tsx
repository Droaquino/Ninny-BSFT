import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import { MOCK_RECIPES } from '@/data/mock-recipes'
import { CmvIndicator } from '@/components/ui/cmv-indicator'
import { CategoryBadge } from '@/components/ui/badge'
import { formatCurrency, formatPercent } from '@/lib/utils'

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>()
  const recipe = MOCK_RECIPES.find((r) => r.id === id)

  if (!recipe) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>Ficha não encontrada.</p>
        <Link to="/" className="text-amber-600 text-sm mt-2 inline-block">← Voltar</Link>
      </div>
    )
  }

  const margin = recipe.sale_price - recipe.total_cost
  const marginPct = (margin / recipe.sale_price) * 100

  return (
    <div className="p-8 max-w-3xl">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <ArrowLeft size={14} />
        Fichas Técnicas
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <CategoryBadge category={recipe.category} />
            <h1 className="text-2xl font-bold text-[#000000] mt-2">{recipe.name}</h1>
            <p className="text-gray-400 text-sm mt-0.5">Rendimento: {recipe.portion_size_g}g por porção</p>
          </div>
          {recipe.pdf_url ? (
            <a
              href={recipe.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#03a54e] text-white rounded-xl text-sm font-medium hover:bg-[#029443] transition-colors"
            >
              <Download size={14} />
              Ver PDF
            </a>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-xl text-sm">
              <FileText size={14} />
              Sem PDF
            </div>
          )}
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Custo do Prato</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(recipe.total_cost)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Preço de Venda</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(recipe.sale_price)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Margem Bruta</p>
            <p className="text-xl font-bold text-green-700">{formatPercent(marginPct)}</p>
            <p className="text-xs text-gray-400">{formatCurrency(margin)}</p>
          </div>
        </div>

        <CmvIndicator cmvPct={recipe.cmv_pct} />
      </div>

      {/* Tabela de ingredientes */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Ingredientes</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Ingrediente</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide text-right">Peso Bruto</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide text-right">Peso Líq.</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide text-right">Custo Unit.</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide text-right">Custo Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recipe.ingredients.map((ing) => (
                <tr key={ing.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-3 font-medium text-gray-800">{ing.ingredient_name}</td>
                  <td className="px-6 py-3 text-gray-500 text-right">{ing.gross_weight}{ing.unit}</td>
                  <td className="px-6 py-3 text-gray-500 text-right">{ing.net_weight}{ing.unit}</td>
                  <td className="px-6 py-3 text-gray-500 text-right">{formatCurrency(ing.unit_cost)}</td>
                  <td className="px-6 py-3 text-gray-800 font-medium text-right">{formatCurrency(ing.total_cost)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan={4} className="px-6 py-3 font-semibold text-gray-700">Total</td>
                <td className="px-6 py-3 font-bold text-gray-900 text-right">{formatCurrency(recipe.total_cost)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  )
}
