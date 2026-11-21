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
}

let secaoAtual = 0;
function montarConteudo() {
  preencher(
    "destaques",
    configuracao.inicio.diferenciais
      .map(([nome, titulo, texto]) => `<li>${icone(nome)}<span><strong>${escapar(titulo)}</strong><span>${escapar(texto)}</span></span></li>`)
      .join(""),
  );
  const abas = preencher(
    "abas",
    '<span class="sublinhado" aria-hidden="true"></span>' +
      configuracao.cardapio.secoes
        .map((secao, indice) => `<button class="aba" type="button" role="tab" id="aba-${indice}" aria-selected="${indice === 0}" data-secao="${indice}">${escapar(secao.nome)}</button>`)
        .join(""),
  );
  abas.addEventListener("keydown", (evento) => {
    if (!["ArrowRight", "ArrowLeft"].includes(evento.key)) return;
    const total = configuracao.cardapio.secoes.length;
    const proxima = (secaoAtual + (evento.key === "ArrowRight" ? 1 : -1) + total) % total;
    evento.preventDefault();
    $(`[data-secao="${proxima}"]`).focus();
    mostrarSecao(proxima);
  });
  $("[data-aviso-cardapio]").hidden = !configuracao.cardapio.ilustrativo;
  mostrarSecao(0);

  preencher(
    "especiais",
    configuracao.especiais
      .map(
        ([titulo, texto]) => `<article class="especial"><span class="especial-arte" aria-hidden="true"></span><h3>${escapar(titulo)}</h3><p>${escapar(texto)}</p></article>`,
      )
      .join(""),
  );
  preencher(
    "tempos",
    configuracao.experiencia
      .map(
        ([titulo, texto], indice) => `<li class="tempo revelar" style="--atraso:${indice * 120}ms"><span>${String(indice + 1).padStart(2, "0")}</span><h3>${escapar(titulo)}</h3><p>${escapar(texto)}</p></li>`,
      )
      .join(""),
  );
  preencher("ambientes", configuracao.ambientes.map(([nome, texto]) => `<li><strong>${escapar(nome)}</strong><span>${escapar(texto)}</span></li>`).join(""));
  preencher(
    "horarios",
    configuracao.horarios.map(([dias, horas]) => `<span class="horario"><span>${escapar(dias)}</span><b>${escapar(horas)}</b></span>`).join(""),
  );
  preencher(
    "horarios-reserva",
    '<option value="">Escolha</option>' + configuracao.horariosReserva.map((hora) => `<option>${escapar(hora)}</option>`).join(""),
  );
}

function moverSublinhado() {
  const ativa = $(".aba[aria-selected='true']");
  const caixa = $(".abas-cardapio");
  if (!ativa) return;
  caixa.style.setProperty("--x-sub", `${ativa.offsetLeft}px`);
  caixa.style.setProperty("--largura-sub", `${ativa.offsetWidth}px`);
}
function mostrarSecao(indice) {
  secaoAtual = indice;
  const secao = configuracao.cardapio.secoes[indice];
  $$(".aba").forEach((aba) => {
    const ativa = Number(aba.dataset.secao) === indice;
    aba.setAttribute("aria-selected", String(ativa));
    aba.tabIndex = ativa ? 0 : -1;
  });
  $(".pratos").setAttribute("aria-labelledby", `aba-${indice}`);
  preencher(
    "pratos",
    secao.itens
      .map(
        ([nome, descricao, preco], i) => `<article class="prato" style="--i:${i}"><span class="prato-numero">${String(i + 1).padStart(2, "0")}</span>
          <h3>${escapar(nome)}</h3><p>${escapar(descricao)}</p><p class="prato-preco">${preco ? escapar(preco) : "Valor sob consulta"}</p></article>`,
      )
      .join(""),
  );
  moverSublinhado();
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

const navegacao = $("#navegacao");
const alternarMenu = $(".alternar-menu");
function definirMenu(aberto, devolverFoco = false) {
  navegacao.classList.toggle("aberta", aberto);
  alternarMenu.setAttribute("aria-expanded", String(aberto));
  alternarMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  document.body.style.overflow = aberto ? "hidden" : "";
  if (!aberto && devolverFoco) alternarMenu.focus();
}
alternarMenu.addEventListener("click", () => definirMenu(!navegacao.classList.contains("aberta")));
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && navegacao.classList.contains("aberta")) definirMenu(false, true);
});

