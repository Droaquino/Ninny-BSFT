import { Construction } from 'lucide-react'

export function Cmv() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
        <Construction size={28} className="text-amber-500" />
      </div>
      <h1 className="text-xl font-bold text-[#03a54e] mb-2">CMV</h1>
      <p className="text-gray-500 max-w-sm">
        Módulo em desenvolvimento. Disponível na Fase 3 do roadmap.
      </p>
    </div>
  )
}
