document.documentElement.classList.add("js");

const configuracao = window.configuracaoEmpresa;
const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)");
const $ = (seletor, base = document) => base.querySelector(seletor);
const $$ = (seletor, base = document) => [...base.querySelectorAll(seletor)];
const icone = (nome) => `<svg aria-hidden="true"><use href="#i-${nome}"/></svg>`;
const escapar = (texto) =>
  String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const ler = (caminho) => caminho.split(".").reduce((objeto, chave) => objeto?.[chave], configuracao);
function preencher(lista, html) {
  const alvo = $(`[data-lista="${lista}"]`);
  if (alvo) alvo.innerHTML = html;
  return alvo;
}

function aplicarTextos() {
  $$("[data-texto]").forEach((elemento) => {
    const valor = ler(elemento.dataset.texto);
    if (typeof valor === "string") elemento.textContent = valor;
  });
  $$("[data-marca]").forEach((elemento) => (elemento.textContent = configuracao.marca[elemento.dataset.marca]));
  $$("[data-ano]").forEach((elemento) => (elemento.textContent = new Date().getFullYear()));
  $$(".carro-linhas path").forEach((linha, indice) => linha.style.setProperty("--i", indice));
}

function montarConteudo() {
  preencher(
    "vantagens",
    configuracao.inicio.diferenciais.map(([nome, l1, l2]) => `<li>${icone(nome)}<span>${escapar(l1)}<br />${escapar(l2)}</span></li>`).join(""),
  );
  preencher(
    "abas",
    configuracao.servicos
      .map(
        (servico, indice) => `<button class="aba" type="button" role="tab" id="aba-${servico.chave}" aria-selected="${indice === 0}" data-aba="${servico.chave}">
          <span class="aba-icone">${icone(servico.icone)}</span><span><strong>${escapar(servico.nome)}</strong><span>${escapar(servico.resumo)}</span></span></button>`,
      )
      .join(""),
  );
  mostrarServico(configuracao.servicos[0].chave, false);

  const { ilustrativos, itens } = configuracao.pacotes;
  $("[data-aviso-pacotes]").hidden = !ilustrativos;
  preencher(
    "pacotes",
    itens
      .map(
        (pacote, indice) => `<article class="pacote revelar${pacote.destaque ? " destaque" : ""}" style="--atraso:${indice * 110}ms">
          ${pacote.destaque ? '<span class="pacote-selo">Mais escolhido</span>' : ""}
          <h3>${escapar(pacote.nome)}</h3><p>${escapar(pacote.descricao)}</p>
          <p class="pacote-preco">${pacote.preco ? escapar(pacote.preco) : "Sob consulta"}<small>${pacote.preco ? "Valor de referência" : "Valor definido pela empresa"}</small></p>
          <ul>${pacote.itens.map((item) => `<li>${icone("check")}${escapar(item)}</li>`).join("")}</ul>
          <button class="botao ${pacote.destaque ? "botao-claro" : "botao-azul"}" type="button" data-agendar="Pacote ${escapar(pacote.nome)}">
            ${icone("calendario")}Agendar ${escapar(pacote.nome)}</button></article>`,
      )
      .join(""),
  );

  preencher(
    "beneficios",
    configuracao.diferenciais
      .map(
        ([nome, titulo, texto], indice) => `<li class="beneficio revelar" style="--atraso:${indice * 90}ms">${icone(nome)}<h3>${escapar(titulo)}</h3><p>${escapar(texto)}</p></li>`,
      )
      .join(""),
  );
  preencher(
    "etapas",
    configuracao.etapas
      .map(
        ([titulo, texto], indice) => `<li class="etapa revelar" style="--atraso:${indice * 120}ms"><span class="etapa-numero">${indice + 1}</span><h3>${escapar(titulo)}</h3><p>${escapar(texto)}</p></li>`,
      )
      .join(""),
  );
  $(".etapas").style.position = "relative";
  $$(".etapa").forEach((etapa) => (etapa.style.position = "relative"));

  const opcoes = configuracao.servicos.flatMap((servico) => servico.itens.map(([nome]) => nome));
  const pacotes = itens.map((pacote) => `Pacote ${pacote.nome}`);
  preencher(
    "opcoes-servico",
    '<option value="">Selecione</option>' + [...pacotes, ...opcoes].map((nome) => `<option>${escapar(nome)}</option>`).join(""),
  );
  preencher(
    "horarios",
    configuracao.horarios.map(([dias, horas]) => `<span class="horario"><span>${escapar(dias)}</span><b>${escapar(horas)}</b></span>`).join(""),
  );
  preencher(
    "perguntas",
    configuracao.perguntas
      .map(([pergunta, resposta]) => `<details class="pergunta"><summary>${escapar(pergunta)}${icone("mais")}</summary><p>${escapar(resposta)}</p></details>`)
      .join(""),
  );
}

