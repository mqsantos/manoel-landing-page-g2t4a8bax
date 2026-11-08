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

/** Editor de um plano (nome, badge, descrição, preço e benefícios). */
function PlanEditor({
  plan,
  onChange,
}: {
  plan: SiteSettings['planFree']
  onChange: (next: SiteSettings['planFree']) => void
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Nome do plano</Label>
          <Input
            value={plan.name}
            onChange={(e) => onChange({ ...plan, name: e.target.value })}
            className="text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Selo (badge)</Label>
          <Input
            value={plan.badge}
            onChange={(e) => onChange({ ...plan, badge: e.target.value })}
            className="text-xs"
            placeholder="Ex: Completo, Vagas Limitadas"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Descrição curta</Label>
        <Textarea
          value={plan.description}
          onChange={(e) => onChange({ ...plan, description: e.target.value })}
          className="text-xs"
          rows={2}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Preço</Label>
          <Input
            value={plan.price}
            onChange={(e) => onChange({ ...plan, price: e.target.value })}
            className="text-xs"
            placeholder="Ex: R$ 59"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Nota ao lado do preço</Label>
          <Input
            value={plan.priceNote}
            onChange={(e) => onChange({ ...plan, priceNote: e.target.value })}
            className="text-xs"
            placeholder="Ex: / mês (ou R$ 49/mês no anual)"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Observação abaixo do preço</Label>
        <Input
          value={plan.note}
          onChange={(e) => onChange({ ...plan, note: e.target.value })}
          className="text-xs"
          placeholder="Opcional — ex: Cobrança ainda não iniciada..."
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Texto do botão do plano</Label>
        <Input
          value={plan.button}
          onChange={(e) => onChange({ ...plan, button: e.target.value })}
          className="text-xs"
          placeholder="Ex: Quero Assinar Pro (Registrar Interesse)"
        />
      </div>
      <LinesEditor
        label="Benefícios"
        hint='Uma linha por benefício. Comece com "!" para marcar como não incluído (aparece com cadeado).'
        rows={plan.benefits}
        onChange={(benefits) => onChange({ ...plan, benefits })}
      />
    </div>
  )
}

