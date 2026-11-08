import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search,
  Video,
  Headphones,
  FileText,
  Lock,
  Sparkles,
  ChevronRight,
  Filter,
  Check,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ContentService } from '@/services/contentService'
import { ContentItem, ContentType } from '@/types/database'

export default function ContentsList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [contents, setContents] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  const currentType = (searchParams.get('tipo') as ContentType) || 'all'
  const currentPremium = (searchParams.get('acesso') as 'all' | 'free' | 'premium') || 'all'
  const searchQuery = searchParams.get('q') || ''

  const [searchInput, setSearchInput] = useState(searchQuery)

  const fetchContents = async () => {
    setLoading(true)
    try {
      const data = await ContentService.getAll({
        type: currentType,
        premium: currentPremium,
        search: searchQuery,
      })
      setContents(data)
    } catch (err) {
      console.error('Erro ao carregar conteúdos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContents()
  }, [currentType, currentPremium, searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newParams = new URLSearchParams(searchParams)
    if (searchInput.trim()) {
      newParams.set('q', searchInput.trim())
    } else {
      newParams.delete('q')
    }
    setSearchParams(newParams)
  }

  const handleTypeChange = (type: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (type === 'all') {
      newParams.delete('tipo')
    } else {
      newParams.set('tipo', type)
    }
    setSearchParams(newParams)
  }

  const handlePremiumChange = (access: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (access === 'all') {
      newParams.delete('acesso')
    } else {
      newParams.set('acesso', access)
    }
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearchParams({})
  }

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
        return 'Áudio'
      case 'pdf':
        return 'PDF'
      default:
        return 'Artigo'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <Badge
          variant="outline"
          className="text-blue-700 bg-blue-50 border-blue-200 uppercase tracking-wider text-xs"
        >
          Biblioteca de Conhecimento
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Conteúdos, Artigos & Recursos
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Explore artigos analíticos, masterclasses em vídeo, episódios em áudio e frameworks em PDF
          sobre Lean Product Development, engenharia de sistemas aeroespaciais e inteligência
          artificial aplicada.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-50 border border-border rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Pesquisar por tema, título, tags (Lean, IA, A3...)"
              className="pl-10 bg-white"
            />
          </form>

          {/* Access filter (Grátis / Premium) */}
          <div className="md:col-span-6 flex flex-wrap items-center justify-end gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Acesso:
            </span>
            <Button
              variant={currentPremium === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePremiumChange('all')}
              className={currentPremium === 'all' ? 'bg-slate-900 text-white' : 'bg-white'}
            >
              Todos
            </Button>
            <Button
              variant={currentPremium === 'free' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePremiumChange('free')}
              className={
                currentPremium === 'free'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-emerald-700 border-emerald-200'
              }
            >
              Apenas Grátis
            </Button>
            <Button
              variant={currentPremium === 'premium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePremiumChange('premium')}
              className={
                currentPremium === 'premium'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-amber-700 border-amber-200'
              }
            >
              <Lock className="w-3 h-3 mr-1" />
              Premium
            </Button>
          </div>
        </div>

        {/* Content Type Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
          <span className="text-xs font-semibold text-slate-500 mr-2">Formato:</span>
          {[
            { id: 'all', label: 'Todos os formatos' },
            { id: 'article', label: 'Artigos' },
            { id: 'video', label: 'Vídeos' },
            { id: 'audio', label: 'Áudios' },
            { id: 'pdf', label: 'PDFs' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeChange(type.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentType === type.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type.label}
            </button>
          ))}

          {(currentType !== 'all' || currentPremium !== 'all' || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="ml-auto text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8 gap-1"
            >
              <X className="w-3 h-3" />
              Limpar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Grid of Contents */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : contents.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Nenhum conteúdo encontrado</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Tente ajustar os filtros ou pesquisar com outros termos.
          </p>
          <Button onClick={clearFilters} variant="outline" size="sm">
            Limpar filtros de busca
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden flex flex-col justify-between border-border hover:shadow-xl hover:border-blue-300 transition-all duration-300 bg-white"
            >
              <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                      {getTypeIcon(item.type)}
                      <span>{getTypeLabel(item.type)}</span>
                    </div>

                    {item.is_premium ? (
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-800 text-xs font-semibold gap-1"
                      >
                        <Lock className="w-3 h-3" />
                        Premium
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-800 text-xs font-semibold"
                      >
                        Grátis
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-lg leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  {item.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags
                        .split(',')
                        .slice(0, 3)
                        .map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                          >
                            #{tag.trim()}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {item.duration_or_read_time || 'Acesso liberado'}
                  </span>
                  <Link
                    to={`/conteudos/${item.slug}`}
                    className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {item.is_premium ? 'Ver detalhes' : 'Acessar agora'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Call to action card */}
      <div className="mt-12 p-8 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold">Quer acesso antecipado a novos conteúdos?</h3>
          <p className="text-sm text-slate-300 mt-1">
            Cadastre-se gratuitamente para ser avisado sempre que Manoel Santos publicar novos
            ensaios ou abrir inscrições para mentorias.
          </p>
        </div>
        <Link to="/cadastro" className="flex-shrink-0">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6">
            Criar Minha Conta Gratuita
          </Button>
        </Link>
      </div>
    </div>
  )
}
