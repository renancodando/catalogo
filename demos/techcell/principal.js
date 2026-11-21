document.documentElement.classList.add("js");

const configuracao = window.configuracaoEmpresa;
const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)");
const $ = (seletor, base = document) => base.querySelector(seletor);
const $$ = (seletor, base = document) => [...base.querySelectorAll(seletor)];

function icone(nome, classe = "") {
  return `<svg class="${classe}" aria-hidden="true"><use href="#i-${nome}"/></svg>`;
}
function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
function lerCaminho(caminho) {
  return caminho.split(".").reduce((objeto, chave) => objeto?.[chave], configuracao);
}
function preencher(lista, html) {
  const alvo = $(`[data-lista="${lista}"]`);
  if (alvo) alvo.innerHTML = html;
  return alvo;
}

function aplicarTextos() {
  $$("[data-texto]").forEach((elemento) => {
    const valor = lerCaminho(elemento.dataset.texto);
    if (typeof valor === "string") elemento.textContent = valor;
  });
  $$("[data-marca]").forEach((elemento) => {
    elemento.textContent = configuracao.marca[elemento.dataset.marca];
  });
  $$("[data-ano]").forEach((elemento) => (elemento.textContent = new Date().getFullYear()));
  document.title = `${configuracao.marca.inicio}${configuracao.marca.destaque} — ${configuracao.marca.subtitulo}`;
}

function montarAbertura() {
  preencher(
    "garantias",
    configuracao.inicio.diferenciais
      .map(([nomeIcone, linha1, linha2]) => `<li>${icone(nomeIcone)}<span>${escapar(linha1)}<br />${escapar(linha2)}</span></li>`)
      .join(""),
  );
  preencher(
    "categorias",
    configuracao.categorias
      .map(
        (categoria, indice) => `<li class="revelar" style="--atraso:${indice * 90}ms">
          <a class="cartao-categoria" href="#servicos" data-categoria="${categoria.chave}">
            <span class="icone-categoria">${icone(categoria.icone)}</span>
            <span class="texto-categoria"><strong>${escapar(categoria.nome)}</strong><span>${escapar(categoria.resumo)}</span></span>
            ${icone("seta", "seta-categoria")}
          </a></li>`,
      )
      .join(""),
  );
  preencher(
    "indicadores",
    configuracao.indicadores.itens
      .map(([nomeIcone, valor, rotulo]) => `<li>${icone(nomeIcone)}<p><strong>${escapar(valor)}</strong><span>${escapar(rotulo)}</span></p></li>`)
      .join(""),
  );
  $(".nota-ilustrativa").hidden = !configuracao.indicadores.ilustrativos;
}

let categoriaAtual = configuracao.categorias[0].chave;
function montarServicos() {
  preencher(
    "filtros",
    configuracao.categorias
      .map(
        (categoria) => `<button class="filtro" type="button" role="tab" data-filtro="${categoria.chave}"
          aria-selected="${categoria.chave === categoriaAtual}">${icone(categoria.icone)}${escapar(categoria.nome)}</button>`,
      )
      .join(""),
  );
  mostrarServicos(categoriaAtual);
}
function mostrarServicos(chave) {
  categoriaAtual = chave;
  const nomeCategoria = configuracao.categorias.find((categoria) => categoria.chave === chave)?.nome ?? "";
  $$(".filtro").forEach((botao) => botao.setAttribute("aria-selected", String(botao.dataset.filtro === chave)));
  preencher(
    "servicos",
    configuracao.servicos
      .filter((servico) => servico.categoria === chave)
      .map(
        (servico, indice) => `<article class="cartao-servico" style="--i:${indice}">
          <span class="etiqueta">${escapar(nomeCategoria)}</span>
          <h3>${escapar(servico.nome)}</h3>
          <p>${escapar(servico.descricao)}</p>
          <ul>${servico.itens.map((item) => `<li>${icone("check")}${escapar(item)}</li>`).join("")}</ul>
          <div class="rodape-servico"><span>${escapar(servico.prazo)}</span>
            <button class="link-orcamento" type="button" data-whatsapp="Gostaria de um orçamento para ${escapar(servico.nome)} (${escapar(nomeCategoria)}).">Orçamento ${icone("seta")}</button>
          </div></article>`,
      )
      .join(""),
  );
}

