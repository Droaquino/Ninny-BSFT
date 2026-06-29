import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/layout'
import { Dashboard } from '@/pages/Dashboard'
import { RecipeList } from '@/pages/RecipeList'
import { RecipeDetail } from '@/pages/RecipeDetail'
import { Pricing } from '@/pages/Pricing'
import { Cmv } from '@/pages/Cmv'
import { Insumos } from '@/pages/Insumos'
import { Benchmarking } from '@/pages/Benchmarking'
import { Analise } from '@/pages/Analise'
import { Executivo } from '@/pages/Executivo'
import { Login } from '@/pages/Login'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { LoadingState } from '@/components/ui/states'
import './index.css'

function AppRoutes() {
  const { user, loading, authDisabled } = useAuth()

  if (loading) return <LoadingState label="Carregando…" />

  if (!authDisabled && !user) return <Login />

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"              element={<Dashboard />} />
          <Route path="/fichas"        element={<RecipeList />} />
          <Route path="/fichas/:id"    element={<RecipeDetail />} />
          <Route path="/precificacao"  element={<Pricing />} />
          <Route path="/cmv"           element={<Cmv />} />
          <Route path="/insumos"       element={<Insumos />} />
          <Route path="/benchmarking"  element={<Benchmarking />} />
          <Route path="/analise"       element={<Analise />} />
          <Route path="/executivo"     element={<Executivo />} />
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
