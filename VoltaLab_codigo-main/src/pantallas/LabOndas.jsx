import { useEffect, useReducer, useRef, useState } from "react";
import "../fisica.css";
import { Cabecera, Ctl, Pestanas, useTiempo, fmt } from "../componentes/fisica.jsx";
import { IconoFis } from "../componentes/IconosFisica.jsx";
import { Switch } from "../componentes/ui.jsx";
import { campoOndas, intensidadOndas } from "../lib/fisicaLab.js";
import { alterna } from "../lib/ondas.js";

const WX = 8, WY = 5, CW = 160, CH = 100; // mundo en metros y resolución del campo
const COLS = ["#D0493F", "#246B8E", "#4D876C", "#8A5CC7"];

function Cubeta() {
  const cv = useRef(null), buf = useRef(null), est = useRef({ fuentes: [{ id: 1, x: 2.5, y: 2.5, f: 1, A: 1.5, fase: 0, on: true }, { id: 2, x: 5.5, y: 2.5, f: 1, A: 1.5, fase: 0, on: true }], sondas: [{ id: 1, x: 4, y: 1 }], v: 2, t: 0, modo: "onda", traza: { 1: [] }, sig: 3 });
  const [, bump] = useReducer((x) => x + 1, 0), [corre, setCorre] = useState(true), [vel, setVel] = useState(1), [sel, setSel] = useState({ t: "fuente", id: 1 });
  const s = est.current, arrastre = useRef(null);

  const dibujar = () => {
    const c = cv.current; if (!c) return;
    const ctx = c.getContext("2d");
    if (!buf.current) { buf.current = document.createElement("canvas"); buf.current.width = CW; buf.current.height = CH; }
    const bctx = buf.current.getContext("2d"), img = bctx.createImageData(CW, CH), d = img.data;
    const Amax = s.fuentes.filter((f) => f.on).reduce((a, f) => a + f.A, 0) || 1, Imax = Amax * Amax / 2;
    for (let j = 0; j < CH; j++) for (let i = 0; i < CW; i++) {
      const x = ((i + 0.5) / CW) * WX, y = ((j + 0.5) / CH) * WY, k = (j * CW + i) * 4;
      if (s.modo === "onda") {
        const u = Math.max(-1, Math.min(1, campoOndas(x, y, s.t, s.fuentes, s.v) / (Amax * 0.7)));
        d[k] = u > 0 ? 246 - u * 210 : 246 + u * 30; d[k + 1] = u > 0 ? 241 - u * 134 : 241 + u * 110; d[k + 2] = u > 0 ? 231 - u * 90 : 231 + u * 180; d[k + 3] = 255;
      } else {
        const u = Math.min(1, Math.sqrt(intensidadOndas(x, y, s.fuentes, s.v) / Imax));
        d[k] = 250 - u * 190; d[k + 1] = 244 - u * 150; d[k + 2] = 232 - u * 100; d[k + 3] = 255;
      }
    }
    bctx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true; ctx.drawImage(buf.current, 0, 0, c.width, c.height);
    const px = (x) => (x / WX) * c.width, py = (y) => (y / WY) * c.height;
    ctx.lineWidth = 3; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center";
    s.fuentes.forEach((f, i) => { ctx.beginPath(); ctx.arc(px(f.x), py(f.y), 13, 0, 7); ctx.fillStyle = f.on ? COLS[i % 4] : "#9AA9B8"; ctx.fill(); ctx.strokeStyle = sel && sel.t === "fuente" && sel.id === f.id ? "#F2BD4B" : "#fff"; ctx.stroke(); ctx.fillStyle = "#fff"; ctx.fillText(`S${i + 1}`, px(f.x), py(f.y) + 5); });
    s.sondas.forEach((p, i) => { ctx.fillStyle = "#243247"; ctx.fillRect(px(p.x) - 11, py(p.y) - 11, 22, 22); ctx.strokeStyle = sel && sel.t === "sonda" && sel.id === p.id ? "#F2BD4B" : "#fff"; ctx.strokeRect(px(p.x) - 11, py(p.y) - 11, 22, 22); ctx.fillStyle = "#fff"; ctx.fillText(`P${i + 1}`, px(p.x), py(p.y) + 5); });
  };

  useEffect(() => {
    let id, ant = performance.now();
    const paso = (ahora) => {
      const dt = Math.min(0.05, (ahora - ant) / 1000) * vel; ant = ahora;
      if (corre) {
        s.t += dt;
        s.sondas.forEach((p) => { const tr = s.traza[p.id] || (s.traza[p.id] = []); tr.push([s.t, campoOndas(p.x, p.y, s.t, s.fuentes, s.v)]); while (tr.length && s.t - tr[0][0] > 6) tr.shift(); });
      }
      dibujar(); bump(); id = requestAnimationFrame(paso);
    };
    id = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line
  }, [corre, vel, sel]);

  const aMundo = (e) => { const r = cv.current.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * WX, ((e.clientY - r.top) / r.height) * WY]; };
  const buscar = (x, y) => {
    const hit = (o) => Math.hypot(o.x - x, o.y - y) < 0.4;
    const f = s.fuentes.find(hit); if (f) return { t: "fuente", id: f.id };
    const p = s.sondas.find(hit); return p ? { t: "sonda", id: p.id } : null;
  };
  const alBajar = (e) => { const [x, y] = aMundo(e), h = buscar(x, y); if (h) { setSel(h); arrastre.current = h; e.target.setPointerCapture(e.pointerId); } else setSel(null); };
  const alMover = (e) => {
    const h = arrastre.current; if (!h) return;
    const [x, y] = aMundo(e), o = (h.t === "fuente" ? s.fuentes : s.sondas).find((q) => q.id === h.id);
    if (o) { o.x = Math.max(0.2, Math.min(WX - 0.2, x)); o.y = Math.max(0.2, Math.min(WY - 0.2, y)); if (h.t === "sonda") s.traza[o.id] = []; }
  };
  const alSoltar = () => { arrastre.current = null; };

  const addFuente = () => { if (s.fuentes.length >= 4) return; const f = { id: s.sig++, x: 1 + Math.random() * 6, y: 1 + Math.random() * 3, f: 1, A: 1.5, fase: 0, on: true }; s.fuentes.push(f); setSel({ t: "fuente", id: f.id }); };
  const addSonda = () => { if (s.sondas.length >= 3) return; const p = { id: s.sig++, x: 1 + Math.random() * 6, y: 1 + Math.random() * 3 }; s.sondas.push(p); s.traza[p.id] = []; setSel({ t: "sonda", id: p.id }); };
  const preset = (n) => {
    s.t = 0; s.traza = {}; s.sig = 10;
    if (n === "uno") { s.fuentes = [{ id: 1, x: 3, y: 2.5, f: 1, A: 1.5, fase: 0, on: true }]; s.sondas = [{ id: 2, x: 6, y: 2.5 }]; }
    if (n === "fase") { s.fuentes = [{ id: 1, x: 2.5, y: 2.5, f: 1, A: 1.5, fase: 0, on: true }, { id: 2, x: 5.5, y: 2.5, f: 1, A: 1.5, fase: 0, on: true }]; s.sondas = [{ id: 3, x: 4, y: 1 }]; }
    if (n === "opuesta") { s.fuentes = [{ id: 1, x: 2.5, y: 2.5, f: 1, A: 1.5, fase: 0, on: true }, { id: 2, x: 5.5, y: 2.5, f: 1, A: 1.5, fase: 180, on: true }]; s.sondas = [{ id: 3, x: 4, y: 2.5 }]; }
    if (n === "batido") { s.fuentes = [{ id: 1, x: 2, y: 2.5, f: 1, A: 1.5, fase: 0, on: true }, { id: 2, x: 2, y: 2.5, f: 1.25, A: 1.5, fase: 0, on: true }]; s.sondas = [{ id: 3, x: 5, y: 2.5 }]; }
    s.sondas.forEach((p) => { s.traza[p.id] = []; }); setSel(null); bump();
  };
  const fSel = sel && sel.t === "fuente" ? s.fuentes.find((f) => f.id === sel.id) : null, pSel = sel && sel.t === "sonda" ? s.sondas.find((p) => p.id === sel.id) : null;
  const lam = (f) => s.v / f;
  const dosF = s.fuentes.filter((f) => f.on);
  const d12 = dosF.length === 2 ? Math.hypot(dosF[0].x - dosF[1].x, dosF[0].y - dosF[1].y) : null;

  // osciloscopio
  const Wo = 620, Ho = 170, X = (t) => 10 + ((t - (s.t - 6)) / 6) * (Wo - 20), esc = (Ho / 2 - 16) / (dosF.reduce((a, f) => a + f.A, 0) || 1);
  return (
    <div className="lab-grid ondas">
      <aside className="tarjeta lab-paleta">
        <h3>Piezas</h3>
        <button className="btn lab-add" onClick={addFuente} disabled={s.fuentes.length >= 4}>＋ Fuente de ondas ({s.fuentes.length}/4)</button>
        <button className="btn lab-add" onClick={addSonda} disabled={s.sondas.length >= 3}>＋ Sonda ({s.sondas.length}/3)</button>
        <div className="lab-sec">Medio</div>
        <Ctl etiqueta="Velocidad de la onda" valor={s.v} set={(v) => { s.v = v; s.traza = Object.fromEntries(s.sondas.map((p) => [p.id, []])); bump(); }} min={0.5} max={4} paso={0.1} dec={1} unidad="m/s" />
        <div className="lab-sec">Vista</div>
        <div className="fis-chips"><button className={s.modo === "onda" ? "on" : ""} onClick={() => { s.modo = "onda"; bump(); }}>Ondas</button><button className={s.modo === "intensidad" ? "on" : ""} onClick={() => { s.modo = "intensidad"; bump(); }}>Zonas de refuerzo</button></div>
        <div className="lab-sec">Ejemplos</div>
        <button className="btn lab-add" onClick={() => preset("uno")}>Una sola fuente</button>
        <button className="btn lab-add" onClick={() => preset("fase")}>Dos fuentes en fase</button>
        <button className="btn lab-add" onClick={() => preset("opuesta")}>Dos fuentes en oposición</button>
        <button className="btn lab-add" onClick={() => preset("batido")}>Pulsos (f parecidas)</button>
      </aside>
      <div className="lab-centro">
        <div className="tarjeta lab-barra">
          <button className="btn prim med" onClick={() => setCorre(!corre)}>{corre ? "⏸ Pausar" : "▶ Reanudar"}</button>
          <span className="lab-vel">Velocidad {[[1, "Normal"], [0.25, "Cámara lenta"]].map(([x, t]) => <button key={x} className={`btn sm ${vel === x ? "activo" : ""}`} onClick={() => setVel(x)}>{t}</button>)}</span>
          <span className="lab-tiempo">t = {fmt(s.t, 1)} s</span>
          <span className="lab-tiempo">Arrastra las piezas sobre la cubeta</span>
        </div>
        <div className="zona-fis lab-cubeta"><canvas ref={cv} width={800} height={500} onPointerDown={alBajar} onPointerMove={alMover} onPointerUp={alSoltar} aria-label="Cubeta de ondas" /></div>
        <div className="tarjeta lab-grafica">
          <svg viewBox={`0 0 ${Wo} ${Ho}`} className="esc-svg" role="img" aria-label="Osciloscopio">
            <line x1={10} x2={Wo - 10} y1={Ho / 2} y2={Ho / 2} className="esc-rej" />
            {s.sondas.map((p, i) => { const tr = s.traza[p.id] || []; return tr.length > 1 ? <polyline key={p.id} fill="none" stroke={COLS[(i + 1) % 4]} strokeWidth="3" strokeLinejoin="round" points={tr.map(([t, y]) => `${X(t).toFixed(1)},${(Ho / 2 - y * esc).toFixed(1)}`).join(" ")} /> : null; })}
            <text x={14} y={16} className="esc-peq">Osciloscopio: lo que mide cada sonda en los últimos 6 s</text>
            {!s.sondas.length ? <text x={Wo / 2} y={Ho / 2 + 20} textAnchor="middle" className="esc-peq">Agrega una sonda para ver la señal.</text> : null}
          </svg>
          <div className="lab-leyenda">{s.sondas.map((p, i) => <span key={p.id}><i style={{ background: COLS[(i + 1) % 4] }} />P{i + 1}</span>)}</div>
        </div>
      </div>
      <aside className="tarjeta lab-insp">
        <h3>Pieza seleccionada</h3>
        {!sel ? <p className="fis-peq">Toca una fuente (S) o una sonda (P) en la cubeta para editarla.</p> : null}
        {fSel ? (<>
          <p className="lab-nom"><IconoFis tipo="onda" w={40} h={22} /> Fuente S{s.fuentes.indexOf(fSel) + 1}</p>
          <Ctl etiqueta="Frecuencia f" valor={fSel.f} set={(f) => { fSel.f = f; bump(); }} min={0.3} max={3} paso={0.05} dec={2} unidad="Hz" />
          <Ctl etiqueta="Amplitud A" valor={fSel.A} set={(A) => { fSel.A = A; bump(); }} min={0.5} max={3} paso={0.5} dec={1} unidad="cm" />
          <Ctl etiqueta="Fase inicial" valor={fSel.fase} set={(f) => { fSel.fase = f; bump(); }} min={0} max={360} paso={15} unidad="°" />
          <p className="fis-peq">λ = v/f = {fmt(lam(fSel.f), 2)} m · T = {fmt(1 / fSel.f, 2)} s</p>
          <Switch chico on={fSel.on} onChange={(v) => { fSel.on = v; bump(); }}>Encendida</Switch>
          <button className="btn err med completo" style={{ marginTop: 10 }} onClick={() => { s.fuentes = s.fuentes.filter((f) => f.id !== fSel.id); setSel(null); }}>Quitar la fuente</button>
        </>) : null}
        {pSel ? (<>
          <p className="lab-nom"><IconoFis tipo="interf" w={40} h={22} /> Sonda P{s.sondas.indexOf(pSel) + 1}</p>
          <p className="fis-peq">Posición: ({fmt(pSel.x, 1)} m, {fmt(pSel.y, 1)} m). Desplazamiento ahora: {fmt(campoOndas(pSel.x, pSel.y, s.t, s.fuentes, s.v), 2)} cm.</p>
          <button className="btn err med completo" style={{ marginTop: 10 }} onClick={() => { s.sondas = s.sondas.filter((p) => p.id !== pSel.id); setSel(null); }}>Quitar la sonda</button>
        </>) : null}
        <div className="lab-nota"><b>Qué está pasando</b>
          <p>Cada fuente emite ondas circulares que avanzan a v = λ·f. Donde se encuentran se suman: azul es una cresta y naranja un valle.</p>
          {d12 !== null ? <p>Tus dos fuentes están a {fmt(d12, 2)} m ({fmt(d12 / lam(dosF[0].f), 1)} longitudes de onda). Con la misma fase hay refuerzo donde la diferencia de distancias es un número entero de λ, y cancelación donde es media λ.</p> : null}</div>
      </aside>
    </div>
  );
}

