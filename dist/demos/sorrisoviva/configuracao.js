window.configuracaoEmpresa = {
  marca: { inicio: "Sorriso", destaque: "Viva", subtitulo: "Odontologia" },
  nomeEmpresa: "SorrisoViva Odontologia",

  // deixe vazio até ter o número real (com DDI e DDD, só dígitos)
  whatsapp: "",
  mensagemPadrao: "Olá! Vim pelo site e gostaria de agendar uma avaliação.",

  endereco: {
    rua: "Rua Exemplo, 000 — Centro",
    cidade: "Sua cidade — UF",
    referencia: "Endereço demonstrativo",
    linkMapa: "",
  },
  horarios: [
    ["Segunda a sexta", "08h às 19h"],
    ["Sábado", "08h às 12h"],
    ["Domingo e feriados", "Fechado"],
  ],
  email: "",
  responsavelTecnico: "Informe aqui o responsável técnico e o número de registro no conselho",

  inicio: {
    rotulo: "Odontologia moderna",
    tituloLinha1: "Cuidado",
    tituloLinha2: "com o seu",
    tituloDestaque: "sorriso",
    descricao: "Tratamentos completos, tecnologia\navançada e um atendimento\nhumanizado para você sorrir\ncom mais confiança.",
    botaoPrincipal: "Agende sua consulta",
    botaoSecundario: ["Conheça", "nossa clínica"],
    chamadaFinal: ["Agende agora", "sua avaliação"],
    garantias: [
      ["escudo", "Segurança", "em cada procedimento"],
      ["cubo", "Tecnologia", "de última geração"],
      ["coracao", "Atendimento", "humanizado"],
    ],
  },

  destaques: [
    { icone: "calendario", titulo: "Consulta Personalizada", texto: "", alvo: "agendamentos" },
    { icone: "dente", titulo: "Estética Dental", texto: "Harmonização do seu sorriso", alvo: "estetica" },
    { icone: "implante", titulo: "Implantes", texto: "Mais segurança e qualidade de vida", alvo: "implantes" },
    { icone: "brilho", titulo: "Clareamento", texto: "Sorriso mais branco e natural", alvo: "clareamento" },
  ],

  tratamentos: [
    { chave: "avaliacao", icone: "calendario", nome: "Avaliação completa", resumo: "Exame clínico, orientação e plano de tratamento explicado com calma.", itens: ["Exame clínico detalhado", "Plano por etapas", "Orçamento transparente"] },
    { chave: "estetica", icone: "dente", nome: "Estética dental", resumo: "Facetas, lentes e ajustes de forma para um sorriso harmônico.", itens: ["Planejamento do sorriso", "Facetas e lentes", "Ajustes de forma e cor"] },
    { chave: "implantes", icone: "implante", nome: "Implantes", resumo: "Reposição de dentes com planejamento e acompanhamento.", itens: ["Avaliação por imagem", "Implante unitário ou múltiplo", "Acompanhamento pós-cirúrgico"] },
    { chave: "clareamento", icone: "brilho", nome: "Clareamento", resumo: "Técnicas de consultório e caseira supervisionada.", itens: ["Avaliação de sensibilidade", "Clareamento em consultório", "Moldeira para casa"] },
    { chave: "ortodontia", icone: "alinhador", nome: "Ortodontia", resumo: "Aparelhos fixos e alinhadores para corrigir a posição dos dentes.", itens: ["Aparelho fixo", "Alinhadores transparentes", "Manutenções programadas"] },
    { chave: "prevencao", icone: "escudo", nome: "Prevenção e limpeza", resumo: "Limpeza profissional e cuidados para manter a saúde bucal.", itens: ["Profilaxia", "Aplicação de flúor", "Orientação de higiene"] },
  ],

  sobre: {
    titulo: "Uma clínica pensada para o seu conforto.",
    texto: "Na SorrisoViva cada etapa é explicada antes de começar. Você entende o diagnóstico, as opções e o tempo de cada tratamento, em um ambiente acolhedor e com equipamentos atualizados.",
    pontos: ["Explicação clara de cada etapa", "Materiais com procedência", "Biossegurança rigorosa", "Atendimento com hora marcada"],
  },

  // nomes de exemplo: substitua pela equipe real e seus registros profissionais
  equipe: {
    ilustrativa: true,
    pessoas: [
      ["Profissional exemplo", "Clínica geral e prevenção"],
      ["Profissional exemplo", "Estética e reabilitação"],
      ["Profissional exemplo", "Implantodontia"],
      ["Profissional exemplo", "Ortodontia"],
    ],
  },

  perguntas: [
    ["A primeira consulta tem custo?", "Defina aqui a política da clínica para a avaliação inicial."],
    ["Vocês atendem convênios?", "Liste aqui os convênios aceitos ou informe que o atendimento é particular."],
    ["Quanto tempo dura um clareamento?", "O resultado varia conforme hábitos e tipo de clareamento. A avaliação indica a melhor opção."],
    ["Implante dói?", "O procedimento é feito com anestesia local. O pós-operatório é acompanhado de perto pela equipe."],
    ["Como funciona o agendamento?", "Escolha o tratamento e o período no formulário e envie pelo WhatsApp. A equipe confirma o horário."],
  ],

  animacao: {
    parallax: 1,
    flutuacao: 1,
    velocidadeBrilho: 1,
  },
};
