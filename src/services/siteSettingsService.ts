import pb from '@/lib/pocketbase/client'

const SETTINGS_COLLECTION = 'site_settings'

export interface SkillCard {
  title: string
  description: string
  bullets: string[]
}

export interface PlanSettings {
  name: string
  description: string
  price: string
  priceNote: string
  /** Uma linha por benefício. Começar a linha com "!" marca benefício não incluído. */
  benefits: string[]
}

export interface SiteSettings {
  headline: string
  headlineHighlight: string
  bio: string
  highlights: string[]
  skills: SkillCard[]
  profilePhotoUrl: string
  planFree: PlanSettings
  planPro: PlanSettings
}

/** Valores iniciais: exatamente os textos que o site exibia antes de ser editável. */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  headline: 'Excelência em Engenharia &',
  headlineHighlight: 'Transformação Lean',
  bio: 'Olá, sou **Manoel Santos**. Lidero engenharia de sistemas na **Boeing** após mais de **20 anos na Embraer** conduzindo a transformação cultural de Lean Product and Process Development (LPPD).',
  highlights: [
    'Especialista em Lean Product & Process Development (LPPD)',
    'Autor dos frameworks "The Lean Developer" e "The Augmented Engineer"',
    'Mentoria executiva para engenharia e transição de carreira técnica',
  ],
  skills: [
    {
      title: 'Embraer & Boeing',
      description:
        '20 anos liderando o programa de melhoria contínua na Embraer, integrando times de projeto de aeronaves comerciais, executivas e de defesa. Atualmente atuando como Systems Engineering Manager na Boeing.',
      bullets: [
        'Gestão de interfaces complexas e fornecedores internacionais',
        'Arquitetura e certificação de sistemas aeronáuticos',
      ],
    },
    {
      title: 'Lean Product Development',
      description:
        'Pioneiro na implementação do LPPD. Eliminação de desperdício em fases de concepção e especificação, antes mesmo da primeira linha de código ou corte de peça.',
      bullets: [
        'Metodologia A3 para resolução de problemas crônicos',
        'Set-Based Concurrent Engineering e Obeya War Rooms',
      ],
    },
    {
      title: 'The Augmented Engineer',
      description:
        'Integração de Inteligência Artificial Generativa no fluxo de engenharia de requisitos, testes automatizados e gestão do conhecimento técnico de alta densidade.',
      bullets: [
        'Rastreabilidade ágil de requisitos com LLMs',
        'Aceleração de decisões técnicas sem perda de rigor',
      ],
    },
  ],
  profilePhotoUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=48',
  planFree: {
    name: 'Membro Grátis',
    description: 'Ideal para acompanhar os artigos e publicações fundamentais sem custo.',
    price: 'R$ 0',
    priceNote: '/ para sempre',
    benefits: [
      'Acesso aos artigos "The Lean Developer" e "The Augmented Engineer"',
      'Episódios abertos do podcast em áudio',
      'Newsletter e atualizações por e-mail',
      '!Masterclasses avançadas em vídeo',
      '!Templates editáveis em PDF (A3 Framework)',
    ],
  },
  planPro: {
    name: 'Membro Pro',
    description: 'Acesso irrestrito a todos os materiais, masterclasses e templates de engenharia.',
    price: 'R$ 59',
    priceNote: '/ mês (ou R$ 49/mês no anual)',
    benefits: [
      '**Tudo do plano Grátis**',
      'Acesso integral a todas as Masterclasses em vídeo',
      'Download de todos os templates A3 e guias de processos em PDF',
      'Estudos de caso reais de engenharia aeroespacial e sistemas',
      'Badge exclusivo de Membro Fundador',
    ],
  },
}

const asText = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.trim() ? value : fallback

const asList = (value: unknown, fallback: string[]): string[] => {
  if (!Array.isArray(value)) return fallback
  const list = value.map((item) => String(item).trim()).filter(Boolean)
  return list.length ? list : fallback
}

const normalizeSkills = (value: unknown, fallback: SkillCard[]): SkillCard[] => {
  if (!Array.isArray(value) || value.length === 0) return fallback
  return value.map((raw) => ({
    title: asText(raw?.title, ''),
    description: asText(raw?.description, ''),
    bullets: asList(raw?.bullets, []),
  }))
}

const normalizePlan = (value: unknown, fallback: PlanSettings): PlanSettings => {
  const raw = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>
  return {
    name: asText(raw.name, fallback.name),
    description: asText(raw.description, fallback.description),
    price: asText(raw.price, fallback.price),
    priceNote: asText(raw.priceNote, fallback.priceNote),
    benefits: asList(raw.benefits, fallback.benefits),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromRecord = (r: any): SiteSettings => {
  const d = DEFAULT_SITE_SETTINGS
  return {
    headline: asText(r.headline, d.headline),
    headlineHighlight: asText(r.headline_highlight, d.headlineHighlight),
    bio: asText(r.bio, d.bio),
    highlights: asList(r.highlights, d.highlights),
    skills: normalizeSkills(r.skills, d.skills),
    profilePhotoUrl: r.profile_photo ? pb.files.getUrl(r, r.profile_photo) : d.profilePhotoUrl,
    planFree: normalizePlan(r.plan_free, d.planFree),
    planPro: normalizePlan(r.plan_pro, d.planPro),
  }
}

export const SiteSettingsService = {
  /** Lê a configuração salva. `id` é null enquanto nada foi salvo (valem os padrões). */
  async load(): Promise<{ id: string | null; settings: SiteSettings }> {
    const res = await pb.collection(SETTINGS_COLLECTION).getList(1, 1)
    const record = res.items[0]
    if (!record) return { id: null, settings: DEFAULT_SITE_SETTINGS }
    return { id: record.id, settings: fromRecord(record) }
  },

  /** Cria ou atualiza o registro único. Só o dono consegue (regra da coleção). */
  async save(id: string | null, settings: SiteSettings, photo: File | null): Promise<string> {
    const body = new FormData()
    body.append('headline', settings.headline.trim())
    body.append('headline_highlight', settings.headlineHighlight.trim())
    body.append('bio', settings.bio.trim())
    body.append('highlights', JSON.stringify(settings.highlights))
    body.append('skills', JSON.stringify(settings.skills))
    body.append('plan_free', JSON.stringify(settings.planFree))
    body.append('plan_pro', JSON.stringify(settings.planPro))
    if (photo) body.append('profile_photo', photo)

    if (id) {
      const record = await pb.collection(SETTINGS_COLLECTION).update(id, body)
      return record.id
    }
    const record = await pb.collection(SETTINGS_COLLECTION).create(body)
    return record.id
  },
}
