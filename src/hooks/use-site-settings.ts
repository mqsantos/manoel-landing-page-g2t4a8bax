import { useCallback, useEffect, useState } from 'react'
import { SiteSettings, SiteSettingsService } from '@/services/siteSettingsService'
import { useRealtime } from '@/hooks/use-realtime'

export interface SiteSettingsState {
  id: string | null
  settings: SiteSettings
}

let cache: SiteSettingsState | null = null

/**
 * Textos editáveis do site. Começa com os padrões (sem piscar), troca pelos
 * valores salvos no Painel do Dono quando chegam e reage em tempo real a
 * novas edições do dono. Os padrões do código são o fallback para qualquer
 * campo vazio.
 */
export function useSiteSettings(): SiteSettingsState {
  const [state, setState] = useState<SiteSettingsState>(
    cache || { id: null, settings: SiteSettingsService.defaults() },
  )

  const reload = useCallback(() => {
    SiteSettingsService.load()
      .then((next) => {
        cache = next
        setState(next)
      })
      .catch((err) => console.error('site_settings: falha ao carregar', err))
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  // Edição do dono aparece na hora nas páginas públicas.
  useRealtime('site_settings', () => reload())

  return state
}

/** Marca o cache como desatualizado (chamado após salvar no painel). */
export function invalidateSiteSettings() {
  cache = null
}
