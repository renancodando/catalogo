(() => {
  "use strict";
  const C = window.configuracaoEmpresa;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const valor = (caminho) => caminho.split(".").reduce((o, k) => (o == null ? o : o[k]), C);
  const icone = (nome, classe = "") => `<svg class="${classe}" aria-hidden="true"><use href="#i-${nome}"/></svg>`;
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- textos vindos da configuração ---------- */
  for (const el of $$("[data-c]")) {
    const v = valor(el.dataset.c);
    if (typeof v === "string") el.textContent = v;
  }
  document.title = C.nomeEmpresa + " — Lava-jato premium";
  const [p1, p2, p3] = C.planos.titulo;
  $("#pl-h1").textContent = p1;
  $("#pl-h2 em").textContent = p2;
  $("#pl-h2 span").textContent = p3;

  $("[data-destaques]").innerHTML = C.inicio.destaques
    .map(([ic, a, b]) => `<li class="destaque">${icone(ic)}<span class="t">${esc(a)}\n${esc(b)}</span></li>`)
    .join("");
  $("[data-checagem]").innerHTML = C.inicio.cuidado.itens
    .map((t) => `<li>${icone("check")}<span class="t">${esc(t)}</span></li>`)
    .join("");

  /* ---------- anel do nível de cuidado ---------- */
  const anel = $("#anel"), numero = $("[data-porcento]"), alvoPct = C.inicio.cuidado.porcentagem;
  const pct = Math.max(0, Math.min(100, alvoPct)) / 100;
  for (const a of $$(".arco", anel)) a.style.setProperty("--fim", String(100 - pct * 100));
  let anelFeito = false;
  function encherAnel() {
    if (anelFeito) return;
    anelFeito = true;
    $(".cuidado").classList.add("cheio");
    $$(".arco", anel).forEach((a) => (a.style.strokeDashoffset = String(100 - pct * 100)));
    if (reduzir.matches) { numero.textContent = alvoPct; return; }
    const t0 = performance.now();
    const passo = (a) => {
      const k = Math.min(1, (a - t0) / 1600), e = 1 - Math.pow(1 - k, 3);
      numero.textContent = Math.round(alvoPct * e);
      if (k < 1) requestAnimationFrame(passo);
    };
    numero.textContent = "0";
    requestAnimationFrame(passo);
  }
  new IntersectionObserver((es, o) => { if (es.some((e) => e.isIntersecting)) { encherAnel(); o.disconnect(); } }, { threshold: 0.4 }).observe(anel);

  /* ---------- carrossel de serviços ---------- */
  const S = C.servicos, n = S.length, trilho = $("[data-trilho]");
  let atual = 0;
  trilho.innerHTML = S.map((s, i) => `<button type="button" class="servico" role="option" data-i="${i}" aria-label="${esc(s.nome.replace("\n", " "))}">${icone(s.icone, "ic-servico")}<span class="t">${esc(s.nome)}</span></button>`).join("");
  const itens = $$(".servico", trilho);
  const replica = matchMedia("(min-width: 1280px)");
  function posicionar(anunciar) {
    itens.forEach((el, i) => {
      let slot = (i - atual + n) % n;
      if (slot === n - 1 && n > 5) slot = -1;
      el.dataset.slot = slot;
      const ativo = i === atual;
      el.classList.toggle("ativo", ativo);
      el.setAttribute("aria-selected", String(ativo));
      if (ativo && anunciar) { el.classList.remove("chegou"); void el.offsetWidth; el.classList.add("chegou"); }
    });
    if (!replica.matches) {
      /* rola só o trilho, nunca a página */
      const el = itens[atual];
      trilho.scrollTo({ left: el.offsetLeft - trilho.offsetLeft - (trilho.clientWidth - el.offsetWidth) / 2, behavior: anunciar && !reduzir.matches ? "smooth" : "auto" });
    }
    mostrarDetalhe(atual);
  }
  function irPara(i) { atual = (i + n) % n; posicionar(true); }
  $("#seta-esq").addEventListener("click", () => irPara(atual - 1));
  $("#seta-dir").addEventListener("click", () => irPara(atual + 1));
  trilho.addEventListener("click", (e) => { const b = e.target.closest(".servico"); if (b) irPara(+b.dataset.i); });
  trilho.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); irPara(atual + 1); itens[atual].focus(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); irPara(atual - 1); itens[atual].focus(); }
  });

  /* ---------- detalhe do serviço ---------- */
  const detalhe = $("[data-detalhe]");
  function mostrarDetalhe(i) {
    const s = S[i];
    detalhe.innerHTML = `<div class="entrar"><div class="detalhe-cabeca">${icone(s.icone)}<div><small>Serviço ${String(i + 1).padStart(2, "0")} de ${String(n).padStart(2, "0")} · duração média ${esc(s.duracao)}</small><h3>${esc(s.nome.replace("\n", " "))}</h3></div></div><p>${esc(s.resumo)}</p></div>
      <div class="entrar"><ul>${s.itens.map((t) => `<li>${icone("check")}${esc(t)}</li>`).join("")}</ul><p><a class="botao botao-principal" href="#contato" data-agendar="${i}">${icone("calendario", "ic")}<span>Agendar este serviço</span>${icone("seta", "ic seta")}</a></p></div>`;
  }
  detalhe.addEventListener("click", (e) => { const a = e.target.closest("[data-agendar]"); if (a) $("[data-opcoes-servico]").value = a.dataset.agendar; });

  /* ---------- planos ---------- */
  const caixaPlanos = $("[data-planos]");
  caixaPlanos.innerHTML = C.planos.lista
    .map((p, i) => `<button type="button" class="plano${p.destaque ? " destaque-plano" : ""}" data-plano="${i}" aria-label="Plano ${esc(p.nome)}: ${esc(p.itens.join(", "))}">${p.destaque ? `<span class="t plano-selo">${esc(C.planos.selo)}</span>` : ""}${icone(p.icone, "ic-plano")}<span class="t plano-nome">${esc(p.nome)}</span><span class="t plano-texto">${esc(p.texto)}</span></button>`)
    .join("");
  caixaPlanos.addEventListener("click", (e) => {
    const b = e.target.closest("[data-plano]");
    if (!b) return;
    $("[data-opcoes-plano]").value = b.dataset.plano;
    $("#contato").scrollIntoView({ behavior: reduzir.matches ? "auto" : "smooth" });
  });

  /* ---------- sobre, contato e formulário ---------- */
  $("[data-pontos]").innerHTML = C.sobre.pontos.map((p) => `<li>${icone("escudo")}${esc(p)}</li>`).join("");
  $("[data-horarios]").innerHTML = C.horarios.map(([d, h]) => `<dt>${esc(d)}</dt><dd>${esc(h)}</dd>`).join("");
  const e = C.endereco;
  $("[data-endereco]").innerHTML = `${esc(e.rua)} · ${esc(e.cidade)}${e.referencia ? ` <small>(${esc(e.referencia)})</small>` : ""}${e.linkMapa ? ` · <a href="${esc(e.linkMapa)}" target="_blank" rel="noopener">Ver no mapa</a>` : ""}`;
  $("[data-opcoes-servico]").innerHTML = S.map((s, i) => `<option value="${i}">${esc(s.nome.replace("\n", " "))}</option>`).join("");
  $("[data-opcoes-plano]").innerHTML += C.planos.lista.map((p, i) => `<option value="${i}">${esc(p.nome)}</option>`).join("");
  const form = $("[data-formulario]"), aviso = $("[data-aviso]");
  const hoje = new Date(); form.data.min = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (!form.nome.value.trim() || !form.data.value) { aviso.hidden = false; aviso.textContent = "Preencha seu nome e a data desejada."; return; }
    const plano = form.plano.value === "" ? "" : "\nPlano: " + C.planos.lista[+form.plano.value].nome;
    const data = new Date(form.data.value + "T12:00").toLocaleDateString("pt-BR");
    const msg = `${C.mensagemPadrao}\n\nNome: ${form.nome.value.trim()}\nServiço: ${S[+form.servico.value].nome.replace("\n", " ")}${plano}\nData: ${data} (${form.periodo.value})`;
    const numero = String(C.whatsapp || "").replace(/\D/g, "");
    if (numero) { window.open("https://wa.me/" + numero + "?text=" + encodeURIComponent(msg), "_blank", "noopener"); aviso.hidden = true; return; }
    aviso.hidden = false;
    aviso.textContent = "Esta é uma demonstração: o WhatsApp da empresa ainda não foi configurado. A mensagem ficaria assim:\n\n" + msg;
  });
  $("[data-opcoes-servico]").value = "0";

  /* ---------- antes e depois ---------- */
  const comp = $("[data-comparador]");
  $("input", comp).addEventListener("input", (ev) => comp.style.setProperty("--corte", ev.target.value + "%"));

  /* ---------- menu ---------- */
  const botaoMenu = $("#hamburguer"), gaveta = $("#gaveta");
  function menu(abrir) {
    gaveta.hidden = !abrir;
    botaoMenu.setAttribute("aria-expanded", String(abrir));
    botaoMenu.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("gaveta-aberta", abrir);
    if (abrir) $("a", gaveta).focus();
  }
  botaoMenu.addEventListener("click", () => menu(gaveta.hidden));
  gaveta.addEventListener("click", (ev) => { if (ev.target === gaveta || ev.target.closest("a")) menu(false); });
  addEventListener("keydown", (ev) => { if (ev.key === "Escape" && !gaveta.hidden) { menu(false); botaoMenu.focus(); } });

  posicionar(false);

  /* =========================================================
     Animações da cena (coordenadas da arte 1672 × 941)
     ========================================================= */
  const TAU = Math.PI * 2;
  const img = (src) => { const i = new Image(); i.decoding = "async"; i.src = src; return i; };
  const AGUA = { el: img("arte/agua-luz.webp"), x: 440, y: 60, w: 1020, h: 500 };
  const ARCO = { el: img("arte/arco.webp"), x: 810, y: 110, w: 390, h: 220 };
  const pronta = (i) => i.complete && i.naturalWidth > 0;
  const forca = C.animacao || {};
  /* elipse aproximada do redemoinho em volta do carro */
  const R = { cx: 1040, cy: 300, rx: 395, ry: 205, giro: -0.2 };
  const pontoR = (a, k = 1) => {
    const x = Math.cos(a) * R.rx * k, y = Math.sin(a) * R.ry * k, c = Math.cos(R.giro), s = Math.sin(R.giro);
    return [R.cx + x * c - y * s, R.cy + x * s + y * c];
  };
  /* a água não passa na frente do para-brisa: só nos trechos visíveis da arte */
  const trechoVisivel = (a) => { const g = ((a % TAU) + TAU) % TAU; return g < 1.9 || g > 4.1; };
  const gotas = [], bolhas = Array.from({ length: 14 }, (_, i) => ({ x: 560 + ((i * 157) % 900), y: 520 - ((i * 83) % 420), r: 2 + (i % 4) * 1.6, v: 6 + (i % 5) * 3, f: i * 1.7 }));
  let ultimoEmite = 0;
  function emitir(x, y, vx, vy, n, forte = 1) {
    for (let i = 0; i < n; i++) {
      if (gotas.length > 220) gotas.shift();
      gotas.push({ x, y, vx: vx + (Math.random() - 0.5) * 90 * forte, vy: vy + (Math.random() - 0.5) * 90 * forte - 30, v: 0, vida: 0.6 + Math.random() * 1.1, r: 0.8 + Math.random() * 2.2 });
    }
  }
  let off = null, offCtx = null;
  function camadaAgua(ctx, t) {
    if (!pronta(AGUA.el)) return;
    if (!off) { off = document.createElement("canvas"); off.width = 510; off.height = 250; offCtx = off.getContext("2d"); }
    const o = offCtx;
    o.globalCompositeOperation = "source-over";
    o.clearRect(0, 0, 510, 250);
    o.drawImage(AGUA.el, 0, 0, 510, 250);
    o.globalCompositeOperation = "destination-in";
    if (o.createConicGradient) {
      const cx = (R.cx - AGUA.x) / 2, cy = (R.cy - AGUA.y) / 2, g = o.createConicGradient(-t * 1.25, cx, cy);
      for (let i = 0; i <= 12; i++) { const k = i / 12; g.addColorStop(k, `rgba(0,0,0,${i % 2 ? 0.95 : 0.08})`); }
      o.fillStyle = g;
    } else o.fillStyle = "rgba(0,0,0,.5)";
    o.fillRect(0, 0, 510, 250);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.5 * (forca.agua ?? 1);
    ctx.drawImage(off, AGUA.x, AGUA.y, AGUA.w, AGUA.h);
    ctx.restore();
  }
  let offA = null, offACtx = null;
  function camadaArco(ctx, t) {
    if (!pronta(ARCO.el)) return;
    if (!offA) { offA = document.createElement("canvas"); offA.width = 390; offA.height = 220; offACtx = offA.getContext("2d"); }
    const o = offACtx;
    o.globalCompositeOperation = "source-over";
    o.clearRect(0, 0, 390, 220);
    o.drawImage(ARCO.el, 0, 0);
    o.globalCompositeOperation = "destination-in";
    /* ponteiro do velocímetro: varre os segmentos da esquerda para a direita e volta */
    const fase = (t % 4) / 4, k = fase < 0.6 ? fase / 0.6 : 1 - (fase - 0.6) / 0.4;
    const ang = Math.PI * (1.02 + 0.62 * k);
    if (o.createConicGradient) {
      const g = o.createConicGradient(ang - 0.9, 1010 - ARCO.x, 335 - ARCO.y);
      g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(0.13, "rgba(0,0,0,.9)"); g.addColorStop(0.15, "rgba(0,0,0,1)"); g.addColorStop(0.16, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,0)");
      o.fillStyle = g;
    } else o.fillStyle = "rgba(0,0,0,.4)";
    o.fillRect(0, 0, 390, 220);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.85;
    ctx.drawImage(offA, ARCO.x, ARCO.y);
    ctx.globalAlpha = 0.18 + 0.12 * Math.sin(t * 2.2);
    ctx.drawImage(ARCO.el, ARCO.x, ARCO.y);
    ctx.restore();
  }
  function brilho(ctx, x, y, r, cor, a) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${cor},${a})`); g.addColorStop(1, `rgba(${cor},0)`);
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function farois(ctx, t) {
    const f = forca.farois ?? 1, p = 0.65 + 0.35 * Math.sin(t * 2.4) + 0.08 * Math.sin(t * 13);
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    brilho(ctx, 738, 366, 46, "255,140,40", 0.42 * p * f);
    brilho(ctx, 738, 366, 12, "255,235,200", 0.75 * p * f);
    /* faixa de LED: um brilho percorre a linha do farol direito */
    ctx.save(); ctx.translate(985, 360); ctx.rotate(-0.16); ctx.scale(1, 0.18);
    brilho(ctx, 0, 0, 80, "255,140,40", 0.38 * p * f); ctx.restore();
    const k = (t * 0.55) % 1, lx = 925 + k * 120, ly = 369 - k * 20;
    brilho(ctx, lx, ly, 18, "255,240,210", 0.9 * Math.sin(k * Math.PI) * f);
    /* entrada de ar inferior */
    ctx.save(); ctx.translate(880, 432); ctx.scale(1, 0.12); brilho(ctx, 0, 0, 130, "255,120,30", 0.28 * p * f); ctx.restore();
    /* reflexo no piso */
    for (let i = 0; i < 26; i++) {
      const y = 476 + i * 2.6, laranja = i % 3 !== 0, amp = Math.sin(t * 1.6 + i * 0.9);
      const x0 = laranja ? 700 + Math.sin(t * 0.7 + i) * 14 : 560 + ((i * 97) % 780);
      ctx.fillStyle = laranja ? `rgba(255,150,60,${0.05 + 0.07 * Math.max(0, amp)})` : `rgba(90,220,255,${0.04 + 0.06 * Math.max(0, amp)})`;
      ctx.fillRect(x0 + amp * 8, y, laranja ? 60 + i * 5 : 40, 1.1);
    }
    ctx.restore();
  }
  function particulas(ctx, t, dt) {
    if ((forca.gotas ?? 1) > 0 && t - ultimoEmite > 0.03) {
      ultimoEmite = t;
      for (let j = 0; j < 2; j++) {
        const a = -t * 1.25 + Math.random() * TAU;
        if (!trechoVisivel(a)) continue;
        const [x, y] = pontoR(a, 0.95 + Math.random() * 0.12);
        const tx = Math.sin(a), ty = -Math.cos(a) * 0.52;
        emitir(x, y, tx * 160, ty * 160 - 40, 1, 0.8);
      }
    }
    ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.lineCap = "round";
    for (let i = gotas.length - 1; i >= 0; i--) {
      const g = gotas[i];
      g.v += dt;
      if (g.v > g.vida) { gotas.splice(i, 1); continue; }
      const px = g.x, py = g.y;
      g.vy += 420 * dt; g.x += g.vx * dt; g.y += g.vy * dt;
      const a = 1 - g.v / g.vida;
      ctx.strokeStyle = `rgba(150,235,255,${0.55 * a})`; ctx.lineWidth = g.r * 0.8;
      ctx.beginPath(); ctx.moveTo(px - (g.x - px) * 2.5, py - (g.y - py) * 2.5); ctx.lineTo(g.x, g.y); ctx.stroke();
      ctx.fillStyle = `rgba(235,252,255,${0.85 * a})`;
      ctx.beginPath(); ctx.arc(g.x, g.y, g.r * 0.7, 0, TAU); ctx.fill();
      if (g.y > 490 && g.vy > 0) { /* respingo no piso */ g.vy *= -0.25; g.vx *= 0.5; }
    }
    /* bolhas subindo */
    for (const b of bolhas) {
      const y = ((b.y - t * b.v) % 460 + 460) % 460 + 60, x = b.x + Math.sin(t * 0.8 + b.f) * 6;
      ctx.strokeStyle = "rgba(170,235,255,.35)"; ctx.lineWidth = 0.9;
      ctx.beginPath(); ctx.arc(x, y, b.r, 0, TAU); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.beginPath(); ctx.arc(x - b.r * 0.35, y - b.r * 0.35, b.r * 0.28, 0, TAU); ctx.fill();
    }
    /* cintilância na crista da água */
    for (let i = 0; i < 18; i++) {
      const a = -t * 1.25 + i * 0.35;
      if (!trechoVisivel(a)) continue;
      const [x, y] = pontoR(a, 1 + 0.05 * Math.sin(i * 7 + t));
      const k = Math.max(0, Math.sin(t * 4 + i * 2.3));
      if (k < 0.6) continue;
      const s = (k - 0.6) * 2.5;
      ctx.fillStyle = `rgba(255,255,255,${0.8 * s})`;
      ctx.fillRect(x - 6 * s, y - 0.6, 12 * s, 1.2); ctx.fillRect(x - 0.6, y - 6 * s, 1.2, 12 * s);
    }
    ctx.restore();
  }

  /* canvases: cena inteira (≥1280) e recorte do carro (celular) */
  const fx = $("[data-fx]"), fxM = $("[data-fx-movel]");
  const CORTE_MOVEL = { x: 470, y: 60, w: 1000, h: 500 };
  function preparar(c, w, h) {
    const r = c.getBoundingClientRect();
    if (!r.width) return null;
    const dpr = Math.min(devicePixelRatio || 1, 1.5), W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    const ctx = c.getContext("2d");
    ctx.setTransform(W / w, 0, 0, H / h, 0, 0);
    ctx.clearRect(0, 0, w, h);
    return ctx;
  }
  /* toque/cursor na água: respingo */
  function respingo(ev, c, corte) {
    const r = c.getBoundingClientRect();
    const x = corte.x + ((ev.clientX - r.left) / r.width) * corte.w, y = corte.y + ((ev.clientY - r.top) / r.height) * corte.h;
    const dx = (x - R.cx) / R.rx, dy = (y - R.cy) / R.ry, d = Math.hypot(dx, dy);
    if (d > 0.7 && d < 1.35) emitir(x, y, 0, -120, 6, 1.4);
  }
  const palco = $("[data-palco]");
  palco.addEventListener("pointermove", (ev) => { if (replica.matches) respingo(ev, fx, { x: 0, y: 0, w: 1672, h: 941 }); }, { passive: true });
  $(".visual").addEventListener("pointerdown", (ev) => respingo(ev, fxM, CORTE_MOVEL), { passive: true });

  let visivel = true, quadro = 0, anterior = 0;
  const tInicio = performance.now();
  function desenhar(agora) {
    quadro = 0;
    if (!visivel || document.hidden) return;
    const t = (agora - tInicio) / 1000, dt = Math.min(0.05, anterior ? (agora - anterior) / 1000 : 0.016);
    anterior = agora;
    let ctx, corte;
    if (replica.matches) { ctx = preparar(fx, 1672, 941); corte = null; }
    else { ctx = preparar(fxM, CORTE_MOVEL.w, CORTE_MOVEL.h); corte = CORTE_MOVEL; }
    if (ctx) {
      if (corte) ctx.translate(-corte.x, -corte.y);
      camadaAgua(ctx, t);
      camadaArco(ctx, t);
      farois(ctx, t);
      particulas(ctx, t, dt);
    }
    if (!reduzir.matches) quadro = requestAnimationFrame(desenhar);
  }
  function retomar() { if (quadro) cancelAnimationFrame(quadro); anterior = 0; quadro = requestAnimationFrame(desenhar); }
  new IntersectionObserver((es) => { visivel = es.some((e) => e.isIntersecting); if (visivel) retomar(); }, { rootMargin: "80px" }).observe(palco);
  document.addEventListener("visibilitychange", retomar);
  replica.addEventListener?.("change", () => { posicionar(false); retomar(); });
  reduzir.addEventListener?.("change", retomar);
  retomar();
})();
