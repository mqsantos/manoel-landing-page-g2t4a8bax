import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type Lang = 'pt' | 'en'

const STORAGE_KEY = 'manoel-site-lang'

/** Frases fixas da interface — PT-BR (padrão). */
const pt: Record<string, string> = {
  // Navbar
  'nav.inicio': 'Início',
  'nav.conteudos': 'Conteúdos',
  'nav.planos': 'Planos',
  'nav.entrar': 'Entrar',
  'nav.criarConta': 'Criar conta',
  'nav.meuPerfil': 'Meu Perfil',
  'nav.painel': 'Painel',
  'nav.estatisticas': 'Estatísticas',
  'nav.sair': 'Sair',
  'nav.menu': 'Menu',
  // Comum
  'common.loading': 'Carregando...',
  'common.save': 'Salvar Alterações',
  'common.saving': 'Salvando...',
  'common.cancel': 'Cancelar',
  'common.delete': 'Excluir',
  'common.edit': 'Editar',
  'common.error': 'Erro',
  'common.email': 'E-mail',
  'common.password': 'Senha',
  'common.name': 'Nome',
  'common.optional': 'opcional',
  'common.gratis': 'Grátis',
  'common.premium': 'Premium',
  'common.ver': 'Ver página pública',
  // Login
  'login.title': 'Entrar na plataforma',
  'login.subtitle': 'Acesse sua conta para ver os conteúdos premium.',
  'login.submit': 'Entrar',
  'login.loading': 'Entrando...',
  'login.noAccount': 'Ainda não tem conta?',
  'login.criarConta': 'Criar conta gratuita',
  'login.erro': 'Erro ao entrar',
  // Cadastro
  'register.title': 'Criar conta gratuita',
  'register.subtitle': 'Registre-se para acompanhar os conteúdos abertos.',
  'register.name': 'Nome completo',
  'register.submit': 'Criar conta',
  'register.loading': 'Criando conta...',
  'register.hasAccount': 'Já tem conta?',
  'register.entrar': 'Entrar',
  'register.erro': 'Erro ao criar conta',
  // Conteúdos (lista)
  'contents.title': 'Acervo de Conteúdos',
  'contents.subtitle': 'Artigos, masterclasses, áudios e templates sobre Lean e Engenharia.',
  'contents.search': 'Buscar conteúdo...',
  'contents.todos': 'Todos',
  'contents.artigo': 'Artigos',
  'contents.video': 'Vídeos',
  'contents.audio': 'Áudios',
  'contents.pdf': 'PDFs',
  'contents.vazio': 'Nenhum conteúdo encontrado.',
  'contents.premium': 'Premium',
  'contents.ler': 'Ler agora',
  'contents.assitir': 'Assistir agora',
  'contents.ouvir': 'Ouvir agora',
  'contents.baixar': 'Baixar agora',
  'contents.verTodos': 'Ver todos os conteúdos',
  'contents.loading': 'Carregando acervo...',
  // Conteúdo (detalhe)
  'detail.voltar': 'Voltar aos conteúdos',
  'detail.tempo': 'leitura',
  'detail.registreInteresse': 'Registrar interesse',
  'detail.criarConta': 'Criar conta gratuita',
  'detail.entrar': 'Entrar para acessar',
  'detail.premiumCadeado': 'Conteúdo premium',
  'detail.interesseOk': 'Interesse registrado!',
  'detail.erro': 'Erro ao carregar o conteúdo',
  // Planos
  'plans.interesse': 'Registrar Interesse',
  'plans.enviando': 'Enviando...',
  'plans.sucesso': 'Interesse registrado! Em breve entraremos em contato.',
  'plans.erro': 'Erro ao registrar interesse. Tente novamente.',
  'plans.fechar': 'Fechar',
  'plans.nome': 'Seu nome',
  'plans.seuEmail': 'Seu e-mail',
  'plans.notas': 'Observações',
  'plans.notasPlaceholder': 'Conte brevemente o que você procura (opcional)',
  'plans.plano': 'Plano',
  // Painel do Dono
  'painel.title': 'Painel do Dono',
  'painel.subtitle':
    'Gerencie vídeos, áudios, PDFs e artigos. Defina o que é grátis e o que pertence à área premium.',
  'painel.verEstatisticas': 'Ver Estatísticas & Leads',
  'painel.novoConteudo': 'Novo Conteúdo',
  'painel.tituloTipo': 'Título & Tipo',
  'painel.status': 'Status / Acesso',
  'painel.duracao': 'Duração / Leitura',
  'painel.visualizacoes': 'Visualizações',
  'painel.acoes': 'Ações',
  'painel.carregando': 'Carregando acervo...',
  'painel.vazio': 'Nenhum conteúdo cadastrado',
  'painel.cadastrarPrimeiro': 'Cadastrar primeiro conteúdo',
  'painel.editarConteudo': 'Editar Conteúdo',
  'painel.novoConteudoTitle': 'Publicar Novo Conteúdo',
  'painel.descricaoDialog':
    'Preencha os dados do material. Você pode anexar arquivos ou inserir links externos como YouTube e Spotify.',
  'painel.tituloConteudo': 'Título do Conteúdo',
  'painel.formato': 'Formato',
  'painel.selecioneTipo': 'Selecione o tipo',
  'painel.tipoArtigo': 'Artigo / Ensaio',
  'painel.tipoVideo': 'Vídeo',
  'painel.tipoAudio': 'Áudio / Podcast',
  'painel.tipoPdf': 'Documento PDF',
  'painel.slug': 'Slug (URL amigável)',
  'painel.nivelAcesso': 'Nível de Acesso (Freemium)',
  'painel.gratisAberto': 'Grátis (Aberto a todos)',
  'painel.premiumCadeado': 'Premium (Com cadeado & prévia)',
  'painel.resumo': 'Resumo / Descrição Curta',
  'painel.corpo': 'Corpo do Texto / Notas da Aula (Markdown ou Texto Corrido)',
  'painel.duracaoLeitura': 'Duração ou Tempo de Leitura',
  'painel.tags': 'Tags (separadas por vírgula)',
  'painel.linkExterno': 'Link Externo (YouTube, Spotify, etc)',
  'painel.upload': 'Upload de Arquivo (PDF, Áudio ou Vídeo)',
  'painel.publicar': 'Publicar Conteúdo',
  'painel.salvarAlteracoes': 'Salvar Alterações',
  'painel.erroCarregar': 'Erro ao carregar',
  'painel.erroCarregarDesc': 'Não foi possível carregar os conteúdos.',
  'painel.camposObrigatorios': 'Campos obrigatórios',
  'painel.camposObrigatoriosDesc': 'Preencha título e slug do conteúdo.',
  'painel.atualizado': 'Conteúdo atualizado!',
  'painel.atualizadoDesc': 'As alterações foram salvas.',
  'painel.publicado': 'Conteúdo publicado!',
  'painel.publicadoDesc': 'O novo material já está disponível no catálogo.',
  'painel.erroSalvar': 'Erro ao salvar conteúdo',
  'painel.erroSalvarDesc': 'Verifique se o slug é único.',
  'painel.removido': 'Conteúdo removido',
  'painel.removidoDesc': 'O item foi excluído com sucesso.',
  'painel.erroExcluir': 'Erro ao excluir',
  'painel.erroExcluirDesc': 'Tente novamente.',
  'painel.confirmarExcluir': 'Deseja realmente remover o conteúdo',
  'painel.acessoRestrito': 'Acesso Restrito ao Dono',
  'painel.acessoRestritoDesc':
    'Esta área é restrita a Manoel Santos (mqsantos@gmail.com). Faça login com a conta de proprietário para gerenciar conteúdos.',
  'painel.entrarComoDono': 'Entrar como Dono',
  // Estatísticas
  'stats.title': 'Estatísticas & Métricas de Conversão',
  'stats.subtitle':
    'Acompanhe visitas por página, consumo de conteúdos e interesses registrados para os planos pagos.',
  'stats.painelConteudos': 'Painel de Conteúdos',
  'stats.visitasSite': 'Visitas ao Site',
  'stats.visitasSiteDesc': 'Total de páginas visualizadas',
  'stats.consumo': 'Consumo de Conteúdo',
  'stats.consumoDesc': 'Leituras, áudios e vídeos iniciados',
  'stats.interesses': 'Interesses em Planos',
  'stats.interessesDesc': 'Leads qualificados para assinatura',
  'stats.acervo': 'Acervo Publicado',
  'stats.acervoDesc': 'Itens disponíveis no catálogo',
  'stats.leadsTitle': 'Interesses Registrados nos Planos',
  'stats.leadsSubtitle':
    'Usuários que clicaram em "Quero assinar" e registraram nome, e-mail e plano desejado.',
  'stats.nome': 'Nome',
  'stats.planoEscolhido': 'Plano Escolhido',
  'stats.notas': 'Notas / Interesse',
  'stats.data': 'Data',
  'stats.carregandoLeads': 'Carregando leads...',
  'stats.semLeads': 'Nenhum interesse registrado até o momento.',
  'stats.paginasVisitadas': 'Páginas Mais Visitadas',
  'stats.paginaInicial': '/ (Página Inicial)',
  'stats.visitas': 'visitas',
  'stats.semVisitas': 'Nenhuma visita registrada ainda.',
  'stats.consumoFormato': 'Consumo por Formato de Conteúdo',
  'stats.visualizacoes': 'visualizações',
  'stats.semConsumo': 'Nenhum consumo registrado ainda.',
  'stats.proMensal': 'Pro Mensal',
  'stats.proAnual': 'Pro Anual',
  'stats.mentoria': 'Mentoria 1-on-1',
  'stats.hoje': 'Hoje',
  // Editor do site (Painel do Dono → Editar site)
  'editor.title': 'Editar site',
  'editor.badge': 'Início, Planos & Rodapé',
  'editor.subtitle':
    'Edite os textos das páginas Início e Planos & Assinatura e do rodapé. Ao salvar, as mudanças aparecem imediatamente no site.',
  'editor.naoSalvo':
    'Há alterações não salvas. Clique em "Salvar Alterações" para publicá-las no site.',
  'editor.tabInicio': 'Página Início',
  'editor.tabPlanos': 'Página Planos',
  'editor.tabRodape': 'Rodapé',
  'editor.carregando': 'Carregando configurações do site...',
  'editor.sucesso': 'Site atualizado!',
  'editor.sucessoDesc': 'Os textos já estão no ar nas páginas Início e Planos.',
  'editor.erro': 'Erro ao salvar',
  'editor.erroDesc': 'Não foi possível salvar as configurações. Tente novamente.',
  'editor.camposObrigatorios': 'Campos obrigatórios',
  'editor.camposObrigatoriosDesc': 'Preencha ao menos o título principal e a bio da página Início.',
  // Seletor de idioma
  'lang.label': 'Idioma',
  'lang.pt': 'Português',
  'lang.en': 'English',
}

