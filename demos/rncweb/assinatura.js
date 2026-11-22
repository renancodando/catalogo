(() => {
  const script = document.currentScript;
  const catalogo = script?.dataset.catalogo || new URL("../../", script?.src || location.href).href;
  const estilo = document.createElement("style");
  estilo.textContent = `
.rncweb-faixa{all:unset;display:flex;justify-content:center;width:100%;padding:18px 16px 22px;box-sizing:border-box}
.rncweb-assinatura{all:unset;display:inline-flex;align-items:center;gap:12px;padding:10px 18px 10px 16px;border-radius:999px;background:linear-gradient(135deg,#0d1a1f,#071014);border:1px solid rgba(244,155,88,.35);box-shadow:0 10px 26px rgba(4,12,16,.35),inset 0 1px 0 rgba(255,255,255,.08);cursor:pointer;text-decoration:none;transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s,border-color .35s;-webkit-tap-highlight-color:transparent}
.rncweb-assinatura:hover{transform:translateY(-2px);border-color:rgba(244,155,88,.7);box-shadow:0 16px 34px rgba(4,12,16,.45),inset 0 1px 0 rgba(255,255,255,.1)}
.rncweb-assinatura:focus-visible{outline:2px solid #f49b58;outline-offset:3px}
.rncweb-texto{all:unset;font:500 13px/1.2 Arial,sans-serif;letter-spacing:.02em;color:rgba(232,240,242,.78);white-space:nowrap}
.rncweb-marca{all:unset;display:inline-flex;align-items:baseline;font:italic 800 22px/1 Arial,sans-serif;letter-spacing:-1.4px;white-space:nowrap;isolation:isolate;color:#fff}
.rncweb-sigla{all:unset;position:relative;z-index:0;color:#fff}
.rncweb-sigla:before{content:"";position:absolute;z-index:-1;left:19%;top:7%;width:94%;height:76%;border:2px solid #43cf84;border-left-color:transparent;border-radius:50%;transform:rotate(-32deg)}
.rncweb-web{all:unset;color:#f49b58}
.rncweb-web b{all:unset;font-size:.37em;letter-spacing:-.12em;vertical-align:super;margin:0 .22em 0 .12em;font-weight:800}
@media (max-width:420px){.rncweb-texto{font-size:12px}.rncweb-marca{font-size:20px}.rncweb-assinatura{gap:10px;padding:9px 14px}}
@media (prefers-reduced-motion:reduce){.rncweb-assinatura{transition:none}}`;
  document.head.append(estilo);
  const faixa = document.createElement("div");
  faixa.className = "rncweb-faixa";
  faixa.innerHTML =
    '<a class="rncweb-assinatura" target="_blank" rel="noopener" aria-label="Site criado por RNC Web — conheça o catálogo">' +
    '<span class="rncweb-texto">Site criado por</span>' +
    '<span class="rncweb-marca" aria-hidden="true"><span class="rncweb-sigla">RNC</span><span class="rncweb-web"><b>&lt;/&gt;</b>Web</span></span></a>';
  faixa.firstChild.href = catalogo;
  const colocar = () =>
    (document.querySelector("body > footer, footer.rodape, [data-rncweb]") || [...document.querySelectorAll("footer")].pop() || document.body).append(faixa);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", colocar);
  else colocar();
})();
