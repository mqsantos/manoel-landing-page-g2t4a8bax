export type ContentType = 'video' | 'audio' | 'pdf' | 'article'

export interface ContentItem {
  id: string
  title: string
  slug: string
  type: ContentType
  description: string
  content_body?: string
  is_premium: boolean
  file?: string
  external_url?: string
  cover_image?: string
  duration_or_read_time?: string
  tags?: string
  views_count?: number
  created: string
  updated: string
}

export type PlanType = 'gratis' | 'pro_mensal' | 'pro_anual' | 'mentoria'

export interface PlanInterest {
  id: string
  name: string
  email: string
  plan: PlanType
  notes?: string
  created: string
  updated: string
}

export interface SiteView {
  id: string
  path: string
  referrer?: string
  user_agent?: string
  created: string
}

export interface ContentView {
  id: string
  content_id: string
  content_slug?: string
  content_type?: string
  is_premium?: boolean
  created: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  verified?: boolean
  created: string
}
