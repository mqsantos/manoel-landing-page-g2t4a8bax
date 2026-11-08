import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Edit,
  Trash2,
  Video,
  Headphones,
  FileText,
  Lock,
  Unlock,
  ExternalLink,
  Eye,
  Layers,
  Sparkles,
  BarChart3,
  Check,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ContentService } from '@/services/contentService'
import { ContentItem, ContentType } from '@/types/database'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import SiteSettingsEditor from '@/components/owner/SiteSettingsEditor'

export default function OwnerPanel() {
  const { user, isOwner } = useAuth()
  const { toast } = useToast()

  const [contents, setContents] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null)
  const [saving, setSaving] = useState(false)

  // Form fields
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [type, setType] = useState<ContentType>('article')
  const [description, setDescription] = useState('')
  const [contentBody, setContentBody] = useState('')
  const [isPremium, setIsPremium] = useState(false)
  const [externalUrl, setExternalUrl] = useState('')
  const [durationOrReadTime, setDurationOrReadTime] = useState('')
  const [tags, setTags] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const loadContents = async () => {
    setLoading(true)
    try {
      const data = await ContentService.getAll()
      setContents(data)
    } catch (err) {
      console.error(err)
      toast({
        title: 'Erro ao carregar',
        description: 'Não foi possível carregar os conteúdos.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContents()
  }, [])

  const openCreateModal = () => {
    setEditingContent(null)
    setTitle('')
    setSlug('')
    setType('article')
    setDescription('')
    setContentBody('')
    setIsPremium(false)
    setExternalUrl('')
    setDurationOrReadTime('')
    setTags('')
    setFile(null)
    setModalOpen(true)
  }

  const openEditModal = (item: ContentItem) => {
    setEditingContent(item)
    setTitle(item.title)
    setSlug(item.slug)
    setType(item.type)
    setDescription(item.description)
    setContentBody(item.content_body || '')
    setIsPremium(item.is_premium)
    setExternalUrl(item.external_url || '')
    setDurationOrReadTime(item.duration_or_read_time || '')
    setTags(item.tags || '')
    setFile(null)
    setModalOpen(true)
  }

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!editingContent) {
      setSlug(generateSlug(val))
    }
  }

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !slug.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha título e slug do conteúdo.',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('slug', slug.trim())
      formData.append('type', type)
      formData.append('description', description.trim())
      formData.append('content_body', contentBody.trim())
      formData.append('is_premium', String(isPremium))
      formData.append('external_url', externalUrl.trim())
      formData.append('duration_or_read_time', durationOrReadTime.trim())
      formData.append('tags', tags.trim())

      if (file) {
        formData.append('file', file)
      }

      if (editingContent) {
        await ContentService.update(editingContent.id, formData)
        toast({
          title: 'Conteúdo atualizado!',
          description: 'As alterações foram salvas.',
        })
      } else {
        await ContentService.create(formData)
        toast({
          title: 'Conteúdo publicado!',
          description: 'O novo material já está disponível no catálogo.',
        })
      }

      setModalOpen(false)
      loadContents()
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Erro ao salvar conteúdo',
        description: err?.message || 'Verifique se o slug é único.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!confirm(`Deseja realmente remover o conteúdo "${itemTitle}"?`)) return

    try {
      await ContentService.delete(id)
      toast({
        title: 'Conteúdo removido',
        description: 'O item foi excluído com sucesso.',
      })
      loadContents()
    } catch (err) {
      toast({
        title: 'Erro ao excluir',
        description: 'Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  if (!isOwner && !loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Acesso Restrito ao Dono</h2>
        <p className="text-sm text-slate-600">
          Esta área é restrita a Manoel Santos (mqsantos@gmail.com). Faça login com a conta de
          proprietário para gerenciar conteúdos.
        </p>
        <Link to="/login">
          <Button className="bg-blue-600 text-white">Entrar como Dono</Button>
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
              Painel do Dono
            </h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
              Manoel Santos
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie vídeos, áudios, PDFs e artigos. Defina o que é grátis e o que pertence à área
            premium.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/estatisticas">
            <Button variant="outline" className="gap-2 text-xs">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Ver Estatísticas & Leads
            </Button>
          </Link>
          <Button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Conteúdo
          </Button>
        </div>
      </div>

      {/* Editar site (textos do Início e Planos) */}
      <SiteSettingsEditor />

      {/* Contents Table / List */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-border text-slate-600 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Título & Tipo</th>
                  <th className="py-3.5 px-4">Status / Acesso</th>
                  <th className="py-3.5 px-4">Duração / Leitura</th>
                  <th className="py-3.5 px-4">Visualizações</th>
                  <th className="py-3.5 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      Carregando acervo...
                    </td>
                  </tr>
                ) : contents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 space-y-2">
                      <p className="text-base font-semibold">Nenhum conteúdo cadastrado</p>
                      <Button
                        onClick={openCreateModal}
                        size="sm"
                        className="bg-blue-600 text-white text-xs"
                      >
                        Cadastrar primeiro conteúdo
                      </Button>
                    </td>
                  </tr>
                ) : (
                  contents.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                          <span className="uppercase font-semibold text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {item.type}
                          </span>
                          <span className="truncate max-w-[200px]">/{item.slug}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
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
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500">
                        {item.duration_or_read_time || '—'}
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-slate-700">
                        {item.views_count || 0}
                      </td>
                      <td className="py-4 px-6 text-right space-x-1">
                        <Link to={`/conteudos/${item.slug}`} target="_blank">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-slate-900"
                            title="Ver página pública"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(item)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id, item.title)}
                          className="h-8 w-8 text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Publicação / Edição */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingContent ? 'Editar Conteúdo' : 'Publicar Novo Conteúdo'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Preencha os dados do material. Você pode anexar arquivos ou inserir links externos
              como YouTube e Spotify.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveContent} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="content-title" className="text-xs font-semibold">
                  Título do Conteúdo *
                </Label>
                <Input
                  id="content-title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ex: Masterclass: Como aplicar LPPD em Sistemas"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="content-type" className="text-xs font-semibold">
                  Formato *
                </Label>
                <Select value={type} onValueChange={(val) => setType(val as ContentType)}>
                  <SelectTrigger id="content-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Artigo / Ensaio</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="audio">Áudio / Podcast</SelectItem>
                    <SelectItem value="pdf">Documento PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="content-slug" className="text-xs font-semibold">
                  Slug (URL amigável) *
                </Label>
                <Input
                  id="content-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ex: masterclass-lppd-sistemas"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="content-access" className="text-xs font-semibold">
                  Nível de Acesso (Freemium) *
                </Label>
                <Select
                  value={isPremium ? 'premium' : 'free'}
                  onValueChange={(val) => setIsPremium(val === 'premium')}
                >
                  <SelectTrigger id="content-access">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Grátis (Aberto a todos)</SelectItem>
                    <SelectItem value="premium">Premium (Com cadeado & prévia)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content-desc" className="text-xs font-semibold">
                Resumo / Descrição Curta
              </Label>
              <Textarea
                id="content-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve introdução para atrair o leitor nos cards..."
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content-body" className="text-xs font-semibold">
                Corpo do Texto / Notas da Aula (Markdown ou Texto Corrido)
              </Label>
              <Textarea
                id="content-body"
                value={contentBody}
                onChange={(e) => setContentBody(e.target.value)}
                placeholder="Escreva aqui o ensaio completo, síntese do vídeo ou transcrição..."
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="content-duration" className="text-xs font-semibold">
                  Duração ou Tempo de Leitura
                </Label>
                <Input
                  id="content-duration"
                  value={durationOrReadTime}
                  onChange={(e) => setDurationOrReadTime(e.target.value)}
                  placeholder="Ex: 45 min, 8 min de leitura, 24 páginas"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="content-tags" className="text-xs font-semibold">
                  Tags (separadas por vírgula)
                </Label>
                <Input
                  id="content-tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Lean, IA, LPPD, Sistemas"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="content-url" className="text-xs font-semibold">
                  Link Externo (YouTube, Spotify, etc)
                </Label>
                <Input
                  id="content-url"
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="content-file" className="text-xs font-semibold">
                  Upload de Arquivo (PDF, Áudio ou Vídeo)
                </Label>
                <Input
                  id="content-file"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="cursor-pointer file:cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
                disabled={saving}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                {saving
                  ? 'Salvando...'
                  : editingContent
                    ? 'Salvar Alterações'
                    : 'Publicar Conteúdo'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
