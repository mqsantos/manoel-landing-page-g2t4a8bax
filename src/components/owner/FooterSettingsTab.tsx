import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LinesEditor } from '@/components/owner/SettingsFormFields'
import { SiteSettings } from '@/services/siteSettingsService'

type FooterSettings = SiteSettings['footer']

/** Formulário da aba "Rodapé" — todos os textos que hoje aparecem no Footer. */
export function FooterSettingsTab({
  settings,
  onPatch,
}: {
  settings: SiteSettings
  onPatch: (partial: Partial<SiteSettings>) => void
}) {
  const set = (partial: Partial<FooterSettings>) =>
    onPatch({ footer: { ...settings.footer, ...partial } })

  return (
    <div className="space-y-6">
      {/* Marca e bio */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Marca e bio (primeira coluna)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Iniciais no quadrado azul</Label>
            <Input
              value={settings.footer.brandInitials}
              onChange={(e) => set({ brandInitials: e.target.value })}
              className="text-xs"
              placeholder="Ex: MS"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-semibold">Nome ao lado das iniciais</Label>
            <Input
              value={settings.footer.brandName}
              onChange={(e) => set({ brandName: e.target.value })}
              className="text-xs"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Texto de apresentação (bio)</Label>
          <Textarea
            value={settings.footer.bio}
            onChange={(e) => set({ bio: e.target.value })}
            className="text-xs"
            rows={4}
          />
        </div>
      </div>

      {/* Contatos */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Botões de contato</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Texto do botão do LinkedIn</Label>
            <Input
              value={settings.footer.linkedinLabel}
              onChange={(e) => set({ linkedinLabel: e.target.value })}
              className="text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Endereço do LinkedIn (URL)</Label>
            <Input
              value={settings.footer.linkedinUrl}
              onChange={(e) => set({ linkedinUrl: e.target.value })}
              className="text-xs"
              placeholder="https://www.linkedin.com/in/..."
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Texto do botão de e-mail</Label>
            <Input
              value={settings.footer.emailLabel}
              onChange={(e) => set({ emailLabel: e.target.value })}
              className="text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">E-mail de destino (ao clicar)</Label>
            <Input
              value={settings.footer.email}
              onChange={(e) => set({ email: e.target.value })}
              className="text-xs"
              placeholder="Ex: contato@dominio.com.br"
            />
          </div>
        </div>
      </div>

      {/* Navegação */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Coluna de navegação</h3>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Título da coluna</Label>
          <Input
            value={settings.footer.navTitle}
            onChange={(e) => set({ navTitle: e.target.value })}
            className="text-xs"
          />
        </div>
        <LinesEditor
          label="Links (uma linha por link, no formato: Rótulo | caminho)"
          hint='O caminho é a parte depois do domínio — começa com "/" (ex: "/planos"). Exemplos: Início & Biografia | /  —  Planos & Assinatura Freemium | /planos. Links são abertos no site; se começar com "http", abre em outra aba.'
          rows={settings.footer.navLinks.map((l) => `${l.label} | ${l.path}`)}
          onChange={(rows) =>
            set({
              navLinks: rows
                .map((row) => {
                  const sep = row.indexOf('|')
                  if (sep === -1) return { label: row.trim(), path: '' }
                  return {
                    label: row.slice(0, sep).trim(),
                    path: row
                      .slice(sep + 1)
                      .trim()
                      .replace(/^\/+/, ''),
                  }
                })
                .filter((l) => l.label && l.path),
            })
          }
        />
      </div>

      {/* Temas Principais */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Temas Principais</h3>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Título da coluna</Label>
          <Input
            value={settings.footer.themesTitle}
            onChange={(e) => set({ themesTitle: e.target.value })}
            className="text-xs"
          />
        </div>
        <LinesEditor
          label="Temas"
          hint="Um tema por linha. Adicione, remova, renomeie e reordene com as setas."
          rows={settings.footer.themes}
          onChange={(themes) => set({ themes })}
        />
      </div>

      {/* Barra final */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Barra final (copyright e selo)</h3>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Texto de copyright</Label>
          <Input
            value={settings.footer.copyright}
            onChange={(e) => set({ copyright: e.target.value })}
            className="text-xs"
          />
          <p className="text-[11px] text-slate-500">
            Use <code className="bg-slate-100 rounded px-1">{'{ano}'}</code> onde quiser que apareça
            o ano atual (ex: 2026).
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Texto do selo (com escudo verde)</Label>
            <Input
              value={settings.footer.secureLabel}
              onChange={(e) => set({ secureLabel: e.target.value })}
              className="text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Link "Programa de Assinantes"</Label>
            <Input
              value={settings.footer.subscribersLinkLabel}
              onChange={(e) => set({ subscribersLinkLabel: e.target.value })}
              className="text-xs"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Caminho do link de assinantes</Label>
          <Input
            value={settings.footer.subscribersLinkPath}
            onChange={(e) => set({ subscribersLinkPath: e.target.value })}
            className="text-xs"
            placeholder="Ex: /planos"
          />
        </div>
      </div>
    </div>
  )
}
