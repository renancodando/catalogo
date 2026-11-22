window.configuracaoEmpresa = {
  marca: { nome: "Alvarenga", subtitulo: "Escritório", inicial: "A" },
  nomeEmpresa: "Alvarenga Escritório",

  // deixe vazio até ter o número real (com DDI e DDD, só dígitos)
  whatsapp: "",
  mensagemPadrao: "Olá! Vim pelo site e gostaria de conhecer os serviços do escritório.",

  endereco: {
    rua: "Rua Exemplo, 000 — Sala 00",
    cidade: "Sua cidade — UF",
    referencia: "Endereço demonstrativo",
    linkMapa: "",
  },
  horarios: [
    ["Segunda a sexta", "08h às 18h"],
    ["Sábado e domingo", "Fechado"],
  ],
  email: "",

  inicio: {
    rotulo: "Soluções que organizam",
    tituloAntes: "Gestão, estratégia e resultado para o seu",
    tituloDestaque: "negócio.",
    descricao: "Apoio completo em rotinas administrativas, financeiras e organizacionais, com foco em eficiência e crescimento.",
    botaoPrincipal: "Conheça nossos serviços",
    botaoSecundario: "Ver apresentação",
    pilares: [
      ["camadas", "Organização", "Processos mais simples e produtivos."],
      ["barras", "Resultados", "Mais controle, clareza e desempenho."],
      ["escudo", "Confiança", "Atendimento próximo e personalizado."],
    ],
  },

  servicos: [
    { icone: "camadas", nome: "Rotinas administrativas", texto: "Organização de documentos, agendas, contratos e fluxos internos.", itens: ["Gestão de documentos", "Controle de contratos", "Padronização de processos"] },
    { icone: "moeda", nome: "Gestão financeira", texto: "Contas a pagar e receber, conciliação e relatórios para decidir com segurança.", itens: ["Fluxo de caixa", "Conciliação bancária", "Relatórios mensais"] },
    { icone: "barras", nome: "Planejamento estratégico", texto: "Metas, indicadores e acompanhamento para o negócio crescer com direção.", itens: ["Definição de metas", "Indicadores de desempenho", "Reuniões de acompanhamento"] },
    { icone: "pessoas", nome: "Apoio a equipes", texto: "Rotinas de pessoal organizadas e comunicação clara com o time.", itens: ["Admissões e rotinas", "Organização de escalas", "Treinamentos internos"] },
    { icone: "lupa", nome: "Diagnóstico organizacional", texto: "Análise do funcionamento atual para encontrar gargalos e oportunidades.", itens: ["Mapeamento de processos", "Pontos de melhoria", "Plano de ação"] },
    { icone: "escudo", nome: "Conformidade e prazos", texto: "Calendário de obrigações e controle de prazos para evitar surpresas.", itens: ["Agenda de obrigações", "Alertas de vencimento", "Arquivo organizado"] },
  ],

  sobre: {
    titulo: "Um escritório que trabalha junto com você.",
    texto: "A Alvarenga cuida da rotina que toma o seu tempo para que você possa se concentrar no que faz o negócio crescer. Cada cliente tem um responsável direto e acompanhamento contínuo.",
    pontos: ["Responsável dedicado", "Relatórios claros", "Processos documentados", "Sigilo e segurança"],
  },

  etapas: [
    ["Conversa inicial", "Entendemos a rotina, as dificuldades e os objetivos do seu negócio."],
    ["Diagnóstico", "Mapeamos processos e definimos prioridades com você."],
    ["Implantação", "Organizamos rotinas, ferramentas e responsáveis."],
    ["Acompanhamento", "Relatórios e reuniões periódicas para ajustar o caminho."],
  ],

  perguntas: [
    ["Vocês atendem empresas de qual porte?", "Defina aqui o perfil de clientes atendidos pelo escritório."],
    ["O atendimento é presencial ou online?", "Informe aqui as modalidades de atendimento oferecidas."],
    ["Como é feita a proposta?", "Após a conversa inicial, o escritório apresenta uma proposta com escopo, prazos e valores."],
    ["Posso contratar só um serviço?", "Sim. Os serviços podem ser contratados separadamente ou em conjunto."],
  ],

  animacao: {
    parallax: 1,
    brilhoAgua: 1,
    velocidadeOndas: 1,
  },
};
