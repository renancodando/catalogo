window.configuracaoEmpresa = {
  marca: { nome: "Escritório", subtitulo: "Consultoria & Gestão" },
  nomeEmpresa: "Escritório Consultoria & Gestão",

  // deixe vazio até ter o número real (com DDI e DDD, só dígitos)
  whatsapp: "",
  mensagemPadrao: "Olá! Vim pelo site e gostaria de agendar uma reunião.",

  endereco: {
    rua: "Rua Exemplo, 000 — Conjunto 00",
    cidade: "Sua cidade — UF",
    referencia: "Endereço demonstrativo",
    linkMapa: "",
  },
  horarios: [
    ["Segunda a sexta", "09h às 18h"],
    ["Sábado e domingo", "Fechado"],
  ],

  inicio: {
    comando: "soluções_profissionais.exe",
    tituloLinha1: "Gestão, estratégia",
    tituloLinha2: "e",
    tituloDestaque: "resultados",
    descricao: "Apoio especializado para organizar, estruturar e fazer o seu negócio evoluir com segurança e eficiência.",
    botaoPrincipal: "Nossos serviços",
    botaoSecundario: "Falar com um especialista",
  },

  // números de exemplo: troque pelos dados verificados do cliente
  indicadores: {
    ilustrativos: true,
    status: "online",
    clientes: 120,
    projetos: 320,
    areas: 4,
  },

  areas: ["Organização", "Consultoria", "Planejamento", "Gestão", "Resultados"],

  servicos: [
    { chave: "gestao", icone: "camadas", nome: ["Gestão", "Empresarial"], resumo: ["Processos, pessoas", "e performance"], detalhe: "Estrutura de processos, papéis e rotinas para a empresa funcionar com previsibilidade.", itens: ["Mapeamento de processos", "Definição de papéis", "Rotinas de gestão"] },
    { chave: "planejamento", icone: "barras", nome: ["Planejamento", "Estratégico"], resumo: ["Metas, organização", "e crescimento"], detalhe: "Objetivos claros, indicadores e plano de ação acompanhado de perto.", itens: ["Metas e indicadores", "Plano de ação", "Revisões periódicas"] },
    { chave: "operacional", icone: "escudo", nome: ["Consultoria", "Operacional"], resumo: ["Análise, diagnóstico", "e soluções"], detalhe: "Diagnóstico do dia a dia para eliminar retrabalho e gargalos.", itens: ["Diagnóstico operacional", "Ajuste de fluxos", "Padrões de qualidade"] },
    { chave: "suporte", icone: "documentos", nome: ["Suporte", "Administrativo"], resumo: ["Rotina, controle", "e conformidade"], detalhe: "Apoio nas rotinas administrativas, controles e documentação.", itens: ["Controles internos", "Organização de documentos", "Agenda de obrigações"] },
  ],

  chamadas: [
    ["Vamos estruturar o seu negócio?", "Agende uma conversa e descubra como podemos ajudar."],
    ["Processos claros, equipe alinhada.", "Mapeamos a rotina e organizamos cada etapa com você."],
    ["Decisões com base em dados.", "Indicadores simples para acompanhar o que importa."],
    ["Crescimento com segurança.", "Planejamento e acompanhamento contínuo do início ao fim."],
  ],

  sobre: {
    titulo: "Consultoria direta ao ponto.",
    texto: "O escritório trabalha lado a lado com o cliente: diagnóstico honesto, plano objetivo e acompanhamento até os resultados aparecerem.",
    registro: [
      "> iniciar diagnostico --empresa cliente",
      "  mapeando processos........ ok",
      "  identificando gargalos.... ok",
      "  priorizando ações......... ok",
      "> gerar plano --prazo definido",
      "  plano de ação pronto para revisão",
    ],
  },

  etapas: [
    ["01", "Conversa", "Entendemos o momento e os objetivos do negócio."],
    ["02", "Diagnóstico", "Levantamos processos, números e pontos de atenção."],
    ["03", "Plano", "Definimos prioridades, responsáveis e prazos."],
    ["04", "Execução", "Acompanhamos a implantação e ajustamos o caminho."],
  ],

  animacao: {
    velocidadeCubo: 1,
    digitacao: 1,
  },
};
