/* Tudo o que muda de um restaurante para outro fica aqui. */
window.configuracaoEmpresa = {
  marca: { nome: "RNCWEB", subtitulo: "Gourmet" },
  nomeEmpresa: "RNCWEB Gourmet",

  // deixe vazio até ter o número real (com DDI e DDD, só dígitos)
  whatsapp: "",
  mensagemPadrao: "Olá! Vim pelo site e gostaria de fazer um pedido.",

  endereco: {
    rua: "Rua Exemplo, 000 — Centro",
    cidade: "Sua cidade — UF",
    referencia: "Endereço demonstrativo",
  },
  horarios: [
    ["Terça a sexta", "18h às 23h"],
    ["Sábado e domingo", "12h às 16h · 18h às 23h30"],
    ["Segunda-feira", "Fechado"],
  ],

  menu: [
    ["Início", "#inicio"],
    ["Cardápio", "#cardapio"],
    ["Ambiente", "#ambiente"],
    ["Sobre", "#sobre"],
    ["Contato", "#contato"],
  ],
  botaoPedido: "Pedir agora",

  inicio: {
    rotulo: "Gastronomia autoral",
    tituloLinha1: "Sabores",
    tituloLinha1Destaque: "que",
    tituloLinha2: "contam histórias",
    descricao: "Mais que refeições, criamos experiências\nque despertam sentidos, memórias e\nnovas descobertas.",
    botaoPrincipal: "Ver cardápio",
    botaoSecundario: "Conhecer o ambiente",
    etapas: [
      ["01", "Experiência", "#inicio"],
      ["02", "Cardápio", "#cardapio"],
      ["03", "Ambiente", "#ambiente"],
      ["04", "Contato", "#contato"],
    ],
    diferenciais: [
      ["folhas", "Ingredientes", "selecionados"],
      ["chef", "Preparo", "artesanal"],
      ["raio", "Entrega", "rápida"],
    ],
  },

  painel: { rotulo: "Explore o nosso", titulo: "Cardápio" },

  /* As cinco primeiras categorias aparecem no painel da abertura. Sem preços: preencha
     "preco" quando quiser exibir valores reais. */
  cardapio: [
    {
      chave: "pratos", icone: "pratos", nome: "Pratos principais",
      itens: [
        { nome: "Filé ao molho de vinho", descricao: "Medalhão grelhado, redução de vinho tinto e purê rústico.", preco: "" },
        { nome: "Peixe da estação na manteiga", descricao: "Peixe do dia, manteiga de ervas e legumes tostados.", preco: "" },
        { nome: "Risoto de cogumelos", descricao: "Arbóreo cremoso, mix de cogumelos e parmesão.", preco: "" },
      ],
    },
    {
      chave: "massas", icone: "massas", nome: "Massas",
      itens: [
        { nome: "Massa da casa", descricao: "Massa fresca com ragu lento e manjericão.", preco: "" },
        { nome: "Fettuccine na manteiga", descricao: "Manteiga, sálvia e queijo curado.", preco: "" },
        { nome: "Ravioli de abóbora", descricao: "Recheio assado, nozes e manteiga noisette.", preco: "" },
      ],
    },
    {
      chave: "burgers", icone: "burgers", nome: "Burgers",
      itens: [
        { nome: "Burger artesanal", descricao: "Blend da casa, queijo derretido e pão brioche.", preco: "" },
        { nome: "Burger defumado", descricao: "Cebola caramelizada, bacon e molho da casa.", preco: "" },
        { nome: "Burger vegetal", descricao: "Grão-de-bico, legumes tostados e maionese de ervas.", preco: "" },
      ],
    },
    {
      chave: "bebidas", icone: "bebidas", nome: "Bebidas",
      itens: [
        { nome: "Limonada da casa", descricao: "Limão, hortelã e gengibre.", preco: "" },
        { nome: "Chá gelado de frutas", descricao: "Infusão do dia, sem açúcar adicionado.", preco: "" },
        { nome: "Carta de vinhos", descricao: "Seleção de rótulos para acompanhar os pratos.", preco: "" },
      ],
    },
    {
      chave: "sobremesas", icone: "sobremesas", nome: "Sobremesas",
      itens: [
        { nome: "Sobremesa especial", descricao: "Esfera de chocolate, calda quente e cereja.", preco: "" },
        { nome: "Petit gâteau", descricao: "Bolo de chocolate com centro cremoso e sorvete.", preco: "" },
        { nome: "Pudim da casa", descricao: "Receita tradicional com calda de caramelo.", preco: "" },
      ],
    },
  ],

  destaques: {
    rotulo: "Destaques da casa",
    titulo: "Experimente",
    subtitulo: "o especial da semana",
    pratos: [
      { nome: "Massa da Casa", imagem: "arte/prato-0.webp", categoria: "massas" },
      { nome: "Burger Artesanal", imagem: "arte/prato-1.webp", categoria: "burgers" },
      { nome: "Sobremesa Especial", imagem: "arte/prato-2.webp", categoria: "sobremesas" },
    ],
  },

  ambiente: {
    titulo: "Um lugar para ficar",
    texto: "Luz baixa, cozinha à vista e mesas pensadas para conversas longas.",
    espacos: [
      ["Salão principal", "Mesas amplas e iluminação quente para jantares sem pressa."],
      ["Balcão do chef", "Lugares de frente para a cozinha, com os pratos finalizados à sua frente."],
      ["Varanda", "Ambiente aberto para almoços de fim de semana."],
    ],
  },

  sobre: {
    titulo: "Cozinha autoral, feita com tempo",
    texto: "Cada prato nasce de ingredientes escolhidos na semana e de técnicas que respeitam o sabor de cada um. O cardápio muda com as estações para que sempre haja algo novo para descobrir.",
    pontos: ["Ingredientes de produtores locais", "Massas e molhos feitos na casa", "Opções vegetarianas em todas as categorias"],
  },

  animacao: { chamas: 1, fumaca: 1, ingredientes: 1, carrosselSegundos: 6 },
};
