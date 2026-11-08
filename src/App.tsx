/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/context/AuthContext'
import Index from './pages/Index'
import ContentsList from './pages/ContentsList'
import ContentDetail from './pages/ContentDetail'
import Plans from './pages/Plans'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import OwnerPanel from './pages/OwnerPanel'
import Stats from './pages/Stats'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/conteudos" element={<ContentsList />} />
            <Route path="/conteudos/:slug" element={<ContentDetail />} />
            <Route path="/planos" element={<Plans />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/painel" element={<OwnerPanel />} />
            <Route path="/estatisticas" element={<Stats />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
