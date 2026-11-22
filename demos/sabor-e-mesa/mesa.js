import * as THREE from "./bibliotecas/three.module.min.js";

const ajustes = window.configuracaoEmpresa?.animacao ?? {};
const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
const recipiente = document.getElementById("cena-mesa");
const tela = recipiente.querySelector(".tela-mesa");

const vertice = `
  varying vec3 vNormal;
  varying vec3 vVista;
  varying vec3 vMundo;
  varying vec3 vLocal;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vLocal = position;
    vec4 mundo = modelMatrix * vec4(position, 1.0);
    vMundo = mundo.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vVista = normalize(cameraPosition - mundo.xyz);
    gl_Position = projectionMatrix * viewMatrix * mundo;
  }`;

const fragmentoBronze = `
  uniform vec3 uLuz;
  uniform vec3 uCorBase;
  uniform vec3 uCorAlta;
  uniform vec3 uCorBorda;
  uniform float uVarredura;
  uniform float uBrilho;
  uniform float uReflexo;
  varying vec3 vNormal;
  varying vec3 vVista;
  varying vec3 vMundo;
  varying vec3 vLocal;
  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vVista);
    float frente = clamp(dot(n, v), 0.0, 1.0);
    float borda = pow(1.0 - frente, 4.2);
    vec3 l = normalize(uLuz);
    vec3 h = normalize(l + v);
    float difusa = clamp(dot(n, l) * 0.5 + 0.5, 0.0, 1.0);
    float especular = pow(clamp(dot(n, h), 0.0, 1.0), 160.0);
    float risco = pow(clamp(dot(n, normalize(vec3(-0.85, 0.55, 0.45))), 0.0, 1.0), 34.0);
    float altura = clamp(vMundo.y / 2.0, 0.0, 1.0);
    vec3 cor = mix(uCorBase, uCorAlta, pow(difusa, 1.6) * (0.25 + 0.75 * altura));
    cor += uCorBorda * 0.06 * (1.0 - altura);
    float faixa = exp(-pow((vMundo.x * 0.8 + vMundo.y * 0.55 - uVarredura) * 3.2, 2.0));
    cor += uCorBorda * borda * 1.6 * uBrilho;
    cor += vec3(1.0, 0.86, 0.68) * especular * 0.25 * uBrilho;
    cor += vec3(1.0, 0.8, 0.6) * risco * 0.55 * uBrilho;
    cor += vec3(1.0, 0.78, 0.55) * faixa * 0.22 * (0.2 + borda) * uBrilho;
    gl_FragColor = vec4(cor, 1.0);
    if (uReflexo > 0.5) {
      float desvanecer = exp(vMundo.y * 4.5) * 0.6;
      gl_FragColor.rgb *= 0.8;
      gl_FragColor.a *= desvanecer;
    }
  }`;

const fragmentoVidro = `
  uniform vec3 uLuz;
  uniform float uBrilho;
  uniform float uReflexo;
  varying vec3 vNormal;
  varying vec3 vVista;
  varying vec3 vMundo;
  void main() {
    vec3 n = normalize(vNormal);
    float frente = abs(dot(n, normalize(vVista)));
    float borda = pow(1.0 - frente, 3.0);
    float especular = pow(clamp(dot(reflect(-normalize(uLuz), n), normalize(vVista)), 0.0, 1.0), 40.0);
    vec3 cor = vec3(1.0, 0.7, 0.42) * borda * 1.8 * uBrilho + vec3(1.0, 0.95, 0.85) * especular;
    gl_FragColor = vec4(cor, clamp(borda * 0.95 + especular + 0.03, 0.0, 1.0));
    if (uReflexo > 0.5) {
      float desvanecer = exp(vMundo.y * 3.2) * 0.26;
      gl_FragColor.rgb *= 0.8;
      gl_FragColor.a *= desvanecer;
    }
  }`;

