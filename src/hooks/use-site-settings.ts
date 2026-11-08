import { useEffect, useState } from 'react'
import {
  DEFAULT_SITE_SETTINGS,
  SiteSettings,
  SiteSettingsService,
} from '@/services/siteSettingsService'

/**
 * Textos editáveis do site. Começa com os padrões (sem piscar) e troca pelos
 * valores salvos no Painel do Dono quando chegam.
 */
export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS)

  useEffect(() => {
    let active = true
    SiteSettingsService.load()
      .then(({ settings: saved }) => {
        if (active) setSettings(saved)
      })
      .catch((err) => console.error(err))
    return () => {
      active = false
    }
  }, [])

  return settings
}
