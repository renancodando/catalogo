import * as THREE from "./bibliotecas/three.module.min.js";

const ajustes = window.configuracaoEmpresa?.animacao ?? {};
const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
const cena3d = document.getElementById("cena-dente");
const tela = cena3d.querySelector(".tela-dente");

const contorno = [
  [0.16, 0.7], [0.38, 0.86], [0.66, 0.99], [0.92, 0.86], [1.01, 0.52], [0.94, 0.04], [0.82, -0.36], [0.7, -0.68],
  [0.58, -0.94], [0.46, -0.99], [0.36, -0.9], [0.28, -0.66], [0.18, -0.48], [0.04, -0.42], [-0.12, -0.45],
  [-0.22, -0.56], [-0.32, -0.8], [-0.4, -0.96], [-0.49, -0.98], [-0.58, -0.84], [-0.68, -0.48], [-0.82, -0.08],
  [-0.97, 0.34], [-1.0, 0.64], [-0.88, 0.83], [-0.62, 0.91], [-0.36, 0.89], [-0.1, 0.78],
];

const vertice = `
  varying vec3 vNormal;
  varying vec3 vVista;
  varying vec3 vPosicao;
  varying vec2 vUv;
  varying float vFrente;
  void main() {
    vUv = uv;
    vPosicao = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mundo = modelMatrix * vec4(position, 1.0);
    vFrente = mundo.z;
    vec4 mv = viewMatrix * mundo;
    vVista = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }`;

const fragmentoVidro = `
  uniform vec3 uLuz;
  uniform vec3 uCorBorda;
  uniform vec3 uCorMiolo;
  uniform float uBrilho;
  varying vec3 vNormal;
  varying vec3 vVista;
  varying vec3 vPosicao;
  void main() {
    vec3 n = normalize(vNormal);
    float fresnel = pow(1.0 - abs(dot(n, vVista)), 1.15);
    vec3 r = reflect(-normalize(uLuz), n);
    float especular = pow(max(dot(r, vVista), 0.0), 26.0);
    float especular2 = pow(max(dot(reflect(-normalize(vec3(-0.8, -0.4, 0.9)), n), vVista), 0.0), 60.0);
    float altura = smoothstep(-1.0, 1.0, vPosicao.y);
    vec3 cor = mix(uCorMiolo, uCorBorda, fresnel);
    cor = mix(cor, vec3(1.0), 0.18 * altura);
    cor += (especular * 1.3 + especular2 * 0.6) * uBrilho;
    float alfa = clamp(0.3 + fresnel * 0.85 + especular, 0.0, 1.0);
    gl_FragColor = vec4(cor, alfa);
  }`;

const fragmentoOrbita = `
  uniform float uCabeca;
  uniform float uBrilho;
  varying vec2 vUv;
  varying float vFrente;
  varying vec3 vNormal;
  varying vec3 vVista;
  void main() {
    float d = abs(fract(vUv.x - uCabeca + 0.5) - 0.5);
    float cabeca = exp(-d * 26.0);
    float cauda = smoothstep(0.5, 0.0, fract(uCabeca - vUv.x)) * 0.35;
    float frente = smoothstep(-0.9, 0.6, vFrente);
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vVista)), 1.2);
    vec3 cor = mix(vec3(0.62, 0.84, 1.0), vec3(1.0), 0.45 + 0.55 * frente);
    cor += vec3(0.35, 0.6, 1.0) * cabeca * uBrilho;
    float alfa = clamp((0.28 + 0.62 * frente) * (0.7 + 0.3 * fresnel) + cabeca * 0.8 + cauda * frente, 0.0, 1.0);
    gl_FragColor = vec4(cor, alfa);
  }`;

const fragmentoCorpo = `
  varying vec3 vPosicao;
  void main() {
    float diagonal = clamp((vPosicao.y - vPosicao.x) * 0.35 + 0.5, 0.0, 1.0);
    vec3 cor = mix(vec3(0.33, 0.6, 0.95), vec3(0.85, 0.94, 1.0), diagonal);
    gl_FragColor = vec4(cor, 0.03 + 0.1 * diagonal);
  }`;

