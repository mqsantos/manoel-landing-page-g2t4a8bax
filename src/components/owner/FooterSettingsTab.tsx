import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LinesEditor } from '@/components/owner/SettingsFormFields'
import { SiteSettings } from '@/services/siteSettingsService'
import { useLanguage } from '@/lib/i18n'

type FooterSettings = SiteSettings['footer']

/** Formulário da aba "Rodapé" — todos os textos que hoje aparecem no Footer. */
export function FooterSettingsTab({
  settings,
  onPatch,
}: {
  settings: SiteSettings
  onPatch: (partial: Partial<SiteSettings>) => void
}) {
  const { t } = useLanguage()
  const set = (partial: Partial<FooterSettings>) =>
    onPatch({ footer: { ...settings.footer, ...partial } })

  return (
    <div className="space-y-6">
      {/* Marca e bio */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">{t('footerEditor.marca')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t('footerEditor.iniciais')}</Label>
            <Input
              value={settings.footer.brandInitials}
              onChange={(e) => set({ brandInitials: e.target.value })}
              className="text-xs"
              placeholder={t('footerEditor.iniciaisPlaceholder')}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-semibold">{t('footerEditor.nome')}</Label>
            <Input
              value={settings.footer.brandName}
              onChange={(e) => set({ brandName: e.target.value })}
              className="text-xs"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">{t('footerEditor.bio')}</Label>
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
        <h3 className="text-sm font-bold text-slate-900">{t('footerEditor.contatos')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t('footerEditor.linkedinLabel')}</Label>
            <Input
              value={settings.footer.linkedinLabel}
              onChange={(e) => set({ linkedinLabel: e.target.value })}
              className="text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t('footerEditor.linkedinUrl')}</Label>
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
            <Label className="text-xs font-semibold">{t('footerEditor.emailLabel')}</Label>
            <Input
              value={settings.footer.emailLabel}
              onChange={(e) => set({ emailLabel: e.target.value })}
              className="text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t('footerEditor.email')}</Label>
            <Input
              value={settings.footer.email}
              onChange={(e) => set({ email: e.target.value })}
              className="text-xs"
              placeholder={t('footerEditor.emailPlaceholder')}
            />
          </div>
        </div>
      </div>

      {/* Navegação */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">{t('footerEditor.nav')}</h3>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">{t('footerEditor.tituloColuna')}</Label>
          <Input
            value={settings.footer.navTitle}
            onChange={(e) => set({ navTitle: e.target.value })}
            className="text-xs"
          />
        </div>
        <LinesEditor
          label={t('footerEditor.linksLabel')}
          hint={t('footerEditor.linksHint')}
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
        <h3 className="text-sm font-bold text-slate-900">{t('footerEditor.temas')}</h3>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">{t('footerEditor.tituloColuna')}</Label>
          <Input
            value={settings.footer.themesTitle}
            onChange={(e) => set({ themesTitle: e.target.value })}
            className="text-xs"
          />
        </div>
        <LinesEditor
          label={t('footerEditor.temasLabel')}
          hint={t('footerEditor.temasHint')}
          rows={settings.footer.themes}
          onChange={(themes) => set({ themes })}
        />
      </div>

      {/* Barra final */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">{t('footerEditor.barraFinal')}</h3>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">{t('footerEditor.copyright')}</Label>
          <Input
            value={settings.footer.copyright}
            onChange={(e) => set({ copyright: e.target.value })}
            className="text-xs"
          />
          <p className="text-[11px] text-slate-500">
            {t('footerEditor.copyrightHintA')}{' '}
            <code className="bg-slate-100 rounded px-1">{'{ano}'}</code>{' '}
            {t('footerEditor.copyrightHintB')}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t('footerEditor.selo')}</Label>
            <Input
              value={settings.footer.secureLabel}
              onChange={(e) => set({ secureLabel: e.target.value })}
              className="text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t('footerEditor.linkAssinantes')}</Label>
            <Input
              value={settings.footer.subscribersLinkLabel}
              onChange={(e) => set({ subscribersLinkLabel: e.target.value })}
              className="text-xs"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">{t('footerEditor.caminhoAssinantes')}</Label>
          <Input
            value={settings.footer.subscribersLinkPath}
            onChange={(e) => set({ subscribersLinkPath: e.target.value })}
            className="text-xs"
            placeholder={t('footerEditor.caminhoPlaceholder')}
          />
        </div>
      </div>
    </div>
  )
}
