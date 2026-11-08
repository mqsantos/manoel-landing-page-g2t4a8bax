import pb from '@/lib/pocketbase/client'

const SETTINGS_COLLECTION = 'site_settings'

export interface SkillCard {
  title: string
  description: string
  bullets: string[]
}

export interface CtaButtons {
  primary: string
  secondary: string
}

export interface CtaBanner {
  badge: string
  title: string
  text: string
  buttonPrimary: string
  buttonSecondary: string
}

export interface PlansHeader {
  badge: string
  title: string
  text: string
}

export interface FooterNavLinks {
  /** Link por rota interna (ex: "/planos"). */
  label: string
  path: string
}

export interface FooterSettings {
  brandInitials: string
  brandName: string
  bio: string
  linkedinLabel: string
  linkedinUrl: string
  emailLabel: string
  email: string
  navTitle: string
  navLinks: FooterNavLinks[]
  themesTitle: string
  themes: string[]
  copyright: string
  secureLabel: string
  subscribersLinkLabel: string
  subscribersLinkPath: string
}

export interface PlanSettings {
  name: string
  badge: string
  description: string
  price: string
  priceNote: string
  /** Texto opcional abaixo do preço (ex: nota de fundador do plano Pro). */
  note: string
  /** Texto do botão de ação do plano. */
  button: string
  /** Uma linha por benefício. Começar a linha com "!" marca benefício não incluído. */
  benefits: string[]
}

export interface SiteSettings {
  headline: string
  headlineHighlight: string
  bio: string
  subBio: string
  heroRole: string
  heroCompany: string
  credentials: string[]
  highlights: string[]
  skills: SkillCard[]
  ctaButtons: CtaButtons
  ctaBanner: CtaBanner
  plansHeader: PlansHeader
  planFree: PlanSettings
  planPro: PlanSettings
  planMentoria: PlanSettings
  footer: FooterSettings
  profilePhotoUrl: string
}

/**
 * Fallback para quando o dono ainda não enviou a foto oficial.
 * Vazio de propósito: a UI exibe as iniciais "MS" em vez de uma foto fake.
 */
const DEFAULT_PHOTO_URL = ''
/** Valores iniciais: exatamente os textos que o site exibia antes de ser editável. */
const DEFAULT_SITE_SETTINGS: SiteSettings = {
  headline: 'Excelência em Engenharia &',
  headlineHighlight: 'Transformação Lean',
  bio: 'Olá, sou **Manoel Santos**. Lidero engenharia de sistemas na **Boeing** após mais de **20 anos na Embraer** conduzindo a transformação cultural de Lean Product and Process Development (LPPD).',
  subBio:
    'Ajudo engenheiros, líderes e organizações de tecnologia a acelerar inovação com rigor técnico, métodos ágeis e inteligência artificial generativa aplicada à engenharia complexa.',
  heroRole: 'Systems Engineering Manager',
  heroCompany: 'Boeing Company',
  credentials: ['20+ anos Embraer', 'Liderança Boeing', 'M.Sc. Eng. Mecânica'],
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
  ctaButtons: {
    primary: 'Acessar Conteúdos Gratuitos',
    secondary: 'Conhecer Área Premium',
  },
  ctaBanner: {
    badge: 'Assinatura Freemium em Preparação',
    title: 'Quer ter acesso aos masterclasses, templates A3 e mentorias?',
    text: 'Estamos preparando a área exclusiva de assinantes. Registre seu interesse agora para garantir condições especiais de lançamento e acesso prioritário aos materiais restritos.',
    buttonPrimary: 'Ver Planos & Registrar Interesse',
    buttonSecondary: 'Criar Conta Gratuita',
  },
  plansHeader: {
    badge: 'Modelo Freemium em Pré-lançamento',
    title: 'Planos transparentes para acelerar sua carreira em engenharia',
    text: 'Hoje todo o acervo já pode ser explorado livremente. Escolha seu plano de preferência e registre seu interesse para garantir condições exclusivas de fundador quando a cobrança começar.',
  },
  planFree: {
    name: 'Membro Grátis',
    badge: 'Livre',
    description: 'Ideal para acompanhar os artigos e publicações fundamentais sem custo.',
    price: 'R$ 0',
    priceNote: '/ para sempre',
    note: '',
    button: 'Criar Conta Grátis',
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
    badge: 'Completo',
    description: 'Acesso irrestrito a todos os materiais, masterclasses e templates de engenharia.',
    price: 'R$ 59',
    priceNote: '/ mês (ou R$ 49/mês no anual)',
    note: 'Cobrança ainda não iniciada. Garanta 30% OFF de fundador.',
    button: 'Quero Assinar Pro (Registrar Interesse)',
    benefits: [
      '**Tudo do plano Grátis**',
      'Acesso integral a todas as Masterclasses em vídeo',
      'Download de todos os templates A3 e guias de processos em PDF',
      'Estudos de caso reais de engenharia aeroespacial e sistemas',
      'Badge exclusivo de Membro Fundador',
    ],
  },
  planMentoria: {
    name: 'Mentoria Executiva',
    badge: 'Vagas Limitadas',
    description:
      'Acompanhamento 1-on-1 direto com Manoel Santos para líderes e engenheiros seniores.',
    price: 'Sob Consulta',
    priceNote: '/ programa individual',
    note: '',
    button: 'Registrar Interesse em Mentoria',
    benefits: [
      'Sessões individuais de mentoria de carreira e liderança técnica',
      'Revisão personalizada de arquitetura de processos e Lean',
      'Canal direto com Manoel Santos via WhatsApp/Email',
      'Acesso vitalício a todo o acervo Pro',
    ],
  },
  footer: {
    brandInitials: 'MS',
    brandName: 'Manoel Santos',
    bio: 'Systems Engineering Manager na Boeing. Mais de 20 anos de trajetória na Embraer liderando Transformação Lean e Lean Product & Process Development (LPPD). Engenheiro Mecânico com M.Sc.',
    linkedinLabel: 'LinkedIn Oficial',
    linkedinUrl: 'https://www.linkedin.com/in/manoelsantos/',
    emailLabel: 'mqsantos@gmail.com',
    email: 'mqsantos@gmail.com',
    navTitle: 'Navegação',
    navLinks: [
      { label: 'Início & Biografia', path: '/' },
      { label: 'Acervo de Conteúdos', path: '/conteudos' },
      { label: 'Planos & Assinatura Freemium', path: '/planos' },
      { label: 'Criar Conta Gratuita', path: '/cadastro' },
      { label: 'Área de Membros (Entrar)', path: '/login' },
    ],
    themesTitle: 'Temas Principais',
    themes: [
      'Lean Product & Process Development',
      'Systems Engineering & MBSE',
      'The Augmented Engineer & IA',
      'Metodologia A3 & Liderança',
      'Gestão Aeroespacial Global',
    ],
    copyright: '© {ano} Manoel Santos. Todos os direitos reservados.',
    secureLabel: 'Ambiente Seguro',
    subscribersLinkLabel: 'Programa de Assinantes',
    subscribersLinkPath: '/planos',
  },
  profilePhotoUrl: DEFAULT_PHOTO_URL,
}