/** English translations (second language). */
const en: Record<string, string> = {
  'nav.inicio': 'Home',
  'nav.conteudos': 'Content',
  'nav.planos': 'Plans',
  'nav.entrar': 'Sign in',
  'nav.criarConta': 'Create account',
  'nav.meuPerfil': 'My Profile',
  'nav.painel': 'Owner Panel',
  'nav.estatisticas': 'Statistics',
  'nav.sair': 'Sign out',
  'nav.menu': 'Menu',
  'common.loading': 'Loading...',
  'common.save': 'Save Changes',
  'common.saving': 'Saving...',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.error': 'Error',
  'common.email': 'Email',
  'common.password': 'Password',
  'common.name': 'Name',
  'common.optional': 'optional',
  'common.gratis': 'Free',
  'common.premium': 'Premium',
  'common.ver': 'View public page',
  'login.title': 'Sign in',
  'login.subtitle': 'Access your account to view premium content.',
  'login.submit': 'Sign in',
  'login.loading': 'Signing in...',
  'login.noAccount': "Don't have an account yet?",
  'login.criarConta': 'Create a free account',
  'login.erro': 'Sign-in error',
  'register.title': 'Create a free account',
  'register.subtitle': 'Register to follow the open content.',
  'register.name': 'Full name',
  'register.submit': 'Create account',
  'register.loading': 'Creating account...',
  'register.hasAccount': 'Already have an account?',
  'register.entrar': 'Sign in',
  'register.erro': 'Error creating account',
  'contents.title': 'Content Library',
  'contents.subtitle': 'Articles, masterclasses, audio and templates about Lean and Engineering.',
  'contents.search': 'Search content...',
  'contents.todos': 'All',
  'contents.artigo': 'Articles',
  'contents.video': 'Videos',
  'contents.audio': 'Audio',
  'contents.pdf': 'PDFs',
  'contents.vazio': 'No content found.',
  'contents.premium': 'Premium',
  'contents.ler': 'Read now',
  'contents.assitir': 'Watch now',
  'contents.ouvir': 'Listen now',
  'contents.baixar': 'Download now',
  'contents.verTodos': 'View all content',
  'contents.loading': 'Loading library...',
  'detail.voltar': 'Back to content',
  'detail.tempo': 'read',
  'detail.registreInteresse': 'Register interest',
  'detail.criarConta': 'Create a free account',
  'detail.entrar': 'Sign in to access',
  'detail.premiumCadeado': 'Premium content',
  'detail.interesseOk': 'Interest registered!',
  'detail.erro': 'Error loading content',
  'plans.interesse': 'Register Interest',
  'plans.enviando': 'Sending...',
  'plans.sucesso': 'Interest registered! We will contact you soon.',
  'plans.erro': 'Error registering interest. Please try again.',
  'plans.fechar': 'Close',
  'plans.nome': 'Your name',
  'plans.seuEmail': 'Your email',
  'plans.notas': 'Notes',
  'plans.notasPlaceholder': 'Briefly tell us what you are looking for (optional)',
  'plans.plano': 'Plan',
  'painel.title': 'Owner Panel',
  'painel.subtitle':
    'Manage videos, audio, PDFs and articles. Define what is free and what belongs to the premium area.',
  'painel.verEstatisticas': 'View Statistics & Leads',
  'painel.novoConteudo': 'New Content',
  'painel.tituloTipo': 'Title & Type',
  'painel.status': 'Status / Access',
  'painel.duracao': 'Duration / Read',
  'painel.visualizacoes': 'Views',
  'painel.acoes': 'Actions',
  'painel.carregando': 'Loading library...',
  'painel.vazio': 'No content registered',
  'painel.cadastrarPrimeiro': 'Register first content',
  'painel.editarConteudo': 'Edit Content',
  'painel.novoConteudoTitle': 'Publish New Content',
  'painel.descricaoDialog':
    'Fill in the material details. You can attach files or insert external links such as YouTube and Spotify.',
  'painel.tituloConteudo': 'Content Title',
  'painel.formato': 'Format',
  'painel.selecioneTipo': 'Select the type',
  'painel.tipoArtigo': 'Article / Essay',
  'painel.tipoVideo': 'Video',
  'painel.tipoAudio': 'Audio / Podcast',
  'painel.tipoPdf': 'PDF Document',
  'painel.slug': 'Slug (friendly URL)',
  'painel.nivelAcesso': 'Access Level (Freemium)',
  'painel.gratisAberto': 'Free (Open to everyone)',
  'painel.premiumCadeado': 'Premium (With lock & preview)',
  'painel.resumo': 'Summary / Short Description',
  'painel.corpo': 'Body Text / Lesson Notes (Markdown or plain text)',
  'painel.duracaoLeitura': 'Duration or Reading Time',
  'painel.tags': 'Tags (comma separated)',
  'painel.linkExterno': 'External Link (YouTube, Spotify, etc)',
  'painel.upload': 'File Upload (PDF, Audio or Video)',
  'painel.publicar': 'Publish Content',
  'painel.salvarAlteracoes': 'Save Changes',
  'painel.erroCarregar': 'Error loading',
  'painel.erroCarregarDesc': 'Could not load the contents.',
  'painel.camposObrigatorios': 'Required fields',
  'painel.camposObrigatoriosDesc': 'Fill in the content title and slug.',
  'painel.atualizado': 'Content updated!',
  'painel.atualizadoDesc': 'The changes have been saved.',
  'painel.publicado': 'Content published!',
  'painel.publicadoDesc': 'The new material is now available in the library.',
  'painel.erroSalvar': 'Error saving content',
  'painel.erroSalvarDesc': 'Check that the slug is unique.',
  'painel.removido': 'Content removed',
  'painel.removidoDesc': 'The item was successfully deleted.',
  'painel.erroExcluir': 'Error deleting',
  'painel.erroExcluirDesc': 'Please try again.',
  'painel.confirmarExcluir': 'Do you really want to remove the content',
  'painel.acessoRestrito': 'Owner-Only Access',
  'painel.acessoRestritoDesc':
    'This area is restricted to Manoel Santos (mqsantos@gmail.com). Sign in with the owner account to manage content.',
  'painel.entrarComoDono': 'Sign in as Owner',
  'stats.title': 'Statistics & Conversion Metrics',
  'stats.subtitle':
    'Track page views, content consumption and registered interests for the paid plans.',
  'stats.painelConteudos': 'Content Panel',
  'stats.visitasSite': 'Site Visits',
  'stats.visitasSiteDesc': 'Total pages viewed',
  'stats.consumo': 'Content Consumption',
  'stats.consumoDesc': 'Reads, audio and videos started',
  'stats.interesses': 'Plan Interests',
  'stats.interessesDesc': 'Qualified leads for subscription',
  'stats.acervo': 'Published Library',
  'stats.acervoDesc': 'Items available in the catalog',
  'stats.leadsTitle': 'Registered Plan Interests',
  'stats.leadsSubtitle':
    'Users who clicked "I want to subscribe" and provided name, email and desired plan.',
  'stats.nome': 'Name',
  'stats.planoEscolhido': 'Chosen Plan',
  'stats.notas': 'Notes / Interest',
  'stats.data': 'Date',
  'stats.carregandoLeads': 'Loading leads...',
  'stats.semLeads': 'No interest registered yet.',
  'stats.paginasVisitadas': 'Most Visited Pages',
  'stats.paginaInicial': '/ (Home Page)',
  'stats.visitas': 'views',
  'stats.semVisitas': 'No visits registered yet.',
  'stats.consumoFormato': 'Consumption by Content Format',
  'stats.visualizacoes': 'views',
  'stats.semConsumo': 'No consumption registered yet.',
  'stats.proMensal': 'Pro Monthly',
  'stats.proAnual': 'Pro Annual',
  'stats.mentoria': '1-on-1 Mentoring',
  'stats.hoje': 'Today',
  'editor.title': 'Edit site',
  'editor.badge': 'Home, Plans & Footer',
  'editor.subtitle':
    'Edit the texts of the Home and Plans pages and the footer. When you save, changes appear immediately on the site.',
  'editor.naoSalvo': 'You have unsaved changes. Click "Save Changes" to publish them to the site.',
  'editor.tabInicio': 'Home Page',
  'editor.tabPlanos': 'Plans Page',
  'editor.tabRodape': 'Footer',
  'editor.carregando': 'Loading site settings...',
  'editor.sucesso': 'Site updated!',
  'editor.sucessoDesc': 'The texts are already live on the Home and Plans pages.',
  'editor.erro': 'Error saving',
  'editor.erroDesc': 'Could not save the settings. Please try again.',
  'editor.camposObrigatorios': 'Required fields',
  'editor.camposObrigatoriosDesc': 'Fill in at least the main headline and the Home page bio.',
  'lang.label': 'Language',
  'lang.pt': 'Português',
  'lang.en': 'English',
}

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  /** Traduz uma frase fixa da interface; chaves desconhecidas voltam ao PT. */
  t: (key: string, vars?: Record<string, string | number>) => string
}

const LangContext = createContext<LangContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved === 'en' || saved === 'pt') return saved
    } catch {
      /* localStorage indisponível — usa o padrão */
    }
    return 'pt'
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignora */
    }
  }, [lang])

  const setLang = useCallback((l: Lang) => setLangState(l), [])

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let text = (lang === 'en' ? en[key] : undefined) ?? pt[key] ?? key
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.replaceAll(`{${name}}`, String(value))
        }
      }
      return text
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLanguage(): LangContextValue {
  const ctx = useContext(LangContext)
  if (ctx) return ctx
  // Fora do provider (testes): PT, sem troca.
  return { lang: 'pt', setLang: () => {}, t: (key) => pt[key] ?? key }
}
