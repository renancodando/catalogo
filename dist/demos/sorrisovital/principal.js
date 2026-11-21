document.documentElement.classList.add("js");

const configuracao = window.configuracaoEmpresa;
const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)");
const $ = (seletor, base = document) => base.querySelector(seletor);
const $$ = (seletor, base = document) => [...base.querySelectorAll(seletor)];
const icone = (nome, classe = "") => `<svg class="${classe}" aria-hidden="true"><use href="#i-${nome}"/></svg>`;
const escapar = (texto) =>
  String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const ler = (caminho) => caminho.split(".").reduce((objeto, chave) => objeto?.[chave], configuracao);
function preencher(lista, html) {
  const alvo = $(`[data-lista="${lista}"]`);
  if (alvo) alvo.innerHTML = html;
  return alvo;
}
document.documentElement.style.setProperty("--velocidade-ondas", configuracao.animacao.velocidadeOndas);

function aplicarTextos() {
  $$("[data-texto]").forEach((elemento) => {
    const valor = ler(elemento.dataset.texto);
    if (typeof valor === "string") elemento.textContent = valor;
  });
  $$("[data-marca]").forEach((elemento) => (elemento.textContent = configuracao.marca[elemento.dataset.marca]));
  $$("[data-ano]").forEach((elemento) => (elemento.textContent = new Date().getFullYear()));
}

function montarConteudo() {
  preencher(
    "garantias",
    configuracao.inicio.diferenciais
      .map(([nome, linha1, linha2]) => `<li>${icone(nome)}<span>${escapar(linha1)}<strong>${escapar(linha2)}</strong></span></li>`)
      .join(""),
  );
  preencher(
    "tratamentos",
    configuracao.tratamentos
      .map(
        (tratamento, indice) => `<article class="tratamento revelar" style="--atraso:${indice * 100}ms" id="tratamento-${tratamento.chave}">
          <div class="tratamento-arte arte-${tratamento.chave}" aria-hidden="true">${icone("dente", "arte-dente")}<span class="arte-extra"></span></div>
          <h3>${escapar(tratamento.nome)}</h3><p>${escapar(tratamento.resumo)}</p>
          <ul>${tratamento.itens.map((item) => `<li>${icone("check")}${escapar(item)}</li>`).join("")}</ul>
          <button class="link-agendar" type="button" data-agendar="${escapar(tratamento.nome)}">Agendar avaliação ${icone("seta")}</button>
        </article>`,
      )
      .join(""),
  );
  preencher(
    "fases",
    '<span class="marcador-fase" aria-hidden="true"></span>' +
      configuracao.fases
        .map(
          (fase, indice) =>
            `<button class="fase" type="button" role="tab" id="fase-${indice}" aria-selected="${indice === 0}" data-fase="${indice}">${escapar(fase.nome)}</button>`,
        )
        .join(""),
  );
  mostrarFase(0, false);
  preencher(
    "sobre",
    configuracao.sobre.pontos.map(([titulo, texto]) => `<li>${icone("check")}<strong>${escapar(titulo)}</strong><span>${escapar(texto)}</span></li>`).join(""),
  );
  preencher(
    "diferenciais",
    configuracao.diferenciais
      .map(
        ([nome, titulo, texto], indice) =>
          `<li class="diferencial revelar" style="--atraso:${indice * 90}ms">${icone(nome)}<h3>${escapar(titulo)}</h3><p>${escapar(texto)}</p></li>`,
      )
      .join(""),
  );
  preencher(
    "perguntas",
    configuracao.perguntas
      .map(
        ([pergunta, resposta]) =>
          `<details class="pergunta revelar"><summary>${escapar(pergunta)}${icone("mais")}</summary><div class="resposta"><p>${escapar(resposta)}</p></div></details>`,
      )
      .join(""),
  );
  preencher(
    "opcoes",
    '<option value="">Selecione</option><option>Avaliação geral</option>' +
      configuracao.tratamentos.map((tratamento) => `<option>${escapar(tratamento.nome)}</option>`).join(""),
  );
  preencher(
    "horarios",
    configuracao.horarios.map(([dias, horas]) => `<span class="horario"><span>${escapar(dias)}</span><b>${escapar(horas)}</b></span>`).join(""),
  );
}