export default function SiteSettingsEditor() {
  const { toast } = useToast()
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
        title: 'Campos obrigatórios',
        description: 'Preencha ao menos o título principal e a bio da página Início.',
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
        title: 'Site atualizado!',
        description: 'Os textos já estão no ar nas páginas Início e Planos.',
      })
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Erro ao salvar',
        description: err?.message || 'Não foi possível salvar as configurações. Tente novamente.',
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
          Carregando configurações do site...
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
              <h2 className="text-lg font-bold text-slate-900">Editar site</h2>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-[11px]">
                Início, Planos & Rodapé
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Edite os textos das páginas Início e Planos & Assinatura e do rodapé. Ao salvar, as
              mudanças aparecem imediatamente no site.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>

        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            Há alterações não salvas. Clique em "Salvar Alterações" para publicá-las no site.
          </div>
        )}

        <Tabs defaultValue="inicio" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="inicio" className="text-xs">
              Página Início
            </TabsTrigger>
            <TabsTrigger value="planos" className="text-xs">
              Página Planos
            </TabsTrigger>
            <TabsTrigger value="rodape" className="text-xs">
              Rodapé
            </TabsTrigger>
          </TabsList>

          {/* ============ ABA INÍCIO ============ */}
          <TabsContent value="inicio" className="space-y-6">
            {/* Título principal */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Título principal (hero)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Primeira parte</Label>
                  <Input
                    value={settings.headline}
                    onChange={(e) => patch({ headline: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Parte destacada (gradiente)</Label>
                  <Input
                    value={settings.headlineHighlight}
                    onChange={(e) => patch({ headlineHighlight: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Subtítulo</Label>
                <Input
                  value={settings.subBio}
                  onChange={(e) => patch({ subBio: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Bio (pode usar **negrito** nas palavras-chave)
              </Label>
              <Textarea
                value={settings.bio}
                onChange={(e) => patch({ bio: e.target.value })}
                className="text-xs"
                rows={4}
              />
            </div>

            {/* Foto, cargo e empresa */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Cartão de perfil</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Cargo</Label>
                  <Input
                    value={settings.heroRole}
                    onChange={(e) => patch({ heroRole: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Empresa</Label>
                  <Input
                    value={settings.heroCompany}
                    onChange={(e) => patch({ heroCompany: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Foto de perfil</Label>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  className="text-xs cursor-pointer file:cursor-pointer"
                />
                {settings.profilePhotoUrl && (
                  <img
                    src={settings.profilePhotoUrl}
                    alt="Foto atual"
                    className="w-16 h-16 rounded-lg object-cover border border-slate-200 mt-1"
                  />
                )}
              </div>
            </div>

            {/* Credenciais rápidas */}
            <div className="pt-2 border-t border-slate-100">
              <LinesEditor
                label="Credenciais rápidas (badges do hero)"
                rows={settings.credentials}
                onChange={(credentials) => patch({ credentials })}
              />
            </div>

            {/* Destaques */}
            <div className="pt-2 border-t border-slate-100">
              <LinesEditor
                label="Destaques (checkmarks do cartão)"
                rows={settings.highlights}
                onChange={(highlights) => patch({ highlights })}
              />
            </div>

            {/* Botões do hero */}
            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                Botões de ação da página Início
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Botão principal</Label>
                  <Input
                    value={settings.ctaButtons.primary}
                    onChange={(e) =>
                      patch({ ctaButtons: { ...settings.ctaButtons, primary: e.target.value } })
                    }
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Botão secundário</Label>
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
                <h3 className="text-sm font-bold text-slate-900">Cartões de skills</h3>
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
                  + Adicionar cartão
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
              <h3 className="text-sm font-bold text-slate-900">
                Banner de assinatura (final da página)
              </h3>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Selo do banner</Label>
                <Input
                  value={settings.ctaBanner.badge}
                  onChange={(e) =>
                    patch({ ctaBanner: { ...settings.ctaBanner, badge: e.target.value } })
                  }
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Título do banner</Label>
                <Input
                  value={settings.ctaBanner.title}
                  onChange={(e) =>
                    patch({ ctaBanner: { ...settings.ctaBanner, title: e.target.value } })
                  }
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Texto do banner</Label>
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
                  <Label className="text-xs font-semibold">Botão principal do banner</Label>
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
                  <Label className="text-xs font-semibold">Botão secundário do banner</Label>
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
            {/* Cabeçalho da página */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Cabeçalho da página</h3>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Selo (badge)</Label>
                <Input
                  value={settings.plansHeader.badge}
                  onChange={(e) =>
                    patch({ plansHeader: { ...settings.plansHeader, badge: e.target.value } })
                  }
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Título</Label>
                <Input
                  value={settings.plansHeader.title}
                  onChange={(e) =>
                    patch({ plansHeader: { ...settings.plansHeader, title: e.target.value } })
                  }
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Texto de apresentação</Label>
                <Textarea
                  value={settings.plansHeader.text}
                  onChange={(e) =>
                    patch({ plansHeader: { ...settings.plansHeader, text: e.target.value } })
                  }
                  className="text-xs"
                  rows={3}
                />
              </div>
            </div>

            {/* Plano Grátis */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Plano Grátis</h3>
              <PlanEditor plan={settings.planFree} onChange={(planFree) => patch({ planFree })} />
            </div>

            {/* Plano Pro */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Plano Pro</h3>
              <PlanEditor plan={settings.planPro} onChange={(planPro) => patch({ planPro })} />
            </div>

            {/* Mentoria */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Mentoria Executiva</h3>
              <PlanEditor
                plan={settings.planMentoria}
                onChange={(planMentoria) => patch({ planMentoria })}
              />
            </div>
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
