/* RNCWEB Escritório — montagem a partir de configuracao.js, composição de
   referência no desktop e animações (cena flutuante, luz percorrendo o anel,
   as ondas e o "R", gráficos dos painéis, poeira, contadores e navegação). */
(() => {
  "use strict";
  const C = window.configuracaoEmpresa || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pegar = (caminho) => caminho.split(".").reduce((o, k) => (o == null ? o : o[k]), C);
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)");
  const ic = (id, extra = "") => `<svg class="ic" ${extra}><use href="#${id}"/></svg>`;

  /* ---------- conteúdo ---------- */
  $$("[data-c]").forEach((el) => {
    const v = pegar(el.dataset.c);
    if (typeof v === "string" && v) el.textContent = v;
  });
  const lista = (nome) => $(`[data-lista="${nome}"]`);

  lista("menu").innerHTML = (C.menu || []).map(([nome, alvo], i) =>
    `<li><a href="${esc(alvo)}" class="${i === 0 ? "ativo" : ""}" ${i === 0 ? 'aria-current="true"' : ""}><span data-l="nav-${i}">${esc(nome)}</span></a></li>`).join("");

  lista("cartoes").innerHTML = (C.servicos || []).map((s, i) =>
    `<li><a class="cartao" href="#areas" data-alvo="area-${i}" data-l="card-${i}">
      <img data-l="card-${i}-ic" src="${esc(s.icone)}" alt="" width="162" height="150" loading="eager" />
      <span class="cartao-titulo" data-l="card-${i}-t">${esc(s.titulo)}</span>
      <span class="cartao-texto"><span data-l="card-${i}-d">${esc(s.resumo[0])}</span> <span data-l="card-${i}-e">${esc(s.resumo[1])}</span></span>
      <span class="circulo" data-l="card-${i}-seta">${ic("i-seta")}</span>
    </a></li>`).join("");

  const N = C.numeros || { itens: [] };
  lista("numeros").innerHTML = N.itens.map(([v, antes, depois, rotulo], i) =>
    `<li data-l="num-box-${i}"><strong data-l="num-${i}" data-valor="${v}" data-antes="${esc(antes)}" data-depois="${esc(depois)}">${esc(antes)}${v}${esc(depois)}</strong><span data-l="rot-${i}">${esc(rotulo)}</span>${i < N.itens.length - 1 ? `<i class="divisor" data-l="divisor-${i}" aria-hidden="true"></i>` : ""}</li>`).join("");
  if (!N.ilustrativos) $("[data-nota-numeros]")?.remove();

  lista("lateral").innerHTML = (C.navegacaoLateral || []).map(([n, nome, alvo], i) =>
    `<li><a href="${esc(alvo)}" data-l="lat-${i}" class="${i === 0 ? "ativo" : ""}"><i class="ponto" aria-hidden="true"></i><span class="lat-n" data-l="lat-${i}-n">${esc(n)}</span><span class="lat-t" data-l="lat-${i}-t">${esc(nome)}</span></a></li>`).join("");

  lista("areas").innerHTML = (C.servicos || []).map((s, i) =>
    `<article class="area" id="area-${i}" style="--i:${i}">
      <img src="${esc(s.icone)}" alt="" width="162" height="150" loading="lazy" />
      <h3>${esc(s.titulo)}</h3>
      <p>${esc(s.resumo.join(" "))}</p>
      <ul>${s.detalhes.map((d) => `<li>${ic("i-check")}${esc(d)}</li>`).join("")}</ul>
    </article>`).join("");

  const A = C.abordagem || { etapas: [] };
  lista("etapas").innerHTML = A.etapas.map(([t, d], i) =>
    `<li style="--i:${i}"><span class="etapa-n">${String(i + 1).padStart(2, "0")}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("");

  lista("solucoes").innerHTML = (C.solucoes || []).map(([t, d, itens], i) =>
    `<article class="solucao" style="--i:${i}"><h3>${esc(t)}</h3><p>${esc(d)}</p><ul>${itens.map((x) => `<li>${ic("i-check")}${esc(x)}</li>`).join("")}</ul>
      <a class="link-solucao" href="#contato" data-assunto="${esc(t)}">Quero conversar ${ic("i-seta")}</a></article>`).join("");

  lista("assuntos").innerHTML = (C.assuntos || []).map((a) => `<option>${esc(a)}</option>`).join("");
  const info = [];
  if (C.whatsapp) info.push(`<li>${ic("i-whatsapp")}<a href="https://wa.me/${esc(C.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a></li>`);
  if (C.email) info.push(`<li>${ic("i-seta")}<a href="mailto:${esc(C.email)}">${esc(C.email)}</a></li>`);
  if (C.endereco) info.push(`<li>${ic("i-seta")}<span>${esc(C.endereco)}</span></li>`);
  if (C.horario) info.push(`<li>${ic("i-calendario")}<span>${esc(C.horario)}</span></li>`);
  lista("contato").innerHTML = info.join("");

  /* ---------- formulário ---------- */
  const form = $(".formulario"), aviso = $(".aviso", form);
  $$(".link-solucao").forEach((a) => a.addEventListener("click", () => {
    const sel = form.assunto; const op = [...sel.options].find((o) => o.value === "Outro assunto");
    if (op) sel.value = op.value;
    form.mensagem.value = `Tenho interesse em: ${a.dataset.assunto}.`;
  }));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.nome.value.trim()) { aviso.textContent = "Informe o seu nome para continuarmos."; form.nome.focus(); return; }
    const texto = `${C.mensagemPadrao || ""}\nNome: ${form.nome.value.trim()}${form.empresa.value.trim() ? "\nEmpresa: " + form.empresa.value.trim() : ""}\nAssunto: ${form.assunto.value}${form.mensagem.value.trim() ? "\n" + form.mensagem.value.trim() : ""}`;
    if (C.whatsapp) {
      window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
      aviso.textContent = "Abrimos o WhatsApp com a sua mensagem.";
    } else {
      aviso.textContent = "Demonstração: defina o número de WhatsApp em configuracao.js para receber estes pedidos.";
    }
  });

  /* ---------- menu do celular ---------- */
  const botaoMenu = $(".abrir-menu"), menu = $("#menu");
  const alternar = (abrir) => {
    document.body.classList.toggle("menu-aberto", abrir);
    botaoMenu.setAttribute("aria-expanded", String(abrir));
    botaoMenu.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
    botaoMenu.querySelector("use").setAttribute("href", abrir ? "#i-fechar" : "#i-menu");
  };
  botaoMenu.addEventListener("click", () => alternar(!document.body.classList.contains("menu-aberto")));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) alternar(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") alternar(false); });

  /* ---------- escala da composição ---------- */
  const raiz = document.documentElement, abertura = $(".abertura");
  let replica = false;
  function escala() {
    const w = raiz.clientWidth;
    replica = w >= 1280;
    raiz.classList.toggle("replica", replica);
    raiz.style.setProperty("--u", (w / 1672) + "px");
    if (!replica) alternar(document.body.classList.contains("menu-aberto"));
  }
  escala();
  addEventListener("resize", escala);

  /* ---------- navegação ativa (menu e lateral) ---------- */
  const secoes = ["inicio", "areas", "sobre", "solucoes", "contato"].map((id) => document.getElementById(id));
  const marcar = (id) => {
    $$(".menu a").forEach((a) => { const on = a.getAttribute("href") === "#" + id; a.classList.toggle("ativo", on); on ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"); });
    const lat = id === "solucoes" ? "sobre" : id;
    $$(".lateral a").forEach((a) => a.classList.toggle("ativo", a.getAttribute("href") === "#" + lat));
  };
  const io = new IntersectionObserver((es) => {
    const vis = es.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (vis) marcar(vis.target.id);
  }, { threshold: [0.25, 0.5, 0.75], rootMargin: "-20% 0px -40% 0px" });
  secoes.forEach((s) => s && io.observe(s));
  const lateral = $(".lateral");
  const ajustarLateral = () => lateral.classList.toggle("sobre-texto", scrollY > abertura.offsetHeight * 0.55);
  addEventListener("scroll", ajustarLateral, { passive: true });

  /* ---------- entradas ---------- */
  const revelar = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visivel"); revelar.unobserve(e.target); } }), { threshold: 0.15 });
  $$(".area, .etapas li, .solucao, .contato, .secao h2").forEach((el) => revelar.observe(el));
  requestAnimationFrame(() => document.body.classList.add("pronto"));

  /* ---------- contadores ---------- */
  const contar = (el) => {
    const alvo = Number(el.dataset.valor), antes = el.dataset.antes, depois = el.dataset.depois;
    if (reduzir.matches) { el.textContent = antes + alvo + depois; return; }
    const t0 = performance.now(), dur = 1800;
    const passo = (a) => { const k = Math.min(1, (a - t0) / dur), e = 1 - Math.pow(1 - k, 4); el.textContent = antes + Math.round(alvo * e) + depois; if (k < 1) requestAnimationFrame(passo); };
    requestAnimationFrame(passo);
  };
  const ioNum = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { contar(e.target); ioNum.unobserve(e.target); } }), { threshold: 0.6 });
  $$("[data-valor]").forEach((el) => ioNum.observe(el));

  /* ---------- animações ---------- */
  const carregar = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
  const TAU = Math.PI * 2;
  const ruido = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const AN = C.animacao || {};

  function prepararCanvas(cv, L, A, max = 1.5) {
    const r = cv.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    const dpr = Math.min(devicePixelRatio || 1, max), w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    const ctx = cv.getContext("2d");
    ctx.setTransform(w / L, 0, 0, h / A, 0, 0);
    return ctx;
  }
  /* luz que percorre um desenho (máscara) — o brilho só aparece onde a arte já brilha */
  function luzMascarada(cv, mascara, L, A, pintar) {
    const ctx = prepararCanvas(cv, L, A, 1.25);
    if (!ctx || !mascara) return;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, L, A);
    pintar(ctx);
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(mascara, 0, 0, L, A);
    ctx.globalCompositeOperation = "source-over";
  }
  const brilho = (ctx, x, y, r, cor, a) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${cor},${a})`); g.addColorStop(1, `rgba(${cor},0)`);
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };

  Promise.all(["arte/brilho-anel.webp", "arte/brilho-ondas.webp", "arte/brilho-lateral.webp"].map(carregar)).then(([mAnel, mOndas, mLateral]) => {
    const cena = $(".cena"), grupo = $(".grupo"), cvAnel = $(".fx-anel"), cvGrupo = $(".fx-grupo"), cvPoeira = $(".fx-poeira"), cvOndas = $(".fx-ondas"), cvLat = $(".fx-lateral");
    const poeira = Array.from({ length: 70 }, (_, i) => ({ x: ruido(i) * 800, y: ruido(i + 40) * 540, v: 4 + ruido(i + 9) * 10, s: 0.5 + ruido(i + 3) * 1.4, f: ruido(i + 7) * TAU }));
    let alvoX = 0, alvoY = 0, px = 0, py = 0, visivel = true, quadro = 0, t0 = performance.now(), ultimo = 0;
    abertura.addEventListener("pointermove", (e) => {
      const r = abertura.getBoundingClientRect();
      alvoX = ((e.clientX - r.left) / r.width - 0.5) * 2; alvoY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    }, { passive: true });
    abertura.addEventListener("pointerleave", () => { alvoX = alvoY = 0; });
    const parado = () => reduzir.matches;

    function desenhar(agora) {
      const t = parado() ? 2.5 : Math.max(0, agora - t0) / 1000 + 0.001;
      px += (alvoX - px) * 0.05; py += (alvoY - py) * 0.05;
      /* 1. cena flutuante com paralaxe (transform direto: barato) */
      const k = cena.getBoundingClientRect().width / 800;
      const fl = AN.flutuacao ?? 1, pa = AN.paralaxe ?? 1;
      const gy = (Math.sin(t * 0.7) * 5 + Math.sin(t * 0.31) * 2) * fl, gx = Math.sin(t * 0.43) * 2.5 * fl;
      const rot = Math.sin(t * 0.37) * 0.35 * fl;
      grupo.style.transform = `translate(${(gx + px * 7 * pa) * k}px, ${(gy + py * 5 * pa) * k}px) rotate(${rot}deg)`;
      /* 2. luz percorrendo o anel cobre */
      luzMascarada(cvAnel, mAnel, 800, 540, (c) => {
        for (let j = 0; j < 2; j++) {
          const a = t * 0.42 + j * Math.PI, cx = 395 + Math.cos(a) * 360, cy = 260 + Math.sin(a) * 200 - Math.cos(a) * 40;
          brilho(c, cx, cy, 150, "255,214,160", 0.95);
          brilho(c, cx, cy, 55, "255,250,235", 1);
        }
        c.fillStyle = `rgba(255,190,120,${0.12 + 0.06 * Math.sin(t * 1.3)})`; c.fillRect(0, 0, 800, 540);
      });
      /* 3. painéis: barras subindo, rosca girando, núcleo do cubo pulsando */
      const ctx = prepararCanvas(cvGrupo, 682, 406, 1.5);
      if (ctx) {
        ctx.clearRect(0, 0, 682, 406);
        ctx.globalCompositeOperation = "lighter";
        /* barras do painel da esquerda: um pulso de luz sobe por cada barra (formas medidas na arte) */
        const barras = [[54, 7.5, 184, 35], [67, 7.5, 178, 45], [82, 8.5, 174, 64], [96, 7.5, 169, 41], [110, 6.5, 164, 24]];
        barras.forEach(([x, w, base, h], i) => {
          ctx.save();
          ctx.beginPath(); ctx.moveTo(x, base); ctx.lineTo(x + w, base - w * 0.4); ctx.lineTo(x + w, base - w * 0.4 - h); ctx.lineTo(x, base - h); ctx.closePath(); ctx.clip();
          const k = ((t * 0.55 - i * 0.16) % 1 + 1) % 1, yb = base - k * (h + 24);
          const g = ctx.createLinearGradient(0, yb - 14, 0, yb + 14);
          g.addColorStop(0, "rgba(255,226,180,0)"); g.addColorStop(0.5, "rgba(255,236,205,.75)"); g.addColorStop(1, "rgba(255,226,180,0)");
          ctx.fillStyle = g; ctx.fillRect(x - 2, yb - 16, w + 4, 32);
          ctx.fillStyle = "rgba(255,190,120," + (0.12 + 0.1 * Math.sin(t * 2 - i)) + ")"; ctx.fillRect(x - 2, base - h - 6, w + 4, h + 8);
          ctx.restore();
        });
        /* varredura de luz no painel da esquerda */
        const vx = 30 + ((t * 0.25) % 1) * 220;
        const gv = ctx.createLinearGradient(vx - 20, 0, vx + 20, 0);
        gv.addColorStop(0, "rgba(220,240,255,0)"); gv.addColorStop(0.5, "rgba(220,240,255,.16)"); gv.addColorStop(1, "rgba(220,240,255,0)");
        ctx.save(); ctx.beginPath(); ctx.moveTo(20, 96); ctx.lineTo(206, 22); ctx.lineTo(210, 200); ctx.lineTo(24, 266); ctx.closePath(); ctx.clip();
        ctx.fillStyle = gv; ctx.fillRect(0, 0, 260, 300); ctx.restore();
        /* rosca do painel da direita */
        const rx = 538, ry = 211;
        ctx.lineCap = "round";
        for (let j = 0; j < 14; j++) {
          const a = t * 1.1 - j * 0.08;
          ctx.strokeStyle = `rgba(255,${206 - j * 4},${150 - j * 4},${0.75 * (1 - j / 14)})`; ctx.lineWidth = 7;
          ctx.beginPath(); ctx.ellipse(rx, ry, 30, 32, -0.1, a, a + 0.09); ctx.stroke();
        }
        brilho(ctx, rx + Math.cos(t * 1.1) * 30, ry + Math.sin(t * 1.1) * 32, 14, "255,230,190", 0.6);
        /* linhas de texto dos painéis acendendo */
        for (let j = 0; j < 3; j++) {
          const on = 0.5 + 0.5 * Math.sin(t * 2 - j * 1.4);
          ctx.fillStyle = `rgba(255,220,180,${0.08 * on})`;
          ctx.save(); ctx.translate(482, 250 + j * 18); ctx.rotate(-0.24); ctx.fillRect(0, 0, 120 - j * 22, 4); ctx.restore();
        }
        /* núcleo do cubo */
        const p = 0.55 + 0.45 * Math.sin(t * 1.4);
        brilho(ctx, 345, 250, 150, "255,170,90", 0.05 * p);
        brilho(ctx, 300, 205, 40, "255,226,190", 0.08 + 0.08 * p);
        /* reflexo percorrendo as arestas do cubo */
        const ar = [[128, 106], [362, 36], [492, 82], [492, 326], [376, 382], [128, 362], [128, 106]];
        const pos = (t * 0.18) % 1, tot = ar.length - 1, seg = Math.floor(pos * tot), f2 = pos * tot - seg;
        const [ax, ay] = ar[seg], [bx, by] = ar[seg + 1];
        brilho(ctx, ax + (bx - ax) * f2, ay + (by - ay) * f2, 26, "255,240,215", 0.7);
        ctx.globalCompositeOperation = "source-over";
      }
      /* 4. poeira dourada e faíscas */
      const cp = prepararCanvas(cvPoeira, 800, 540, 1.25);
      if (cp) {
        cp.clearRect(0, 0, 800, 540); cp.globalCompositeOperation = "lighter";
        for (const q of poeira) {
          const y = (q.y - t * q.v + 540 * 4) % 540, x = q.x + Math.sin(t * 0.5 + q.f) * 12, a = 0.35 + 0.65 * Math.max(0, Math.sin(t * 1.3 + q.f * 3));
          cp.fillStyle = `rgba(255,${200 + q.s * 30 | 0},150,${a * 0.55})`; cp.beginPath(); cp.arc(x, y, q.s, 0, TAU); cp.fill();
        }
        cp.globalCompositeOperation = "source-over";
      }
      /* 5. luz fluindo pelas ondas e pelo "R" */
      luzMascarada(cvOndas, mOndas, 1672, 421, (c) => {
        for (let j = 0; j < 3; j++) {
          const xx = ((t * 0.07 + j / 3) % 1) * 2200 - 260;
          const g = c.createLinearGradient(xx - 160, 0, xx + 160, 0);
          g.addColorStop(0, "rgba(160,255,225,0)"); g.addColorStop(0.5, "rgba(210,255,240,.95)"); g.addColorStop(1, "rgba(160,255,225,0)");
          c.fillStyle = g; c.save(); c.translate(xx, 210); c.rotate(-0.35); c.fillRect(-160, -400, 320, 800); c.restore();
        }
        const rx = ((t * 0.12) % 1) * 300 + 40;
        brilho(c, rx, 290, 70, "255,226,180", 1);
        c.fillStyle = `rgba(255,200,140,${0.1 + 0.05 * Math.sin(t)})`; c.fillRect(0, 0, 1672, 421);
      });
      if (replica) luzMascarada(cvLat, mLateral, 260, 941, (c) => {
        const yy = ((t * 0.09) % 1) * 1300 - 180;
        const g = c.createLinearGradient(0, yy - 140, 0, yy + 140);
        g.addColorStop(0, "rgba(255,210,160,0)"); g.addColorStop(0.5, "rgba(255,236,210,.9)"); g.addColorStop(1, "rgba(255,210,160,0)");
        c.fillStyle = g; c.fillRect(0, yy - 140, 260, 280);
      });
    }
    function laco(agora) {
      quadro = 0;
      if (!visivel || document.hidden) return;
      if (agora - ultimo >= 30) { ultimo = agora; desenhar(agora); }
      if (!parado()) quadro = requestAnimationFrame(laco);
    }
    const retomar = () => { if (!quadro && visivel && !document.hidden) quadro = requestAnimationFrame(laco); };
    new IntersectionObserver((es) => { visivel = es[0].isIntersecting; retomar(); }, { rootMargin: "80px" }).observe(abertura);
    document.addEventListener("visibilitychange", retomar);
    reduzir.addEventListener?.("change", () => { desenhar(performance.now()); retomar(); });
    addEventListener("resize", () => desenhar(performance.now()));
    desenhar(performance.now());
    retomar();
  });
})();
