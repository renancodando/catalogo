/* A seção do catálogo usa a mesma linha de água para as placas, a refração
   e os peixes. Todas as medidas deste módulo estão em pixels da página. */
function criarAguaDoCatalogo(solicitarQuadro) {
  const secao = document.querySelector(".catalogo");
  const bases = [...secao.querySelectorAll(".base-modelo")];
  const tela = document.createElement("canvas");
  tela.className = "imersao-catalogo";
  tela.setAttribute("aria-hidden", "true");
  secao.append(tela);
  const tinta = tela.getContext("2d");
  const peixe = new Image();
  const agua = new Image();
  peixe.onload = agua.onload = solicitarQuadro;
  peixe.src = "recursos/peixe-prateado.webp";
  agua.src = "recursos/linha-dagua.webp";

  const ondas = [];
  let linhas = [],
    zonas = [],
    largura = 0,
    altura = 0,
    escala = 1;
  let visivel = false,
    ultimoTempo = 0,
    ultimoEstimulo = -1;
  const cardume = [
    { grupo: 0, atraso: 0, distancia: 0, fundo: 0.32, tamanho: 1 },
    { grupo: 0, atraso: -0.18, distancia: 6, fundo: 0.66, tamanho: 0.73 },
    { grupo: 0, atraso: -0.32, distancia: -5, fundo: 0.41, tamanho: 0.86 },
    { grupo: 1, atraso: 0, distancia: 1, fundo: 0.18, tamanho: 1.06 },
    { grupo: 1, atraso: -0.18, distancia: 6, fundo: 0.5, tamanho: 0.8 },
    { grupo: 1, atraso: -0.34, distancia: -6, fundo: 0.77, tamanho: 0.68 },
  ].map((p, i) => ({ ...p, fase: i * 1.968, susto: 0, desvio: 0, x: 0, y: 0 }));

  function medir() {
    const area = secao.getBoundingClientRect();
    largura = area.width;
    altura = area.height;
    escala = Math.min(devicePixelRatio || 1, 1.5, 1950 / Math.max(largura, 1));
    tela.width = Math.max(1, Math.round(largura * escala));
    tela.height = Math.max(1, Math.round(altura * escala));
    linhas = [];
    zonas = [];
    for (const base of bases) {
      const b = base.getBoundingClientRect();
      const topo = b.top - area.top;
      const fundo = b.bottom - area.top;
      const nivel = fundo - Math.max(10, b.height * 0.105);
      const zona = { x: b.left - area.left, topo, largura: b.width, altura: b.height, nivel };
      zonas.push(zona);
      if (!linhas.length || Math.abs(linhas.at(-1).topo - topo) > 4) {
        linhas.push({ topo, nivel, altura: b.height, centro: (b.left + b.right) * 0.5 - area.left });
      }
    }
  }

  function agitacao(x, y, t) {
    let elevacao = 0;
    for (const onda of ondas) {
      const idade = t - onda.tempo;
      const raio = Math.hypot(x - onda.x, (y - onda.y) * 2.4);
      const frente = raio - idade * 92;
      elevacao += onda.forca * Math.cos(frente * 0.14) * Math.exp(-Math.abs(frente) * 0.032 - idade * 1.3);
    }
    return elevacao;
  }

  function superficie(x, linha, t) {
    const fase = linha.topo * 0.013;
    return (
      Math.sin(x * 0.018 - t * 1.42 + fase) * 1.25 +
      Math.sin(x * 0.042 + t * 1.19 + Math.sin(x * 0.009 - t * 0.39)) * 0.63 +
      Math.cos(x * 0.009 - t * 0.78) * 0.9 +
      agitacao(x, linha.nivel, t) * 3.1
    );
  }

  function estimular(x, y, forca) {
    if (!visivel) return;
    const caixa = secao.getBoundingClientRect();
    x -= caixa.left;
    y -= caixa.top;
    if (y < 0 || y > altura) return;
    if (ondas.length >= 5) ondas.shift();
    ondas.push({ x, y, tempo: ultimoTempo, forca });
    for (const p of cardume) {
      const distancia = Math.hypot(p.x - x, (p.y - y) * 1.6);
      const proximidade = Math.max(0, 1 - distancia / 130);
      if (proximidade > 0) {
        p.susto = Math.max(p.susto, proximidade * forca);
        p.desvio = Math.max(-15, Math.min(15, p.desvio + (p.y >= y ? 1 : -1) * proximidade * 9));
      }
    }
  }

  function nadar(p, t, dt) {
    const fileira = linhas[(p.grupo + Math.round(p.fase)) % linhas.length];
    const sentido = p.grupo ? -1 : 1;
    const progressao = (p.progresso ?? 0) + dt * (1 + p.susto * 1.65);
    p.progresso = progressao;
    p.susto *= Math.exp(-dt * 2.4);
    p.desvio *= Math.exp(-dt * 1.5);
    const periodo = p.grupo ? 0.091 : 0.079;
    const arco = progressao * periodo + p.atraso + (p.grupo ? -0.76 : -0.48);
    const extensao = largura * (largura > 650 ? 0.385 : 0.4);
    const x = largura * 0.5 + sentido * extensao * Math.sin(arco);
    const mergulho = largura < 620 ? 7 : 10;
    const alturaPista = fileira.nivel + fileira.altura * 0.19;
    const y =
      alturaPista +
      mergulho * Math.cos(arco * 1.91 + p.grupo) +
      p.distancia +
      Math.sin(t * 0.55 + p.fase) * 2.3 +
      p.desvio;
    p.x = x;
    p.y = y;
    const dx = sentido * extensao * Math.cos(arco);
    const dy = -mergulho * 1.91 * Math.sin(arco * 1.91 + p.grupo);
    const rumo = Math.atan2(dy / 0.62, dx);
    const comprimento = (largura < 620 ? 39 : Math.min(74, largura * 0.051)) * p.tamanho;
    const espessura = (comprimento * peixe.naturalHeight) / peixe.naturalWidth;
    const refracao = superficie(x, fileira, t) * (0.36 + p.fundo * 0.27);
    tinta.save();
    tinta.translate(x + refracao * 0.4, y + refracao * 0.7);
    tinta.scale(1, 0.83);
    tinta.rotate(rumo);
    // A onda muscular corre da cabeça rígida para o pedúnculo. A cauda
    // tem mais curso e chega atrasada à curva; o peixe conserva sua anatomia.
    const batida = progressao * (4.8 + p.tamanho) + p.fase + 0.3 * Math.sin(t * 1.18 + p.fase);
    const amplitude = comprimento * (0.048 + 0.045 * p.susto);
    const partes = 15;
    const dxFonte = peixe.naturalWidth / partes;
    const larguraParte = comprimento / partes;
    const espinha = (u) => Math.pow(1 - u, 1.65) * amplitude * Math.sin(batida + u * 4.7);
    tinta.globalAlpha = (0.94 - p.fundo * 0.3) * (0.95 + 0.05 * Math.sin(x * 0.052 + t * 0.8));
    for (let i = 0; i < partes; i++) {
      const u = i / partes;
      const a = espinha(u),
        b = espinha((i + 1) / partes);
      tinta.save();
      tinta.translate(-comprimento * 0.5 + i * larguraParte, a);
      tinta.transform(1, (b - a) / larguraParte, 0, 1, 0, 0);
      tinta.drawImage(
        peixe,
        i * dxFonte,
        0,
        dxFonte,
        peixe.naturalHeight,
        0,
        -espessura * 0.5,
        larguraParte + 0.4,
        espessura,
      );
      tinta.restore();
    }
    tinta.restore();
  }

  function desenharLamina(linha, t) {
    const margem = largura > 980 ? largura * 0.074 : -largura * 0.05;
    const extensao = largura - 2 * margem;
    const alto = Math.max(42, Math.min(88, linha.altura * 0.46));
    const passo = Math.max(3, Math.round((extensao * escala) / 188));
    const primeiraColuna = Math.round(margem * escala);
    const ultimaColuna = Math.round((largura - margem) * escala);
    const indice = linhas.indexOf(linha);
    const inicioTextura = indice ? 0.09 * Math.sin(indice * 1.1) ** 2 : 0;
    const larguraTextura = indice ? 0.82 : 1;
    const deslocamento = t * 0.085 + linha.topo * 0.018;
    tinta.globalAlpha = 0.8;
    for (let coluna = primeiraColuna; coluna < ultimaColuna; coluna += passo) {
      const x = coluna / escala;
      const fracao = (x - margem) / extensao;
      const banda = Math.min(passo, ultimaColuna - coluna) / escala;
      const v = fracao * Math.PI;
      // O transporte longitudinal da textura é contínuo nas duas margens.
      const desvio =
        Math.sin(v) *
        (0.007 * Math.sin(v * 3.2 - deslocamento * 3) + 0.0037 * Math.sin(v * 12.1 + deslocamento * 5.3));
      const origem = Math.max(0, (inicioTextura + (fracao + desvio) * larguraTextura) * agua.naturalWidth);
      const faixa = Math.min(
        (banda / extensao) * agua.naturalWidth * larguraTextura,
        agua.naturalWidth - origem,
      );
      if (faixa <= 0) continue;
      const onda = superficie(x, linha, t);
      tinta.save();
      tinta.translate(x, linha.nivel - alto * 0.12 + onda);
      tinta.drawImage(agua, origem, 0, faixa, agua.naturalHeight, 0, 0, banda, alto);
      tinta.restore();
    }
    tinta.globalAlpha = 1;
  }

  function desenhar(t) {
    if (!tinta || !visivel || !linhas.length) return;
    const dt = Math.min(0.12, Math.max(0, t - ultimoTempo));
    ultimoTempo = t;
    while (ondas.length && t - ondas[0].tempo > 3) ondas.shift();
    tinta.setTransform(escala, 0, 0, escala, 0, 0);
    tinta.clearRect(0, 0, largura, altura);
    if (peixe.naturalWidth) {
      tinta.save();
      // As partes emersas do vidro ocultam os peixes que passam atrás delas.
      const recorte = new Path2D();
      recorte.rect(0, 0, largura, altura);
      for (const zona of zonas) recorte.rect(zona.x, zona.topo, zona.largura, zona.nivel - zona.topo);
      tinta.clip(recorte, "evenodd");
      for (const p of cardume) nadar(p, t, dt);
      tinta.restore();
    }
    if (agua.naturalWidth) for (const linha of linhas) desenharLamina(linha, t);
  }

  secao.addEventListener("pointerdown", (e) => estimular(e.clientX, e.clientY, 1.1), { passive: true });
  secao.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse" || ultimoTempo - ultimoEstimulo < 0.35) return;
      const y = e.clientY - secao.getBoundingClientRect().top;
      if (linhas.some((l) => Math.abs(y - l.nivel) < 32)) {
        ultimoEstimulo = ultimoTempo;
        estimular(e.clientX, e.clientY, 0.44);
      }
    },
    { passive: true },
  );
  new IntersectionObserver(([e]) => {
    visivel = e.isIntersecting;
    solicitarQuadro();
  }).observe(secao);
  return { medir, desenhar, ativa: () => visivel };
}
