migrate(
  (app) => {
    // 1. Seed Manoel Santos admin user
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'mqsantos@gmail.com')
    } catch (_) {
      const adminRecord = new Record(users)
      adminRecord.setEmail('mqsantos@gmail.com')
      adminRecord.setPassword('Skip@Pass')
      adminRecord.setVerified(true)
      adminRecord.set('name', 'Manoel Santos')
      app.save(adminRecord)
    }

    // 2. Seed realistic contents for Manoel Santos
    const contents = app.findCollectionByNameOrId('contents')

    const sampleContents = [
      {
        title:
          'The Lean Developer: Princípios Ágeis aplicados ao Desenvolvimento de Produtos Complexos',
        slug: 'the-lean-developer-principios-agels',
        type: 'article',
        description:
          'Como conectar os princípios do Lean Product and Process Development (LPPD) à engenharia moderna de software e sistemas aeronáuticos.',
        content_body: `# The Lean Developer: Da Teoria dos 20 Anos de Indústria à Prática Diária

Durante duas décadas na Embraer e na minha atuação como Systems Engineering Manager na Boeing, um padrão sempre se repetiu: **desperdício não é apenas retrabalho de código ou de montagem; o maior desperdício é desenvolver com extrema excelência algo que ninguém precisa ou que falha na integração.**

## Os 4 Pilares do Lean Product & Process Development (LPPD)

1. **Pessoas em Primeiro Lugar**: Engenheiros motivados e capacitados com ownership de suas decisões de arquitetura.
2. **Entendimento Profundo do Contexto**: Ir ao *Gemba* — no desenvolvimento de sistemas, o Gemba é a integração contínua, os testes de bancada e o feedback direto das operações de voo.
3. **Fluxo Contínuo de Conhecimento**: Antes de congelar especificações prematuras, exploramos *Set-Based Concurrent Engineering* (SBCE) — mantendo alternativas abertas até que os trade-offs fiquem evidentes.
4. **Resolução Sistemática de Problemas (A3)**: Todo problema de engenharia merece uma hipótese clara, medição sem preconceitos e ações de causa-raiz.

## A ponte entre Lean e Sistemas Aeronáuticos
Quando projetamos aeronaves civis e militares, tolerâncias são milimétricas e a segurança é inegociável. Aplicar Lean significa eliminar silos entre a engenharia de requisitos, testes de voo e manufatura.`,
        is_premium: false,
        external_url: 'https://www.linkedin.com/in/manoelsantos/',
        duration_or_read_time: '7 min de leitura',
        tags: 'Lean, Engenharia de Sistemas, LPPD, Cultura',
        views_count: 142,
      },
      {
        title:
          'The Augmented Engineer: Como a Inteligência Artificial Transforma a Engenharia de Sistemas',
        slug: 'the-augmented-engineer-ia-engenharia',
        type: 'article',
        description:
          'Uma análise aprofundada sobre como modelos de linguagem e automação generativa potencializam requisitos, rastreabilidade e arquitetura de sistemas.',
        content_body: `# The Augmented Engineer: IA Generativa na Engenharia Crítica

Não seremos substituídos pela inteligência artificial. O engenheiro tradicional será substituído pelo engenheiro que domina ferramentas de IA para acelerar a validação de arquiteturas complexas.

## O que muda na prática?
- **Rastreabilidade de Requisitos em Tempo Real**: Cruzamento de dezenas de milhares de requisitos normativos (ARP4754, DO-178C) com modelos SysML e especificações funcionais.
- **Detecção Precoce de Ambiguidade**: LLMs treinados identificando inconsistências em declarações de requisitos antes do design review.
- **Síntese de Casos de Teste**: Geração assistida de matrizes de cobertura e cenários de falha extrema (*corner cases*).

### A Sabedoria Humana Permanece Suprema
A inteligência artificial propõe, sintetiza e automatiza o trabalho braçal. A responsabilidade técnica, a ética de segurança de voo e a decisão crítica permanecem estritamente humanas.`,
        is_premium: false,
        external_url: 'https://www.linkedin.com/in/manoelsantos/',
        duration_or_read_time: '9 min de leitura',
        tags: 'Inteligência Artificial, Sistemas Críticos, Model-Based Systems Engineering',
        views_count: 215,
      },
      {
        title:
          'Masterclass em Vídeo: Como Implementar Lean Product Development em Equipes de Alta Tecnologia',
        slug: 'masterclass-video-lean-product-development',
        type: 'video',
        description:
          'Aula completa gravada de 45 minutos detalhando a transição cultural, cadência de entregas e os erros mais comuns na liderança técnica.',
        content_body: `Nesta aula especial gravada para a nossa comunidade, Manoel Santos compartilha os bastidores da liderança de transformação Lean em duas das maiores empresas aeroespaciais do planeta.

Conteúdos da aula:
- Estruturação de Obeya (War Room) física e digital para equipes remotas globais
- Gestão visual de gargalos técnicos em projetos de múltiplos anos
- Como vencer a burocracia sem abrir mão de rigor técnico e conformidade regulatória`,
        is_premium: true,
        external_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_or_read_time: '45 min',
        tags: 'Vídeo, Liderança, Lean Transformation, Gestão',
        views_count: 88,
      },
      {
        title: 'Podcast Episódio 01: 20 Anos de Embraer, Desafios na Boeing e o Futuro da Aviação',
        slug: 'podcast-ep01-trajetoria-embraer-boeing',
        type: 'audio',
        description:
          'Conversa em áudio com Manoel Santos sobre sua trajetória desde o M.Sc. em Engenharia Mecânica até a liderança de sistemas na Boeing.',
        content_body: `Neste episódio inaugural, Manoel discute lições aprendidas em mais de duas décadas de liderança na Embraer e sua perspectiva atual na Boeing.

Tópicos abordados:
- O início da carreira e o foco em Lean Manufacturing vs Lean Product Development
- Diferenças entre projetar aeronaves comerciais e jatos executivos
- Como manter a excelência técnica sob prazos desafiadores
- Dicas para novos engenheiros que almejam cargos globais de liderança`,
        is_premium: false,
        external_url: 'https://open.spotify.com',
        duration_or_read_time: '32 min de áudio',
        tags: 'Podcast, Carreira, Aviação, Liderança',
        views_count: 178,
      },
      {
        title: 'Guia Completo em PDF: Framework A3 para Resolução de Problemas em Engenharia',
        slug: 'guia-pdf-framework-a3-engenharia',
        type: 'pdf',
        description:
          'Template pronto e guia passo a passo em PDF para conduzir reuniões e documentar resolução de problemas técnicos usando metodologia A3 Lean.',
        content_body: `O relatório A3 é muito mais do que uma folha de papel: é uma disciplina de raciocínio estruturado criada na Toyota e refinada nos ambientes aeroespaciais mais exigentes.

Este guia prático inclui:
- Definição do Problema e Contexto com métricas mensuráveis
- Diagrama de Ishikawa e os 5 Porquês aplicados à engenharia
- Plano de Contramedidas com matriz RACI
- Checklists de validação e acompanhamento de causa-raiz`,
        is_premium: true,
        external_url: 'https://www.adobe.com/br/acrobat/online/pdf-to-word.html',
        duration_or_read_time: '24 páginas',
        tags: 'PDF, Template, Metodologia A3, Prático',
        views_count: 95,
      },
      {
        title: 'Podcast Episódio 02: O Papel do Systems Engineering Manager em Projetos Globais',
        slug: 'podcast-ep02-papel-systems-engineering-manager',
        type: 'audio',
        description:
          'Áudio exclusivo dissecando as habilidades necessárias para liderar times multidisciplinares distribuídos entre Estados Unidos e Brasil.',
        content_body: `Gestão de engenharia de sistemas em nível global exige alinhamento de fuso horários, expectativas culturais e clareza absoluta de interfaces. Manoel detalha seu checklist diário de coordenação.`,
        is_premium: true,
        external_url: 'https://open.spotify.com',
        duration_or_read_time: '28 min de áudio',
        tags: 'Podcast, Global Teams, Gestão, Boeing',
        views_count: 64,
      },
    ]

    for (const item of sampleContents) {
      try {
        app.findFirstRecordByData('contents', 'slug', item.slug)
        continue
      } catch (_) {}

      const record = new Record(contents)
      record.set('title', item.title)
      record.set('slug', item.slug)
      record.set('type', item.type)
      record.set('description', item.description)
      record.set('content_body', item.content_body)
      record.set('is_premium', item.is_premium)
      record.set('external_url', item.external_url)
      record.set('duration_or_read_time', item.duration_or_read_time)
      record.set('tags', item.tags)
      record.set('views_count', item.views_count)
      app.save(record)
    }

    // 3. Seed sample plan interests for demonstration in Owner Panel
    const planInterests = app.findCollectionByNameOrId('plan_interests')
    const sampleInterests = [
      {
        name: 'Carlos Eduardo Mendes',
        email: 'carlos.mendes@aeroeng.com.br',
        plan: 'pro_anual',
        notes: 'Muito interessado no acesso completo aos guias em PDF e masterclasses.',
      },
      {
        name: 'Juliana Ferreira Rocha',
        email: 'juliana.rocha@techcorp.io',
        plan: 'pro_mensal',
        notes: 'Quero aplicar Lean no desenvolvimento da nossa startup de hardware.',
      },
      {
        name: 'Rodrigo Silveira',
        email: 'rodrigo.silveira@embraer.com.br',
        plan: 'mentoria',
        notes: 'Gostaria de agendar mentoria executiva para nosso time de Systems Engineering.',
      },
    ]

    for (const item of sampleInterests) {
      try {
        app.findFirstRecordByData('plan_interests', 'email', item.email)
        continue
      } catch (_) {}

      const record = new Record(planInterests)
      record.set('name', item.name)
      record.set('email', item.email)
      record.set('plan', item.plan)
      record.set('notes', item.notes)
      app.save(record)
    }

    // 4. Seed some initial site views and content views for stats
    const siteViews = app.findCollectionByNameOrId('site_views')
    const initialPaths = [
      '/',
      '/',
      '/conteudos',
      '/conteudos',
      '/planos',
      '/',
      '/conteudos/the-lean-developer-principios-agels',
    ]
    for (const path of initialPaths) {
      const record = new Record(siteViews)
      record.set('path', path)
      record.set('referrer', 'direct')
      record.set('user_agent', 'Mozilla/5.0')
      app.save(record)
    }
  },
  (app) => {
    // rollback logic if needed
  },
)
