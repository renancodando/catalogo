// Informe o número comercial com o código do país e DDD para direcionar os pedidos.
const numeroWhatsApp = "5528992745086";
const menu = document.querySelector("#menu");
const alternar = document.querySelector(".alternar");
const janela = document.querySelector("#detalhes");
const painel = document.querySelector("#painel");
const modelos = {
  assistencia: [
    "Assistência Técnica",
    "Reparo de celulares",
    "Diagnóstico de aparelhos",
    "Manutenção preventiva",
  ],
  odontologia: ["Odontologia", "Avaliação odontológica", "Tratamentos estéticos", "Cuidados preventivos"],
  restaurante: ["Restaurante", "Entradas e porções", "Pratos principais", "Sobremesas"],
  escritorio: ["Escritório", "Áreas de atuação", "Consultoria especializada", "Atendimento personalizado"],
};
// As apresentações comerciais possuem identidade própria e orientam o visitante até o orçamento.
const secoes = {
  sobre: [
    "Sobre a RNC Web",
    [
      [
        "Soluções digitais",
        "Criamos sites profissionais, modernos e personalizados para o seu negócio evoluir no digital.",
      ],
    ],
  ],
};
const apresentacoes = {
  solucoes: {
    etiqueta: "Soluções para o seu negócio",
    titulo: "Seu negócio merece ser <em>bem apresentado.</em>",
    descricao:
      "Do primeiro contato à decisão de compra, criamos a presença digital certa para o momento da sua empresa.",
    itens: [
      {
        nome: "Site Essencial",
        subtitulo: "O primeiro passo para ser lembrado.",
        descricao: "Uma apresentação profissional com serviços, localização, horários e contato facilitado.",
        icone: "i-tela",
        detalhes: ["Página de apresentação", "Contato facilitado", "Ideal para começar"],
      },
      {
        nome: "Site Institucional",
        subtitulo: "Mais presença. Mais credibilidade.",
        descricao:
          "Uma experiência completa para apresentar a empresa, seus diferenciais e áreas de atuação.",
        icone: "i-diamante",
        detalhes: ["Identidade da marca", "Serviços em destaque", "Conteúdo personalizado"],
      },
      {
        nome: "Catálogo Digital",
        subtitulo: "Uma vitrine sempre disponível.",
        descricao: "Produtos e serviços organizados para facilitar a escolha e os pedidos de orçamento.",
        icone: "i-grade",
        detalhes: ["Vitrine organizada", "Exploração interativa", "Pedidos de orçamento"],
      },
    ],
    chamada: "Seu projeto, do seu jeito.",
    complemento: "Condições especiais para projetos selecionados, com opções a partir de R$ 600.",
    botao: "Encontrar meu site ideal",
  },
  servicos: {
    etiqueta: "A diferença está nos detalhes",
    titulo: "Muito além de <em>um site.</em>",
    descricao:
      "Não basta estar na internet. Cada detalhe deve valorizar seu negócio, causar uma ótima primeira impressão e facilitar o contato com quem realmente importa: seu cliente.",
    itens: [
      {
        nome: "Uma identidade só sua",
        subtitulo: "A sua marca em cada detalhe.",
        descricao: "Uma experiência visual criada para refletir a personalidade da empresa.",
        icone: "i-diamante",
        detalhes: ["Visual autoral", "Acabamento profissional", "Experiência memorável"],
      },
      {
        nome: "Visibilidade que faz diferença",
        subtitulo: "Mais fácil de encontrar. Melhor de conhecer.",
        descricao:
          "Uma estrutura organizada para facilitar a descoberta do negócio e o contato dos visitantes.",
        icone: "i-busca",
        detalhes: ["SEO básico", "Contato direto", "Informações acessíveis"],
      },
      {
        nome: "Do primeiro acesso à publicação",
        subtitulo: "Cuidado antes e depois da entrega.",
        descricao:
          "Adaptação aos dispositivos, preparação para publicação e acompanhamento conforme o serviço contratado.",
        icone: "i-escudo",
        detalhes: ["Responsividade", "Apoio na publicação", "Orientação pós-entrega"],
      },
    ],
    chamada: "Não é só sobre ter um site.",
    complemento: "É sobre a forma como as pessoas enxergam o seu negócio.",
    botao: "Quero valorizar minha empresa",
  },
};
function mostrarApresentacao(chave) {
  const secao = apresentacoes[chave];
  if (!secao) return;
  const icone = (nome) => '<svg class="icone" aria-hidden="true"><use href="#' + nome + '"/></svg>';
  const cartoes = secao.itens
    .map((item) => {
      const detalhes = item.detalhes.map((detalhe) => "<li>" + detalhe + "</li>").join("");
      const acao =
        chave === "solucoes"
          ? '<button type="button" class="painel-escolher" data-orcamento="' +
            item.nome +
            '">Solicitar orçamento ' +
            icone("i-diagonal") +
            "</button>"
          : "";
      return (
        '<article class="painel-cartao">' +
        '<div class="painel-topo-cartao"><span class="painel-icone">' +
        icone(item.icone) +
        "</span></div>" +
        '<div class="painel-corpo-cartao"><p class="painel-subtitulo">' +
        item.subtitulo +
        "</p><h3>" +
        item.nome +
        '</h3><p class="painel-descricao">' +
        item.descricao +
        "</p></div>" +
        '<ul class="painel-detalhes">' +
        detalhes +
        "</ul>" +
        acao +
        "</article>"
      );
    })
    .join("");
  const destaque =
    chave === "solucoes"
      ? '<span class="painel-oferta">Condição especial • a partir de R$ 600*</span>'
      : '<span class="painel-oferta">Feito para o seu negócio</span>';
  const observacao =
    chave === "solucoes"
      ? '<p class="painel-ressalva">*Valor inicial promocional sujeito ao escopo e à disponibilidade da oferta.</p>'
      : "";
  abrirPainel(
    '<section class="painel-editorial">' +
      '<header class="painel-cabecalho"><div class="painel-barra"><span class="painel-identificador"><span class="painel-sinal"></span>' +
      secao.etiqueta +
      "</span></div>" +
      '<h2 id="titulo-painel">' +
      secao.titulo +
      "</h2><p>" +
      secao.descricao +
      "</p></header>" +
      '<div class="painel-grade">' +
      cartoes +
      "</div>" +
      '<footer class="painel-rodape"><div>' +
      destaque +
      "<h3>" +
      secao.chamada +
      "</h3><p>" +
      secao.complemento +
      "</p></div>" +
      '<button type="button" class="botao primario painel-cta" data-orcamento>' +
      secao.botao +
      " " +
      icone("i-seta") +
      "</button></footer>" +
      observacao +
      "</section>",
  );
}
function mostrarMenu(aberto) {
  menu.classList.toggle("aberto", aberto);
  alternar.setAttribute("aria-expanded", String(aberto));
  alternar.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
}
alternar.addEventListener("click", () => mostrarMenu(!menu.classList.contains("aberto")));
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && menu.classList.contains("aberto")) {
    mostrarMenu(false);
    alternar.focus();
  }
});
function abrirPainel(conteudo) {
  painel.innerHTML = conteudo;
  janela.classList.toggle("janela-modelo", Boolean(painel.querySelector(".foto-painel")));
  janela.classList.toggle("janela-ampla", conteudo.includes('class="painel-editorial"'));
  if (!janela.open) janela.showModal();
  janela.scrollTop = 0;
  janela.querySelector(".fechar").focus();
}
const botaoPedido = '<button class="botao primario" data-orcamento>Solicitar Orçamento</button>';
function mostrarModelo(chave) {
  const [nome, ...itens] = modelos[chave];
  const lista = itens.map((item) => "<li>" + item + "</li>").join("");
  abrirPainel(
    '<img class="foto-painel" src="recursos/' +
      chave +
      '.webp" alt=""><section class="conteudo-painel"><p class="rotulo">Demonstração do modelo</p><h2 id="titulo-painel">' +
      nome +
      "</h2><p>" +
      document.querySelector('[data-modelo="' + chave + '"] .legenda>span').textContent +
      '</p><ul class="itens-modelo">' +
      lista +
      '</ul><button class="botao primario" data-orcamento="' +
      chave +
      '">Quero este modelo</button></section>',
  );
}
function mostrarOrcamento(escolha = "") {
  const todasOpcoes = [
    ...Object.entries(modelos).map(([chave, [nome]]) => ({ chave, nome })),
    ...["Site Essencial", "Site Institucional", "Catálogo Digital"].map((nome) => ({ chave: nome, nome })),
  ];
  const opcoes = todasOpcoes
    .map(({ chave, nome }) => "<option " + (chave === escolha ? "selected" : "") + ">" + nome + "</option>")
    .join("");
  abrirPainel(
    '<section class="conteudo-painel"><p class="rotulo">Contato</p><h2 id="titulo-painel">Seu projeto começa aqui</h2><p>Prepare seu pedido de orçamento para enviar pelo WhatsApp.</p><form><label>Seu nome<input name="nome" autocomplete="name" required maxlength="100"></label><label>Modelo de interesse<select name="modelo"><option>Site personalizado</option>' +
      opcoes +
      '</select></label><label>O que você precisa?<textarea name="mensagem" rows="3" maxlength="1500" placeholder="Conte um pouco sobre seu negócio"></textarea></label><button class="botao primario">Continuar no WhatsApp</button></form></section>',
  );
}
document.addEventListener("click", (evento) => {
  const alvo = evento.target.closest("button,a");
  if (!alvo) return;
  if (menu.contains(alvo)) mostrarMenu(false);
  if (alvo.hasAttribute("data-orcamento")) mostrarOrcamento(alvo.dataset.orcamento);
  if (alvo.dataset.modelo) {
    if (evento.pointerType === "touch" && !movimentoReduzido.matches) navigator.vibrate?.(8);
    mostrarModelo(alvo.dataset.modelo);
  }
  if (alvo.dataset.secao) {
    const chave = alvo.dataset.secao;
    if (apresentacoes[chave]) {
      mostrarApresentacao(chave);
    } else if (secoes[chave]) {
      const [titulo, blocos] = secoes[chave];
      abrirPainel(
        '<section class="conteudo-painel"><p class="rotulo">RNC Web</p><h2 id="titulo-painel">' +
          titulo +
          "</h2><dl>" +
          blocos.map(([t, d]) => "<dt>" + t + "</dt><dd>" + d + "</dd>").join("") +
          "</dl>" +
          botaoPedido +
          "</section>",
      );
    }
  }
});
janela.querySelector(".fechar").addEventListener("click", () => janela.close());
janela.addEventListener("click", (evento) => {
  if (evento.target === janela) janela.close();
});
painel.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const dados = new FormData(evento.target);
  const mensagem =
    "Olá, RNC Web! Meu nome é " +
    dados.get("nome").trim() +
    ". Gostaria de um orçamento para " +
    dados.get("modelo") +
    ". " +
    dados.get("mensagem").trim();
  window.open(
    "https://wa.me/" + numeroWhatsApp + "?text=" + encodeURIComponent(mensagem),
    "_blank",
    "noopener,noreferrer",
  );
});
const catalogo = document.querySelector("#catalogo");
function atualizarNavegacao() {
  const noCatalogo = window.scrollY > 60 && catalogo.getBoundingClientRect().top < innerHeight * 0.8;
  menu.querySelector('[href="#inicio"]').classList.toggle("atual", !noCatalogo);
  menu.querySelector('[href="#catalogo"]').classList.toggle("atual", noCatalogo);
}
window.addEventListener("scroll", atualizarNavegacao, { passive: true });

// Cada placa de vidro orienta a normal e o ponto de brilho pelo contato local.
const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)");
for (const base of document.querySelectorAll(".base-modelo")) {
  function iluminar(evento) {
    if (movimentoReduzido.matches) return;
    const limites = base.getBoundingClientRect();
    const x = (evento.clientX - limites.left) / limites.width;
    const y = (evento.clientY - limites.top) / limites.height;
    base.style.setProperty("--horizontal", (x - 0.5) * 17 + "deg");
    base.style.setProperty("--vertical", (0.5 - y) * 14 + "deg");
    base.style.setProperty("--luz-x", x * 100 + "%");
    base.style.setProperty("--luz-y", y * 100 + "%");
  }
  function repousar() {
    for (const nome of ["--horizontal", "--vertical", "--luz-x", "--luz-y"]) base.style.removeProperty(nome);
  }
  base.addEventListener("pointermove", iluminar);
  base.addEventListener("pointerdown", iluminar);
  for (const evento of ["pointerleave", "pointercancel", "pointerup"])
    base.addEventListener(evento, repousar);
}
