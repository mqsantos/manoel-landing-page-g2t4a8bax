migrate(
  (app) => {
    const siteSettings = new Collection({
      name: 'site_settings',
      type: 'base',
      // Leitura pública (as páginas do site precisam), escrita só para o dono.
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != '' && @request.auth.email = 'mqsantos@gmail.com'",
      updateRule: "@request.auth.id != '' && @request.auth.email = 'mqsantos@gmail.com'",
      deleteRule: null,
      fields: [
        { name: 'headline', type: 'text', max: 200 },
        { name: 'headline_highlight', type: 'text', max: 200 },
        { name: 'bio', type: 'text', max: 4000 },
        { name: 'sub_bio', type: 'text', max: 1000 },
        { name: 'hero_role', type: 'text', max: 200 },
        { name: 'hero_company', type: 'text', max: 200 },
        { name: 'credentials', type: 'json', maxSize: 4000 },
        { name: 'highlights', type: 'json', maxSize: 8000 },
        { name: 'skills', type: 'json', maxSize: 16000 },
        { name: 'cta_banner', type: 'json', maxSize: 4000 },
        { name: 'cta_buttons', type: 'json', maxSize: 2000 },
        { name: 'plans_header', type: 'json', maxSize: 4000 },
        { name: 'plan_free', type: 'json', maxSize: 8000 },
        { name: 'plan_pro', type: 'json', maxSize: 8000 },
        { name: 'plan_mentoria', type: 'json', maxSize: 8000 },
        {
          name: 'profile_photo',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(siteSettings)

    // Seed único com os textos atuais do site (idempotente).
    try {
      app.findFirstRecordByData('site_settings', 'headline', 'Excelência em Engenharia &')
      return // já existe registro
    } catch (_) {}

    const record = new Record(siteSettings)
    record.set('headline', 'Excelência em Engenharia &')
    record.set('headline_highlight', 'Transformação Lean')
    record.set(
      'bio',
      'Olá, sou **Manoel Santos**. Lidero engenharia de sistemas na **Boeing** após mais de **20 anos na Embraer** conduzindo a transformação cultural de Lean Product and Process Development (LPPD).',
    )
    record.set(
      'sub_bio',
      'Ajudo engenheiros, líderes e organizações de tecnologia a acelerar inovação com rigor técnico, métodos ágeis e inteligência artificial generativa aplicada à engenharia complexa.',
    )
    record.set('hero_role', 'Systems Engineering Manager')
    record.set('hero_company', 'Boeing Company')
    record.set('credentials', ['20+ anos Embraer', 'Liderança Boeing', 'M.Sc. Eng. Mecânica'])
    record.set('highlights', [
      'Especialista em Lean Product & Process Development (LPPD)',
      'Autor dos frameworks "The Lean Developer" e "The Augmented Engineer"',
      'Mentoria executiva para engenharia e transição de carreira técnica',
    ])
    record.set('skills', [
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
    ])
    record.set('cta_banner', {
      badge: 'Assinatura Freemium em Preparação',
      title: 'Quer ter acesso aos masterclasses, templates A3 e mentorias?',
      text: 'Estamos preparando a área exclusiva de assinantes. Registre seu interesse agora para garantir condições especiais de lançamento e acesso prioritário aos materiais restritos.',
      buttonPrimary: 'Ver Planos & Registrar Interesse',
      buttonSecondary: 'Criar Conta Gratuita',
    })
    record.set('cta_buttons', {
      primary: 'Acessar Conteúdos Gratuitos',
      secondary: 'Conhecer Área Premium',
    })
    record.set('plans_header', {
      badge: 'Modelo Freemium em Pré-lançamento',
      title: 'Planos transparentes para acelerar sua carreira em engenharia',
      text: 'Hoje todo o acervo já pode ser explorado livremente. Escolha seu plano de preferência e registre seu interesse para garantir condições exclusivas de fundador quando a cobrança começar.',
    })
    record.set('plan_free', {
      name: 'Membro Grátis',
      description: 'Ideal para acompanhar os artigos e publicações fundamentais sem custo.',
      price: 'R$ 0',
      priceNote: '/ para sempre',
      benefits: [
        'Acesso aos artigos "The Lean Developer" e "The Augmented Engineer"',
        'Episódios abertos do podcast em áudio',
        'Newsletter e atualizações por e-mail',
        '!Masterclasses avançadas em vídeo',
        '!Templates editáveis em PDF (A3 Framework)',
      ],
    })
    record.set('plan_pro', {
      name: 'Membro Pro',
      description:
        'Acesso irrestrito a todos os materiais, masterclasses e templates de engenharia.',
      price: 'R$ 59',
      priceNote: '/ mês (ou R$ 49/mês no anual)',
      note: 'Cobrança ainda não iniciada. Garanta 30% OFF de fundador.',
      badge: 'Completo',
      benefits: [
        '**Tudo do plano Grátis**',
        'Acesso integral a todas as Masterclasses em vídeo',
        'Download de todos os templates A3 e guias de processos em PDF',
        'Estudos de caso reais de engenharia aeroespacial e sistemas',
        'Badge exclusivo de Membro Fundador',
      ],
    })
    record.set('plan_mentoria', {
      name: 'Mentoria Executiva',
      description:
        'Acompanhamento 1-on-1 direto com Manoel Santos para líderes e engenheiros seniores.',
      price: 'Sob Consulta',
      priceNote: '/ programa individual',
      badge: 'Vagas Limitadas',
      benefits: [
        'Sessões individuais de mentoria de carreira e liderança técnica',
        'Revisão personalizada de arquitetura de processos e Lean',
        'Canal direto com Manoel Santos via WhatsApp/Email',
        'Acesso vitalício a todo o acervo Pro',
      ],
    })
    app.save(record)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('site_settings'))
    } catch (_) {}
  },
)
