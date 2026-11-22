(() => {
  const config = window.configuracaoEmpresa;
  const $ = (seletor, base = document) => base.querySelector(seletor);
  const $$ = (seletor, base = document) => [...base.querySelectorAll(seletor)];
  const ler = (caminho) => caminho.split(".").reduce((valor, chave) => valor?.[chave], config);
  const reduzido = matchMedia("(prefers-reduced-motion: reduce)");
  const icone = (nome) => `<svg aria-hidden="true"><use href="#i-${nome}" /></svg>`;
  const escapar = (texto) => String(texto).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const ajustes = config.animacao ?? {};

  $$("[data-texto]").forEach((el) => {
    const valor = ler(el.dataset.texto);
    if (valor) el.textContent = valor;
  });
  $$("[data-marca]").forEach((el) => (el.textContent = config.marca[el.dataset.marca]));
  $$("[data-endereco]").forEach((el) => (el.textContent = config.endereco[el.dataset.endereco] ?? ""));
  $$("[data-ano]").forEach((el) => (el.textContent = new Date().getFullYear()));
  document.title = `${config.marca.nome} — ${config.marca.subtitulo}`;
  const ind = config.indicadores;
  $("[data-indicador=status]").textContent = ind.status;
  $("[data-indicador=areas]").textContent = String(ind.areas).padStart(2, "0");
  if (!ind.ilustrativos) $("[data-aviso-numeros]").remove();

  const listas = {
    "servicos-resumo": () =>
      config.servicos
        .map(
          (s) => `<li><button class="servico-resumo" type="button" data-icone="${escapar(s.icone)}" data-servico="${escapar(s.chave)}">${icone(s.icone)}
            <strong>${s.nome.map(escapar).join("<br />")}</strong><small>${s.resumo.map(escapar).join("<br />")}</small>
            <svg class="seta" aria-hidden="true"><use href="#i-seta" /></svg></button></li>`,
        )
        .join(""),
    "servicos-detalhe": () =>
      config.servicos
        .map(
          (s, i) => `<article class="servico-detalhe revelar" id="servico-${escapar(s.chave)}"><div class="servico-detalhe-topo">${icone(s.icone)}<span>[0${i + 1}]</span></div>
            <h3>${s.nome.map(escapar).join(" ")}</h3><p>${escapar(s.detalhe)}</p>
            <ul>${s.itens.map((item) => `<li>${escapar(item)}</li>`).join("")}</ul>
            <button class="botao botao-branco" type="button" data-interesse="${escapar(s.chave)}">[ Quero este serviço ]</button></article>`,
        )
        .join(""),
    areas: () => config.areas.map((a) => `<li>${escapar(a)}</li>`).join(""),
    etapas: () => config.etapas.map(([n, t, d]) => `<li><b>${escapar(n)}</b><strong>${escapar(t)}</strong><p>${escapar(d)}</p></li>`).join(""),
    horarios: () => config.horarios.map(([dia, hora]) => `<span>${escapar(dia)}</span><b>${escapar(hora)}</b>`).join(""),
  };
  $$("[data-lista]").forEach((el) => {
    const montar = listas[el.dataset.lista];
    if (montar) el.innerHTML = montar();
  });
  const selecao = $("[data-opcoes-servico]");
  config.servicos.forEach((s) => selecao.add(new Option(s.nome.join(" "), s.chave)));

  [".abertura-texto h1", ".abertura-texto .descricao", ".abertura-texto .acoes", ".estado", ".servicos-faixa", ".lateral", ".faixa"].forEach((sel, i) => {
    const el = $(sel);
    el.classList.add("surgir");
    el.style.animationDelay = `${0.2 + i * 0.1}s`;
  });

  const comando = $("[data-comando]");
  const textoComando = config.inicio.comando;
  if (reduzido.matches) comando.textContent = textoComando;
  else {
    let i = 0;
    const digitar = () => {
      comando.textContent = textoComando.slice(0, ++i);
      if (i < textoComando.length) setTimeout(digitar, (38 + Math.random() * 50) / (ajustes.digitacao ?? 1));
    };
    setTimeout(digitar, 350);
  }

  function contar(el, alvo) {
    if (reduzido.matches) {
      el.textContent = `+${alvo}`;
      return;
    }
    const inicio = performance.now();
    const duracao = 1600;
    const passo = (agora) => {
      const p = Math.min(1, (agora - inicio) / duracao);
      el.textContent = `+${Math.round(alvo * (1 - Math.pow(1 - p, 3)))}`;
      if (p < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }
  const observadorNumeros = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      contar(e.target, ind[e.target.dataset.contador]);
      observadorNumeros.unobserve(e.target);
    }
  });
  $$("[data-contador]").forEach((el) => observadorNumeros.observe(el));

  const grafico = $("[data-grafico]");
  const alturas = [40, 52, 34, 60, 48, 70, 56, 80, 64, 92, 100, 72, 60, 78, 50, 66, 44, 54];
  grafico.innerHTML = alturas
    .map((h, i) => `<span style="--altura:${h}%;--atraso:${(-i * 0.37).toFixed(2)}s;${i > 11 ? "--cor:#5a5a5a" : ""}"></span>`)
    .join("");

  const chamada = $(".chamada");
  const pontosChamada = $("[data-pontos-chamada]");
  pontosChamada.innerHTML = config.chamadas.map((_, i) => `<button type="button" role="tab" aria-label="Mensagem ${i + 1}"></button>`).join("");
  let indiceChamada = 0;
  let relogioChamada = 0;
  function mostrarChamada(i, animar = true) {
    indiceChamada = (i + config.chamadas.length) % config.chamadas.length;
    const aplicar = () => {
      $("[data-chamada-titulo]").textContent = config.chamadas[indiceChamada][0];
      $("[data-chamada-texto]").textContent = config.chamadas[indiceChamada][1];
      chamada.classList.remove("trocando");
    };
    $$("button", pontosChamada).forEach((b, k) => b.setAttribute("aria-selected", String(k === indiceChamada)));
    if (animar && !reduzido.matches) {
      chamada.classList.add("trocando");
      setTimeout(aplicar, 320);
    } else aplicar();
  }
  const ciclarChamadas = () => {
    clearInterval(relogioChamada);
    if (!reduzido.matches) relogioChamada = setInterval(() => mostrarChamada(indiceChamada + 1), 5200);
  };
  $$("button", pontosChamada).forEach((b, k) =>
    b.addEventListener("click", () => {
      mostrarChamada(k);
      ciclarChamadas();
    }),
  );
  mostrarChamada(0, false);
  ciclarChamadas();

  const caixaCubo = $(".cubo");
  const tela = $("canvas", caixaCubo);
  const ctx = tela.getContext("2d");
  let largura = 0;
  let altura = 0;
  function ajustarCubo() {
    const caixa = caixaCubo.getBoundingClientRect();
    const razao = Math.min(devicePixelRatio || 1, 2);
    largura = Math.max(1, caixa.width);
    altura = Math.max(1, caixa.height);
    tela.width = Math.round(largura * razao);
    tela.height = Math.round(altura * razao);
    ctx.setTransform(razao, 0, 0, razao, 0, 0);
  }
  let semente = 7;
  const aleatorio = () => ((semente = (semente * 16807) % 2147483647) / 2147483647);
  const pontosTopo = Array.from({ length: 46 }, () => [aleatorio() * 2 - 1, aleatorio() * 2 - 1, aleatorio()]);
  const ponteiro = { x: 0, y: 0, alvoX: 0, alvoY: 0 };
  addEventListener(
    "pointermove",
    (evento) => {
      if (evento.pointerType !== "mouse") return;
      ponteiro.alvoX = (evento.clientX / innerWidth - 0.5) * 2;
      ponteiro.alvoY = (evento.clientY / innerHeight - 0.5) * 2;
    },
    { passive: true },
  );
  function desenharCubo(t) {
    ctx.clearRect(0, 0, largura, altura);
    const velocidade = ajustes.velocidadeCubo ?? 1;
    const giro = (45 + Math.sin(t * 0.22 * velocidade) * 9 + ponteiro.x * 12) * (Math.PI / 180);
    const inclinacao = (30 + ponteiro.y * 5) * (Math.PI / 180);
    const escala = Math.min(largura / 3.3, altura / 3.05);
    const cx = largura * 0.5;
    const cy = altura * 0.5;
    const cg = Math.cos(giro);
    const sg = Math.sin(giro);
    const ci = Math.cos(inclinacao);
    const si = Math.sin(inclinacao);
    const projetar = (x, y, z) => {
      const rx = x * cg - z * sg;
      const rz = x * sg + z * cg;
      const py = y * ci - rz * si;
      return [cx + rx * escala, cy - py * escala, rz * ci + y * si];
    };
    const linha = (a, b, cor, espessura = 1) => {
      ctx.strokeStyle = cor;
      ctx.lineWidth = espessura;
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();
    };
    const quadro = (y, cor, espessura) => {
      const c = [projetar(-1, y, -1), projetar(1, y, -1), projetar(1, y, 1), projetar(-1, y, 1)];
      for (let i = 0; i < 4; i++) linha(c[i], c[(i + 1) % 4], cor, espessura);
      return c;
    };
    const flutuar = reduzido.matches ? 0 : Math.sin(t * 0.9) * 0.05;
    const yTopo = 0.95;
    const yBase = -0.95;
    ctx.lineCap = "square";

    const base = quadro(yBase, "rgba(200,200,200,.55)", 1);
    quadro(-0.32, "rgba(200,200,200,.35)", 1);
    const topo = quadro(yTopo, "rgba(220,220,220,.7)", 1);
    for (let i = 0; i < 4; i++) linha(base[i], topo[i], "rgba(200,200,200,.42)", 1);
    for (let k = 1; k < 8; k++) {
      const v = -1 + (k * 2) / 8;
      linha(projetar(v, yTopo, -1), projetar(v, yTopo, 1), "rgba(200,200,200,.12)", 1);
      linha(projetar(-1, yTopo, v), projetar(1, yTopo, v), "rgba(200,200,200,.12)", 1);
    }
    for (const [x, z, f] of pontosTopo) {
      const p = projetar(x * 0.92, yTopo, z * 0.92);
      const brilho = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 1.6 + f * 12));
      ctx.fillStyle = `rgba(235,235,235,${(brilho * 0.8).toFixed(2)})`;
      ctx.fillRect(p[0] - 0.8, p[1] - 0.8, 1.6, 1.6);
    }

    const placa = (x0, x1, z0, z1, y0, y1, intensidade) => {
      const v = [
        projetar(x0, y0, z0), projetar(x1, y0, z0), projetar(x1, y0, z1), projetar(x0, y0, z1),
        projetar(x0, y1, z0), projetar(x1, y1, z0), projetar(x1, y1, z1), projetar(x0, y1, z1),
      ];
      const faces = [
        [[4, 5, 6, 7], 1],
        [[0, 1, 5, 4], 0.55],
        [[1, 2, 6, 5], 0.4],
        [[2, 3, 7, 6], 0.5],
        [[3, 0, 4, 7], 0.6],
      ];
      faces
        .map(([f, luz]) => [f, luz, f.reduce((s, i) => s + v[i][2], 0) / 4])
        .sort((a, b) => a[2] - b[2])
        .forEach(([f, luz]) => {
          ctx.beginPath();
          f.forEach((i, k) => (k ? ctx.lineTo(v[i][0], v[i][1]) : ctx.moveTo(v[i][0], v[i][1])));
          ctx.closePath();
          ctx.fillStyle = `rgba(${(200 + luz * 52) | 0},${(70 + luz * 40) | 0},${(10 + luz * 10) | 0},${(0.32 + luz * 0.38 * intensidade).toFixed(2)})`;
          ctx.fill();
        });
      ctx.shadowColor = "rgba(252,93,1,.9)";
      ctx.shadowBlur = 14;
      [[4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7], [0, 1], [1, 2], [2, 3], [3, 0]].forEach(([a, b]) => linha(v[a], v[b], "rgba(255,120,40,.95)", 1.2));
      ctx.shadowBlur = 0;
      const topoPlaca = [v[4], v[5], v[6], v[7]];
      ctx.strokeStyle = "rgba(255,170,110,.22)";
      ctx.lineWidth = 1;
      for (let k = 1; k < 6; k++) {
        const u = k / 6;
        const a = [topoPlaca[0][0] + (topoPlaca[1][0] - topoPlaca[0][0]) * u, topoPlaca[0][1] + (topoPlaca[1][1] - topoPlaca[0][1]) * u];
        const b = [topoPlaca[3][0] + (topoPlaca[2][0] - topoPlaca[3][0]) * u, topoPlaca[3][1] + (topoPlaca[2][1] - topoPlaca[3][1]) * u];
        linha(a, b, "rgba(255,170,110,.2)", 1);
      }
    };
    placa(-1, 1, -1, 0.15, 0.05 + flutuar, 0.24 + flutuar, 1);
    placa(-0.1, 1, 0.15, 1, -0.02 + flutuar * 0.7, 0.16 + flutuar * 0.7, 0.85);

    const centroTopo = projetar(0, yTopo, 0);
    const centroMeio = projetar(0, 0.24 + flutuar, -0.42);
    linha(centroTopo, centroMeio, "rgba(255,255,255,.55)", 1);
    ctx.fillStyle = "#fff";
    ctx.fillRect(centroMeio[0] - 2, centroMeio[1] - 2, 4, 4);
    ctx.fillRect(centroTopo[0] - 1.5, centroTopo[1] - 1.5, 3, 3);

    const esquerda = projetar(-1, yTopo, 1);
    const esquerdaBase = projetar(-1, yBase, 1);
    const recuo = -escala * 0.14;
    linha([esquerda[0] + recuo, esquerda[1]], [esquerdaBase[0] + recuo, esquerdaBase[1]], "rgba(200,200,200,.5)", 1);
    for (let k = 0; k <= 4; k++) {
      const y = esquerda[1] + ((esquerdaBase[1] - esquerda[1]) * k) / 4;
      linha([esquerda[0] + recuo - 4, y], [esquerda[0] + recuo + 4, y], "rgba(200,200,200,.55)", 1);
    }
    const d0 = projetar(1, yBase + 0.62, 1);
    const d1 = projetar(1.45, yBase + 0.62, 1.1);
    linha(d0, d1, "rgba(200,200,200,.5)", 1);
    linha([d1[0] - 4, d1[1] - 4], [d1[0] + 4, d1[1] + 4], "rgba(200,200,200,.6)", 1);
  }

  let ativo = false;
  let quadroAnimacao = 0;
  const inicio = performance.now();
  function laco(agora) {
    ponteiro.x += (ponteiro.alvoX - ponteiro.x) * 0.05;
    ponteiro.y += (ponteiro.alvoY - ponteiro.y) * 0.05;
    desenharCubo((agora - inicio) / 1000);
    quadroAnimacao = requestAnimationFrame(laco);
  }
  ajustarCubo();
  desenharCubo(1);
  new ResizeObserver(() => {
    ajustarCubo();
    desenharCubo((performance.now() - inicio) / 1000);
  }).observe(caixaCubo);
  if (!reduzido.matches) {
    const ligar = () => {
      if (ativo) return;
      ativo = true;
      quadroAnimacao = requestAnimationFrame(laco);
    };
    const desligar = () => {
      ativo = false;
      cancelAnimationFrame(quadroAnimacao);
    };
    new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? ligar() : desligar())).observe(caixaCubo);
    document.addEventListener("visibilitychange", () => (document.hidden ? desligar() : ligar()));
  }

  const terminal = $("[data-terminal]");
  const linhasTerminal = config.sobre.registro;
  const formatar = (texto) => escapar(texto).replace(/ ok$/, ' <span class="ok">ok</span>').replace(/^&gt;/, '<span class="ok">&gt;</span>');
  function escreverTerminal() {
    if (reduzido.matches) {
      terminal.innerHTML = linhasTerminal.map(formatar).join("\n");
      return;
    }
    let linhaAtual = 0;
    let letra = 0;
    const feitas = [];
    const passo = () => {
      const texto = linhasTerminal[linhaAtual];
      letra++;
      terminal.innerHTML = [...feitas, formatar(texto.slice(0, letra))].join("\n") + '<span class="bloco"></span>';
      if (letra < texto.length) return setTimeout(passo, 18);
      feitas.push(formatar(texto));
      linhaAtual++;
      letra = 0;
      if (linhaAtual < linhasTerminal.length) setTimeout(passo, 260);
      else terminal.innerHTML = feitas.join("\n") + '\n<span class="ok">&gt;</span> <span class="bloco"></span>';
    };
    passo();
  }
  const observadorTerminal = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    escreverTerminal();
    observadorTerminal.disconnect();
  });
  observadorTerminal.observe(terminal);

  const topo = $(".topo");
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
  document.addEventListener("click", (evento) => {
    if (menu.classList.contains("aberto") && !evento.composedPath().includes(topo)) definirMenu(false);
  });
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && menu.classList.contains("aberto")) {
      definirMenu(false);
      botaoMenu.focus();
    }
  });

  const links = $$("a[href^='#']", menu)
    .map((link) => [link, document.getElementById(link.hash.slice(1))])
    .filter(([, secao]) => secao);
  const espiao = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        links.forEach(([link, secao]) => {
          link.classList.toggle("ativo", secao === e.target);
          if (secao === e.target) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  links.forEach(([, secao]) => espiao.observe(secao));

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
    el.style.transitionDelay = `${(i % 2) * 0.1}s`;
    revelador.observe(el);
  });

  const aviso = $("#aviso");
  const abrirAviso = (texto) => {
    $(".aviso-texto", aviso).textContent = texto;
    if (typeof aviso.showModal === "function") aviso.showModal();
    else aviso.setAttribute("open", "");
  };
  $$(".aviso-fechar, .aviso-ok", aviso).forEach((b) => b.addEventListener("click", () => aviso.close()));
  aviso.addEventListener("click", (evento) => {
    if (evento.target === aviso) aviso.close();
  });
  const numero = String(config.whatsapp || "").replace(/\D/g, "");
  function abrirWhatsApp(mensagem) {
    if (!numero) {
      abrirAviso("Este é um site demonstrativo. Informe o número de WhatsApp em configuracao.js para ativar o contato. Mensagem preparada: “" + mensagem + "”");
      return;
    }
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, "_blank", "noopener");
  }
  $$("[data-whatsapp]").forEach((b) => b.addEventListener("click", () => abrirWhatsApp(config.mensagemPadrao)));

  const rolar = (el, bloco = "start") => el.scrollIntoView({ behavior: reduzido.matches ? "auto" : "smooth", block: bloco });
  const formulario = $(".formulario");
  document.addEventListener("click", (evento) => {
    const resumo = evento.target.closest("[data-servico]");
    if (resumo) {
      const destino = document.getElementById(`servico-${resumo.dataset.servico}`);
      rolar(destino, "center");
      $$(".servico-detalhe.realcado").forEach((el) => el.classList.remove("realcado"));
      destino.classList.add("realcado");
      setTimeout(() => destino.classList.remove("realcado"), 2400);
      return;
    }
    const interesse = evento.target.closest("[data-interesse]");
    if (interesse) {
      selecao.value = interesse.dataset.interesse;
      rolar($("#contato"));
      setTimeout(() => $("input[name=nome]", formulario).focus({ preventScroll: true }), reduzido.matches ? 0 : 700);
    }
  });
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const erro = $(".erro", formulario);
    const nome = formulario.elements.nome;
    let primeiro = null;
    [nome, selecao].forEach((campo) => {
      const vazio = !campo.value.trim();
      campo.setAttribute("aria-invalid", String(vazio));
      if (vazio && !primeiro) primeiro = campo;
    });
    erro.hidden = !primeiro;
    if (primeiro) {
      primeiro.focus();
      return;
    }
    const servico = config.servicos.find((s) => s.chave === selecao.value);
    const empresa = formulario.elements.empresa.value.trim();
    const mensagem = formulario.elements.mensagem.value.trim();
    const linhas = [`Olá! Meu nome é ${nome.value.trim()}${empresa ? `, da empresa ${empresa}` : ""}.`, `Quero agendar uma reunião sobre: ${servico.nome.join(" ")}.`];
    if (mensagem) linhas.push(mensagem);
    abrirWhatsApp(linhas.join("\n"));
  });
  formulario.addEventListener("input", (evento) => {
    if (evento.target.getAttribute("aria-invalid") === "true" && evento.target.value.trim()) evento.target.setAttribute("aria-invalid", "false");
  });
  $$("[data-mapa]").forEach((link) =>
    link.addEventListener("click", (evento) => {
      evento.preventDefault();
      if (config.endereco.linkMapa) window.open(config.endereco.linkMapa, "_blank", "noopener");
      else abrirAviso("Informe o link do mapa em configuracao.js (endereco.linkMapa) para ativar o botão “Como chegar”.");
    }),
  );
})();
