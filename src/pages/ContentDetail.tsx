import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Video,
  Headphones,
  FileText,
  Download,
  ExternalLink,
  Lock,
  CheckCircle2,
  Sparkles,
  Calendar,
  Clock,
  Share2,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ContentService, AnalyticsService } from '@/services/contentService'
import { ContentItem } from '@/types/database'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'

export default function ContentDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const { toast } = useToast()
  const [content, setContent] = useState<ContentItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    ContentService.getBySlug(slug)
      .then((data) => {
        setContent(data)
        if (data) {
          AnalyticsService.trackContentView(data)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [slug])

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: 'Link copiado!',
        description: 'O link deste conteúdo foi copiado para sua área de transferência.',
      })
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded" />
        <div className="h-12 w-full bg-slate-200 animate-pulse rounded" />
        <div className="h-64 w-full bg-slate-100 animate-pulse rounded-2xl" />
      </div>
    )
  }

  if (!content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Conteúdo não encontrado</h2>
        <p className="text-slate-600">O conteúdo que você buscou não existe ou foi removido.</p>
        <Link to="/conteudos">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a biblioteca
          </Button>
        </Link>
      </div>
    )
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Vídeo / Masterclass'
      case 'audio':
        return 'Áudio / Podcast'
      case 'pdf':
        return 'Documento / PDF'
      default:
        return 'Artigo Técnico'
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/conteudos"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Voltar para todos os conteúdos
        </Link>
      </div>

      {/* Header Info */}
      <div className="space-y-4 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant="outline"
            className="text-blue-700 bg-blue-50 border-blue-200 text-xs py-1"
          >
            {getTypeLabel(content.type)}
          </Badge>

          {content.is_premium ? (
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-800 text-xs font-semibold gap-1 py-1"
            >
              <Lock className="w-3 h-3" />
              Conteúdo Premium (Prévia Aberta)
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-800 text-xs font-semibold py-1"
            >
              Acesso Gratuito
            </Badge>
          )}

          {content.duration_or_read_time && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              {content.duration_or_read_time}
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="ml-auto text-xs text-slate-500 hover:text-slate-900 h-8 gap-1"
          >
            <Share2 className="w-3.5 h-3.5" />
            Compartilhar
          </Button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {content.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          {content.description}
        </p>

        {content.tags && (
          <div className="flex flex-wrap gap-2 pt-2">
            {content.tags.split(',').map((t, idx) => (
              <span
                key={idx}
                className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium"
              >
                #{t.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Premium Notification Banner if item is Premium */}
      {content.is_premium && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Material do Programa Premium de Assinantes</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Durante o período de pré-lançamento, a prévia está aberta a todos os visitantes.
              Registre seu interesse para garantir o plano sem taxa de adesão quando a cobrança
              começar.
            </p>
          </div>
          <Link to="/planos" className="flex-shrink-0">
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs shadow-sm"
            >
              Registrar Interesse no Plano
            </Button>
          </Link>
        </div>
      )}

      {/* Main Content Renderers based on Type */}
      <div className="space-y-8">
        {/* VIDEO TYPE */}
        {content.type === 'video' && (
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg relative flex items-center justify-center">
              {content.file ? (
                <video
                  src={content.file}
                  controls
                  className="w-full h-full object-contain"
                  poster={content.cover_image}
                >
                  Seu navegador não suporta reprodução de vídeos.
                </video>
              ) : content.external_url ? (
                <div className="text-center p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-rose-600/20 text-rose-500 mx-auto flex items-center justify-center">
                    <Video className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">
                      Vídeo da Masterclass Disponível
                    </h4>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto mt-1">
                      Assista ao streaming hospedado na plataforma externa.
                    </p>
                  </div>
                  <a
                    href={content.external_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block"
                  >
                    <Button className="bg-rose-600 hover:bg-rose-700 text-white font-medium gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Assistir no Player Externo
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="text-slate-400 text-center p-8">
                  <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Arquivo de vídeo em processamento</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AUDIO TYPE */}
        {content.type === 'audio' && (
          <Card className="border-border bg-slate-50">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                  <Headphones className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Episódio em Áudio</h3>
                  <p className="text-xs text-slate-500">
                    Ouça o episódio direto no navegador ou na sua plataforma favorita.
                  </p>
                </div>
              </div>

              {content.file ? (
                <div className="pt-2">
                  <audio controls className="w-full">
                    <source src={content.file} />
                    Seu navegador não suporta reprodução de áudio.
                  </audio>
                </div>
              ) : content.external_url ? (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-border">
                  <div className="text-xs text-slate-600">
                    Episódio disponível no Spotify / Plataforma externa
                  </div>
                  <a href={content.external_url} target="_blank" rel="noreferrer">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Ouvir Episódio Externo
                    </Button>
                  </a>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* PDF TYPE */}
        {content.type === 'pdf' && (
          <Card className="border-amber-200/80 bg-amber-50/40">
            <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Documento / Framework em PDF</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {content.duration_or_read_time ||
                      'Documento técnico pronto para download e consulta'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {content.file ? (
                  <a href={content.file} download target="_blank" rel="noreferrer">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white font-medium gap-2">
                      <Download className="w-4 h-4" />
                      Baixar PDF Completo
                    </Button>
                  </a>
                ) : content.external_url ? (
                  <a href={content.external_url} target="_blank" rel="noreferrer">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white font-medium gap-2">
                      <Download className="w-4 h-4" />
                      Acessar PDF Online
                    </Button>
                  </a>
                ) : (
                  <Button disabled variant="outline">
                    Arquivo em upload
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ARTICLE / TEXT BODY */}
        {content.content_body && (
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-10 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 pb-4 border-b border-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Texto Integral & Notas Técnicas
            </h3>
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 whitespace-pre-wrap font-sans text-sm sm:text-base">
              {content.content_body}
            </div>
          </div>
        )}
      </div>

      {/* Author Card Footer */}
      <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-border flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 ring-2 ring-blue-500/30 flex-shrink-0">
          <img
            src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=48"
            alt="Manoel Santos"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900 text-base">Publicado por Manoel Santos</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Systems Engineering Manager na Boeing. Mais de 20 anos de liderança em Lean Product
            Development e transformação cultural em engenharia aeroespacial.
          </p>
        </div>
      </div>
    </div>
  )
}
