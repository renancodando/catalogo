/* Vitra — monta o conteúdo a partir de configuracao.js, cuida da navegação,
   do agendamento e das animações das cenas. */
(() => {
  const C = window.configuracaoEmpresa;
  const $ = (s, b = document) => b.querySelector(s);
  const $$ = (s, b = document) => [...b.querySelectorAll(s)];
  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const ler = (cam) => cam.split(".").reduce((v, k) => v?.[k], C);
  const ic = (n, cls = "ic") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  /* **texto** = itálico dourado; *texto* = itálico */
  const marcar = (t) => esc(t).replace(/\+\+(.+?)\+\+/g, '<span class="ouro">$1</span>').replace(/\*\*(.+?)\*\*/g, '<em class="ouro">$1</em>').replace(/\*(.+?)\*/g, "<em>$1</em>");

  document.title = C.nomeEmpresa + " — Odontologia Estética";
  $$("[data-marca]").forEach((el) => (el.textContent = C.marca[el.dataset.marca] ?? el.textContent));
  $$("[data-texto]").forEach((el) => { const v = ler(el.dataset.texto); if (v != null) el.textContent = v; });
  $$("[data-titulo]").forEach((el) => {
    const linhas = ler(el.dataset.titulo) || [];
    el.setAttribute("aria-label", linhas.join(" ").replace(/[*+]/g, ""));
    el.innerHTML = linhas.map((l, i) => `<span class="l${i + 1} t" aria-hidden="true">${marcar(l)}</span>`).join(" ");
  });
  $$("[data-linhas]").forEach((el) => {
    const linhas = String(ler(el.dataset.linhas) || "").split("\n");
    el.innerHTML = linhas.map((l, i) => `<span class="l${i + 1} t">${esc(l)}</span>`).join(" ");
  });
  $$("[data-endereco]").forEach((el) => (el.textContent = C.endereco[el.dataset.endereco] ?? ""));
  $$("[data-ano]").forEach((el) => (el.textContent = new Date().getFullYear()));

  $("#menu").innerHTML = C.menu.map(([id, nome], i) => `<a class="t" href="#${id}"${i ? "" : ' aria-current="true"'}>${esc(nome)}</a>`).join("");
  $(".lateral").innerHTML = C.lateral.map(([n, nome, id], i) =>
    `<li><a href="#${id}"${i ? "" : ' aria-current="true"'}><span class="ponto" aria-hidden="true"></span><span class="num t">${esc(n)}</span><span class="nome t">${esc(nome)}</span></a></li>`).join("");
  $(".cartoes").innerHTML = C.tratamentos.map((t, i) =>
    `<li><button class="cartao${i ? "" : " ativo"}" type="button" data-trat="${esc(t.chave)}" aria-label="${esc(t.nome.join(" "))}">${ic(t.icone)}${t.nome.map((n, j) => `<span class="n${j + 1} t">${esc(n)}</span>`).join(" ")}${i ? "" : `<span class="mais" aria-hidden="true">${ic("seta", "")}</span>`}</button></li>`).join("");
  $(".dif-lista").innerHTML = C.diferencial.itens.map(([k, a, b]) =>
    `<li>${ic(k)}<span class="n1 t">${esc(a)}</span> <span class="n2 t">${esc(b)}</span></li>`).join("");
  $(".pontos").innerHTML = C.clinica.pontos.map((p) => `<li>${ic("check", "")}${esc(p)}</li>`).join("");
  $(".perguntas").innerHTML = C.perguntas.map(([q, r]) => `<details class="revelar"><summary>${esc(q)}</summary><p>${esc(r)}</p></details>`).join("");
  $(".horarios").innerHTML = C.horarios.map(([d, h]) => `<span>${esc(d)}: <strong>${esc(h)}</strong></span>`).join("");
  $("select[name=tratamento]").innerHTML = C.tratamentos.map((t) => `<option value="${esc(t.chave)}">${esc(t.nome.join(" "))}</option>`).join("") + '<option value="avaliacao">Avaliação geral</option>';

  /* abas de tratamentos */
  const abas = $(".abas"), painel = $(".painel-tratamento");
  abas.innerHTML = C.tratamentos.map((t, i) => `<button type="button" role="tab" id="aba-${esc(t.chave)}" aria-selected="${!i}" data-aba="${esc(t.chave)}">${ic(t.icone, "")}${esc(t.nome.join(" "))}</button>`).join("");
  const mostrar = (chave) => {
    const t = C.tratamentos.find((x) => x.chave === chave) || C.tratamentos[0];
    $$("[data-aba]", abas).forEach((b) => b.setAttribute("aria-selected", String(b.dataset.aba === t.chave)));
    painel.setAttribute("aria-labelledby", "aba-" + t.chave);
    painel.innerHTML = `<div class="entrar">${ic(t.icone, "grande")}</div><div class="entrar"><h3>${esc(t.nome.join(" "))}</h3><p>${esc(t.resumo)}</p></div><ul class="entrar">${t.itens.map((x) => `<li>${ic("check", "")}${esc(x)}</li>`).join("")}</ul><a class="botao-ouro entrar" href="#contato" data-agendar="${esc(t.chave)}">${ic("calendario")}<span class="rot">Agendar ${esc(t.nome.join(" ").toLowerCase())}</span>${ic("seta", "seta")}</a>`;
  };
  mostrar(C.tratamentos[0].chave);
  abas.addEventListener("click", (e) => { const b = e.target.closest("[data-aba]"); if (b) mostrar(b.dataset.aba); });
  abas.addEventListener("keydown", (e) => {
    const lista = $$("[data-aba]", abas), i = lista.findIndex((b) => b.getAttribute("aria-selected") === "true");
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return; e.preventDefault(); const n = lista[(i + d + lista.length) % lista.length]; mostrar(n.dataset.aba); n.focus();
  });
  $(".cartoes").addEventListener("click", (e) => {
    const b = e.target.closest("[data-trat]"); if (!b) return;
    mostrar(b.dataset.trat); $("#tratamentos").scrollIntoView({ behavior: movimento() ? "smooth" : "auto" });
  });

  /* agendamento: pré-seleciona o tratamento */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-agendar]"); if (!a) return;
    if (a.dataset.agendar) $("select[name=tratamento]").value = a.dataset.agendar;
  });
  const form = $(".formulario"), aviso = $(".aviso");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form), nome = String(d.get("nome") || "").trim();
    if (!nome) { aviso.textContent = "Informe seu nome para continuarmos."; form.nome.focus(); return; }
    const trat = form.tratamento.selectedOptions[0].textContent;
    const msg = `${C.mensagemPadrao}\nNome: ${nome}\nTratamento: ${trat}\nPeríodo: ${d.get("periodo")}`;
    const numero = String(C.whatsapp || "").replace(/\D/g, "");
    if (numero) { window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, "_blank", "noopener"); aviso.textContent = "Abrimos o WhatsApp com o seu pedido."; }
    else aviso.textContent = `Pedido pronto (${trat}, ${d.get("periodo").toLowerCase()}). Demonstração: o WhatsApp da clínica ainda não foi configurado.`;
  });

  /* menu do celular */
  const botaoMenu = $(".abrir-menu"), menu = $("#menu");
  const fecharMenu = () => { menu.classList.remove("aberto"); botaoMenu.setAttribute("aria-expanded", "false"); botaoMenu.innerHTML = ic("menu", ""); };
  botaoMenu.addEventListener("click", () => {
    const abrir = !menu.classList.contains("aberto");
    menu.classList.toggle("aberto", abrir); botaoMenu.setAttribute("aria-expanded", String(abrir)); botaoMenu.innerHTML = ic(abrir ? "fechar" : "menu", "");
  });
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) fecharMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharMenu(); });
  document.addEventListener("click", (e) => { if (menu.classList.contains("aberto") && !e.composedPath().some((n) => n === menu || n === botaoMenu)) fecharMenu(); });

  /* seção atual no menu e na navegação lateral */
  const secoes = ["inicio", "tratamentos", "clinica", "contato"].map((id) => document.getElementById(id)).filter(Boolean);
  const marcarAtual = (id) => {
    $$("#menu a").forEach((a) => a.toggleAttribute("aria-current", a.getAttribute("href") === "#" + id));
    $$(".lateral a").forEach((a) => a.toggleAttribute("aria-current", a.getAttribute("href") === "#" + id));
  };
  const obsSecao = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) marcarAtual(e.target.id); }); }, { rootMargin: "-45% 0px -50% 0px" });
  secoes.forEach((s) => obsSecao.observe(s));
  const obsRevelar = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visivel"); obsRevelar.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  $$(".secao > *:not(.abas), .revelar").forEach((el) => { el.classList.add("revelar"); obsRevelar.observe(el); });

  /* ------------------------------------------------------------------ */
  /* animações das cenas                                                 */
  const G = window.geoVitra || {};
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)");
  const movimento = () => !reduzir.matches;
  const A = C.animacao || {};
  const TAU = Math.PI * 2;
  const aleat = (s) => () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const palco = $(".palco");
  const cenas = [
    { el: $(".cena-dente"), x: 700, y: 70, w: 700, h: 570, desenhar: dente() },
    { el: $(".cena-sala"), x: 0, y: 590, w: 570, h: 351, desenhar: sala() },
    { el: $(".cena-folha"), x: 1320, y: 530, w: 352, h: 411, desenhar: folha() },
  ].map((c) => ({ ...c, cv: $("canvas", c.el) }));
  const camDente = $(".cena-dente .dente"), camFolha = $(".cena-folha .folha");
  let mx = 0, my = 0, alvoX = 0, alvoY = 0;
  addEventListener("pointermove", (e) => { alvoX = e.clientX / innerWidth - 0.5; alvoY = e.clientY / innerHeight - 0.5; }, { passive: true });

  /* faixa dourada: polilinha medida, com a lacuna atrás do dente interpolada */
  const faixa = (() => {
    const p = G.faixa || []; const s = []; let total = 0;
    for (let i = 1; i < p.length; i++) { const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); s.push(d); total += d; }
    return { p, s, total, em(k) { let alvo = k * total; for (let i = 0; i < s.length; i++) { if (alvo <= s[i]) { const f = alvo / s[i]; return [p[i][0] + (p[i + 1][0] - p[i][0]) * f, p[i][1] + (p[i + 1][1] - p[i][1]) * f]; } alvo -= s[i]; } return p.at(-1) || [0, 0]; } };
  })();
  function estrela(ctx, x, y, r, a, cor) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.4); g.addColorStop(0, `rgba(${cor},${a})`); g.addColorStop(1, `rgba(${cor},0)`);
    ctx.fillStyle = g; ctx.fillRect(x - r * 2.4, y - r * 2.4, r * 4.8, r * 4.8);
    ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillRect(x - r * 2, y - 0.35, r * 4, 0.7); ctx.fillRect(x - 0.35, y - r * 2, 0.7, r * 4);
  }
  function dente() {
    const r = aleat(11);
    const bolhas = Array.from({ length: 16 }, () => ({ x: 780 + r() * 560, y0: 600 - r() * 120, v: 10 + r() * 22, s: 1.8 + r() * 5, f: r() * TAU, k: r() }));
    const bril = (G.brilhos_dente || []).map((p) => ({ x: p[0], y: p[1], f: r() * TAU, v: 0.6 + r() * 1.6 }));
    return (ctx, t, off) => {
      ctx.globalCompositeOperation = "lighter";
      /* luz que passeia pelas fitas de água */
      for (let i = 0; i < 2; i++) {
        const cx = 1050 + Math.sin(t * 0.21 + i * 2.4) * 300, cy = 360 + Math.cos(t * 0.17 + i) * 170;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 170); g.addColorStop(0, "rgba(90,220,235,.09)"); g.addColorStop(1, "rgba(90,220,235,0)");
        ctx.fillStyle = g; ctx.fillRect(cx - 170, cy - 170, 340, 340);
      }
      /* brilhos nas bordas claras da água */
      for (const b of bril) { const a = Math.sin(t * b.v + b.f); if (a > 0.72) estrela(ctx, b.x, b.y, 1.2 + (a - 0.72) * 4, (a - 0.72) * 2.6, "160,245,255"); }
      /* faixa dourada: respiração e cometa percorrendo */
      if (faixa.total) {
        ctx.save(); ctx.translate(off[0], off[1]);
        const resp = 0.5 + 0.5 * Math.sin(t * 1.3);
        ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.strokeStyle = `rgba(255,190,110,${0.1 + 0.12 * resp})`; ctx.lineWidth = 14; ctx.beginPath(); faixa.p.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
        const k = (t * 0.28) % 1.25;
        for (let j = 0; j < 26; j++) {
          const q = k - j * 0.012; if (q < 0 || q > 1) continue;
          const [x, y] = faixa.em(q), a = (1 - j / 26);
          ctx.fillStyle = `rgba(255,${220 + j},${170 + j * 2},${0.75 * a})`; ctx.beginPath(); ctx.arc(x, y, 4.2 * a + 0.6, 0, TAU); ctx.fill();
        }
        if (k <= 1) { const [x, y] = faixa.em(k); const g = ctx.createRadialGradient(x, y, 0, x, y, 46); g.addColorStop(0, "rgba(255,240,210,.75)"); g.addColorStop(0.3, "rgba(255,180,90,.28)"); g.addColorStop(1, "rgba(255,150,60,0)"); ctx.fillStyle = g; ctx.fillRect(x - 46, y - 46, 92, 92); }
        ctx.restore();
      }
      /* bolhas subindo */
      ctx.globalCompositeOperation = "source-over";
      for (const b of bolhas) {
        const ciclo = 600 / b.v, k = ((t / ciclo + b.k) % 1), y = b.y0 - k * 480, x = b.x + Math.sin(t * 1.4 + b.f) * 6 * (1 + k);
        const a = Math.sin(k * Math.PI) * 0.8;
        ctx.strokeStyle = `rgba(190,245,255,${a * 0.7})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, b.s, 0, TAU); ctx.stroke();
        ctx.fillStyle = `rgba(120,220,235,${a * 0.12})`; ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${a * 0.9})`; ctx.beginPath(); ctx.arc(x - b.s * 0.38, y - b.s * 0.4, Math.max(0.6, b.s * 0.22), 0, TAU); ctx.fill();
      }
    };
  }
  function sala() {
    const r = aleat(5), bril = (G.brilhos_sala || []).map((p) => ({ x: p[0], y: p[1], f: r() * TAU, v: 0.5 + r() * 1.4 }));
    return (ctx, t) => {
      ctx.globalCompositeOperation = "lighter";
      const ciclo = (t % 7) / 7, acende = ciclo < 0.18 ? ciclo / 0.18 : 1 - (ciclo - 0.18) / 0.82;
      const forca = 0.35 + 0.65 * Math.pow(acende, 0.7);
      /* halo do anel e cone de luz sobre a cadeira */
      let g = ctx.createRadialGradient(290, 662, 10, 290, 662, 150); g.addColorStop(0, `rgba(255,200,130,${0.18 * forca})`); g.addColorStop(1, "rgba(255,170,90,0)");
      ctx.fillStyle = g; ctx.fillRect(140, 560, 300, 200);
      g = ctx.createLinearGradient(0, 664, 0, 900); g.addColorStop(0, `rgba(255,215,160,${0.1 * forca})`); g.addColorStop(1, "rgba(255,215,160,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(205, 668); ctx.lineTo(375, 668); ctx.lineTo(470, 900); ctx.lineTo(120, 900); ctx.closePath(); ctx.fill();
      /* luz percorrendo o anel */
      const a0 = t * 1.6;
      for (let j = 0; j < 40; j++) { const a = a0 - j * 0.05, x = 290 + Math.cos(a) * 92, y = 662 + Math.sin(a) * 16.5, k = 1 - j / 40; ctx.fillStyle = `rgba(255,${225 + j},${170 + j * 2},${0.7 * k * forca})`; ctx.beginPath(); ctx.arc(x, y, 2.6 * k + 0.5, 0, TAU); ctx.fill(); }
      ctx.strokeStyle = `rgba(255,220,170,${0.35 * forca})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(290, 662, 92, 16.5, 0, 0, TAU); ctx.stroke();
      /* brilho do piso sob a cadeira */
      g = ctx.createRadialGradient(300, 900, 0, 300, 900, 160); g.addColorStop(0, `rgba(255,190,120,${0.12 + 0.08 * Math.sin(t * 1.2)})`); g.addColorStop(1, "rgba(255,190,120,0)");
      ctx.fillStyle = g; ctx.fillRect(140, 820, 320, 121);
      for (const b of bril) { const a = Math.sin(t * b.v + b.f); if (a > 0.8) estrela(ctx, b.x, b.y, 1 + (a - 0.8) * 4, (a - 0.8) * 3, "255,225,180"); }
    };
  }
  function folha() {
    const r = aleat(9), bril = (G.brilhos_folha || []).map((p) => ({ x: p[0], y: p[1], f: r() * TAU, v: 0.5 + r() * 1.4 }));
    const vagalumes = Array.from({ length: 14 }, () => ({ x: 1420 + r() * 220, y: 620 + r() * 260, f: r() * TAU, v: 0.15 + r() * 0.25, s: 0.8 + r() * 1.6 }));
    return (ctx, t) => {
      ctx.globalCompositeOperation = "lighter";
      const g = ctx.createRadialGradient(1540, 760, 0, 1540, 760, 150); g.addColorStop(0, `rgba(255,190,110,${0.08 + 0.05 * Math.sin(t * 0.9)})`); g.addColorStop(1, "rgba(255,190,110,0)");
      ctx.fillStyle = g; ctx.fillRect(1390, 610, 300, 300);
      for (const b of bril) { const a = Math.sin(t * b.v + b.f); if (a > 0.78) estrela(ctx, b.x, b.y, 1 + (a - 0.78) * 4, (a - 0.78) * 3, "255,220,170"); }
      for (const v of vagalumes) {
        const y = v.y - ((t * v.v * 40) % 300), yy = y < 560 ? y + 300 : y, x = v.x + Math.sin(t * 0.8 + v.f) * 14, a = 0.4 + 0.4 * Math.sin(t * 2 + v.f);
        const g2 = ctx.createRadialGradient(x, yy, 0, x, yy, v.s * 4); g2.addColorStop(0, `rgba(255,220,160,${a})`); g2.addColorStop(1, "rgba(255,200,120,0)");
        ctx.fillStyle = g2; ctx.fillRect(x - v.s * 4, yy - v.s * 4, v.s * 8, v.s * 8);
      }
    };
  }

  let visivel = true, quadro = 0;
  function passo(agora) {
    quadro = 0;
    const t = movimento() ? agora / 1000 : 2.4;
    mx += (alvoX - mx) * 0.06; my += (alvoY - my) * 0.06;
    const par = (A.paralaxe ?? 1) * (movimento() ? 1 : 0), flu = (A.flutuacao ?? 1) * (movimento() ? 1 : 0);
    const offDente = [mx * 9 * par, Math.sin(t * 0.9) * 4.5 * flu + my * 6 * par];
    for (const c of cenas) {
      const r = c.cv.getBoundingClientRect(); if (!r.width) continue;
      const dpr = Math.min(devicePixelRatio || 1, 1.5), W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
      if (c.cv.width !== W || c.cv.height !== H) { c.cv.width = W; c.cv.height = H; }
      const ctx = c.cv.getContext("2d"); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.setTransform(W / c.w, 0, 0, H / c.h, -c.x * W / c.w, -c.y * H / c.h);
      c.desenhar(ctx, t * (A.brilho ?? 1), offDente);
      if (c.el.classList.contains("cena-dente")) camDente.style.transform = `translate(${(offDente[0] * r.width / c.w).toFixed(2)}px,${(offDente[1] * r.height / c.h).toFixed(2)}px)`;
      if (c.el.classList.contains("cena-folha")) camFolha.style.transform = `rotate(${(Math.sin(t * 0.8) * 2.4 * flu + mx * 2 * par).toFixed(3)}deg)`;
    }
    if (movimento() && visivel && !document.hidden) quadro = requestAnimationFrame(passo);
  }
  const iniciar = () => { if (!quadro) quadro = requestAnimationFrame(passo); };
  new IntersectionObserver((es) => { visivel = es.some((e) => e.isIntersecting); if (visivel) iniciar(); }, { rootMargin: "100px" }).observe(palco);
  document.addEventListener("visibilitychange", iniciar);
  reduzir.addEventListener?.("change", iniciar);
  addEventListener("resize", iniciar);
  iniciar();
})();
