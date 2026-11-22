(() => {
  const config = window.configuracaoEmpresa;
  const $ = (seletor, base = document) => base.querySelector(seletor);
  const $$ = (seletor, base = document) => [...base.querySelectorAll(seletor)];
  const ler = (caminho) => caminho.split(".").reduce((valor, chave) => valor?.[chave], config);
  const reduzido = matchMedia("(prefers-reduced-motion: reduce)");
  const compacto = matchMedia("(max-width: 900px)");
  const icone = (nome) => `<svg aria-hidden="true"><use href="#i-${nome}" /></svg>`;
  const escapar = (texto) => String(texto).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const svgNS = "http://www.w3.org/2000/svg";
  const ajustes = config.animacao ?? {};

  $$("[data-texto]").forEach((el) => {
    const valor = ler(el.dataset.texto);
    if (valor) el.textContent = valor;
  });
  $$("[data-marca]").forEach((el) => (el.textContent = config.marca[el.dataset.marca]));
  $$("[data-endereco]").forEach((el) => (el.textContent = config.endereco[el.dataset.endereco] ?? ""));
  $$("[data-ano]").forEach((el) => (el.textContent = new Date().getFullYear()));
  document.title = config.nomeEmpresa;

  const listas = {
    pilares: () =>
      config.inicio.pilares
        .map(([ic, titulo, texto]) => `<li class="pilar" data-icone="${escapar(ic)}">${icone(ic)}<div><strong>${escapar(titulo)}</strong><span>${escapar(texto)}</span></div></li>`)
        .join(""),
    servicos: () =>
      config.servicos
        .map(
          (s, i) => `<article class="servico revelar">${icone(s.icone)}<h3>${escapar(s.nome)}</h3><p>${escapar(s.texto)}</p>
            <ul>${s.itens.map((item) => `<li>${icone("check")}${escapar(item)}</li>`).join("")}</ul>
            <button class="botao-contorno" type="button" data-interesse="${i}">Quero este serviço ${icone("seta")}</button></article>`,
        )
        .join(""),
    pontos: () => config.sobre.pontos.map((p) => `<li>${icone("check")}${escapar(p)}</li>`).join(""),
    etapas: () =>
      config.etapas.map(([t, d], i) => `<li class="etapa"><span class="etapa-numero">${String(i + 1).padStart(2, "0")}</span><div><strong>${escapar(t)}</strong><p>${escapar(d)}</p></div></li>`).join(""),
    perguntas: () =>
      config.perguntas.map(([p, r]) => `<details class="pergunta"><summary>${escapar(p)}${icone("mais")}</summary><p>${escapar(r)}</p></details>`).join(""),
    horarios: () => config.horarios.map(([dia, hora]) => `<span>${escapar(dia)}</span><b>${escapar(hora)}</b>`).join(""),
  };
  $$("[data-lista]").forEach((el) => {
    const montar = listas[el.dataset.lista];
    if (montar) el.innerHTML = montar();
  });
  const selecao = $("[data-opcoes-servico]");
  config.servicos.forEach((s, i) => selecao.add(new Option(s.nome, String(i))));

  [".abertura .rotulo", ".abertura h1", ".abertura .descricao", ".abertura .acoes"].forEach((sel, i) => {
    const el = $(sel);
    el.classList.add("chegar");
    el.style.animationDelay = `${0.15 + i * 0.12}s`;
  });
  $$(".pilar").forEach((el, i) => {
    el.classList.add("chegar");
    el.style.animationDelay = `${0.7 + i * 0.12}s`;
  });

  const ripas = $("[data-ripas]");
  for (let x = 1312, i = 0; x < 1540; x += 8.6, i++) {
    const linha = document.createElementNS(svgNS, "line");
    linha.setAttribute("x1", x.toFixed(1));
    linha.setAttribute("x2", x.toFixed(1));
    linha.setAttribute("y1", "0");
    linha.setAttribute("y2", String(700 + (i % 3) * 12));
    if (i % 2) {
      linha.classList.add("ripa-luz");
      linha.style.animationDelay = `${-(i * 0.37) % 4}s`;
    }
    ripas.append(linha);
  }

  const planta = $("[data-planta]");
  const hastes = [
    [1356, 456, 1300, 380, 1268, 372, [[0.35, -150, 26], [0.55, -38, 34], [0.7, -140, 30], [0.85, -20, 40], [1, -8, 42]]],
    [1358, 456, 1330, 360, 1345, 308, [[0.4, -150, 26], [0.5, -70, 30], [0.65, -160, 28], [0.78, -105, 34], [1, -88, 38]]],
    [1360, 456, 1400, 380, 1452, 354, [[0.3, -20, 26], [0.45, -60, 30], [0.6, -5, 30], [0.75, -30, 36], [1, -14, 42]]],
    [1358, 456, 1380, 410, 1420, 398, [[0.4, -60, 24], [0.6, 10, 28], [1, -6, 32]]],
    [1356, 456, 1310, 420, 1290, 410, [[0.5, 150, 24], [0.7, 200, 28], [1, 196, 30]]],
    [1358, 456, 1350, 400, 1372, 352, [[0.6, -40, 26], [1, -70, 30]]],
  ];
  const ponto = (t, x0, y0, cx, cy, x1, y1) => [(1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1];
  hastes.forEach(([x0, y0, cx, cy, x1, y1, folhas], h) => {
    const grupo = document.createElementNS(svgNS, "g");
    grupo.classList.add("folha");
    grupo.style.transformOrigin = `${x0}px ${y0}px`;
    grupo.style.animationDelay = `${-h * 1.3}s`;
    grupo.style.animationDuration = `${5 + h * 0.7}s`;
    const caule = document.createElementNS(svgNS, "path");
    caule.setAttribute("d", `M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}`);
    caule.setAttribute("fill", "none");
    caule.setAttribute("stroke", "#d98d44");
    caule.setAttribute("stroke-width", "1.6");
    grupo.append(caule);
    folhas.forEach(([t, angulo, tamanho]) => {
      const [x, y] = ponto(t, x0, y0, cx, cy, x1, y1);
      const largura = tamanho * 0.32;
      const folha = document.createElementNS(svgNS, "path");
      folha.setAttribute("d", `M0 0Q${tamanho * 0.45} ${-largura} ${tamanho} 0Q${tamanho * 0.45} ${largura} 0 0Z`);
      folha.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angulo})`);
      folha.setAttribute("fill", "url(#g-folha)");
      folha.setAttribute("stroke", "#ffd9a0");
      folha.setAttribute("stroke-width", ".6");
      grupo.append(folha);
    });
    planta.insertBefore(grupo, planta.firstChild);
  });

  const cena = $(".cena");
  function ajustarCena() {
    cena.setAttribute("viewBox", compacto.matches ? "780 96 756 624" : "0 0 1536 1024");
  }
  ajustarCena();
  compacto.addEventListener("change", ajustarCena);

  const grupoOndas = $("[data-ondas]");
  const fitas = [];
  function criarFita(classe, quantidade) {
    const itens = [];
    for (let k = 0; k < quantidade; k++) {
      const p = document.createElementNS(svgNS, "path");
      p.setAttribute("fill", "none");
      p.setAttribute("class", classe);
      grupoOndas.append(p);
      itens.push(p);
    }
    return itens;
  }
  const corpoEsquerdo = document.createElementNS(svgNS, "path");
  corpoEsquerdo.setAttribute("fill", "url(#g-onda)");
  corpoEsquerdo.setAttribute("opacity", ".92");
  grupoOndas.append(corpoEsquerdo);
  const linhasEsquerda = criarFita("fio-onda", 22);
  const corpoDireito = document.createElementNS(svgNS, "path");
  corpoDireito.setAttribute("fill", "url(#g-onda)");
  corpoDireito.setAttribute("opacity", ".9");
  grupoOndas.append(corpoDireito);
  const linhasDireita = criarFita("fio-onda", 18);
  const brilhoBaixo = document.createElementNS(svgNS, "path");
  brilhoBaixo.setAttribute("fill", "none");
  brilhoBaixo.setAttribute("stroke", "#ff9a45");
  brilhoBaixo.setAttribute("stroke-width", "9");
  brilhoBaixo.setAttribute("stroke-linecap", "round");
  brilhoBaixo.setAttribute("opacity", ".22");
  grupoOndas.append(brilhoBaixo);
  const linhaBaixo = criarFita("fio-cobre", 3);
  const brilhoDireito = document.createElementNS(svgNS, "path");
  brilhoDireito.setAttribute("fill", "none");
  brilhoDireito.setAttribute("stroke", "#ff9a45");
  brilhoDireito.setAttribute("stroke-width", "7");
  brilhoDireito.setAttribute("stroke-linecap", "round");
  brilhoDireito.setAttribute("opacity", ".16");
  grupoOndas.append(brilhoDireito);
  const linhaDireita = criarFita("fio-cobre", 1);
  fitas.push(linhasEsquerda, linhasDireita);
  const estilo = document.createElement("style");
  estilo.textContent = `.fio-onda{stroke:#4d8a69;stroke-opacity:.17;stroke-width:1}.fio-cobre{stroke:url(#g-onda-borda);stroke-width:1.6}`;
  document.head.append(estilo);

  const curva = (pontos) => {
    let d = `M${pontos[0][0].toFixed(1)} ${pontos[0][1].toFixed(1)}`;
    for (let i = 1; i < pontos.length; i++) d += `L${pontos[i][0].toFixed(1)} ${pontos[i][1].toFixed(1)}`;
    return d;
  };
  function ondaEsquerda(k, t) {
    const pts = [];
    for (let x = -20; x <= 960; x += 30) {
      const u = Math.max(0, x) / 900;
      const y = 600 + k * 300 + Math.pow(u, 1.35) * (420 - k * 200) + 22 * Math.sin(u * 4.2 - t * 0.55 + k * 2.4) * (1 - k * 0.5);
      pts.push([x, y]);
    }
    return pts;
  }
  function ondaDireita(k, t) {
    const pts = [];
    for (let x = 1000; x <= 1560; x += 28) {
      const u = (x - 1000) / 536;
      const y = 1000 - Math.pow(u, 1.55) * (430 - k * 240) - u * 30 + 14 * Math.sin(u * 4 + t * 0.6 + k * 2) * u + k * 60;
      pts.push([x, y]);
    }
    return pts;
  }
  function linhaInferior(t, deslocamento = 0) {
    const pts = [];
    for (let x = -20; x <= 900; x += 24) {
      const u = (x + 20) / 920;
      const y = 935 - Math.sin(u * Math.PI * 0.9) * 75 + u * u * 120 + 8 * Math.sin(u * 6 - t * 0.7) + deslocamento;
      pts.push([x, y]);
    }
    return pts;
  }
  function desenharOndas(t) {
    const topoE = ondaEsquerda(0, t);
    corpoEsquerdo.setAttribute("d", curva(topoE) + "L960 1030L-20 1030Z");
    linhasEsquerda.forEach((p, k) => p.setAttribute("d", curva(ondaEsquerda(k / linhasEsquerda.length, t))));
    const topoD = ondaDireita(0, t);
    const baseD = ondaDireita(1, t).map(([x, y]) => [x, y + 70]).reverse();
    corpoDireito.setAttribute("d", curva(topoD) + curva(baseD).replace("M", "L") + "Z");
    linhasDireita.forEach((p, k) => p.setAttribute("d", curva(ondaDireita(k / linhasDireita.length, t))));
    const baixo = curva(linhaInferior(t));
    brilhoBaixo.setAttribute("d", baixo);
    linhaBaixo.forEach((p, k) => p.setAttribute("d", curva(linhaInferior(t, k * 6))));
    const direita = curva(ondaDireita(0, t));
    brilhoDireito.setAttribute("d", direita);
    linhaDireita.forEach((p, k) => p.setAttribute("d", curva(ondaDireita(k * 0.03, t))));
  }

  const tela = $(".agua");
  const ctx = tela.getContext("2d");
  const fontesLuz = [
    { x: 0.23, largura: 0.07, forca: 0.55 },
    { x: 0.6, largura: 0.08, forca: 0.75 },
    { x: 0.72, largura: 0.06, forca: 0.7 },
    { x: 0.93, largura: 0.11, forca: 1 },
  ];
  let larguraAgua = 0;
  let alturaAgua = 0;
  function ajustarAgua() {
    const caixa = tela.getBoundingClientRect();
    const razao = Math.min(devicePixelRatio || 1, 1.25);
    larguraAgua = Math.max(1, caixa.width);
    alturaAgua = Math.max(1, caixa.height);
    tela.width = Math.round(larguraAgua * razao);
    tela.height = Math.round(alturaAgua * razao);
    ctx.setTransform(razao, 0, 0, razao, 0, 0);
  }
  function desenharAgua(t) {
    const w = larguraAgua;
    const h = alturaAgua;
    const base = ctx.createLinearGradient(0, 0, 0, h);
    base.addColorStop(0, "#132b1f");
    base.addColorStop(0.35, "#0c1f16");
    base.addColorStop(1, "#04100a");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);
    const intensidade = ajustes.brilhoAgua ?? 1;
    ctx.globalCompositeOperation = "lighter";
    for (const fonte of fontesLuz) {
      const cx = fonte.x * w;
      const brilho = ctx.createRadialGradient(cx, h * 0.15, 0, cx, h * 0.15, fonte.largura * w * 1.6);
      brilho.addColorStop(0, `rgba(230,120,45,${(0.22 * fonte.forca * intensidade).toFixed(3)})`);
      brilho.addColorStop(1, "rgba(230,120,45,0)");
      ctx.fillStyle = brilho;
      ctx.fillRect(cx - fonte.largura * w * 1.6, 0, fonte.largura * w * 3.2, h);
    }
    ctx.lineCap = "round";
    let y = 3;
    let linha = 0;
    while (y < h) {
      const p = y / h;
      const espessura = 0.8 + p * 2.6;
      const balanco = Math.sin(y * 0.13 + t * 1.3) * (2 + p * 6);
      for (const fonte of fontesLuz) {
        const centro = fonte.x * w + balanco;
        const meia = fonte.largura * w * (0.65 + p * 0.7);
        const trechos = 4 + Math.round(p * 3);
        for (let i = 0; i < trechos; i++) {
          const ruido = Math.sin(linha * 1.7 + i * 2.3 + t * (1.2 + i * 0.11) + Math.sin(linha * 0.31 + t * 0.5) * 2);
          const fase = ruido * 0.5 + 0.5;
          const deslocamento = (Math.sin(linha * 0.9 + i * 1.1 + t * 0.8) * 0.7 + Math.sin(linha * 2.3 + i * 4.1 - t * 0.6) * 0.3) * meia;
          const comprimento = (4 + fase * fase * fase * 70) * (0.5 + p);
          const queda = 1 - Math.min(1, Math.abs(deslocamento) / meia);
          const brilho = fase * fase * fonte.forca * intensidade * (0.25 + 0.75 * queda);
          if (brilho < 0.06) continue;
          const cx = centro + deslocamento;
          ctx.fillStyle = `rgba(240,${(120 + fase * 60) | 0},${(50 + fase * 40) | 0},${(brilho * 0.32).toFixed(3)})`;
          ctx.beginPath();
          ctx.ellipse(cx, y, comprimento * 0.62, espessura * 1.9, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(255,${(150 + fase * 70) | 0},${(70 + fase * 60) | 0},${Math.min(1, brilho * 0.8).toFixed(3)})`;
          ctx.beginPath();
          ctx.ellipse(cx, y, comprimento * 0.5, espessura * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      for (let i = 0; i < 9; i++) {
        const fase = Math.sin(linha * 2.1 + i * 3.7 + t * (0.8 + i * 0.07)) * 0.5 + 0.5;
        if (fase < 0.55) continue;
        const x = ((i * 0.137 + linha * 0.071 + Math.sin(t * 0.2 + i) * 0.03) % 1) * w;
        ctx.fillStyle = `rgba(130,200,165,${((fase - 0.55) * 0.22 * (0.4 + p)).toFixed(3)})`;
        ctx.beginPath();
        ctx.ellipse(x, y, (20 + fase * 50) * (0.5 + p), espessura * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = `rgba(120,180,150,${(0.025 + 0.025 * Math.sin(linha * 0.7 + t)).toFixed(3)})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, y + espessura + 1);
      ctx.lineTo(w, y + espessura + 1);
      ctx.stroke();
      y += espessura * 2.3 + p * 3.4;
      linha++;
    }
    ctx.globalCompositeOperation = "source-over";
    const borda = ctx.createLinearGradient(0, 0, 0, h * 0.18);
    borda.addColorStop(0, "rgba(10,25,20,1)");
    borda.addColorStop(1, "rgba(10,25,20,0)");
    ctx.fillStyle = borda;
    ctx.fillRect(0, 0, w, h * 0.18);
  }

  const camadas = $$("[data-profundidade]");
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
  const parallax = (ajustes.parallax ?? 1) * 14;
  let contagem = 0;
  function quadroCena(t) {
    camadas.forEach((g) => {
      const p = Number(g.dataset.profundidade);
      g.setAttribute("transform", `translate(${(-atual.x * parallax * p).toFixed(2)} ${(-atual.y * parallax * p * 0.6).toFixed(2)})`);
    });
    contagem++;
    if (!compacto.matches && (contagem % 2 === 0 || reduzido.matches)) desenharOndas(t * (ajustes.velocidadeOndas ?? 1));
    if (!compacto.matches || contagem % 2 === 0 || reduzido.matches) desenharAgua(t);
  }

  const palco = $(".palco");
  let ativo = false;
  let quadro = 0;
  const inicio = performance.now();
  function laco(agora) {
    atual.x += (alvo.x - atual.x) * 0.05;
    atual.y += (alvo.y - atual.y) * 0.05;
    quadroCena((agora - inicio) / 1000);
    quadro = requestAnimationFrame(laco);
  }
  ajustarAgua();
  new ResizeObserver(() => {
    ajustarAgua();
    quadroCena(reduzido.matches ? 2 : (performance.now() - inicio) / 1000);
  }).observe(tela);
  quadroCena(2);
  if (!reduzido.matches) {
    const ligar = () => {
      if (ativo) return;
      ativo = true;
      quadro = requestAnimationFrame(laco);
    };
    const desligar = () => {
      ativo = false;
      cancelAnimationFrame(quadro);
    };
    new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? ligar() : desligar())).observe(palco);
    document.addEventListener("visibilitychange", () => (document.hidden ? desligar() : ligar()));
  }

  const topo = $(".topo");
  const aoRolar = () => topo.classList.toggle("rolado", scrollY > 40);
  addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

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
    el.style.transitionDelay = `${(i % 3) * 0.08}s`;
    revelador.observe(el);
  });

  const aviso = $("#aviso");
  const abrirJanela = (janela) => (typeof janela.showModal === "function" ? janela.showModal() : janela.setAttribute("open", ""));
  const abrirAviso = (texto) => {
    $(".aviso-texto", aviso).textContent = texto;
    abrirJanela(aviso);
  };
  $$(".janela").forEach((janela) => {
    $$(".janela-fechar, .aviso-ok", janela).forEach((b) => b.addEventListener("click", () => janela.close()));
    janela.addEventListener("click", (evento) => {
      if (evento.target === janela) janela.close();
    });
  });

  const numero = String(config.whatsapp || "").replace(/\D/g, "");
  function abrirWhatsApp(mensagem) {
    if (!numero) {
      abrirAviso("Este é um site demonstrativo. Informe o número de WhatsApp do escritório em configuracao.js para ativar o contato. Mensagem preparada: “" + mensagem + "”");
      return;
    }
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, "_blank", "noopener");
  }
  $$("[data-whatsapp]").forEach((b) => b.addEventListener("click", () => abrirWhatsApp(config.mensagemPadrao)));

  const formulario = $(".formulario");
  document.addEventListener("click", (evento) => {
    const interesse = evento.target.closest("[data-interesse]");
    if (!interesse) return;
    selecao.value = interesse.dataset.interesse;
    $("#contato").scrollIntoView({ behavior: reduzido.matches ? "auto" : "smooth" });
    setTimeout(() => $("input[name=nome]", formulario).focus({ preventScroll: true }), reduzido.matches ? 0 : 700);
  });
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const erro = $(".erro", formulario);
    const nome = formulario.elements.nome;
    const servico = formulario.elements.servico;
    let primeiro = null;
    [nome, servico].forEach((campo) => {
      const vazio = !campo.value.trim();
      campo.setAttribute("aria-invalid", String(vazio));
      if (vazio && !primeiro) primeiro = campo;
    });
    erro.hidden = !primeiro;
    if (primeiro) {
      primeiro.focus();
      return;
    }
    const empresa = formulario.elements.empresa.value.trim();
    const mensagem = formulario.elements.mensagem.value.trim();
    const linhas = [
      `Olá, ${config.nomeEmpresa}! Meu nome é ${nome.value.trim()}${empresa ? `, da empresa ${empresa}` : ""}.`,
      `Tenho interesse em: ${config.servicos[Number(servico.value)].nome}.`,
    ];
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

  const apresentacao = $("#apresentacao");
  const slides = $("[data-slides]");
  const pontos = $("[data-pontos]");
  slides.innerHTML = config.etapas
    .map(([t, d], i) => `<div class="slide" role="group" aria-label="Etapa ${i + 1} de ${config.etapas.length}"><span class="slide-numero">${String(i + 1).padStart(2, "0")}</span><strong>${escapar(t)}</strong><p>${escapar(d)}</p></div>`)
    .join("");
  pontos.innerHTML = config.etapas.map((_, i) => `<button type="button" aria-label="Ir para a etapa ${i + 1}"></button>`).join("");
  let indice = 0;
  let relogio = 0;
  function mostrar(i) {
    indice = (i + config.etapas.length) % config.etapas.length;
    $$(".slide", slides).forEach((s, k) => s.classList.toggle("atual", k === indice));
    $$("button", pontos).forEach((b, k) => (k === indice ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current")));
  }
  const reiniciarRelogio = () => {
    clearInterval(relogio);
    if (!reduzido.matches) relogio = setInterval(() => mostrar(indice + 1), 4200);
  };
  $(".slide-anterior").addEventListener("click", () => {
    mostrar(indice - 1);
    reiniciarRelogio();
  });
  $(".slide-proximo").addEventListener("click", () => {
    mostrar(indice + 1);
    reiniciarRelogio();
  });
  $$("button", pontos).forEach((b, k) =>
    b.addEventListener("click", () => {
      mostrar(k);
      reiniciarRelogio();
    }),
  );
  $("[data-apresentacao]").addEventListener("click", () => {
    mostrar(0);
    abrirJanela(apresentacao);
    reiniciarRelogio();
  });
  apresentacao.addEventListener("close", () => clearInterval(relogio));
})();
