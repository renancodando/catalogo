(() => {
  const ajustes = window.configuracaoEmpresa.animacao;
  const reduzido = matchMedia("(prefers-reduced-motion: reduce)");
  const cena = document.getElementById("cena-aparelho");
  const giro = cena.querySelector(".cena-giro");
  const aparelho = cena.querySelector(".aparelho");
  const controle = cena.querySelector(".cena-controle");
  const dica = cena.querySelector(".cena-dica");
  const svgNS = "http://www.w3.org/2000/svg";
  document.documentElement.style.setProperty("--intensidade-brilho", ajustes.intensidadeBrilho);

  function criarParedes() {
    const paredes = aparelho.querySelector(".chassi-paredes");
    const total = 11;
    for (let i = 0; i < total; i++) {
      const parede = document.createElement("span");
      const t = i / (total - 1);
      const luz = 24 + Math.sin(t * Math.PI) * 52 + (t > 0.45 && t < 0.62 ? 12 : 0);
      parede.className = "parede";
      parede.style.setProperty("--z", `${(t * 31).toFixed(1)}px`);
      parede.style.setProperty("--luz", `${luz.toFixed(0)}%`);
      paredes.append(parede);
    }
    const corpo = aparelho.querySelector(".bateria-corpo");
    for (let i = 0; i < 5; i++) {
      const fatia = document.createElement("i");
      fatia.style.setProperty("--z", `${i * 2.6}px`);
      fatia.style.background = `hsl(204 12% ${14 + i * 3}%)`;
      corpo.append(fatia);
    }
  }

  const pecas = [
    { x: 32, y: 34, w: 74, h: 74, alt: 13, tipo: "camera" },
    { x: 118, y: 36, w: 124, h: 68, alt: 5, tipo: "peca-blindagem" },
    { x: 106, y: 122, w: 70, h: 70, alt: 9, tipo: "processador peca-chip" },
    { x: 184, y: 128, w: 54, h: 40, alt: 4, tipo: "peca-chip", rotulo: "LP5X\n8GB · 24" },
    { x: 36, y: 126, w: 62, h: 92, alt: 6, tipo: "peca-blindagem" },
    { x: 184, y: 180, w: 30, h: 24, alt: 3, tipo: "peca-chip", rotulo: "PMU\n3A2" },
    { x: 220, y: 180, w: 20, h: 24, alt: 3, tipo: "peca-chip" },
    { x: 112, y: 200, w: 58, h: 13, alt: 3, tipo: "peca-ouro" },
    { x: 40, y: 236, w: 50, h: 12, alt: 3, tipo: "peca-ouro" },
    { x: 108, y: 228, w: 134, h: 58, alt: 4, tipo: "peca-blindagem" },
    { x: 180, y: 214, w: 8, h: 5, alt: 3, tipo: "peca-capacitor" },
    { x: 194, y: 214, w: 8, h: 5, alt: 3, tipo: "peca-capacitor" },
    { x: 208, y: 214, w: 8, h: 5, alt: 3, tipo: "peca-capacitor" },
    { x: 46, y: 262, w: 7, h: 5, alt: 2, tipo: "peca-capacitor" },
    { x: 60, y: 262, w: 7, h: 5, alt: 2, tipo: "peca-capacitor" },
    { x: 74, y: 262, w: 7, h: 5, alt: 2, tipo: "peca-capacitor" },
    { x: 72, y: 532, w: 70, h: 32, alt: 7, tipo: "peca-chip", rotulo: "ALTO-FALANTE" },
    { x: 152, y: 546, w: 42, h: 18, alt: 5, tipo: "peca-blindagem" },
    { x: 200, y: 532, w: 20, h: 32, alt: 6, tipo: "peca-chip" },
  ];

  const trilhas = [
    "M141 128V112H160V104",
    "M126 128V116H96V104",
    "M170 150H184",
    "M170 170H178V176H184",
    "M112 146H98",
    "M112 168H104V196H98",
    "M141 186V200",
    "M156 186V194H200V180",
    "M126 186V196H104V230",
    "M238 148H248V300",
    "M98 236H90",
    "M64 218V236",
    "M200 204V214",
    "M232 300V528H220",
    "M60 300V520H96V532",
    "M112 300V312H168V300",
  ];

  function criarPlaca() {
    const svg = aparelho.querySelector(".placa-trilhas");
    svg.innerHTML = `<defs><linearGradient id="g-placa" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0f2e31"/><stop offset=".6" stop-color="#081c20"/><stop offset="1" stop-color="#0c2629"/></linearGradient></defs>
      <path class="placa-base" d="M32 22H248Q258 22 258 32V292Q258 302 248 302H172V318H108V302H32Q22 302 22 292V32Q22 22 32 22Z"/>
      <path class="placa-base" d="M64 524H226Q232 524 232 530V570Q232 576 226 576H64Q58 576 58 570V530Q58 524 64 524Z"/>
      <rect class="placa-flex" x="226" y="300" width="12" height="226" rx="3"/>`;
    for (const caminho of trilhas) {
      const trilha = document.createElementNS(svgNS, "path");
      trilha.setAttribute("d", caminho);
      trilha.setAttribute("class", "trilha");
      svg.append(trilha);
    }
    trilhas.forEach((caminho, indice) => {
      if (indice % 2 && indice !== 13) return;
      const pulso = document.createElementNS(svgNS, "path");
      pulso.setAttribute("d", caminho);
      pulso.setAttribute("class", "trilha-pulso");
      pulso.setAttribute("pathLength", "100");
      pulso.style.strokeDasharray = "14 120";
      pulso.style.setProperty("--duracao", `${(2.2 + (indice % 5) * 0.55) / ajustes.velocidadePulsos}s`);
      pulso.style.setProperty("--atraso", `${-indice * 0.37}s`);
      pulso.style.animationName = "pulso-curto";
      svg.append(pulso);
    });
    for (let i = 0; i < 7; i++) {
      for (const [x, y, dx, dy] of [
        [116 + i * 8, 125, 0, 0],
        [116 + i * 8, 187, 0, 0],
        [109, 132 + i * 8, 0, 0],
        [171, 132 + i * 8, 0, 0],
      ]) {
        const pino = document.createElementNS(svgNS, "rect");
        pino.setAttribute("class", "pino");
        pino.setAttribute("x", x + dx);
        pino.setAttribute("y", y + dy);
        pino.setAttribute("width", 2.4);
        pino.setAttribute("height", 2.4);
        svg.append(pino);
      }
    }
    const estilo = document.createElement("style");
    estilo.textContent = "@keyframes pulso-curto{from{stroke-dashoffset:134}to{stroke-dashoffset:0}}";
    document.head.append(estilo);

    const caixa = aparelho.querySelector(".componentes");
    caixa.innerHTML = pecas
      .map(
        (p) => `<span class="componente ${p.tipo}" style="--x:${p.x};--y:${p.y};--w:${p.w};--h:${p.h};--alt:${p.alt}">
          <span class="frente-peca"></span><span class="lado-peca"></span><span class="topo-peca"${p.rotulo ? ` data-rotulo="${p.rotulo}"` : ""}></span></span>`,
      )
      .join("");
  }

  const camadas = [
    { montado: 0, explodido: 0, amplitude: 0, fase: 0, dx: 0, dy: 0, atraso: 0 },
    { montado: 22, explodido: 46, amplitude: 0.5, fase: 0.6, dx: 0, dy: 8, atraso: 0.5 },
    { montado: 5, explodido: 26, amplitude: 0.35, fase: 1.4, dx: 0, dy: 0, atraso: 0.46 },
    { montado: 8, explodido: 64, amplitude: 1, fase: 2.3, dx: 0, dy: 10, atraso: 0.4 },
    { montado: 24, explodido: 140, amplitude: 0.8, fase: 3.1, dx: -30, dy: -40, atraso: 0.08 },
    { montado: 27, explodido: 206, amplitude: 1.25, fase: 4, dx: -88, dy: -64, atraso: 0 },
  ].map((definicao, indice) => ({ ...definicao, elemento: aparelho.querySelector(`[data-camada="${indice}"]`) }));

  function etapa(valor, atraso, fim = 1) {
    const t = Math.min(1, Math.max(0, (valor - atraso) / (fim - atraso)));
    return t * t * (3 - 2 * t);
  }

  const parafusos = [
    [40, 30, 96], [240, 30, 104], [40, 292, 88], [240, 292, 92], [140, 516, 80], [66, 566, 84], [214, 566, 90],
  ].map(([x, y, altura], indice) => {
    const elemento = document.createElement("span");
    elemento.className = "parafuso";
    elemento.style.setProperty("--x", x);
    elemento.style.setProperty("--y", y);
    elemento.innerHTML = "<i style='--i:0'></i><i style='--i:1'></i><i style='--i:2'></i><i style='--i:3'></i><i style='--i:4'></i><b></b>";
    aparelho.querySelector(".parafusos").append(elemento);
    return { elemento, x, y, altura, fase: indice * 1.7 };
  });
  const cabos = [...aparelho.querySelectorAll(".cabo")];
  function ligarCabo(cabo, origem, [x0, y0, z0], destino, [x1, y1, z1], largura) {
    const ax = x0 + origem.x;
    const ay = y0 + origem.y;
    const az = origem.z + z0;
    const bx = x1 + destino.x;
    const by = y1 + destino.y;
    const bz = destino.z + z1;
    let dx = bx - ax;
    let dy = by - ay;
    let dz = bz - az;
    const comprimento = Math.hypot(dx, dy, dz);
    if (comprimento < 2) {
      cabo.style.visibility = "hidden";
      return;
    }
    cabo.style.visibility = "visible";
    dx /= comprimento;
    dy /= comprimento;
    dz /= comprimento;
    let ex = 1 - dx * dx;
    let ey = -dx * dy;
    let ez = -dx * dz;
    const n = Math.hypot(ex, ey, ez) || 1;
    ex /= n;
    ey /= n;
    ez /= n;
    const zx = ey * dz - ez * dy;
    const zy = ez * dx - ex * dz;
    const zz = ex * dy - ey * dx;
    const ox = ax - ex * largura * 0.5;
    const oy = ay - ey * largura * 0.5;
    const oz = az - ez * largura * 0.5;
    cabo.style.setProperty("--comprimento", `${comprimento.toFixed(2)}px`);
    cabo.style.setProperty(
      "--matriz",
      `matrix3d(${[ex, ey, ez, 0, dx, dy, dz, 0, zx, zy, zz, 0, ox, oy, oz, 1].map((v) => +v.toFixed(4)).join(",")})`,
    );
  }

  let explosao = 0;
  let alvoExplosao = 1;
  let giroX = 0;
  let giroY = 0;
  let alvoGiroX = 0;
  let alvoGiroY = 0;
  let arrasteY = 0;
  let ultimoQuadro = 0;
  let ativo = true;
  let quadro = 0;
  let inicio = performance.now();

  function ajustarEscala() {
    const { width, height } = cena.getBoundingClientRect();
    const estreito = innerWidth <= 920;
    const escala = Math.min(width / (estreito ? 700 : 600), height / (estreito ? 620 : 560));
    aparelho.style.setProperty("--escala", Math.max(0.42, Math.min(escala, 1.2)).toFixed(3));
    aparelho.style.setProperty("--desvio-x", `${estreito ? width * 0.05 : 24}px`);
    aparelho.style.setProperty("--desvio-y", `${estreito ? height * 0.06 : 14}px`);
  }

  function desenhar(agora) {
    const tempo = (agora - inicio) / 1000;
    const delta = Math.min(0.05, (agora - (ultimoQuadro || agora)) / 1000);
    ultimoQuadro = agora;
    const suavizar = 1 - Math.pow(0.002, delta);
    explosao += (alvoExplosao - explosao) * (1 - Math.pow(0.04, delta));
    giroX += (alvoGiroX - giroX) * suavizar;
    giroY += (alvoGiroY + arrasteY - giroY) * suavizar;
    const balanco = reduzido.matches ? 0 : Math.sin(tempo * 0.35) * 2.2;
    giro.style.setProperty("--giro-x", `${(giroX + Math.sin(tempo * 0.27) * 1.2).toFixed(2)}deg`);
    giro.style.setProperty("--giro-y", `${(giroY + balanco).toFixed(2)}deg`);

    const amplitude = ajustes.amplitudeFlutuacao * (reduzido.matches ? 0 : 1);
    const distancia = ajustes.distanciaCamadas;
    for (const camada of camadas) {
      const p = etapa(explosao, camada.atraso);
      const flutua = Math.sin(tempo * 1.1 + camada.fase) * amplitude * camada.amplitude * p;
      const z = camada.montado + (camada.explodido * distancia - camada.montado) * p + flutua;
      const x = camada.dx * p + Math.cos(tempo * 0.7 + camada.fase) * camada.amplitude * 1.4 * p;
      const y = camada.dy * p + Math.sin(tempo * 0.6 + camada.fase) * camada.amplitude * 2 * p;
      camada.atual = { x, y, z, p };
      camada.elemento.style.setProperty("--cz", `${z.toFixed(2)}px`);
      camada.elemento.style.setProperty("--cx", `${x.toFixed(2)}px`);
      camada.elemento.style.setProperty("--cy", `${y.toFixed(2)}px`);
    }
    const [, , placa, bateria, telaCamada] = camadas;
    telaCamada.elemento.style.setProperty("--luz-tela", (1 - telaCamada.atual.p).toFixed(3));
    aparelho.style.setProperty("--abertura", explosao.toFixed(3));
    aparelho.style.setProperty("--giro-luz", `${(giroY * 2.5).toFixed(1)}deg`);
    const q = etapa(explosao, 0.16, 0.62);
    const parafusosVisiveis = telaCamada.atual.p > 0.18;
    for (const parafuso of parafusos) {
      parafuso.elemento.style.visibility = parafusosVisiveis ? "visible" : "hidden";
      const flutua = Math.sin(tempo * 1.3 + parafuso.fase) * amplitude * 0.6 * q;
      parafuso.elemento.style.setProperty("--pz", `${(placa.atual.z + 2 + q * parafuso.altura * distancia + flutua).toFixed(2)}px`);
      parafuso.elemento.style.setProperty("--px", `${(placa.atual.x + (parafuso.x - 140) * 0.22 * q).toFixed(2)}px`);
      parafuso.elemento.style.setProperty("--py", `${(placa.atual.y + (parafuso.y - 300) * 0.08 * q).toFixed(2)}px`);
      parafuso.elemento.style.setProperty("--giro", `${(q * 900 + parafuso.fase * 40).toFixed(1)}deg`);
    }
    ligarCabo(cabos[0], placa.atual, [150, 108, 3], telaCamada.atual, [150, 108, -1], 22);
    ligarCabo(cabos[1], bateria.atual, [200, 340, 12], placa.atual, [200, 304, 3], 20);
    const ciclo = (tempo * 0.16) % 1;
    aparelho.style.setProperty("--reflexo", `${(-55 + ciclo * 110 + giroY * 3).toFixed(1)}%`);
    aparelho.style.setProperty("--angulo-metal", `${(125 + giroY * 6 + Math.sin(tempo * 0.5) * 14).toFixed(1)}deg`);
    aparelho.style.setProperty("--giro-brilho", `${((tempo * 50) % 360).toFixed(1)}deg`);
    aparelho.style.setProperty("--orbita-giro", `${(Math.sin(tempo * 0.2) * 6).toFixed(2)}deg`);
  }

  function laco(agora) {
    if (!ativo) return;
    desenhar(agora);
    quadro = requestAnimationFrame(laco);
  }
  function retomar() {
    if (ativo) return;
    ativo = true;
    ultimoQuadro = 0;
    quadro = requestAnimationFrame(laco);
  }
  function pausar() {
    ativo = false;
    cancelAnimationFrame(quadro);
  }

  function alternarMontagem() {
    alvoExplosao = alvoExplosao > 0.5 ? 0 : 1;
    controle.setAttribute("aria-pressed", String(alvoExplosao < 0.5));
    dica.textContent = alvoExplosao > 0.5 ? "Toque para montar" : "Toque para desmontar";
    if (reduzido.matches) {
      explosao = alvoExplosao;
      desenhar(performance.now());
    }
  }

  let arrastando = null;
  controle.addEventListener("pointerdown", (evento) => {
    arrastando = { x: evento.clientX, inicioArraste: arrasteY, moveu: false };
  });
  addEventListener("pointermove", (evento) => {
    if (arrastando) {
      const deslocamento = evento.clientX - arrastando.x;
      if (Math.abs(deslocamento) > 6) arrastando.moveu = true;
      arrasteY = Math.max(-28, Math.min(28, arrastando.inicioArraste + deslocamento * 0.12));
      return;
    }
    if (evento.pointerType !== "mouse" || reduzido.matches) return;
    const nx = evento.clientX / innerWidth - 0.5;
    const ny = evento.clientY / innerHeight - 0.5;
    alvoGiroY = nx * ajustes.inclinacaoCursor * 1.6;
    alvoGiroX = -ny * ajustes.inclinacaoCursor;
  });
  addEventListener("pointerup", () => {
    if (!arrastando) return;
    const moveu = arrastando.moveu;
    arrastando = null;
    if (!moveu) alternarMontagem();
    else setTimeout(() => (arrasteY *= 0.4), 900);
  });
  addEventListener("pointercancel", () => (arrastando = null));
  controle.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowLeft" || evento.key === "ArrowRight") {
      evento.preventDefault();
      arrasteY = Math.max(-28, Math.min(28, arrasteY + (evento.key === "ArrowLeft" ? -6 : 6)));
    }
  });
  controle.addEventListener("click", (evento) => {
    if (evento.detail === 0) alternarMontagem();
  });

  criarParedes();
  criarPlaca();
  const relogio = () => {
    const agora = new Date();
    const texto = `${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`;
    aparelho.querySelectorAll("[data-relogio],[data-relogio-curto]").forEach((el) => (el.textContent = texto));
  };
  relogio();
  setInterval(relogio, 30000);
  ajustarEscala();
  new ResizeObserver(ajustarEscala).observe(cena);

  if (reduzido.matches) {
    explosao = 1;
    desenhar(performance.now());
    ativo = false;
  } else {
    explosao = 0;
    alvoExplosao = 0;
    desenhar(performance.now());
    setTimeout(() => (alvoExplosao = 1), 700);
    quadro = requestAnimationFrame(laco);
    new IntersectionObserver(([entrada]) => (entrada.isIntersecting && !document.hidden ? retomar() : pausar())).observe(cena);
    document.addEventListener("visibilitychange", () => (document.hidden ? pausar() : retomar()));
  }
  requestAnimationFrame(() => cena.classList.add("pronta"));

  const tela = document.querySelector(".particulas");
  const contexto = tela.getContext("2d");
  let particulas = [];
  let larguraTela = 0;
  let alturaTela = 0;
  let quadroParticulas = 0;
  function redimensionarParticulas() {
    const razao = Math.min(devicePixelRatio || 1, 1.5);
    larguraTela = innerWidth;
    alturaTela = innerHeight;
    tela.width = larguraTela * razao;
    tela.height = alturaTela * razao;
    contexto.setTransform(razao, 0, 0, razao, 0, 0);
    const quantidade = Math.round(ajustes.quantidadeParticulas * (larguraTela < 700 ? 0.5 : 1));
    particulas = Array.from({ length: quantidade }, () => ({
      x: Math.random() * larguraTela,
      y: Math.random() * alturaTela,
      raio: 0.5 + Math.random() * 1.3,
      velocidade: 4 + Math.random() * 10,
      fase: Math.random() * Math.PI * 2,
    }));
  }
  let anteriorParticulas = 0;
  function animarParticulas(agora) {
    const delta = Math.min(0.05, (agora - (anteriorParticulas || agora)) / 1000);
    anteriorParticulas = agora;
    contexto.clearRect(0, 0, larguraTela, alturaTela);
    for (const p of particulas) {
      p.y -= p.velocidade * delta;
      p.x += Math.sin(agora / 2400 + p.fase) * 4 * delta;
      if (p.y < -10) {
        p.y = alturaTela + 10;
        p.x = Math.random() * larguraTela;
      }
      const brilho = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(agora / 900 + p.fase));
      contexto.beginPath();
      contexto.fillStyle = `rgba(110, 240, 250, ${brilho.toFixed(3)})`;
      contexto.arc(p.x, p.y, p.raio, 0, Math.PI * 2);
      contexto.fill();
    }
    quadroParticulas = requestAnimationFrame(animarParticulas);
  }
  redimensionarParticulas();
  addEventListener("resize", redimensionarParticulas);
  if (!reduzido.matches) {
    quadroParticulas = requestAnimationFrame(animarParticulas);
    document.addEventListener("visibilitychange", () => {
      cancelAnimationFrame(quadroParticulas);
      anteriorParticulas = 0;
      if (!document.hidden) quadroParticulas = requestAnimationFrame(animarParticulas);
    });
  } else {
    animarParticulas(0);
    cancelAnimationFrame(quadroParticulas);
  }
})();
