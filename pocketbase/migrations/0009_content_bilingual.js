// Etapa 2 do bilinguismo: título e descrição dos conteúdos também em inglês.
// Novos campos opcionais "title_en" e "description_en" na coleção contents.
// Os campos PT (title/description) não são tocados; EN vazio = site exibe o PT.
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('contents')
    let changed = false
    if (!collection.fields.getByName('title_en')) {
      collection.fields.add(new Field({ name: 'title_en', type: 'text', required: false }))
      changed = true
    }
    if (!collection.fields.getByName('description_en')) {
      collection.fields.add(new Field({ name: 'description_en', type: 'text', required: false }))
      changed = true
    }
    if (changed) app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('contents')
      let changed = false
      if (collection.fields.getByName('title_en')) {
        collection.fields.removeByName('title_en')
        changed = true
      }
      if (collection.fields.getByName('description_en')) {
        collection.fields.removeByName('description_en')
        changed = true
      }
      if (changed) app.save(collection)
    } catch (_) {}
  },
)
