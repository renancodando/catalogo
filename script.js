// Informe o número comercial com o código do país e DDD para direcionar os pedidos.
const numeroWhatsApp = "";
const menu = document.querySelector("#menu");
const alternar = document.querySelector(".alternar");
const janela = document.querySelector("#detalhes");
const painel = document.querySelector("#painel");
const modelos = {
  assistencia: ["Assistência Técnica", "Reparo de celulares", "Diagnóstico de aparelhos", "Manutenção preventiva"],
  odontologia: ["Odontologia", "Avaliação odontológica", "Tratamentos estéticos", "Cuidados preventivos"],
  restaurante: ["Restaurante", "Entradas e porções", "Pratos principais", "Sobremesas"],
  escritorio: ["Escritório", "Áreas de atuação", "Consultoria especializada", "Atendimento personalizado"]
};
const secoes = {
  servicos: ["Serviços", [["Design personalizado", "Composição, cores e tipografia alinhadas à identidade do seu negócio."], ["Desenvolvimento responsivo", "Páginas adaptadas para celular, tablet e computador."], ["Suporte após a entrega", "Acompanhamento para colocar o seu site em uso."]]],
  planos: ["Planos sob medida", [["Página de apresentação", "Uma página focada em apresentar seu negócio e receber contatos."], ["Site institucional", "Espaço para sua história, serviços e áreas de atuação."], ["Catálogo digital", "Organização de produtos ou serviços com pedidos de orçamento."]]],
  sobre: ["Sobre a RNC Web", [["Soluções digitais", "Criamos sites profissionais, modernos e personalizados para o seu negócio evoluir no digital."]]]
};
function mostrarMenu(aberto) {
  menu.classList.toggle("aberto", aberto);
  alternar.setAttribute("aria-expanded", String(aberto));
  alternar.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
}
alternar.addEventListener("click", () => mostrarMenu(!menu.classList.contains("aberto")));
document.addEventListener("keydown", evento => {
  if (evento.key === "Escape" && menu.classList.contains("aberto")) {
    mostrarMenu(false);
    alternar.focus();
  }
});
function abrirPainel(conteudo) {
  painel.innerHTML = conteudo;
  if (!janela.open) janela.showModal();
  janela.scrollTop = 0;
  janela.querySelector(".fechar").focus();
}
const botaoPedido = '<button class="botao primario" data-orcamento>Solicitar Orçamento</button>';
function mostrarModelo(chave) {
  const [nome, ...itens] = modelos[chave];
  const lista = itens.map(item => '<li>' + item + '</li>').join("");
  abrirPainel('<img class="foto-painel" src="recursos/' + chave + '.webp" alt=""><section class="conteudo-painel"><p class="rotulo">Demonstração do modelo</p><h2 id="titulo-painel">' + nome + '</h2><p>' + document.querySelector('[data-modelo="' + chave + '"] .legenda>span').textContent + '</p><ul class="itens-modelo">' + lista + '</ul><button class="botao primario" data-orcamento="' + chave + '">Quero este modelo</button></section>');
}
function mostrarOrcamento(escolha = "") {
  const opcoes = Object.entries(modelos).map(([chave,[nome]]) =>
    '<option ' + (chave === escolha ? "selected" : "") + '>' + nome + '</option>').join("");
  abrirPainel('<section class="conteudo-painel"><p class="rotulo">Contato</p><h2 id="titulo-painel">Seu projeto começa aqui</h2><p>Prepare seu pedido de orçamento para enviar pelo WhatsApp.</p><form><label>Seu nome<input name="nome" autocomplete="name" required maxlength="100"></label><label>Modelo de interesse<select name="modelo"><option>Site personalizado</option>' + opcoes + '</select></label><label>O que você precisa?<textarea name="mensagem" rows="3" maxlength="1500" placeholder="Conte um pouco sobre seu negócio"></textarea></label><button class="botao primario">Continuar no WhatsApp</button></form></section>');
}
document.addEventListener("click", evento => {
  const alvo = evento.target.closest("button,a");
  if (!alvo) return;
  if (menu.contains(alvo)) mostrarMenu(false);
  if (alvo.hasAttribute("data-orcamento")) mostrarOrcamento(alvo.dataset.orcamento);
  if (alvo.dataset.modelo) mostrarModelo(alvo.dataset.modelo);
  if (alvo.dataset.secao) {
    const [titulo, blocos] = secoes[alvo.dataset.secao];
    abrirPainel('<section class="conteudo-painel"><p class="rotulo">RNC Web</p><h2 id="titulo-painel">' + titulo + '</h2><dl>' + blocos.map(([t,d]) => '<dt>' + t + '</dt><dd>' + d + '</dd>').join("") + '</dl>' + botaoPedido + '</section>');
  }
});
janela.querySelector(".fechar").addEventListener("click", () => janela.close());
janela.addEventListener("click", evento => { if (evento.target === janela) janela.close(); });
painel.addEventListener("submit", evento => {
  evento.preventDefault();
  const dados = new FormData(evento.target);
  const mensagem = 'Olá, RNC Web! Meu nome é ' + dados.get("nome").trim() + '. Gostaria de um orçamento para ' + dados.get("modelo") + '. ' + dados.get("mensagem").trim();
  window.open("https://wa.me/" + numeroWhatsApp + "?text=" + encodeURIComponent(mensagem), "_blank", "noopener,noreferrer");
});
const catalogo = document.querySelector("#catalogo");
function atualizarNavegacao() {
  const noCatalogo = window.scrollY > 60 && catalogo.getBoundingClientRect().top < innerHeight * .8;
  menu.querySelector('[href="#inicio"]').classList.toggle("atual", !noCatalogo);
  menu.querySelector('[href="#catalogo"]').classList.toggle("atual", noCatalogo);
}
window.addEventListener("scroll", atualizarNavegacao, {passive:true});

