import { useState, useMemo } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const CONCORRENTES = ['Ninny', 'Nino', 'Piselli', 'A Mano', 'Solo', 'Pecorino', 'Cantucci', 'Trattoria do Rosário', 'Doc Cucina']

type Row = { prato: string; precos: (number | null)[] }
type Section = { categoria: string; itens: Row[] }

const DATA: Section[] = [
  {
    categoria: 'Antipasti',
    itens: [
      { prato: 'Burrata',               precos: [129, 73,   97,   89,   84,   74,   null, 129,  89  ] },
      { prato: 'Carpaccio de Carne',    precos: [89,  69,   98,   85,   59,   62,   null, 89,   69  ] },
      { prato: 'Bruschetta Tradicional',precos: [79,  47,   null, null, 38,   33,   38,  90,   null] },
      { prato: 'Salada Caprese',        precos: [69,  null, 95,   null, null, 58,   null, 115,  null] },
      { prato: 'Salada Mista',          precos: [74,  69,   103,  74,   53,   59,   null, 54,   69  ] },
      { prato: 'Antipasto Misto',       precos: [159, null, 105,  null, 89,   null, null, 129,  null] },
      { prato: 'Focaccia',              precos: [20,  null, null, null, null, null, null, null, 54  ] },
    ],
  },
  {
    categoria: 'Massas',
    itens: [
      { prato: 'Carbonara',             precos: [89,  85,  121,  89,   95,   73,  69,  99,  89  ] },
      { prato: 'Alla Bolognese',        precos: [89,  null, null, null, 77,   72,  null,99,  null] },
      { prato: 'Lasagna Bolognese',     precos: [119, 98,  119,  96,   89,   null,69,  null,null] },
      { prato: 'Ravioli Clássico',      precos: [119, null,118,  94,   69,   72,  69,  null,99  ] },
      { prato: 'Gnocchi',               precos: [119, 89,  108,  null, null, null, null,null,89  ] },
      { prato: 'Amatriciana',           precos: [89,  89,  116,  null, null, null, null,null,null] },
      { prato: 'Pomodoro e Basilico',   precos: [89,  null,null, null, null, null, null,null,null] },
      { prato: 'Pesto',                 precos: [89,  89,  null, null, null, null, null,null,null] },
      { prato: 'Pappardelle / Ragù',   precos: [129, null,126,  null, null, null, null,99,  84  ] },
      { prato: 'Al Salmone',            precos: [129, null,null, null, null, 76,  76,  null,null] },
      { prato: 'Alla Pescatora',        precos: [159, 144, 185,  159,  98,   null,null,269, null] },
    ],
  },
  {
    categoria: 'Carnes',
    itens: [
      { prato: 'Filé à Parmegiana',     precos: [129, null,null, 105,  98,   89,  null,null,94  ] },
      { prato: 'Saltimbocca',           precos: [null,96,  169,  null, null, 98,  null,129, 94  ] },
      { prato: 'Ossobuco',              precos: [null,null,164,  147,  null, null,null,null,125 ] },
      { prato: 'Fileto Biscottato',     precos: [98,  null,null, null, null, null,null,null,null] },
    ],
  },
  {
    categoria: 'Sobremesas',
    itens: [
      { prato: 'Tiramisù',              precos: [39,  45,  59,   58,   37,   null,null,45,  45  ] },
      { prato: 'Panna Cotta',           precos: [null,null,46,   49,   31,   null,null,null,32  ] },
      { prato: 'Petit Gâteau',          precos: [null,null,null, 52,   null, null,null,45,  49  ] },
    ],
  },
  {
    categoria: 'Drinks',
    itens: [
      { prato: 'Caipirinha',            precos: [29.9,null,42,  30,   29,   33,  null,25,  null] },
      { prato: 'Caipirosca Nacional',   precos: [29.9,null,49,  36,   32,   24,  null,28,  null] },
      { prato: 'Gin Tônica',            precos: [29.9,48,  58,  42,   33,   26,  null,45,  null] },
      { prato: 'Aperol Spritz',         precos: [null,46,  56,  45,   38,   40,  null,56,  null] },
      { prato: 'Negroni',               precos: [null,47,  58,  43,   46,   40,  null,55,  null] },
    ],
  },
  {
    categoria: 'Bebidas',
    itens: [
      { prato: 'Água Mineral',          precos: [7.4, null,12,  11.9, 11,   9,   null,10,  null] },
      { prato: 'Refrigerante',          precos: [11,  12,  12,  12.5, 10,   10,  null,12,  null] },
      { prato: 'Suco Natural Laranja',  precos: [15,  18,  16,  16,   16,   16,  null,15,  null] },
      { prato: 'Stella Artois',         precos: [15,  20,  22,  16.9, 17,   17.9,null,18,  null] },
    ],
  },
]