const fragmentoVinho = `
  uniform float uBrilho;
  uniform float uReflexo;
  varying vec3 vNormal;
  varying vec3 vVista;
  varying vec3 vMundo;
  void main() {
    vec3 n = normalize(vNormal);
    float frente = abs(dot(n, normalize(vVista)));
    float topo = smoothstep(0.6, 1.0, n.y);
    float altura = smoothstep(0.9, 1.55, vMundo.y);
    vec3 cor = mix(vec3(0.22, 0.05, 0.02), vec3(0.66, 0.25, 0.08), altura);
    cor = mix(cor, vec3(1.0, 0.72, 0.42), topo * 0.7);
    cor += vec3(1.0, 0.6, 0.3) * pow(1.0 - frente, 2.0) * 0.5 * uBrilho;
    gl_FragColor = vec4(cor, 0.62 + topo * 0.2);
    if (uReflexo > 0.5) {
      float desvanecer = exp(vMundo.y * 3.2) * 0.26;
      gl_FragColor.rgb *= 0.8;
      gl_FragColor.a *= desvanecer;
    }
  }`;

const fragmentoVapor = `
  uniform float uTempo;
  uniform float uIntensidade;
  uniform float uSemente;
  varying vec2 vUv;
  float acaso(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float ruido(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(acaso(i), acaso(i + vec2(1.0, 0.0)), f.x), mix(acaso(i + vec2(0.0, 1.0)), acaso(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * ruido(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }
  void main() {
    float lado = 1.0 - pow(abs(vUv.x - 0.5) * 2.0, 1.6);
    float subida = smoothstep(0.0, 0.14, vUv.y) * pow(1.0 - vUv.y, 1.25);
    vec2 q = vec2(vUv.x * 2.4 + uSemente, vUv.y * 3.2 - uTempo * 0.42);
    float volume = fbm(q + vec2(fbm(q * 1.4 + uTempo * 0.12), 0.0) * 1.3);
    float fios = smoothstep(0.28, 0.78, volume) * (0.75 + 0.25 * sin(vUv.y * 22.0 - uTempo * 2.0 + vUv.x * 5.0 + uSemente));
    float alfa = lado * subida * (0.25 + fios * 0.95) * 0.66 * uIntensidade;
    gl_FragColor = vec4(vec3(1.0, 0.9, 0.8), alfa);
  }`;

const fragmentoContorno = `
  uniform vec3 uCor;
  uniform float uForca;
  varying vec3 vNormal;
  varying vec3 vVista;
  void main() {
    float lateral = 1.0 - abs(dot(normalize(vNormal), normalize(vVista)));
    float linha = smoothstep(0.55, 0.92, lateral) * (1.0 - smoothstep(0.97, 1.0, lateral) * 0.4);
    gl_FragColor = vec4(uCor * linha * uForca, linha * uForca);
  }`;

const verticeContorno = `
  uniform float uEspessura;
  varying vec3 vNormal;
  varying vec3 vVista;
  void main() {
    vec3 deslocado = position + normal * uEspessura;
    vec4 mundo = modelMatrix * vec4(deslocado, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vVista = normalize(cameraPosition - mundo.xyz);
    gl_Position = projectionMatrix * viewMatrix * mundo;
  }`;

