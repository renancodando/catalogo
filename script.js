// Informe o número comercial com o código do país e DDD para direcionar os pedidos.
const numeroWhatsApp = "5528992745086";
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
// As apresentações comerciais possuem identidade própria e orientam o visitante até o orçamento.
const secoes = {
  sobre: ["Sobre a RNC Web", [["Soluções digitais", "Criamos sites profissionais, modernos e personalizados para o seu negócio evoluir no digital."]]]
};
const apresentacoes = {
  solucoes: {
    etiqueta: "Soluções para o seu negócio",
    titulo: "Seu negócio merece ser <em>bem apresentado.</em>",
    descricao: "Do primeiro contato à decisão de compra, criamos a presença digital certa para o momento da sua empresa.",
    itens: [
      {
        numero: "01", nome: "Site Essencial", subtitulo: "O primeiro passo para ser lembrado.",
        descricao: "Sua empresa, seus serviços, horários, localização e WhatsApp reunidos em uma página bonita, rápida e objetiva. Tudo o que o cliente precisa para encontrar e escolher você.",
        icone: "i-tela", detalhes: ["Página de apresentação", "Contato facilitado", "Ideal para começar"]
      },
      {
        numero: "02", nome: "Site Institucional", subtitulo: "Mais presença. Mais credibilidade.",
        descricao: "Apresente a história da sua empresa, seus diferenciais e áreas de atuação em uma experiência que transmite profissionalismo e aproxima novos clientes.",
        icone: "i-diamante", detalhes: ["Identidade da marca", "Serviços em destaque", "Conteúdo personalizado"]
      },
      {
        numero: "03", nome: "Catálogo Digital", subtitulo: "Uma vitrine sempre disponível.",
        descricao: "Organize seus produtos ou serviços em um catálogo interativo, com informações claras e acesso direto ao WhatsApp para solicitar um orçamento.",
        icone: "i-grade", detalhes: ["Vitrine organizada", "Exploração interativa", "Pedidos de orçamento"]
      }
    ],
    chamada: "Seu projeto, do seu jeito.",
    complemento: "Condições especiais para projetos selecionados, com opções a partir de R$ 600.",
    botao: "Encontrar meu site ideal"
  },
  servicos: {
    etiqueta: "A diferença está nos detalhes",
    titulo: "Muito além de <em>um site.</em>",
    descricao: "Não basta estar na internet. Cada detalhe deve valorizar seu negócio, causar uma ótima primeira impressão e facilitar o contato com quem realmente importa: seu cliente.",
    itens: [
      {
        numero: "01", nome: "Uma identidade só sua", subtitulo: "A sua marca em cada detalhe.",
        descricao: "Nada de páginas sem personalidade. Cores, tipografia, composição e interações são pensadas para traduzir a essência do seu negócio.",
        icone: "i-diamante", detalhes: ["Visual autoral", "Acabamento profissional", "Experiência memorável"]
      },
      {
        numero: "02", nome: "Visibilidade que faz diferença", subtitulo: "Mais fácil de encontrar. Melhor de conhecer.",
        descricao: "Estrutura preparada para mecanismos de busca, informações claras e caminhos rápidos para Google Maps e WhatsApp. Uma presença digital feita para ajudar o cliente a chegar até você.",
        icone: "i-busca", detalhes: ["SEO básico", "Contato direto", "Informações acessíveis"]
      },
      {
        numero: "03", nome: "Do primeiro acesso à publicação", subtitulo: "Cuidado antes e depois da entrega.",
        descricao: "Seu site funciona em celulares, tablets e computadores. Cuidamos da preparação para publicação e do acompanhamento conforme as condições combinadas.",
        icone: "i-escudo", detalhes: ["Responsividade", "Apoio na publicação", "Orientação pós-entrega"]
      }
    ],
    chamada: "Não é só sobre ter um site.",
    complemento: "É sobre a forma como as pessoas enxergam o seu negócio.",
    botao: "Quero valorizar minha empresa"
  }
};
function mostrarApresentacao(chave) {
  const secao = apresentacoes[chave];
  if (!secao) return;
  const icone = nome => '<svg class="icone" aria-hidden="true"><use href="#' + nome + '"/></svg>';
  const cartoes = secao.itens.map(item => {
    const detalhes = item.detalhes.map(detalhe => '<li>' + detalhe + '</li>').join("");
    const acao = chave === "solucoes"
      ? '<button type="button" class="painel-escolher" data-orcamento="' + item.nome + '">Escolher esta solução ' + icone("i-diagonal") + '</button>'
      : '<span class="painel-assinatura">RNC WEB <span aria-hidden="true">↗</span></span>';
    return '<article class="painel-cartao">' +
      '<div class="painel-topo-cartao"><span class="painel-icone">' + icone(item.icone) + '</span><span class="painel-indice">' + item.numero + ' / 03</span></div>' +
      '<div class="painel-corpo-cartao"><p class="painel-subtitulo">' + item.subtitulo + '</p><h3>' + item.nome + '</h3><p class="painel-descricao">' + item.descricao + '</p></div>' +
      '<ul class="painel-detalhes">' + detalhes + '</ul>' + acao + '</article>';
  }).join("");
  const destaque = chave === "solucoes"
    ? '<span class="painel-oferta">Condição especial • a partir de R$ 600*</span>'
    : '<span class="painel-oferta">Feito para o seu negócio</span>';
  const observacao = chave === "solucoes"
    ? '<p class="painel-ressalva">*Valor inicial promocional sujeito ao escopo e à disponibilidade da oferta.</p>'
    : "";
  abrirPainel(
    '<section class="painel-editorial">' +
      '<header class="painel-cabecalho"><div class="painel-barra"><span class="painel-identificador"><span class="painel-sinal"></span>' + secao.etiqueta + '</span><span class="painel-referencia">RNC WEB / 2026</span></div>' +
      '<h2 id="titulo-painel">' + secao.titulo + '</h2><p>' + secao.descricao + '</p></header>' +
      '<div class="painel-grade">' + cartoes + '</div>' +
      '<footer class="painel-rodape"><div>' + destaque + '<h3>' + secao.chamada + '</h3><p>' + secao.complemento + '</p></div>' +
      '<button type="button" class="botao primario painel-cta" data-orcamento>' + secao.botao + ' ' + icone("i-seta") + '</button></footer>' + observacao +
    '</section>'
  );
}
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
  janela.classList.toggle("janela-ampla", conteudo.includes('class="painel-editorial"'));
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
  const todasOpcoes = [
    ...Object.entries(modelos).map(([chave, [nome]]) => ({ chave, nome })),
    ...["Site Essencial", "Site Institucional", "Catálogo Digital"].map(nome => ({ chave: nome, nome }))
  ];
  const opcoes = todasOpcoes.map(({ chave, nome }) =>
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
    const chave = alvo.dataset.secao;
    if (apresentacoes[chave]) {
      mostrarApresentacao(chave);
    } else if (secoes[chave]) {
      const [titulo, blocos] = secoes[chave];
      abrirPainel('<section class="conteudo-painel"><p class="rotulo">RNC Web</p><h2 id="titulo-painel">' + titulo + '</h2><dl>' + blocos.map(([t,d]) => '<dt>' + t + '</dt><dd>' + d + '</dd>').join("") + '</dl>' + botaoPedido + '</section>');
    }
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

// Cada placa de vidro orienta a normal e o ponto de brilho pelo contato local.
const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)");
for (const base of document.querySelectorAll(".base-modelo")) {
  const placa = base.querySelector(".modelo");
  function iluminar(evento) {
    if (movimentoReduzido.matches) return;
    const limites = base.getBoundingClientRect();
    const x = (evento.clientX - limites.left) / limites.width;
    const y = (evento.clientY - limites.top) / limites.height;
    placa.style.setProperty("--horizontal", (x - .5) * 17 + "deg");
    placa.style.setProperty("--vertical", (.5 - y) * 14 + "deg");
    placa.style.setProperty("--luz-x", x * 100 + "%");
    placa.style.setProperty("--luz-y", y * 100 + "%");
  }
  function repousar() {
    for (const nome of ["--horizontal","--vertical","--luz-x","--luz-y"]) placa.style.removeProperty(nome);
  }
  base.addEventListener("pointermove", iluminar);
  base.addEventListener("pointerdown", iluminar);
  for (const evento of ["pointerleave","pointercancel","pointerup"]) base.addEventListener(evento, repousar);
}