function mostrarFase(indice, animar = true) {
  const fase = configuracao.fases[indice];
  const caixa = $(".linha-vida-botoes");
  caixa.style.setProperty("--indice-fase", indice);
  caixa.style.setProperty("--coluna-fase", indice % 2);
  caixa.style.setProperty("--linha-fase", Math.floor(indice / 2));
  $$(".fase").forEach((botao) => botao.setAttribute("aria-selected", String(Number(botao.dataset.fase) === indice)));
  $(".linha-vida-painel").setAttribute("aria-labelledby", `fase-${indice}`);
  $(".fase-idade").textContent = fase.idade;
  const texto = $(".fase-texto");
  texto.textContent = fase.texto;
  if (animar && !movimentoReduzido.matches) {
    texto.classList.remove("trocando");
    void texto.offsetWidth;
    texto.classList.add("trocando");
  }
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

function irParaContato(interesse) {
  const select = $('[name="interesse"]');
  const opcao = [...select.options].find((item) => item.textContent === interesse);
  select.value = opcao ? opcao.textContent : "Avaliação geral";
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

function moverPilula(link) {
  if (!link) return;
  navegacao.style.setProperty("--x-pilula", `${link.offsetLeft}px`);
  navegacao.style.setProperty("--largura-pilula", `${link.offsetWidth}px`);
}
function observarSecoes() {
  const ids = ["inicio", "tratamentos", "sobre", "duvidas", "contato"];
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
        if (ativo) moverPilula(link);
      });
    },
    { threshold: [0, 0.2, 0.4, 0.7], rootMargin: "-15% 0px -40% 0px" },
  );
  ids.forEach((id) => document.getElementById(id) && observador.observe(document.getElementById(id)));
  const atualizar = () => moverPilula($("a.ativo", navegacao));
  document.fonts?.ready.then(atualizar);
  addEventListener("resize", atualizar);
  atualizar();
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

function animarPerguntas() {
  $$(".pergunta").forEach((pergunta) => {
    const resposta = $(".resposta", pergunta);
    $("summary", pergunta).addEventListener("click", (evento) => {
      if (movimentoReduzido.matches || !resposta.animate) return;
      evento.preventDefault();
      if (pergunta.open) {
        resposta.animate({ height: [`${resposta.offsetHeight}px`, "0px"], opacity: [1, 0] }, { duration: 300, easing: "ease-in" }).onfinish = () =>
          (pergunta.open = false);
      } else {
        pergunta.open = true;
        resposta.animate({ height: ["0px", `${resposta.offsetHeight}px`], opacity: [0, 1] }, { duration: 450, easing: "cubic-bezier(.25,.8,.25,1)" });
      }
    });
  });
}

function prepararFormulario() {
  const formulario = $(".formulario");
  const erro = $(".formulario-erro");
  const telefone = $('[name="telefone"]');
  telefone.addEventListener("input", () => {
    const digitos = telefone.value.replace(/\D/g, "").slice(0, 11);
    let formatado = digitos;
    if (digitos.length > 2) formatado = `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
    if (digitos.length > 7) formatado = `(${digitos.slice(0, 2)}) ${digitos.slice(2, digitos.length - 4)}-${digitos.slice(-4)}`;
    telefone.value = formatado;
  });
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const campos = $$("[required]", formulario);
    const invalidos = campos.filter((campo) => !campo.value.trim() || (campo === telefone && telefone.value.replace(/\D/g, "").length < 10));
    campos.forEach((campo) => campo.setAttribute("aria-invalid", String(invalidos.includes(campo))));
    if (invalidos.length) {
      erro.textContent = invalidos.includes(telefone) && telefone.value ? "Informe um telefone com DDD." : "Preencha nome, telefone e interesse.";
      erro.hidden = false;
      invalidos[0].focus();
      return;
    }
    erro.hidden = true;
    const dados = new FormData(formulario);
    abrirWhatsApp(
      `Meu nome é ${dados.get("nome").trim()}, telefone ${dados.get("telefone")}. Gostaria de agendar: ${dados.get("interesse")}. Melhor período: ${dados.get("periodo").toLowerCase()}.`,
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

document.addEventListener("click", (evento) => {
  if (navegacao.classList.contains("aberta") && !evento.target.closest(".topo-interno")) definirMenu(false);
  const alvo = evento.target.closest("[data-agendar],[data-fase],#navegacao a");
  if (!alvo) return;
  if (alvo.matches("#navegacao a")) definirMenu(false);
  if (alvo.hasAttribute("data-agendar")) irParaContato(alvo.dataset.agendar);
  if (alvo.dataset.fase) mostrarFase(Number(alvo.dataset.fase));
});
$(".linha-vida-botoes").addEventListener("keydown", (evento) => {
  if (!["ArrowRight", "ArrowLeft"].includes(evento.key)) return;
  const atual = Number(document.activeElement.dataset.fase);
  if (Number.isNaN(atual)) return;
  evento.preventDefault();
  const total = configuracao.fases.length;
  const proxima = (atual + (evento.key === "ArrowRight" ? 1 : -1) + total) % total;
  $(`[data-fase="${proxima}"]`).focus();
  mostrarFase(proxima);
});

const topo = $(".topo");
addEventListener("scroll", () => topo.classList.toggle("rolado", scrollY > 10), { passive: true });

aplicarTextos();
montarConteudo();
animarPerguntas();
prepararFormulario();
prepararMapa();
observarSecoes();
requestAnimationFrame(revelar);
