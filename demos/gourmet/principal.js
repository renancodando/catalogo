(() => {
  "use strict";
  const config = window.configuracaoEmpresa;
  const $ = (s, b = document) => b.querySelector(s);
  const $$ = (s, b = document) => [...b.querySelectorAll(s)];
  const ler = (c) => c.split(".").reduce((v, k) => v?.[k], config);
  const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const reduzido = matchMedia("(prefers-reduced-motion: reduce)");
  const raiz = document.documentElement;
  const seta = '<svg class="b-seta" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg>';
  const ajustes = Object.assign({ chamas: 1, fumaca: 1, ingredientes: 1, carrosselSegundos: 6 }, config.animacao);

  /* ---------- textos ---------- */
  $$("[data-texto]").forEach((el) => {
    const v = ler(el.dataset.texto);
    if (v != null && v !== "") el.textContent = v;
  });
  $$("[data-endereco]").forEach((el) => (el.textContent = config.endereco?.[el.dataset.endereco] ?? ""));
  $$("[data-ano]").forEach((el) => (el.textContent = new Date().getFullYear()));
  document.title = config.nomeEmpresa + " — " + config.inicio.rotulo;

  /* ---------- listas ---------- */
  const k = (pre, i) => `data-k="${pre}${i}"`;
  $(".menu").innerHTML = config.menu
    .map(([nome, alvo], i) => `<a href="${esc(alvo)}" ${i === 0 ? 'aria-current="page"' : ""} data-k="h-nav${i}"><span class="t" ${k("nav", i)}>${esc(nome)}</span></a>`)
    .join("");
  $(".etapas").innerHTML = config.inicio.etapas
    .map(([n, nome, alvo], i) => `<a href="${esc(alvo)}" class="${i === 0 ? "ativa" : ""}" data-k="h-lado${i}"><span class="t num" ${k("ladon", i)}>${esc(n)}</span><span class="t" ${k("lado", i)}>${esc(nome)}</span></a>`)
    .join("");
  $(".diferenciais").innerHTML = config.inicio.diferenciais
    .map(([ic, l1, l2], i) => `<li><img src="arte/ic-${esc(ic)}.webp" alt=""><span class="t" ${k("feat", i)}>${esc(l1)}<br>${esc(l2)}</span></li>`)
    .join("");
  $(".painel-lista").innerHTML = config.cardapio
    .slice(0, 5)
    .map((c, i) => `<li><button type="button" data-categoria="${esc(c.chave)}" data-k="h-item${i}"><img src="arte/ic-${esc(c.icone)}.webp" alt=""><span class="t" ${k("item", i)}>${esc(c.nome)}</span>${seta}</button></li>`)
    .join("");
  $(".espacos").innerHTML = config.ambiente.espacos
    .map(([nome, texto], i) => `<article class="espaco espaco-${i}"><div class="espaco-luz" aria-hidden="true"></div><h3>${esc(nome)}</h3><p>${esc(texto)}</p></article>`)
    .join("");
  $(".pontos-sobre").innerHTML = config.sobre.pontos.map((p) => `<li>${esc(p)}</li>`).join("");
  $(".horarios").innerHTML = config.horarios.map(([d, h]) => `<div><dt>${esc(d)}</dt><dd>${esc(h)}</dd></div>`).join("");

  /* ---------- escala da réplica ---------- */
  const palco = $(".palco"), quadro = $(".arte-quadro");
  let replica = false;
  const medir = () => {
    const w = raiz.clientWidth;
    replica = w >= 1280;
    raiz.classList.toggle("replica", replica);
    raiz.style.setProperty("--u", replica ? w / 1672 + "px" : "1px");
    raiz.style.setProperty("--q", quadro.clientWidth / 1672 + "px");
  };
  medir();
  new ResizeObserver(medir).observe(document.body);

  /* ---------- menu de celular ---------- */
  const botaoMenu = $(".menu-movel");
  botaoMenu.addEventListener("click", () => {
    const aberto = raiz.classList.toggle("menu-aberto");
    botaoMenu.setAttribute("aria-expanded", String(aberto));
  });
  $(".menu").addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      raiz.classList.remove("menu-aberto");
      botaoMenu.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- favoritos ---------- */
  const CHAVE_FAV = "gourmet-favoritos";
  let favoritos = new Set();
  try { favoritos = new Set(JSON.parse(localStorage.getItem(CHAVE_FAV) || "[]")); } catch {}
  const salvarFav = () => {
    try { localStorage.setItem(CHAVE_FAV, JSON.stringify([...favoritos])); } catch {}
    const c = $(".contador");
    c.hidden = !favoritos.size;
    c.textContent = favoritos.size;
  };

  /* ---------- cardápio completo ---------- */
  let categoria = config.cardapio[0].chave, termo = "", soFavoritos = false;
  const abas = $(".abas"), itens = $(".itens");
  const normal = (t) => String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  abas.innerHTML =
    config.cardapio.map((c) => `<button type="button" role="tab" data-aba="${esc(c.chave)}"><img src="arte/ic-${esc(c.icone)}.webp" alt="">${esc(c.nome)}</button>`).join("") +
    `<button type="button" role="tab" data-aba="__fav">♥ Favoritos</button>`;
  const desenharCardapio = () => {
    $$("[data-aba]", abas).forEach((b) => b.setAttribute("aria-selected", String(soFavoritos ? b.dataset.aba === "__fav" : !termo && b.dataset.aba === categoria)));
    let lista = [];
    for (const c of config.cardapio)
      for (const it of c.itens) {
        const id = c.chave + ":" + it.nome;
        if (soFavoritos ? favoritos.has(id) : termo ? normal(it.nome + " " + it.descricao).includes(normal(termo)) : c.chave === categoria)
          lista.push({ ...it, id, cat: c.nome });
      }
    itens.innerHTML = lista.length
      ? lista
          .map(
            (it, i) => `<article class="item" style="--i:${i}">
              <div><h3>${esc(it.nome)}</h3><p>${esc(it.descricao)}</p>${termo || soFavoritos ? `<small>${esc(it.cat)}</small>` : ""}</div>
              ${it.preco ? `<strong class="preco">${esc(it.preco)}</strong>` : ""}
              <button type="button" class="fav" aria-pressed="${favoritos.has(it.id)}" aria-label="Favoritar ${esc(it.nome)}" data-fav="${esc(it.id)}">♥</button>
              <button type="button" class="adicionar" data-adicionar="${esc(it.nome)}">Adicionar ao pedido</button>
            </article>`,
          )
          .join("")
      : `<p class="vazio">${soFavoritos ? "Nenhum favorito ainda. Toque no ♥ de um prato." : "Nenhum prato encontrado."}</p>`;
  };
  abas.addEventListener("click", (e) => {
    const b = e.target.closest("[data-aba]");
    if (!b) return;
    soFavoritos = b.dataset.aba === "__fav";
    if (!soFavoritos) categoria = b.dataset.aba;
    termo = "";
    $("[data-busca]").value = "";
    desenharCardapio();
  });
  $("[data-busca]").addEventListener("input", (e) => { termo = e.target.value.trim(); soFavoritos = false; desenharCardapio(); });
  const campoItens = $("textarea[name=itens]");
  itens.addEventListener("click", (e) => {
    const f = e.target.closest("[data-fav]");
    if (f) {
      favoritos.has(f.dataset.fav) ? favoritos.delete(f.dataset.fav) : favoritos.add(f.dataset.fav);
      f.setAttribute("aria-pressed", String(favoritos.has(f.dataset.fav)));
      salvarFav();
      if (soFavoritos) desenharCardapio();
    }
    const a = e.target.closest("[data-adicionar]");
    if (a) {
      campoItens.value = (campoItens.value ? campoItens.value.replace(/\s*$/, "") + "\n" : "") + "1 " + a.dataset.adicionar;
      a.textContent = "Adicionado ✓";
      setTimeout(() => (a.textContent = "Adicionar ao pedido"), 1400);
    }
  });
  const irCategoria = (chave) => {
    categoria = chave; soFavoritos = false; termo = "";
    desenharCardapio();
    $("#cardapio").scrollIntoView({ behavior: reduzido.matches ? "auto" : "smooth" });
  };
  $(".painel-lista").addEventListener("click", (e) => { const b = e.target.closest("[data-categoria]"); if (b) irCategoria(b.dataset.categoria); });
  $(".acao-favoritos").addEventListener("click", () => {
    soFavoritos = true; termo = "";
    desenharCardapio();
    $("#cardapio").scrollIntoView({ behavior: reduzido.matches ? "auto" : "smooth" });
  });
  salvarFav();
  desenharCardapio();

  /* ---------- busca rápida ---------- */
  const sobre = $(".busca-sobreposta"), rapida = $("[data-busca-rapida]"), res = $(".busca-resultados");
  const abrirBusca = (abrir) => {
    sobre.hidden = !abrir;
    if (abrir) { rapida.value = ""; res.innerHTML = ""; rapida.focus(); }
  };
  $(".acao-busca").addEventListener("click", () => abrirBusca(true));
  $(".busca-fechar").addEventListener("click", () => abrirBusca(false));
  sobre.addEventListener("click", (e) => { if (e.target === sobre) abrirBusca(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !sobre.hidden) abrirBusca(false); });
  rapida.addEventListener("input", () => {
    const q = normal(rapida.value.trim());
    const achados = [];
    if (q) for (const c of config.cardapio) for (const it of c.itens) if (normal(it.nome + " " + it.descricao).includes(q)) achados.push([c, it]);
    res.innerHTML = achados.slice(0, 8).map(([c, it]) => `<li><button type="button" data-ir="${esc(c.chave)}"><strong>${esc(it.nome)}</strong><span>${esc(c.nome)}</span></button></li>`).join("") || (q ? "<li class='vazio'>Nada encontrado.</li>" : "");
  });
  res.addEventListener("click", (e) => { const b = e.target.closest("[data-ir]"); if (b) { abrirBusca(false); irCategoria(b.dataset.ir); } });

  /* ---------- pedido ---------- */
  const form = $(".pedido"), aviso = $(".aviso");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    if (!String(d.get("nome")).trim()) { aviso.hidden = false; aviso.textContent = "Informe seu nome para continuar."; form.nome.focus(); return; }
    const texto = `${config.mensagemPadrao}\n\nNome: ${d.get("nome")}\nTipo: ${d.get("tipo")}\n${d.get("itens") ? "Itens: " + d.get("itens") : ""}`;
    const numero = String(config.whatsapp || "").replace(/\D/g, "");
    aviso.hidden = false;
    if (!numero) { aviso.textContent = "Demonstração: configure o número do WhatsApp em configuracao.js para receber os pedidos."; return; }
    aviso.textContent = "Abrindo o WhatsApp…";
    open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  });

  /* ---------- carrossel de destaques ---------- */
  const pratos = config.destaques.pratos;
  const N = pratos.length, COPIAS = N * 2;
  // posição do texto do rótulo dentro de cada recorte (pixels da arte: 356 × 258)
  const ROTULOS = [[115, 225], [111, 235], [107, 255]];
  const trilho = $(".trilho");
  trilho.innerHTML = Array.from({ length: COPIAS }, (_, i) => {
    const p = pratos[i % N], [x0, x1] = ROTULOS[i % N] || [100, 250];
    return `<article class="prato" data-i="${i % N}" ${i >= N ? 'aria-hidden="true"' : ""}>
      <img src="${esc(p.imagem)}" alt="" draggable="false" width="356" height="258">
      <canvas class="prato-fx" aria-hidden="true"></canvas>
      <button type="button" class="prato-rotulo" data-categoria="${esc(p.categoria)}" style="--rx0:${x0};--rx1:${x1}" ${i >= N ? 'tabindex="-1"' : ""}><span class="t">${esc(p.nome)}</span></button>
    </article>`;
  }).join("");
  const cartoes = $$(".prato", trilho);
  $(".pontos").innerHTML = pratos.map((p, i) => `<button type="button" role="tab" aria-label="${esc(p.nome)}" data-ponto="${i}"></button>`).join("");
  trilho.addEventListener("click", (e) => { const b = e.target.closest("[data-categoria]"); if (b && !arrastou) irCategoria(b.dataset.categoria); });
  let pos = 0, alvo = 0, arrastando = false, arrastou = false, xIni = 0, posIni = 0, ultimoToque = performance.now();
  const passo = () => (replica ? 360 * parseFloat(getComputedStyle(raiz).getPropertyValue("--u")) : cartoes[0].offsetWidth + 14);
  const ir = (d) => { alvo = Math.round(alvo) + d; ultimoToque = performance.now(); };
  $(".anterior").addEventListener("click", () => ir(-1));
  $(".proximo").addEventListener("click", () => ir(1));
  $(".pontos").addEventListener("click", (e) => {
    const b = e.target.closest("[data-ponto]");
    if (!b) return;
    const atual = ((Math.round(alvo) % N) + N) % N;
    let d = +b.dataset.ponto - atual;
    if (d > N / 2) d -= N; if (d < -N / 2) d += N;
    ir(d);
  });
  const area = $(".carrossel");
  area.addEventListener("pointerdown", (e) => { arrastando = true; arrastou = false; xIni = e.clientX; posIni = pos; area.setPointerCapture(e.pointerId); });
  area.addEventListener("pointermove", (e) => {
    if (!arrastando) return;
    const dx = e.clientX - xIni;
    if (Math.abs(dx) > 6) arrastou = true;
    pos = posIni - dx / passo(); alvo = pos; ultimoToque = performance.now();
  });
  const soltar = () => { if (!arrastando) return; arrastando = false; alvo = Math.round(pos + (pos - posIni > .15 ? .35 : pos - posIni < -.15 ? -.35 : 0)); setTimeout(() => (arrastou = false), 0); };
  area.addEventListener("pointerup", soltar);
  area.addEventListener("pointercancel", soltar);
  area.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") ir(1); if (e.key === "ArrowLeft") ir(-1); });
  const posicionarCarrossel = () => {
    const s = passo(), base = replica ? 3 * parseFloat(getComputedStyle(raiz).getPropertyValue("--u")) : (area.clientWidth - cartoes[0].offsetWidth) / 2;
    cartoes.forEach((c, i) => {
      let p = (((i - pos) % COPIAS) + COPIAS) % COPIAS;
      if (p >= COPIAS - 1) p -= COPIAS;
      c.style.transform = `translate3d(${base + p * s}px,0,0)`;
      c.dataset.p = p.toFixed(2);
      c.classList.toggle("lateral", replica && (p > 2.5 || p < -.5));
    });
    const ativo = ((Math.round(pos) % N) + N) % N;
    $$("[data-ponto]").forEach((b, i) => b.setAttribute("aria-selected", String(i === ativo)));
    $(".anterior").classList.toggle("ativa", Math.round(alvo) > 0);
  };

  /* ---------- WebGL: chamas, fumaça e líquidos da própria arte ---------- */
  const telaGL = $(".arte-gl");
  const cena = (() => {
    const gl = telaGL.getContext("webgl", { premultipliedAlpha: false, antialias: false, alpha: false });
    if (!gl) return null;
    const vs = "attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;uv.y=1.-uv.y;gl_Position=vec4(p,0.,1.);}";
    const fs = `precision mediump float;varying vec2 uv;uniform sampler2D placa,mascara;uniform float t,explosao,chamas,fumaca;uniform vec2 ponteiro;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){return .5*n(p)+.28*n(p*2.03+7.1)+.16*n(p*4.07+3.3);}
      void main(){
        vec2 R=vec2(1672.,941.),p=uv*R;vec3 m=texture2D(mascara,uv).rgb;vec2 o=vec2(0.);
        if(m.r+m.g+m.b<.012){gl_FragColor=vec4(texture2D(placa,uv).rgb,1.);return;}
        float fl=m.r*chamas*(1.+explosao*1.4);
        vec2 q=p*.02+vec2(0.,t*1.9);
        o+=vec2((fbm(q)-.5)*7.,-fbm(q*1.6+4.2)*9.)*fl;
        vec2 s=p*.006+vec2(t*.05,-t*.11);
        o+=vec2(fbm(s)-.5,fbm(s+9.3)-.5)*16.*m.g*fumaca;
        vec2 d=p-ponteiro;float r=length(d);o+=vec2(-d.y,d.x)/(r+1.)*smoothstep(170.,0.,r)*12.*m.g*fumaca;
        float w=fbm(p*.012+vec2(t*.08,0.));
        o.y+=sin(p.x*.042+t*1.25+w*4.)*2.6*m.b;o.x+=cos(p.y*.09+t*.9)*1.3*m.b;
        vec3 c=texture2D(placa,uv+o/R).rgb;
        c*=1.+fl*(.34*(fbm(p*.035+vec2(0.,t*3.2))-.5)+.3*explosao);
        c+=fl*fl*vec3(.25,.12,.03)*explosao;
        c+=m.b*pow(max(0.,sin(p.x*.05-t*1.8+w*7.)),14.)*vec3(1.,.55,.25)*.22;
        gl_FragColor=vec4(c,1.);
      }`;
    const sh = (tipo, src) => { const s = gl.createShader(tipo); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
    const v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return null;
    const pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
    gl.useProgram(pr);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const ap = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);
    const U = {}; for (const n of ["placa", "mascara", "t", "explosao", "chamas", "fumaca", "ponteiro"]) U[n] = gl.getUniformLocation(pr, n);
    let prontas = 0;
    const textura = (src, unidade, nome) => {
      const tx = gl.createTexture(), im = new Image();
      im.onload = () => {
        gl.activeTexture(gl.TEXTURE0 + unidade); gl.bindTexture(gl.TEXTURE_2D, tx);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im);
        for (const [a, b2] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, a, b2);
        gl.uniform1i(U[nome], unidade);
        if (++prontas === 2) telaGL.classList.add("pronta");
      };
      im.src = src;
    };
    textura("arte/placa.webp", 0, "placa");
    textura("arte/mascara-fx.png", 1, "mascara");
    gl.uniform1f(U.chamas, ajustes.chamas); gl.uniform1f(U.fumaca, ajustes.fumaca);
    return {
      desenhar(t, explosao, px, py, dpr) {
        if (prontas < 2) return;
        const w = Math.round(telaGL.clientWidth * dpr), h = Math.round(telaGL.clientHeight * dpr);
        if (!w || !h) return;
        if (telaGL.width !== w || telaGL.height !== h) { telaGL.width = w; telaGL.height = h; gl.viewport(0, 0, w, h); }
        gl.uniform1f(U.t, t); gl.uniform1f(U.explosao, explosao); gl.uniform2f(U.ponteiro, px, py);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      },
    };
  })();
  if (!cena) telaGL.remove();

  /* ---------- efeitos 2D: brasas, faíscas, brilho do anel e ondas ---------- */
  const telaFx = $(".arte-fx"), fx = telaFx.getContext("2d");
  const rnd = (a, b) => a + Math.random() * (b - a);
  const brasas = Array.from({ length: 64 }, () => ({ vida: Math.random() }));
  const nova = (b) => Object.assign(b, { x: rnd(840, 1080), y: rnd(380, 450), vx: rnd(-14, 14), vy: rnd(-70, -28), r: rnd(.6, 2.2), vida: 0, dur: rnd(1.4, 3.4), f: rnd(0, 6) });
  brasas.forEach((b) => { nova(b); b.vida = Math.random() * b.dur; });
  let faiscas = [];
  const desenharFx = (t, dt, explosao, dpr) => {
    const w = Math.round(telaFx.clientWidth * dpr), h = Math.round(telaFx.clientHeight * dpr);
    if (!w) return;
    if (telaFx.width !== w || telaFx.height !== h) { telaFx.width = w; telaFx.height = h; }
    fx.setTransform(w / 1672, 0, 0, h / 941, 0, 0);
    fx.clearRect(0, 0, 1672, 941);
    fx.globalCompositeOperation = "lighter";
    // brilho que respira sobre a frigideira
    const pul = .55 + .25 * Math.sin(t * 2.3) + .12 * Math.sin(t * 7.1) + explosao * .8;
    let g = fx.createRadialGradient(955, 420, 0, 955, 420, 230);
    g.addColorStop(0, `rgba(255,150,50,${.09 * pul})`); g.addColorStop(1, "rgba(255,110,30,0)");
    fx.fillStyle = g; fx.fillRect(700, 180, 520, 480);
    // reflexo percorrendo o anel laranja
    const cx = 1030, cy = 305, R = 216;
    for (const [vel, fase, forca] of [[.35, 0, 1], [-.22, 2.6, .55]]) {
      const a0 = t * vel + fase;
      for (let i = 0; i < 26; i++) {
        const a = a0 - i * .022 * Math.sign(vel), x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
        const al = (1 - i / 26) * .55 * forca;
        g = fx.createRadialGradient(x, y, 0, x, y, 12);
        g.addColorStop(0, `rgba(255,236,200,${al})`); g.addColorStop(1, "rgba(255,150,60,0)");
        fx.fillStyle = g; fx.fillRect(x - 12, y - 12, 24, 24);
      }
    }
    // ondas na base
    for (let i = 0; i < 3; i++) {
      const k = (t * .23 + i / 3) % 1, rx = 120 + k * 240;
      fx.strokeStyle = `rgba(255,170,80,${.35 * (1 - k) * Math.min(1, k * 4)})`;
      fx.lineWidth = 1.4; fx.beginPath(); fx.ellipse(985, 528, rx, rx * .13, 0, 0, Math.PI * 2); fx.stroke();
    }
    // brasas subindo
    for (const b of brasas) {
      b.vida += dt; if (b.vida > b.dur) nova(b);
      const k = b.vida / b.dur;
      b.x += (b.vx + Math.sin(t * 2 + b.f) * 18) * dt; b.y += b.vy * dt * (1 + explosao);
      const al = Math.sin(k * Math.PI) * (.55 + .45 * Math.sin(t * 9 + b.f));
      fx.fillStyle = `rgba(255,${(180 + 60 * (1 - k)) | 0},${(90 + 80 * (1 - k)) | 0},${al})`;
      fx.beginPath(); fx.arc(b.x, b.y, b.r * (1 - k * .5), 0, 7); fx.fill();
    }
    // faíscas do salto
    faiscas = faiscas.filter((f) => (f.v += dt) < f.dur);
    for (const f of faiscas) {
      const k = f.v / f.dur, x = f.x + f.vx * f.v, y = f.y + f.vy * f.v + 160 * f.v * f.v;
      fx.strokeStyle = `rgba(255,${(220 - k * 90) | 0},140,${1 - k})`; fx.lineWidth = 1.3;
      fx.beginPath(); fx.moveTo(x, y); fx.lineTo(x - f.vx * .03, y - (f.vy + 320 * f.v) * .03); fx.stroke();
    }
    fx.globalCompositeOperation = "source-over";
  };
  const estourar = () => {
    for (let i = 0; i < 46; i++) {
      const a = -Math.PI / 2 + rnd(-1.1, 1.1), v = rnd(120, 340);
      faiscas.push({ x: rnd(900, 1010), y: rnd(370, 410), vx: Math.cos(a) * v, vy: Math.sin(a) * v, v: 0, dur: rnd(.6, 1.3) });
    }
  };

  /* ---------- ingredientes no ar ---------- */
  const ING = { anel: [835, 277, 81, 100], folha: [989, 223, 57, 57], gota0: [1000, 173, 24, 28], gota1: [778, 263, 28, 29], gota2: [762, 351, 29, 27], gota3: [726, 381, 25, 22] };
  const ingredientes = $$(".ing").map((el, i) => {
    const [x, y, w, h] = ING[el.dataset.ing];
    el.style.cssText = `left:calc(${x} * var(--q));top:calc(${y} * var(--q));width:calc(${w} * var(--q));height:calc(${h} * var(--q))`;
    return { el, nome: el.dataset.ing, f: i * 1.7 };
  });
  const moverIngredientes = (t, salto, px, py) => {
    const q = parseFloat(getComputedStyle(raiz).getPropertyValue("--q")) || 1;
    const intens = ajustes.ingredientes;
    for (const g of ingredientes) {
      const sobe = -salto * (g.nome === "anel" ? 46 : g.nome === "folha" ? 58 : 38);
      const dx = (px - 960) * -.012 + Math.sin(t * .7 + g.f) * 5, dy = (py - 360) * -.01 + Math.sin(t * 1.1 + g.f) * 7 + sobe;
      let tr = `translate3d(${dx * q * intens}px,${dy * q * intens}px,0)`;
      if (g.nome === "anel") tr += ` rotate(${Math.sin(t * .5) * 14 + salto * 160}deg) rotateY(${Math.sin(t * .9) * 55 + salto * 180}deg)`;
      else if (g.nome === "folha") tr += ` rotate(${Math.sin(t * .8 + 1) * 16 - salto * 220}deg) rotateX(${Math.sin(t * 1.3) * 25}deg)`;
      else tr += ` rotate(${Math.sin(t * 1.4 + g.f) * 25 + salto * 300}deg) scale(${1 + Math.sin(t * 2 + g.f) * .06})`;
      g.el.style.transform = tr;
    }
  };

  /* ---------- brilho e órbitas das cloches ---------- */
  const fxPratos = cartoes.map((c) => ({ c, tela: $(".prato-fx", c), ctx: $(".prato-fx", c).getContext("2d") }));
  const desenharPratos = (t, dpr) => {
    for (const { c, tela, ctx } of fxPratos) {
      const p = +c.dataset.p;
      if (p < -1 || p > 3.4) continue;
      const w = Math.round(tela.clientWidth * dpr), h = Math.round(tela.clientHeight * dpr);
      if (!w) continue;
      if (tela.width !== w || tela.height !== h) { tela.width = w; tela.height = h; }
      ctx.setTransform(w / 356, 0, 0, h / 258, 0, 0);
      ctx.clearRect(0, 0, 356, 258);
      ctx.globalCompositeOperation = "lighter";
      const i = +c.dataset.i, f = i * 2.1;
      // órbitas: cometas em elipses inclinadas
      for (let o = 0; o < 2; o++) {
        const rx = 124 - o * 22, ry = 30 + o * 8, inc = (o ? .32 : -.18) + Math.sin(t * .3 + f) * .05, cy = 120 - o * 18;
        for (let j = 0; j < 22; j++) {
          const a = t * (1.1 + o * .5) + f + o * 2 - j * .05, x = 178 + Math.cos(a) * rx, y0 = Math.sin(a) * ry;
          const y = cy + y0 * Math.cos(inc) + (Math.cos(a) * rx) * Math.sin(inc) * .12;
          const frente = Math.sin(a) > 0 ? 1 : .35;
          ctx.fillStyle = `rgba(255,${(215 - j * 3) | 0},150,${(1 - j / 22) * .7 * frente})`;
          ctx.beginPath(); ctx.arc(x, y, 2 * (1 - j / 26), 0, 7); ctx.fill();
        }
      }
      // reflexo deslizando pela cúpula
      const k = ((t * .18 + i * .33) % 1.4) - .2;
      ctx.save(); ctx.beginPath(); ctx.ellipse(178, 125, 118, 104, 0, Math.PI, 0); ctx.lineTo(296, 160); ctx.lineTo(60, 160); ctx.closePath(); ctx.clip();
      const xs = 50 + k * 260, gr = ctx.createLinearGradient(xs - 26, 0, xs + 26, 0);
      gr.addColorStop(0, "rgba(255,240,220,0)"); gr.addColorStop(.5, "rgba(255,240,220,.18)"); gr.addColorStop(1, "rgba(255,240,220,0)");
      ctx.fillStyle = gr; ctx.translate(xs, 90); ctx.rotate(-.35); ctx.translate(-xs, -90); ctx.fillRect(xs - 26, 0, 52, 220);
      ctx.restore();
      // vapor saindo do topo
      for (let v = 0; v < 6; v++) {
        const kk = (t * .22 + v / 6 + f) % 1, x = 178 + Math.sin(t * .8 + v * 2 + f) * 10 * (1 + kk), y = 30 - kk * 34;
        const g2 = ctx.createRadialGradient(x, y, 0, x, y, 10 + kk * 14);
        g2.addColorStop(0, `rgba(255,220,190,${.09 * Math.sin(kk * Math.PI)})`); g2.addColorStop(1, "rgba(255,200,160,0)");
        ctx.fillStyle = g2; ctx.fillRect(x - 26, y - 26, 52, 52);
      }
      ctx.globalCompositeOperation = "source-over";
    }
  };

  /* ---------- laço único ---------- */
  let visivel = true, ultimo = performance.now(), t0 = performance.now(), px = 960, py = 360, ppx = 960, ppy = 360, proxSalto = 4, salto = 0;
  addEventListener("pointermove", (e) => {
    const r = quadro.getBoundingClientRect();
    px = ((e.clientX - r.left) / r.width) * 1672; py = ((e.clientY - r.top) / r.height) * 941;
  }, { passive: true });
  let agendado = false;
  const iniciar = () => { if (!agendado) { agendado = true; requestAnimationFrame(laco); } };
  new IntersectionObserver((es) => { visivel = es[0].isIntersecting; if (visivel) iniciar(); }, { rootMargin: "80px" }).observe(palco);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) iniciar(); });
  function laco(agora) {
    agendado = false;
    const dt = Math.min(.05, (agora - ultimo) / 1000); ultimo = agora;
    const parado = reduzido.matches;
    const t = parado ? 2.5 : (agora - t0) / 1000;
    // salto da frigideira a cada ~7 s
    if (!parado && t > proxSalto) { proxSalto = t + 7; estourar(); }
    const fase = 7 - (proxSalto - t);
    salto = parado ? 0 : fase < 1.1 ? Math.sin((fase / 1.1) * Math.PI) : 0;
    const explosao = parado ? 0 : fase < .9 ? Math.sin((fase / .9) * Math.PI) * .9 : 0;
    ppx += (px - ppx) * .06; ppy += (py - ppy) * .06;
    const dpr = Math.min(devicePixelRatio || 1, replica ? 1.5 : 1.25);
    cena?.desenhar(t, explosao, ppx, ppy, Math.min(dpr, 1));
    desenharFx(t, parado ? 0 : dt, explosao, dpr);
    moverIngredientes(t, salto, ppx, ppy);
    // carrossel: mola + troca automática
    if (!arrastando && !parado && performance.now() - ultimoToque > ajustes.carrosselSegundos * 1000) ir(1);
    if (!arrastando) pos += (alvo - pos) * (parado ? 1 : 1 - Math.exp(-dt * 7));
    posicionarCarrossel();
    desenharPratos(t, dpr);
    if (!parado && visivel && !document.hidden) iniciar();
  }
  addEventListener("resize", iniciar);
  reduzido.addEventListener?.("change", iniciar);
  iniciar();

  /* ---------- revelar seções ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visivel"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  $$(".secao .largura > *, .item, .espaco").forEach((el) => { el.classList.add("revelar"); io.observe(el); });
})();