function criarContorno() {
  const pontos = contorno.map(([x, y]) => new THREE.Vector3(x, y, -0.16 * x + (y > 0.6 ? 0.05 : 0)));
  const curva = new THREE.CatmullRomCurve3(pontos, true, "centripetal");
  const segmentos = 520;
  const radiais = 28;
  const geometria = new THREE.TubeGeometry(curva, segmentos, 0.074, radiais, true);
  const posicoes = geometria.attributes.position;
  const centro = new THREE.Vector3();
  const v = new THREE.Vector3();
  for (let i = 0; i <= segmentos; i++) {
    curva.getPointAt((i % segmentos) / segmentos, centro);
    const espessura = 1 + 0.5 * Math.max(0, -centro.x) - 0.22 * Math.max(0, centro.x) + 0.15 * Math.max(0, centro.y - 0.6);
    for (let j = 0; j <= radiais; j++) {
      const indice = i * (radiais + 1) + j;
      v.fromBufferAttribute(posicoes, indice).sub(centro).multiplyScalar(espessura).add(centro);
      posicoes.setXYZ(indice, v.x, v.y, v.z);
    }
  }
  geometria.computeVertexNormals();

  const dobra = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.12, 0.76, 0.06),
    new THREE.Vector3(0.06, 0.66, 0.03),
    new THREE.Vector3(0.28, 0.61, -0.02),
    new THREE.Vector3(0.5, 0.63, -0.08),
  ]);
  const geometriaDobra = new THREE.TubeGeometry(dobra, 80, 0.034, 16, false);
  const posDobra = geometriaDobra.attributes.position;
  for (let i = 0; i <= 80; i++) {
    dobra.getPointAt(i / 80, centro);
    const fator = Math.sin((i / 80) * Math.PI) * 0.9 + 0.1;
    for (let j = 0; j <= 16; j++) {
      const indice = i * 17 + j;
      v.fromBufferAttribute(posDobra, indice).sub(centro).multiplyScalar(fator).add(centro);
      posDobra.setXYZ(indice, v.x, v.y, v.z);
    }
  }
  geometriaDobra.computeVertexNormals();

  const forma = new THREE.Shape(curva.getSpacedPoints(160).map((p) => new THREE.Vector2(p.x, p.y)));
  const geometriaCorpo = new THREE.ShapeGeometry(forma, 24);
  return { geometria, geometriaDobra, geometriaCorpo };
}

function criarHalo(geometria) {
  const copia = geometria.clone();
  const posicoes = copia.attributes.position;
  const normais = copia.attributes.normal;
  for (let i = 0; i < posicoes.count; i++) {
    posicoes.setXYZ(
      i,
      posicoes.getX(i) + normais.getX(i) * 0.07,
      posicoes.getY(i) + normais.getY(i) * 0.07,
      posicoes.getZ(i) + normais.getZ(i) * 0.07,
    );
  }
  return copia;
}

function criarTexturaBrilho() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  const fundo = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  fundo.addColorStop(0, "rgba(255,255,255,1)");
  fundo.addColorStop(0.08, "rgba(220,240,255,0.9)");
  fundo.addColorStop(0.3, "rgba(150,200,255,0.18)");
  fundo.addColorStop(1, "rgba(150,200,255,0)");
  g.fillStyle = fundo;
  g.fillRect(0, 0, 256, 256);
  g.fillStyle = "rgba(255,255,255,0.95)";
  for (const [l, a] of [
    [124, 5],
    [70, 3.5],
  ]) {
    g.beginPath();
    g.moveTo(128 - l, 128);
    g.quadraticCurveTo(128, 128 - a, 128 + l, 128);
    g.quadraticCurveTo(128, 128 + a, 128 - l, 128);
    g.fill();
    g.beginPath();
    g.moveTo(128, 128 - l * 0.8);
    g.quadraticCurveTo(128 + a, 128, 128, 128 + l * 0.8);
    g.quadraticCurveTo(128 - a, 128, 128, 128 - l * 0.8);
    g.fill();
  }
  const textura = new THREE.CanvasTexture(c);
  textura.colorSpace = THREE.SRGBColorSpace;
  return textura;
}