// A refração desloca a fotografia só nas áreas molhadas. A imagem de fundo
// preserva a composição quando a aceleração gráfica está indisponível.
function animarCenario() {
  const tela = document.querySelector(".cenario canvas");
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)");
  const celular = matchMedia("(max-width: 600px)");
  const contexto = tela.getContext("webgl", {alpha:false, antialias:false, powerPreference:"low-power"});
  if (!contexto) return;
  const vertices = `
    attribute vec2 ponto;
    varying vec2 posicao;
    void main() {
      posicao = vec2(ponto.x * .5 + .5, .5 - ponto.y * .5);
      gl_Position = vec4(ponto, 0., 1.);
    }`;
  const fragmentos = `
    precision mediump float;
    varying vec2 posicao;
    uniform sampler2D fotografia;
    uniform float tempo;
    uniform float compacto;
    void main() {
      vec2 uv = posicao;
      vec2 centro = mix(vec2(.62,.45),vec2(.66,.425),compacto);
      vec2 local = uv - centro;
      float lago = smoothstep(mix(.78,.72,compacto),.91,uv.y);
      float faixa = local.y - local.x * .75 - .06;
      float anel = exp(-faixa * faixa * 580.) * (1.-smoothstep(.18,.34,abs(local.x)));
      float esfera = 1.-smoothstep(.12,.21,length(local * vec2(1.4,.65)));
      uv.x += .0028 * lago * sin(uv.y*110. - tempo*1.25);
      uv.y += lago * .0022 * sin(uv.y*90. + uv.x*12. - tempo);
      uv += anel * vec2(.0022*sin(uv.x*57.-tempo*1.4),.0026*cos(uv.x*43.-tempo*1.4));
      uv += esfera * vec2(.0018*sin(tempo*.46),.0022*cos(tempo*.51));
      vec3 cor = texture2D(fotografia,uv).rgb;
      float luz = .07*anel*sin(uv.x*38.-tempo*1.5) + .04*lago*sin(uv.y*84.-tempo);
      gl_FragColor = vec4(cor*(1.+luz),1.);
    }`;
  function compilar(tipo, fonte) {
    const etapa = contexto.createShader(tipo);
    contexto.shaderSource(etapa, fonte);
    contexto.compileShader(etapa);
    return etapa;
  }
  const programa = contexto.createProgram();
  contexto.attachShader(programa, compilar(contexto.VERTEX_SHADER, vertices));
  contexto.attachShader(programa, compilar(contexto.FRAGMENT_SHADER, fragmentos));
  contexto.linkProgram(programa);
  if (!contexto.getProgramParameter(programa, contexto.LINK_STATUS)) return;
  contexto.useProgram(programa);
  contexto.bindBuffer(contexto.ARRAY_BUFFER, contexto.createBuffer());
  contexto.bufferData(contexto.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),contexto.STATIC_DRAW);
  const ponto = contexto.getAttribLocation(programa,"ponto");
  contexto.enableVertexAttribArray(ponto);
  contexto.vertexAttribPointer(ponto,2,contexto.FLOAT,false,0,0);
  contexto.bindTexture(contexto.TEXTURE_2D,contexto.createTexture());
  for (const parametro of [contexto.TEXTURE_WRAP_S,contexto.TEXTURE_WRAP_T])
    contexto.texParameteri(contexto.TEXTURE_2D,parametro,contexto.CLAMP_TO_EDGE);
  contexto.texParameteri(contexto.TEXTURE_2D,contexto.TEXTURE_MIN_FILTER,contexto.LINEAR);
  const tempo = contexto.getUniformLocation(programa,"tempo");
  let quadro = 0, visivel = true, pronta = false, anterior = -100;
  function desenhar(instante) {
    if (instante-anterior >= 32) {
      anterior = instante;
      contexto.uniform1f(tempo,(instante/1000)%3600);
      contexto.drawArrays(contexto.TRIANGLE_STRIP,0,4);
    }
    quadro = requestAnimationFrame(desenhar);
  }
  function atualizar() {
    cancelAnimationFrame(quadro);
    tela.style.opacity = pronta && !reduzir.matches ? "1" : "0";
    if (pronta && visivel && !document.hidden && !reduzir.matches) quadro = requestAnimationFrame(desenhar);
  }
  function carregar() {
    const imagem = new Image();
    const menor = celular.matches;
    pronta = false;
    atualizar();
    imagem.onload = () => {
      if (menor !== celular.matches) return;
      contexto.texImage2D(contexto.TEXTURE_2D,0,contexto.RGB,contexto.RGB,contexto.UNSIGNED_BYTE,imagem);
      contexto.uniform1f(contexto.getUniformLocation(programa,"compacto"),Number(menor));
      pronta = true;
      atualizar();
    };
    imagem.src = "recursos/" + (menor ? "cenario" : "panorama") + ".webp";
  }
  new ResizeObserver(() => {
    tela.width = Math.min(1920,Math.round(tela.clientWidth*devicePixelRatio));
    tela.height = Math.max(1,Math.round(tela.width*tela.clientHeight/(tela.clientWidth||1)));
    contexto.viewport(0,0,tela.width,tela.height);
  }).observe(tela);
  new IntersectionObserver(([entrada]) => {visivel = entrada.isIntersecting;atualizar();}).observe(tela);
  celular.addEventListener("change",carregar);
  reduzir.addEventListener("change",atualizar);
  document.addEventListener("visibilitychange",atualizar);
  carregar();
}
animarCenario();
