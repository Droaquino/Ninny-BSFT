import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import ninnyLogo from '@/assets/ninny-logo.avif'

type Mode = 'login' | 'signup'

export function Login() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode]         = useState<Mode>('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [sentEmail, setSentEmail] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      setLoading(false)
      if (error) { toast.error(error); return }
      toast.success('Bem-vindo de volta!')
    } else {
      const { error, needsConfirmation } = await signUp(email, password)
      setLoading(false)
      if (error) { toast.error(error); return }
      if (needsConfirmation) {
        setSentEmail(true)
        toast.success('Conta criada!', { description: 'Confirme pelo link enviado ao seu e-mail.' })
      } else {
        toast.success('Conta criada! Você já está dentro.')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf8f0] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#025c2b] rounded-3xl p-4 mb-4">
            <img src={ninnyLogo} alt="Ninny" className="w-20 h-20 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-[#025c2b]">Ninny BSFT</h1>
          <p className="text-stone-400 text-sm mt-1">Gestão de cardápio e custos</p>
        </div>

        {sentEmail ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#03a54e]/10 flex items-center justify-center mx-auto mb-4">
              <Mail size={26} className="text-[#03a54e]" />
            </div>
            <h2 className="font-bold text-stone-800">Confirme seu e-mail</h2>
            <p className="text-sm text-stone-500 mt-2">
              Enviamos um link para <span className="font-medium text-stone-700">{email}</span>.
              Clique nele e depois volte aqui para entrar.
            </p>
            <button
              onClick={() => { setSentEmail(false); setMode('login') }}
              className="mt-5 text-sm font-medium text-[#03a54e] hover:underline"
            >
              Já confirmei — ir para o login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-100 p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-stone-600 mb-1.5 block">E-mail</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#03a54e]/30 focus:border-[#03a54e]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-stone-600 mb-1.5 block">Senha</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#03a54e]/30 focus:border-[#03a54e]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-stone-400 mt-1.5">Mínimo de 6 caracteres.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#025c2b] text-white py-2.5 rounded-xl font-semibold hover:bg-[#03a54e] transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>

            <div className="text-center text-sm text-stone-400 pt-1">
              {mode === 'login' ? (
                <>Primeiro acesso?{' '}
                  <button type="button" onClick={() => setMode('signup')} className="font-medium text-[#03a54e] hover:underline">
                    Criar conta
                  </button>
                </>
              ) : (
                <>Já tem conta?{' '}
                  <button type="button" onClick={() => setMode('login')} className="font-medium text-[#03a54e] hover:underline">
                    Entrar
                  </button>
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
