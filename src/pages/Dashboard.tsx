import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, TrendingUp, AlertTriangle, Star, ChevronRight } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useRecipes } from '@/hooks/useRecipes'
import { MetricCard } from '@/components/ui/metric-card'
import { CmvBar, CmvDot } from '@/components/ui/cmv-badge'
import { CategoryBadge } from '@/components/ui/badge'
import { formatCurrency, cmvStatus } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/types/database'

const CATEGORY_COLORS: Record<string, string> = {
  entradas: '#03a54e', sughi: '#2563eb', sughi_special: '#7c3aed',
  sughi_al_mare: '#0891b2', pratos_compostos: '#dc2626', pratos_duplos: '#ea580c',
  risoto: '#d97706', sobremesa: '#db2777', bebidas: '#64748b', menu_executivo: '#025c2b', preparos: '#78716c',
}

const CMV_LABEL: Record<string, string> = {
  good: 'Excelente (≤30%)', warning: 'Atenção (30–38%)', danger: 'Revisar (>38%)'
}
const CMV_COLOR: Record<string, string> = { good: '#03a54e', warning: '#f59e0b', danger: '#ef4444' }

export function Dashboard() {
  const { recipes, loading } = useRecipes()

  const stats = useMemo(() => {
    if (!recipes.length) return null
    const avgCmv = recipes.reduce((s, r) => s + r.cmv_pct, 0) / recipes.length
    const sorted = [...recipes].sort((a, b) => b.cmv_pct - a.cmv_pct)
    const alerts = recipes.filter(r => cmvStatus(r.cmv_pct) === 'danger')
    const best = [...recipes].sort((a, b) => a.cmv_pct - b.cmv_pct)[0]
    return { avgCmv, sorted, alerts, best }
  }, [recipes])

  const topCmv = useMemo(() =>
    [...recipes].sort((a, b) => b.cmv_pct - a.cmv_pct).slice(0, 10).map(r => ({
      name: r.name.length > 22 ? r.name.slice(0, 22) + '…' : r.name,
      cmv: parseFloat(r.cmv_pct.toFixed(1)),
      fill: CMV_COLOR[cmvStatus(r.cmv_pct)],
    })), [recipes])

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {}
    recipes.forEach(r => { map[r.category] = (map[r.category] || 0) + 1 })
    return Object.entries(map).map(([cat, count]) => ({
      name: CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] ?? cat,
      value: count,
      fill: CATEGORY_COLORS[cat] ?? '#94a3b8',
    }))
  }, [recipes])

  const cmvDistrib = useMemo(() => {
    const g = recipes.filter(r => cmvStatus(r.cmv_pct) === 'good').length
    const w = recipes.filter(r => cmvStatus(r.cmv_pct) === 'warning').length
    const d = recipes.filter(r => cmvStatus(r.cmv_pct) === 'danger').length
    return [
      { name: CMV_LABEL.good,    value: g, fill: CMV_COLOR.good    },
      { name: CMV_LABEL.warning, value: w, fill: CMV_COLOR.warning },
      { name: CMV_LABEL.danger,  value: d, fill: CMV_COLOR.danger  },
    ].filter(x => x.value > 0)
  }, [recipes])

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-3 border-[#03a54e] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#03a54e]">Visão Geral</h1>
        <p className="text-stone-400 mt-1">{recipes.length} fichas técnicas cadastradas</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard label="Total de Fichas"   value={String(recipes.length)}              icon={BookOpen}      color="neutral" />
        <MetricCard label="CMV Médio"          value={`${stats?.avgCmv.toFixed(1) ?? 0}%`} icon={TrendingUp}    color={stats ? (cmvStatus(stats.avgCmv) === 'good' ? 'green' : cmvStatus(stats.avgCmv) === 'warning' ? 'yellow' : 'red') : 'neutral'} />
        <MetricCard label="Fichas p/ Revisar" value={String(stats?.alerts.length ?? 0)}   icon={AlertTriangle} color={stats?.alerts.length ? 'red' : 'green'} sub="CMV acima de 38%" />
        <MetricCard label="Menor CMV"          value={stats?.best ? `${stats.best.cmv_pct.toFixed(1)}%` : '—'} sub={stats?.best?.name} icon={Star} color="green" />
      </div>

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Top 10 CMV */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-stone-100 p-6">
          <h2 className="text-base font-semibold text-[#025c2b] mb-5">Top 10 Fichas por CMV%</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCmv} layout="vertical" margin={{ left: 8, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1ede4" />
              <XAxis type="number" domain={[0, 60]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#a8a29e' }} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11, fill: '#57534e' }} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'CMV']} contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.1)', fontSize: 12 }} />
              <Bar dataKey="cmv" radius={[0, 6, 6, 0]}>
                {topCmv.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição de saúde */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 flex flex-col">
          <h2 className="text-base font-semibold text-[#025c2b] mb-5">Saúde do Cardápio</h2>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={cmvDistrib} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                  {cmvDistrib.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [v, 'fichas']} contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.1)', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {cmvDistrib.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: d.fill }} />
                  <span className="text-stone-600">{d.name}</span>
                </div>
                <span className="font-semibold text-stone-800">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribuição por categoria */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        <h2 className="text-base font-semibold text-[#025c2b] mb-5">Fichas por Categoria</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={byCategory} margin={{ bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1ede4" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#57534e' }} />
            <YAxis tick={{ fontSize: 11, fill: '#a8a29e' }} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.1)', fontSize: 12 }} />
            <Bar dataKey="value" name="Fichas" radius={[6, 6, 0, 0]}>
              {byCategory.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Fichas para revisar */}
      {stats?.alerts.length ? (
        <div className="bg-white rounded-2xl border border-red-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-red-500" />
            <h2 className="text-base font-semibold text-red-700">Fichas para Revisar</h2>
            <span className="ml-auto text-xs text-stone-400">{stats.alerts.length} fichas com CMV &gt; 38%</span>
          </div>
          <div className="divide-y divide-stone-50">
            {stats.alerts.map(r => (
              <Link key={r.id} to={`/fichas/${r.id}`} className="flex items-center gap-4 py-3 hover:bg-red-50/50 rounded-xl px-2 -mx-2 transition-colors group">
                <CategoryBadge category={r.category} />
                <span className="flex-1 font-medium text-stone-800 text-sm">{r.name}</span>
                <span className="text-red-600 font-bold text-sm tabular-nums">{r.cmv_pct.toFixed(1)}%</span>
                <ChevronRight size={14} className="text-stone-300 group-hover:text-red-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