function observarSecoes() {
  const ids = ["inicio", "cardapio", "sobre", "eventos", "contato"];
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

function prepararCarrossel() {
  const carrossel = $(".carrossel");
  $$("[data-carrossel]").forEach((botao) =>
    botao.addEventListener("click", () => {
      const passo = carrossel.querySelector(".especial")?.offsetWidth || 300;
      carrossel.scrollBy({ left: Number(botao.dataset.carrossel) * (passo + 24), behavior: movimentoReduzido.matches ? "auto" : "smooth" });
    }),
  );
  carrossel.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowRight" || evento.key === "ArrowLeft") {
      evento.preventDefault();
      $(`[data-carrossel="${evento.key === "ArrowRight" ? 1 : -1}"]`).click();
    }
  });
}

function prepararFormulario() {
  const formulario = $(".formulario");
  const erro = $(".formulario-erro");
  const data = $('[name="data"]');
  const pessoas = $('[name="pessoas"]');
  const hoje = new Date();
  data.min = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  $$("[data-pessoas]").forEach((botao) =>
    botao.addEventListener("click", () => {
      pessoas.value = Math.min(20, Math.max(1, (Number(pessoas.value) || 1) + Number(botao.dataset.pessoas)));
    }),
  );
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const campos = $$("[required]", formulario);
    const invalidos = campos.filter((campo) => !campo.value.trim() || (campo === data && data.value < data.min));
    const quantidade = Number(pessoas.value);
    if (!(quantidade >= 1 && quantidade <= 20)) invalidos.push(pessoas);
    $$("input, select", formulario).forEach((campo) => campo.setAttribute("aria-invalid", String(invalidos.includes(campo))));
    if (invalidos.length) {
      erro.textContent = invalidos.includes(data) && data.value ? "Escolha uma data a partir de hoje." : invalidos.includes(pessoas) ? "Informe de 1 a 20 pessoas." : "Preencha nome, data e horário.";
      erro.hidden = false;
      invalidos[0].focus();
      return;
    }
    erro.hidden = true;
    const dados = new FormData(formulario);
    const dataFormatada = dados.get("data").split("-").reverse().join("/");
    abrirWhatsApp(
      `Gostaria de reservar uma mesa para ${quantidade} ${quantidade > 1 ? "pessoas" : "pessoa"} em ${dataFormatada}, às ${dados.get("horario")}. Ocasião: ${dados.get("ocasiao").toLowerCase()}. Nome: ${dados.get("nome").trim()}.`,
    );
  });
  formulario.addEventListener("input", (evento) => evento.target.value && evento.target.removeAttribute("aria-invalid"));
}

function prepararMapa() {
  const link = $("[data-mapa]");
  const { linkMapa, rua, cidade } = configuracao.endereco;
  if (linkMapa) {
    Object.assign(link, { href: linkMapa, target: "_blank", rel: "noopener noreferrer" });
    return;
  }
  link.addEventListener("click", (evento) => {
    evento.preventDefault();
    $("#aviso-titulo").textContent = "Mapa ainda não configurado";
    $(".aviso-mensagem").textContent = `${rua}, ${cidade}\nInforme o link do mapa em configuracao.js.`;
    aviso.showModal();
  });
}

document.addEventListener("pointermove", (evento) => {
  const botao = evento.target.closest?.(".botao");
  if (!botao) return;
  const caixa = botao.getBoundingClientRect();
  botao.style.setProperty("--bx", `${evento.clientX - caixa.left}px`);
  botao.style.setProperty("--by", `${evento.clientY - caixa.top}px`);
});
document.addEventListener("click", (evento) => {
  const alvo = evento.target.closest("[data-whatsapp],[data-reservar],[data-secao],#navegacao a");
  if (!alvo) return;
  if (alvo.matches("#navegacao a")) definirMenu(false);
  if (alvo.hasAttribute("data-whatsapp")) {
    definirMenu(false);
    abrirWhatsApp(alvo.dataset.whatsapp);
  }
  if (alvo.hasAttribute("data-reservar")) {
    $("#contato").scrollIntoView({ behavior: movimentoReduzido.matches ? "auto" : "smooth" });
    setTimeout(() => $('[name="nome"]').focus({ preventScroll: true }), movimentoReduzido.matches ? 0 : 800);
  }
  if (alvo.dataset.secao) mostrarSecao(Number(alvo.dataset.secao));
});

const topo = $(".topo");
addEventListener("scroll", () => topo.classList.toggle("rolado", scrollY > 10), { passive: true });
addEventListener("resize", moverSublinhado);
document.fonts?.ready.then(moverSublinhado);

aplicarTextos();
montarConteudo();
prepararCarrossel();
prepararFormulario();
prepararMapa();
observarSecoes();
requestAnimationFrame(revelar);
