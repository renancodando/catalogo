window.configuracaoEmpresa = {
  marca: { nome: "LavaCar", complemento: "Premium" },
  nomeEmpresa: "LavaCar Premium",

  // número com DDI e DDD, só dígitos; vazio mostra o aviso de demonstração
  whatsapp: "",
  mensagemPadrao: "Olá! Vim pelo site da LavaCar Premium.",

  endereco: {
    rua: "Avenida Exemplo, 000 — Bairro",
    cidade: "Sua cidade — UF",
    referencia: "Endereço demonstrativo",
    linkMapa: "",
  },
  horarios: [
    ["Segunda a sexta", "08h às 18h"],
    ["Sábado", "08h às 14h"],
    ["Domingo", "Fechado"],
  ],
  redes: { instagram: "" },

  inicio: {
    selo: "Lava Car Profissional",
    tituloLinha1: "Cuidado completo",
    tituloLinha2: "para o",
    tituloDestaque: "seu carro",
    descricao: "Lavagem, higienização e estética automotiva com qualidade, segurança e atenção aos detalhes.",
    botaoPrincipal: "Agendar lavagem",
    botaoSecundario: "Ver serviços",
    diferenciais: [
      ["gota", "Limpeza", "profunda"],
      ["escudo", "Mais proteção", "à pintura"],
      ["carro", "Seu carro", "sempre valorizado"],
    ],
  },

  servicos: [
    {
      chave: "lavagem",
      icone: "gota",
      nome: "Tipos de lavagem",
      resumo: "Da manutenção semanal à lavagem detalhada, com produtos de pH neutro.",
      itens: [
        ["Lavagem simples", "Externa com shampoo automotivo, secagem e pretinho nos pneus."],
        ["Lavagem completa", "Externa e interna, aspiração, painel e vidros por dentro."],
        ["Lavagem detalhada", "Rodas, caixas de roda, frisos e acabamentos limpos com pincel."],
      ],
    },
    {
      chave: "higienizacao",
      icone: "assento",
      nome: "Higienização interna",
      resumo: "Bancos, carpetes e teto tratados por extração para remover manchas e odores.",
      itens: [
        ["Bancos de tecido ou couro", "Limpeza e hidratação conforme o material."],
        ["Carpetes e forração do teto", "Extração com secagem controlada."],
        ["Ar-condicionado", "Higienização do sistema para reduzir odores."],
      ],
    },
    {
      chave: "estetica",
      icone: "brilho",
      nome: "Estética automotiva",
      resumo: "Correção de pintura e acabamento espelhado para valorizar o veículo.",
      itens: [
        ["Polimento técnico", "Redução de riscos superficiais e marcas de lavagem."],
        ["Revitalização de plásticos", "Recupera o tom de faróis, frisos e para-choques."],
        ["Limpeza de motor", "Desengraxe cuidadoso com proteção dos componentes."],
      ],
    },
    {
      chave: "protecao",
      icone: "escudo",
      nome: "Proteção e conservação",
      resumo: "Camadas protetoras que facilitam a limpeza e preservam o brilho.",
      itens: [
        ["Enceramento", "Proteção de curta duração com brilho imediato."],
        ["Selante sintético", "Proteção mais duradoura contra sol e chuva."],
        ["Vitrificação", "Camada rígida e hidrofóbica para quem busca o máximo."],
      ],
    },
  ],

  // valores de exemplo: preencha "preco" ou deixe vazio para mostrar "Sob consulta"
  pacotes: {
    ilustrativos: true,
    itens: [
      { nome: "Essencial", destaque: false, preco: "", descricao: "Para manter o carro limpo no dia a dia.", itens: ["Lavagem externa", "Aspiração interna", "Pretinho nos pneus", "Vidros por dentro"] },
      { nome: "Completo", destaque: true, preco: "", descricao: "O mais escolhido para uma limpeza caprichada.", itens: ["Tudo do Essencial", "Limpeza de painel e portas", "Cera de proteção", "Caixas de roda", "Perfume automotivo"] },
      { nome: "Premium", destaque: false, preco: "", descricao: "Higienização e proteção para valorizar o veículo.", itens: ["Tudo do Completo", "Higienização dos bancos", "Polimento de faróis", "Selante de pintura"] },
    ],
  },

  diferenciais: [
    ["gota", "Produtos certos para cada superfície", "pH neutro na pintura, produtos específicos para couro, plásticos e vidros."],
    ["relogio", "Horário marcado", "Você agenda e encontra o carro pronto no horário combinado."],
    ["escudo", "Cuidado com os detalhes", "Toalhas de microfibra separadas por etapa para evitar riscos."],
    ["brilho", "Acabamento conferido", "Checklist final antes da entrega, com você ao lado do carro."],
  ],

  etapas: [
    ["Agende", "Escolha o serviço e o horário pelo WhatsApp ou pelo formulário."],
    ["Receba o carro", "Fazemos a vistoria rápida com você e confirmamos o serviço."],
    ["Cuidamos dele", "Lavagem e tratamento com produtos adequados a cada parte."],
    ["Retire brilhando", "Conferência final e entrega no horário combinado."],
  ],

  perguntas: [
    ["Quanto tempo leva uma lavagem completa?", "Informe aqui o tempo médio de cada serviço. Serviços de estética podem exigir o dia todo."],
    ["Preciso agendar?", "O agendamento garante o horário. Defina aqui se a loja também atende por ordem de chegada."],
    ["Vocês buscam o carro?", "Descreva aqui se a empresa oferece leva e traz e em quais regiões."],
    ["Quais formas de pagamento são aceitas?", "Liste aqui as formas de pagamento aceitas."],
  ],

  animacao: {
    particulasJato: 1,
    quantidadeBolhas: 26,
    intensidadeEspuma: 1,
    velocidadeVarredura: 1,
    inclinacaoCursor: 5,
    gravidade: 1,
  },
};
