import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/layout'
import { Dashboard } from '@/pages/Dashboard'
import { RecipeList } from '@/pages/RecipeList'
import { RecipeDetail } from '@/pages/RecipeDetail'
import { Pricing } from '@/pages/Pricing'
import { Cmv } from '@/pages/Cmv'
import { Login } from '@/pages/Login'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { LoadingState } from '@/components/ui/states'
import './index.css'

function AppRoutes() {
  const { user, loading, authDisabled } = useAuth()

  if (loading) return <LoadingState label="Carregando…" />

  // Sem Supabase configurado → autenticação desabilitada, acesso direto.
  if (!authDisabled && !user) return <Login />

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"             element={<Dashboard />} />
          <Route path="/fichas"       element={<RecipeList />} />
          <Route path="/fichas/:id"   element={<RecipeDetail />} />
          <Route path="/precificacao" element={<Pricing />} />
          <Route path="/cmv"          element={<Cmv />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