const asText = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.trim() ? value : fallback

const asList = (value: unknown, fallback: string[]): string[] => {
  if (!Array.isArray(value)) return fallback
  const list = value.map((item) => String(item).trim()).filter(Boolean)
  return list.length ? list : fallback
}

const parseJson = (raw: unknown, fallback: string): string => {
  if (typeof raw === 'string' && raw.trim()) return raw
  return fallback
}

const normalizeSkills = (value: unknown, fallback: SkillCard[]): SkillCard[] => {
  if (!Array.isArray(value) || value.length === 0) return fallback
  return value.map((raw) => ({
    title: asText(raw?.title, ''),
    description: asText(raw?.description, ''),
    bullets: asList(raw?.bullets, []),
  }))
}

const normalizeCtaButtons = (value: unknown, fallback: CtaButtons): CtaButtons => {
  if (!value || typeof value !== 'object') return fallback
  const raw = value as Record<string, unknown>
  return {
    primary: asText(raw.primary, fallback.primary),
    secondary: asText(raw.secondary, fallback.secondary),
  }
}

const normalizeCtaBanner = (value: unknown, fallback: CtaBanner): CtaBanner => {
  if (!value || typeof value !== 'object') return fallback
  const raw = value as Record<string, unknown>
  return {
    badge: asText(raw.badge, fallback.badge),
    title: asText(raw.title, fallback.title),
    text: asText(raw.text, fallback.text),
    buttonPrimary: asText(raw.buttonPrimary, fallback.buttonPrimary),
    buttonSecondary: asText(raw.buttonSecondary, fallback.buttonSecondary),
  }
}

const normalizePlansHeader = (value: unknown, fallback: PlansHeader): PlansHeader => {
  if (!value || typeof value !== 'object') return fallback
  const raw = value as Record<string, unknown>
  return {
    badge: asText(raw.badge, fallback.badge),
    title: asText(raw.title, fallback.title),
    text: asText(raw.text, fallback.text),
  }
}

/** Aceita "/planos" ou "https://..." — links internos viram rotas do React Router. */
const asFooterPath = (value: unknown, fallback: string): string => {
  if (typeof value !== 'string' || !value.trim()) return fallback
  const v = value.trim()
  return v.startsWith('/') || v.startsWith('http') || v.startsWith('mailto:') ? v : `/${v}`
}

