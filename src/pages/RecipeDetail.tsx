import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, FileText, Loader2, DollarSign, TrendingUp, Scale, Percent } from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { CmvBar } from '@/components/ui/cmv-badge'
import { CategoryBadge } from '@/components/ui/badge'
import { MetricCard } from '@/components/ui/metric-card'
import { formatCurrency, formatPercent, cmvStatus } from '@/lib/utils'
import { useRecipe } from '@/hooks/useRecipes'

const COLORS = ['#03a54e','#2563eb','#7c3aed','#dc2626','#d97706','#0891b2','#db2777','#64748b','#f59e0b','#10b981']

type Tab = 'ingredientes' | 'custos' | 'precificacao'

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>()
  const { recipe, loading } = useRecipe(id ?? '')
  const [tab, setTab] = useState<Tab>('ingredientes')

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

  const margin     = recipe.sale_price - recipe.total_cost
  const marginPct  = (margin / recipe.sale_price) * 100
  const status     = cmvStatus(recipe.cmv_pct)

  // Dados para gráfico de pizza de ingredientes
  const pieData = recipe.ingredients?.map(ing => ({
    name: ing.ingredient_name,
    value: parseFloat(ing.total_cost.toFixed(2)),
  })) ?? []

  // Dados para barra de breakdown preço
  const breakdownData = [{
    name: recipe.name.length > 20 ? recipe.name.slice(0, 20) + '…' : recipe.name,
    'Custo':   parseFloat(recipe.total_cost.toFixed(2)),
    'Margem':  parseFloat(margin.toFixed(2)),
  }]

  const TABS: { key: Tab; label: string }[] = [
    { key: 'ingredientes', label: 'Ingredientes' },
    { key: 'custos',       label: 'Análise de Custos' },
    { key: 'precificacao', label: 'Precificação' },
  ]

  return (
    <div className="p-8 max-w-4xl">
      <Link to="/fichas" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-6 transition-colors">
        <ArrowLeft size={14} /> Fichas Técnicas
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <CategoryBadge category={recipe.category} />
            <h1 className="text-2xl font-bold text-[#03a54e] mt-2">{recipe.name}</h1>
            <p className="text-stone-400 text-sm mt-0.5">Rendimento: {recipe.portion_size_g}g por porção</p>
          </div>
          {recipe.pdf_url ? (
            <a href={recipe.pdf_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#03a54e] text-white rounded-xl text-sm font-medium hover:bg-[#029443] transition-colors">
              <Download size={14} /> Ver PDF
            </a>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-400 rounded-xl text-sm">
              <FileText size={14} /> Sem PDF
            </div>
          )}
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <MetricCard label="Custo do Prato" value={formatCurrency(recipe.total_cost)} icon={DollarSign} color="neutral" />
          <MetricCard label="Preço de Venda" value={formatCurrency(recipe.sale_price)} icon={TrendingUp} color="neutral" />
          <MetricCard label="Margem Bruta"   value={formatPercent(marginPct)} sub={formatCurrency(margin)} icon={Percent}
            color={status === 'good' ? 'green' : status === 'warning' ? 'yellow' : 'red'} />
          <MetricCard label="Markup"         value={`${recipe.markup}×`} sub={`÷ custo = preço`} icon={Scale} color="neutral" />
        </div>

        <CmvBar cmvPct={recipe.cmv_pct} size="md" />
      </div>

      {/* Abas */}
      <div className="flex gap-1 bg-white border border-stone-100 rounded-2xl p-1.5 mb-6">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all ${
              tab === t.key
                ? 'bg-[#025c2b] text-white shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ABA: Ingredientes */}
      {tab === 'ingredientes' && (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Ingrediente</th>
                  <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-right">Bruto</th>
                  <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-right">Líq.</th>
                  <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-right">Custo Unit.</th>
                  <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-right">Total</th>
                  <th className="px-6 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Participação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {[...recipe.ingredients].sort((a, b) => b.total_cost - a.total_cost).map(ing => {
                  const pct = recipe.total_cost > 0 ? (ing.total_cost / recipe.total_cost) * 100 : 0
                  const isMax = ing.total_cost === Math.max(...recipe.ingredients!.map(i => i.total_cost))
                  return (
                    <tr key={ing.id} className={isMax ? 'bg-amber-50/50' : 'hover:bg-stone-50/50'}>
                      <td className="px-6 py-3">
                        <span className="font-medium text-stone-800">{ing.ingredient_name}</span>
                        {isMax && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">Maior custo</span>}
                      </td>
                      <td className="px-4 py-3 text-stone-500 text-right tabular-nums">{ing.gross_weight}{ing.unit}</td>
                      <td className="px-4 py-3 text-stone-500 text-right tabular-nums">{ing.net_weight}{ing.unit}</td>
                      <td className="px-4 py-3 text-stone-500 text-right tabular-nums">{formatCurrency(ing.unit_cost)}</td>
                      <td className="px-4 py-3 text-stone-800 font-semibold text-right tabular-nums">{formatCurrency(ing.total_cost)}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#03a54e] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-stone-400 w-9 text-right tabular-nums">{pct.toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-stone-50 border-t-2 border-stone-100">
                  <td colSpan={4} className="px-6 py-3 font-semibold text-stone-700">Total</td>
                  <td className="px-4 py-3 font-bold text-stone-900 text-right tabular-nums">{formatCurrency(recipe.total_cost)}</td>
                  <td className="px-6 py-3" />
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
      )}

      {/* ABA: Custos */}
      {tab === 'custos' && (
        <div className="space-y-6">
          {pieData.length > 0 ? (
            <div className="bg-white rounded-2xl border border-stone-100 p-6">
              <h2 className="text-base font-semibold text-[#025c2b] mb-5">Composição do Custo por Ingrediente</h2>
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={2}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [formatCurrency(v), 'Custo']}
                      contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.1)', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-full sm:w-56 space-y-2 shrink-0">
                  {pieData.sort((a, b) => b.value - a.value).map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="flex-1 text-stone-600 truncate">{d.name}</span>
                      <span className="font-semibold text-stone-800 tabular-nums">{formatCurrency(d.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center text-stone-400">
              <p>Cadastre os ingredientes para visualizar o gráfico de composição.</p>
            </div>
          )}

          {/* Breakdown custo vs margem */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h2 className="text-base font-semibold text-[#025c2b] mb-5">Custo × Margem no Preço de Venda</h2>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={breakdownData} layout="vertical" margin={{ left: 8, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1ede4" />
                <XAxis type="number" tickFormatter={v => formatCurrency(v)} tick={{ fontSize: 11, fill: '#a8a29e' }} />
                <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11, fill: '#57534e' }} />
                <Tooltip formatter={(v: number) => [formatCurrency(v)]}
                  contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.1)', fontSize: 12 }} />
                <Legend />
                <Bar dataKey="Custo"  stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Margem" stackId="a" fill="#03a54e" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-5">
              <div className="text-center p-3 bg-red-50 rounded-xl">
                <p className="text-xs text-red-400 uppercase tracking-wide mb-1">Custo</p>
                <p className="text-lg font-bold text-red-600">{formatCurrency(recipe.total_cost)}</p>
                <p className="text-xs text-red-400">{recipe.cmv_pct.toFixed(1)}% do preço</p>
              </div>
              <div className="text-center p-3 bg-[#03a54e]/10 rounded-xl">
                <p className="text-xs text-[#03a54e] uppercase tracking-wide mb-1">Margem</p>
                <p className="text-lg font-bold text-[#025c2b]">{formatCurrency(margin)}</p>
                <p className="text-xs text-[#03a54e]">{marginPct.toFixed(1)}% do preço</p>
              </div>
              <div className="text-center p-3 bg-stone-50 rounded-xl">
                <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Preço Final</p>
                <p className="text-lg font-bold text-stone-800">{formatCurrency(recipe.sale_price)}</p>
                <p className="text-xs text-stone-400">markup {recipe.markup}×</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA: Precificação */}
      {tab === 'precificacao' && (
        <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-6">
          <h2 className="text-base font-semibold text-[#025c2b]">Simulador de Precificação</h2>
          <PriceSimulator cost={recipe.total_cost} currentPrice={recipe.sale_price} />
        </div>
      )}
    </div>
  )
}

function PriceSimulator({ cost, currentPrice }: { cost: number; currentPrice: number }) {
  const [price, setPrice] = useState(currentPrice)
  const cmv = cost > 0 ? (cost / price) * 100 : 0
  const margin = price - cost
  const marginPct = price > 0 ? (margin / price) * 100 : 0
  const status = cmvStatus(cmv)
  const STATUS_MSG = { good: '✅ Ótima margem — preço bem calibrado', warning: '⚠️ Margem apertada — considere aumentar o preço', danger: '🔴 CMV alto — este preço não cobre bem os custos' }
  const min = Math.ceil(cost * 2)
  const max = Math.ceil(cost * 8)

  return (
    <div className="space-y-6">
      <div className="p-5 bg-stone-50 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-stone-600">Preço de venda simulado</label>
          <span className="text-2xl font-bold text-stone-900 tabular-nums">{formatCurrency(price)}</span>
        </div>
        <input
          type="range" min={min} max={max} step={0.5} value={price}
          onChange={e => setPrice(parseFloat(e.target.value))}
          className="w-full accent-[#03a54e]"
        />
        <div className="flex justify-between text-xs text-stone-400 mt-1">
          <span>{formatCurrency(min)}</span>
          <span>{formatCurrency(max)}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-stone-50 rounded-xl">
          <p className="text-xs text-stone-400 uppercase mb-1">Custo</p>
          <p className="text-xl font-bold text-stone-800">{formatCurrency(cost)}</p>
        </div>
        <div className={`text-center p-4 rounded-xl ${status === 'good' ? 'bg-[#03a54e]/10' : status === 'warning' ? 'bg-amber-50' : 'bg-red-50'}`}>
          <p className="text-xs text-stone-400 uppercase mb-1">CMV</p>
          <p className={`text-xl font-bold tabular-nums ${status === 'good' ? 'text-[#025c2b]' : status === 'warning' ? 'text-amber-700' : 'text-red-700'}`}>{cmv.toFixed(1)}%</p>
        </div>
        <div className="text-center p-4 bg-[#03a54e]/10 rounded-xl">
          <p className="text-xs text-stone-400 uppercase mb-1">Margem</p>
          <p className="text-xl font-bold text-[#025c2b]">{marginPct.toFixed(1)}%</p>
          <p className="text-xs text-[#03a54e]">{formatCurrency(margin)}</p>
        </div>
      </div>

      <div className={`p-4 rounded-xl text-sm font-medium ${status === 'good' ? 'bg-[#03a54e]/10 text-[#025c2b]' : status === 'warning' ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-800'}`}>
        {STATUS_MSG[status]}
      </div>

      <div className="text-xs text-stone-400 border-t border-stone-100 pt-4">
        <p className="font-medium text-stone-500 mb-2">Referências de mercado para CMV saudável:</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-[#03a54e]/10 rounded-lg text-center"><p className="font-semibold text-[#025c2b]">≤ 25%</p><p className="text-[#03a54e]">Excelente</p></div>
          <div className="p-2 bg-amber-50 rounded-lg text-center"><p className="font-semibold text-amber-700">25–38%</p><p className="text-amber-600">Aceitável</p></div>
          <div className="p-2 bg-red-50 rounded-lg text-center"><p className="font-semibold text-red-700">&gt; 38%</p><p className="text-red-500">Revisar</p></div>
        </div>
      </div>
    </div>
  )
}
