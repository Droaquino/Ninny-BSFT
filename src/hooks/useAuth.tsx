import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface AuthResult {
  error: string | null
  needsConfirmation?: boolean
}

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  /** true quando não há Supabase configurado — modo aberto (sem login). */
  authDisabled: boolean
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string) => Promise<AuthResult>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/** Traduz erros do Supabase para mensagens amigáveis em português. */
function friendlyError(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('invalid login credentials')) return 'E-mail ou senha incorretos.'
  if (m.includes('email not confirmed'))       return 'Confirme seu e-mail antes de entrar (veja sua caixa de entrada).'
  if (m.includes('user already registered'))   return 'Este e-mail já tem conta. Use "Entrar".'
  if (m.includes('password should be'))         return 'A senha precisa ter pelo menos 6 caracteres.'
  if (m.includes('unable to validate email'))   return 'E-mail inválido.'
  return 'Algo deu errado. Tente novamente em instantes.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const authDisabled = !isSupabaseConfigured || !supabase

  useEffect(() => {
    if (authDisabled) {
      setLoading(false)
      return
    }

    supabase!.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: sub } = supabase!.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
    })

    return () => sub.subscription.unsubscribe()
  }, [authDisabled])

  async function signIn(email: string, password: string): Promise<AuthResult> {
    if (authDisabled) return { error: null }
    const { error } = await supabase!.auth.signInWithPassword({ email: email.trim(), password })
    return { error: error ? friendlyError(error.message) : null }
  }

  async function signUp(email: string, password: string): Promise<AuthResult> {
    if (authDisabled) return { error: null }
    const { data, error } = await supabase!.auth.signUp({ email: email.trim(), password })
    if (error) return { error: friendlyError(error.message) }
    // Sem sessão imediata => precisa confirmar e-mail.
    const needsConfirmation = !data.session
    return { error: null, needsConfirmation }
  }

  async function signOut() {
    if (authDisabled) return
    await supabase!.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, authDisabled, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}
