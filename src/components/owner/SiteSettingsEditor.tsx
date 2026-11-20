import { useEffect, useState } from 'react'
import { Globe, Save, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { SiteSettings, SiteSettingsService } from '@/services/siteSettingsService'
import { invalidateSiteSettings } from '@/hooks/use-site-settings'
import { LinesEditor, SkillEditor } from '@/components/owner/SettingsFormFields'
import { FooterSettingsTab } from '@/components/owner/FooterSettingsTab'
import { PlansSettingsTab } from '@/components/owner/PlansSettingsTab'
import { useLanguage } from '@/lib/i18n'

export default function SiteSettingsEditor() {
  const { toast } = useToast()
  const { t } = useLanguage()
  const [settings, setSettings] = useState<SiteSettings>(() => SiteSettingsService.defaults())
  const [recordId, setRecordId] = useState<string | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    let active = true
    SiteSettingsService.load()
      .then(({ id, settings: saved }) => {
        if (!active) return
        setRecordId(id)
        setSettings(saved)
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const patch = (partial: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }))
    setHasUnsavedChanges(true)
  }

  const handleSave = async () => {
    if (!settings.headline.trim() || !settings.bio.trim()) {
      toast({
        title: t('owner.camposObrigatoriosTitulo'),
        description: t('editor.camposObrigatoriosDesc'),
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const id = await SiteSettingsService.save(recordId, settings, photo)
      setRecordId(id)
      setPhoto(null)
      setHasUnsavedChanges(false)
      invalidateSiteSettings()
      toast({
        title: t('editor.siteAtualizadoTitulo'),
        description: t('editor.siteAtualizadoDesc'),
      })
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

  if (loading) {
    return (
      <Card className="border-border">
        <CardContent className="py-12 text-center text-sm text-slate-500">
          {t('editor.carregandoConfig')}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">{t('editor.editarSite')}</h2>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-[11px]">
                {t('editor.badgeEscopo')}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">{t('editor.descricao')}</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? t('common.salvando') : t('owner.salvarAlteracoes')}
          </Button>
        </div>

        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {t('editor.alteracoesNaoSalvas')}
          </div>
        )}

        <Tabs defaultValue="inicio" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="inicio" className="text-xs">
              {t('editor.abaInicio')}
            </TabsTrigger>
            <TabsTrigger value="planos" className="text-xs">
              {t('editor.abaPlanos')}
            </TabsTrigger>
            <TabsTrigger value="rodape" className="text-xs">
              {t('editor.abaRodape')}
            </TabsTrigger>
          </TabsList>

          {/* ============ ABA INÍCIO ============ */}
          <TabsContent value="inicio" className="space-y-6">
            {/* Título principal */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">{t('editor.tituloHero')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('editor.primeiraParte')}</Label>
                  <Input
                    value={settings.headline}
                    onChange={(e) => patch({ headline: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('editor.parteDestacada')}</Label>
                  <Input
                    value={settings.headlineHighlight}
                    onChange={(e) => patch({ headlineHighlight: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t('editor.subtitulo')}</Label>
                <Input
                  value={settings.subBio}
                  onChange={(e) => patch({ subBio: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t('editor.bioLabel')}</Label>
              <Textarea
                value={settings.bio}
                onChange={(e) => patch({ bio: e.target.value })}
                className="text-xs"
                rows={4}
              />
            </div>

            {/* Foto, cargo e empresa */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">{t('editor.cartaoPerfil')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('editor.cargo')}</Label>
                  <Input
                    value={settings.heroRole}
                    onChange={(e) => patch({ heroRole: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('editor.empresa')}</Label>
                  <Input
                    value={settings.heroCompany}
                    onChange={(e) => patch({ heroCompany: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t('editor.fotoPerfil')}</Label>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  className="text-xs cursor-pointer file:cursor-pointer"
                />
                {settings.profilePhotoUrl && (
                  <img
                    src={settings.profilePhotoUrl}
                    alt={t('editor.fotoAtual')}
                    className="w-16 h-16 rounded-lg object-cover border border-slate-200 mt-1"
                  />
                )}
              </div>
            </div>

            {/* Credenciais rápidas */}
            <div className="pt-2 border-t border-slate-100">
              <LinesEditor
                label={t('editor.credenciaisRapidas')}
                rows={settings.credentials}
                onChange={(credentials) => patch({ credentials })}
              />
            </div>

            {/* Destaques */}
            <div className="pt-2 border-t border-slate-100">
              <LinesEditor
                label={t('editor.destaques')}
                rows={settings.highlights}
                onChange={(highlights) => patch({ highlights })}
              />
            </div>

            {/* Botões do hero */}
            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                {t('editor.botoesAcaoInicio')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('editor.botaoPrincipal')}</Label>
                  <Input
                    value={settings.ctaButtons.primary}
                    onChange={(e) =>
                      patch({ ctaButtons: { ...settings.ctaButtons, primary: e.target.value } })
                    }
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t('editor.botaoSecundario')}</Label>
                  <Input
                    value={settings.ctaButtons.secondary}
                    onChange={(e) =>
                      patch({ ctaButtons: { ...settings.ctaButtons, secondary: e.target.value } })
                    }
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{t('editor.cartoesSkills')}</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px]"
                  onClick={() =>
                    patch({
                      skills: [...settings.skills, { title: '', description: '', bullets: [] }],
                    })
                  }
                >
                  {t('editor.adicionarCartao')}
                </Button>
              </div>
              {settings.skills.map((skill, i) => (
                <SkillEditor
                  key={i}
                  index={i}
                  skill={skill}
                  onChange={(next) => {
                    const skills = [...settings.skills]
                    skills[i] = next
                    patch({ skills })
                  }}
                  onRemove={() => patch({ skills: settings.skills.filter((_, j) => j !== i) })}
                />
              ))}
            </div>

            {/* Banner CTA */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">{t('editor.bannerAssinatura')}</h3>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t('editor.seloBanner')}</Label>
                <Input
                  value={settings.ctaBanner.badge}
                  onChange={(e) =>
                    patch({ ctaBanner: { ...settings.ctaBanner, badge: e.target.value } })
                  }
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t('editor.tituloBanner')}</Label>
                <Input
                  value={settings.ctaBanner.title}
                  onChange={(e) =>
                    patch({ ctaBanner: { ...settings.ctaBanner, title: e.target.value } })
                  }
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t('editor.textoBanner')}</Label>
                <Textarea
                  value={settings.ctaBanner.text}
                  onChange={(e) =>
                    patch({ ctaBanner: { ...settings.ctaBanner, text: e.target.value } })
                  }
                  className="text-xs"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    {t('editor.botaoPrincipalBanner')}
                  </Label>
                  <Input
                    value={settings.ctaBanner.buttonPrimary}
                    onChange={(e) =>
                      patch({
                        ctaBanner: { ...settings.ctaBanner, buttonPrimary: e.target.value },
                      })
                    }
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    {t('editor.botaoSecundarioBanner')}
                  </Label>
                  <Input
                    value={settings.ctaBanner.buttonSecondary}
                    onChange={(e) =>
                      patch({
                        ctaBanner: { ...settings.ctaBanner, buttonSecondary: e.target.value },
                      })
                    }
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ============ ABA PLANOS ============ */}
          <TabsContent value="planos" className="space-y-6">
            <PlansSettingsTab settings={settings} onPatch={patch} />
          </TabsContent>

          {/* ============ ABA RODAPÉ ============ */}
          <TabsContent value="rodape" className="space-y-6">
            <FooterSettingsTab settings={settings} onPatch={patch} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