// Todas as coordenadas da cena são medidas no espaço da fotografia (1280 × 720).
// Assim, o toque continua coincidindo com a água após uma mudança de orientação.
function iniciarEnseada() {
  const pagina = document.querySelector(".pagina");
  const ambiente = document.querySelector(".ambiente");
  const vista = document.querySelector(".vista-planeta");
  const controle = vista.querySelector("button");
  const tela = ambiente.querySelector("canvas");
  const compacto = matchMedia("(max-width:980px)");
  const foto = new Image();
  let recorte, visivel = true, quadro = 0, anterior = 0, tempo = 0;
  let direcao = 0, giro = 0, inclinacao = 0, altura = 0, impulso = 0, ultimaOnda = -10;
  let arrasto = null, ultimaPosicao = 0;
  const ondas = new Float32Array(12);
  for (let i = 2; i < ondas.length; i += 3) ondas[i] = -10;
  let proximaOnda = 0;
  function posicionar() {
    recorte = compacto.matches ? [510,40,490,320] : [0,0,1280,720];
    (compacto.matches ? vista : pagina).prepend(ambiente);
  }
  posicionar();
  compacto.addEventListener("change", posicionar);
  function criarOnda(x,y) {
    ondas.set([x,y,tempo],proximaOnda*3);
    proximaOnda = (proximaOnda+1)%4;
    ultimaOnda = tempo;
    impulso = 1;
  }
  function coordenadas(evento) {
    const caixa = ambiente.getBoundingClientRect();
    return [recorte[0] + (evento.clientX-caixa.left)*recorte[2]/caixa.width,
      recorte[1] + (evento.clientY-caixa.top)*recorte[3]/caixa.height];
  }
  pagina.addEventListener("pointerdown", evento => {
    if (evento.target.closest("a,button") && !controle.contains(evento.target)) return;
    const [x,y] = coordenadas(evento);
    if (y>=306 || controle.contains(evento.target)) criarOnda(x,y);
  });
  pagina.addEventListener("pointermove", evento => {
    const [x,y] = coordenadas(evento);
    if (controle.contains(evento.target)) {
      if (arrasto === evento.pointerId) {
        direcao = Math.max(-.95,Math.min(.95,direcao+(evento.clientX-ultimaPosicao)*.012));
        ultimaPosicao = evento.clientX;
      } else {direcao = Math.max(-.5,Math.min(.5,(x-752)/300));}
      inclinacao = Math.max(-.18,Math.min(.18,(y-202)/480));
    } else if (y>317 && y<700 && tempo-ultimaOnda>.32 && !evento.target.closest("button,a") && evento.pointerType==="mouse") {
      criarOnda(x,y);
    }
  });
  controle.addEventListener("pointerdown", evento => {
    arrasto = evento.pointerId;
    ultimaPosicao = evento.clientX;
    controle.setPointerCapture(arrasto);
  });
  function largar() {arrasto=null;direcao=0;inclinacao=0;}
  controle.addEventListener("lostpointercapture",largar);
  controle.addEventListener("pointerleave",() => {if (arrasto===null) largar();});
  controle.addEventListener("click", evento => {
    if (evento.detail===0) {criarOnda(751,317);direcao = direcao>.2 ? -.6 : .6;}
  });
  controle.addEventListener("keydown", evento => {
    if (!["ArrowLeft","ArrowRight"].includes(evento.key)) return;
    evento.preventDefault();
    direcao = Math.max(-.95,Math.min(.95,direcao+(evento.key==="ArrowLeft"?-.16:.16)));
    criarOnda(751,317);
  });
  const gl = location.protocol === "file:" ? null : tela.getContext("webgl",{alpha:false,antialias:false,powerPreference:"low-power"});
  let desenhar;
  if (gl) {
    const programa = gl.createProgram();
    const fontes = [
      [gl.VERTEX_SHADER,`attribute vec2 ponto;
        varying vec2 uv;
        void main(){uv=vec2(.5+.5*ponto.x,.5-.5*ponto.y);gl_Position=vec4(ponto,0.,1.);}`],
      [gl.FRAGMENT_SHADER,`
        precision highp float;
        varying vec2 uv;
        uniform sampler2D foto;
        uniform vec4 janela;
        uniform vec3 ondas[4];
        uniform vec4 animacao;
        const vec2 tamanho = vec2(1280.,720.);
        vec3 amostra(vec2 p){return texture2D(foto,clamp(p/tamanho,0.,1.)).rgb;}
        void main(){
          float t=animacao.x;
          vec2 p=janela.xy+uv*janela.zw;
          vec2 q=p;
          // Projeção do anel elíptico no plano inclinado da fotografia.
          vec2 d=p-vec2(750.,201.);
          vec2 e=vec2(dot(d,vec2(.952,.306)),dot(d,vec2(-.306,.952)))/vec2(225.,77.);
          float raio=length(e);
          float aro=1.-smoothstep(.06,.28,abs(raio-1.));
          vec2 normal=(p-vec2(751.,202.))/vec2(124.,115.);
          float r2=dot(normal,normal);
          float disco=1.-smoothstep(.87,1.,r2);
          aro*=1.-disco*(1.-smoothstep(-.08,.3,e.y));
          // Reprojeção esférica com profundidade por pixel; preserva a borda do globo.
          float z=sqrt(max(0.,1.-r2));
          float angulo=(.072*sin(t*.54)+animacao.y*.56)*z;
          vec2 giro=vec2(normal.x*(cos(angulo)-1.)+z*sin(angulo),z*animacao.z);
          q-=giro*vec2(124.,115.)*disco*(1.-aro);
          // Ondas de superfície e frentes concêntricas geradas pelo visitante.
          float agua=smoothstep(307.,335.,p.y)*smoothstep(65.,170.,p.x)*(1.-smoothstep(1080.,1220.,p.x));
          vec2 ondulacao=vec2(sin(p.y*.081+t*1.6)+.55*cos(p.x*.021+p.y*.12-t),sin(p.y*.13+p.x*.012-t*1.35));
          q+=agua*ondulacao*vec2(2.2,1.65);
          float brilho=0.;
          for(int i=0;i<4;i++){
            float idade=t-ondas[i].z;
            vec2 delta=(p-ondas[i].xy)*vec2(.82,1.7);
            float distancia=length(delta);
            float fase=distancia-idade*130.;
            float frente=exp(-abs(fase)*.029)*exp(-idade*1.15)*step(0.,idade);
            float pulso=frente*sin(fase*.24);
            q+=pulso*delta/max(1.,distancia)*7.*max(agua,aro*.65);
            brilho+=pulso*.14*agua;
          }
          // Duas fases de advecção se alternam para transportar a espuma sem saltos.
          float fase=fract(t*.53);
          float outra=fract(fase+.5);
          vec2 tangente=normalize(vec2(-e.y*.952-e.x*.105,-e.y*.306+e.x*.328)+.0001);
          vec2 fluxo=tangente*(11.+4.*sin(e.x*11.+e.y*8.)+animacao.w*9.)*aro;
          q+=aro*vec2(sin(e.x*11.-t*1.9)*1.8,cos(e.x*8.+t*1.6)*2.1);
          vec3 cor=mix(amostra(q-fluxo*(fase-.5)),amostra(q-fluxo*(outra-.5)),abs(2.*fase-1.));
          float reflexo=agua*.055*sin(p.y*.12+p.x*.006-t*1.5);
          gl_FragColor=vec4(cor*(1.+reflexo+brilho)+vec3(.1,.35,.42)*max(brilho,0.),1.);
        }`]
    ];
    for (const [tipo,fonte] of fontes) {
      const etapa=gl.createShader(tipo);
      gl.shaderSource(etapa,fonte);gl.compileShader(etapa);gl.attachShader(programa,etapa);
    }
    gl.linkProgram(programa);
    if (!gl.getProgramParameter(programa,gl.LINK_STATUS)) return;
    gl.useProgram(programa);
    gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    const posicao=gl.getAttribLocation(programa,"ponto");
    gl.enableVertexAttribArray(posicao);gl.vertexAttribPointer(posicao,2,gl.FLOAT,false,0,0);
    gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());
    for(const eixo of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D,eixo,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    const parametros=Object.fromEntries(["janela","ondas[0]","animacao"].map(nome=>[nome,gl.getUniformLocation(programa,nome)]));
    desenhar = () => {
      gl.viewport(0,0,tela.width,tela.height);
      gl.uniform4fv(parametros.janela,recorte);
      gl.uniform3fv(parametros["ondas[0]"],ondas);
      gl.uniform4f(parametros.animacao,tempo,giro,altura,impulso);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    };
  } else {
    // Também anima em navegadores sem WebGL, com faixas amostradas em Canvas 2D.
    const tinta=tela.getContext("2d");
    if (!tinta) return;
    desenhar = () => {
      const [x,y,w,h]=recorte;
      tinta.setTransform(tela.width/w,0,0,tela.height/h,-x*tela.width/w,-y*tela.height/h);
      tinta.drawImage(foto,0,0,1280,720);
      const escala=foto.naturalWidth/1280;
      for(let linha=96;linha<Math.min(720,y+h);linha+=3) {
        const lago=linha>310;
        const largura=lago?980:440;
        const esquerda=lago?105:530;
        const deslocamento=lago?Math.sin(linha*.08+tempo*1.8)*2:Math.sin(linha*.027+tempo*1.1)*1.9+giro*5;
        tinta.drawImage(foto,esquerda*escala,linha*escala,largura*escala,3*escala,esquerda+deslocamento,linha,largura,3.2);
      }
      for(let i=0;i<4;i++) {
        const idade=tempo-ondas[i*3+2];
        if(idade>=2.2) continue;
        tinta.strokeStyle='rgba(153,227,231,'+(.36*Math.exp(-2*idade))+')';
        tinta.beginPath();tinta.ellipse(ondas[i*3],ondas[i*3+1],1+idade*115,1+idade*37,0,0,Math.PI*2);tinta.stroke();
      }
    };
  }
  function redimensionar() {
    const densidade=Math.min(1.6,window.devicePixelRatio||1);
    tela.width=Math.max(1,Math.round(tela.clientWidth*densidade));
    tela.height=Math.max(1,Math.round(tela.clientHeight*densidade));
  }
  function animar(agora) {
    quadro=requestAnimationFrame(animar);
    if (agora-anterior<30) return;
    const intervalo=Math.min(.08,(agora-anterior)/1000);
    anterior=agora;tempo+=intervalo;
    const resposta=1-Math.exp(-9*intervalo);
    giro+=(direcao-giro)*resposta;altura+=(inclinacao-altura)*resposta;impulso*=1-resposta*.35;
    desenhar();tela.style.opacity="1";
  }
  function atualizar() {
    cancelAnimationFrame(quadro);
    if (movimentoReduzido.matches) tela.style.opacity="0";
    else if (foto.complete && foto.naturalWidth && visivel && !document.hidden) {
      anterior=performance.now();quadro=requestAnimationFrame(animar);
    }
  }
  foto.onload=() => {
    if (gl) gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,foto);
    redimensionar();atualizar();
  };
  foto.src="recursos/enseada.webp";
  new ResizeObserver(redimensionar).observe(ambiente);
  new IntersectionObserver(([entrada])=>{visivel=entrada.isIntersecting;atualizar();}).observe(ambiente);
  movimentoReduzido.addEventListener("change",atualizar);
  document.addEventListener("visibilitychange",atualizar);
}
iniciarEnseada();
