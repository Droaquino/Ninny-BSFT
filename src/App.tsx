import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/layout'
import { RecipeList } from '@/pages/RecipeList'
import { RecipeDetail } from '@/pages/RecipeDetail'
import { Pricing } from '@/pages/Pricing'
import { Cmv } from '@/pages/Cmv'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<RecipeList />} />
          <Route path="/fichas/:id" element={<RecipeDetail />} />
          <Route path="/precificacao" element={<Pricing />} />
          <Route path="/cmv" element={<Cmv />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