function iniciar() {
  let renderizador;
  try {
    renderizador = new THREE.WebGLRenderer({ canvas: tela, alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch (erro) {
    return;
  }
  renderizador.setClearColor(0x000000, 0);
  const cena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 6);

  const grupo = new THREE.Group();
  cena.add(grupo);
  const { geometria, geometriaDobra, geometriaCorpo } = criarContorno();
  const uniformesVidro = {
    uLuz: { value: new THREE.Vector3(1, 1, 1) },
    uCorBorda: { value: new THREE.Color(0xf4fbff) },
    uCorMiolo: { value: new THREE.Color(0x4f97ee) },
    uBrilho: { value: ajustes.intensidadeBrilho ?? 1 },
  };
  const vidro = new THREE.ShaderMaterial({ vertexShader: vertice, fragmentShader: fragmentoVidro, uniforms: uniformesVidro, transparent: true });
  const contornoMalha = new THREE.Mesh(geometria, vidro);
  contornoMalha.renderOrder = 1;
  const dobraMalha = new THREE.Mesh(geometriaDobra, vidro);
  dobraMalha.renderOrder = 1;
  const corpo = new THREE.Mesh(
    geometriaCorpo,
    new THREE.ShaderMaterial({ vertexShader: vertice, fragmentShader: fragmentoCorpo, transparent: true, depthWrite: false }),
  );
  corpo.position.z = -0.03;
  corpo.renderOrder = 3;
  const halo = new THREE.Mesh(
    geometria,
    new THREE.ShaderMaterial({
      vertexShader: vertice,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vVista;
        void main() {
          float frente = pow(abs(dot(normalize(vNormal), vVista)), 1.5);
          gl_FragColor = vec4(vec3(0.55, 0.8, 1.0), frente * 0.22);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  halo.scale.set(1.0, 1.0, 1.0);
  halo.renderOrder = 5;
  const haloExterno = new THREE.Mesh(criarHalo(geometria), halo.material);
  haloExterno.renderOrder = 5;
  grupo.add(contornoMalha, dobraMalha, corpo, haloExterno);

  const uniformesOrbita = { uCabeca: { value: 0 }, uBrilho: { value: ajustes.intensidadeBrilho ?? 1 } };
  const orbita = new THREE.Mesh(
    new THREE.TorusGeometry(1.36, 0.021, 14, 420),
    new THREE.ShaderMaterial({ vertexShader: vertice, fragmentShader: fragmentoOrbita, uniforms: uniformesOrbita, transparent: true }),
  );
  orbita.renderOrder = 2;
  const suporteOrbita = new THREE.Group();
  suporteOrbita.add(orbita);
  suporteOrbita.rotation.set(Math.PI / 2 - 0.34, 0.08, 0.2);
  suporteOrbita.position.y = -0.12;
  grupo.add(suporteOrbita);

  const brilho = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: criarTexturaBrilho(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  brilho.position.set(0.88, 0.8, -0.08);
  brilho.scale.setScalar(0.5);
  brilho.renderOrder = 4;
  grupo.add(brilho);

  let largura = 0;
  let altura = 0;
  let razaoMaxima = Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1.6 : 2);
  let mediaQuadro = 16;
  let ultimaAdaptacao = 0;
  function ajustar() {
    const caixa = cena3d.getBoundingClientRect();
    largura = Math.max(1, caixa.width);
    altura = Math.max(1, caixa.height);
    renderizador.setPixelRatio(razaoMaxima);
    renderizador.setSize(largura, altura, false);
    camera.aspect = largura / altura;
    const metade = Math.tan(THREE.MathUtils.degToRad(15));
    camera.position.z = Math.max(4.9, 1.4 / metade, 3.05 / (2 * metade * camera.aspect));
    camera.updateProjectionMatrix();
    desenhar(performance.now());
  }

  const ponteiro = { x: 0, y: 0, alvoX: 0, alvoY: 0 };
  let arraste = null;
  let giroArraste = 0;
  addEventListener("pointermove", (evento) => {
    if (arraste) {
      giroArraste = Math.max(-0.9, Math.min(0.9, arraste.giro + (evento.clientX - arraste.x) / 180));
      return;
    }
    if (evento.pointerType !== "mouse") return;
    ponteiro.alvoX = (evento.clientX / innerWidth - 0.5) * 2;
    ponteiro.alvoY = (evento.clientY / innerHeight - 0.5) * 2;
  });
  cena3d.addEventListener("pointerdown", (evento) => (arraste = { x: evento.clientX, giro: giroArraste }));
  addEventListener("pointerup", () => (arraste = null));
  addEventListener("pointercancel", () => (arraste = null));

  const inicio = performance.now();
  let anterior = inicio;
  function desenhar(agora) {
    const t = (agora - inicio) / 1000;
    const dt = Math.min(0.05, (agora - anterior) / 1000);
    anterior = agora;
    const fator = 1 - Math.pow(0.02, dt);
    ponteiro.x += (ponteiro.alvoX - ponteiro.x) * fator;
    ponteiro.y += (ponteiro.alvoY - ponteiro.y) * fator;
    if (!arraste) giroArraste *= 1 - fator * 0.25;
    const balanco = (ajustes.balancoDente ?? 1) * (reduzido ? 0 : 1);
    const parallax = ajustes.parallax ?? 1;
    const entrada = reduzido ? 1 : Math.min(1, t / 1.6);
    const suave = 1 - Math.pow(1 - entrada, 3);
    grupo.rotation.y = Math.sin(t * 0.33) * 0.22 * balanco + ponteiro.x * 0.22 * parallax + giroArraste + (1 - suave) * -0.6;
    grupo.rotation.x = Math.sin(t * 0.27) * 0.05 * balanco + ponteiro.y * 0.1 * parallax;
    grupo.position.y = 0.1 + Math.sin(t * 0.8) * 0.045 * balanco;
    grupo.scale.setScalar(0.86 + 0.14 * suave);
    uniformesOrbita.uCabeca.value = reduzido ? 0.2 : (t * 0.09 * (ajustes.velocidadeOrbita ?? 1)) % 1;
    suporteOrbita.rotation.z = 0.2 + Math.sin(t * 0.21) * 0.05 * balanco;
    uniformesVidro.uLuz.value.set(Math.cos(t * 0.45) * 1.4, 0.9 + Math.sin(t * 0.3) * 0.4, 1.2 + Math.sin(t * 0.45) * 0.5);
    const pulso = reduzido ? 1 : 0.85 + 0.25 * Math.sin(t * 2.2) + 0.12 * Math.sin(t * 5.1);
    brilho.scale.setScalar(0.52 * pulso);
    brilho.material.rotation = reduzido ? 0 : Math.sin(t * 0.6) * 0.15;
    renderizador.render(cena, camera);
  }

  let quadro = 0;
  let ativo = false;
  function laco(agora) {
    const duracao = agora - anterior;
    desenhar(agora);
    if (duracao > 0 && duracao < 200) mediaQuadro += (duracao - mediaQuadro) * 0.08;
    if (mediaQuadro > 22 && razaoMaxima > 0.6 && agora - ultimaAdaptacao > 900) {
      razaoMaxima = Math.max(0.6, razaoMaxima - 0.2);
      ultimaAdaptacao = agora;
      ajustar();
    }
    quadro = requestAnimationFrame(laco);
  }
  function retomar() {
    if (ativo || reduzido) return;
    ativo = true;
    anterior = performance.now();
    quadro = requestAnimationFrame(laco);
  }
  function pausar() {
    ativo = false;
    cancelAnimationFrame(quadro);
  }

  ajustar();
  new ResizeObserver(ajustar).observe(cena3d);
  cena3d.classList.add("webgl-ativo");
  tela.addEventListener("webglcontextlost", (evento) => {
    evento.preventDefault();
    pausar();
    cena3d.classList.remove("webgl-ativo");
  });
  if (reduzido) {
    desenhar(performance.now());
  } else {
    new IntersectionObserver(([entrada]) => (entrada.isIntersecting && !document.hidden ? retomar() : pausar())).observe(cena3d);
    document.addEventListener("visibilitychange", () => (document.hidden ? pausar() : retomar()));
  }
}

iniciar();
