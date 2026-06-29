import { TrendingUp, Minus, Star, AlertTriangle, XCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

type Saida = 'alta' | 'media' | 'baixa'

interface Prato {
  nome: string
  categoria: string
  saida: Saida
  justificativa: string
  versoes?: string
  faturamentoNota?: 'alto' | 'medio' | 'baixo'
}

const PRATOS: Prato[] = [
  // ALTA SAÍDA
  { nome: 'Lasanha', categoria: 'Pratos Compostos', saida: 'alta', justificativa: 'Maior volume em quantidade e faturamento. Alta previsibilidade de porcionamento e produção em batelada.', versoes: 'Individual + Tigela', faturamentoNota: 'alto' },
  { nome: 'Sughi (Molhos Tradicionais)', categoria: 'Sughi', saida: 'alta', justificativa: 'Top 2 em faturamento. Giro altíssimo tanto no salão quanto no iFood. Base simples e padronizada.', versoes: 'Individual + Duplo + Tigela', faturamentoNota: 'alto' },
  { nome: 'Alla Bolognese', categoria: 'Sughi', saida: 'alta', justificativa: 'Molho de baixo custo relativo com excelente estabilidade de preparo. Aceitação ampla.', versoes: 'Individual + Duplo', faturamentoNota: 'alto' },
  { nome: 'Alla Amatriciana', categoria: 'Sughi', saida: 'alta', justificativa: 'Recorrência alta ao longo do ano sem sazonalidade crítica. Molho estável com insumos comuns.', versoes: 'Individual + Duplo', faturamentoNota: 'medio' },
  { nome: 'Alla Carbonara', categoria: 'Sughi', saida: 'alta', justificativa: 'Entre os molhos clássicos mais pedidos. Clientes aceitam valor mais alto pelo ingrediente diferenciado.', versoes: 'Individual + Duplo', faturamentoNota: 'medio' },
  { nome: 'Gnocchi', categoria: 'Pratos Compostos', saida: 'alta', justificativa: 'Alta saída individual, especialmente no iFood. Prato reconhecível com forte aceitação.', versoes: 'Individual + Tigela', faturamentoNota: 'medio' },
  { nome: 'Pappardelle al Sugo de Polpette', categoria: 'Sughi Special', saida: 'alta', justificativa: 'Entre os mais pedidos nos relatórios mensais. Apresentação premium com volume consistente.', versoes: 'Individual', faturamentoNota: 'medio' },

  // MÉDIA SAÍDA
  { nome: 'Tagliatelle / Tagliolini / Penne', categoria: 'Massas', saida: 'media', justificativa: 'Frequentes nos relatórios, mas volume diluído entre vários molhos. Demanda pulverizada.', versoes: 'Apenas Individual', faturamentoNota: 'baixo' },
  { nome: 'Pomodoro e Basilico', categoria: 'Sughi', saida: 'media', justificativa: 'Vendas constantes sem volume suficiente para justificar versão dupla.', versoes: 'Apenas Individual', faturamentoNota: 'baixo' },
  { nome: 'Alla Arrabbiata', categoria: 'Sughi', saida: 'media', justificativa: 'Giro compatível com consumo individual.', versoes: 'Apenas Individual', faturamentoNota: 'baixo' },
  { nome: 'Alla Norma', categoria: 'Sughi', saida: 'media', justificativa: 'Volume moderado com incidência majoritária em pedidos individuais.', versoes: 'Apenas Individual', faturamentoNota: 'baixo' },
  { nome: 'Pesto alla Genovese', categoria: 'Sughi', saida: 'media', justificativa: 'Vendas constantes com exposição maior a variação de custo (queijo, castanhas).', versoes: 'Apenas Individual', faturamentoNota: 'baixo' },
  { nome: 'Molho Branco', categoria: 'Sughi', saida: 'media', justificativa: 'Giro compatível com versão individual.', versoes: 'Apenas Individual', faturamentoNota: 'baixo' },
  { nome: 'Ravioli', categoria: 'Pratos Compostos', saida: 'media', justificativa: 'Boa aceitação individual, queda acentuada em formatos maiores.', versoes: 'Apenas Individual', faturamentoNota: 'baixo' },
  { nome: 'Filé à Parmegiana', categoria: 'Pratos Compostos', saida: 'media', justificativa: 'Demanda concentrada na versão individual. CMV sensível por filé mignon, queijo e fritura.', versoes: 'Apenas Individual', faturamentoNota: 'medio' },
  { nome: 'Sughi Special (Alfredo, Diavola, Funghi)', categoria: 'Sughi Special', saida: 'media', justificativa: 'Volume moderado com insumos mais caros e específicos.', versoes: 'Apenas Individual', faturamentoNota: 'baixo' },
  { nome: 'Al Salmone', categoria: 'Sughi Special', saida: 'media', justificativa: 'Volume moderado. Insumo sensível a preço de mercado.', versoes: 'Apenas Individual', faturamentoNota: 'baixo' },

  // BAIXA SAÍDA
  { nome: 'Alla Pescatora / Al Mare', categoria: 'Sughi Al Mare', saida: 'baixa', justificativa: 'Volume reduzido e instável. Insumos caros e sazonais.', versoes: 'Reavaliar manutenção', faturamentoNota: 'baixo' },
  { nome: 'Alla Marinara', categoria: 'Sughi', saida: 'baixa', justificativa: 'Baixo volume com baixa recorrência nos relatórios mensais.', versoes: 'Reavaliar manutenção', faturamentoNota: 'baixo' },
  { nome: 'Alle Alici', categoria: 'Sughi', saida: 'baixa', justificativa: 'Presença irregular nos relatórios. Volume não sustenta manutenção no cardápio principal.', versoes: 'Reavaliar manutenção', faturamentoNota: 'baixo' },
  { nome: 'Filetto Biscottato', categoria: 'Pratos Compostos', saida: 'baixa', justificativa: 'Volume muito reduzido. Custo de proteína elevado para o giro gerado.', versoes: 'Reavaliar manutenção', faturamentoNota: 'baixo' },
  { nome: 'Cotoletta / Milanese', categoria: 'Pratos Compostos', saida: 'baixa', justificativa: 'Baixa recorrência. Concorrentes posicionam o produto de forma mais eficiente.', versoes: 'Reavaliar manutenção', faturamentoNota: 'baixo' },
]

const TOP_FATURAMENTO = [
  { nome: 'Sughi Molho Individual', qty: 110, faturamento: 8690 },
  { nome: 'Sughi Prato Duplo', qty: 86, faturamento: 11094 },
  { nome: 'Lasanha Individual (iFood)', qty: 23, faturamento: 2530 },
  { nome: 'Lasanha Tigela (iFood)', qty: 16, faturamento: 3360 },
  { nome: 'Gnocchi Individual', qty: 29, faturamento: 2580 },
  { nome: 'Sughi Molho Tigela', qty: 30, faturamento: 4770 },
  { nome: 'Alla Carbonara', qty: 45, faturamento: 0 },
  { nome: 'Alla Bolognese', qty: 29, faturamento: 0 },
  { nome: 'Pappardelle', qty: 34, faturamento: 0 },
  { nome: 'Penne', qty: 50, faturamento: 0 },
]

const SAIDA_CONFIG = {
  alta:  { label: 'Alta Saída',   color: 'text-emerald-700 bg-emerald-50',   border: 'border-l-emerald-400', icon: <Star size={14} /> },
  media: { label: 'Média Saída',  color: 'text-amber-700 bg-amber-50',        border: 'border-l-amber-400',   icon: <Minus size={14} /> },
  baixa: { label: 'Baixa Saída',  color: 'text-red-600 bg-red-50',            border: 'border-l-red-400',     icon: <XCircle size={14} /> },
}

export function Analise() {
  const alta  = PRATOS.filter(p => p.saida === 'alta')
  const media = PRATOS.filter(p => p.saida === 'media')
  const baixa = PRATOS.filter(p => p.saida === 'baixa')

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#03a54e]">Análise de Pratos</h1>
        <p className="text-stone-400 mt-1 text-sm">
          Classificação baseada em 2 anos de histórico de vendas (Jan/2024 – Jun/2026). Fonte: Grupo Gestão.
        </p>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Alta Saída', count: alta.length, color: 'text-emerald-700', bg: 'bg-emerald-50', icon: <Star size={18} className="text-emerald-600" /> },
          { label: 'Média Saída', count: media.length, color: 'text-amber-700', bg: 'bg-amber-50', icon: <Minus size={18} className="text-amber-600" /> },
          { label: 'Baixa Saída', count: baixa.length, color: 'text-red-600', bg: 'bg-red-50', icon: <AlertTriangle size={18} className="text-red-500" /> },
        ].map(c => (
          <div key={c.label} className={`${c.bg} rounded-2xl p-4 flex items-center gap-3`}>
            <div className="shrink-0">{c.icon}</div>
            <div>
              <p className={`text-2xl font-bold ${c.color}`}>{c.count}</p>
              <p className="text-xs text-stone-500">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top faturamento */}
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-stone-100">
          <h2 className="font-semibold text-stone-700 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#03a54e]" /> Top Vendas — Janeiro/2024 (amostra)
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">Quantidade vendida e faturamento bruto no período</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-50 bg-stone-50/50">
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-stone-400 uppercase tracking-wide">#</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-stone-400 uppercase tracking-wide">Prato</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-stone-400 uppercase tracking-wide">Qtde</th>
                <th className="text-right px-5 py-2.5 text-xs font-semibold text-stone-400 uppercase tracking-wide">Faturamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {TOP_FATURAMENTO.map((p, i) => (
                <tr key={p.nome} className="hover:bg-stone-50/50">
                  <td className="px-5 py-3 text-stone-400 tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-stone-700">{p.nome}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-stone-600">{p.qty}</td>
                  <td className="px-5 py-3 text-right tabular-nums font-medium text-[#025c2b]">
                    {p.faturamento > 0 ? formatCurrency(p.faturamento) : <span className="text-stone-300 text-xs">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seções por saída */}
      {([['alta', alta], ['media', media], ['baixa', baixa]] as [Saida, Prato[]][]).map(([saida, pratos]) => {
        const cfg = SAIDA_CONFIG[saida]
        return (
          <div key={saida} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${cfg.color}`}>
                {cfg.icon} {cfg.label}
              </span>
              <span className="text-sm text-stone-400">{pratos.length} pratos</span>
            </div>
            <div className="space-y-2">
              {pratos.map(p => (
                <div
                  key={p.nome}
                  className={`bg-white border border-stone-100 border-l-4 ${cfg.border} rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-800 text-sm">{p.nome}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{p.justificativa}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-stone-400">{p.categoria}</p>
                    {p.versoes && <p className="text-xs text-stone-500 mt-0.5 italic">{p.versoes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <p className="text-xs text-stone-400 mt-2">
        * Análise baseada no relatório de pratos por saída entregue pelo Grupo Gestão em março/2026.
        Dados de vendas coletados do sistema iFood e relatórios internos do restaurante.
      </p>
    </div>
  )
}
