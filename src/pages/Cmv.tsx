import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { CATEGORY_LABELS, type Category } from '@/types/database'
import { cmvStatus } from '@/lib/utils'
import { useRecipes } from '@/hooks/useRecipes'
import { LoadingState, EmptyState } from '@/components/ui/states'

const CMV_BOM     = 30
const CMV_ATENCAO = 38

function CmvBadge({ pct }: { pct: number }) {
  const s = cmvStatus(pct)
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full tabular-nums ${
      s === 'good'    ? 'bg-[#03a54e]/10 text-[#025c2b]' :
      s === 'warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
    }`}>
      {pct.toFixed(1)}%
    </span>
  )
}

export function Cmv() {
  const { recipes, loading } = useRecipes()

  const pratos = useMemo(() => recipes.filter(r => r.category !== 'preparos'), [recipes])

  const cmvMedio = useMemo(() => {
    if (!pratos.length) return 0
    return pratos.reduce((acc, r) => acc + r.cmv_pct, 0) / pratos.length
  }, [pratos])

  const piores10 = useMemo(() =>
    [...pratos].sort((a, b) => b.cmv_pct - a.cmv_pct).slice(0, 10),
  [pratos])

  const porCategoria = useMemo(() => {
    const map: Record<string, { total: number; count: number; bom: number; atencao: number; critico: number }> = {}
    pratos.forEach(r => {
      if (!map[r.category]) map[r.category] = { total: 0, count: 0, bom: 0, atencao: 0, critico: 0 }
      map[r.category].total += r.cmv_pct
      map[r.category].count++
      const s = cmvStatus(r.cmv_pct)
      if (s === 'good')    map[r.category].bom++
      if (s === 'warning') map[r.category].atencao++
      if (s === 'danger')  map[r.category].critico++
    })
    return Object.entries(map)
      .map(([cat, v]) => ({
        cat: cat as Category,
        label: CATEGORY_LABELS[cat as Category] ?? cat,
        media: parseFloat((v.total / v.count).toFixed(1)),
        count: v.count,
        bom: v.bom,
        atencao: v.atencao,
        critico: v.critico,
      }))
      .sort((a, b) => b.media - a.media)
  }, [pratos])

  const contagens = useMemo(() => ({
    bom:     pratos.filter(r => cmvStatus(r.cmv_pct) === 'good').length,
    atencao: pratos.filter(r => cmvStatus(r.cmv_pct) === 'warning').length,
    critico: pratos.filter(r => cmvStatus(r.cmv_pct) === 'danger').length,
  }), [pratos])

  if (loading) return <LoadingState label="Calculando o CMV…" />

  if (!pratos.length) return (
    <div className="p-8">
      <EmptyState
        title="Sem pratos para analisar"
        message="Cadastre fichas técnicas para ver a análise de CMV aqui."
      />
    </div>
  )

  const statusMedio = cmvStatus(cmvMedio)

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#03a54e]">Análise de CMV</h1>
        <p className="text-stone-400 mt-1 text-sm">Custo de Mercadoria Vendida — quanto do preço de venda vai para ingredientes</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`rounded-2xl border p-5 ${
          statusMedio === 'good' ? 'bg-[#03a54e]/10 border-[#03a54e]/20' :
          statusMedio === 'warning' ? 'bg-amber-50 border-amber-100' :
          'bg-red-50 border-red-100'
        }`}>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">CMV Médio Geral</p>
          <p className={`text-3xl font-bold tabular-nums ${
            statusMedio === 'good' ? 'text-[#025c2b]' :
            statusMedio === 'warning' ? 'text-amber-700' : 'text-red-700'
          }`}>{cmvMedio.toFixed(1)}%</p>
          <p className="text-xs mt-1 text-stone-400">{pratos.length} pratos</p>
        </div>
        <div className="bg-[#03a54e]/10 border border-[#03a54e]/20 rounded-2xl p-5">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Bom (≤ {CMV_BOM}%)</p>
          <p className="text-3xl font-bold text-[#025c2b]">{contagens.bom}</p>
          <div className="w-full h-1.5 bg-white/60 rounded-full mt-2">
            <div className="h-full bg-[#03a54e] rounded-full" style={{ width: `${pratos.length ? (contagens.bom/pratos.length)*100 : 0}%` }} />
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Atenção ({CMV_BOM}–{CMV_ATENCAO}%)</p>
          <p className="text-3xl font-bold text-amber-700">{contagens.atencao}</p>
          <div className="w-full h-1.5 bg-white/60 rounded-full mt-2">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pratos.length ? (contagens.atencao/pratos.length)*100 : 0}%` }} />
          </div>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Crítico (&gt; {CMV_ATENCAO}%)</p>
          <p className="text-3xl font-bold text-red-700">{contagens.critico}</p>
          <div className="w-full h-1.5 bg-white/60 rounded-full mt-2">
            <div className="h-full bg-red-400 rounded-full" style={{ width: `${pratos.length ? (contagens.critico/pratos.length)*100 : 0}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ranking dos 10 piores */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle size={16} className="text-red-500" />
            <h2 className="text-base font-bold text-stone-800">10 Pratos com Maior CMV</h2>
          </div>
          <div className="space-y-2">
            {piores10.map((r, i) => {
              const status = cmvStatus(r.cmv_pct)
              const barColor = status === 'danger' ? 'bg-red-400' : status === 'warning' ? 'bg-amber-400' : 'bg-[#03a54e]'
              return (
                <div key={r.id} className="flex items-center gap-3">
                  <span className="text-xs text-stone-400 w-5 text-right font-mono">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium text-stone-700 truncate pr-2">{r.name}</span>
                      <CmvBadge pct={r.cmv_pct} />
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full">
                      <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(r.cmv_pct, 100)}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CMV por categoria */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-[#03a54e]" />
            <h2 className="text-base font-bold text-stone-800">CMV Médio por Categoria</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={porCategoria} layout="vertical" margin={{ left: 0, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1ede4" />
              <XAxis type="number" domain={[0, 80]} tickFormatter={v => `${v}%`}
                tick={{ fontSize: 10, fill: '#a8a29e' }} />
              <YAxis type="category" dataKey="label" width={110}
                tick={{ fontSize: 10, fill: '#57534e' }} />
              <Tooltip
                formatter={(v) => [`${Number(v).toFixed(1)}%`, 'CMV Médio']}
                contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.1)', fontSize: 12 }} />
              <Bar dataKey="media" radius={[0, 6, 6, 0]}>
                {porCategoria.map((entry, i) => (
                  <Cell key={i} fill={
                    entry.media > CMV_ATENCAO ? '#ef4444' :
                    entry.media > CMV_BOM     ? '#f59e0b' : '#03a54e'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela por categoria */}
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-2">
          <CheckCircle size={16} className="text-[#03a54e]" />
          <h2 className="text-base font-bold text-stone-800">Resumo por Categoria</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 text-left border-b border-stone-100">
              <th className="px-6 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Categoria</th>
              <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-center">Pratos</th>
              <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-right">CMV Médio</th>
              <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-center">Bom</th>
              <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-center">Atenção</th>
              <th className="px-6 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide text-center">Crítico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {porCategoria.map(cat => (
              <tr key={cat.cat} className="hover:bg-stone-50/50">
                <td className="px-6 py-3 font-medium text-stone-800">{cat.label}</td>
                <td className="px-4 py-3 text-stone-500 text-center">{cat.count}</td>
                <td className="px-4 py-3 text-right">
                  <CmvBadge pct={cat.media} />
                </td>
                <td className="px-4 py-3 text-center">
                  {cat.bom > 0 && <span className="text-xs font-semibold text-[#025c2b] bg-[#03a54e]/10 px-2 py-0.5 rounded-full">{cat.bom}</span>}
                </td>
                <td className="px-4 py-3 text-center">
                  {cat.atencao > 0 && <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{cat.atencao}</span>}
                </td>
                <td className="px-6 py-3 text-center">
                  {cat.critico > 0 && <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">{cat.critico}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
