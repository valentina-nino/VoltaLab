import { useEffect, useReducer, useRef, useState } from "react";
import "../fisica.css";
import { Cabecera, Ctl, fmt, fmtE, colorT } from "../componentes/fisica.jsx";
import { Termo, Vaso, Bloque } from "../componentes/EscenasFisica.jsx";
import { IconoFis } from "../componentes/IconosFisica.jsx";
import { Switch } from "../componentes/ui.jsx";
import { TIPOS_CUERPO, RECIPIENTES, crearCuerpo, estadoCuerpo, nuevoLab, pasoLab, cambiarMasa, fijarTemperatura, potenciaFuente, aportarCalor, ejemploLab } from "../lib/fisicaLab.js";

const COLORES = ["#D0493F", "#246B8E", "#4D876C", "#8A5CC7", "#C98A00", "#12A4C4"];
const PIEZAS_CUERPO = [["agua", "Vaso con agua"], ["hielo", "Hielo"], ["aceite", "Vaso con aceite"], ["aluminio", "Bloque de aluminio"], ["hierro", "Bloque de hierro"], ["cobre", "Bloque de cobre"], ["plomo", "Bloque de plomo"]];
const VELS = [[1, "×1"], [10, "×10"], [60, "×60"], [300, "×300"]];
const FASES = { hielo: "sólido (hielo)", fusion: "fundiéndose", agua: "líquido", vaporizacion: "hirviendo", vapor: "vapor", solido: "sólido" };
const MAX_CUERPOS = 6;
const tiempo = (s) => (s < 60 ? `${fmt(s, 0)} s` : `${Math.floor(s / 60)} min ${fmt(s % 60, 0)} s`);

function Cuerpo({ c, x, sel, onSel, tAnim }) {
  const est = estadoCuerpo(c), def = TIPOS_CUERPO[c.tipo], T = est.T;
  const fase = def.fase ? est.fase : "solido";
  const nivel = c.tipo === "hielo" || fase === "hielo" ? 0 : fase === "fusion" ? 0.25 + 0.4 * est.frac : 0.3 + 0.12 * Math.min(c.m, 3);
  const vapor = fase === "vapor" || fase === "vaporizacion";
  return (
    <g onClick={() => onSel({ t: "cuerpo", id: c.id })} className="lab-pieza" style={{ cursor: "pointer" }}>
      {sel ? <rect x={x - 8} y={18} width={110} height={182} rx={12} className="lab-sel" /> : null}
      {def.forma === "bloque"
        ? <Bloque x={x + 4} y={96} w={78} h={62} mat={c.tipo} T={T} />
        : <Vaso x={x} y={72} w={90} h={100} nivel={vapor ? 0.25 : nivel} T={T} hielo={fase === "hielo" || fase === "fusion" ? 1 : 0} />}
      {vapor ? [0, 1, 2].map((k) => { const ph = (tAnim * 0.4 + k / 3) % 1; return <path key={k} d={`M${x + 22 + k * 22} ${70 - ph * 40} c6 -8 -6 -14 0 -22`} stroke="#9AA9B8" strokeWidth="3" fill="none" opacity={1 - ph} strokeLinecap="round" />; }) : null}
      <text x={x + 45} y={192} textAnchor="middle" className="esc-peq">{def.nombre}</text><text x={x + 45} y={206} textAnchor="middle" className="esc-peq">{fmt(c.m, 2)} kg</text>
      <text x={x + 45} y={50} textAnchor="middle" className="esc-num" style={{ fill: colorT(T) }}>{fmt(T, 1)} °C</text>
      {fase === "fusion" || fase === "vaporizacion" ? <text x={x + 45} y={64} textAnchor="middle" className="esc-peq" style={{ fill: "var(--error)" }}>{FASES[fase]} {fmt(est.frac * 100, 0)} %</text> : null}
    </g>
  );
}
function Fuente({ f, x, sel, onSel, tAnim }) {
  const P = potenciaFuente(f);
  return (
    <g onClick={() => onSel({ t: "fuente", id: f.id })} style={{ cursor: "pointer" }}>
      {sel ? <rect x={x - 6} y={206} width={96} height={64} rx={10} className="lab-sel" /> : null}
      {f.tipo === "mechero"
        ? <g><rect x={x + 26} y={244} width={30} height={18} rx={4} fill="#6B7684" />{f.on ? [0, 1, 2].map((k) => <path key={k} d={`M${x + 32 + k * 9} 244 c-8 -10 -3 -22 2 -30 c3 8 10 12 6 22 c-1 4 -4 6 -8 8z`} fill={k === 1 ? "#FFD866" : "#F29D1B"} transform={`translate(0 ${Math.sin(tAnim * 9 + k) * 1.5})`} />) : null}</g>
        : <path d={`M${x + 4} 240 l10 -16 l12 32 l12 -32 l12 32 l12 -32 l10 16`} fill="none" stroke={f.on ? "#E5502F" : "#9AA9B8"} strokeWidth="5" strokeLinejoin="round" />}
      <text x={x + 42} y={278} textAnchor="middle" className="esc-peq">{f.tipo === "mechero" ? "Mechero" : "Calentador"} {f.on ? `· ${fmt(P, 0)} W` : "· apagado"}</text>
    </g>
  );
}

