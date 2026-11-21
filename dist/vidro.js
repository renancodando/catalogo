/* Os reflexos são redesenhados a partir das fotografias dos cartões.
   A perspectiva comprime a imagem de cada placa na lâmina de água. */
(() => {
  const pagina = document.querySelector(".pagina");
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)");
  const compacto = matchMedia("(max-width: 980px)");
  const piso = document.createElement("canvas");
  piso.className = "agua-costeira";
  piso.setAttribute("aria-hidden", "true");
  pagina.prepend(piso);

  const costa = new Image();
  const pintura = piso.getContext("2d");
  const placas = [];
  const perturbacoes = [];
  let pedido = 0;
  let anterior = 0;
  let segundos = 0;
  const intervalo = 1000 / 24;
  let horizonte = 0;
  let telaVisivel = true;
  let pisoVisivel = false;
  let precisaMedir = true;

  function instalarReflexo(base) {
    const foto = base.querySelector("img");
    const reflexo = document.createElement("canvas");
    reflexo.className = "reflexo-placa";
    reflexo.setAttribute("aria-hidden", "true");
    base.append(reflexo);
    const placa = {
      base,
      foto,
      reflexo,
      tinta: reflexo.getContext("2d"),
      superficie: document.createElement("canvas"),
      visivel: false,
      impulso: 0,
      fase: placas.length * 2.3,
    };
    placas.push(placa);
    foto.addEventListener("load", () => {
      precisaMedir = true;
      atualizar();
    });
    const observador = new IntersectionObserver(
      ([entrada]) => {
        placa.visivel = entrada.isIntersecting;
        atualizar();
      },
      { rootMargin: "70px" },
    );
    observador.observe(base);
    base.addEventListener("pointerenter", () => {
      placa.impulso = 0.7;
    });
  }

  function medir() {
    for (const placa of placas) {
      const { base, foto, superficie, reflexo } = placa;
      if (!foto.naturalWidth) continue;
      const largura = Math.max(1, Math.min(500, Math.round(base.clientWidth)));
      const altura = Math.max(1, Math.round((largura * base.clientHeight) / base.clientWidth));
      superficie.width = largura;
      superficie.height = altura;
      reflexo.width = largura;
      reflexo.height = Math.max(12, Math.round(altura * 0.25));
      const tinta = superficie.getContext("2d");
      // As dimensões intrínsecas preservam o recorte da fotografia original.
      const cobertura = Math.max(largura / foto.naturalWidth, altura / foto.naturalHeight);
      const w = foto.naturalWidth * cobertura,
        h = foto.naturalHeight * cobertura;
      tinta.drawImage(foto, (largura - w) / 2, (altura - h) / 2, w, h);
      const sombra = tinta.createLinearGradient(0, 0, 0, altura);
      sombra.addColorStop(0, "transparent");
      sombra.addColorStop(1, "#071012c9");
      tinta.fillStyle = sombra;
      tinta.fillRect(0, 0, largura, altura);
      const titulo = base.querySelector(".legenda strong");
      tinta.font = getComputedStyle(titulo).font;
      tinta.fillStyle = "#e0e4dc";
      tinta.fillText(titulo.textContent, largura * 0.09, altura * 0.75, largura * 0.78);
      tinta.strokeStyle = getComputedStyle(base).getPropertyValue("--tom");
      tinta.lineWidth = 2.4;
      tinta.strokeRect(1, 1, largura - 2, altura - 2);
    }
    if (compacto.matches) {
      piso.width = Math.min(560, pagina.clientWidth);
      piso.height = Math.round((piso.width * pagina.clientHeight) / pagina.clientWidth);
      const globo = pagina.querySelector(".vista-planeta").getBoundingClientRect();
      const alturaHorizonte = globo.top - pagina.getBoundingClientRect().top + globo.height * 0.84;
      horizonte = Math.round((alturaHorizonte * piso.width) / pagina.clientWidth);
      if (costa.naturalWidth && pintura) {
        const linhaMar = Math.round(costa.height * 0.59);
        pintura.drawImage(costa, 0, 0, costa.width, linhaMar, 0, 0, piso.width, horizonte);
        pintura.drawImage(
          costa,
          0,
          linhaMar,
          costa.width,
          costa.height - linhaMar,
          0,
          horizonte,
          piso.width,
          piso.height - horizonte,
        );
        piso.style.opacity = "1";
      }
    }
    precisaMedir = false;
  }

  function refletir(placa) {
    if (!placa.visivel || !placa.foto.naturalWidth) return;
    const { tinta, superficie, reflexo } = placa;
    const w = reflexo.width,
      h = reflexo.height;
    tinta.clearRect(0, 0, w, h);
    for (let y = 0; y < h; y += 2) {
      const distancia = y / h;
      const onda =
        Math.sin(y * 0.52 + segundos * 1.65 + placa.fase) + 0.55 * Math.sin(y * 0.87 - segundos * 2.16);
      const desvio = onda * (0.8 + distancia * 4 + placa.impulso * 3);
      const origem = Math.max(0, superficie.height * (1 - distancia) - 4);
      tinta.globalAlpha = Math.pow(1 - distancia, 1.6) * (0.57 + 0.14 * onda);
      tinta.drawImage(superficie, 0, origem, w, 4, desvio, y, w, 2);
    }
    placa.impulso *= 0.95;
  }

  function desenharCosta() {
    if (!pisoVisivel || !compacto.matches || !costa.naturalWidth || !pintura) return;
    const w = piso.width,
      h = piso.height;
    const inicio = horizonte;
    const passo = Math.max(4, Math.round((h - inicio) / 90));
    // O mapa de transparência no CSS limita a refração ao piso entre as rochas.
    for (let y = inicio; y < h; y += passo) {
      const v = y / h;
      const origem = 0.59 + (0.41 * (y - inicio)) / Math.max(1, h - inicio);
      let onda = Math.sin(v * 211 - segundos * 1.17) + 0.56 * Math.sin(v * 315 + segundos * 0.71);
      for (const toque of perturbacoes) {
        const idade = segundos - toque.tempo;
        const distancia = Math.abs(v - toque.v) * h;
        onda +=
          Math.sin(distancia * 0.25 - idade * 14) * Math.exp(-Math.abs(distancia - idade * 50) / 14 - idade);
      }
      pintura.drawImage(
        costa,
        0,
        origem * costa.height,
        costa.width,
        ((passo * 0.41) / Math.max(1, h - inicio)) * costa.height,
        -3 + onda * 1.5,
        y,
        w + 6,
        passo + 0.2,
      );
    }
  }

  function desenhar(agora) {
    pedido = requestAnimationFrame(desenhar);
    if (agora - anterior < intervalo) return;
    const delta = agora - anterior;
    anterior = agora;
    segundos += Math.min(delta / 1000, 0.12);
    if (precisaMedir) medir();
    while (perturbacoes.length && segundos - perturbacoes[0].tempo > 3) perturbacoes.shift();
    for (const placa of placas) refletir(placa);
    desenharCosta();
  }

  function atualizar() {
    cancelAnimationFrame(pedido);
    pedido = 0;
    if (document.hidden || !telaVisivel || document.querySelector("dialog[open]")) return;
    if (precisaMedir) medir();
    if (reduzir.matches) {
      for (const placa of placas) refletir(placa);
      desenharCosta();
      return;
    }
    if (placas.some((placa) => placa.visivel) || (pisoVisivel && compacto.matches)) {
      anterior = performance.now();
      pedido = requestAnimationFrame(desenhar);
    }
  }

  function tocar(evento) {
    const caixa = pagina.getBoundingClientRect();
    perturbacoes.push({ v: (evento.clientY - caixa.top) / caixa.height, tempo: segundos });
    if (perturbacoes.length > 3) perturbacoes.shift();
    for (const placa of placas) {
      if (!placa.visivel) continue;
      const borda = placa.base.getBoundingClientRect();
      const distancia = Math.hypot(
        evento.clientX - (borda.left + borda.width / 2),
        evento.clientY - borda.bottom,
      );
      placa.impulso = Math.max(placa.impulso, 1.6 * Math.exp(-distancia / 120));
    }
  }
  for (const base of document.querySelectorAll(".base-modelo")) instalarReflexo(base);
  pagina.addEventListener("pointerdown", tocar, { passive: true });
  function prepararCosta() {
    if (compacto.matches && !costa.src) costa.src = "recursos/costa-movel.webp";
    precisaMedir = true;
    atualizar();
  }
  costa.addEventListener("load", () => {
    precisaMedir = true;
    atualizar();
  });
  new ResizeObserver(() => {
    precisaMedir = true;
    atualizar();
  }).observe(pagina);
  new IntersectionObserver(([entrada]) => {
    pisoVisivel = entrada.isIntersecting;
    atualizar();
  }).observe(piso);
  new IntersectionObserver(([entrada]) => {
    telaVisivel = entrada.isIntersecting;
    atualizar();
  }).observe(pagina);
  compacto.addEventListener("change", prepararCosta);
  reduzir.addEventListener("change", atualizar);
  document.addEventListener("visibilitychange", atualizar);
  new MutationObserver(atualizar).observe(document.querySelector("dialog"), {
    attributes: true,
    attributeFilter: ["open"],
  });
  pagina.addEventListener("onda-na-enseada", (evento) => {
    if (evento.detail.forca < 0.6) tocar({ clientX: evento.detail.x, clientY: evento.detail.y });
  });
  prepararCosta();
})();
