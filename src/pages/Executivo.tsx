import { formatCurrency } from '@/lib/utils'
import { Utensils, Coffee, Cake, TrendingUp } from 'lucide-react'

interface Combo {
  entrada: string
  prato: string
  sobremesa: string
  rendimento: number
  cmv: number
  preco: number
  margem: number
}

const COMBOS: Combo[] = [
  { entrada: 'Bruschetta', prato: 'Quatro Queijos',            sobremesa: 'Tiramisù', rendimento: 752, cmv: 22.25, preco: 79.90, margem: 27.65 },
  { entrada: 'Bruschetta', prato: 'Pomodoro + 2 Polpettes',    sobremesa: 'Tiramisù', rendimento: 855, cmv: 24.02, preco: 79.90, margem: 25.44 },
  { entrada: 'Bruschetta', prato: 'Amatriciana',               sobremesa: 'Tiramisù', rendimento: 725, cmv: 20.62, preco: 79.90, margem: 30.07 },
  { entrada: 'Bruschetta', prato: 'Carbonara',                 sobremesa: 'Tiramisù', rendimento: 745, cmv: 23.13, preco: 79.90, margem: 27.15 },
  { entrada: 'Bruschetta', prato: 'Alho e Óleo',               sobremesa: 'Tiramisù', rendimento: 690, cmv: 17.58, preco: 79.90, margem: 34.04 },
  { entrada: 'Insalata',   prato: 'Quatro Queijos',            sobremesa: 'Tiramisù', rendimento: 682, cmv: 20.79, preco: 79.90, margem: 29.48 },
  { entrada: 'Insalata',   prato: 'Pomodoro + 2 Polpettes',    sobremesa: 'Tiramisù', rendimento: 785, cmv: 22.56, preco: 79.90, margem: 26.66 },
  { entrada: 'Insalata',   prato: 'Amatriciana',               sobremesa: 'Tiramisù', rendimento: 655, cmv: 19.16, preco: 79.90, margem: 31.78 },
  { entrada: 'Insalata',   prato: 'Carbonara',                 sobremesa: 'Tiramisù', rendimento: 675, cmv: 21.67, preco: 79.90, margem: 28.49 },
  { entrada: 'Insalata',   prato: 'Alho e Óleo',               sobremesa: 'Tiramisù', rendimento: 620, cmv: 16.12, preco: 79.90, margem: 35.62 },
]

const avgCmv   = COMBOS.reduce((a, c) => a + c.cmv, 0) / COMBOS.length
const avgMargem = COMBOS.reduce((a, c) => a + c.margem, 0) / COMBOS.length

function margemColor(m: number) {
  if (m >= 30) return 'text-emerald-700 bg-emerald-50'
  if (m >= 25) return 'text-amber-700 bg-amber-50'
  return 'text-red-600 bg-red-50'
}

export function Executivo() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#03a54e]">Menu Executivo</h1>
        <p className="text-stone-400 mt-1 text-sm">
          Combinações testadas e validadas pelo Grupo Gestão. Preço final: <strong>R$&nbsp;79,90</strong> (Entrada + Prato + Tiramisù).
        </p>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Preço do Menu',      value: formatCurrency(79.90),          sub: 'entrada + prato + sobremesa', color: 'text-[#025c2b]' },
          { label: 'CMV Médio',          value: formatCurrency(avgCmv),         sub: `${((avgCmv / 79.90) * 100).toFixed(1)}% do preço`,    color: 'text-stone-700' },
          { label: 'Margem Média',       value: `${avgMargem.toFixed(1)}%`,     sub: 'lucro pretendido',            color: 'text-emerald-700' },
          { label: 'Combos Testados',    value: `${COMBOS.length}`,             sub: '2 entradas × 5 pratos',       color: 'text-stone-700' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-stone-100 p-5">
            <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
            <p className="text-xs text-stone-500 mt-0.5">{c.label}</p>
            <p className="text-xs text-stone-400 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Estrutura do menu */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: <Utensils size={18} />, label: 'Entradas disponíveis', items: ['Bruschetta (2 un) — CMV: R$6,81', 'Mini Insalata — CMV: R$5,35'], note: 'CMV médio: R$6,08' },
          { icon: <Coffee size={18} />,   label: 'Pratos principais',     items: ['Quatro Queijos — CMV: R$9,31', 'Pomodoro + Polpettes — CMV: R$11,08', 'Amatriciana — CMV: R$7,68', 'Carbonara — CMV: R$10,19', 'Alho e Óleo — CMV: R$4,64'], note: 'CMV médio: R$8,58' },
          { icon: <Cake size={18} />,     label: 'Sobremesa',              items: ['Tiramisù (Teste 1) — CMV: R$6,13', 'Tiramisù (Teste 2) — CMV: R$4,38'], note: 'CMV médio: R$5,26' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-stone-100 p-5">
            <div className="flex items-center gap-2 mb-3 text-[#025c2b]">
              {s.icon}
              <p className="font-semibold text-sm text-stone-700">{s.label}</p>
            </div>
            <ul className="space-y-1.5">
              {s.items.map(item => (
                <li key={item} className="text-xs text-stone-600 flex items-start gap-1.5">
                  <span className="text-[#03a54e] mt-0.5 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-stone-400 mt-3 pt-3 border-t border-stone-50">{s.note}</p>
          </div>
        ))}
      </div>

      {/* Tabela de combos */}
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100">
          <h2 className="font-semibold text-stone-700 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#03a54e]" /> Todas as combinações testadas
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-50 bg-stone-50/50">
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-stone-400 uppercase tracking-wide">Entrada</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-stone-400 uppercase tracking-wide">Prato</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-stone-400 uppercase tracking-wide">Rendimento</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-stone-400 uppercase tracking-wide">CMV Total</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-stone-400 uppercase tracking-wide">CMV %</th>
                <th className="text-center px-5 py-2.5 text-xs font-semibold text-stone-400 uppercase tracking-wide">Margem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {COMBOS.map((c, i) => {
                const cmvPct = (c.cmv / c.preco) * 100
                return (
                  <tr key={i} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-5 py-3 text-stone-700 font-medium">{c.entrada}</td>
                    <td className="px-4 py-3 text-stone-700">{c.prato}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-500">{c.rendimento}g</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-stone-700">{formatCurrency(c.cmv)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-500">{cmvPct.toFixed(1)}%</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${margemColor(c.margem)}`}>
                        {c.margem.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-stone-400 mt-4">
        * Dados validados em testes realizados pelo Grupo Gestão em fev–mar/2026. Preço final de R$79,90 posiciona o Ninny
        abaixo da média dos concorrentes (R$69–169), sendo altamente competitivo para o público de almoço.
      </p>
    </div>
  )
}
