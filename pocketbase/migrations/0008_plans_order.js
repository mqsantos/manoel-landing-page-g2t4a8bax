// Ordem de exibição dos planos na página pública (reordenar no Painel do Dono).
// Novo campo json "plans_order" em site_settings: um array de chaves de plano,
// ex.: ["pro", "gratis", "mentoria"]. Ausente/vazio = ordem padrão do código.
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('site_settings')
    if (!collection.fields.getByName('plans_order')) {
      collection.fields.add(new Field({ name: 'plans_order', type: 'json', maxSize: 2000 }))
      app.save(collection)
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('site_settings')
      if (collection.fields.getByName('plans_order')) {
        collection.fields.removeByName('plans_order')
        app.save(collection)
      }
    } catch (_) {}
  },
)
