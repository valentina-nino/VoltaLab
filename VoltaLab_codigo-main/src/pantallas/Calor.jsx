import { useState } from "react";
import "../fisica.css";
import { Cabecera, Pestanas, Ctl, Dato, Pasos, fmt, fmtE, colorT } from "../componentes/fisica.jsx";
import { MATERIALES, cDe, calor, equilibrio, calentador, curvaAgua } from "../lib/termica.js";
import Hub from "../componentes/HubFisica.jsx";



function Chips({ valor, set }) {
  return <div className="fis-chips">{MATERIALES.map((x) => <button key={x.id} className={valor === x.id ? "on" : ""} onClick={() => set(x.id)}>{x.nombre}</button>)}</div>;
}
function Termometro({ T, etiqueta }) {
  return (
    <div className="fis-termo"><div className="tubo"><i style={{ height: `${Math.max(2, Math.min(100, T))}%`, background: colorT(T) }} /></div><b>{fmt(T, 1)} °C</b><small>{etiqueta}</small></div>
  );
}

function CalorQ() {
  const [mat, setMat] = useState("agua"), [m, setM] = useState(1), [T0, setT0] = useState(20), [Tf, setTf] = useState(60);
  const c = cDe(mat), dT = Tf - T0, q = calor(m, c, dT);
  const todos = MATERIALES.map((x) => ({ ...x, q: calor(m, x.c, dT) }));
  const max = Math.max(...todos.map((x) => Math.abs(x.q)), 1);
  return (
    <div className="fis-grid">
      <div className="fis-panel">
        <h3>Calor sensible</h3>
        <Chips valor={mat} set={setMat} />
        <Ctl etiqueta="Masa" valor={m} set={setM} min={0.1} max={5} paso={0.1} dec={1} unidad="kg" />
        <Ctl etiqueta="Temperatura inicial" valor={T0} set={setT0} min={0} max={100} unidad="°C" />
        <Ctl etiqueta="Temperatura final" valor={Tf} set={setTf} min={0} max={100} unidad="°C" />
        <div className="fis-termos"><Termometro T={T0} etiqueta="inicial" /><span aria-hidden="true">→</span><Termometro T={Tf} etiqueta="final" /></div>
      </div>
      <div className="fis-panel">
        <div className="fis-datos">
          <Dato t="Calor Q" v={fmtE(q)} color="var(--p)" nota={dT === 0 ? "sin cambio de temperatura" : q > 0 ? "el cuerpo absorbe calor" : "el cuerpo cede calor"} />
          <Dato t="Calor específico c" v={`${c} J/(kg·K)`} color="var(--i)" nota="lo que cuesta calentar 1 kg un grado" />
          <Dato t="Variación ΔT" v={`${fmt(dT, 0)} K`} color="var(--v)" />
        </div>
        <Pasos lineas={["Q = m · c · ΔT", `Q = ${fmt(m, 1)} kg × ${c} J/(kg·K) × ${fmt(dT, 0)} K`, `Q = ${fmt(q, 0)} J`]} />
        <h4>Mismo calor, distintos materiales</h4>
        <p className="fis-peq">Con la misma masa y el mismo ΔT, cada material necesita una cantidad distinta de energía.</p>
        <div className="fis-barras">
          {todos.map((x) => (
            <div key={x.id} className={x.id === mat ? "on" : ""}><span>{x.nombre}</span><i><u style={{ width: `${(Math.abs(x.q) / max) * 100}%` }} /></i><b>{fmtE(x.q)}</b></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Cuerpo({ n, e, set }) {
  return (
    <div className="fis-cuerpo">
      <h4>Cuerpo {n}</h4>
      <Chips valor={e.mat} set={(mat) => set({ ...e, mat })} />
      <Ctl etiqueta="Masa" valor={e.m} set={(m) => set({ ...e, m })} min={0.05} max={5} paso={0.05} dec={2} unidad="kg" />
      <Ctl etiqueta="Temperatura" valor={e.T} set={(T) => set({ ...e, T })} min={0} max={100} unidad="°C" />
    </div>
  );
}
function Mezcla() {
  const [a, setA] = useState({ mat: "cobre", m: 0.5, T: 100 }), [b, setB] = useState({ mat: "agua", m: 0.5, T: 20 });
  const A = { m: a.m, c: cDe(a.mat), T: a.T }, B = { m: b.m, c: cDe(b.mat), T: b.T };
  const r = equilibrio(A, B);
  return (
    <div className="fis-grid">
      <div className="fis-panel"><h3>Mezcla de dos cuerpos</h3><Cuerpo n="A" e={a} set={setA} /><Cuerpo n="B" e={b} set={setB} /></div>
      <div className="fis-panel">
        <div className="fis-termos grande">
          <Termometro T={a.T} etiqueta="A al inicio" /><Termometro T={b.T} etiqueta="B al inicio" /><span aria-hidden="true">→</span><Termometro T={r.Tf} etiqueta="equilibrio" />
        </div>
        <div className="fis-datos">
          <Dato t="Temperatura final" v={`${fmt(r.Tf, 1)} °C`} color="var(--acento)" />
          <Dato t="Calor de A" v={fmtE(r.Qa)} color="var(--error)" nota={r.Qa < 0 ? "cede calor" : "absorbe calor"} />
          <Dato t="Calor de B" v={fmtE(r.Qb)} color="var(--v)" nota={r.Qb < 0 ? "cede calor" : "absorbe calor"} />
        </div>
        <Pasos lineas={["Q cedido + Q absorbido = 0", "mₐcₐ(T_f − Tₐ) + m_b c_b (T_f − T_b) = 0", "T_f = (mₐcₐTₐ + m_b c_b T_b) / (mₐcₐ + m_b c_b)", `T_f = ${fmt(r.Tf, 2)} °C`]} />
        <p className="fis-peq">Supone un calorímetro ideal (sin pérdidas) y que el agua no cambia de fase: por eso las temperaturas van de 0 a 100 °C. Fíjate en que el calor que cede uno es el que absorbe el otro.</p>
      </div>
    </div>
  );
}

function Fases() {
  const [m, setM] = useState(1), [T0, setT0] = useState(-20), [Tf, setTf] = useState(120);
  const Tfe = Math.max(Tf, T0 + 1), cv = curvaAgua(m, T0, Tfe);
  const W = 560, H = 240, ml = 44, mb = 28, qmax = cv.Qtotal || 1;
  const X = (Q) => ml + (Q / qmax) * (W - ml - 12), Y = (T) => H - mb - ((T - (-40)) / (150 + 40)) * (H - mb - 12);
  return (
    <div className="fis-grid">
      <div className="fis-panel">
        <h3>Curva de calentamiento del agua</h3>
        <Ctl etiqueta="Masa" valor={m} set={setM} min={0.1} max={2} paso={0.1} dec={1} unidad="kg" />
        <Ctl etiqueta="Temperatura inicial" valor={T0} set={setT0} min={-40} max={110} unidad="°C" />
        <Ctl etiqueta="Temperatura final" valor={Tfe} set={setTf} min={-30} max={150} unidad="°C" />
        <p className="fis-peq">Durante un cambio de fase la temperatura no sube: toda la energía rompe enlaces. Es el calor latente: Q = m · L. Con T inicial = 0 °C se toma como hielo; con 100 °C, como agua líquida.</p>
        <Pasos lineas={["Q = m·c·ΔT   (si cambia la temperatura)", "Q = m·L        (si cambia de fase)", "Lf = 334 kJ/kg · Lv = 2256 kJ/kg"]} />
      </div>
      <div className="fis-panel">
        <svg viewBox={`0 0 ${W} ${H}`} className="fis-svg" role="img" aria-label="Temperatura contra calor aportado">
          {[0, 100].map((T) => <g key={T}><line x1={ml} x2={W - 12} y1={Y(T)} y2={Y(T)} className="rej" /><text x={ml - 6} y={Y(T) + 4} textAnchor="end" className="txt">{T}°</text></g>)}
          <line x1={ml} x2={ml} y1={8} y2={H - mb} className="eje" /><line x1={ml} x2={W - 12} y1={H - mb} y2={H - mb} className="eje" />
          {cv.puntos.slice(1).map((p, i) => { const q0 = cv.puntos[i], t = cv.tramos[i]; return <line key={i} x1={X(q0.Q)} y1={Y(q0.T)} x2={X(p.Q)} y2={Y(p.T)} className={t.tipo === "cambio" ? "meseta" : "rampa"} />; })}
          <text x={W / 2} y={H - 6} textAnchor="middle" className="txt">Calor aportado (kJ)  — total {fmt(cv.Qtotal / 1000, 0)} kJ</text>
        </svg>
        <table className="fis-tabla"><thead><tr><th>Tramo</th><th>De → a</th><th>Calor</th></tr></thead>
          <tbody>{cv.tramos.map((t, i) => <tr key={i} className={t.tipo}><td>{t.nombre}</td><td>{t.tipo === "cambio" ? `${t.T1} °C (constante)` : `${fmt(t.T1, 0)} → ${fmt(t.T2, 0)} °C`}</td><td>{fmtE(t.Q)}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}

function Joule() {
  const [V, setV] = useState(120), [R, setR] = useState(24), [m, setM] = useState(0.5), [T0, setT0] = useState(20), [t, setT] = useState(120), [eta, setEta] = useState(100);
  const r = calentador({ V, R, m, c: 4186, T0, t, eta: eta / 100 });
  const Tmostrada = Math.min(100, r.T);
  return (
    <div className="fis-grid">
      <div className="fis-panel">
        <h3>De la electricidad al calor</h3>
        <Ctl etiqueta="Voltaje" valor={V} set={setV} min={5} max={220} unidad="V" />
        <Ctl etiqueta="Resistencia del calentador" valor={R} set={setR} min={5} max={200} unidad="Ω" />
        <Ctl etiqueta="Masa de agua" valor={m} set={setM} min={0.1} max={2} paso={0.1} dec={1} unidad="kg" />
        <Ctl etiqueta="Temperatura inicial" valor={T0} set={setT0} min={0} max={50} unidad="°C" />
        <Ctl etiqueta="Tiempo encendido" valor={t} set={setT} min={10} max={1200} paso={10} unidad="s" />
        <Ctl etiqueta="Eficiencia" valor={eta} set={setEta} min={50} max={100} unidad="%" />
        <div className="fis-vaso" aria-hidden="true"><div style={{ height: `${40 + m * 25}%`, background: colorT(Tmostrada) }}><svg viewBox="0 0 60 30"><path d="M5 22 C10 4 15 4 20 22 S30 40 35 22 S45 4 55 22" /></svg></div><b>{fmt(Tmostrada, 1)} °C</b></div>
      </div>
      <div className="fis-panel">
        <div className="fis-datos">
          <Dato t="Potencia P = V²/R" v={`${fmt(r.P, 0)} W`} color="var(--p)" nota={`corriente ${fmt(r.I, 2)} A`} />
          <Dato t="Calor útil Q" v={fmtE(r.Q)} color="var(--i)" nota={`${fmt(eta, 0)} % de P·t`} />
          <Dato t="Aumento ΔT" v={`${fmt(r.dT, 1)} K`} color="var(--error)" nota={r.T >= 100 ? "¡llega a hervir!" : `queda a ${fmt(r.T, 1)} °C`} />
        </div>
        <Pasos lineas={["P = V² / R", `P = ${V}² / ${R} = ${fmt(r.P, 0)} W`, "Q = η · P · t = m · c · ΔT", `ΔT = ${fmt(r.Q, 0)} / (${fmt(m, 1)} × 4186) = ${fmt(r.dT, 1)} K`]} />
        <p className="fis-peq">{r.tHierve === Infinity ? "" : `Con estos valores el agua tarda unos ${fmt(r.tHierve, 0)} s (${fmt(r.tHierve / 60, 1)} min) en llegar a 100 °C.`} Si la resistencia fuera la de un bombillo, casi toda esa potencia se vuelve calor: por eso se calientan y, si superan su límite, se funden.</p>
      </div>
    </div>
  );
}

export default function Calor({ ir, progreso }) {
  const [tab, setTab] = useState("q");
  const Vista = { q: CalorQ, mezcla: Mezcla, fases: Fases, joule: Joule }[tab];
  return (
    <div className="ini">
      <div className="ini-cont">
        <Cabecera ir={ir} otra="Ondas" nombreOtra="Ondas →" />
        <section className="fis-pg">
          <h1 className="ruta-t">Calor y calorimetría</h1>
          <p className="ruta-sub">Cuánta energía necesita un cuerpo para calentarse, qué pasa cuando dos cuerpos se mezclan, cómo cambia de fase el agua y cómo la electricidad se convierte en calor.</p>
          <Hub modulo="calor" ir={ir} progreso={progreso} />
          <h2 className="fis-sub">Calculadoras interactivas</h2>
          <Pestanas activa={tab} set={setTab} items={[["q", "Calor Q = m·c·ΔT"], ["mezcla", "Mezclas y equilibrio"], ["fases", "Cambios de fase"], ["joule", "Calentador eléctrico"]]} />
          <Vista key={tab} />
        </section>
      </div>
    </div>
  );
}
