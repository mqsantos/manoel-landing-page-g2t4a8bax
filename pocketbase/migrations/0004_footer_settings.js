// Torna o rodapé editável: novo campo json "footer" (textos, links e lista de
// temas) + seed do registro único com os valores atuais do site, idempotente.
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('site_settings')

    if (!collection.fields.getByName('footer')) {
      collection.fields.add(new Field({ name: 'footer', type: 'json', maxSize: 8000 }))
      app.save(collection)
    }

    // Seed no registro existente (se houver), preservando o que já foi editado.
    try {
      const record = app.findFirstRecordByFilter('site_settings', 'id != ""')
      if (record && !record.get('footer')) {
        record.set('footer', {
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
        })
        app.save(record)
      }
    } catch (_) {
      // Nenhum registro salvo ainda: os fallbacks do código cobrem o rodapé.
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('site_settings')
      if (collection.fields.getByName('footer')) {
        collection.fields.removeByName('footer')
        app.save(collection)
      }
    } catch (_) {}
  },
)