function Alterna() {
  const [Vmax, setV] = useState(170), [R, setR] = useState(100), [f, setF] = useState(60), [mAgua, setM] = useState(1), [activo, setActivo] = useState(true);
  const t = useTiempo(activo, 1);
  const d = alterna({ Vmax, R }), ciclos = 3, Wo = 640, Ho = 300, X = (u) => 40 + u * (Wo - 60), u0 = (t / 4) % 1;
  const v = (u) => Vmax * Math.sin(2 * Math.PI * ciclos * u), Yv = (x) => 78 - (x / 170) * 56, Yi = (x) => 160 - (x / d.Imax) * 40, Pmx = 170 * 170 / 50, Yp = (x) => 280 - (x / Pmx) * 70;
  const trazo = (fn) => Array.from({ length: 241 }, (_, i) => `${X(i / 240).toFixed(1)},${fn(i / 240).toFixed(1)}`).join(" ");
  const dTminuto = (d.Pm * 60) / (mAgua * 4186);
  return (
    <div className="lab-grid ondas">
      <aside className="tarjeta lab-paleta">
        <h3>Piezas</h3>
        <div className="lab-sec">Generador de corriente alterna</div>
        <Ctl etiqueta="Voltaje máximo" valor={Vmax} set={setV} min={5} max={170} unidad="V" />
        <Ctl etiqueta="Frecuencia" valor={f} set={setF} min={1} max={120} unidad="Hz" />
        <div className="lab-sec">Resistencia</div>
        <Ctl etiqueta="Valor" valor={R} set={setR} min={10} max={200} paso={5} unidad="Ω" />
        <div className="lab-sec">Agua que se calienta</div>
        <Ctl etiqueta="Masa de agua" valor={mAgua} set={setM} min={0.2} max={3} paso={0.1} dec={1} unidad="kg" />
        <button className="btn lab-add" style={{ marginTop: 8 }} onClick={() => setActivo(!activo)}>{activo ? "⏸ Pausar" : "▶ Reanudar"}</button>
      </aside>
      <div className="lab-centro">
        <div className="tarjeta lab-grafica">
          <svg viewBox="0 0 640 110" className="esc-svg" role="img" aria-label="Circuito de corriente alterna">
            <rect x={30} y={20} width={60} height={70} rx={8} fill="var(--elec-suave)" stroke="var(--elec-oscuro)" strokeWidth="3" /><path d="M42 55c6 -18 12 -18 18 0s12 18 18 0" fill="none" stroke="var(--elec-oscuro)" strokeWidth="3" /><text x={60} y={104} textAnchor="middle" className="esc-peq">{Vmax} V · {f} Hz</text>
            <path d="M90 35H260M90 75H260M380 35H500M380 75H500" className="esc-cable" /><path d="M260 55l10 -20l14 40l14 -40l14 40l14 -40l14 40l10 -20" fill="none" stroke="#E5502F" strokeWidth="5" strokeLinejoin="round" />
            <path d="M500 35V75" className="esc-cable" /><text x={320} y={100} textAnchor="middle" className="esc-peq">Resistencia {R} Ω</text>
            <text x={560} y={48} textAnchor="middle" className="esc-num" style={{ fill: "var(--p)" }}>P media</text><text x={560} y={72} textAnchor="middle" className="esc-num" style={{ fill: "var(--p)" }}>{fmt(d.Pm, 1)} W</text>
          </svg>
        </div>
        <div className="zona-fis lab-mesa">
          <svg viewBox={`0 0 ${Wo} ${Ho}`} className="esc-svg" role="img" aria-label="Osciloscopio de corriente alterna">
            <text x={42} y={16} className="esc-peq">Voltaje v(t)</text><line x1={40} x2={Wo - 20} y1={Yv(0)} y2={Yv(0)} className="esc-rej" />
            {[-1, 1].map((q) => <line key={q} x1={40} x2={Wo - 20} y1={Yv(q * d.Vrms)} y2={Yv(q * d.Vrms)} className="esc-guia" />)}
            <polyline points={trazo((u) => Yv(v(u)))} className="esc-onda azul" /><circle cx={X(u0)} cy={Yv(v(u0))} r={6} fill="var(--error)" />
            <text x={42} y={122} className="esc-peq">Corriente i(t) = v/R · máx {fmt(d.Imax * 1000, 0)} mA · eficaz {fmt(d.Irms * 1000, 0)} mA</text><line x1={40} x2={Wo - 20} y1={Yi(0)} y2={Yi(0)} className="esc-rej" />
            <polyline points={trazo((u) => Yi(v(u) / R))} className="esc-onda naranja" /><circle cx={X(u0)} cy={Yi(v(u0) / R)} r={6} fill="var(--error)" />
            <text x={42} y={212} className="esc-peq">Potencia p(t) = v²/R · media {fmt(d.Pm, 1)} W · máxima {fmt(d.Pmax, 1)} W</text><line x1={40} x2={Wo - 20} y1={Yp(0)} y2={Yp(0)} className="esc-rej" /><line x1={40} x2={Wo - 20} y1={Yp(d.Pm)} y2={Yp(d.Pm)} className="esc-guia" />
            <polyline points={trazo((u) => Yp((v(u) ** 2) / R))} className="esc-onda" /><circle cx={X(u0)} cy={Yp((v(u0) ** 2) / R)} r={6} fill="var(--error)" />
            <text x={Wo / 2} y={Ho - 4} textAnchor="middle" className="esc-peq">3 ciclos de la señal (duran {fmt(3000 / f, 0)} ms en la realidad)</text>
          </svg>
        </div>
      </div>
      <aside className="tarjeta lab-insp">
        <h3>Lecturas</h3>
        <div className="fis-datos"><div className="fis-dato" style={{ borderTopColor: "var(--v)" }}><span>Voltaje eficaz</span><b style={{ color: "var(--v)" }}>{fmt(d.Vrms, 1)} V</b><small>Vmax / √2</small></div>
          <div className="fis-dato" style={{ borderTopColor: "var(--i)" }}><span>Corriente eficaz</span><b style={{ color: "var(--i)" }}>{fmt(d.Irms * 1000, 0)} mA</b><small>Vrms / R</small></div>
          <div className="fis-dato" style={{ borderTopColor: "var(--p)" }}><span>Potencia media</span><b style={{ color: "var(--p)" }}>{fmt(d.Pm, 1)} W</b><small>Vrms² / R</small></div></div>
        <div className="lab-nota"><b>De la onda al calor</b><p>Si esa resistencia está dentro de {fmt(mAgua, 1)} kg de agua, cada minuto entrega {fmt(d.Pm * 60 / 1000, 1)} kJ y el agua sube unos {fmt(dTminuto, 2)} °C (ΔT = P·t / m·c).</p></div>
      </aside>
    </div>
  );
}

export default function LabOndas({ ir }) {
  const [tab, setTab] = useState("cubeta");
  return (
    <div className="ini">
      <div className="ini-cont lab-cont">
        <Cabecera ir={ir} atras={["Simuladores", "← Simuladores"]} otra="LabCalor" nombreOtra="← Simulador de calor" />
        <section className="fis-pg">
          <h1 className="ruta-t">Laboratorio de ondas</h1>
          <p className="ruta-sub">Coloca fuentes de ondas y sondas en una cubeta, o conecta un generador de corriente alterna a una resistencia y mide con un osciloscopio.</p>
          <Pestanas activa={tab} set={setTab} items={[["cubeta", "Cubeta de ondas"], ["ca", "Corriente alterna"]]} />
          {tab === "cubeta" ? <Cubeta key="c" /> : <Alterna key="a" />}
        </section>
      </div>
    </div>
  );
}
