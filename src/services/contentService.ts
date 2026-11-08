import pb from '@/lib/pocketbase/client'
import {
  ContentItem,
  PlanInterest,
  SiteView,
  ContentView,
  PlanType,
  ContentType,
} from '@/types/database'

export const ContentService = {
  async getAll(params?: {
    type?: ContentType | 'all'
    premium?: 'all' | 'free' | 'premium'
    search?: string
  }): Promise<ContentItem[]> {
    const filters: string[] = []

    if (params?.type && params.type !== 'all') {
      filters.push(`type = "${params.type}"`)
    }

    if (params?.premium === 'free') {
      filters.push(`is_premium = false`)
    } else if (params?.premium === 'premium') {
      filters.push(`is_premium = true`)
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.trim()
      filters.push(`(title ~ "${q}" || description ~ "${q}" || tags ~ "${q}")`)
    }

    const filterString = filters.join(' && ')

    const records = await pb.collection('contents').getFullList({
      filter: filterString || undefined,
      sort: '-created',
    })

    return records.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      type: r.type,
      description: r.description || '',
      content_body: r.content_body || '',
      is_premium: !!r.is_premium,
      file: r.file ? pb.files.getUrl(r, r.file) : undefined,
      external_url: r.external_url || '',
      cover_image: r.cover_image ? pb.files.getUrl(r, r.cover_image) : undefined,
      duration_or_read_time: r.duration_or_read_time || '',
      tags: r.tags || '',
      views_count: r.views_count || 0,
      created: r.created,
      updated: r.updated,
    }))
  },

  async getBySlug(slug: string): Promise<ContentItem | null> {
    try {
      const r = await pb.collection('contents').getFirstListItem(`slug = "${slug}"`)
      return {
        id: r.id,
        title: r.title,
        slug: r.slug,
        type: r.type,
        description: r.description || '',
        content_body: r.content_body || '',
        is_premium: !!r.is_premium,
        file: r.file ? pb.files.getUrl(r, r.file) : undefined,
        external_url: r.external_url || '',
        cover_image: r.cover_image ? pb.files.getUrl(r, r.cover_image) : undefined,
        duration_or_read_time: r.duration_or_read_time || '',
        tags: r.tags || '',
        views_count: r.views_count || 0,
        created: r.created,
        updated: r.updated,
      }
    } catch (_) {
      return null
    }
  },

  async getFeatured(): Promise<ContentItem[]> {
    const records = await pb.collection('contents').getList(1, 4, {
      sort: '-created',
    })
    return records.items.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      type: r.type,
      description: r.description || '',
      content_body: r.content_body || '',
      is_premium: !!r.is_premium,
      file: r.file ? pb.files.getUrl(r, r.file) : undefined,
      external_url: r.external_url || '',
      cover_image: r.cover_image ? pb.files.getUrl(r, r.cover_image) : undefined,
      duration_or_read_time: r.duration_or_read_time || '',
      tags: r.tags || '',
      views_count: r.views_count || 0,
      created: r.created,
      updated: r.updated,
    }))
  },

  async create(data: FormData | Record<string, unknown>): Promise<void> {
    await pb.collection('contents').create(data)
  },

  async update(id: string, data: FormData | Record<string, unknown>): Promise<void> {
    await pb.collection('contents').update(id, data)
  },

  async delete(id: string): Promise<void> {
    await pb.collection('contents').delete(id)
  },
}

export const PlanInterestService = {
  async register(data: {
    name: string
    email: string
    plan: PlanType
    notes?: string
  }): Promise<void> {
    await pb.collection('plan_interests').create({
      name: data.name.trim(),
      email: data.email.trim(),
      plan: data.plan,
      notes: data.notes?.trim() || '',
    })
  },

  async getAll(): Promise<PlanInterest[]> {
    const records = await pb.collection('plan_interests').getFullList({
      sort: '-created',
    })
    return records.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      plan: r.plan,
      notes: r.notes || '',
      created: r.created,
      updated: r.updated,
    }))
  },
}

export const AnalyticsService = {
  async trackPageView(path: string): Promise<void> {
    try {
      await pb.collection('site_views').create({
        path,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      })
    } catch (_) {
      // analytics fail silent
    }
  },

  async trackContentView(content: ContentItem): Promise<void> {
    try {
      await pb.collection('content_views').create({
        content_id: content.id,
        content_slug: content.slug,
        content_type: content.type,
        is_premium: content.is_premium,
      })

      // optionally increment counter
      try {
        await pb.collection('contents').update(content.id, {
          'views_count+': 1,
        })
      } catch {
        /* intentionally ignored */
      }
    } catch (_) {
      // fail silent
    }
  },

  async getStats(): Promise<{
    totalSiteViews: number
    totalContentViews: number
    totalLeads: number
    totalContents: number
    siteViewsByPath: { path: string; count: number }[]
    contentViewsByType: { type: string; count: number }[]
    recentInterests: PlanInterest[]
    viewsHistory: { date: string; count: number }[]
  }> {
    const [siteViews, contentViews, interests, contents] = await Promise.all([
      pb
        .collection('site_views')
        .getFullList({ sort: '-created', limit: 500 })
        .catch(() => []),
      pb
        .collection('content_views')
        .getFullList({ sort: '-created', limit: 500 })
        .catch(() => []),
      pb
        .collection('plan_interests')
        .getFullList({ sort: '-created', limit: 100 })
        .catch(() => []),
      pb
        .collection('contents')
        .getFullList()
        .catch(() => []),
    ])

    // Group site views by path
    const pathMap: Record<string, number> = {}
    siteViews.forEach((v) => {
      pathMap[v.path] = (pathMap[v.path] || 0) + 1
    })
    const siteViewsByPath = Object.entries(pathMap)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)

    // Group content views by type
    const typeMap: Record<string, number> = {}
    contentViews.forEach((v) => {
      const t = v.content_type || 'outro'
      typeMap[t] = (typeMap[t] || 0) + 1
    })
    const contentViewsByType = Object.entries(typeMap).map(([type, count]) => ({ type, count }))

    // Group site views by day
    const dayMap: Record<string, number> = {}
    siteViews.forEach((v) => {
      const day = v.created?.split('T')[0] || v.created?.split(' ')[0] || 'Hoje'
      dayMap[day] = (dayMap[day] || 0) + 1
    })
    const viewsHistory = Object.entries(dayMap)
      .slice(0, 14)
      .map(([date, count]) => ({ date, count }))
      .reverse()

    return {
      totalSiteViews: siteViews.length,
      totalContentViews: contentViews.length,
      totalLeads: interests.length,
      totalContents: contents.length,
      siteViewsByPath,
      contentViewsByType,
      recentInterests: interests.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        plan: r.plan,
        notes: r.notes || '',
        created: r.created,
        updated: r.updated,
      })),
      viewsHistory,
    }
  },
}
