import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Linkedin, ArrowUpRight, ShieldCheck, Compass } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-slate-900 text-slate-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold tracking-tight shadow">
                MS
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Manoel Santos</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Systems Engineering Manager na Boeing. Mais de 20 anos de trajetória na Embraer
              liderando Transformação Lean e Lean Product & Process Development (LPPD). Engenheiro
              Mecânico com M.Sc.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.linkedin.com/in/manoelsantos/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
              >
                <Linkedin className="w-4 h-4 text-blue-400" />
                <span>LinkedIn Oficial</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </a>
              <a
                href="mailto:mqsantos@gmail.com"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>mqsantos@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Navegação rápida */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Navegação
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Início & Biografia
                </Link>
              </li>
              <li>
                <Link to="/conteudos" className="text-slate-400 hover:text-white transition-colors">
                  Acervo de Conteúdos
                </Link>
              </li>
              <li>
                <Link to="/planos" className="text-slate-400 hover:text-white transition-colors">
                  Planos & Assinatura Freemium
                </Link>
              </li>
              <li>
                <Link to="/cadastro" className="text-slate-400 hover:text-white transition-colors">
                  Criar Conta Gratuita
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
                  Área de Membros (Entrar)
                </Link>
              </li>
            </ul>
          </div>

          {/* Temas & Tópicos */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Temas Principais
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Lean Product & Process Development
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Systems Engineering & MBSE
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                The Augmented Engineer & IA
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Metodologia A3 & Liderança
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Gestão Aeroespacial Global
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Manoel Santos. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Ambiente Seguro
            </span>
            <span>•</span>
            <Link to="/planos" className="text-slate-400 hover:text-slate-200">
              Programa de Assinantes
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
