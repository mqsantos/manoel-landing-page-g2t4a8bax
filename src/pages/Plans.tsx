import React, { useState } from 'react'
import {
  Check,
  Sparkles,
  ShieldCheck,
  Lock,
  ArrowRight,
  Star,
  Users,
  HelpCircle,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PlanInterestService } from '@/services/contentService'
import { PlanType } from '@/types/database'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { useSiteSettings } from '@/hooks/use-site-settings'

/** Renderiza **negrito** simples dentro do texto de um benefício. */
const BenefitText = ({ text }: { text: string }) => {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i}>{part}</strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  )
}

export default function Plans() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { settings } = useSiteSettings()

  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [notes, setNotes] = useState('')

  const openInterestModal = (plan: PlanType) => {
    setSelectedPlan(plan)
    setName(user?.name || '')
    setEmail(user?.email || '')
    setModalOpen(true)
  }

  const handleSubmitInterest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlan || !name.trim() || !email.trim()) {
      toast({
        title: 'Preencha os campos obrigatórios',
        description: 'Informe seu nome e e-mail para registrar o interesse.',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)
    try {
      await PlanInterestService.register({
        name,
        email,
        plan: selectedPlan,
        notes,
      })

      toast({
        title: 'Interesse registrado com sucesso!',
        description:
          'Você será o primeiro a ser notificado quando a cobrança começar, com benefícios de pioneiro.',
      })

      setModalOpen(false)
      setNotes('')
    } catch (err) {
      console.error(err)
      toast({
        title: 'Erro ao registrar',
        description: 'Tente novamente em instantes.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getPlanName = (p: PlanType | null) => {
    switch (p) {
      case 'gratis':
        return 'Plano Gratuito'
      case 'pro_mensal':
        return 'Plano Pro (Mensal)'
      case 'pro_anual':
        return 'Plano Pro (Anual)'
      case 'mentoria':
        return 'Mentoria Executiva'
      default:
        return 'Plano'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge
          variant="outline"
          className="text-blue-700 bg-blue-50 border-blue-200 uppercase tracking-wider text-xs"
        >
          {settings.plansHeader.badge}
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          {settings.plansHeader.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          {settings.plansHeader.text}
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {(
          [
            {
              key: 'gratis' as const,
              plan: settings.planFree,
              cardClass:
                'border-border hover:shadow-lg transition-all flex flex-col justify-between bg-white',
              badgeClass: 'bg-slate-100 text-slate-700',
              checkClass: 'text-emerald-500',
              btnClass: 'w-full mt-6',
              highlighted: false,
              planType: 'gratis' as PlanType,
            },
            {
              key: 'pro' as const,
              plan: settings.planPro,
              cardClass:
                'border-2 border-blue-600 shadow-xl relative flex flex-col justify-between bg-white scale-105',
              badgeClass: 'bg-blue-100 text-blue-800 font-semibold',
              checkClass: 'text-blue-600',
              btnClass:
                'w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20',
              highlighted: true,
              planType: 'pro_mensal' as PlanType,
            },
            {
              key: 'mentoria' as const,
              plan: settings.planMentoria,
              cardClass:
                'border-border hover:shadow-lg transition-all flex flex-col justify-between bg-white',
              badgeClass: 'text-indigo-700 border-indigo-200 bg-indigo-50',
              checkClass: 'text-indigo-500',
              btnClass: 'w-full mt-6 border-indigo-200 text-indigo-700 hover:bg-indigo-50',
              highlighted: false,
              planType: 'mentoria' as PlanType,
            },
          ] as const
        ).map(
          ({ key, plan, cardClass, badgeClass, checkClass, btnClass, highlighted, planType }) => (
            <Card key={key} className={cardClass}>
              {highlighted && plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {plan.badge}
                </div>
              )}
              <CardContent
                className={`p-8 space-y-6 flex-1 flex flex-col justify-between ${highlighted ? 'pt-9' : ''}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    {plan.badge && (
                      <Badge variant="secondary" className={badgeClass}>
                        {plan.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{plan.description}</p>
                  <div className="pt-2">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                      <span className="text-xs text-slate-500 ml-1">{plan.priceNote}</span>
                    </div>
                    {plan.note && (
                      <p className="text-[11px] text-blue-600 font-medium mt-1">{plan.note}</p>
                    )}
                  </div>

                  <ul className="space-y-3 text-xs text-slate-700 pt-4 border-t border-slate-100">
                    {plan.benefits.map((b, i) => {
                      const locked = b.startsWith('!')
                      return (
                        <li
                          key={i}
                          className={`flex items-start gap-2.5 ${locked ? 'text-slate-400' : ''}`}
                        >
                          {locked ? (
                            <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${checkClass}`} />
                          )}
                          <span>{locked ? b.slice(1) : <BenefitText text={b} />}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <Button
                  variant={highlighted ? 'default' : 'outline'}
                  onClick={() => openInterestModal(planType)}
                  className={btnClass}
                >
                  {plan.button}
                </Button>
              </CardContent>
            </Card>
          ),
        )}
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-50 rounded-2xl border border-border p-6 sm:p-10 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 text-center">
          Comparativo Detalhado de Recursos
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 font-semibold text-slate-900">Recurso / Conteúdo</th>
                <th className="py-3 px-4 font-semibold text-slate-700 text-center">Grátis</th>
                <th className="py-3 px-4 font-semibold text-blue-700 text-center">Membro Pro</th>
                <th className="py-3 px-4 font-semibold text-indigo-700 text-center">Mentoria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 text-slate-600">
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900">Artigos abertos e ensaios</td>
                <td className="py-3 px-4 text-center">✓ Ilimitado</td>
                <td className="py-3 px-4 text-center">✓ Ilimitado</td>
                <td className="py-3 px-4 text-center">✓ Ilimitado</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900">Podcast em áudio</td>
                <td className="py-3 px-4 text-center">Episódios públicos</td>
                <td className="py-3 px-4 text-center">Todos + exclusivos</td>
                <td className="py-3 px-4 text-center">Todos + exclusivos</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900">Masterclasses em vídeo</td>
                <td className="py-3 px-4 text-center text-slate-400">Prévia</td>
                <td className="py-3 px-4 text-center text-blue-600 font-semibold">
                  ✓ Acesso completo
                </td>
                <td className="py-3 px-4 text-center text-indigo-600 font-semibold">
                  ✓ Acesso completo
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900">
                  Downloads de frameworks em PDF (A3)
                </td>
                <td className="py-3 px-4 text-center text-slate-400">Prévia</td>
                <td className="py-3 px-4 text-center text-blue-600 font-semibold">✓ Ilimitado</td>
                <td className="py-3 px-4 text-center text-indigo-600 font-semibold">✓ Ilimitado</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900">
                  Sessões 1-on-1 com Manoel Santos
                </td>
                <td className="py-3 px-4 text-center text-slate-400">—</td>
                <td className="py-3 px-4 text-center text-slate-400">—</td>
                <td className="py-3 px-4 text-center text-indigo-600 font-semibold">✓ Incluso</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interest Registration Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Registrar Interesse: {getPlanName(selectedPlan)}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              A cobrança ainda não está ativa. Cadastre seus dados para receber o convite pioneiro
              com desconto quando liberarmos as assinaturas.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitInterest} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="interest-name" className="text-xs">
                Seu Nome Completo
              </Label>
              <Input
                id="interest-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João da Silva"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="interest-email" className="text-xs">
                Seu Melhor E-mail
              </Label>
              <Input
                id="interest-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="interest-notes" className="text-xs">
                O que você mais gostaria de aprender? (Opcional)
              </Label>
              <Textarea
                id="interest-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Quero aplicar Lean Product Development no meu time de software / aeroespacial..."
                rows={3}
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
                disabled={submitting}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                {submitting ? 'Registrando...' : 'Confirmar Interesse'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
