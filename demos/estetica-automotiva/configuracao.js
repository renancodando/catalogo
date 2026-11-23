/* Tudo o que muda de uma empresa para outra fica aqui. */
window.configuracaoEmpresa = {
  marca: { nome: "RNCWEB", subtitulo: "Estética automotiva" },
  nomeEmpresa: "RNCWEB Estética Automotiva",

  // deixe vazio até ter o número real (com DDI e DDD, só dígitos, ex.: 5567999999999)
  whatsapp: "",
  mensagemPadrao: "Olá! Vim pelo site e gostaria de agendar um serviço.",

  endereco: { rua: "Rua Exemplo, 000 — Centro", cidade: "Sua cidade — UF", referencia: "Endereço demonstrativo", linkMapa: "" },
  horarios: [
    ["Segunda a sexta", "08h às 18h"],
    ["Sábado", "08h às 13h"],
    ["Domingo e feriados", "Fechado"],
  ],

  inicio: {
    rotulo: "Lava-jato & estética automotiva",
    tituloLinha1: "Seu carro",
    tituloLinha2: "no mais alto",
    tituloDestaque: "nível",
    descricao: "Limpeza profunda, proteção duradoura e\nestética de alto padrão para o seu veículo.",
    botaoPrincipal: "Agendar serviço",
    botaoSecundario: "Ver serviços",
    botaoTopo: "Agende agora",
    destaques: [
      ["escudo", "Proteção", "prolongada"],
      ["brilho", "Brilho", "intenso"],
      ["velocimetro", "Cuidado", "profissional"],
    ],
    cuidado: { titulo: "Nível de\ncuidado", porcentagem: 100, itens: ["Limpeza", "Proteção", "Estética"] },
  },

  servicos: [
    { icone: "gota", nome: "Lavagem\nPremium", resumo: "Lavagem detalhada com shampoo neutro, descontaminação e secagem sem riscos.", itens: ["Pré-lavagem com espuma ativa", "Rodas, caixas e frisos", "Secagem com microfibra"], duracao: "1h30" },
    { icone: "vento", nome: "Higienização\nInterna", resumo: "Aspiração, limpeza de bancos, carpetes, teto e saídas de ar.", itens: ["Extração de bancos e carpetes", "Painel e portas", "Eliminação de odores"], duracao: "3h" },
    { icone: "camadas", nome: "Polimento\nTécnico", resumo: "Correção de riscos superficiais e devolução do brilho original da pintura.", itens: ["Avaliação da pintura", "Corte e refino", "Lustro final"], duracao: "6h" },
    { icone: "escudo", nome: "Vitrificação\nde Pintura", resumo: "Camada de proteção que repele água e sujeira e realça o brilho.", itens: ["Descontaminação completa", "Aplicação em camadas", "Cura controlada"], duracao: "1 dia" },
    { icone: "brilho", nome: "Revitalização\nde Plásticos", resumo: "Recupera a cor dos plásticos externos e internos ressecados.", itens: ["Limpeza profunda", "Hidratação", "Proteção UV"], duracao: "1h" },
    { icone: "couro", nome: "Hidratação\nde Couro", resumo: "Limpeza e hidratação dos bancos de couro, mantendo maciez e cor.", itens: ["Limpeza com pH neutro", "Hidratação", "Proteção"], duracao: "2h" },
    { icone: "motor", nome: "Limpeza\nde Motor", resumo: "Limpeza técnica do cofre do motor com proteção dos componentes.", itens: ["Proteção elétrica", "Desengraxe seguro", "Acabamento"], duracao: "1h" },
    { icone: "vidro", nome: "Cristalização\nde Vidros", resumo: "Tratamento que faz a água escorrer e melhora a visibilidade na chuva.", itens: ["Descontaminação", "Aplicação", "Teste de repelência"], duracao: "1h" },
  ],

  planos: {
    rotulo: "Planos de cuidado",
    titulo: ["Escolha o cuidado", "ideal", "para o seu carro"],
    descricao: "Planos completos com benefícios exclusivos\npara manter seu veículo sempre impecável.",
    selo: "Mais escolhido",
    lista: [
      { icone: "folha", nome: "Essencial", texto: "Limpeza e cuidado\ndo dia a dia.", itens: ["Lavagem externa detalhada", "Aspiração interna", "Pretinho nos pneus"] },
      { icone: "diamante", nome: "Premium", texto: "Brilho, proteção\ne conservação.", destaque: true, itens: ["Tudo do Essencial", "Cera de proteção", "Higienização de painel e portas"] },
      { icone: "coroa", nome: "Completo", texto: "Estética total e\nmáximo desempenho.", itens: ["Tudo do Premium", "Polimento de brilho", "Revitalização de plásticos"] },
    ],
  },

  sobre: {
    titulo: "Cuidado de verdade, do primeiro jato ao último detalhe.",
    texto: "Produtos de linha profissional, processos sem riscos para a pintura e atendimento com hora marcada. Explicamos cada etapa e entregamos o carro pronto para rodar.",
    pontos: ["Produtos com procedência", "Equipe treinada", "Hora marcada, sem fila"],
  },

  animacao: { agua: 1, gotas: 1, farois: 1 },
};