const CATS = ['Todas', ...DATA.map(s => s.categoria)]

function badge(ninny: number, media: number) {
  const diff = ((ninny - media) / media) * 100
  if (Math.abs(diff) < 5) return { label: 'Na média', color: 'bg-stone-100 text-stone-500', icon: <Minus size={11} /> }
  if (diff > 0) return { label: `+${diff.toFixed(0)}%`, color: 'bg-red-50 text-red-600', icon: <TrendingUp size={11} /> }
  return { label: `${diff.toFixed(0)}%`, color: 'bg-emerald-50 text-emerald-700', icon: <TrendingDown size={11} /> }
}

export function Benchmarking() {
  const [catFilter, setCatFilter] = useState('Todas')

  const sections = useMemo(() =>
    catFilter === 'Todas' ? DATA : DATA.filter(s => s.categoria === catFilter),
    [catFilter]
  )

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#03a54e]">Benchmarking</h1>
        <p className="text-stone-400 mt-1 text-sm">
          Preços do Ninny comparados com 8 concorrentes em Brasília. Fonte: pesquisa de campo Grupo Gestão (abr/2026).
        </p>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-3 mb-5">
        <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
          <TrendingDown size={11} /> Abaixo da média
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full font-medium">
          <Minus size={11} /> Na média (±5%)
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-medium">
          <TrendingUp size={11} /> Acima da média
        </span>
      </div>

      {/* Filtro por categoria */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATS.map(c => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
              catFilter === c
                ? 'bg-[#025c2b] text-white shadow-sm'
                : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-stone-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {sections.map(section => (
          <div key={section.categoria} className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-stone-100 bg-stone-50/50">
              <h2 className="font-semibold text-stone-700">{section.categoria}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-50">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-stone-400 uppercase tracking-wide min-w-[180px]">Prato</th>
                    {CONCORRENTES.map((c, i) => (
                      <th
                        key={c}
                        className={`text-right px-3 py-2.5 text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${
                          i === 0 ? 'text-[#025c2b]' : 'text-stone-400'
                        }`}
                      >
                        {c}
                      </th>
                    ))}
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-stone-400 uppercase tracking-wide">Média conc.</th>
                    <th className="text-center px-4 py-2.5 text-xs font-semibold text-stone-400 uppercase tracking-wide">Posição</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {section.itens.map(item => {
                    const ninnyPrice = item.precos[0]
                    const concPrecos = item.precos.slice(1).filter((p): p is number => p !== null)
                    const media = concPrecos.length > 0
                      ? concPrecos.reduce((a, b) => a + b, 0) / concPrecos.length
                      : null
                    const pos = ninnyPrice !== null && media !== null ? badge(ninnyPrice, media) : null

                    return (
                      <tr key={item.prato} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-stone-700">{item.prato}</td>
                        {item.precos.map((p, i) => (
                          <td
                            key={i}
                            className={`px-3 py-3 text-right tabular-nums ${
                              i === 0
                                ? 'font-semibold text-[#025c2b]'
                                : 'text-stone-500'
                            }`}
                          >
                            {p !== null ? formatCurrency(p) : <span className="text-stone-200">—</span>}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-right tabular-nums text-stone-500">
                          {media !== null ? formatCurrency(media) : <span className="text-stone-200">—</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {pos ? (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${pos.color}`}>
                              {pos.icon}{pos.label}
                            </span>
                          ) : (
                            <span className="text-stone-200 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
