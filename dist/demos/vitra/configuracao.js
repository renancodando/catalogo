/* Tudo o que muda de uma clínica para outra fica aqui. */
window.configuracaoEmpresa = {
  marca: { nome: "VITRA", subtitulo: "ODONTOLOGIA" },
  nomeEmpresa: "Vitra Odontologia",

  // deixe vazio até ter o número real (DDI + DDD + número, só dígitos)
  whatsapp: "",
  mensagemPadrao: "Olá! Vim pelo site e gostaria de agendar uma consulta.",
  email: "",
  endereco: { rua: "Rua Exemplo, 000 — Centro", cidade: "Sua cidade — UF", observacao: "Endereço demonstrativo" },
  horarios: [
    ["Segunda a sexta", "08h às 19h"],
    ["Sábado", "08h às 12h"],
    ["Domingo e feriados", "Fechado"],
  ],
  responsavelTecnico: "Informe aqui o responsável técnico e o número de registro no conselho",

  menu: [
    ["inicio", "Início"],
    ["tratamentos", "Tratamentos"],
    ["clinica", "Clínica"],
    ["diferenciais", "Diferenciais"],
    ["contato", "Contato"],
  ],
  lateral: [
    ["01", "Início", "inicio"],
    ["02", "Tratamentos", "tratamentos"],
    ["03", "Clínica", "clinica"],
    ["04", "Contato", "contato"],
  ],

  inicio: {
    sobretitulo: "SAÚDE BUCAL • ESTÉTICA • BEM-ESTAR",
    // *texto* = itálico; **texto** = itálico dourado; ++texto++ = dourado
    titulo: ["Um *novo olhar*", "para o **seu sorriso**"],
    descricao: "Tratamentos odontológicos completos, com tecnologia,\nconforto e um cuidado realmente humano.",
    botaoPrincipal: "Agende sua consulta",
    botaoSecundario: "Conheça a clínica",
    cartao: ["Sorriso saudável", "Qualidade de vida"],
  },

  tratamentos: [
    { chave: "estetica", icone: "estetica", nome: ["Estética", "Dental"], resumo: "Facetas, lentes e ajustes de forma e cor para um sorriso harmônico.", itens: ["Planejamento do sorriso", "Facetas e lentes", "Ajuste de forma e cor"] },
    { chave: "implantes", icone: "implante", nome: ["Implantes"], resumo: "Reposição de dentes com planejamento por imagem e acompanhamento.", itens: ["Avaliação por imagem", "Unitário ou múltiplo", "Acompanhamento pós-cirúrgico"] },
    { chave: "ortodontia", icone: "ortodontia", nome: ["Ortodontia"], resumo: "Aparelhos fixos e alinhadores para corrigir a posição dos dentes.", itens: ["Aparelho fixo", "Alinhadores transparentes", "Manutenções programadas"] },
    { chave: "prevencao", icone: "prevencao", nome: ["Prevenção"], resumo: "Limpeza profissional e orientação para manter a saúde bucal em dia.", itens: ["Profilaxia", "Aplicação de flúor", "Orientação de higiene"] },
    { chave: "clareamento", icone: "clareamento", nome: ["Clareamento"], resumo: "Técnicas de consultório e caseira supervisionada, com avaliação prévia.", itens: ["Avaliação de sensibilidade", "Clareamento em consultório", "Moldeira para casa"] },
  ],

  diferencial: {
    sobretitulo: "NOSSO DIFERENCIAL",
    titulo: ["Tecnologia, conforto", "e atendimento que", "++valoriza você++"],
    texto: "Estrutura moderna, ambiente acolhedor e\numa equipe preparada para cuidar do seu sorriso\nem todas as fases da vida.",
    itens: [
      ["ambiente", "Ambiente", "acolhedor"],
      ["tecnologia", "Tecnologia", "de ponta"],
      ["equipe", "Equipe", "especializada"],
    ],
  },

  clinica: {
    titulo: "Uma clínica pensada para o seu conforto",
    texto: "Cada etapa é explicada antes de começar. Você entende o diagnóstico, as opções e o tempo de cada tratamento, em um ambiente calmo e com equipamentos atualizados.",
    pontos: ["Explicação clara de cada etapa", "Biossegurança rigorosa", "Atendimento com hora marcada", "Materiais com procedência"],
  },

  perguntas: [
    ["A primeira consulta tem custo?", "Defina aqui a política da clínica para a avaliação inicial."],
    ["Vocês atendem convênios?", "Liste aqui os convênios aceitos ou informe que o atendimento é particular."],
    ["Quanto tempo dura um clareamento?", "O resultado varia conforme hábitos e técnica. A avaliação indica a melhor opção."],
    ["Como funciona o agendamento?", "Escolha o tratamento e o período no formulário. A equipe confirma o horário."],
  ],

  animacao: { flutuacao: 1, paralaxe: 1, brilho: 1 },
};