export default function LabCalor({ ir }) {
  const lab = useRef(null);
  if (!lab.current) lab.current = ejemploLab("calorimetro");
  const L = lab.current, [, bump] = useReducer((x) => x + 1, 0);
  const [corre, setCorre] = useState(true), [vel, setVel] = useState(60), [rec, setRec] = useState("A"), [sel, setSel] = useState(null);
  const aport = useRef(0), ultMuestra = useRef(-1);
  const cuenta = () => { L.contador = (L.contador || 0) + 1; return L.contador; };

  useEffect(() => {
    if (!corre) return undefined;
    let id, ant = performance.now();
    const paso = (ahora) => {
      const real = Math.min(0.1, (ahora - ant) / 1000); ant = ahora;
      const dt = real * vel, M = lab.current; // el laboratorio puede cambiar (ejemplos, vaciar la mesa): se lee en cada cuadro
      aport.current += aportarCalor(M, dt); pasoLab(M, dt);
      if (M.t - ultMuestra.current >= Math.max(0.5, vel * 0.1)) {
        ultMuestra.current = M.t; M.historial.push({ t: M.t, T: Object.fromEntries(M.termometros.map((tm) => { const c = M.cuerpos.find((x) => x.id === tm.objetivo); return [tm.id, c ? estadoCuerpo(c).T : null]; })) });
        if (M.historial.length > 700) M.historial = M.historial.filter((_, i) => i % 2 === 0);
      }
      bump(); id = requestAnimationFrame(paso);
    };
    id = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line
  }, [corre, vel]);

  const cuerpoSel = sel && sel.t === "cuerpo" ? L.cuerpos.find((c) => c.id === sel.id) : null;
  const fuenteSel = sel && sel.t === "fuente" ? L.fuentes.find((f) => f.id === sel.id) : null;
  const termoSel = sel && sel.t === "termo" ? L.termometros.find((t) => t.id === sel.id) : null;
  const objetivoPorDefecto = () => (cuerpoSel ? cuerpoSel.id : (L.cuerpos.find((c) => c.rec === rec) || L.cuerpos[0] || {}).id);
  const addCuerpo = (tipo) => { if (L.cuerpos.length >= MAX_CUERPOS) return; if (L.cuerpos.filter((c) => c.rec === rec).length >= 3) return; const c = crearCuerpo(tipo, { rec }); c.id = `c${cuenta()}`; L.cuerpos.push(c); setSel({ t: "cuerpo", id: c.id }); bump(); };
  const addFuente = (tipo) => { const o = objetivoPorDefecto(); if (!o) return; const f = { id: `f${cuenta()}`, tipo, V: 120, R: 24, eta: 0.9, W: 500, objetivo: o, on: true }; L.fuentes.push(f); setSel({ t: "fuente", id: f.id }); bump(); };
  const addTermo = () => { const o = objetivoPorDefecto(); if (!o || L.termometros.length >= 6) return; const t = { id: `t${cuenta()}`, objetivo: o }; L.termometros.push(t); setSel({ t: "termo", id: t.id }); bump(); };
  const quitarCuerpo = (id) => { L.cuerpos = L.cuerpos.filter((c) => c.id !== id); L.fuentes = L.fuentes.filter((f) => f.objetivo !== id); L.termometros = L.termometros.filter((t) => t.objetivo !== id); setSel(null); bump(); };
  const cargar = (n) => { lab.current = ejemploLab(n); aport.current = 0; ultMuestra.current = -1; setSel(null); bump(); };
  const vaciar = () => { lab.current = nuevoLab(); lab.current.contador = 10; aport.current = 0; ultMuestra.current = -1; setSel(null); bump(); };
  const nombreCuerpo = (id) => { const c = L.cuerpos.find((x) => x.id === id); return c ? `${TIPOS_CUERPO[c.tipo].nombre} (${c.rec})` : "—"; };

  // gráfica
  const W = 900, Hg = 190, ml = 52, mr = 14, mt = 12, mb = 28;
  const H = L.historial, tmax = Math.max(60, L.t), series = L.termometros.map((tm, i) => ({ tm, col: COLORES[i % COLORES.length] }));
  const vals = H.flatMap((h) => series.map((s) => h.T[s.tm.id]).filter((x) => x != null));
  const Tmin = Math.min(0, ...vals, -5), Tmax = Math.max(100, ...vals);
  const X = (t) => ml + (t / tmax) * (W - ml - mr), Y = (T) => Hg - mb - ((T - Tmin) / (Tmax - Tmin)) * (Hg - mb - mt);

  const zonaX = { A: 14, B: 310, C: 606 };
  const idx = {}; const posX = (c) => { idx[c.rec] = (idx[c.rec] ?? -1) + 1; return zonaX[c.rec] + 14 + idx[c.rec] * 96; };

  return (
    <div className="ini">
      <div className="ini-cont lab-cont">
        <Cabecera ir={ir} atras={["Simuladores", "← Simuladores"]} otra="LabOndas" nombreOtra="Simulador de ondas →" />
        <section className="fis-pg">
          <h1 className="ruta-t">Laboratorio de calor</h1>
          <p className="ruta-sub">Coloca cuerpos en los recipientes, enciende un calentador o un mechero y mide con termómetros. Los cuerpos de un mismo recipiente intercambian calor; el agua cambia de fase de verdad.</p>
          <div className="lab-grid">
            <aside className="tarjeta lab-paleta">
              <h3>Piezas</h3>
              <label className="lab-rec">Colocar en el recipiente
                <span className="fis-chips">{RECIPIENTES.map((r) => <button key={r} className={rec === r ? "on" : ""} onClick={() => setRec(r)}>{r}</button>)}</span></label>
              <div className="lab-sec">Cuerpos</div>
              {PIEZAS_CUERPO.map(([k, t]) => <button key={k} className="btn lab-add" onClick={() => addCuerpo(k)}>＋ {t}</button>)}
              <div className="lab-sec">Fuentes de calor</div>
              <button className="btn lab-add" onClick={() => addFuente("calentador")}>＋ Calentador eléctrico</button>
              <button className="btn lab-add" onClick={() => addFuente("mechero")}>＋ Mechero</button>
              <div className="lab-sec">Medición</div>
              <button className="btn lab-add" onClick={addTermo}>＋ Termómetro</button>
              <div className="lab-sec">Ejemplos</div>
              <button className="btn lab-add" onClick={() => cargar("calorimetro")}>Calorímetro: cobre en agua</button>
              <button className="btn lab-add" onClick={() => cargar("hervir")}>Hervir agua con calentador</button>
              <button className="btn lab-add" onClick={() => cargar("hielo")}>Hielo, mechero y metales</button>
              <button className="btn lab-add err" onClick={vaciar}>Vaciar la mesa</button>
            </aside>
            <div className="lab-centro">
              <div className="tarjeta lab-barra">
                <button className="btn prim med" onClick={() => setCorre(!corre)}>{corre ? "⏸ Pausar" : "▶ Simular"}</button>
                <span className="lab-vel">Velocidad {VELS.map(([v, t]) => <button key={v} className={`btn sm ${vel === v ? "activo" : ""}`} onClick={() => setVel(v)}>{t}</button>)}</span>
                <span className="lab-tiempo">t = {tiempo(L.t)}</span>
                <span className="lab-tiempo">Calor aportado: {fmtE(aport.current)}</span>
                <label className="lab-amb">Ambiente {fmt(L.Tamb, 0)} °C <input type="range" min={5} max={35} value={L.Tamb} onChange={(e) => { L.Tamb = +e.target.value; bump(); }} /></label>
              </div>
              <div className="zona-fis lab-mesa">
                <svg viewBox="0 0 900 300" className="esc-svg" role="img" aria-label="Mesa de laboratorio de calor">
                  {RECIPIENTES.map((r) => (
                    <g key={r}>
                      <rect x={zonaX[r] - 6} y={8} width={284} height={284} rx={14} className={`lab-zona ${L.aislado[r] ? "aislado" : ""}`} />
                      <text x={zonaX[r] + 6} y={28} className="esc-num">Recipiente {r}</text>
                      <text x={zonaX[r] + 270} y={28} textAnchor="end" className="esc-peq">{L.aislado[r] ? "aislado" : "con pérdidas"}</text>
                    </g>))}
                  {L.cuerpos.map((c) => <Cuerpo key={c.id} c={c} x={posX(c)} sel={cuerpoSel && cuerpoSel.id === c.id} onSel={setSel} tAnim={L.t} />)}
                  {L.fuentes.map((f) => { const c = L.cuerpos.find((x) => x.id === f.objetivo); if (!c) return null; const i = L.cuerpos.filter((x) => x.rec === c.rec).findIndex((x) => x.id === c.id); return <Fuente key={f.id} f={f} x={zonaX[c.rec] + 14 + i * 96 + 2} sel={fuenteSel && fuenteSel.id === f.id} onSel={setSel} tAnim={L.t} />; })}
                  {L.termometros.map((tm, k) => { const c = L.cuerpos.find((x) => x.id === tm.objetivo); if (!c) return null; const i = L.cuerpos.filter((x) => x.rec === c.rec).findIndex((x) => x.id === c.id);
                    return <g key={tm.id} onClick={() => setSel({ t: "termo", id: tm.id })} style={{ cursor: "pointer" }}><Termo x={zonaX[c.rec] + 78 + i * 96} y={100} T={estadoCuerpo(c).T} etiqueta="" alto={58} sinTexto color={COLORES[k % COLORES.length]} /></g>; })}
                  {!L.cuerpos.length ? <text x={450} y={160} textAnchor="middle" className="esc-peq">Agrega cuerpos desde el panel de piezas.</text> : null}
                </svg>
              </div>
              <div className="tarjeta lab-grafica">
                <svg viewBox={`0 0 ${W} ${Hg}`} className="esc-svg" role="img" aria-label="Temperatura contra tiempo">
                  {[0, 100].map((T) => <g key={T}><line x1={ml} x2={W - mr} y1={Y(T)} y2={Y(T)} className="esc-rej" /><text x={ml - 6} y={Y(T) + 4} textAnchor="end" className="esc-peq">{T} °C</text></g>)}
                  <line x1={ml} x2={ml} y1={mt} y2={Hg - mb} className="esc-eje" /><line x1={ml} x2={W - mr} y1={Hg - mb} y2={Hg - mb} className="esc-eje" />
                  {series.map(({ tm, col }) => { const pts = H.filter((h) => h.T[tm.id] != null).map((h) => `${X(h.t).toFixed(1)},${Y(h.T[tm.id]).toFixed(1)}`).join(" "); return pts ? <polyline key={tm.id} points={pts} fill="none" stroke={col} strokeWidth="3" strokeLinejoin="round" /> : null; })}
                  <text x={W / 2} y={Hg - 6} textAnchor="middle" className="esc-peq">Tiempo (hasta {tiempo(tmax)})</text>
                  {!series.length ? <text x={W / 2} y={Hg / 2} textAnchor="middle" className="esc-peq">Agrega un termómetro para registrar la temperatura de un cuerpo.</text> : null}
                </svg>
                <div className="lab-leyenda">{series.map(({ tm, col }) => <span key={tm.id}><i style={{ background: col }} />{nombreCuerpo(tm.objetivo)}</span>)}</div>
              </div>
            </div>
            <aside className="tarjeta lab-insp">
              <h3>Pieza seleccionada</h3>
              {!sel ? <p className="fis-peq">Toca un cuerpo, una fuente o un termómetro de la mesa para editarlo. Cada cuerpo tiene su masa y su temperatura.</p> : null}
              {cuerpoSel ? (<>
                <p className="lab-nom"><IconoFis tipo="termometro" w={40} h={22} /> {TIPOS_CUERPO[cuerpoSel.tipo].nombre}</p>
                <Ctl etiqueta="Masa" valor={cuerpoSel.m} set={(m) => { cambiarMasa(cuerpoSel, m); bump(); }} min={0.05} max={5} paso={0.05} dec={2} unidad="kg" />
                <Ctl etiqueta="Poner a la temperatura" valor={Math.max(-40, Math.min(200, Math.round(estadoCuerpo(cuerpoSel).T)))} set={(T) => { fijarTemperatura(cuerpoSel, T); bump(); }} min={-40} max={200} unidad="°C" />
                <label className="lab-rec">Recipiente <span className="fis-chips">{RECIPIENTES.map((r) => <button key={r} className={cuerpoSel.rec === r ? "on" : ""} onClick={() => { cuerpoSel.rec = r; bump(); }}>{r}</button>)}</span></label>
                <p className="fis-peq">Estado: {FASES[TIPOS_CUERPO[cuerpoSel.tipo].fase ? estadoCuerpo(cuerpoSel).fase : "solido"]} · c = {TIPOS_CUERPO[cuerpoSel.tipo].c} J/(kg·K)</p>
                <Switch chico on={!!L.aislado[cuerpoSel.rec]} onChange={(v) => { L.aislado[cuerpoSel.rec] = v; bump(); }}>Recipiente {cuerpoSel.rec} aislado</Switch>
                <button className="btn err med completo" style={{ marginTop: 10 }} onClick={() => quitarCuerpo(cuerpoSel.id)}>Quitar este cuerpo</button>
              </>) : null}
              {fuenteSel ? (<>
                <p className="lab-nom"><IconoFis tipo="joule" w={40} h={22} /> {fuenteSel.tipo === "mechero" ? "Mechero" : "Calentador eléctrico"}</p>
                {fuenteSel.tipo === "calentador" ? (<>
                  <Ctl etiqueta="Voltaje" valor={fuenteSel.V} set={(V) => { fuenteSel.V = V; bump(); }} min={5} max={240} unidad="V" />
                  <Ctl etiqueta="Resistencia" valor={fuenteSel.R} set={(R) => { fuenteSel.R = R; bump(); }} min={5} max={200} unidad="Ω" />
                  <Ctl etiqueta="Eficiencia" valor={Math.round(fuenteSel.eta * 100)} set={(e) => { fuenteSel.eta = e / 100; bump(); }} min={50} max={100} unidad="%" />
                  <p className="fis-peq">P = V²/R = {fmt((fuenteSel.V ** 2) / fuenteSel.R, 0)} W · útil {fmt(potenciaFuente(fuenteSel), 0)} W</p>
                </>) : <Ctl etiqueta="Potencia" valor={fuenteSel.W} set={(W) => { fuenteSel.W = W; bump(); }} min={100} max={3000} paso={50} unidad="W" />}
                <label className="lab-rec">Calienta a <select value={fuenteSel.objetivo} onChange={(e) => { fuenteSel.objetivo = e.target.value; bump(); }}>{L.cuerpos.map((c) => <option key={c.id} value={c.id}>{nombreCuerpo(c.id)}</option>)}</select></label>
                <Switch chico on={fuenteSel.on} onChange={(v) => { fuenteSel.on = v; bump(); }}>Encendido</Switch>
                <button className="btn err med completo" style={{ marginTop: 10 }} onClick={() => { L.fuentes = L.fuentes.filter((f) => f.id !== fuenteSel.id); setSel(null); bump(); }}>Quitar la fuente</button>
              </>) : null}
              {termoSel ? (<>
                <p className="lab-nom"><IconoFis tipo="calor" w={40} h={22} /> Termómetro</p>
                <label className="lab-rec">Mide a <select value={termoSel.objetivo} onChange={(e) => { termoSel.objetivo = e.target.value; bump(); }}>{L.cuerpos.map((c) => <option key={c.id} value={c.id}>{nombreCuerpo(c.id)}</option>)}</select></label>
                <button className="btn err med completo" style={{ marginTop: 10 }} onClick={() => { L.termometros = L.termometros.filter((t) => t.id !== termoSel.id); setSel(null); bump(); }}>Quitar el termómetro</button>
              </>) : null}
              <div className="lab-nota"><b>Qué está pasando</b><p>Dentro de cada recipiente, el calor fluye del cuerpo más caliente al más frío. Las fuentes aportan P·t. Si un recipiente no está aislado, también pierde calor hacia el ambiente.</p></div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
