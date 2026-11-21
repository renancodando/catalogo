document.documentElement.classList.add("js");

const configuracao = window.configuracaoEmpresa;
const ajustes = configuracao.animacao;
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
document.documentElement.style.setProperty("--velocidade-ondas", ajustes.velocidadeOndas);
document.documentElement.style.setProperty("--luz", ajustes.intensidadeLuz);

function aplicarTextos() {
  $$("[data-texto]").forEach((elemento) => {
    const valor = ler(elemento.dataset.texto);
    if (typeof valor === "string") elemento.textContent = valor;
  });
  $$("[data-marca]").forEach((elemento) => (elemento.textContent = configuracao.marca[elemento.dataset.marca]));
  $$("[data-ano]").forEach((elemento) => (elemento.textContent = new Date().getFullYear()));
}

const todosOsItens = new Map();
const pedido = new Map();
function montarConteudo() {
  preencher(
    "diferenciais",
    configuracao.inicio.diferenciais.map(([nome, l1, l2]) => `<li>${icone(nome)}<span>${escapar(l1)}<br />${escapar(l2)}</span></li>`).join(""),
  );
  const hoje = new Date().getDay();
  preencher(
    "dias",
    configuracao.pratosDoDia
      .map(
        ([dia], indice) =>
          `<button class="dia${indice === hoje ? " hoje" : ""}" type="button" role="tab" id="dia-${indice}" aria-selected="${indice === hoje}" data-dia="${indice}">${escapar(dia.slice(0, 3))}</button>`,
      )
      .join(""),
  );
  mostrarDia(hoje, false);

  $("[data-aviso-cardapio]").hidden = !configuracao.cardapio.ilustrativo;
  preencher(
    "cardapio",
    configuracao.cardapio.categorias
      .map(
        (categoria, indice) => `<div class="categoria revelar" style="--atraso:${indice * 90}ms"><h3>${escapar(categoria.nome)}</h3>
        ${categoria.itens
          .map((item) => {
            todosOsItens.set(item.id, item);
            return `<div class="item"><strong>${escapar(item.nome)}</strong><p>${escapar(item.descricao)}</p>
              <span class="item-preco">${item.preco ? escapar(item.preco) : "Consultar valor"}</span>
              <div class="quantidade" data-item="${item.id}">
                <button type="button" data-menos aria-label="Remover ${escapar(item.nome)}">−</button>
                <output aria-live="polite" aria-label="Quantidade de ${escapar(item.nome)}">0</output>
                <button type="button" data-mais aria-label="Adicionar ${escapar(item.nome)}">+</button>
              </div></div>`;
          })
          .join("")}</div>`,
      )
      .join(""),
  );

  preencher(
    "atendimento",
    configuracao.atendimento.map(([nome, titulo, texto]) => `<li>${icone(nome)}<div><strong>${escapar(titulo)}</strong><span>${escapar(texto)}</span></div></li>`).join(""),
  );
  preencher("modos", configuracao.atendimento.map(([, titulo]) => `<option>${escapar(titulo)}</option>`).join(""));
  preencher("sobre", configuracao.sobre.numeros.map(([titulo, texto]) => `<li><strong>${escapar(titulo)}</strong><span>${escapar(texto)}</span></li>`).join(""));
  preencher(
    "horarios",
    configuracao.horarios.map(([dias, horas]) => `<span class="horario"><span>${escapar(dias)}</span><b>${escapar(horas)}</b></span>`).join(""),
  );
}

let diaAtual = 0;
function mostrarDia(indice, animar = true) {
  diaAtual = indice;
  const [, nome, texto] = configuracao.pratosDoDia[indice];
  $$(".dia").forEach((botao) => {
    const ativo = Number(botao.dataset.dia) === indice;
    botao.setAttribute("aria-selected", String(ativo));
    botao.tabIndex = ativo ? 0 : -1;
  });
  const cartao = $(".prato-dia");
  cartao.setAttribute("aria-labelledby", `dia-${indice}`);
  $(".prato-dia-nome").textContent = nome;
  $(".prato-dia-texto").textContent = texto;
  $(".selo-hoje").hidden = indice !== new Date().getDay();
  if (animar && !movimentoReduzido.matches) {
    cartao.classList.remove("trocou");
    void cartao.offsetWidth;
    cartao.classList.add("trocou");
  }
}

function alterarPedido(id, delta, nomeLivre) {
  const atual = pedido.get(id)?.quantidade ?? 0;
  const quantidade = Math.max(0, Math.min(20, atual + delta));
  const nome = nomeLivre ?? todosOsItens.get(id)?.nome ?? id;
  if (quantidade === 0) pedido.delete(id);
  else pedido.set(id, { nome, quantidade, preco: todosOsItens.get(id)?.preco ?? "" });
  const controle = $(`.quantidade[data-item="${id}"]`);
  if (controle) {
    $("output", controle).textContent = quantidade;
    if (!movimentoReduzido.matches) {
      controle.classList.remove("pulsou");
      void controle.offsetWidth;
      controle.classList.add("pulsou");
    }
  }
  atualizarComanda();
}