function contornar(malha, cor, forca, espessura) {
  const material = new THREE.ShaderMaterial({
    vertexShader: verticeContorno,
    fragmentShader: fragmentoContorno,
    uniforms: { uCor: { value: new THREE.Color(cor) }, uForca: { value: forca }, uEspessura: { value: espessura } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  });
  const casca = new THREE.Mesh(malha.geometry, material);
  casca.renderOrder = 3;
  malha.add(casca);
  material.userData.base = forca;
  return material;
}

function torno(pontos, segmentos = 96) {
  return new THREE.LatheGeometry(pontos.map(([x, y]) => new THREE.Vector2(x, y)), segmentos);
}

function criarTexturaNevoa() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, "rgba(255,240,225,0.5)");
  r.addColorStop(1, "rgba(255,240,225,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function iniciar() {
  let renderizador;
  try {
    renderizador = new THREE.WebGLRenderer({ canvas: tela, alpha: true, antialias: true });
  } catch (erro) {
    return;
  }
  renderizador.setClearColor(0, 0);
  const cena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  const alvo = new THREE.Vector3(0.75, 1.55, 0);

  const uniformesComuns = { uLuz: { value: new THREE.Vector3(-2.6, 1.3, 0.4) }, uBrilho: { value: ajustes.intensidadeBrilho ?? 1 }, uVarredura: { value: 0 }, uReflexo: { value: 0 } };
  const bronze = (base, alta, borda) =>
    new THREE.ShaderMaterial({
      vertexShader: vertice,
      fragmentShader: fragmentoBronze,
      uniforms: { ...uniformesComuns, uCorBase: { value: new THREE.Color(base) }, uCorAlta: { value: new THREE.Color(alta) }, uCorBorda: { value: new THREE.Color(borda) } },
    });

  const conjunto = new THREE.Group();
  cena.add(conjunto);

  const bandeja = new THREE.Mesh(
    torno([[0, 0], [2.05, 0], [2.32, 0.03], [2.42, 0.09], [2.36, 0.13], [2.1, 0.12], [1.95, 0.16], [0, 0.16]]),
    bronze(0x0a0503, 0x2a1409, 0x7a3a16),
  );
  conjunto.add(bandeja);

  const tampa = new THREE.Group();
  const perfilCupula = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const angulo = t * Math.PI * 0.5;
    perfilCupula.push([Math.max(0.001, 1.78 * Math.pow(Math.cos(angulo), 0.92)), 0.24 + 1.42 * Math.sin(angulo)]);
  }
  perfilCupula.unshift([1.86, 0.2], [1.84, 0.24]);
  const cupula = new THREE.Mesh(torno(perfilCupula, 128), bronze(0x1a0c06, 0x8a5028, 0xffa457));
  cupula.material.side = THREE.DoubleSide;
  const aro = new THREE.Mesh(torno([[1.78, 0.16], [1.9, 0.17], [1.94, 0.21], [1.86, 0.25], [1.76, 0.24]]), bronze(0x1a0c06, 0x6a3a1a, 0xffb46a));
  const pegador = new THREE.Mesh(
    torno([[0.001, 1.64], [0.1, 1.64], [0.08, 1.72], [0.09, 1.78], [0.17, 1.84], [0.22, 1.94], [0.2, 2.03], [0.12, 2.09], [0.001, 2.1]], 64),
    bronze(0x120804, 0x4a2a14, 0xffaa60),
  );
  tampa.add(cupula, aro, pegador);
  const brilhosContorno = [
    contornar(cupula, 0xffa457, 0.85, 0.018),
    contornar(aro, 0xffc27a, 1.2, 0.012),
    contornar(pegador, 0xffb46a, 0.9, 0.01),
    contornar(bandeja, 0xff9a4a, 1.1, 0.014),
  ];
  conjunto.add(tampa);

  const taca = new THREE.Group();
  const vidro = new THREE.ShaderMaterial({ vertexShader: vertice, fragmentShader: fragmentoVidro, uniforms: uniformesComuns, transparent: true, depthWrite: false, side: THREE.DoubleSide });
  const perfilTaca = [[0.001, 0.0], [0.42, 0.0], [0.44, 0.02], [0.06, 0.05], [0.04, 0.1], [0.035, 0.9], [0.06, 0.96]];
  for (let i = 0; i <= 18; i++) {
    const t = i / 18;
    perfilTaca.push([0.06 + Math.sin(t * Math.PI * 0.62) * 0.52 - t * t * 0.06, 0.96 + t * 0.95]);
  }
  const corpoTaca = new THREE.Mesh(torno(perfilTaca, 72), vidro);
  const perfilVinho = [[0.001, 1.0]];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    perfilVinho.push([0.05 + Math.sin(t * Math.PI * 0.62 * 0.62) * 0.5 * 1.02, 1.0 + t * 0.56]);
  }
  perfilVinho.push([0.001, 1.56]);
  const vinho = new THREE.Mesh(
    torno(perfilVinho, 72),
    new THREE.ShaderMaterial({ vertexShader: vertice, fragmentShader: fragmentoVinho, uniforms: uniformesComuns, transparent: true }),
  );
  vinho.scale.set(0.94, 1, 0.94);
  taca.add(vinho, corpoTaca);
  taca.scale.setScalar(1.32);
  taca.position.set(3.1, 0, -0.4);
  conjunto.add(taca);

  const formaGarfo = new THREE.Shape();
  formaGarfo.moveTo(0, -0.05);
  formaGarfo.bezierCurveTo(0.9, -0.08, 1.5, -0.06, 2.0, -0.07);
  formaGarfo.bezierCurveTo(2.25, -0.1, 2.4, -0.16, 2.55, -0.17);
  formaGarfo.lineTo(3.1, -0.19);
  formaGarfo.lineTo(3.1, -0.15);
  formaGarfo.lineTo(2.62, -0.12);
  formaGarfo.lineTo(2.62, -0.05);
  formaGarfo.lineTo(3.1, -0.06);
  formaGarfo.lineTo(3.1, -0.02);
  formaGarfo.lineTo(2.62, 0.01);
  formaGarfo.lineTo(2.62, 0.08);
  formaGarfo.lineTo(3.1, 0.09);
  formaGarfo.lineTo(3.1, 0.13);
  formaGarfo.lineTo(2.62, 0.15);
  formaGarfo.lineTo(2.62, 0.22);
  formaGarfo.lineTo(3.1, 0.24);
  formaGarfo.lineTo(3.1, 0.28);
  formaGarfo.lineTo(2.55, 0.27);
  formaGarfo.bezierCurveTo(2.4, 0.27, 2.25, 0.2, 2.0, 0.12);
  formaGarfo.bezierCurveTo(1.5, 0.08, 0.9, 0.09, 0, 0.07);
  formaGarfo.quadraticCurveTo(-0.08, 0.01, 0, -0.05);
  const garfo = new THREE.Mesh(
    new THREE.ExtrudeGeometry(formaGarfo, { depth: 0.035, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2, curveSegments: 10 }),
    bronze(0x5a3214, 0xe0a05a, 0xffd08a),
  );
  garfo.rotation.set(-Math.PI / 2 + 0.42, 0.04, 0.1);
  garfo.scale.setScalar(0.92);
  garfo.position.set(-3.6, 0.04, 2.5);
  conjunto.add(garfo);
  brilhosContorno.push(contornar(garfo, 0xffc07a, 1.3, 0.008));

  const fitas = [];
  const SEGMENTOS = 64;
  for (let k = 0; k < 3; k++) {
    const geometria = new THREE.PlaneGeometry(1, 1, 1, SEGMENTOS);
    const material = new THREE.ShaderMaterial({
      vertexShader: vertice,
      fragmentShader: fragmentoVapor,
      uniforms: { uTempo: { value: 0 }, uIntensidade: { value: 1 }, uSemente: { value: k * 2.7 } },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const malha = new THREE.Mesh(geometria, material);
    malha.frustumCulled = false;
    malha.renderOrder = 5;
    cena.add(malha);
    fitas.push({ malha, semente: k * 2.7 + 0.4, largura: 0.32 - k * 0.07, altura: 3.0 - k * 0.45, fase: k * 0.33 });
  }
  const texturaNevoa = criarTexturaNevoa();
  const bufos = Array.from({ length: Math.round(26 * (ajustes.quantidadeVapor ?? 1)) }, (_, i) => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texturaNevoa, transparent: true, depthWrite: false, opacity: 0 }));
    sprite.renderOrder = 4;
    cena.add(sprite);
    return { sprite, vida: Math.random(), velocidade: 0.12 + Math.random() * 0.1, desvio: Math.random() * 6.28 };
  });

  const texturaAura = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, "rgba(255,170,90,0.55)");
    r.addColorStop(0.35, "rgba(230,110,45,0.2)");
    r.addColorStop(1, "rgba(200,80,30,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
    const textura = new THREE.CanvasTexture(c);
    textura.colorSpace = THREE.SRGBColorSpace;
    return textura;
  })();
  const aura = new THREE.Sprite(new THREE.SpriteMaterial({ map: texturaAura, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, opacity: 0.5 }));
  aura.position.set(0.2, 1.1, -2.2);
  aura.scale.set(7.5, 5.2, 1);
  aura.renderOrder = -1;
  cena.add(aura);

  const QUANTIDADE_FAGULHAS = innerWidth < 700 ? 26 : 48;
  const dadosFagulhas = new Float32Array(QUANTIDADE_FAGULHAS * 4);
  const posicoesFagulhas = new Float32Array(QUANTIDADE_FAGULHAS * 3);
  for (let i = 0; i < QUANTIDADE_FAGULHAS; i++) {
    posicoesFagulhas[i * 3] = -2.6 + Math.random() * 6.4;
    posicoesFagulhas[i * 3 + 2] = -1.8 + Math.random() * 3;
    dadosFagulhas.set([18 + Math.random() * 42, Math.random(), 0.025 + Math.random() * 0.05, Math.random() * 6.28], i * 4);
  }
  const geometriaFagulhas = new THREE.BufferGeometry();
  geometriaFagulhas.setAttribute("position", new THREE.BufferAttribute(posicoesFagulhas, 3));
  geometriaFagulhas.setAttribute("aDados", new THREE.BufferAttribute(dadosFagulhas, 4));
  const uniformesFagulhas = { uTempo: { value: 0 }, uEscala: { value: 1 } };
  const fagulhas = new THREE.Points(
    geometriaFagulhas,
    new THREE.ShaderMaterial({
      vertexShader: `
        attribute vec4 aDados;
        uniform float uTempo;
        uniform float uEscala;
        varying float vAlfa;
        void main() {
          float ciclo = fract(aDados.y + uTempo * aDados.z);
          vec3 p = position + vec3(sin(uTempo * 0.4 + aDados.w) * 0.35, 0.2 + ciclo * 4.2, cos(uTempo * 0.3 + aDados.w) * 0.2);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vAlfa = smoothstep(0.0, 0.15, ciclo) * smoothstep(1.0, 0.6, ciclo) * (0.5 + 0.5 * sin(uTempo * 2.5 + aDados.w * 7.0));
          gl_PointSize = aDados.x * uEscala / -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying float vAlfa;
        void main() {
          float r = length(gl_PointCoord - 0.5);
          float a = exp(-r * r * 40.0) * vAlfa;
          if (a < 0.01) discard;
          gl_FragColor = vec4(1.0, 0.72, 0.42, a * 0.85);
        }`,
      uniforms: uniformesFagulhas,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  fagulhas.frustumCulled = false;
  fagulhas.renderOrder = 6;
  cena.add(fagulhas);

  const materiaisRefletidos = [];
  const cascasContorno = [];
  conjunto.traverse((objeto) => {
    if (!objeto.isMesh) return;
    if (objeto.material.uniforms?.uReflexo) materiaisRefletidos.push(objeto.material);
    else cascasContorno.push(objeto);
  });
  const transparenciaOriginal = materiaisRefletidos.map((material) => material.transparent);
  const mesclaOriginal = materiaisRefletidos.map((material) => material.blending);
  const soltos = [aura, fagulhas, ...fitas.map((fita) => fita.malha), ...bufos.map((bufo) => bufo.sprite)];
  renderizador.autoClear = false;
  let refletir = true;
  function renderizar() {
    renderizador.clear();
    if (!refletir) {
      renderizador.render(cena, camera);
      return;
    }
    uniformesComuns.uReflexo.value = 1;
    conjunto.scale.y = -1;
    for (const material of materiaisRefletidos) {
      material.transparent = true;
      material.blending = THREE.AdditiveBlending;
    }
    for (const objeto of cascasContorno) objeto.visible = false;
    for (const objeto of soltos) objeto.visible = false;
    renderizador.render(cena, camera);
    renderizador.clearDepth();
    uniformesComuns.uReflexo.value = 0;
    conjunto.scale.y = 1;
    materiaisRefletidos.forEach((material, i) => {
      material.transparent = transparenciaOriginal[i];
      material.blending = mesclaOriginal[i];
    });
    for (const objeto of cascasContorno) objeto.visible = true;
    for (const objeto of soltos) objeto.visible = objeto.userData.oculto !== true;
    renderizador.render(cena, camera);
  }

  const topoPegador = new THREE.Vector3();
  const lateral = new THREE.Vector3();
  const centro = new THREE.Vector3();
  function atualizarVapor(t, dt, intensidade) {
    conjunto.updateMatrixWorld(true);
    topoPegador.set(0, 2.12, 0);
    tampa.localToWorld(topoPegador);
    const velocidade = ajustes.velocidadeVapor ?? 1;
    lateral.set(1, 0, 0).applyQuaternion(camera.quaternion);
    for (const fita of fitas) {
      const posicoes = fita.malha.geometry.attributes.position;
      fita.malha.material.uniforms.uTempo.value = t * velocidade;
      fita.malha.material.uniforms.uIntensidade.value = intensidade;
      for (let i = 0; i <= SEGMENTOS; i++) {
        const h = 1 - i / SEGMENTOS;
        const tt = t * 0.55 * velocidade + fita.fase;
        const curva =
          Math.sin(h * 4.2 - tt * 1.5 + fita.semente) * 0.55 +
          Math.sin(h * 7.3 - tt * 2.4 + fita.semente * 1.7) * 0.16 +
          Math.sin(h * 2.0 - tt * 0.6 + fita.semente * 0.6) * 0.5;
        centro.set(topoPegador.x + curva * Math.pow(h, 0.8) * 1.15 + h * 0.5, topoPegador.y + h * fita.altura, topoPegador.z + Math.sin(h * 2.6 - tt + fita.semente) * 0.3 * h);
        const largura = (0.04 + fita.largura * Math.pow(h, 0.9)) * (0.85 + 0.15 * Math.sin(h * 5 - tt * 1.8));
        const giro = Math.sin(h * 4.2 - tt * 1.2 + fita.semente) * 0.9;
        const lx = lateral.x * Math.cos(giro);
        const lz = lateral.z * Math.cos(giro) + Math.sin(giro) * 0.6;
        posicoes.setXYZ(i * 2, centro.x - lx * largura, centro.y, centro.z - lz * largura);
        posicoes.setXYZ(i * 2 + 1, centro.x + lx * largura, centro.y, centro.z + lz * largura);
      }
      posicoes.needsUpdate = true;
    }
    for (const bufo of bufos) {
      bufo.vida += dt * bufo.velocidade * velocidade;
      if (bufo.vida > 1) {
        bufo.vida -= 1;
        bufo.desvio = Math.random() * 6.28;
      }
      const v = bufo.vida;
      bufo.sprite.position.set(topoPegador.x + Math.sin(v * 5 + bufo.desvio) * 0.4 * v + v * 0.3, topoPegador.y + v * 2.6, topoPegador.z + Math.cos(bufo.desvio) * 0.3 * v);
      bufo.sprite.scale.setScalar(0.3 + v * 1.5);
      bufo.sprite.material.opacity = Math.sin(v * Math.PI) * 0.09 * intensidade;
    }
  }

  let largura = 1;
  let altura = 1;
  let razao = Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1.6 : 2);
  function ajustar() {
    const caixa = recipiente.getBoundingClientRect();
    largura = Math.max(1, caixa.width);
    altura = Math.max(1, caixa.height);
    renderizador.setPixelRatio(razao);
    uniformesFagulhas.uEscala.value = razao * Math.min(1.3, Math.max(0.7, caixa.width / 700));
    renderizador.setSize(largura, altura, false);
    camera.aspect = largura / altura;
    const metade = Math.tan(THREE.MathUtils.degToRad(15));
    const distancia = Math.max(8.4, 7.2 / (2 * metade * camera.aspect), 6.4 / (2 * metade));
    camera.userData.distancia = distancia;
    camera.updateProjectionMatrix();
  }

  const ponteiro = { x: 0, y: 0, alvoX: 0, alvoY: 0 };
  addEventListener("pointermove", (evento) => {
    if (evento.pointerType !== "mouse") return;
    ponteiro.alvoX = (evento.clientX / innerWidth - 0.5) * 2;
    ponteiro.alvoY = (evento.clientY / innerHeight - 0.5) * 2;
  });
  let tampaAberta = 0;
  let alvoTampa = 0;
  let impulsoVapor = 0;
  recipiente.addEventListener("click", () => {
    alvoTampa = alvoTampa ? 0 : 1;
    if (alvoTampa) impulsoVapor = 1;
    recipiente.setAttribute("aria-pressed", String(Boolean(alvoTampa)));
    if (reduzido) {
      tampaAberta = alvoTampa;
      desenhar(performance.now());
    }
  });
  recipiente.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      recipiente.click();
    }
  });

  const inicio = performance.now();
  let anterior = inicio;
  function desenhar(agora) {
    const t = (agora - inicio) / 1000;
    const dt = Math.min(0.05, (agora - anterior) / 1000);
    anterior = agora;
    const suave = 1 - Math.pow(0.03, dt);
    ponteiro.x += (ponteiro.alvoX - ponteiro.x) * suave;
    ponteiro.y += (ponteiro.alvoY - ponteiro.y) * suave;
    tampaAberta += (alvoTampa - tampaAberta) * (reduzido ? 1 : 1 - Math.pow(0.012, dt));
    impulsoVapor = Math.max(0, impulsoVapor - dt * 0.35);
    const parallax = (ajustes.parallax ?? 1) * (reduzido ? 0 : 1);
    const d = camera.userData.distancia || 10;
    camera.position.set(Math.sin(ponteiro.x * 0.12 * parallax) * d + 0.3, 1.35 - ponteiro.y * 0.2 * parallax, Math.cos(ponteiro.x * 0.12 * parallax) * d);
    camera.lookAt(alvo);
    tampa.position.y = tampaAberta * 0.55;
    tampa.position.x = -tampaAberta * 0.25;
    tampa.rotation.z = tampaAberta * 0.22;
    conjunto.rotation.y = reduzido ? 0 : Math.sin(t * 0.18) * 0.12;
    const varre = reduzido ? 0.4 : ((t * 0.16 * (ajustes.velocidadeReflexo ?? 1)) % 1) * 7 - 3;
    uniformesComuns.uVarredura.value = varre;
    const vela = reduzido ? 0 : Math.sin(t * 2.3) * 0.08 + Math.sin(t * 5.7) * 0.04;
    uniformesComuns.uLuz.value.set(-2.6 + Math.sin(t * 0.2) * 0.3, 1.3 + vela, 0.4 + Math.sin(t * 0.15) * 0.3);
    for (const material of brilhosContorno) material.uniforms.uForca.value = material.userData.base * (1 + vela * 0.8);
    uniformesComuns.uBrilho.value = (ajustes.intensidadeBrilho ?? 1) * (1 + vela * 0.6);
    atualizarVapor(reduzido ? 2.5 : t, dt, 0.85 + impulsoVapor * 0.9 + tampaAberta * 0.4);
    uniformesFagulhas.uTempo.value = reduzido ? 4 : t;
    aura.material.opacity = 0.42 + vela * 0.9 + tampaAberta * 0.12;
    renderizar();
  }

  let quadro = 0;
  let ativo = false;
  let media = 16;
  let ultimaAdaptacao = 0;
  let nivelEconomia = 0;
  const economias = [
    () => (refletir = false),
    () => {
      aura.userData.oculto = true;
      aura.visible = false;
    },
  ];
  function laco(agora) {
    const duracao = agora - anterior;
    desenhar(agora);
    if (duracao > 0 && duracao < 200) media += (duracao - media) * 0.08;
    if (media > 22 && razao > 0.6 && agora - ultimaAdaptacao > 900) {
      razao = Math.max(0.6, razao - 0.2);
      ultimaAdaptacao = agora;
      ajustar();
    } else if (media > 24 && razao <= 0.6 && nivelEconomia < economias.length && agora - ultimaAdaptacao > 1200) {
      economias[nivelEconomia++]();
      ultimaAdaptacao = agora;
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
  new ResizeObserver(() => {
    ajustar();
    desenhar(performance.now());
  }).observe(recipiente);
  recipiente.classList.add("webgl-ativo");
  recipiente.setAttribute("role", "button");
  recipiente.setAttribute("tabindex", "0");
  recipiente.setAttribute("aria-pressed", "false");
  recipiente.setAttribute("aria-label", "Levantar ou baixar a cloche");
  tela.addEventListener("webglcontextlost", (evento) => {
    evento.preventDefault();
    pausar();
    recipiente.classList.remove("webgl-ativo");
  });
  if (reduzido) desenhar(performance.now());
  else {
    new IntersectionObserver(([entrada]) => (entrada.isIntersecting && !document.hidden ? retomar() : pausar())).observe(recipiente);
    document.addEventListener("visibilitychange", () => (document.hidden ? pausar() : retomar()));
  }
}

iniciar();
