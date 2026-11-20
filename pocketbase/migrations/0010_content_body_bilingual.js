// Etapa 3 do bilinguismo: corpo dos artigos também em inglês.
// Novo campo opcional "content_body_en" na coleção contents.
// O campo PT (content_body) não é tocado; EN vazio = site exibe o PT.
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('contents')
    if (!collection.fields.getByName('content_body_en')) {
      collection.fields.add(new Field({ name: 'content_body_en', type: 'text', required: false }))
      app.save(collection)
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('contents')
      if (collection.fields.getByName('content_body_en')) {
        collection.fields.removeByName('content_body_en')
        app.save(collection)
      }
    } catch (_) {}
  },
)
