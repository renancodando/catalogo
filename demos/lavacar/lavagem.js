(() => {
  const ajustes = window.configuracaoEmpresa.animacao;
  const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cena = document.getElementById("cena-lavagem");
  const arte = cena.querySelector(".lavagem-arte");
  const lanca = arte.querySelector(".lanca");
  const carro = arte.querySelector(".carro");
  const tela = cena.querySelector(".agua");
  const ctx = tela.getContext("2d");

  const LARGURA = 1254;
  const ALTURA = 690;
  const SOLO = 604;
  const PIVO = { x: 1110, y: 110 };
  const PONTA_BASE = { x: 969, y: 164 };
  const ANGULO_BASE = Math.atan2(PONTA_BASE.y - PIVO.y, PONTA_BASE.x - PIVO.x);
  const contorno = [
    [203, 452], [232, 408], [300, 388], [360, 362], [428, 346], [480, 312], [552, 266], [700, 259], [868, 256],
    [940, 268], [984, 292], [1030, 318], [1058, 350], [1082, 374], [1098, 404], [1100, 440],
  ];

  function topoDoCarro(x) {
    if (x < contorno[0][0] || x > contorno[contorno.length - 1][0]) return Infinity;
    for (let i = 1; i < contorno.length; i++) {
      const [x1, y1] = contorno[i];
      const [x0, y0] = contorno[i - 1];
      if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
    }
    return Infinity;
  }
  function inclinacao(x) {
    return (topoDoCarro(x + 3) - topoDoCarro(x - 3)) / 6;
  }
  function limiteDaFace(x) {
    if (x < 790) return 566;
    if (x < 900) return 452;
    return 470;
  }

  const visao = { x: 0, y: 0, w: LARGURA, h: ALTURA, escala: 1 };
  let largura = 0;
  let altura = 0;
  let razao = 1;
  function ajustarVisao() {
    const caixa = cena.getBoundingClientRect();
    largura = caixa.width;
    altura = caixa.height;
    if (!largura || !altura) return;
    const aspecto = largura / altura;
    const cobrir = innerWidth > 920 && aspecto >= 1.55;
    cena.classList.toggle("enquadrada", !cobrir);
    if (cobrir) {
      let w = LARGURA;
      let h = w / aspecto;
      if (h > ALTURA) {
        h = ALTURA;
        w = h * aspecto;
      }
      Object.assign(visao, { x: LARGURA - w, y: (ALTURA - h) / 2, w, h });
    } else {
      const foco = innerWidth < 600 ? { x: 150, y: 120, w: 1015, h: 540 } : { x: 150, y: 50, w: 1080, h: 630 };
      let w = foco.w;
      let h = w / aspecto;
      if (h < foco.h) {
        h = foco.h;
        w = h * aspecto;
      }
      Object.assign(visao, { x: foco.x + (foco.w - w) / 2 + (w > foco.w ? 30 : 0), y: foco.y + (foco.h - h) / 2, w, h });
    }
    visao.escala = largura / visao.w;
    arte.setAttribute("viewBox", `${visao.x.toFixed(1)} ${visao.y.toFixed(1)} ${visao.w.toFixed(1)} ${visao.h.toFixed(1)}`);
    arte.setAttribute("preserveAspectRatio", "none");
    razao = Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1.5 : 1.75);
    tela.width = Math.round(largura * razao);
    tela.height = Math.round(altura * razao);
    pausadoEstatico && desenhar(0);
  }

  function criarSprite(tamanho, pintar) {
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = tamanho;
    pintar(sprite.getContext("2d"), tamanho / 2);
    return sprite;
  }
  const spriteEspuma = criarSprite(128, (c, m) => {
    const g = c.createRadialGradient(m * 0.8, m * 0.7, m * 0.1, m, m, m);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.55, "rgba(246,251,255,0.98)");
    g.addColorStop(0.86, "rgba(214,233,255,0.95)");
    g.addColorStop(1, "rgba(196,222,252,0)");
    c.fillStyle = g;
    c.beginPath();
    c.arc(m, m, m * 0.98, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "rgba(255,255,255,0.95)";
    c.lineWidth = m * 0.07;
    c.beginPath();
    c.arc(m, m, m * 0.84, Math.PI * 1.1, Math.PI * 1.75);
    c.stroke();
    c.strokeStyle = "rgba(150,190,240,0.35)";
    c.lineWidth = m * 0.05;
    c.beginPath();
    c.arc(m, m, m * 0.86, Math.PI * 0.15, Math.PI * 0.85);
    c.stroke();
  });
  const spriteBolha = criarSprite(96, (c, m) => {
    const g = c.createRadialGradient(m, m, m * 0.55, m, m, m * 0.95);
    g.addColorStop(0, "rgba(255,255,255,0.02)");
    g.addColorStop(0.8, "rgba(210,235,255,0.22)");
    g.addColorStop(1, "rgba(255,255,255,0.75)");
    c.fillStyle = g;
    c.beginPath();
    c.arc(m, m, m * 0.95, 0, Math.PI * 2);
    c.fill();
    const iris = c.createLinearGradient(0, 0, m * 2, m * 2);
    iris.addColorStop(0, "rgba(255,190,240,0.55)");
    iris.addColorStop(0.5, "rgba(170,240,255,0.55)");
    iris.addColorStop(1, "rgba(255,240,170,0.5)");
    c.strokeStyle = iris;
    c.lineWidth = m * 0.06;
    c.beginPath();
    c.arc(m, m, m * 0.9, 0, Math.PI * 2);
    c.stroke();
    c.fillStyle = "rgba(255,255,255,0.95)";
    c.beginPath();
    c.ellipse(m * 0.64, m * 0.6, m * 0.18, m * 0.1, -0.7, 0, Math.PI * 2);
    c.fill();
  });
  const spriteGota = criarSprite(48, (c, m) => {
    const g = c.createRadialGradient(m * 0.8, m * 0.75, m * 0.1, m, m, m);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.35, "rgba(200,230,255,0.35)");
    g.addColorStop(0.8, "rgba(255,255,255,0.75)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = g;
    c.beginPath();
    c.arc(m, m, m, 0, Math.PI * 2);
    c.fill();
  });
  const spriteNevoa = criarSprite(96, (c, m) => {
    const g = c.createRadialGradient(m, m, 0, m, m, m);
    g.addColorStop(0, "rgba(255,255,255,0.6)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, m * 2, m * 2);
  });

  const aleatorio = (min, max) => min + Math.random() * (max - min);
  const jatos = [];
  const respingos = [];
  const escorridos = [];
  const espumas = [];
  const bolhas = [];
  const estouros = [];
  const nevoas = [];
  const ondas = [];
  const LIMITES = innerWidth < 700
    ? { jatos: 520, respingos: 200, escorridos: 40, espumas: 110, nevoas: 22 }
    : { jatos: 1100, respingos: 380, escorridos: 80, espumas: 200, nevoas: 40 };

  const montesEspuma = [];
  function criarMontes() {
    const grupos = [
      { inicio: 130, fim: 470, base: 612, altura: 30 },
      { inicio: 470, fim: 720, base: 626, altura: 14 },
      { inicio: 720, fim: 1254, base: 610, altura: 54 },
    ];
    for (const grupo of grupos) {
      for (let x = grupo.inicio; x < grupo.fim; x += aleatorio(16, 30)) {
        const meio = Math.sin(((x - grupo.inicio) / (grupo.fim - grupo.inicio)) * Math.PI);
        const raio = 10 + meio * grupo.altura * aleatorio(0.55, 1.05);
        montesEspuma.push({ x, y: grupo.base - raio * 0.45 + aleatorio(-5, 5), raio, fase: Math.random() * 6.28, atraso: aleatorio(0, 1.6) });
      }
    }
    for (let i = 0; i < 26; i++) {
      const x = aleatorio(860, 1240);
      montesEspuma.push({ x, y: aleatorio(560, 600), raio: aleatorio(8, 22), fase: Math.random() * 6.28, atraso: aleatorio(1, 3) });
    }
    montesEspuma.sort((a, b) => a.y - b.y);
  }

  function criarBolha(inicial = false) {
    return {
      x: aleatorio(380, 1240),
      y: inicial ? aleatorio(300, 640) : aleatorio(600, 660),
      r: aleatorio(4, 15),
      vy: aleatorio(18, 46),
      fase: Math.random() * 6.28,
      vida: aleatorio(4, 11),
      idade: inicial ? aleatorio(0, 3) : 0,
    };
  }

  const roteiro = [
    [905, 262], [780, 256], [640, 262], [540, 300], [450, 360], [560, 392], [730, 400], [860, 340], [960, 290], [1040, 340], [980, 300],
  ];
  function pontoDoRoteiro(t) {
    const n = roteiro.length;
    const i = Math.floor(t) % n;
    const f = t - Math.floor(t);
    const p0 = roteiro[(i - 1 + n) % n];
    const p1 = roteiro[i];
    const p2 = roteiro[(i + 1) % n];
    const p3 = roteiro[(i + 2) % n];
    const f2 = f * f;
    const f3 = f2 * f;
    const cr = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * f + (2 * a - 5 * b + 4 * c - d) * f2 + (-a + 3 * b - 3 * c + d) * f3);
    return { x: cr(p0[0], p1[0], p2[0], p3[0]), y: cr(p0[1], p1[1], p2[1], p3[1]) };
  }

  const mira = { x: 880, y: 262 };
  let alvoManual = null;
  let ultimoToque = -10;
  let tempo = 0;
  let progressoRoteiro = 0;
  let intensidadeJato = 0;
  let crescimentoEspuma = 0;
  let qualidade = 1;
  let mediaQuadro = 16;
  let giroLanca = 0;
  let ponta = { ...PONTA_BASE };
  let impactoAtual = null;

  function emitir(dt) {
    const direcaoX = mira.x - ponta.x;
    const direcaoY = mira.y - ponta.y;
    const distancia = Math.hypot(direcaoX, direcaoY) || 1;
    const dx = direcaoX / distancia;
    const dy = direcaoY / distancia;
    const quantidade = Math.round(900 * ajustes.particulasJato * qualidade * intensidadeJato * dt * (innerWidth < 700 ? 0.55 : 1));
    for (let i = 0; i < quantidade && jatos.length < LIMITES.jatos; i++) {
      const abertura = aleatorio(-0.075, 0.075) + aleatorio(-0.02, 0.02);
      const velocidade = aleatorio(1350, 1850);
      const vx = (dx - dy * abertura) * velocidade;
      const vy = (dy + dx * abertura) * velocidade;
      const avanco = Math.random() * dt;
      jatos.push({ x: ponta.x + vx * avanco, y: ponta.y + vy * avanco, vx, vy, vida: 1.2, largura: aleatorio(0.8, 2.2) });
    }
  }

  function impactar(p, nx, ny, naCarroceria) {
    const forca = Math.hypot(p.vx, p.vy);
    if (Math.random() < (naCarroceria ? 0.3 : 0.45) && respingos.length < LIMITES.respingos) {
      const produto = p.vx * nx + p.vy * ny;
      let rx = p.vx - 2 * produto * nx;
      let ry = p.vy - 2 * produto * ny;
      const perda = aleatorio(0.06, 0.2);
      rx = rx * perda + aleatorio(-90, 90);
      ry = ry * perda + aleatorio(-160, 10);
      respingos.push({ x: p.x, y: p.y - 2, vx: rx, vy: ry, r: aleatorio(1.8, 4.6), vida: aleatorio(0.45, 1.1), idade: 0 });
    }
    if (naCarroceria && Math.random() < 0.05 && escorridos.length < LIMITES.escorridos) {
      escorridos.push({ x: p.x + aleatorio(-6, 6), y: p.y + 3, vy: aleatorio(25, 60), deriva: aleatorio(-14, 6), r: aleatorio(1.6, 3.2), trilha: [], idade: 0, vida: aleatorio(3, 6) });
    }
    if (Math.random() < (naCarroceria ? 0.07 : 0.02) * ajustes.intensidadeEspuma && espumas.length < LIMITES.espumas) {
      espumas.push({ x: p.x + aleatorio(-16, 16), y: p.y + aleatorio(-6, 4), r: 0, alvo: aleatorio(6, naCarroceria ? 17 : 20), idade: 0, vida: aleatorio(3, 7), presa: naCarroceria });
    }
    if (Math.random() < 0.05 && nevoas.length < LIMITES.nevoas) {
      nevoas.push({ x: p.x, y: p.y, vx: p.vx * 0.03 + aleatorio(-20, 20), vy: -aleatorio(10, 40), r: aleatorio(26, 60), idade: 0, vida: aleatorio(0.8, 1.6) });
    }
    if (!naCarroceria && Math.random() < 0.05 && ondas.length < 26) ondas.push({ x: p.x, y: p.y, idade: 0, vida: aleatorio(0.8, 1.4) });
    return forca;
  }

  function simular(dt) {
    tempo += dt;
    const gravidade = 980 * ajustes.gravidade;
    intensidadeJato = Math.min(1, Math.max(0, (tempo - 1.1) / 0.8));
    crescimentoEspuma = Math.min(1, Math.max(0, (tempo - 1.2) / 4.5));

    if (alvoManual && tempo - ultimoToque < 2.4) {
      mira.x += (alvoManual.x - mira.x) * Math.min(1, dt * 7);
      mira.y += (alvoManual.y - mira.y) * Math.min(1, dt * 7);
    } else {
      progressoRoteiro += dt * 0.32 * ajustes.velocidadeVarredura;
      const alvo = pontoDoRoteiro(progressoRoteiro);
      mira.x += (alvo.x - mira.x) * Math.min(1, dt * 3);
      mira.y += (alvo.y - mira.y) * Math.min(1, dt * 3);
    }

    const anguloDesejado = Math.atan2(mira.y - PIVO.y, mira.x - PIVO.x);
    let desvio = anguloDesejado - ANGULO_BASE;
    desvio = Math.max(-0.62, Math.min(0.5, desvio));
    giroLanca += (desvio - giroLanca) * Math.min(1, dt * 8);
    const cos = Math.cos(giroLanca);
    const sen = Math.sin(giroLanca);
    const bx = PONTA_BASE.x - PIVO.x;
    const by = PONTA_BASE.y - PIVO.y;
    const tremor = Math.sin(tempo * 37) * 0.6 * intensidadeJato;
    ponta = { x: PIVO.x + bx * cos - by * sen, y: PIVO.y + bx * sen + by * cos + tremor };
    lanca.style.setProperty("--lanca-giro", `${((giroLanca * 180) / Math.PI).toFixed(2)}deg`);

    emitir(dt);

    impactoAtual = null;
    let somaX = 0;
    let somaY = 0;
    let impactos = 0;
    for (let i = jatos.length - 1; i >= 0; i--) {
      const p = jatos[i];
      const xAnterior = p.x;
      const yAnterior = p.y;
      p.vy += gravidade * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vida -= dt;
      const topo = topoDoCarro(p.x);
      let atingiu = false;
      if (p.y >= topo && yAnterior < topoDoCarro(xAnterior) + 4) {
        const m = inclinacao(p.x);
        const norma = Math.hypot(m, 1);
        p.y = topo;
        impactar(p, m / norma, -1 / norma, true);
        atingiu = true;
      } else if (p.y >= SOLO) {
        p.y = SOLO;
        impactar(p, 0, -1, false);
        atingiu = true;
      }
      if (atingiu) {
        somaX += p.x;
        somaY += p.y;
        impactos++;
      }
      if (atingiu || p.vida <= 0 || p.x < -50 || p.y > ALTURA + 50) jatos.splice(i, 1);
    }
    if (impactos) impactoAtual = { x: somaX / impactos, y: somaY / impactos, forca: Math.min(1, impactos / 18) };

    for (let i = respingos.length - 1; i >= 0; i--) {
      const r = respingos[i];
      r.idade += dt;
      r.vy += gravidade * dt;
      r.x += r.vx * dt;
      r.y += r.vy * dt;
      const topo = topoDoCarro(r.x);
      if (r.vy > 0 && r.y >= topo && r.y - r.vy * dt < topo + 2) {
        r.y = topo;
        r.vy *= -0.22;
        r.vx *= 0.6;
        if (Math.random() < 0.12 && escorridos.length < LIMITES.escorridos) {
          escorridos.push({ x: r.x, y: r.y + 2, vy: aleatorio(20, 50), deriva: aleatorio(-10, 6), r: r.r * 0.8, trilha: [], idade: 0, vida: aleatorio(2, 5) });
          r.idade = r.vida;
        }
      }
      if (r.y >= SOLO) {
        if (Math.random() < 0.25 && ondas.length < 26) ondas.push({ x: r.x, y: SOLO + aleatorio(0, 10), idade: 0, vida: aleatorio(0.7, 1.2) });
        r.idade = r.vida;
      }
      if (r.idade >= r.vida) respingos.splice(i, 1);
    }

    for (let i = escorridos.length - 1; i >= 0; i--) {
      const e = escorridos[i];
      e.idade += dt;
      e.vy = Math.min(140, e.vy + 40 * dt);
      e.x += (e.deriva + Math.sin(tempo * 3 + e.r * 9) * 6) * dt;
      e.y += e.vy * dt * (0.6 + 0.4 * Math.sin(tempo * 2 + e.x));
      e.trilha.push(e.x, e.y);
      if (e.trilha.length > 60) e.trilha.splice(0, 2);
      if (e.y > limiteDaFace(e.x) || e.idade > e.vida) {
        if (e.y > limiteDaFace(e.x) && respingos.length < LIMITES.respingos)
          respingos.push({ x: e.x, y: e.y, vx: aleatorio(-15, 15), vy: 40, r: e.r * 1.2, vida: 1, idade: 0 });
        escorridos.splice(i, 1);
      }
    }

    for (let i = espumas.length - 1; i >= 0; i--) {
      const f = espumas[i];
      f.idade += dt;
      const fim = Math.max(0, (f.idade - f.vida * 0.7) / (f.vida * 0.3));
      f.r += (f.alvo * (1 - fim) - f.r) * Math.min(1, dt * 2.5);
      if (f.presa) f.y += dt * (6 + f.idade * 1.5);
      if (f.y > limiteDaFace(f.x)) f.presa = false;
      if (!f.presa && f.y < SOLO) f.y += dt * 40;
      if (f.idade >= f.vida) {
        for (let k = 0; k < 3; k++) estouros.push({ x: f.x + aleatorio(-f.alvo, f.alvo), y: f.y + aleatorio(-4, 4), r: aleatorio(2, 4), idade: 0, vida: 0.35 });
        espumas.splice(i, 1);
      }
    }

    const alvoBolhas = Math.round(ajustes.quantidadeBolhas * (innerWidth < 700 ? 0.6 : 1) * qualidade);
    while (bolhas.length < alvoBolhas) bolhas.push(criarBolha(tempo < 0.1));
    for (let i = bolhas.length - 1; i >= 0; i--) {
      const b = bolhas[i];
      b.idade += dt;
      b.y -= b.vy * dt;
      b.x += Math.sin(tempo * 1.6 + b.fase) * 14 * dt;
      if (b.idade >= b.vida || b.y < 120) {
        estouros.push({ x: b.x, y: b.y, r: b.r, idade: 0, vida: 0.4 });
        bolhas.splice(i, 1);
      }
    }
    for (const lista of [estouros, nevoas, ondas]) {
      for (let i = lista.length - 1; i >= 0; i--) {
        const item = lista[i];
        item.idade += dt;
        if (item.vx !== undefined) {
          item.x += item.vx * dt;
          item.y += item.vy * dt;
        }
        if (item.idade >= item.vida) lista.splice(i, 1);
      }
    }
  }

  function desenhar(agora) {
    if (!largura) return;
    const s = visao.escala * razao;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, tela.width, tela.height);
    ctx.setTransform(s, 0, 0, s, -visao.x * s, -visao.y * s);

    const chao = ctx.createLinearGradient(0, SOLO - 30, 0, ALTURA);
    chao.addColorStop(0, "rgba(220,236,255,0)");
    chao.addColorStop(0.3, "rgba(226,240,255,0.55)");
    chao.addColorStop(1, "rgba(244,249,255,0.92)");
    ctx.fillStyle = chao;
    ctx.fillRect(visao.x - 10, SOLO - 30, visao.w + 20, ALTURA - SOLO + 60);
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1.4;
    for (let k = 0; k < 7; k++) {
      const y = SOLO + 18 + k * 10;
      ctx.beginPath();
      for (let x = visao.x - 10; x <= visao.x + visao.w + 10; x += 24) {
        const yy = y + Math.sin(x * 0.018 + tempo * (1.2 + k * 0.2) + k) * 2.2;
        x === visao.x - 10 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.globalAlpha = 0.18 + 0.05 * Math.sin(tempo + k);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    for (const o of ondas) {
      const t = o.idade / o.vida;
      ctx.strokeStyle = `rgba(255,255,255,${(0.7 * (1 - t)).toFixed(3)})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(o.x, o.y, 6 + t * 46, 2 + t * 8, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (const n of nevoas) {
      const t = n.idade / n.vida;
      ctx.globalAlpha = 0.22 * Math.sin(t * Math.PI);
      const r = n.r * (0.6 + t * 0.8);
      ctx.drawImage(spriteNevoa, n.x - r, n.y - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;

    for (const e of escorridos) {
      if (e.trilha.length < 4) continue;
      const vida = 1 - e.idade / e.vida;
      ctx.strokeStyle = `rgba(235,246,255,${(0.42 * vida).toFixed(3)})`;
      ctx.lineWidth = e.r * 0.9;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(e.trilha[0], e.trilha[1]);
      for (let k = 2; k < e.trilha.length; k += 2) ctx.lineTo(e.trilha[k], e.trilha[k + 1]);
      ctx.stroke();
      ctx.globalAlpha = Math.min(1, vida * 1.4);
      ctx.drawImage(spriteGota, e.x - e.r * 1.6, e.y - e.r * 1.6, e.r * 3.2, e.r * 3.6);
      ctx.globalAlpha = 1;
    }

    if (intensidadeJato > 0) {
      const alvo = impactoAtual || mira;
      const dx = alvo.x - ponta.x;
      const dy = alvo.y - ponta.y;
      const d = Math.hypot(dx, dy) || 1;
      const ux = dx / d;
      const uy = dy / d;
      const larguraFinal = 30 + (impactoAtual ? 10 : 0);
      ctx.globalCompositeOperation = "lighter";
      const cone = ctx.createLinearGradient(ponta.x, ponta.y, alvo.x, alvo.y);
      cone.addColorStop(0, `rgba(255,255,255,${0.5 * intensidadeJato})`);
      cone.addColorStop(0.6, `rgba(220,240,255,${0.18 * intensidadeJato})`);
      cone.addColorStop(1, "rgba(220,240,255,0.04)");
      ctx.fillStyle = cone;
      ctx.beginPath();
      ctx.moveTo(ponta.x - uy * 2.5, ponta.y + ux * 2.5);
      ctx.lineTo(alvo.x - uy * larguraFinal, alvo.y + ux * larguraFinal);
      ctx.lineTo(alvo.x + uy * larguraFinal, alvo.y - ux * larguraFinal);
      ctx.lineTo(ponta.x + uy * 2.5, ponta.y - ux * 2.5);
      ctx.fill();
      ctx.lineCap = "round";
      for (let f = 0; f < 7; f++) {
        const abertura = (f / 6 - 0.5) * 2;
        ctx.strokeStyle = `rgba(255,255,255,${(0.32 * intensidadeJato).toFixed(3)})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(ponta.x, ponta.y);
        for (let k = 1; k <= 8; k++) {
          const t = k / 8;
          const onda = Math.sin(tempo * 40 + f * 2 + k * 1.3) * 1.6 * t;
          const espalha = abertura * larguraFinal * t * 0.9 + onda;
          ctx.lineTo(ponta.x + dx * t - uy * espalha, ponta.y + dy * t + ux * espalha);
        }
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.beginPath();
      for (const p of jatos) {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 0.011, p.y - p.vy * 0.011);
      }
      ctx.lineWidth = 1.5;
      ctx.stroke();
      if (impactoAtual) {
        const brilho = ctx.createRadialGradient(impactoAtual.x, impactoAtual.y, 0, impactoAtual.x, impactoAtual.y, 54);
        brilho.addColorStop(0, `rgba(255,255,255,${0.55 * impactoAtual.forca})`);
        brilho.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = brilho;
        ctx.fillRect(impactoAtual.x - 60, impactoAtual.y - 60, 120, 120);
      }
      const bico = ctx.createRadialGradient(ponta.x, ponta.y, 0, ponta.x, ponta.y, 22);
      bico.addColorStop(0, `rgba(255,255,255,${0.75 * intensidadeJato})`);
      bico.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = bico;
      ctx.fillRect(ponta.x - 24, ponta.y - 24, 48, 48);
      ctx.globalCompositeOperation = "source-over";
    }

    for (const r of respingos) {
      const vida = 1 - r.idade / r.vida;
      ctx.globalAlpha = Math.min(1, vida * 1.6);
      const alongamento = Math.min(2.4, 1 + Math.hypot(r.vx, r.vy) / 500);
      ctx.save();
      ctx.translate(r.x, r.y);
      ctx.rotate(Math.atan2(r.vy, r.vx) + Math.PI / 2);
      ctx.drawImage(spriteGota, -r.r, -r.r * alongamento, r.r * 2, r.r * 2 * alongamento);
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    for (const f of espumas) {
      if (f.r < 0.5) continue;
      ctx.drawImage(spriteEspuma, f.x - f.r, f.y - f.r, f.r * 2, f.r * 2);
      ctx.drawImage(spriteEspuma, f.x - f.r * 1.3, f.y - f.r * 0.1, f.r * 1.2, f.r * 1.2);
    }

    for (const b of bolhas) {
      const entrada = Math.min(1, b.idade / 0.6);
      const r = b.r * (0.4 + 0.6 * entrada) * (1 + Math.sin(tempo * 3 + b.fase) * 0.04);
      ctx.globalAlpha = entrada;
      ctx.drawImage(spriteBolha, b.x - r, b.y - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;

    for (const m of montesEspuma) {
      const presenca = Math.min(1, Math.max(0, (crescimentoEspuma * 6.5 - m.atraso) / 1.4));
      if (presenca <= 0) continue;
      const r = m.raio * presenca * (1 + Math.sin(tempo * 0.9 + m.fase) * 0.035);
      const y = m.y + (1 - presenca) * 12;
      ctx.drawImage(spriteEspuma, m.x - r, y - r, r * 2, r * 2);
    }

    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 1.2;
    for (const e of estouros) {
      const t = e.idade / e.vida;
      ctx.globalAlpha = 1 - t;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r * (1 + t * 1.6), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  let anterior = 0;
  let quadro = 0;
  let ativo = false;
  let pausadoEstatico = false;
  function laco(agora) {
    const dt = Math.min(0.033, (agora - (anterior || agora)) / 1000);
    const duracao = agora - (anterior || agora);
    anterior = agora;
    if (duracao > 0) {
      mediaQuadro += (duracao - mediaQuadro) * 0.05;
      if (mediaQuadro > 24) qualidade = Math.max(0.45, qualidade - 0.01);
      else if (mediaQuadro < 18) qualidade = Math.min(1, qualidade + 0.004);
    }
    simular(dt);
    desenhar(agora);
    quadro = requestAnimationFrame(laco);
  }
  function iniciar() {
    if (ativo || reduzido) return;
    ativo = true;
    anterior = 0;
    quadro = requestAnimationFrame(laco);
  }
  function parar() {
    ativo = false;
    cancelAnimationFrame(quadro);
  }

  function paraCena(evento) {
    const caixa = cena.getBoundingClientRect();
    return {
      x: visao.x + ((evento.clientX - caixa.left) / caixa.width) * visao.w,
      y: visao.y + ((evento.clientY - caixa.top) / caixa.height) * visao.h,
    };
  }
  function mirar(evento) {
    const ponto = paraCena(evento);
    alvoManual = { x: Math.max(260, Math.min(1090, ponto.x)), y: Math.max(230, Math.min(600, ponto.y)) };
    ultimoToque = tempo;
    const nx = ((evento.clientX - cena.getBoundingClientRect().left) / largura - 0.5) * ajustes.inclinacaoCursor;
    carro.style.setProperty("--carro-x", `${(-nx * 1.6).toFixed(1)}px`);
  }
  cena.addEventListener("pointermove", (evento) => {
    if (evento.pointerType === "mouse" || evento.buttons) mirar(evento);
  });
  cena.addEventListener("pointerdown", mirar);
  cena.addEventListener("pointerleave", () => carro.style.setProperty("--carro-x", "0px"));

  criarMontes();
  ajustarVisao();
  new ResizeObserver(ajustarVisao).observe(cena);

  if (reduzido) {
    for (let i = 0; i < 300; i++) simular(1 / 60);
    pausadoEstatico = true;
    desenhar(0);
  } else {
    new IntersectionObserver(([entrada]) => (entrada.isIntersecting && !document.hidden ? iniciar() : parar()), { threshold: 0.05 }).observe(cena);
    document.addEventListener("visibilitychange", () => (document.hidden ? parar() : iniciar()));
  }
})();
