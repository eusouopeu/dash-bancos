import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './layout/Layout'
import { PanoramaGeral } from './pages/PanoramaGeral'
import { TabelaDeIndicadores } from './pages/TabelaDeIndicadores'
import { Metodologia } from './pages/Metodologia'
import { FontesDeDados } from './pages/FontesDeDados'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<PanoramaGeral />} />
          <Route path="tabela-de-indicadores" element={<TabelaDeIndicadores />} />
          <Route path="metodologia" element={<Metodologia />} />
          <Route path="fontes-de-dados" element={<FontesDeDados />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