function mostrarServico(chave, animar = true) {
  const servico = configuracao.servicos.find((item) => item.chave === chave);
  if (!servico) return;
  $$(".aba").forEach((aba) => aba.setAttribute("aria-selected", String(aba.dataset.aba === chave)));
  const painel = $(".estacao-painel");
  painel.setAttribute("aria-labelledby", `aba-${chave}`);
  const conteudo = `<h3>${escapar(servico.nome)}</h3><p>${escapar(servico.resumo)}</p>
    <ul class="itens-servico">${servico.itens
      .map(([nome, texto], indice) => `<li style="--i:${indice}">${icone("check")}<strong>${escapar(nome)}</strong><span>${escapar(texto)}</span></li>`)
      .join("")}</ul>
    <button class="botao botao-azul" type="button" data-agendar="${escapar(servico.nome)}">${icone("calendario")}Agendar este serviço</button>`;
  if (!animar || movimentoReduzido.matches) {
    preencher("detalhe", conteudo);
    return;
  }
  painel.classList.remove("enchendo");
  void painel.offsetWidth;
  painel.classList.add("enchendo");
  setTimeout(() => preencher("detalhe", conteudo), 380);
}

const aviso = $("#aviso");
function abrirWhatsApp(mensagem) {
  const numero = String(configuracao.whatsapp || "").replace(/\D/g, "");
  const texto = mensagem ? `${configuracao.mensagemPadrao} ${mensagem}` : configuracao.mensagemPadrao;
  if (numero.length >= 10) {
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer");
    return;
  }
  $("#aviso-titulo").textContent = "WhatsApp ainda não configurado";
  $(".aviso-mensagem").textContent = texto;
  aviso.showModal();
}
$(".aviso-fechar").addEventListener("click", () => aviso.close());
aviso.addEventListener("click", (evento) => evento.target === aviso && aviso.close());

function irParaAgendamento(servico) {
  const select = $('[name="servico"]');
  if (servico) {
    const opcao = [...select.options].find((item) => item.textContent === servico || item.textContent === `Pacote ${servico}`);
    if (opcao) select.value = opcao.value || opcao.textContent;
  }
  $("#contato").scrollIntoView({ behavior: movimentoReduzido.matches ? "auto" : "smooth" });
  setTimeout(() => $('[name="nome"]').focus({ preventScroll: true }), movimentoReduzido.matches ? 0 : 700);
}

const navegacao = $("#navegacao");
const alternarMenu = $(".alternar-menu");
function definirMenu(aberto, devolverFoco = false) {
  navegacao.classList.toggle("aberta", aberto);
  alternarMenu.setAttribute("aria-expanded", String(aberto));
  alternarMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  if (!aberto && devolverFoco) alternarMenu.focus();
}
alternarMenu.addEventListener("click", () => definirMenu(!navegacao.classList.contains("aberta")));
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && navegacao.classList.contains("aberta")) definirMenu(false, true);
});

function observarSecoes() {
  const ids = ["inicio", "servicos", "beneficios", "como-funciona", "contato"];
  const proporcoes = new Map();
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => proporcoes.set(entrada.target.id, entrada.intersectionRatio));
      const [id, valor] = [...proporcoes.entries()].sort((a, b) => b[1] - a[1])[0] || [];
      if (!valor) return;
      $$("a", navegacao).forEach((link) => {
        const ativo = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("ativo", ativo);
        ativo ? link.setAttribute("aria-current", "true") : link.removeAttribute("aria-current");
      });
    },
    { threshold: [0, 0.2, 0.4, 0.7], rootMargin: "-15% 0px -40% 0px" },
  );
  ids.forEach((id) => document.getElementById(id) && observador.observe(document.getElementById(id)));
}

