// A fotografia fornece a radiância e os detalhes finos da enseada. O piso,
// a corrente e as gotas têm geometrias e trajetórias próprias em tempo real.
(() => {
  "use strict";
  const pagina = document.querySelector(".pagina");
  const ambiente = pagina.querySelector(".ambiente");
  const vista = pagina.querySelector(".vista-planeta");
  const controle = vista.querySelector("button");
  let tela = ambiente.querySelector("canvas");
  const compacto = matchMedia("(max-width:980px)");
  const reduzir = matchMedia("(prefers-reduced-motion:reduce)");
  const foto = new Image();
  const doisPi = Math.PI * 2;
  const limiteGotas = 96;
  const gotas = [];
  const ondas = new Float32Array(24);
  const presente = { tempo: 0, giro: 0, altura: 0, energia: 0 };
  let recorte,
    caixa,
    motor,
    visivel = false,
    quadro = 0;
  let indiceOnda = 0,
    emissao = 0,
    ultimoRastro = -1,
    ultimoQuadro = 0;
  let arrasto = null,
    ultimoX = 0,
    giroAlvo = 0,
    alturaAlvo = 0;
  let detalhe = (navigator.hardwareConcurrency || 4) > 4 ? 2 : 1;
  let amostras = 0,
    duracao = 0,
    pronto = false;
  const limitar = (valor, minimo, maximo) => Math.max(minimo, Math.min(maximo, valor));
  for (let i = 2; i < ondas.length; i += 4) ondas[i] = -30;

  // Eixo medido na referência. Cada estação guarda x, y, profundidade óptica
  // e meia largura em pixels. A spline periódica preserva a tangente na emenda.
  const estacoes = [
    [956, 260, 48, 16],
    [932, 279, 113, 15],
    [859, 278, 164, 10],
    [775, 266, 202, 9],
    [689, 249, 212, 9],
    [611, 226, 187, 12],
    [561, 202, 139, 16],
    [544, 174, 78, 20],
    [550, 145, 9, 19],
    [575, 119, -76, 16],
    [623, 105, -141, 15],
    [673, 105, -196, 10],
    [751, 125, -212, 9],
    [823, 153, -187, 9],
    [891, 193, -129, 9],
    [938, 230, -49, 13],
  ];
  function orbita(angulo) {
    const u = ((((angulo / doisPi) % 1) + 1) % 1) * estacoes.length;
    const i = Math.floor(u),
      f = u - i;
    const ponto = (deslocamento) => estacoes[(i + deslocamento + estacoes.length) % estacoes.length];
    const a = ponto(-1),
      b = ponto(0),
      c = ponto(1),
      d = ponto(2);
    return b.map(
      (valor, k) =>
        0.5 *
        (2 * valor +
          (-a[k] + c[k]) * f +
          (2 * a[k] - 5 * valor + 4 * c[k] - d[k]) * f * f +
          (-a[k] + 3 * valor - 3 * c[k] + d[k]) * f * f * f),
    );
  }

  // Mapa de velocidade em coordenadas da fotografia. Só cobre a região molhada.
  // B é a cobertura. R e G transportam a direção tangente das cristas reais.
  const origemFluxo = [510, 70],
    larguraFluxo = 482,
    alturaFluxo = 245;
  const campo = new Uint8Array(larguraFluxo * alturaFluxo * 4);
  const pontos = Array.from({ length: 321 }, (_, i) => orbita((i * doisPi) / 320));
  const cristasVisiveis = pontos.filter(
    ([x, y, z]) => z >= 0 || ((x - 751) / 124) ** 2 + ((y - 202) / 115) ** 2 >= 1,
  );
  function construirCampo() {
    for (let i = 0; i < 320; i++) {
      const [x, y, z, largura] = pontos[i],
        seguinte = pontos[i + 1];
      const vx = seguinte[0] - x,
        vy = seguinte[1] - y,
        comprimento = Math.hypot(vx, vy);
      const tx = vx / comprimento,
        ty = vy / comprimento;
      const margem = largura + 4;
      const x0 = Math.max(0, Math.floor(x - origemFluxo[0] - margem));
      const y0 = Math.max(0, Math.floor(y - origemFluxo[1] - margem));
      const x1 = Math.min(larguraFluxo, Math.ceil(x - origemFluxo[0] + margem));
      const y1 = Math.min(alturaFluxo, Math.ceil(y - origemFluxo[1] + margem));
      for (let linha = y0; linha < y1; linha++)
        for (let coluna = x0; coluna < x1; coluna++) {
          const px = coluna + origemFluxo[0],
            py = linha + origemFluxo[1];
          const dx = px - x,
            dy = py - y,
            passo = limitar(dx * tx + dy * ty, 0, comprimento);
          const bordo = Math.hypot(dx - passo * tx, dy - passo * ty) / largura;
          const disco = ((px - 751) / 124) ** 2 + ((py - 202) / 115) ** 2;
          if (bordo >= 1.1 || (z < 0 && disco < 0.998)) continue;
          const perfil = limitar((1.1 - bordo) / 0.42, 0, 1);
          const peso = Math.round(255 * perfil * perfil * (3 - 2 * perfil));
          const k = (linha * larguraFluxo + coluna) * 4;
          if (peso <= campo[k + 2]) continue;
          campo[k] = Math.round((tx * 0.5 + 0.5) * 255);
          campo[k + 1] = Math.round((ty * 0.5 + 0.5) * 255);
          campo[k + 2] = peso;
          campo[k + 3] = Math.round(255 * limitar(0.5 + (dx * -ty + dy * tx) / (2 * largura), 0, 1));
        }
    }
  }
  construirCampo();

  function onda(x, y, forca) {
    ondas.set([x, y, presente.tempo, forca], indiceOnda * 4);
    indiceOnda = (indiceOnda + 1) % 6;
  }

  function desprender(x, y, z, forca, doPiso = false) {
    if (gotas.length >= [22, 52, limiteGotas][detalhe]) return;
    gotas.push({
      x,
      y,
      z,
      vx: (Math.random() - 0.45) * 47 * forca,
      vy: -(14 + Math.random() * 43) * forca,
      vz: (Math.random() - 0.4) * 18,
      raio: (0.55 + Math.random() * 1.1) * Math.min(1.35, forca),
      idade: 0,
      vida: 0.32 + Math.random() * 0.8,
      impacto: doPiso ? y : 327,
    });
  }

  function simularGotas(dt) {
    emissao += dt * (4 + detalhe * 2 + presente.energia * 7);
    while (emissao >= 1) {
      emissao--;
      const a = Math.random() < 0.55 ? 3.3 + Math.random() * 0.6 : 0.07 + Math.random() * 0.56;
      const [x, y, z] = orbita(a);
      desprender(x, y - 6, z, 0.7 + Math.random() * 0.5);
    }
    for (let i = gotas.length - 1; i >= 0; i--) {
      const g = gotas[i];
      g.idade += dt;
      g.vy += 96 * dt;
      g.x += g.vx * dt;
      g.y += g.vy * dt;
      g.z += g.vz * dt;
      if (g.y >= g.impacto && g.vy > 0) {
        if (g.raio > 1.1 && g.impacto >= 310) onda(g.x, g.impacto, 0.2);
        gotas.splice(i, 1);
      } else if (g.idade > g.vida) gotas.splice(i, 1);
    }
  }

  const verticePlano = `
    attribute vec2 canto;
    uniform vec4 janela;
    varying vec2 posicao;
    void main(){
      posicao=janela.xy+vec2(canto.x*.5+.5,.5-canto.y*.5)*janela.zw;
      gl_Position=vec4(canto,0.,1.);
    }`;
  const luzAmbiente = `
    precision highp float;
    uniform sampler2D fotografia;
    uniform vec4 estado;
    uniform vec4 janela;
    uniform float qualidade;
    const vec2 tamanho=vec2(1280.,720.);
    vec3 amostra(vec2 p){return texture2D(fotografia,clamp(p/tamanho,0.,1.)).rgb;}
    float esfera(vec2 p){vec2 d=(p-vec2(751.,202.))/vec2(124.,115.);return dot(d,d);}
    float oculto(vec3 p){
      return (1.-smoothstep(.97,1.,esfera(p.xy)))*step(p.z,0.);
    }
    vec3 iluminacao(vec3 n,vec2 p){
      float cobre=pow(max(dot(n,normalize(vec3(-.71,-.43,.57))),0.),31.);
      float azul=pow(max(dot(n,normalize(vec3(.46,-.39,.79))),0.),19.);
      return vec3(1.,.54,.19)*cobre*1.7+vec3(.38,.89,1.)*azul*1.2;
    }`;
  const piso =
    luzAmbiente +
    `
    uniform vec4 ondas[6];
    uniform sampler2D mapaFluxo;
    uniform vec3 impacto;
    varying vec2 posicao;
    // Derivadas de ondas com direções e velocidades distintas no plano d'água.
    vec2 inclinacao(vec2 p,float t){
      float escala=1./max(.35,(p.y-287.)*.006);
      vec2 q=vec2(p.x*.026,p.y*.082)*escala;
      vec2 gradiente=vec2(.9,.41)*cos(dot(q,vec2(.9,.41))-t*1.1)
        +vec2(-.17,.58)*cos(dot(q,vec2(-.31,1.04))+t*1.49)
        +vec2(.21,-.11)*cos(dot(q,vec2(.91,-.48))*2.7+t*1.83);
      if(qualidade>.5) gradiente+=.19*vec2(cos(q.y*4.6-t*2.3),sin(q.x*2.1+q.y*2.9+t));
      return gradiente;
    }
    void main(){
      vec2 p=posicao;
      float t=estado.x;
      vec2 d=(p-vec2(751.,202.))/vec2(124.,115.);
      float r=dot(d,d);
      float disco=1.-smoothstep(.84,1.,r);
      // A marca permanece registrada na superfície frontal, sem deformação.
      vec2 marca=abs(p-vec2(765.,191.))/vec2(106.,45.);
      float livre=smoothstep(.89,1.13,max(marca.x,marca.y));
      float z=sqrt(max(0.,1.-r));
      float giro=(.027*sin(t*.42)+estado.y*.17)*z;
      vec2 centroMovel=vec2(z*sin(giro),z*estado.z*.18)*vec2(124.,115.);
      vec2 q=p-centroMovel*disco*livre;
      float margemE=smoothstep(36.,154.,p.x+sin(p.y*.038)*19.);
      float margemD=1.-smoothstep(1040.,1235.,p.x+sin(p.y*.024)*52.);
      float molhado=smoothstep(309.,330.,p.y)*margemE*margemD;
      vec2 normal=vec2(0.);
      float reflexo=0.;
      vec4 fluxo=vec4(0.);
      vec2 uvFluxo=(p-vec2(510.,70.))/vec2(482.,245.);
      if(all(greaterThan(uvFluxo,vec2(0.))) && all(lessThan(uvFluxo,vec2(1.))))
        fluxo=texture2D(mapaFluxo,uvFluxo);
      float caustica=0.;
      if(molhado>.001) {
        normal=inclinacao(p,t);
        for(int i=0;i<6;i++){
          vec4 origem=ondas[i];
          float idade=t-origem.z;
          vec2 delta=(p-origem.xy)*vec2(.84,2.5);
          float dist=length(delta);
          float fase=dist-idade*122.;
          float amplitude=origem.w*exp(-abs(fase)*.039-idade*1.4);
          normal+=delta/max(dist,1.)*sin(fase*.27)*amplitude*4.4;
        }
        float profundidade=smoothstep(313.,605.,p.y);
        q+=molhado*normal*mix(vec2(2.4,1.6),vec2(5.5,2.6),profundidade);
        reflexo=normal.y*.061;
        vec2 vizinha=inclinacao(p+vec2(1.3,1.8),t);
        caustica=clamp((normal.y-vizinha.y)*.68+(normal.x-vizinha.x)*.38,-.35,.9);
      }
      vec3 cor=amostra(q);
      if(fluxo.b>.002) {
        vec2 tangente=normalize(fluxo.rg*2.-1.+.0001);
        vec2 transversal=vec2(-tangente.y,tangente.x);
        float cisalhamento=1.-abs(fluxo.a-.48)*.64;
        float relogio=t*.71+.11*sin(t*.63)+.07*sin(t*1.27);
        float fase=fract(relogio+.32*fluxo.a+.07*sin(dot(p,vec2(.018,.009))));
        float outra=fract(fase+.5);
        float mistura=abs(2.*fase-1.);
        mistura=mistura*mistura*(3.-2.*mistura);
        float batida=estado.w*exp(-abs(length(impacto.xy-p)-(t-impacto.z)*61.)*.044);
        vec2 desvio=transversal*(sin(dot(p,vec2(.074,.013))-t*2.53)*1.12+
          cos(dot(p,vec2(.019,.081))+t*1.31)*.53+batida*2.4)*fluxo.b;
        vec2 vazao=tangente*(19.+4.2*sin(dot(p,vec2(.011,-.017))-t*.48))*cisalhamento*fluxo.b;
        vec3 movel=mix(amostra(p+desvio-vazao*(fase-.5)),amostra(p+desvio-vazao*(outra-.5)),mistura);
        cor=mix(cor,movel,fluxo.b);
        float borda=pow(abs(2.*fluxo.a-1.),2.);
        cor+=cor*cor*(.08+.15*batida)*sin(dot(p,tangente)*.19-t*3.)*borda*fluxo.b;
      }
      if(molhado>.001){
        // A amostragem oblíqua reflete fontes da metade superior e mistura as
        // caústicas da chapa real junto à linha d'água.
        vec2 espelho=vec2(p.x,315.-(p.y-315.)*.71)+normal*vec2(7.,3.5);
        float angulo=exp(-max(0.,p.y-320.)*.011);
        vec3 ceu=amostra(espelho);
        cor=mix(cor,ceu,angulo*.085*molhado)*(1.+reflexo*molhado);
        cor+=cor*cor*(.10*max(normal.y,0.)+.38*caustica)*molhado;
      }
      vec3 n=normalize(vec3(d.x,-d.y,z)+vec3(0.,0.,.001));
      cor+=iluminacao(n,p)*.035*disco*livre*(.7+.3*cos(t*.27));
      gl_FragColor=vec4(cor,1.);
    }`;

  // A malha fechada é amostrada em duas direções: ao longo da corrente e
  // ao redor da seção transversal. As derivadas fornecem normais por vértice.
  const verticeCorrente = `
    precision highp float;
    attribute vec3 parametro;
    attribute vec3 eixo;
    attribute vec3 derivada;
    uniform vec4 janela;
    uniform vec4 estado;
    uniform vec3 impacto;
    uniform float espelho;
    varying vec3 lugar;
    varying vec3 normal;
    varying vec3 materia;
    vec3 superficie(float a,float b,float fio){
      float t=estado.x;
      float corrente=a-t*.58-.09*sin(t*.78);
      float miudo=sin(43.*a-t*13.+.9*sin(a*7.+t*1.1));
      float nervura=sin(8.*corrente+.65*sin(3.*a-t*1.1)+fio);
      float torcao=sin(13.*a-t*5.+fio*.71);
      float espessura=1.+.21*nervura+.19*torcao+.085*miudo;
      float lateral=fio==0.?0.:(fio==1.?-7.:6.7);
      float camada=fio==0.?1.:(.23+.085*sin(a*4.-t*2.));
      vec3 ponto=eixo+derivada*(a-parametro.x);
      vec3 alongada=normalize(derivada);
      vec3 radial=normalize(cross(alongada,vec3(.29,-.90,.33)));
      vec3 transversal=normalize(cross(radial,alongada));
      float idade=t-impacto.z;
      float distancia=length(ponto.xy-impacto.xy);
      float pulso=estado.w*exp(-abs(distancia-idade*72.)*.045)*cos((distancia-idade*72.)*.39);
      float onda1=1.65*sin(5.*corrente+.9*torcao)+pulso*2.;
      float onda2=1.2*sin(9.*a-t*3.1+fio)+.7*miudo;
      return ponto+radial*(onda1+lateral+(5.9+.7*cos(b*3.+torcao))*espessura*camada*cos(b))
        +transversal*(onda2+sin(b)*4.6*espessura*camada+fio*torcao*.7);
    }
    void main(){
      float a=parametro.x,b=parametro.y,fio=parametro.z;
      vec3 p=superficie(a,b,fio);
      vec3 alongada=superficie(a+.003,b,fio)-p;
      vec3 secao=superficie(a,b+.033,fio)-p;
      normal=normalize(cross(alongada,secao)+vec3(.000001));
      lugar=p;
      vec2 proj=p.xy;
      if(espelho>.5) {
        proj.y=318.+(318.-proj.y)*.71;
        proj.x+=2.*sin(proj.y*.19+estado.x*1.8)+1.4*sin(proj.y*.34-estado.x);
        proj.y+=1.4*sin(proj.x*.07-estado.x*2.);
      }
      vec2 uv=(proj-janela.xy)/janela.zw;
      gl_Position=vec4(uv*vec2(2.,-2.)+vec2(-1.,1.),0.,1.);
      materia=vec3(a,b,fio);
    }`;
  const corrente =
    luzAmbiente +
    `
    uniform float espelho;
    varying vec3 lugar;
    varying vec3 normal;
    varying vec3 materia;
    void main(){
      if(oculto(lugar)>.5) discard;
      float a=materia.x,b=materia.y,fio=materia.z,t=estado.x;
      float faceta=sin(59.*a+4.*sin(b*2.+a*13.)-t*12.3);
      vec3 n=normalize(normal+vec3(.11*faceta,.08*cos(31.*a+3.*b-t*7.),0.));
      if(n.z<0.)n=-n;
      float incidencia=clamp(n.z,0.,1.);
      float fresnel=.0204+.9796*pow(1.-incidencia,5.);
      float caminho=mix(1.3,7.7,incidencia)*(1.+.22*sin(11.*a-t*2.3));
      vec3 raio=refract(vec3(0.,0.,-1.),n,.7502);
      vec3 base=amostra(lugar.xy+raio.xy*caminho);
      vec3 absorcao=exp(-vec3(.047,.011,.006)*caminho);
      vec3 refletida=amostra(lugar.xy+n.xy*vec2(98.,56.)+vec2(0.,-11.));
      vec3 especular=iluminacao(n,lugar.xy);
      float crista=smoothstep(.91,1.,faceta)*smoothstep(.65,.94,1.-incidencia);
      vec3 cor=mix(base*absorcao,refletida+vec3(.03,.085,.10),fresnel)+especular*.39;
      cor+=vec3(.63,.9,.95)*crista*.28;
      float frente=smoothstep(-40.,125.,lugar.z);
      // O relevo complementa as cristas advectadas; não desenha um segundo contorno.
      float opacidade=mix(.045,.13,frente)+fresnel*.16+crista*.12;
      if(fio>.5) opacidade*=.69;
      if(espelho>.5) {
        cor*=vec3(.66,.85,.87);
        opacidade*=.18*(.58+.42*sin(lugar.y*1.15+estado.x*2.));
      }
      gl_FragColor=vec4(cor,opacidade);
    }`;
  const verticeGota = `
    attribute vec3 lugar;
    attribute vec2 aspecto;
    uniform vec4 janela;
    uniform float densidade;
    varying float opacidade;
    varying vec3 mundo;
    void main(){
      vec2 uv=(lugar.xy-janela.xy)/janela.zw;
      gl_Position=vec4(uv*vec2(2.,-2.)+vec2(-1.,1.),0.,1.);
      gl_PointSize=max(1.,aspecto.x*densidade*2.8);
      opacidade=aspecto.y;
      mundo=lugar;
    }`;
  const gota =
    luzAmbiente +
    `
    varying float opacidade;
    varying vec3 mundo;
    void main(){
      vec2 d=gl_PointCoord*2.-1.;
      float r=dot(d,d);
      if(r>=1. || oculto(mundo)>.5) discard;
      vec3 n=vec3(d,sqrt(1.-r));
      vec3 cor=amostra(mundo.xy+n.xy*2.7)*.84+iluminacao(n,mundo.xy);
      cor+=vec3(.22,.49,.56)*pow(r,2.);
      gl_FragColor=vec4(cor,(1.-smoothstep(.65,1.,r))*opacidade);
    }`;

  function malhaOrbital(segmentos, secoes, fios) {
    const parametros = [],
      indices = [];
    for (let fio = 0; fio < fios; fio++) {
      const inicio = parametros.length / 9;
      for (let i = 0; i <= segmentos; i++) {
        const angulo = (i * doisPi) / segmentos;
        const eixo = orbita(angulo),
          seguinte = orbita(angulo + 0.0005);
        const derivada = eixo.slice(0, 3).map((valor, k) => (seguinte[k] - valor) / 0.0005);
        for (let j = 0; j <= secoes; j++) {
          parametros.push(angulo, (j * doisPi) / secoes, fio, ...eixo.slice(0, 3), ...derivada);
          if (i === segmentos || j === secoes) continue;
          const a = inicio + i * (secoes + 1) + j,
            b = a + secoes + 1;
          indices.push(a, b, a + 1, a + 1, b, b + 1);
        }
      }
    }
    return [new Float32Array(parametros), new Uint16Array(indices)];
  }

  function criarMotorGrafico(gl) {
    function material(v, f, nomes) {
      const programa = gl.createProgram();
      for (const [tipo, fonte] of [
        [gl.VERTEX_SHADER, v],
        [gl.FRAGMENT_SHADER, f],
      ]) {
        const etapa = gl.createShader(tipo);
        gl.shaderSource(etapa, fonte);
        gl.compileShader(etapa);
        if (!gl.getShaderParameter(etapa, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(etapa));
        gl.attachShader(programa, etapa);
        gl.deleteShader(etapa);
      }
      gl.linkProgram(programa);
      if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(programa));
      const atributos = {},
        valores = {};
      for (const nome of nomes) atributos[nome] = gl.getAttribLocation(programa, nome);
      for (const nome of ["janela", "estado", "espelho", "impacto", "densidade", "qualidade", "ondas[0]"])
        valores[nome] = gl.getUniformLocation(programa, nome);
      return { programa, atributos, valores };
    }
    function memoria(alvo, dados, uso = gl.STATIC_DRAW) {
      const bloco = gl.createBuffer();
      gl.bindBuffer(alvo, bloco);
      gl.bufferData(alvo, dados, uso);
      return bloco;
    }
    const chao = material(verticePlano, piso, ["canto"]);
    const liquido = material(verticeCorrente, corrente, ["parametro", "eixo", "derivada"]);
    const spray = material(verticeGota, gota, ["lugar", "aspecto"]);
    const cantos = memoria(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]));
    const malhas = [
      [100, 7, 1],
      [165, 10, 2],
      [210, 12, 3],
    ].map(([s, n, f]) => {
      const [p, i] = malhaOrbital(s, n, f);
      return {
        pontos: memoria(gl.ARRAY_BUFFER, p),
        faces: memoria(gl.ELEMENT_ARRAY_BUFFER, i),
        total: i.length,
      };
    });
    const pontos = new Float32Array(limiteGotas * 5);
    const dispersao = memoria(gl.ARRAY_BUFFER, pontos, gl.DYNAMIC_DRAW);
    const textura = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textura);
    for (const eixo of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T])
      gl.texParameteri(gl.TEXTURE_2D, eixo, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, foto);
    const mapa = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, mapa);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, larguraFluxo, alturaFluxo, 0, gl.RGBA, gl.UNSIGNED_BYTE, campo);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    for (const eixo of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T])
      gl.texParameteri(gl.TEXTURE_2D, eixo, gl.CLAMP_TO_EDGE);
    gl.useProgram(chao.programa);
    gl.uniform1i(gl.getUniformLocation(chao.programa, "mapaFluxo"), 1);
    gl.activeTexture(gl.TEXTURE0);
    const habilitados = new Set();
    function preparar(m) {
      for (const indice of habilitados) gl.disableVertexAttribArray(indice);
      habilitados.clear();
      gl.useProgram(m.programa);
      gl.uniform4fv(m.valores.janela, recorte);
      gl.uniform4f(m.valores.estado, presente.tempo, presente.giro, presente.altura, presente.energia);
    }
    function atributo(indice, dimensao, passo = 0, inicio = 0) {
      gl.enableVertexAttribArray(indice);
      gl.vertexAttribPointer(indice, dimensao, gl.FLOAT, false, passo, inicio);
      habilitados.add(indice);
    }
    return () => {
      gl.viewport(0, 0, tela.width, tela.height);
      gl.disable(gl.BLEND);
      preparar(chao);
      gl.uniform3fv(chao.valores.impacto, impacto);
      gl.bindBuffer(gl.ARRAY_BUFFER, cantos);
      atributo(chao.atributos.canto, 2);
      gl.uniform4fv(chao.valores["ondas[0]"], ondas);
      gl.uniform1f(chao.valores.qualidade, detalhe);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      preparar(liquido);
      gl.uniform3fv(liquido.valores.impacto, impacto);
      const malha = malhas[detalhe];
      gl.bindBuffer(gl.ARRAY_BUFFER, malha.pontos);
      atributo(liquido.atributos.parametro, 3, 36);
      atributo(liquido.atributos.eixo, 3, 36, 12);
      atributo(liquido.atributos.derivada, 3, 36, 24);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, malha.faces);
      if (!compacto.matches && detalhe > 0) {
        gl.uniform1f(liquido.valores.espelho, 1);
        gl.drawElements(gl.TRIANGLES, malha.total, gl.UNSIGNED_SHORT, 0);
      }
      gl.uniform1f(liquido.valores.espelho, 0);
      gl.drawElements(gl.TRIANGLES, malha.total, gl.UNSIGNED_SHORT, 0);

      if (!gotas.length) return;
      preparar(spray);
      for (let i = 0; i < gotas.length; i++) {
        const g = gotas[i];
        const k = i * 5;
        pontos[k] = g.x;
        pontos[k + 1] = g.y;
        pontos[k + 2] = g.z;
        pontos[k + 3] = g.raio;
        pontos[k + 4] = Math.min(1, g.idade * 12, (g.vida - g.idade) * 6);
      }
      gl.uniform1f(spray.valores.densidade, tela.width / recorte[2]);
      gl.bindBuffer(gl.ARRAY_BUFFER, dispersao);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, pontos.subarray(0, gotas.length * 5));
      atributo(spray.atributos.lugar, 3, 20);
      atributo(spray.atributos.aspecto, 2, 20, 12);
      gl.drawArrays(gl.POINTS, 0, gotas.length);
    };
  }

  function criarMotorLeve(tinta) {
    const escalaX = foto.naturalWidth / 1280,
      escalaY = foto.naturalHeight / 720;
    // A mesma máscara de cobertura e as mesmas tangentes alimentam a versão
    // leve, que transporta pequenos trechos da cor original entre duas fases.
    const faixa = document.createElement("canvas"),
      mascara = document.createElement("canvas");
    faixa.width = mascara.width = larguraFluxo;
    faixa.height = mascara.height = alturaFluxo;
    const agua = faixa.getContext("2d"),
      pincel = mascara.getContext("2d");
    const cobertura = pincel.createImageData(larguraFluxo, alturaFluxo);
    for (let k = 0; k < campo.length; k += 4) cobertura.data[k + 3] = campo[k + 2];
    pincel.putImageData(cobertura, 0, 0);
    const partes = [];
    const passo = 8;
    for (let y = 0; y < alturaFluxo - passo / 2; y += passo)
      for (let x = 0; x < larguraFluxo - passo / 2; x += passo) {
        const k = ((y + passo / 2) * larguraFluxo + x + passo / 2) * 4;
        if (!campo[k + 2]) continue;
        partes.push([x, y, campo[k] / 127.5 - 1, campo[k + 1] / 127.5 - 1, campo[k + 3] / 255]);
      }
    return () => {
      const [x, y, w, h] = recorte,
        t = presente.tempo;
      tinta.setTransform(
        tela.width / w,
        0,
        0,
        tela.height / h,
        (-x * tela.width) / w,
        (-y * tela.height) / h,
      );
      tinta.drawImage(foto, 0, 0, 1280, 720);
      const inicio = Math.max(315, y),
        fim = Math.min(720, y + h);
      for (let linha = inicio; linha < fim; linha += 4) {
        const deslocamento = 1.7 * Math.sin(linha * 0.081 + t) + 0.65 * Math.cos(linha * 0.12 - t);
        tinta.drawImage(
          foto,
          128 * escalaX,
          linha * escalaY,
          950 * escalaX,
          4 * escalaY,
          128 + deslocamento,
          linha,
          950,
          4.1,
        );
      }
      agua.clearRect(0, 0, larguraFluxo, alturaFluxo);
      const relogio = t * 0.71 + 0.11 * Math.sin(t * 0.63) + 0.07 * Math.sin(t * 1.27);
      for (const [px, py, tx, ty, offset] of partes) {
        const fase = (relogio + 0.32 * offset) % 1;
        const outra = (fase + 0.5) % 1;
        const mistura = Math.abs(2 * fase - 1);
        const origemX = px + origemFluxo[0],
          origemY = py + origemFluxo[1];
        const forca = 16 * (1 - Math.abs(offset - 0.48) * 0.64);
        const copiar = (faseLocal) =>
          agua.drawImage(
            foto,
            (origemX - tx * forca * (faseLocal - 0.5)) * escalaX,
            (origemY - ty * forca * (faseLocal - 0.5)) * escalaY,
            passo * escalaX,
            passo * escalaY,
            px,
            py,
            passo,
            passo,
          );
        copiar(fase);
        agua.globalAlpha = mistura * mistura * (3 - 2 * mistura);
        copiar(outra);
        agua.globalAlpha = 1;
      }
      agua.globalCompositeOperation = "destination-in";
      agua.drawImage(mascara, 0, 0);
      agua.globalCompositeOperation = "source-over";
      tinta.drawImage(faixa, ...origemFluxo);
      for (let i = 0; i < ondas.length; i += 4) {
        const idade = t - ondas[i + 2];
        if (idade >= 2 || ondas[i + 1] < 308) continue;
        tinta.strokeStyle = "rgba(128,217,222," + 0.32 * ondas[i + 3] * Math.exp(-2.4 * idade) + ")";
        tinta.lineWidth = 0.8;
        tinta.beginPath();
        tinta.ellipse(ondas[i], ondas[i + 1], 1 + idade * 122, 1 + idade * 46, 0, 0, doisPi);
        tinta.stroke();
      }
      for (const g of gotas) {
        if (g.z < 0 && ((g.x - 751) / 124) ** 2 + ((g.y - 202) / 115) ** 2 < 1) continue;
        tinta.fillStyle = "rgba(157,218,225," + Math.min(0.72, g.idade * 6, (g.vida - g.idade) * 3) + ")";
        tinta.beginPath();
        tinta.ellipse(g.x, g.y, g.raio * 0.7, g.raio, 0, 0, doisPi);
        tinta.fill();
      }
    };
  }

  function dimensionar() {
    caixa = ambiente.getBoundingClientRect();
    const densidade = Math.min(
      window.devicePixelRatio || 1,
      [0.82, 1.13, 1.6][detalhe],
      2060 / Math.max(1, caixa.width),
    );
    const largura = Math.max(1, Math.round(caixa.width * densidade));
    const altura = Math.max(1, Math.round(caixa.height * densidade));
    if (tela.width !== largura || tela.height !== altura) {
      tela.width = largura;
      tela.height = altura;
    }
  }
  function enquadrar() {
    recorte = compacto.matches ? [510, 40, 490, 320] : [0, 0, 1280, 720];
    (compacto.matches ? vista : pagina).prepend(ambiente);
    dimensionar();
  }
  function ajustarCusto(intervalo) {
    // A janela de medição exclui reabertura da guia e longas pausas do sistema.
    if (intervalo > 0.45) return;
    duracao += intervalo;
    amostras++;
    if (amostras < 60) return;
    const media = duracao / amostras;
    const novo =
      media > 0.052 ? Math.max(0, detalhe - 1) : media < 0.037 ? Math.min(2, detalhe + 1) : detalhe;
    if (novo !== detalhe) {
      detalhe = novo;
      dimensionar();
    }
    duracao = 0;
    amostras = 0;
  }
  function animar(agora) {
    quadro = requestAnimationFrame(animar);
    const intervalo = (agora - ultimoQuadro) / 1000;
    if (intervalo < 0.029) return;
    ultimoQuadro = agora;
    const dt = Math.min(0.08, intervalo);
    presente.tempo += dt;
    const resposta = 1 - Math.exp(-8 * dt);
    presente.giro += (giroAlvo - presente.giro) * resposta;
    presente.altura += (alturaAlvo - presente.altura) * resposta;
    presente.energia *= Math.exp(-2.2 * dt);
    simularGotas(dt);
    motor();
    tela.style.opacity = "1";
    ajustarCusto(intervalo);
  }
  function atualizar() {
    cancelAnimationFrame(quadro);
    if (reduzir.matches) tela.style.opacity = "0";
    if (
      pronto &&
      visivel &&
      !document.hidden &&
      !reduzir.matches &&
      !document.querySelector("dialog[open]")
    ) {
      ultimoQuadro = performance.now();
      quadro = requestAnimationFrame(animar);
    }
  }
  const impacto = new Float32Array([751, 316, -30]);
  function projetar(evento) {
    const limites = ambiente.getBoundingClientRect();
    return [
      recorte[0] + ((evento.clientX - limites.left) * recorte[2]) / Math.max(1, limites.width),
      recorte[1] + ((evento.clientY - limites.top) * recorte[3]) / Math.max(1, limites.height),
    ];
  }
  function tocar(x, y, forca, evento) {
    if (reduzir.matches) return;
    const sobrePiso = y >= 309;
    if (!sobrePiso) {
      // Uma colisão no globo agita a corrente mais próxima em vez de emitir
      // gotas a partir da superfície sólida da marca.
      let crista = cristasVisiveis[0],
        distancia = Infinity;
      for (const ponto of cristasVisiveis) {
        const d = (ponto[0] - x) ** 2 + (ponto[1] - y) ** 2;
        if (d < distancia) {
          crista = ponto;
          distancia = d;
        }
      }
      const [a, b, z] = crista;
      x = a;
      y = b;
      for (let i = 0; i < Math.ceil(7 * forca); i++) desprender(x, y, z, forca);
    } else {
      onda(x, y, forca);
      for (let i = 0; i < Math.ceil(8 * forca); i++) desprender(x, y, 120, forca, true);
    }
    impacto.set([x, y, presente.tempo]);
    presente.energia = Math.max(presente.energia, forca);
    if (evento)
      pagina.dispatchEvent(
        new CustomEvent("onda-na-enseada", {
          bubbles: true,
          detail: {
            x: evento.clientX,
            y: evento.clientY,
            forca,
          },
        }),
      );
  }
  pagina.addEventListener("pointerdown", (evento) => {
    if (evento.target.closest("a,button,input,select,textarea") && !controle.contains(evento.target)) return;
    const [x, y] = projetar(evento);
    if (controle.contains(evento.target) || (y >= 309 && y <= 720))
      tocar(x, y, 0.65 + Math.min(1, evento.pressure || 0.4) * 0.7, evento);
  });
  pagina.addEventListener("pointermove", (evento) => {
    if (!visivel || reduzir.matches) return;
    const [x, y] = projetar(evento);
    if (controle.contains(evento.target)) {
      if (arrasto === evento.pointerId) {
        giroAlvo = limitar(giroAlvo + (evento.clientX - ultimoX) * 0.015, -1, 1);
        ultimoX = evento.clientX;
      } else giroAlvo = limitar((x - 751) / 280, -0.65, 0.65);
      alturaAlvo = limitar((y - 202) / 330, -0.24, 0.24);
    }
    if (
      presente.tempo - ultimoRastro < 0.23 ||
      (evento.target.closest("a,button") && !controle.contains(evento.target))
    )
      return;
    const coluna = Math.floor(x - origemFluxo[0]),
      linha = Math.floor(y - origemFluxo[1]);
    const naCorrente =
      coluna >= 0 &&
      linha >= 0 &&
      coluna < larguraFluxo &&
      linha < alturaFluxo &&
      campo[(linha * larguraFluxo + coluna) * 4 + 2] > 16;
    if (naCorrente || (y > 316 && y < 700 && x > 90 && x < 1190)) {
      ultimoRastro = presente.tempo;
      tocar(x, y, arrasto === null ? 0.23 : 0.48, evento);
    }
  });
  controle.addEventListener("pointerdown", (evento) => {
    arrasto = evento.pointerId;
    ultimoX = evento.clientX;
    controle.setPointerCapture(arrasto);
  });
  function soltar() {
    arrasto = null;
    giroAlvo = 0;
    alturaAlvo = 0;
  }
  controle.addEventListener("lostpointercapture", soltar);
  controle.addEventListener("pointerleave", () => {
    if (arrasto === null) soltar();
  });
  controle.addEventListener("click", (evento) => {
    if (evento.detail === 0) {
      tocar(751, 318, 1);
      giroAlvo = giroAlvo > 0.2 ? -0.65 : 0.65;
    }
  });
  controle.addEventListener("keydown", (evento) => {
    if (!["ArrowLeft", "ArrowRight"].includes(evento.key)) return;
    evento.preventDefault();
    giroAlvo = limitar(giroAlvo + (evento.key === "ArrowLeft" ? -0.2 : 0.2), -1, 1);
    tocar(751, 318, 0.62);
  });
  enquadrar();
  compacto.addEventListener("change", enquadrar);
  new ResizeObserver(dimensionar).observe(ambiente);
  new IntersectionObserver(([e]) => {
    visivel = e.isIntersecting;
    atualizar();
  }).observe(ambiente);
  const dialogo = document.querySelector("dialog");
  if (dialogo)
    new MutationObserver(atualizar).observe(dialogo, { attributes: true, attributeFilter: ["open"] });
  reduzir.addEventListener("change", atualizar);
  document.addEventListener("visibilitychange", atualizar);
  function carregar() {
    // O navegador pode aceitar o contexto e recusar um material na compilação.
    let gl = null;
    try {
      if (location.protocol !== "file:") {
        gl = tela.getContext("webgl", {
          alpha: false,
          antialias: false,
          depth: false,
          powerPreference: "low-power",
        });
      }
      motor = gl && criarMotorGrafico(gl);
    } catch {
      // Um canvas que já possui um contexto WebGL exige substituição para usar 2D.
      const substituta = tela.cloneNode(false);
      tela.replaceWith(substituta);
      tela = substituta;
      motor = null;
    }
    if (!motor) {
      const tinta = tela.getContext("2d", { alpha: false });
      if (!tinta) return;
      motor = criarMotorLeve(tinta);
    }
    pronto = true;
    dimensionar();
    atualizar();
  }
  tela.addEventListener("webglcontextlost", (evento) => {
    evento.preventDefault();
    pronto = false;
    tela.style.opacity = "0";
    atualizar();
  });
  tela.addEventListener("webglcontextrestored", carregar);
  foto.onload = carregar;
  foto.src = "recursos/enseada.webp";
})();
