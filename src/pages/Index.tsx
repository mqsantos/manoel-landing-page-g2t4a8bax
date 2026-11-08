import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Linkedin,
  Mail,
  FileText,
  Video,
  Headphones,
  Sparkles,
  Briefcase,
  Award,
  GraduationCap,
  Layers,
  ChevronRight,
  ExternalLink,
  Lock,
  Cpu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ContentService } from '@/services/contentService'
import { ContentItem } from '@/types/database'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { SkillCard } from '@/services/siteSettingsService'

/** Renderiza **negrito** dentro de um texto editável pelo dono. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="text-white font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

const SKILL_ICONS = [Briefcase, Layers, Cpu]

export default function Index() {
  const { settings } = useSiteSettings()
  const [featuredContents, setFeaturedContents] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ContentService.getFeatured()
      .then((items) => setFeaturedContents(items))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-rose-500" />
      case 'audio':
        return <Headphones className="w-4 h-4 text-purple-500" />
      case 'pdf':
        return <FileText className="w-4 h-4 text-amber-500" />
      default:
        return <FileText className="w-4 h-4 text-blue-500" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Vídeo'
      case 'audio':
        return 'Áudio / Podcast'
      case 'pdf':
        return 'Guia PDF'
      default:
        return 'Artigo'
    }
  }

  const credentialIcons = [Briefcase, Award, GraduationCap]

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-16 pb-24 md:py-28">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Bio */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {settings.heroRole} | {settings.heroCompany}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                {settings.headline}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">
                  {settings.headlineHighlight}
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed max-w-2xl">
                <RichText text={settings.bio} />
              </p>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
                {settings.subBio}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/conteudos">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/30 gap-2 h-12 px-6"
                  >
                    {settings.ctaButtons.primary}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/planos">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white font-medium h-12 px-6 gap-2"
                  >
                    {settings.ctaButtons.secondary}
                  </Button>
                </Link>
              </div>

              {/* Quick credentials badges */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-800/80 text-xs text-slate-400">
                {settings.credentials.map((label, i) => {
                  const Icon = credentialIcons[i % credentialIcons.length]
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span>{label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Column: Hero Profile Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Glow backdrop */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-30 blur-2xl transition duration-500 group-hover:opacity-60" />

                <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-200">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-blue-500/50 shadow-md bg-slate-800">
                        {settings.profilePhotoUrl ? (
                          <img
                            src={settings.profilePhotoUrl}
                            alt="Manoel Santos"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                            MS
                          </div>
                        )}
                      </div>
                      <div
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center"
                        title="Ativo & Compartilhando"
                      >
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">Manoel Santos</h3>
                      <p className="text-xs text-blue-400 font-medium">{settings.heroRole}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{settings.heroCompany}</p>
                      {settings.credentials[0] && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700">
                            {settings.credentials[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs text-slate-300 pb-6 border-b border-slate-800">
                    {settings.highlights.map((line, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>

                  {/* Links in card */}
                  <div className="pt-5 flex items-center justify-between">
                    <a
                      href="https://www.linkedin.com/in/manoelsantos/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>Perfil no LinkedIn</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href="mailto:mqsantos@gmail.com"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Contato direto</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trajetória & Top Skills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge
            variant="outline"
            className="mb-3 px-3 py-1 font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 border-blue-200"
          >
            Experiência & Expertise
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Mais de duas décadas na vanguarda da aviação mundial
          </h2>
          <p className="mt-4 text-slate-600 text-base leading-relaxed">
            Unindo a precisão da engenharia aeronáutica com a agilidade do Lean e as oportunidades
            da inteligência artificial para elevar times e processos ao padrão global.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {settings.skills.map((skill: SkillCard, i) => {
            const Icon = SKILL_ICONS[i % SKILL_ICONS.length]
            const iconStyles = [
              'bg-blue-100 text-blue-700',
              'bg-indigo-100 text-indigo-700',
              'bg-sky-100 text-sky-700',
            ]
            return (
              <Card
                key={i}
                className="border-border hover:shadow-lg transition-all duration-300 hover:border-blue-200"
              >
                <CardContent className="p-8 space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${iconStyles[i % iconStyles.length]}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{skill.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{skill.description}</p>
                  <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
                    {skill.bullets.map((b, j) => (
                      <li key={j}>• {b}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Publicações em Destaque: The Lean Developer & The Augmented Engineer */}
      <section className="bg-slate-50 border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <Badge
                variant="secondary"
                className="mb-2 bg-blue-100 text-blue-800 border-none font-medium"
              >
                Publicações & Artigos de Referência
              </Badge>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Pensamento que guia a engenharia moderna
              </h2>
            </div>
            <Link to="/conteudos?tipo=article" className="mt-4 md:mt-0">
              <Button
                variant="ghost"
                className="text-blue-600 hover:text-blue-700 p-0 hover:bg-transparent font-medium gap-1"
              >
                Ver todos os artigos <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white border-border hover:border-blue-300 hover:shadow-md transition-all">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50/50">
                    Artigo Aberto
                  </Badge>
                  <span className="text-xs text-muted-foreground">7 min de leitura</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">The Lean Developer</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Como conectar os princípios do Lean Product and Process Development (LPPD) à
                  engenharia moderna de software e sistemas aeronáuticos. Princípios de Set-Based
                  Concurrent Engineering e resolução sistemática de problemas (A3).
                </p>
                <div className="pt-2">
                  <Link to="/conteudos/the-lean-developer-principios-agels">
                    <Button
                      variant="default"
                      className="bg-slate-900 hover:bg-blue-600 text-white gap-2 text-xs"
                    >
                      Ler Artigo Completo
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-border hover:border-blue-300 hover:shadow-md transition-all">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50/50">
                    Artigo Aberto
                  </Badge>
                  <span className="text-xs text-muted-foreground">9 min de leitura</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">The Augmented Engineer</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Uma análise aprofundada sobre como modelos de linguagem e automação generativa
                  potencializam requisitos, rastreabilidade e arquitetura de sistemas aeroespaciais
                  críticos, mantendo o julgamento humano no controle.
                </p>
                <div className="pt-2">
                  <Link to="/conteudos/the-augmented-engineer-ia-engenharia">
                    <Button
                      variant="default"
                      className="bg-slate-900 hover:bg-blue-600 text-white gap-2 text-xs"
                    >
                      Ler Artigo Completo
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Conteúdos em Destaque (Vídeos, Áudios, PDFs, Artigos) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <Badge variant="outline" className="mb-2 text-blue-700 bg-blue-50 border-blue-200">
              Acervo Multimídia
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Aprenda com formatos diretos e práticos
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Vídeos, episódios em áudio, templates em PDF e ensaios técnicos.
            </p>
          </div>
          <Link to="/conteudos" className="mt-4 md:mt-0">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              Explorar Todos os Conteúdos
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredContents.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden flex flex-col justify-between border-border hover:shadow-lg hover:border-blue-300 transition-all duration-300"
              >
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        {getTypeIcon(item.type)}
                        <span>{getTypeLabel(item.type)}</span>
                      </div>
                      {item.is_premium ? (
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-amber-800 text-[11px] gap-1 font-semibold"
                        >
                          <Lock className="w-3 h-3" />
                          Premium
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-800 text-[11px] font-semibold"
                        >
                          Grátis
                        </Badge>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-base">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>{item.duration_or_read_time || 'Acesso imediato'}</span>
                    <Link
                      to={`/conteudos/${item.slug}`}
                      className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      Acessar <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Freemium & Assinatura CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{settings.ctaBanner.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {settings.ctaBanner.title}
            </h2>

            <p className="text-base text-blue-100 leading-relaxed font-light">
              {settings.ctaBanner.text}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/planos">
                <Button
                  size="lg"
                  className="bg-white hover:bg-slate-100 text-slate-900 font-bold h-12 px-6"
                >
                  {settings.ctaBanner.buttonPrimary}
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 h-12 px-6"
                >
                  {settings.ctaBanner.buttonSecondary}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
