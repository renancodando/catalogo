window.configuracaoEmpresa = {
  marca: { nome: "Sabor & Mesa", complemento: "Restaurante" },
  nomeEmpresa: "Sabor & Mesa Restaurante",

  // número com DDI e DDD, só dígitos; vazio mostra o aviso de demonstração
  whatsapp: "",
  mensagemPadrao: "Olá! Vim pelo site do Sabor & Mesa.",

  endereco: {
    rua: "Rua Exemplo, 000 — Centro",
    cidade: "Sua cidade — UF",
    referencia: "Endereço demonstrativo",
    linkMapa: "",
  },
  horarios: [
    ["Terça a quinta", "19h às 23h"],
    ["Sexta e sábado", "19h às 00h"],
    ["Domingo", "12h às 16h"],
    ["Segunda", "Fechado"],
  ],
  horariosReserva: ["12:00", "12:30", "13:00", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"],

  inicio: {
    rotulo: "Cozinha contemporânea",
    titulo: "Experiências",
    tituloDestaque: "à mesa",
    descricao: "Pratos autorais, ingredientes selecionados e um ambiente pensado para bons encontros.",
    botaoPrincipal: "Reserve sua mesa",
    botaoSecundario: "Ver cardápio",
    diferenciais: [
      ["cloche", "Cardápio variado", "Opções para todos os gostos"],
      ["agenda", "Reservas rápidas", "Garanta seu lugar com praticidade"],
      ["pessoas", "Ambiente acolhedor", "Ideal para família, amigos e eventos"],
    ],
  },

  // cardápio de exemplo: troque nomes, descrições e preços pelos do restaurante
  cardapio: {
    ilustrativo: true,
    secoes: [
      {
        nome: "Entradas",
        itens: [
          ["Tartare de atum", "Atum fresco, abacate, gergelim tostado e chips de mandioca.", ""],
          ["Burrata com tomates assados", "Tomates confitados, pesto de manjericão e pão de fermentação natural.", ""],
          ["Croquetes de costela", "Costela desfiada, maionese defumada e picles da casa.", ""],
        ],
      },
      {
        nome: "Principais",
        itens: [
          ["Risoto de cogumelos", "Arbóreo, cogumelos frescos, parmesão e azeite trufado.", ""],
          ["Peixe do dia", "Purê de banana-da-terra, farofa de castanhas e manteiga de ervas.", ""],
          ["Filé ao molho de vinho", "Filé grelhado, redução de vinho tinto e batatas rústicas.", ""],
        ],
      },
      {
        nome: "Sobremesas",
        itens: [
          ["Petit gâteau de doce de leite", "Sorvete de baunilha e farofa crocante.", ""],
          ["Pavlova de frutas vermelhas", "Merengue, creme leve e frutas da estação.", ""],
          ["Queijo com goiabada", "Versão da casa com calda quente e crocante.", ""],
        ],
      },
      {
        nome: "Bebidas",
        itens: [
          ["Carta de vinhos", "Rótulos nacionais e importados, em taça ou garrafa.", ""],
          ["Drinks autorais", "Coquetéis criados para harmonizar com o menu.", ""],
          ["Sem álcool", "Sucos, sodas artesanais e cafés especiais.", ""],
        ],
      },
    ],
  },

  especiais: [
    ["Menu degustação", "Cinco tempos que mudam conforme a estação."],
    ["Almoço de domingo", "Pratos para compartilhar em família."],
    ["Harmonização", "Vinhos escolhidos para cada etapa do jantar."],
    ["Sobremesa da semana", "Uma criação diferente a cada semana."],
  ],

  experiencia: [
    ["Recepção", "Você é recebido com calma e acomodado na mesa escolhida."],
    ["Menu", "A equipe apresenta o cardápio e sugere harmonizações."],
    ["Pratos", "Cada prato chega no tempo certo, finalizado na hora."],
    ["Final", "Sobremesa, café e um encerramento sem pressa."],
  ],

  sobre: {
    titulo: "Uma cozinha de detalhes, um salão para encontros.",
    texto:
      "O Sabor & Mesa nasceu da vontade de unir técnica e afeto. Ingredientes escolhidos com cuidado, preparos precisos e um salão de luz baixa para conversas longas.",
  },

  ambientes: [
    ["Salão principal", "Mesas para casais e pequenos grupos."],
    ["Mesa do chef", "Vista para a cozinha e menu exclusivo."],
    ["Espaço para eventos", "Aniversários, jantares e confraternizações."],
  ],

  animacao: {
    velocidadeVapor: 1,
    quantidadeVapor: 1,
    intensidadeBrilho: 1,
    velocidadeReflexo: 1,
    parallax: 1,
  },
};
