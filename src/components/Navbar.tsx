import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  BookOpen,
  Menu,
  X,
  Sparkles,
  User,
  LogOut,
  ShieldCheck,
  BarChart3,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Navbar: React.FC = () => {
  const { user, isOwner, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const navLinks = [
    { title: 'Início', path: '/' },
    { title: 'Conteúdos', path: '/conteudos' },
    { title: 'Planos & Assinatura', path: '/planos' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold tracking-tight shadow-md group-hover:bg-blue-900 transition-colors">
            MS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base sm:text-lg">
                Manoel Santos
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                Boeing
              </span>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Systems Engineering & Lean Transformation
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                isActive(link.path)
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {link.title}
            </Link>
          ))}

          {isOwner && (
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <Link to="/painel">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-8 border-blue-200 hover:bg-blue-50 text-blue-700 dark:text-blue-300"
                >
                  <Layers className="w-3.5 h-3.5" />
                  Painel do Dono
                </Button>
              </Link>
              <Link to="/estatisticas">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-8 border-slate-200 hover:bg-slate-50 text-slate-700 dark:text-slate-300"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Estatísticas
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Auth CTA Right */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative flex items-center gap-2 pl-2 pr-3 h-9 rounded-full border border-border/80"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium max-w-[120px] truncate">{user.name}</span>
                  {isOwner && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-800"
                    >
                      Dono
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/perfil" className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                {isOwner && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/painel"
                        className="flex items-center gap-2 cursor-pointer text-blue-600"
                      >
                        <Layers className="w-4 h-4" />
                        Gerenciar Conteúdos
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/estatisticas"
                        className="flex items-center gap-2 cursor-pointer text-blue-600"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Métricas & Leads
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-600 cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-sm">
                  Entrar
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm shadow-sm"
                >
                  Criar conta grátis
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <Link to="/perfil">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200'
                }`}
              >
                {link.title}
              </Link>
            ))}
          </div>

          {isOwner && (
            <div className="pt-2 border-t border-border flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase text-muted-foreground px-3">
                Gestão
              </span>
              <Link
                to="/painel"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                Painel do Dono
              </Link>
              <Link
                to="/estatisticas"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Estatísticas
              </Link>
            </div>
          )}

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/perfil"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>Meu Perfil ({user.name})</span>
                  <User className="w-4 h-4 text-muted-foreground" />
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-red-600 border-red-200 justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair da Conta
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    Entrar
                  </Button>
                </Link>
                <Link to="/cadastro" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-center">
                    Criar conta grátis
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
