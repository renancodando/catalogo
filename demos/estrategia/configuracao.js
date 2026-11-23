/* Tudo o que muda de uma empresa para outra fica aqui. */
window.configuracaoEmpresa = {
  marca: { nome: "RNCWEB", subtitulo: "Escritório" },
  nomeEmpresa: "RNCWEB Escritório",

  // deixe vazio até ter o número real (com DDI e DDD, só dígitos)
  whatsapp: "",
  mensagemPadrao: "Olá! Vim pelo site e gostaria de agendar uma reunião.",
  email: "",
  endereco: "",
  horario: "Segunda a sexta, das 9h às 18h",

  menu: [
    ["Início", "#inicio"],
    ["Áreas de atuação", "#areas"],
    ["Sobre", "#sobre"],
    ["Soluções", "#solucoes"],
    ["Contato", "#contato"],
  ],
  botaoTopo: "Agendar reunião",

  inicio: {
    sobretitulo: "Soluções empresariais",
    titulo: ["Estratégia,", "Gestão e", "Resultados"],
    descricao: ["Apoio completo para empresas que buscam", "organização, crescimento e decisões mais seguras."],
    botaoPrincipal: "Fale com nosso time",
    botaoSecundario: ["Conheça", "nossa abordagem"],
  },

  navegacaoLateral: [
    ["01", "Início", "#inicio"],
    ["02", "Serviços", "#areas"],
    ["03", "Sobre", "#sobre"],
    ["04", "Contato", "#contato"],
  ],

  servicos: [
    {
      icone: "arte/icone-card0.webp",
      titulo: "Gestão Empresarial",
      resumo: ["Organização e performance", "para o seu negócio."],
      detalhes: ["Diagnóstico da operação", "Indicadores e rotinas de gestão", "Organização financeira e administrativa"],
    },
    {
      icone: "arte/icone-card1.webp",
      titulo: "Planejamento Estratégico",
      resumo: ["Direção clara para", "crescimento sustentável."],
      detalhes: ["Metas e prioridades por período", "Plano de ação com responsáveis", "Revisões periódicas de resultado"],
    },
    {
      icone: "arte/icone-card2.webp",
      titulo: "Consultoria e Suporte",
      resumo: ["Acompanhamento especializado", "e soluções personalizadas."],
      detalhes: ["Reuniões de acompanhamento", "Apoio na tomada de decisão", "Canal direto com a equipe"],
    },
    {
      icone: "arte/icone-card3.webp",
      titulo: "Estruturação de Processos",
      resumo: ["Mais eficiência, controle", "e produtividade."],
      detalhes: ["Mapeamento de processos", "Padronização e documentação", "Treinamento da equipe"],
    },
  ],

  // valores de demonstração: troque pelos números reais da empresa
  numeros: {
    ilustrativos: true,
    itens: [
      [200, "+", "", "Projetos realizados"],
      [120, "+", "", "Empresas atendidas"],
      [98, "", "%", "Satisfação dos clientes"],
    ],
  },
  destaqueSolucoes: ["Soluções sob medida", "para o seu negócio."],

  abordagem: {
    titulo: "Nossa abordagem",
    texto: "Cada projeto começa entendendo a realidade da empresa. A partir daí, construímos um caminho claro, com etapas acompanhadas de perto.",
    etapas: [
      ["Diagnóstico", "Conversamos com a liderança e levantamos números, rotinas e gargalos."],
      ["Planejamento", "Definimos prioridades, metas e um plano de ação realista."],
      ["Execução", "Implantamos as mudanças junto com a equipe, passo a passo."],
      ["Acompanhamento", "Medimos os resultados e ajustamos o plano sempre que preciso."],
    ],
  },

  solucoes: [
    ["Consultoria pontual", "Para resolver um desafio específico com apoio especializado.", ["Encontros sob demanda", "Relatório com recomendações"]],
    ["Acompanhamento contínuo", "Para empresas que querem evoluir mês a mês com apoio próximo.", ["Reuniões periódicas", "Indicadores acompanhados"]],
    ["Projeto de estruturação", "Para organizar a empresa do zero ou preparar uma nova fase.", ["Processos documentados", "Equipe treinada"]],
  ],

  assuntos: ["Gestão Empresarial", "Planejamento Estratégico", "Consultoria e Suporte", "Estruturação de Processos", "Outro assunto"],

  animacao: { paralaxe: 1, flutuacao: 1, brilho: 1 },
};