const normalizeFooterNavLinks = (value: unknown, fallback: FooterNavLinks[]): FooterNavLinks[] => {
  if (!Array.isArray(value) || value.length === 0) return fallback
  const links = value
    .map((raw) => ({
      label: asText(raw?.label, ''),
      path: asFooterPath(raw?.path, ''),
    }))
    .filter((link) => link.label && link.path)
  return links.length ? links : fallback
}

const normalizeFooter = (value: unknown, fallback: FooterSettings): FooterSettings => {
  if (!value || typeof value !== 'object') return fallback
  const raw = value as Record<string, unknown>
  return {
    brandInitials: asText(raw.brandInitials, fallback.brandInitials),
    brandName: asText(raw.brandName, fallback.brandName),
    bio: asText(raw.bio, fallback.bio),
    linkedinLabel: asText(raw.linkedinLabel, fallback.linkedinLabel),
    linkedinUrl: asText(raw.linkedinUrl, fallback.linkedinUrl),
    emailLabel: asText(raw.emailLabel, fallback.emailLabel),
    email: asText(raw.email, fallback.email),
    navTitle: asText(raw.navTitle, fallback.navTitle),
    navLinks: normalizeFooterNavLinks(raw.navLinks, fallback.navLinks),
    themesTitle: asText(raw.themesTitle, fallback.themesTitle),
    themes: asList(raw.themes, fallback.themes),
    copyright: asText(raw.copyright, fallback.copyright),
    secureLabel: asText(raw.secureLabel, fallback.secureLabel),
    subscribersLinkLabel: asText(raw.subscribersLinkLabel, fallback.subscribersLinkLabel),
    subscribersLinkPath: asFooterPath(raw.subscribersLinkPath, fallback.subscribersLinkPath),
  }
}

const normalizePlan = (value: unknown, fallback: PlanSettings): PlanSettings => {
  if (!value || typeof value !== 'object') return fallback
  const raw = value as Record<string, unknown>
  return {
    name: asText(raw.name, fallback.name),
    badge: asText(raw.badge, fallback.badge),
    description: asText(raw.description, fallback.description),
    price: asText(raw.price, fallback.price),
    priceNote: asText(raw.priceNote, fallback.priceNote),
    note: typeof raw.note === 'string' ? raw.note : fallback.note,
    button: asText(raw.button, fallback.button),
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
    subBio: asText(r.sub_bio, d.subBio),
    heroRole: asText(r.hero_role, d.heroRole),
    heroCompany: asText(r.hero_company, d.heroCompany),
    credentials: asList(r.credentials, d.credentials),
    highlights: asList(r.highlights, d.highlights),
    skills: normalizeSkills(r.skills, d.skills),
    ctaButtons: normalizeCtaButtons(r.cta_buttons, d.ctaButtons),
    ctaBanner: normalizeCtaBanner(r.cta_banner, d.ctaBanner),
    plansHeader: normalizePlansHeader(r.plans_header, d.plansHeader),
    planFree: normalizePlan(r.plan_free, d.planFree),
    planPro: normalizePlan(r.plan_pro, d.planPro),
    planMentoria: normalizePlan(r.plan_mentoria, d.planMentoria),
    footer: normalizeFooter(r.footer, d.footer),
    profilePhotoUrl: r.profile_photo ? pb.files.getUrl(r, r.profile_photo) : DEFAULT_PHOTO_URL,
  }
}

export const SiteSettingsService = {
  /** Cópia nova dos valores padrão (fallback enquanto o banco não responde). */
  defaults(): SiteSettings {
    return JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS)) as SiteSettings
  },

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
    body.append('sub_bio', settings.subBio.trim())
    body.append('hero_role', settings.heroRole.trim())
    body.append('hero_company', settings.heroCompany.trim())
    body.append('credentials', JSON.stringify(settings.credentials))
    body.append('highlights', JSON.stringify(settings.highlights))
    body.append('skills', JSON.stringify(settings.skills))
    body.append('cta_buttons', JSON.stringify(settings.ctaButtons))
    body.append('cta_banner', JSON.stringify(settings.ctaBanner))
    body.append('plans_header', JSON.stringify(settings.plansHeader))
    body.append('plan_free', JSON.stringify(settings.planFree))
    body.append('plan_pro', JSON.stringify(settings.planPro))
    body.append('plan_mentoria', JSON.stringify(settings.planMentoria))
    body.append('footer', JSON.stringify(settings.footer))
    if (photo) body.append('profile_photo', photo)

    if (id) {
      const record = await pb.collection(SETTINGS_COLLECTION).update(id, body)
      return record.id
    }
    const record = await pb.collection(SETTINGS_COLLECTION).create(body)
    return record.id
  },
}
