import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  Users,
  Eye,
  FileText,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Clock,
  Mail,
  AlertTriangle,
  Layers,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AnalyticsService } from '@/services/contentService'
import { PlanInterest } from '@/types/database'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/lib/i18n'

export default function Stats() {
  const { isOwner } = useAuth()
  const { t, lang } = useLanguage()
  const [stats, setStats] = useState<{
    totalSiteViews: number
    totalContentViews: number
    totalLeads: number
    totalContents: number
    siteViewsByPath: { path: string; count: number }[]
    contentViewsByType: { type: string; count: number }[]
    recentInterests: PlanInterest[]
    viewsHistory: { date: string; count: number }[]
  } | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    AnalyticsService.getStats()
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'pro_mensal':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-[11px]">
            {t('plans.proMensal')}
          </Badge>
        )
      case 'pro_anual':
        return (
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 text-[11px]">
            {t('plans.proAnual')}
          </Badge>
        )
      case 'mentoria':
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-[11px]">
            {t('plans.mentoriaBadge')}
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="bg-slate-100 text-slate-800 text-[11px]">
            {t('common.gratis')}
          </Badge>
        )
    }
  }

  if (!isOwner && !loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{t('owner.acessoRestrito')}</h2>
        <p className="text-sm text-slate-600">{t('stats.acessoRestritoTexto')}</p>
        <Link to="/login">
          <Button className="bg-blue-600 text-white">{t('owner.entrarComoDono')}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('stats.titulo')}
            </h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
              Manoel Santos
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">{t('stats.subtitulo')}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/painel">
            <Button variant="outline" className="text-xs">
              <Layers className="w-4 h-4 mr-1.5" />
              {t('stats.painelConteudos')}
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">
                {t('stats.kpiVisitas')}
              </span>
              <Eye className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {loading ? '...' : stats?.totalSiteViews}
            </div>
            <p className="text-[11px] text-slate-400">{t('stats.kpiVisitasDesc')}</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">
                {t('stats.kpiConsumo')}
              </span>
              <FileText className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {loading ? '...' : stats?.totalContentViews}
            </div>
            <p className="text-[11px] text-slate-400">{t('stats.kpiConsumoDesc')}</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">
                {t('stats.kpiInteresses')}
              </span>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {loading ? '...' : stats?.totalLeads}
            </div>
            <p className="text-[11px] text-slate-400">{t('stats.kpiInteressesDesc')}</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">
                {t('stats.kpiAcervo')}
              </span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {loading ? '...' : stats?.totalContents}
            </div>
            <p className="text-[11px] text-slate-400">{t('stats.kpiAcervoDesc')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table: Plan Interests */}
      <Card className="border-border shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              {t('stats.leadsTitulo')} ({stats?.recentInterests.length || 0})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{t('stats.leadsDesc')}</p>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-border text-slate-600 uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-6">{t('stats.colNome')}</th>
                  <th className="py-3 px-6">{t('stats.colEmail')}</th>
                  <th className="py-3 px-4">{t('stats.colPlano')}</th>
                  <th className="py-3 px-6">{t('stats.colNotas')}</th>
                  <th className="py-3 px-4 text-right">{t('stats.colData')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      {t('stats.carregandoLeads')}
                    </td>
                  </tr>
                ) : !stats?.recentInterests || stats.recentInterests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      {t('stats.semLeads')}
                    </td>
                  </tr>
                ) : (
                  stats.recentInterests.map((interest) => (
                    <tr key={interest.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-6 font-semibold text-slate-900">{interest.name}</td>
                      <td className="py-3.5 px-6 font-mono text-xs text-slate-600">
                        {interest.email}
                      </td>
                      <td className="py-3.5 px-4">{getPlanBadge(interest.plan)}</td>
                      <td className="py-3.5 px-6 text-xs text-slate-500 max-w-xs truncate">
                        {interest.notes || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right text-xs text-slate-400">
                        {interest.created
                          ? new Date(interest.created).toLocaleDateString(
                              lang === 'en' ? 'en-US' : 'pt-BR',
                            )
                          : t('stats.hoje')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pages and Content consumption breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Visitas por Página */}
        <Card className="border-border">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              {t('stats.paginasMaisVisitadas')}
            </h3>
            <div className="space-y-3">
              {stats?.siteViewsByPath && stats.siteViewsByPath.length > 0 ? (
                stats.siteViewsByPath.slice(0, 8).map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0"
                  >
                    <span className="font-mono text-slate-700 truncate max-w-[280px]">
                      {p.path === '/' ? t('stats.paginaInicial') : p.path}
                    </span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {p.count} {t('stats.visitas')}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">{t('stats.semVisitas')}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Consumo por formato */}
        <Card className="border-border">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">{t('stats.consumoPorFormato')}</h3>
            <div className="space-y-3">
              {stats?.contentViewsByType && stats.contentViewsByType.length > 0 ? (
                stats.contentViewsByType.map((row, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0"
                  >
                    <span className="capitalize font-medium text-slate-700">
                      {row.type === 'video'
                        ? t('stats.formatoVideo')
                        : row.type === 'audio'
                          ? t('stats.formatoAudio')
                          : row.type === 'pdf'
                            ? t('stats.formatoPdf')
                            : t('stats.formatoArtigo')}
                    </span>
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {row.count} {t('stats.visualizacoes')}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">{t('stats.semConsumo')}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
