// Torna cada plano individualmente ativável/desativável pelo Painel do Dono.
// Novo campo booleano "plans_visible" na coleção site_settings: um objeto JSON
// { gratis: bool, pro: bool, mentoria: bool } que marca quais planos aparecem
// na página pública. Ausente ou vazio = todos visíveis (fallback do código).
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('site_settings')
    if (!collection.fields.getByName('plans_visible')) {
      collection.fields.add(new Field({ name: 'plans_visible', type: 'json', maxSize: 2000 }))
      app.save(collection)
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('site_settings')
      if (collection.fields.getByName('plans_visible')) {
        collection.fields.removeByName('plans_visible')
        app.save(collection)
      }
    } catch (_) {}
  },
)
