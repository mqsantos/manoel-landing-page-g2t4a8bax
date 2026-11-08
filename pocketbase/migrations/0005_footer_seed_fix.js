migrate(
  (app) => {
    // Correção da 0004: a busca por registro com id='' nunca encontrava nada,
    // então o seed do rodapé não chegou a gravar no registro que já existia.
    let record
    try {
      record = app.findFirstRecordByFilter('site_settings', 'id != ""')
    } catch (_) {
      return // nenhum registro ainda: a normalização cobre o site com os padrões
    }
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
  },
  (app) => {
    try {
      const record = app.findFirstRecordByFilter('site_settings', 'id != ""')
      if (record) record.set('footer', null)
      app.save(record)
    } catch (_) {}
  },
)