function valorNumerico(preco) {
  const numero = Number(String(preco).replace(/[^\d,]/g, "").replace(",", "."));
  return Number.isFinite(numero) && numero > 0 ? numero : null;
}
function atualizarComanda() {
  const itens = [...pedido.values()];
  const total = itens.reduce((soma, item) => soma + item.quantidade, 0);
  $(".comanda-contagem").textContent = `${total} ${total === 1 ? "item" : "itens"}`;
  $(".comanda-itens").innerHTML = itens.map((item) => `<li><span><b>${item.quantidade}×</b> ${escapar(item.nome)}</span></li>`).join("");
  $(".comanda-vazia").hidden = itens.length > 0;
  const valores = itens.map((item) => valorNumerico(item.preco));
  const totalEl = $(".comanda-total");
  if (itens.length && valores.every((valor) => valor !== null)) {
    const soma = itens.reduce((acumulado, item, i) => acumulado + valores[i] * item.quantidade, 0);
    totalEl.textContent = `Total estimado: ${soma.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
    totalEl.hidden = false;
  } else totalEl.hidden = true;
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

function prepararFormulario() {
  const formulario = $(".formulario");
  const erro = $(".formulario-erro");
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nome = $('[name="nome"]', formulario);
    const semItens = pedido.size === 0;
    nome.setAttribute("aria-invalid", String(!nome.value.trim()));
    if (semItens || !nome.value.trim()) {
      erro.textContent = semItens ? "Adicione pelo menos um prato ao pedido." : "Informe seu nome.";
      erro.hidden = false;
      if (!nome.value.trim()) nome.focus();
      return;
    }
    erro.hidden = true;
    const dados = new FormData(formulario);
    const linhas = [...pedido.values()].map((item) => `• ${item.quantidade}× ${item.nome}`).join("\n");
    const obs = dados.get("obs").trim();
    abrirWhatsApp(`Meu nome é ${nome.value.trim()} e gostaria de fazer um pedido (${dados.get("modo")}):\n${linhas}${obs ? `\nObservações: ${obs}` : ""}`);
  });
  formulario.addEventListener("input", (evento) => evento.target.value && evento.target.removeAttribute("aria-invalid"));
}

function prepararMapa() {
  const { linkMapa, rua, cidade } = configuracao.endereco;
  $$("[data-mapa]").forEach((link) => {
    if (linkMapa) {
      Object.assign(link, { href: linkMapa, target: "_blank", rel: "noopener noreferrer" });
      return;
    }
    if (!link.hasAttribute("data-mapa-principal")) return;
    link.addEventListener("click", (evento) => {
      evento.preventDefault();
      $("#aviso-titulo").textContent = "Mapa ainda não configurado";
      $(".aviso-mensagem").textContent = `${rua}, ${cidade}\nInforme o link do mapa em configuracao.js.`;
      aviso.showModal();
    });
  });
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
  const ids = ["inicio", "cardapio", "sobre", "contato"];
  const proporcoes = new Map();
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => proporcoes.set(entrada.target.id, entrada.intersectionRatio));
      const [id, valor] = [...proporcoes.entries()].sort((a, b) => b[1] - a[1])[0] || [];
      if (!valor) return;
      $$("a:not(.botao)", navegacao).forEach((link) => {
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
    { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
  );
  $$(".revelar").forEach((elemento) => observador.observe(elemento));
}

function animarMesa() {
  const mesa = $("#mesa-posta");
  const camadas = $(".mesa-camadas", mesa);
  const prato = $(".prato", mesa);
  const svgNS = "http://www.w3.org/2000/svg";
  const reflexos = $$(".talher", mesa).map((talher, indice) => {
    const metal = $(".metal", talher);
    const clip = document.createElementNS(svgNS, "clipPath");
    clip.id = `recorte-talher-${indice}`;
    const forma = metal.cloneNode();
    forma.removeAttribute("class");
    forma.removeAttribute("fill");
    clip.append(forma);
    $("defs", talher)?.append(clip) ?? talher.prepend(clip);
    const faixa = $(".reflexo", talher);
    faixa.setAttribute("clip-path", `url(#${clip.id})`);
    return faixa;
  });
  requestAnimationFrame(() => mesa.classList.add("pronta"));

  const alvo = { x: 0, y: 0 };
  const atual = { x: 0, y: 0 };
  addEventListener("pointermove", (evento) => {
    if (evento.pointerType !== "mouse") return;
    alvo.x = (evento.clientX / innerWidth - 0.5) * 2;
    alvo.y = (evento.clientY / innerHeight - 0.5) * 2;
  });
  addEventListener(
    "deviceorientation",
    (evento) => {
      if (evento.gamma == null) return;
      alvo.x = Math.max(-1, Math.min(1, evento.gamma / 30));
      alvo.y = Math.max(-1, Math.min(1, (evento.beta - 45) / 30));
    },
    { passive: true },
  );

  function aplicar(t) {
    const balanco = movimentoReduzido.matches ? 0 : 1;
    const inclinacao = ajustes.inclinacaoPrato;
    const ix = (-atual.y * inclinacao + Math.sin(t * 0.5) * 1.6 * balanco).toFixed(2);
    const iy = (atual.x * inclinacao + Math.cos(t * 0.4) * 1.8 * balanco).toFixed(2);
    camadas.style.setProperty("--inclina-x", `${ix}deg`);
    camadas.style.setProperty("--inclina-y", `${iy}deg`);
    prato.style.setProperty("--luz-x", `${36 - atual.x * 10}%`);
    prato.style.setProperty("--luz-y", `${30 - atual.y * 10}%`);
    prato.style.setProperty("--brilho-x", `${30 + atual.x * 14 + Math.sin(t * 0.3) * 4 * balanco}%`);
    prato.style.setProperty("--brilho-y", `${16 + atual.y * 8}%`);
    prato.style.setProperty("--giro-filete", `${((t * 12 * ajustes.velocidadeReflexo) % 360).toFixed(1)}deg`);
    const ciclo = ((t * 0.16 * ajustes.velocidadeReflexo) % 1.4) - 0.2;
    reflexos.forEach((faixa, i) => faixa.setAttribute("y", (ciclo * 440 - 60 + i * 40 + atual.y * 30).toFixed(1)));
  }

  if (movimentoReduzido.matches) {
    aplicar(0);
    return;
  }
  let quadro = 0;
  let ativo = false;
  const inicio = performance.now();
  function laco(agora) {
    atual.x += (alvo.x - atual.x) * 0.06;
    atual.y += (alvo.y - atual.y) * 0.06;
    aplicar((agora - inicio) / 1000);
    quadro = requestAnimationFrame(laco);
  }
  const iniciar = () => {
    if (ativo) return;
    ativo = true;
    quadro = requestAnimationFrame(laco);
  };
  const parar = () => {
    ativo = false;
    cancelAnimationFrame(quadro);
  };
  new IntersectionObserver(([entrada]) => (entrada.isIntersecting && !document.hidden ? iniciar() : parar())).observe(mesa);
  document.addEventListener("visibilitychange", () => (document.hidden ? parar() : iniciar()));
}

