migrate(
  (app) => {
    // 1. contents collection
    const contents = new Collection({
      name: 'contents',
      type: 'base',
      listRule: '', // public read
      viewRule: '', // public read
      createRule: "@request.auth.id != ''", // auth write
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          required: true,
          values: ['video', 'audio', 'pdf', 'article'],
          maxSelect: 1,
        },
        { name: 'description', type: 'text' },
        { name: 'content_body', type: 'text' }, // text/markdown body for articles or transcript
        { name: 'is_premium', type: 'bool' }, // false = free, true = premium
        { name: 'file', type: 'file', maxSelect: 1, maxSize: 104857600 }, // 100MB max for video/audio/pdf
        { name: 'external_url', type: 'url' }, // YouTube, Spotify, Drive or external link if provided
        { name: 'cover_image', type: 'file', maxSelect: 1, maxSize: 10485760 },
        { name: 'duration_or_read_time', type: 'text' }, // e.g. "12 min", "8 min de leitura"
        { name: 'tags', type: 'text' }, // comma separated e.g. "Lean, Engenharia, IA"
        { name: 'views_count', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_contents_slug ON contents (slug)',
        'CREATE INDEX idx_contents_type ON contents (type)',
        'CREATE INDEX idx_contents_is_premium ON contents (is_premium)',
      ],
    })
    app.save(contents)

    // 2. plan_interests collection (leads)
    const planInterests = new Collection({
      name: 'plan_interests',
      type: 'base',
      listRule: "@request.auth.id != ''", // owner/auth can list
      viewRule: "@request.auth.id != ''",
      createRule: '', // anyone can register interest
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        {
          name: 'plan',
          type: 'select',
          required: true,
          values: ['gratis', 'pro_mensal', 'pro_anual', 'mentoria'],
          maxSelect: 1,
        },
        { name: 'notes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_plan_interests_created ON plan_interests (created DESC)',
        'CREATE INDEX idx_plan_interests_email ON plan_interests (email)',
      ],
    })
    app.save(planInterests)

    // 3. site_views collection (analytics)
    const siteViews = new Collection({
      name: 'site_views',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: '', // visitors register page views
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'path', type: 'text', required: true },
        { name: 'referrer', type: 'text' },
        { name: 'user_agent', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_site_views_path ON site_views (path)',
        'CREATE INDEX idx_site_views_created ON site_views (created DESC)',
      ],
    })
    app.save(siteViews)

    // 4. content_views collection (analytics)
    const contentViews = new Collection({
      name: 'content_views',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: '', // visitors register content views
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'content_id',
          type: 'relation',
          required: true,
          collectionId: contents.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'content_slug', type: 'text' },
        { name: 'content_type', type: 'text' },
        { name: 'is_premium', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_content_views_content ON content_views (content_id)',
        'CREATE INDEX idx_content_views_created ON content_views (created DESC)',
      ],
    })
    app.save(contentViews)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('content_views'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('site_views'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('plan_interests'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('contents'))
    } catch (_) {}
  },
)