function montarSecoes() {
  preencher(
    "etapas",
    configuracao.etapas
      .map(
        ([titulo, texto], indice) => `<li class="etapa revelar" style="--atraso:${indice * 120}ms">
          <span class="etapa-numero">${String(indice + 1).padStart(2, "0")}</span><h3>${escapar(titulo)}</h3><p>${escapar(texto)}</p></li>`,
      )
      .join(""),
  );

  const acessorios = configuracao.servicos.filter((servico) => servico.categoria === "acessorios");
  const artes = [
    '<span class="arte-capa"></span><span class="arte-capa"></span>',
    '<span class="arte-carregador"></span><svg class="arte-cabo" viewBox="0 0 300 170" preserveAspectRatio="none"><path d="M96 92c40 0 50 50 100 40s40-70 120-60"/><path class="cabo-luz" d="M96 92c40 0 50 50 100 40s40-70 120-60"/></svg>',
    '<span class="arte-fone"><span></span><span></span></span>',
  ];
  preencher(
    "acessorios",
    acessorios
      .map(
        (item, indice) => `<article class="item-vitrine revelar" style="--atraso:${indice * 100}ms">
          <div class="vitrine-arte" aria-hidden="true">${artes[indice % artes.length]}</div>
          <div class="vitrine-corpo"><h3>${escapar(item.nome)}</h3><p>${escapar(item.descricao)}</p>
            <button class="link-orcamento" type="button" data-whatsapp="Gostaria de saber a disponibilidade de ${escapar(item.nome.toLowerCase())}.">Consultar disponibilidade ${icone("seta")}</button>
          </div></article>`,
      )
      .join(""),
  );

  preencher("sobre", configuracao.sobre.pontos.map((ponto) => `<li>${icone("check")}${escapar(ponto)}</li>`).join(""));

  preencher(
    "avaliacoes",
    configuracao.avaliacoes
      .map(
        ([nome, servico, texto], indice) => `<figure class="avaliacao revelar" style="--atraso:${indice * 110}ms">
          <span class="selo-exemplo">Exemplo</span>
          <div class="estrelas" aria-label="Nota ilustrativa">${icone("estrela").repeat(5)}</div>
          <blockquote>“${escapar(texto)}”</blockquote>
          <figcaption><footer><strong>${escapar(nome)}</strong><span>${escapar(servico)}</span></footer></figcaption></figure>`,
      )
      .join(""),
  );

  preencher(
    "perguntas",
    configuracao.perguntas
      .map(
        ([pergunta, resposta]) => `<details class="pergunta revelar"><summary>${escapar(pergunta)}${icone("mais")}</summary>
          <div class="resposta"><p>${escapar(resposta)}</p></div></details>`,
      )
      .join(""),
  );

  preencher(
    "horarios",
    configuracao.horarios.map(([dias, horas]) => `<span class="horario"><span>${escapar(dias)}</span><b>${escapar(horas)}</b></span>`).join(""),
  );
}

function linkWhatsApp(mensagem) {
  const numero = String(configuracao.whatsapp || "").replace(/\D/g, "");
  if (numero.length < 10) return null;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
const aviso = $("#aviso-whatsapp");
function abrirWhatsApp(mensagem) {
  const texto = mensagem ? `${configuracao.mensagemPadrao} ${mensagem}` : configuracao.mensagemPadrao;
  const link = linkWhatsApp(texto);
  if (link) {
    window.open(link, "_blank", "noopener,noreferrer");
    return;
  }
  $(".aviso-mensagem", aviso).textContent = texto;
  aviso.showModal();
}
$(".aviso-fechar").addEventListener("click", () => aviso.close());
aviso.addEventListener("click", (evento) => {
  if (evento.target === aviso) aviso.close();
});

const navegacao = $("#navegacao");
const alternarMenu = $(".alternar-menu");
function abrirMenu() {
  navegacao.classList.add("aberta");
  alternarMenu.setAttribute("aria-expanded", "true");
  alternarMenu.setAttribute("aria-label", "Fechar menu");
}
function fecharMenu(devolverFoco = false) {
  navegacao.classList.remove("aberta");
  alternarMenu.setAttribute("aria-expanded", "false");
  alternarMenu.setAttribute("aria-label", "Abrir menu");
  if (devolverFoco) alternarMenu.focus();
}
alternarMenu.addEventListener("click", () => (navegacao.classList.contains("aberta") ? fecharMenu() : abrirMenu()));
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && navegacao.classList.contains("aberta")) fecharMenu(true);
});
document.addEventListener("click", (evento) => {
  if (navegacao.classList.contains("aberta") && !evento.target.closest(".topo-interno")) fecharMenu();
});

function moverIndicador(link) {
  const indicador = $(".indicador", navegacao);
  if (!link || getComputedStyle(indicador).display === "none") return;
  navegacao.style.setProperty("--x-indicador", `${link.offsetLeft}px`);
  navegacao.style.setProperty("--largura-indicador", `${link.offsetWidth}px`);
}
function marcarAtivo(id) {
  let ativo = null;
  $$("a", navegacao).forEach((link) => {
    const corresponde = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("ativo", corresponde);
    if (corresponde) {
      ativo = link;
      link.setAttribute("aria-current", "true");
    } else link.removeAttribute("aria-current");
  });
  moverIndicador(ativo);
}
function observarSecoes() {
  const ids = ["inicio", "servicos", "acessorios", "avaliacoes", "contato"];
  const visiveis = new Map();
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => visiveis.set(entrada.target.id, entrada.intersectionRatio));
      const melhor = [...visiveis.entries()].sort((a, b) => b[1] - a[1])[0];
      if (melhor && melhor[1] > 0) marcarAtivo(melhor[0]);
    },
    { threshold: [0, 0.15, 0.35, 0.6], rootMargin: "-20% 0px -35% 0px" },
  );
  ids.forEach((id) => {
    const secao = document.getElementById(id);
    if (secao) observador.observe(secao);
  });
  requestAnimationFrame(() => moverIndicador($("a.ativo", navegacao)));
  addEventListener("resize", () => moverIndicador($("a.ativo", navegacao)));
}

