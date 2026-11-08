import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Linkedin, ArrowUpRight, ShieldCheck } from 'lucide-react'
import { useSiteSettings } from '@/hooks/use-site-settings'

/** Converte um caminho salvo ("planos" ou "/planos" ou "https://...") em rota. */
const asPath = (value: string, fallback: string): string => {
  if (!value) return fallback
  const v = value.trim()
  if (!v) return fallback
  return v.startsWith('/') || v.startsWith('http') || v.startsWith('mailto:') ? v : `/${v}`
}

const FooterLink: React.FC<{ path: string; className: string; children: React.ReactNode }> = ({
  path,
  className,
  children,
}) => {
  if (path.startsWith('http')) {
    return (
      <a href={path} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link to={path} className={className}>
      {children}
    </Link>
  )
}

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings()
  const footer = settings.footer
  const year = new Date().getFullYear()
  const copyright = footer.copyright.replace('{ano}', String(year))

  return (
    <footer className="border-t border-border bg-slate-900 text-slate-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold tracking-tight shadow">
                {footer.brandInitials}
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {footer.brandName}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">{footer.bio}</p>
            <div className="flex items-center gap-3 pt-2">
              {footer.linkedinUrl && (
                <a
                  href={footer.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-blue-400" />
                  <span>{footer.linkedinLabel}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              )}
              {footer.email && (
                <a
                  href={`mailto:${footer.email}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
                >
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>{footer.emailLabel}</span>
                </a>
              )}
            </div>
          </div>

          {/* Navegação rápida */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {footer.navTitle}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {footer.navLinks.map((link, i) => {
                const path = asPath(link.path, '')
                if (!path) return null
                return (
                  <li key={i}>
                    <FooterLink
                      path={path}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </FooterLink>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Temas & Tópicos */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {footer.themesTitle}
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {footer.themes.map((theme, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  {theme}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{copyright}</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {footer.secureLabel}
            </span>
            <span>•</span>
            <FooterLink
              path={asPath(footer.subscribersLinkPath, '/planos')}
              className="text-slate-400 hover:text-slate-200"
            >
              {footer.subscribersLinkLabel}
            </FooterLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