function revelar() {
  const observador = new IntersectionObserver(
    (entradas) =>
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("visivel");
        observador.unobserve(entrada.target);
      }),
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  $$(".revelar").forEach((elemento) => observador.observe(elemento));
}

function prepararFormulario() {
  const formulario = $(".formulario");
  const erro = $(".formulario-erro");
  const data = $('[name="data"]');
  const hoje = new Date();
  data.min = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const campos = $$("[required]", formulario);
    const invalidos = campos.filter((campo) => !campo.value.trim() || (campo.name === "data" && campo.value < data.min));
    campos.forEach((campo) => campo.setAttribute("aria-invalid", String(invalidos.includes(campo))));
    if (invalidos.length) {
      erro.textContent = invalidos.some((campo) => campo.name === "data" && campo.value)
        ? "Escolha uma data a partir de hoje."
        : "Preencha nome, veículo, serviço e data.";
      erro.hidden = false;
      invalidos[0].focus();
      return;
    }
    erro.hidden = true;
    const dados = new FormData(formulario);
    const dataFormatada = dados.get("data").split("-").reverse().join("/");
    abrirWhatsApp(
      `Meu nome é ${dados.get("nome").trim()}. Gostaria de agendar ${dados.get("servico")} para ${dataFormatada}, período da ${dados.get("periodo").toLowerCase()}. Veículo: ${dados.get("veiculo").trim()}.`,
    );
  });
  formulario.addEventListener("input", (evento) => evento.target.value && evento.target.removeAttribute("aria-invalid"));
}

function prepararMapa() {
  const botao = $("[data-mapa]");
  const { linkMapa, rua, cidade } = configuracao.endereco;
  if (linkMapa) {
    Object.assign(botao, { href: linkMapa, target: "_blank", rel: "noopener noreferrer" });
    return;
  }
  botao.addEventListener("click", (evento) => {
    evento.preventDefault();
    $("#aviso-titulo").textContent = "Mapa ainda não configurado";
    $(".aviso-mensagem").textContent = `${rua}, ${cidade}\nInforme o link do mapa em configuracao.js.`;
    aviso.showModal();
  });
}

function ondular(evento) {
  const botao = evento.target.closest(".botao");
  if (!botao || movimentoReduzido.matches) return;
  const limites = botao.getBoundingClientRect();
  const gota = document.createElement("span");
  gota.className = "ondulacao";
  gota.style.left = `${(evento.clientX || limites.left + limites.width / 2) - limites.left}px`;
  gota.style.top = `${(evento.clientY || limites.top + limites.height / 2) - limites.top}px`;
  botao.append(gota);
  gota.addEventListener("animationend", () => gota.remove());
}

document.addEventListener("pointerdown", ondular);
document.addEventListener("click", (evento) => {
  if (navegacao.classList.contains("aberta") && !evento.target.closest(".topo-interno")) definirMenu(false);
  const alvo = evento.target.closest("[data-whatsapp],[data-agendar],[data-aba],#navegacao a");
  if (!alvo) return;
  if (alvo.matches("#navegacao a")) definirMenu(false);
  if (alvo.hasAttribute("data-whatsapp")) abrirWhatsApp(alvo.dataset.whatsapp);
  if (alvo.hasAttribute("data-agendar")) irParaAgendamento(alvo.dataset.agendar);
  if (alvo.dataset.aba) mostrarServico(alvo.dataset.aba);
});
$(".estacao-menu")?.addEventListener("keydown", (evento) => {
  if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(evento.key)) return;
  const abas = $$(".aba");
  const atual = abas.indexOf(document.activeElement);
  if (atual < 0) return;
  evento.preventDefault();
  const proxima = abas[(atual + (["ArrowDown", "ArrowRight"].includes(evento.key) ? 1 : -1) + abas.length) % abas.length];
  proxima.focus();
  mostrarServico(proxima.dataset.aba);
});

const topo = $(".topo");
addEventListener("scroll", () => topo.classList.toggle("rolado", scrollY > 10), { passive: true });

aplicarTextos();
montarConteudo();
prepararFormulario();
prepararMapa();
observarSecoes();
requestAnimationFrame(revelar);
