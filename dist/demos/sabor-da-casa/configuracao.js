window.configuracaoEmpresa = {
  marca: { nome: "Sabor da Casa", complemento: "Restaurante" },
  nomeEmpresa: "Sabor da Casa Restaurante",

  // número com DDI e DDD, só dígitos; vazio mostra o aviso de demonstração
  whatsapp: "",
  mensagemPadrao: "Olá, Sabor da Casa!",

  endereco: {
    rua: "Rua Exemplo, 000 — Bairro",
    cidade: "Sua cidade — UF",
    referencia: "Endereço demonstrativo",
    linkMapa: "",
  },
  horarios: [
    ["Segunda a sexta", "11h às 15h"],
    ["Sábado", "11h às 16h"],
    ["Domingo", "11h às 15h"],
  ],
  atendimento: [
    ["salao", "No salão", "Mesa posta, comida quentinha e atendimento sem pressa."],
    ["retirada", "Retirada", "Peça antes e retire no balcão no horário combinado."],
    ["entrega", "Entrega", "Informe aqui os bairros atendidos e a taxa de entrega."],
  ],

  inicio: {
    rotulo: "Cozinha caseira",
    tituloLinha1: "Comida de verdade,",
    tituloAntes: "com",
    tituloDestaque: "sabor de casa",
    descricao: "Pratos variados, ingredientes de qualidade e aquele tempero especial que faz toda a diferença.",
    botaoPrincipal: "Ver cardápio",
    botaoSecundario: "Como chegar",
    diferenciais: [
      ["cloche", "Pratos", "do dia"],
      ["folha", "Ingredientes", "selecionados"],
      ["coracao", "Ambiente", "acolhedor"],
    ],
  },

  // pratos do dia de exemplo (0 = domingo ... 6 = sábado)
  pratosDoDia: [
    ["Domingo", "Frango assado com farofa da casa", "Arroz, maionese caseira e salada verde."],
    ["Segunda", "Bife acebolado", "Arroz, feijão, batata frita e salada."],
    ["Terça", "Strogonoff de frango", "Arroz branco, batata palha e legumes."],
    ["Quarta", "Feijoada da casa", "Arroz, couve, farofa, laranja e torresmo."],
    ["Quinta", "Carne de panela com legumes", "Arroz, feijão e purê de batata."],
    ["Sexta", "Peixe empanado", "Arroz, pirão, salada e limão."],
    ["Sábado", "Lasanha à bolonhesa", "Salada verde e pão de alho."],
  ],

  // preços vazios mostram "Consultar" e o pedido segue sem total
  cardapio: {
    ilustrativo: true,
    categorias: [
      {
        nome: "Pratos feitos",
        itens: [
          { id: "pf-frango", nome: "Frango grelhado", descricao: "Arroz, feijão, salada e batata.", preco: "" },
          { id: "pf-bife", nome: "Bife acebolado", descricao: "Arroz, feijão, ovo e farofa.", preco: "" },
          { id: "pf-peixe", nome: "Filé de peixe", descricao: "Arroz, purê e legumes no vapor.", preco: "" },
        ],
      },
      {
        nome: "Caseiros",
        itens: [
          { id: "cs-escondidinho", nome: "Escondidinho de carne seca", descricao: "Purê de mandioca gratinado.", preco: "" },
          { id: "cs-galinhada", nome: "Galinhada", descricao: "Arroz temperado com frango e açafrão.", preco: "" },
          { id: "cs-sopa", nome: "Caldo do dia", descricao: "Consulte o sabor disponível.", preco: "" },
        ],
      },
      {
        nome: "Sobremesas",
        itens: [
          { id: "sb-pudim", nome: "Pudim de leite", descricao: "Receita da família.", preco: "" },
          { id: "sb-doce", nome: "Doce de abóbora", descricao: "Com coco, servido com queijo.", preco: "" },
          { id: "sb-arroz", nome: "Arroz-doce", descricao: "Com canela.", preco: "" },
        ],
      },
      {
        nome: "Bebidas",
        itens: [
          { id: "bb-suco", nome: "Suco natural", descricao: "Laranja, limão ou maracujá.", preco: "" },
          { id: "bb-refri", nome: "Refrigerante lata", descricao: "Consulte os sabores.", preco: "" },
          { id: "bb-cafe", nome: "Cafezinho", descricao: "Passado na hora.", preco: "" },
        ],
      },
    ],
  },

  sobre: {
    titulo: "Uma cozinha de família, aberta para você.",
    texto:
      "O Sabor da Casa começou com receitas passadas de geração em geração. Até hoje, o tempero é feito na hora, o feijão cozinha devagar e cada prato sai como se fosse para a mesa de casa.",
    numeros: [
      ["Receitas", "da família"],
      ["Tempero", "feito na hora"],
      ["Porções", "bem servidas"],
    ],
  },

  animacao: {
    inclinacaoPrato: 6,
    velocidadeReflexo: 1,
    intensidadeLuz: 1,
    velocidadeOndas: 1,
  },
};