document.addEventListener("click", (evento) => {
  if (navegacao.classList.contains("aberta") && !evento.target.closest(".topo-interno")) definirMenu(false);
  const alvo = evento.target.closest("[data-whatsapp],[data-dia],[data-mais],[data-menos],[data-adicionar-dia],#navegacao a");
  if (!alvo) return;
  if (alvo.matches("#navegacao a")) definirMenu(false);
  if (alvo.hasAttribute("data-whatsapp")) abrirWhatsApp(alvo.dataset.whatsapp);
  if (alvo.dataset.dia) mostrarDia(Number(alvo.dataset.dia));
  if (alvo.hasAttribute("data-mais") || alvo.hasAttribute("data-menos")) {
    alterarPedido(alvo.closest(".quantidade").dataset.item, alvo.hasAttribute("data-mais") ? 1 : -1);
  }
  if (alvo.hasAttribute("data-adicionar-dia")) {
    const [dia, nome] = configuracao.pratosDoDia[diaAtual];
    alterarPedido(`dia-${diaAtual}`, 1, `Prato do dia (${dia}): ${nome}`);
    alvo.textContent = "Adicionado à comanda ✓";
    setTimeout(() => (alvo.textContent = "Adicionar ao pedido"), 1600);
  }
});
$(".dias").addEventListener("keydown", (evento) => {
  if (!["ArrowRight", "ArrowLeft"].includes(evento.key)) return;
  evento.preventDefault();
  const proximo = (diaAtual + (evento.key === "ArrowRight" ? 1 : -1) + 7) % 7;
  $(`[data-dia="${proximo}"]`).focus();
  mostrarDia(proximo);
});

const topo = $(".topo");
addEventListener("scroll", () => topo.classList.toggle("rolado", scrollY > 10), { passive: true });

aplicarTextos();
montarConteudo();
atualizarComanda();
prepararFormulario();
prepararMapa();
observarSecoes();
animarMesa();
requestAnimationFrame(revelar);