function revelarAoRolar() {
  const elementos = $$(".revelar");
  if (!("IntersectionObserver" in window)) {
    elementos.forEach((elemento) => elemento.classList.add("visivel"));
    return;
  }
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("visivel");
        observador.unobserve(entrada.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  elementos.forEach((elemento) => observador.observe(elemento));
}

function animarPerguntas() {
  $$(".pergunta").forEach((pergunta) => {
    const resumo = $("summary", pergunta);
    const resposta = $(".resposta", pergunta);
    resumo.addEventListener("click", (evento) => {
      if (movimentoReduzido.matches || !resposta.animate) return;
      evento.preventDefault();
      if (pergunta.open) {
        const altura = resposta.offsetHeight;
        resposta.animate({ height: [`${altura}px`, "0px"], opacity: [1, 0] }, { duration: 320, easing: "ease-in" }).onfinish = () =>
          (pergunta.open = false);
      } else {
        pergunta.open = true;
        const altura = resposta.offsetHeight;
        resposta.animate({ height: ["0px", `${altura}px`], opacity: [0, 1] }, { duration: 420, easing: "cubic-bezier(.22,1,.36,1)" });
      }
    });
  });
}

function acompanharProcesso() {
  const trilha = $(".etapas-trilha");
  const etapas = $$(".etapa");
  let pendente = false;
  function atualizar() {
    pendente = false;
    const caixa = $(".etapas").getBoundingClientRect();
    const progresso = Math.min(1, Math.max(0, (innerHeight * 0.75 - caixa.top) / (caixa.height + innerHeight * 0.25)));
    trilha.style.setProperty("--progresso", progresso.toFixed(3));
    etapas.forEach((etapa, indice) => etapa.classList.toggle("ativa", progresso >= indice / etapas.length + 0.02));
  }
  addEventListener(
    "scroll",
    () => {
      if (!pendente) {
        pendente = true;
        requestAnimationFrame(atualizar);
      }
    },
    { passive: true },
  );
  atualizar();
}

function prepararFormulario() {
  const formulario = $(".formulario");
  const erro = $(".formulario-erro");
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const campos = $$("[required]", formulario);
    const invalidos = campos.filter((campo) => !campo.value.trim());
    campos.forEach((campo) => campo.setAttribute("aria-invalid", String(invalidos.includes(campo))));
    if (invalidos.length) {
      erro.textContent = "Preencha nome, aparelho e a descrição do problema.";
      erro.hidden = false;
      invalidos[0].focus();
      return;
    }
    erro.hidden = true;
    const dados = new FormData(formulario);
    abrirWhatsApp(`Meu nome é ${dados.get("nome").trim()}. Aparelho: ${dados.get("aparelho")}. Problema: ${dados.get("problema").trim()}`);
  });
  formulario.addEventListener("input", (evento) => {
    if (evento.target.value.trim()) evento.target.removeAttribute("aria-invalid");
  });
}

function prepararMapa() {
  const botao = $("[data-mapa]");
  const { linkMapa, rua, cidade } = configuracao.endereco;
  if (linkMapa) {
    botao.href = linkMapa;
    botao.target = "_blank";
    botao.rel = "noopener noreferrer";
  } else {
    botao.addEventListener("click", (evento) => {
      evento.preventDefault();
      $(".aviso-mensagem", aviso).textContent = `${rua}, ${cidade}`;
      $("#aviso-titulo").textContent = "Mapa ainda não configurado";
      aviso.showModal();
      aviso.addEventListener("close", () => ($("#aviso-titulo").textContent = "WhatsApp ainda não configurado"), { once: true });
    });
  }
}

function iluminarCartoes() {
  document.addEventListener("pointermove", (evento) => {
    const cartao = evento.target.closest?.(".cartao-categoria");
    if (!cartao) return;
    const limites = cartao.getBoundingClientRect();
    cartao.style.setProperty("--mx", `${evento.clientX - limites.left}px`);
    cartao.style.setProperty("--my", `${evento.clientY - limites.top}px`);
  });
}

document.addEventListener("click", (evento) => {
  const alvo = evento.target.closest("[data-whatsapp],[data-filtro],[data-categoria],#navegacao a");
  if (!alvo) return;
  if (alvo.matches("#navegacao a")) fecharMenu();
  if (alvo.hasAttribute("data-whatsapp")) abrirWhatsApp(alvo.dataset.whatsapp);
  if (alvo.dataset.filtro) mostrarServicos(alvo.dataset.filtro);
  if (alvo.dataset.categoria) mostrarServicos(alvo.dataset.categoria);
});

const topo = $(".topo");
addEventListener("scroll", () => topo.classList.toggle("rolado", scrollY > 20), { passive: true });

aplicarTextos();
montarAbertura();
montarServicos();
montarSecoes();
animarPerguntas();
acompanharProcesso();
prepararFormulario();
prepararMapa();
iluminarCartoes();
observarSecoes();
requestAnimationFrame(revelarAoRolar);
