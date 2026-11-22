(() => {
  const config = window.configuracaoEmpresa;
  const $ = (seletor, base = document) => base.querySelector(seletor);
  const $$ = (seletor, base = document) => [...base.querySelectorAll(seletor)];
  const ler = (caminho) => caminho.split(".").reduce((valor, chave) => valor?.[chave], config);
  const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)");
  const icone = (nome) => `<svg aria-hidden="true"><use href="#i-${nome}" /></svg>`;
  const escapar = (texto) => String(texto).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  const ajustes = config.animacao ?? {};
  document.documentElement.style.setProperty("--flutuacao", ajustes.flutuacao ?? 1);
  document.documentElement.style.setProperty("--velocidade-brilho", ajustes.velocidadeBrilho ?? 1);

  $$("[data-texto]").forEach((el) => {
    const valor = ler(el.dataset.texto);
    if (valor) el.textContent = valor;
  });
  $$("[data-marca]").forEach((el) => (el.textContent = config.marca[el.dataset.marca]));
  $$("[data-endereco]").forEach((el) => (el.textContent = config.endereco[el.dataset.endereco] ?? ""));
  $$("[data-ano]").forEach((el) => (el.textContent = new Date().getFullYear()));
  document.title = config.nomeEmpresa;

  const listas = {
    tour: () => config.inicio.botaoSecundario.map((linha) => `<span>${escapar(linha)}</span>`).join(""),
    chamada: () => config.inicio.chamadaFinal.map((linha) => `<span>${escapar(linha)}</span>`).join(""),
    destaques: () =>
      config.destaques
        .map(
          (item) => `<li><button class="destaque-cartao" type="button" data-alvo="${escapar(item.alvo)}">
            ${icone(item.icone)}
            <span class="destaque-texto"><strong>${escapar(item.titulo)}</strong>${item.texto ? `<small>${escapar(item.texto)}</small>` : ""}</span>
            <span class="seta-circulo">${icone("seta")}</span></button></li>`,
        )
        .join(""),
    garantias: () =>
      config.inicio.garantias.map(([ic, titulo, texto]) => `<li>${icone(ic)}<span><strong>${escapar(titulo)}</strong>${escapar(texto)}</span></li>`).join(""),
    tratamentos: () =>
      config.tratamentos
        .map(
          (t) => `<article class="tratamento revelar" id="tratamento-${escapar(t.chave)}">
            <span class="tratamento-icone">${icone(t.icone)}</span>
            <h3>${escapar(t.nome)}</h3>
            <p>${escapar(t.resumo)}</p>
            <ul>${t.itens.map((item) => `<li>${icone("check")}${escapar(item)}</li>`).join("")}</ul>
            <button class="botao botao-contorno" type="button" data-agendar="${escapar(t.chave)}">Agendar ${icone("seta")}</button>
          </article>`,
        )
        .join(""),
    pontos: () => config.sobre.pontos.map((p) => `<li>${icone("check")}${escapar(p)}</li>`).join(""),
    equipe: () =>
      config.equipe.pessoas
        .map(([nome, area]) => `<article class="pessoa revelar"><span class="avatar" aria-hidden="true"></span><strong>${escapar(nome)}</strong><span>${escapar(area)}</span></article>`)
        .join(""),
    perguntas: () =>
      config.perguntas.map(([p, r]) => `<details class="pergunta"><summary>${escapar(p)}${icone("mais")}</summary><p>${escapar(r)}</p></details>`).join(""),
    horarios: () => config.horarios.map(([dia, hora]) => `<span>${escapar(dia)}</span><b>${escapar(hora)}</b>`).join(""),
  };
  $$("[data-lista]").forEach((el) => {
    const montar = listas[el.dataset.lista];
    if (montar) el.innerHTML = montar();
  });
  if (!config.equipe.ilustrativa) $("[data-aviso-equipe]")?.remove();
  const selecao = $("[data-opcoes-tratamento]");
  config.tratamentos.forEach((t) => selecao.add(new Option(t.nome, t.chave)));

  const entrada = ["rotulo", "h1", "descricao", "acoes"];
  [$(".rotulo", $(".abertura-texto")), $("h1"), $(".descricao"), $(".acoes", $(".abertura-texto"))].forEach((el, i) => {
    el.classList.add("chegar");
    el.style.animationDelay = `${0.1 + i * 0.12}s`;
  });
  $$(".destaques li").forEach((el, i) => {
    el.classList.add("chegar");
    el.style.animationDelay = `${0.45 + i * 0.1}s`;
  });
  [$(".garantias"), $(".chamada-final")].forEach((el, i) => {
    el.classList.add("chegar");
    el.style.animationDelay = `${0.8 + i * 0.15}s`;
  });
  void entrada;

  const svgNS = "http://www.w3.org/2000/svg";
  const grupoCamadas = $("[data-camadas]");
  const camadas = [];
  for (let i = 1; i <= 6; i++) {
    const escala = 1 - i * 0.105;
    const uso = document.createElementNS(svgNS, "use");
    uso.setAttribute("href", "#forma-dente");
    grupoCamadas.append(uso);
    camadas.push({ uso, escala, profundidade: i });
  }
  const cena = $("#cena-dente");
  const alvo = { x: 0, y: 0 };
  const atual = { x: 0, y: 0 };
  addEventListener(
    "pointermove",
    (evento) => {
      if (evento.pointerType !== "mouse") return;
      alvo.x = (evento.clientX / innerWidth - 0.5) * 2;
      alvo.y = (evento.clientY / innerHeight - 0.5) * 2;
    },
    { passive: true },
  );
  const parallax = ajustes.parallax ?? 1;
  function posicionar(t) {
    const balanco = movimentoReduzido.matches ? 0 : 1;
    const ox = (atual.x * 10 + Math.sin(t * 0.45) * 3 * balanco) * parallax;
    const oy = (atual.y * 8 + Math.cos(t * 0.38) * 2 * balanco) * parallax;
    for (const c of camadas) {
      const dx = ox * c.profundidade * 0.35 - (1 - c.escala) * 14;
      const dy = oy * c.profundidade * 0.3 + (1 - c.escala) * 118;
      c.uso.setAttribute("transform", `translate(${(240 * (1 - c.escala) + dx).toFixed(2)} ${(230 * (1 - c.escala) + dy).toFixed(2)}) scale(${c.escala})`);
    }
    cena.style.setProperty("--giro-y", `${(atual.x * 8 * parallax).toFixed(2)}deg`);
    cena.style.setProperty("--giro-x", `${(-atual.y * 6 * parallax).toFixed(2)}deg`);
    const dente = $(".dente", cena);
    dente.style.setProperty("--giro-y", `${(atual.x * 8 * parallax).toFixed(2)}deg`);
    dente.style.setProperty("--giro-x", `${(-atual.y * 6 * parallax).toFixed(2)}deg`);
    const ciclo = ((t * 0.12 * (ajustes.velocidadeBrilho ?? 1)) % 1.6) - 0.3;
    dente.style.setProperty("--varredura", `${(ciclo * 760 - 120).toFixed(1)}px`);
    const aro = $("#g-aro");
    const giro = Math.sin(t * 0.3) * 8 * balanco + atual.x * 6;
    aro.setAttribute("gradientTransform", `rotate(${giro.toFixed(2)} .5 .5)`);
  }
  let quadro = 0;
  let ativo = false;
  const inicio = performance.now();
  function laco(agora) {
    atual.x += (alvo.x - atual.x) * 0.06;
    atual.y += (alvo.y - atual.y) * 0.06;
    posicionar((agora - inicio) / 1000);
    quadro = requestAnimationFrame(laco);
  }
  posicionar(0);
  if (!movimentoReduzido.matches) {
    const ligar = () => {
      if (ativo) return;
      ativo = true;
      quadro = requestAnimationFrame(laco);
    };
    const desligar = () => {
      ativo = false;
      cancelAnimationFrame(quadro);
    };
    new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? ligar() : desligar())).observe(cena);
    document.addEventListener("visibilitychange", () => (document.hidden ? desligar() : ligar()));
  }

  const botaoMenu = $(".alternar-menu");
  const menu = $("#menu");
  const definirMenu = (aberto) => {
    menu.classList.toggle("aberto", aberto);
    botaoMenu.setAttribute("aria-expanded", String(aberto));
    botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    botaoMenu.innerHTML = icone(aberto ? "fechar" : "menu");
  };
  botaoMenu.addEventListener("click", () => definirMenu(!menu.classList.contains("aberto")));
  $$("a", menu).forEach((link) => link.addEventListener("click", () => definirMenu(false)));
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && menu.classList.contains("aberto")) {
      definirMenu(false);
      botaoMenu.focus();
    }
  });
  document.addEventListener("click", (evento) => {
    if (menu.classList.contains("aberto") && !evento.composedPath().includes($(".lateral"))) definirMenu(false);
  });

  const secoes = $$("a", menu)
    .map((link) => [link, document.getElementById(link.hash.slice(1))])
    .filter(([, secao]) => secao);
  const espiao = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        secoes.forEach(([link, secao]) => {
          const ativa = secao === e.target;
          link.classList.toggle("ativo", ativa);
          if (ativa) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  secoes.forEach(([, secao]) => espiao.observe(secao));

  const revelador = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("visivel");
        revelador.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  $$(".revelar").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    revelador.observe(el);
  });

  const aviso = $("#aviso");
  const abrirAviso = (texto) => {
    $(".aviso-texto", aviso).textContent = texto;
    if (typeof aviso.showModal === "function") aviso.showModal();
    else alert(texto);
  };
  $$(".aviso-fechar, .aviso-ok", aviso).forEach((b) => b.addEventListener("click", () => aviso.close()));
  aviso.addEventListener("click", (evento) => {
    if (evento.target === aviso) aviso.close();
  });

  const numero = String(config.whatsapp || "").replace(/\D/g, "");
  function abrirWhatsApp(mensagem) {
    if (!numero) {
      abrirAviso("Este é um site demonstrativo. Informe o número de WhatsApp da clínica em configuracao.js para ativar o contato. Mensagem preparada: “" + mensagem + "”");
      return false;
    }
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, "_blank", "noopener");
    return true;
  }

  const formulario = $(".formulario");
  function irParaAgenda(chave) {
    if (chave) selecao.value = chave;
    $("#agendamentos").scrollIntoView({ behavior: movimentoReduzido.matches ? "auto" : "smooth" });
    setTimeout(() => $("input[name=nome]", formulario).focus({ preventScroll: true }), movimentoReduzido.matches ? 0 : 700);
  }
  document.addEventListener("click", (evento) => {
    const gatilho = evento.target.closest("[data-agendar]");
    if (gatilho) {
      evento.preventDefault();
      irParaAgenda(gatilho.dataset.agendar);
      return;
    }
    const cartao = evento.target.closest("[data-alvo]");
    if (cartao) {
      const chave = cartao.dataset.alvo;
      if (chave === "agendamentos") {
        irParaAgenda("avaliacao");
        return;
      }
      const destino = document.getElementById(`tratamento-${chave}`);
      if (!destino) return;
      destino.scrollIntoView({ behavior: movimentoReduzido.matches ? "auto" : "smooth", block: "center" });
      $$(".tratamento.realcado").forEach((el) => el.classList.remove("realcado"));
      destino.classList.add("realcado");
      setTimeout(() => destino.classList.remove("realcado"), 2400);
    }
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const erro = $(".erro", formulario);
    const campos = ["nome", "telefone", "tratamento"].map((nome) => formulario.elements[nome]);
    let primeiro = null;
    campos.forEach((campo) => {
      const vazio = !campo.value.trim();
      campo.setAttribute("aria-invalid", String(vazio));
      if (vazio && !primeiro) primeiro = campo;
    });
    const telefone = formulario.elements.telefone.value.replace(/\D/g, "");
    if (!primeiro && telefone.length < 10) {
      primeiro = formulario.elements.telefone;
      primeiro.setAttribute("aria-invalid", "true");
      erro.textContent = "Informe o telefone com DDD.";
    } else {
      erro.textContent = "Preencha nome, telefone e tratamento.";
    }
    if (primeiro) {
      erro.hidden = false;
      primeiro.focus();
      return;
    }
    erro.hidden = true;
    const dados = new FormData(formulario);
    const tratamento = config.tratamentos.find((t) => t.chave === dados.get("tratamento"))?.nome ?? "";
    const linhas = [
      `Olá, ${config.nomeEmpresa}! Meu nome é ${dados.get("nome").trim()}.`,
      `Gostaria de agendar: ${tratamento}.`,
      `Melhor período: ${dados.get("periodo")}.`,
      `Telefone: ${dados.get("telefone").trim()}.`,
    ];
    const obs = dados.get("observacao").trim();
    if (obs) linhas.push(`Observações: ${obs}`);
    abrirWhatsApp(linhas.join("\n"));
  });
  formulario.addEventListener("input", (evento) => {
    if (evento.target.getAttribute("aria-invalid") === "true" && evento.target.value.trim()) evento.target.setAttribute("aria-invalid", "false");
  });

  $$("[data-mapa]").forEach((link) =>
    link.addEventListener("click", (evento) => {
      if (config.endereco.linkMapa) {
        evento.preventDefault();
        window.open(config.endereco.linkMapa, "_blank", "noopener");
        return;
      }
      evento.preventDefault();
      abrirAviso("Informe o link do mapa da clínica em configuracao.js (endereco.linkMapa) para ativar o botão “Como chegar”.");
    }),
  );
})();
