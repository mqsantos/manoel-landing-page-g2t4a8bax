import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { LinesEditor } from '@/components/owner/SettingsFormFields'
import { SiteSettingsService } from '@/services/siteSettingsService'
import { Eye, EyeOff, ChevronDown, ChevronUp, Trash2, RotateCcw } from 'lucide-react'
import type { PlanKey, PlanSettings, SiteSettings } from '@/services/siteSettingsService'

const PLAN_LABELS: Record<PlanKey, string> = {
  gratis: 'Plano Grátis',
  pro: 'Plano Pro (Membro)',
  mentoria: 'Plano Mentoria',
}

const PLAN_FIELD: Record<PlanKey, 'planFree' | 'planPro' | 'planMentoria'> = {
  gratis: 'planFree',
  pro: 'planPro',
  mentoria: 'planMentoria',
}

const CARD_STYLES: Record<PlanKey, string> = {
  gratis: 'border-slate-200',
  pro: 'border-2 border-blue-600/50 bg-blue-50/30',
  mentoria: 'border-slate-200',
}

/** Um plano em seu próprio cartão: campos identificados, switch de visibilidade em destaque, ↑↓ e remover. */
function PlanCard({
  planKey,
  plan,
  isFirst,
  isLast,
  onChange,
  onMove,
  onRemove,
}: {
  planKey: PlanKey
  plan: PlanSettings
  isFirst: boolean
  isLast: boolean
  onChange: (next: PlanSettings) => void
  onMove: (delta: number) => void
  onRemove: () => void
}) {
  const visible = plan.visible !== false
  const label = PLAN_LABELS[planKey]

  const confirmRemove = () => {
    if (
      window.confirm(
        `Remover o ${label} do site? Ele desaparece da página "Planos & Assinatura" depois que você salvar. ` +
          `(A mudança só vale após clicar em "Salvar Alterações"; dá para trazer de volta com "Adicionar plano".)`,
      )
    ) {
      onRemove()
    }
  }

  return (
    <Card className={CARD_STYLES[planKey]}>
      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Cabeçalho: identificação + reordenar/remover */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="secondary" className="bg-slate-900 text-white text-[11px]">
            {label}
          </Badge>
          <div className="flex items-center gap-1 flex-wrap">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-slate-700"
              title="Mover este plano para cima"
              onClick={() => onMove(-1)}
              disabled={isFirst}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-slate-700"
              title="Mover este plano para baixo"
              onClick={() => onMove(1)}
              disabled={isLast}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-[11px] text-rose-500 hover:text-rose-700 hover:bg-rose-50 gap-1.5"
              onClick={confirmRemove}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remover plano
            </Button>
          </div>
        </div>

        {/* Switch de visibilidade — primeiro bloco do cartão, bem visível */}
        <div
          className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 ${
            visible ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-slate-100/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {visible ? (
              <Eye className="w-4 h-4 text-emerald-600" />
            ) : (
              <EyeOff className="w-4 h-4 text-slate-400" />
            )}
            <div>
              <p className="text-xs font-semibold text-slate-800">
                {visible ? 'Plano visível no site' : 'Plano oculto no site'}
              </p>
              <p className="text-[10px] text-slate-500">
                {visible
                  ? 'Aparece na página "Planos & Assinatura".'
                  : 'Desligado: some da página Planos quando você salvar.'}
              </p>
            </div>
          </div>
          <Switch
            checked={visible}
            onCheckedChange={(checked) => onChange({ ...plan, visible: checked })}
            aria-label={`Alternar visibilidade do ${label}`}
          />
        </div>

        {/* Campos do plano */}
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
              <Label className="text-xs font-semibold">Selo (badge) — opcional</Label>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                placeholder="Ex: / mês"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Observação abaixo do preço</Label>
              <Input
                value={plan.note}
                onChange={(e) => onChange({ ...plan, note: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Texto do botão do plano</Label>
            <Input
              value={plan.button}
              onChange={(e) => onChange({ ...plan, button: e.target.value })}
              className="text-xs"
            />
          </div>
          <LinesEditor
            label="Benefícios"
            hint='Uma linha por benefício. Comece com "!" para marcar como não incluído (aparece com cadeado).'
            rows={plan.benefits}
            onChange={(benefits) => onChange({ ...plan, benefits })}
          />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Formulário da aba "Página Planos": cada plano em um cartão bem identificado,
 * com switch de visibilidade, reordenar, adicionar e remover (com confirmação).
 */
export function PlansSettingsTab({
  settings,
  onPatch,
}: {
  settings: SiteSettings
  onPatch: (partial: Partial<SiteSettings>) => void
}) {
  const ALL_KEYS: PlanKey[] = ['gratis', 'pro', 'mentoria']

  // Ordem segura: só chaves conhecidas (e, por garantia, todas as 3 presentes).
  const order = settings.plansOrder.filter((k) => ALL_KEYS.includes(k))
  for (const k of ALL_KEYS) if (!order.includes(k)) order.push(k)

  const planOf = (key: PlanKey): PlanSettings | null => settings[PLAN_FIELD[key]]

  const setPlan = (key: PlanKey, next: PlanSettings | null) =>
    onPatch({ [PLAN_FIELD[key]]: next } as Partial<SiteSettings>)

  const movePlan = (key: PlanKey, delta: number) => {
    const i = order.indexOf(key)
    const j = i + delta
    if (j < 0 || j >= order.length) return
    const next = [...order]
    ;[next[i], next[j]] = [next[j], next[i]]
    onPatch({ plansOrder: next })
  }

  const addPlan = () => {
    // Traz de volta o primeiro plano ausente (removido antes), com os valores padrão.
    const missing = ALL_KEYS.find((k) => !settings[PLAN_FIELD[k]])
    if (!missing) return
    const defaults = SiteSettingsService.defaults()
    setPlan(missing, defaults[PLAN_FIELD[missing]])
  }

  const removedCount = ALL_KEYS.filter((k) => !settings[PLAN_FIELD[k]]).length

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página pública */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Cabeçalho da página</h3>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Selo (badge)</Label>
          <Input
            value={settings.plansHeader.badge}
            onChange={(e) =>
              onPatch({ plansHeader: { ...settings.plansHeader, badge: e.target.value } })
            }
            className="text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Título</Label>
          <Input
            value={settings.plansHeader.title}
            onChange={(e) =>
              onPatch({ plansHeader: { ...settings.plansHeader, title: e.target.value } })
            }
            className="text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Texto de apresentação</Label>
          <Textarea
            value={settings.plansHeader.text}
            onChange={(e) =>
              onPatch({ plansHeader: { ...settings.plansHeader, text: e.target.value } })
            }
            className="text-xs"
            rows={3}
          />
        </div>
      </div>

      {/* Cartões dos planos */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900">Planos de assinatura</h3>
          {removedCount > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-[11px] gap-1.5"
              onClick={addPlan}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Adicionar plano
            </Button>
          )}
        </div>
        <p className="text-[11px] text-slate-500">
          Cada plano é um bloco. Use o switch verde para mostrar ou ocultar o plano no site, as
          setas ↑↓ para reordenar e "Remover plano" para tirá-lo da página (com confirmação). Tudo
          só vale depois de clicar em "Salvar Alterações".
        </p>
        <div className="space-y-4">
          {order.map((key, i) => {
            const plan = planOf(key)
            if (!plan) return null
            return (
              <PlanCard
                key={key}
                planKey={key}
                plan={plan}
                isFirst={i === 0}
                isLast={i === order.length - 1}
                onChange={(next) => setPlan(key, next)}
                onMove={(delta) => movePlan(key, delta)}
                onRemove={() => setPlan(key, null)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
