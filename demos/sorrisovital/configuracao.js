window.configuracaoEmpresa = {
  marca: { prefixo: "Clínica", nome: "Sorriso", destaque: "Vital" },
  nomeEmpresa: "Clínica SorrisoVital",

  // número com DDI e DDD, só dígitos; vazio mostra o aviso de demonstração
  whatsapp: "",
  mensagemPadrao: "Olá! Vim pelo site da Clínica SorrisoVital.",

  responsavelTecnico: "Informe aqui o responsável técnico e o número de registro no conselho",

  endereco: {
    rua: "Rua Exemplo, 000 — Sala 00",
    cidade: "Sua cidade — UF",
    referencia: "Endereço demonstrativo",
    linkMapa: "",
  },
  horarios: [
    ["Segunda a sexta", "08h às 19h"],
    ["Sábado", "08h às 12h"],
  ],

  inicio: {
    rotulo: "Saúde bucal e confiança",
    tituloAntes: "Cuidamos do seu",
    tituloDestaque: "sorriso",
    tituloDepois: "em todas",
    tituloFim: "as fases da vida",
    descricao:
      "Tratamentos odontológicos completos, com tecnologia, conforto e um atendimento humanizado para você sorrir com mais saúde e segurança.",
    botaoPrincipal: "Agendar avaliação",
    botaoSecundario: "Conheça os tratamentos",
    diferenciais: [
      ["escudo", "Atendimento", "Humanizado"],
      ["dente", "Tratamentos", "Completos"],
      ["agenda", "Agendamento", "Rápido e Fácil"],
    ],
  },

  tratamentos: [
    {
      chave: "geral",
      nome: "Clínica geral",
      resumo: "Consultas de rotina, limpeza, restaurações e prevenção para manter a saúde da boca em dia.",
      itens: ["Avaliação e plano de tratamento", "Limpeza e profilaxia", "Restaurações", "Orientação de higiene"],
    },
    {
      chave: "implantes",
      nome: "Implantes",
      resumo: "Reposição de dentes perdidos com planejamento individual e acompanhamento em cada etapa.",
      itens: ["Avaliação com exames de imagem", "Planejamento do implante", "Prótese sobre implante", "Acompanhamento pós-procedimento"],
    },
    {
      chave: "ortodontia",
      nome: "Ortodontia",
      resumo: "Alinhamento dos dentes e correção da mordida com aparelhos fixos ou alinhadores.",
      itens: ["Aparelhos fixos", "Alinhadores transparentes", "Manutenções periódicas", "Contenção após o tratamento"],
    },
    {
      chave: "estetica",
      nome: "Estética dental",
      resumo: "Procedimentos para a cor e a forma dos dentes, sempre após avaliação clínica.",
      itens: ["Clareamento supervisionado", "Facetas e lentes", "Restaurações estéticas", "Planejamento do sorriso"],
    },
  ],

  fases: [
    { nome: "Infância", idade: "0 a 12 anos", texto: "Primeira consulta, prevenção de cáries e acompanhamento da troca dos dentes, com uma experiência tranquila para a criança." },
    { nome: "Adolescência", idade: "13 a 19 anos", texto: "Avaliação ortodôntica, orientação de higiene com aparelho e cuidados com dentes do siso." },
    { nome: "Vida adulta", idade: "20 a 59 anos", texto: "Rotina preventiva, tratamentos restauradores, estética e reabilitação quando necessário." },
    { nome: "Maturidade", idade: "60 anos ou mais", texto: "Cuidado com gengivas, próteses e implantes para manter conforto ao mastigar e falar." },
  ],

  sobre: {
    titulo: "Um consultório pensado para você se sentir à vontade.",
    texto:
      "A SorrisoVital une tecnologia e escuta atenta. Cada tratamento começa por uma avaliação cuidadosa, com explicação clara das opções, prazos e cuidados envolvidos.",
    pontos: [
      ["Escuta antes do tratamento", "Você entende cada etapa e decide com segurança."],
      ["Biossegurança rigorosa", "Instrumentais esterilizados e protocolos de controle."],
      ["Conforto na cadeira", "Ambiente acolhedor e atendimento sem pressa."],
    ],
  },

  diferenciais: [
    ["escudo", "Atendimento humanizado", "Tempo para ouvir, explicar e acolher cada paciente."],
    ["dente", "Tratamentos completos", "Prevenção, estética e reabilitação no mesmo lugar."],
    ["agenda", "Agendamento fácil", "Marque sua avaliação em poucos passos pelo WhatsApp."],
    ["brilho", "Tecnologia a favor do conforto", "Equipamentos que tornam o atendimento mais preciso."],
  ],

  perguntas: [
    ["A primeira avaliação é paga?", "Informe aqui a política da clínica para a primeira consulta."],
    ["Atendem convênios?", "Liste aqui os convênios aceitos ou informe que o atendimento é particular."],
    ["Atendem crianças?", "Descreva aqui a partir de qual idade a clínica atende e como é a primeira consulta infantil."],
    ["Quanto tempo dura um tratamento ortodôntico?", "Depende de cada caso e é definido após a avaliação clínica."],
    ["Como funciona o agendamento?", "Você envia o pedido pelo site ou WhatsApp e a clínica confirma data e horário."],
  ],

  animacao: {
    velocidadeOrbita: 1,
    balancoDente: 1,
    intensidadeBrilho: 1,
    parallax: 1,
    velocidadeOndas: 1,
  },
};
