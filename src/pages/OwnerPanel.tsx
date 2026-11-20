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
import { useLanguage } from '@/lib/i18n'
import SiteSettingsEditor from '@/components/owner/SiteSettingsEditor'

export default function OwnerPanel() {
  const { user, isOwner } = useAuth()
  const { toast } = useToast()
  const { t } = useLanguage()

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
        title: t('owner.erroCarregarTitulo'),
        description: t('owner.erroCarregarDesc'),
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
        title: t('owner.camposObrigatoriosTitulo'),
        description: t('owner.camposObrigatoriosDesc'),
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
          title: t('owner.atualizadoTitulo'),
          description: t('owner.atualizadoDesc'),
        })
      } else {
        await ContentService.create(formData)
        toast({
          title: t('owner.publicadoTitulo'),
          description: t('owner.publicadoDesc'),
        })
      }

      setModalOpen(false)
      loadContents()
    } catch (err: any) {
      console.error(err)
      toast({
        title: t('owner.erroSalvarTitulo'),
        description: err?.message || t('owner.erroSalvarDesc'),
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!confirm(t('owner.confirmarRemover', { title: itemTitle }))) return

    try {
      await ContentService.delete(id)
      toast({
        title: t('owner.removidoTitulo'),
        description: t('owner.removidoDesc'),
      })
      loadContents()
    } catch (err) {
      toast({
        title: t('owner.erroExcluirTitulo'),
        description: t('owner.erroExcluirDesc'),
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
        <h2 className="text-xl font-bold text-slate-900">{t('owner.acessoRestrito')}</h2>
        <p className="text-sm text-slate-600">{t('owner.acessoRestritoTexto')}</p>
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
              {t('owner.titulo')}
            </h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
              Manoel Santos
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">{t('owner.subtitulo')}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/estatisticas">
            <Button variant="outline" className="gap-2 text-xs">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              {t('owner.verEstatisticas')}
            </Button>
          </Link>
          <Button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t('owner.novoConteudo')}
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
                  <th className="py-3.5 px-6">{t('owner.colTituloTipo')}</th>
                  <th className="py-3.5 px-4">{t('owner.colStatus')}</th>
                  <th className="py-3.5 px-4">{t('owner.colDuracao')}</th>
                  <th className="py-3.5 px-4">{t('owner.colVisualizacoes')}</th>
                  <th className="py-3.5 px-6 text-right">{t('owner.colAcoes')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      {t('owner.carregandoAcervo')}
                    </td>
                  </tr>
                ) : contents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 space-y-2">
                      <p className="text-base font-semibold">{t('owner.vazioTitulo')}</p>
                      <Button
                        onClick={openCreateModal}
                        size="sm"
                        className="bg-blue-600 text-white text-xs"
                      >
                        {t('owner.cadastrarPrimeiro')}
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
                            {t('common.premium')}
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-800 text-xs font-semibold"
                          >
                            {t('common.gratis')}
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
                            title={t('owner.verPaginaPublica')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(item)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          title={t('owner.editar')}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id, item.title)}
                          className="h-8 w-8 text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                          title={t('owner.excluir')}
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
              {editingContent ? t('owner.editarConteudo') : t('owner.publicarNovo')}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {t('owner.dialogDescricao')}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveContent} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="content-title" className="text-xs font-semibold">
                  {t('owner.labelTituloConteudo')}
                </Label>
                <Input
                  id="content-title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder={t('owner.placeholderTituloConteudo')}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="content-type" className="text-xs font-semibold">
                  {t('owner.labelFormato')}
                </Label>
                <Select value={type} onValueChange={(val) => setType(val as ContentType)}>
                  <SelectTrigger id="content-type">
                    <SelectValue placeholder={t('owner.selecioneTipo')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">{t('contents.artigo')}</SelectItem>
                    <SelectItem value="video">{t('contents.video')}</SelectItem>
                    <SelectItem value="audio">{t('contents.audio')}</SelectItem>
                    <SelectItem value="pdf">{t('contents.pdf')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="content-slug" className="text-xs font-semibold">
                  {t('owner.labelSlug')}
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
                  {t('owner.labelNivelAcesso')}
                </Label>
                <Select
                  value={isPremium ? 'premium' : 'free'}
                  onValueChange={(val) => setIsPremium(val === 'premium')}
                >
                  <SelectTrigger id="content-access">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">{t('owner.opcaoGratis')}</SelectItem>
                    <SelectItem value="premium">{t('owner.opcaoPremium')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content-desc" className="text-xs font-semibold">
                {t('owner.labelResumo')}
              </Label>
              <Textarea
                id="content-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('owner.placeholderResumo')}
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content-body" className="text-xs font-semibold">
                {t('owner.labelCorpo')}
              </Label>
              <Textarea
                id="content-body"
                value={contentBody}
                onChange={(e) => setContentBody(e.target.value)}
                placeholder={t('owner.placeholderCorpo')}
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="content-duration" className="text-xs font-semibold">
                  {t('owner.labelDuracao')}
                </Label>
                <Input
                  id="content-duration"
                  value={durationOrReadTime}
                  onChange={(e) => setDurationOrReadTime(e.target.value)}
                  placeholder={t('owner.placeholderDuracao')}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="content-tags" className="text-xs font-semibold">
                  {t('owner.labelTags')}
                </Label>
                <Input
                  id="content-tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder={t('owner.placeholderTags')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="content-url" className="text-xs font-semibold">
                  {t('owner.labelLinkExterno')}
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
                  {t('owner.labelUpload')}
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
                {t('common.cancelar')}
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                {saving
                  ? t('common.salvando')
                  : editingContent
                    ? t('owner.salvarAlteracoes')
                    : t('owner.publicarConteudo')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
