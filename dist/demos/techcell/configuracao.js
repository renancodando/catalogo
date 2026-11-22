window.configuracaoEmpresa = {
  marca: { inicio: "Tech", destaque: "Cell", subtitulo: "Assistência Técnica" },
  nomeEmpresa: "TechCell Assistência Técnica",

  // deixe vazio até ter o número real (com DDI e DDD, só dígitos)
  whatsapp: "",
  mensagemPadrao: "Olá! Vim pelo site e gostaria de um orçamento.",

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
  redes: { instagram: "", facebook: "" },
  email: "",

  inicio: {
    selo: "Assistência Técnica Especializada",
    tituloLinha1: "Seu aparelho de volta",
    tituloLinha2: "à rotina,",
    tituloDestaque: "rápido e seguro.",
    descricao: "Manutenção em celulares, tablets e notebooks com qualidade, garantia e atendimento de confiança.",
    botaoPrincipal: "Solicitar orçamento",
    botaoSecundario: "Ver serviços",
    diferenciais: [
      ["escudo", "Garantia", "do serviço"],
      ["raio", "Reparo", "rápido"],
      ["selo", "Peças de", "qualidade"],
    ],
  },

  categorias: [
    { chave: "celulares", icone: "celular", nome: "Celulares", resumo: "Troca de tela, bateria, conector e mais." },
    { chave: "notebooks", icone: "notebook", nome: "Notebooks", resumo: "Manutenção, limpeza e upgrades." },
    { chave: "tablets", icone: "tablet", nome: "Tablets", resumo: "Reparo, troca de peças e otimização." },
    { chave: "acessorios", icone: "fone", nome: "Acessórios", resumo: "Capas, fones, cabos e muito mais." },
  ],

  // números de exemplo: troque pelos dados verificados do cliente
  indicadores: {
    ilustrativos: true,
    itens: [
      ["pessoas", "+1.200", "Clientes atendidos"],
      ["estrela", "4,9/5", "Avaliações no Google"],
      ["escudo", "Garantia", "Em todos os serviços"],
    ],
  },

  servicos: [
    { categoria: "celulares", nome: "Troca de tela", descricao: "Display e vidro com teste de toque, brilho e cores antes da entrega.", itens: ["Telas compatíveis e originais", "Teste completo do touch", "Vedação refeita"], prazo: "Prazo conforme modelo" },
    { categoria: "celulares", nome: "Troca de bateria", descricao: "Bateria nova para recuperar autonomia e evitar desligamentos.", itens: ["Medição de saúde da bateria", "Calibração após a troca", "Descarte correto"], prazo: "Geralmente no mesmo dia" },
    { categoria: "celulares", nome: "Conector de carga", descricao: "Limpeza ou troca do conector quando o carregamento falha.", itens: ["Limpeza técnica", "Troca do conector", "Teste de carga rápida"], prazo: "Após diagnóstico" },
    { categoria: "celulares", nome: "Placa e oxidação", descricao: "Diagnóstico em placa para aparelhos molhados ou que não ligam.", itens: ["Banho químico", "Microssoldagem", "Relatório do diagnóstico"], prazo: "Após diagnóstico" },
    { categoria: "notebooks", nome: "Limpeza e pasta térmica", descricao: "Remove poeira e renova a dissipação para reduzir aquecimento.", itens: ["Limpeza interna", "Pasta térmica nova", "Teste de temperatura"], prazo: "Conforme agenda" },
    { categoria: "notebooks", nome: "Upgrade de SSD e memória", descricao: "Mais velocidade com SSD e memória adequados ao equipamento.", itens: ["Clonagem do sistema", "Instalação de SSD", "Expansão de memória"], prazo: "Conforme agenda" },
    { categoria: "notebooks", nome: "Tela, teclado e dobradiça", descricao: "Troca de componentes externos com acabamento cuidadoso.", itens: ["Peças compatíveis", "Ajuste de dobradiças", "Teclados retroiluminados"], prazo: "Após orçamento" },
    { categoria: "tablets", nome: "Vidro e display", descricao: "Recuperação de tablets com vidro trincado ou imagem falhando.", itens: ["Troca do touch", "Troca do display", "Colagem com pressão controlada"], prazo: "Conforme modelo" },
    { categoria: "tablets", nome: "Desempenho e software", descricao: "Atualização, backup e otimização para o uso do dia a dia.", itens: ["Backup dos dados", "Atualização do sistema", "Remoção de lentidão"], prazo: "Geralmente no mesmo dia" },
    { categoria: "acessorios", nome: "Películas e capas", descricao: "Proteção aplicada na hora, com opções para os modelos mais usados.", itens: ["Película de vidro", "Capas reforçadas", "Aplicação sem bolhas"], prazo: "Na hora" },
    { categoria: "acessorios", nome: "Carregadores e cabos", descricao: "Acessórios testados para carregamento seguro.", itens: ["Fontes de carga rápida", "Cabos reforçados", "Teste na bancada"], prazo: "Na hora" },
    { categoria: "acessorios", nome: "Fones e áudio", descricao: "Fones com e sem fio, caixas de som e suportes.", itens: ["Fones Bluetooth", "Adaptadores", "Suportes veiculares"], prazo: "Na hora" },
  ],

  etapas: [
    ["Contato", "Você descreve o problema pelo WhatsApp ou no balcão."],
    ["Diagnóstico", "O aparelho passa por testes para identificar a causa."],
    ["Aprovação", "Você recebe o orçamento detalhado e decide."],
    ["Reparo e entrega", "Reparo, testes finais e entrega com garantia."],
  ],

  sobre: {
    titulo: "Bancada técnica, atendimento próximo.",
    texto: "A TechCell cuida de celulares, tablets e notebooks com processos claros: diagnóstico antes do orçamento, peças escolhidas com critério e testes antes da entrega. Você acompanha cada etapa e sabe exatamente o que foi feito.",
    pontos: ["Diagnóstico antes do orçamento", "Peças com procedência", "Testes antes da entrega", "Garantia por escrito"],
  },

  // exemplos para demonstrar o layout, não são depoimentos reais
  avaliacoes: [
    ["Cliente exemplo", "Troca de tela", "Explicaram o problema com calma e entregaram no prazo combinado."],
    ["Cliente exemplo", "Bateria", "O celular voltou a durar o dia inteiro. Atendimento muito claro."],
    ["Cliente exemplo", "Notebook", "Fizeram a limpeza e o upgrade de SSD. Ficou muito mais rápido."],
  ],

  perguntas: [
    ["Quanto tempo leva um reparo?", "Depende do serviço e da disponibilidade da peça. Trocas simples costumam ser feitas no mesmo dia; reparos em placa dependem do diagnóstico."],
    ["O orçamento é cobrado?", "Defina aqui a política da loja. Muitas assistências fazem o orçamento sem custo para trocas simples."],
    ["Os reparos têm garantia?", "Sim. Informe aqui o prazo de garantia oferecido para cada tipo de serviço."],
    ["Meus dados ficam seguros?", "O aparelho é manuseado apenas para o reparo. Sempre que possível, recomendamos fazer backup antes."],
    ["Vocês atendem notebooks de todas as marcas?", "Liste aqui as marcas e modelos atendidos pela loja."],
  ],

  animacao: {
    inclinacaoCursor: 7,
    amplitudeFlutuacao: 9,
    distanciaCamadas: 1,
    velocidadePulsos: 1,
    quantidadeParticulas: 44,
    intensidadeBrilho: 1,
  },
};
