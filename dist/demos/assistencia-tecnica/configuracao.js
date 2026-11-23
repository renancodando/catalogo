/* Configuração central do site. Troque os textos e dados da empresa aqui. */
window.configuracaoEmpresa = {
  marca: { nome: "RNCWEB", subtitulo: "Assistência técnica" },
  nomeEmpresa: "RNCWEB Assistência Técnica",

  // Número real com DDI e DDD, só dígitos (ex.: 5567999999999). Vazio = contato desativado com aviso.
  whatsapp: "",
  mensagemPadrao: "Olá! Vim pelo site e gostaria de um orçamento de reparo.",

  endereco: {
    rua: "Rua Exemplo, 000 — Centro",
    cidade: "Sua cidade — UF",
    referencia: "Endereço demonstrativo",
    linkMapa: "",
  },
  horarios: [
    ["Segunda a sexta", "09h às 18h"],
    ["Sábado", "09h às 13h"],
    ["Domingo e feriados", "Fechado"],
  ],
  email: "",

  inicio: {
    sobretitulo: "Assistência especializada",
    tituloLinha1: "Seu celular,",
    tituloLinha2: "sempre pronto",
    descricaoLinha1: "Diagnóstico preciso, reparo seguro e máxima",
    descricaoLinha2: "performance para o seu dispositivo.",
    botaoPrincipal: "Solicitar reparo",
    botaoSecundario: "Ver serviços",
    atendimento: "Atendimento agora",
    garantias: [
      ["Reparo rápido", "na maioria dos casos"],
      ["Garantia real", "no serviço"],
      ["Peças de", "alta qualidade"],
    ],
  },

  servicos: [
    { chave: "tela", nome: "Troca de tela", linha1: "Display novo e", linha2: "alta durabilidade", detalhe: "Substituição do display e do vidro com teste de toque, brilho e cores antes da entrega.", itens: ["Teste de toque e cores", "Vedação conferida", "Película opcional"] },
    { chave: "bateria", nome: "Troca de bateria", linha1: "Mais autonomia", linha2: "e segurança", detalhe: "Bateria nova com verificação de carga e temperatura, para o aparelho durar o dia inteiro.", itens: ["Teste de saúde da bateria", "Ciclo de carga conferido", "Descarte correto da antiga"] },
    { chave: "camera", nome: "Reparo de câmera", linha1: "Qualidade original", linha2: "de imagem", detalhe: "Troca de módulo, lente ou vidro da câmera com teste de foco, flash e estabilização.", itens: ["Foco e estabilização", "Lente e vidro traseiro", "Câmera frontal e traseira"] },
    { chave: "conector", nome: "Conector de carga", linha1: "Carregamento estável", linha2: "e sem falhas", detalhe: "Limpeza ou troca do conector para recuperar o carregamento e a transferência de dados.", itens: ["Limpeza técnica", "Troca do conector", "Teste com cabo e carregador"] },
    { chave: "revisao", nome: "Revisão completa", linha1: "Diagnóstico e", linha2: "limpeza interna", detalhe: "Checagem completa de hardware e software, com limpeza interna e relatório do estado do aparelho.", itens: ["Checklist de 30 itens", "Limpeza interna", "Relatório do aparelho"] },
  ],

  diagnostico: {
    selo: "Diagnóstico inteligente",
    tituloLinha1: "Descubra o problema",
    tituloLinha2: "do seu aparelho agora.",
    botao: "Iniciar diagnóstico",
    perguntas: [
      { pergunta: "O que está acontecendo com o aparelho?", opcoes: [["tela", "Tela quebrada ou sem toque"], ["bateria", "Bateria dura pouco ou estufou"], ["conector", "Não carrega ou carrega devagar"], ["camera", "Câmera com mancha ou sem foco"], ["revisao", "Lento, travando ou outro problema"]] },
    ],
  },

  etapas: [
    ["01", "Solicite o serviço", "online ou na loja"],
    ["02", "Diagnóstico", "rápido"],
    ["03", "Reparo com", "peças de qualidade"],
    ["04", "Seu aparelho", "pronto e garantido"],
  ],

  diferenciais: [
    ["Reparo rápido", "A maioria dos reparos de tela, bateria e conector fica pronta no mesmo dia, após o diagnóstico."],
    ["Garantia real", "Todo serviço sai com garantia por escrito. Informe aqui o prazo praticado pela loja."],
    ["Peças de alta qualidade", "Peças selecionadas e testadas antes da instalação, com opção de peça original quando disponível."],
    ["Orçamento antes do reparo", "Nada é feito sem a sua aprovação: você recebe o diagnóstico e o valor antes de qualquer serviço."],
  ],

  perguntas: [
    ["Quanto tempo leva o reparo?", "Depende do serviço e da disponibilidade da peça. O prazo é informado junto com o orçamento."],
    ["O diagnóstico tem custo?", "Defina aqui a política da loja para o diagnóstico."],
    ["Meus dados ficam seguros?", "O aparelho é manuseado só pela equipe técnica. Sempre que possível, faça um backup antes de trazer."],
    ["Vocês atendem quais marcas?", "Liste aqui as marcas e modelos atendidos pela loja."],
  ],

  animacao: {
    velocidade: 1, // 0 desliga as animações decorativas
    abrirCamadas: true,
  },
};
