import { useEffect, useRef, useState } from "react";
import "../fisica.css";
import { Cabecera, Pestanas, Ctl, Dato, Pasos, fmt } from "../componentes/fisica.jsx";
import { derivadas, onda, ampSuma, tipoInterferencia, alterna } from "../lib/ondas.js";
import Hub from "../componentes/HubFisica.jsx";

const reducido = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
function useTiempo(activo, vel) {
  const [t, setT] = useState(0), acum = useRef(0), v = useRef(vel);
  v.current = vel;
  useEffect(() => {
    if (!activo) return;
    let id, ant = performance.now();
    const paso = (ahora) => { acum.current += ((ahora - ant) / 1000) * v.current; ant = ahora; setT(acum.current); id = requestAnimationFrame(paso); };
    id = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(id);
  }, [activo]);
  return t;
}
function Reloj({ activo, setActivo, vel, setVel }) {
  return (
    <div className="fis-reloj">
      <button className="btn prim" onClick={() => setActivo(!activo)}>{activo ? "Pausar" : "Reanudar"}</button>
      {[1, 0.25].map((x) => <button key={x} className={`btn ${vel === x ? "prim" : ""}`} onClick={() => setVel(x)}>{x === 1 ? "Normal" : "Cámara lenta"}</button>)}
    </div>
  );
}
const trazo = (n, f) => Array.from({ length: n + 1 }, (_, i) => f(i / n)).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

function Viajera() {
  const [A, setA] = useState(3), [f, setF] = useState(0.8), [lam, setLam] = useState(2), [fase, setFase] = useState(0);
  const [activo, setActivo] = useState(!reducido()), [vel, setVel] = useState(1);
  const t = useTiempo(activo, vel);
  const p = { A, f, lam, fase: (fase * Math.PI) / 180 }, d = derivadas(p);
  const W = 640, H = 220, L = 6, YM = 5;
  const X = (x) => 20 + (x / L) * (W - 40), Y = (y) => H / 2 - (y / YM) * (H / 2 - 18);
  const x0 = (((lam * (f * t + 0.25 - p.fase / (2 * Math.PI))) % lam) + lam) % lam; // posición de una cresta
  const xp = L / 2;
  // gráfica y(t) en un punto (x = 0), 3 periodos
  const W2 = 640, H2 = 170, tw = 3 * d.T, tau = t % tw;
  const X2 = (s) => 20 + (s / tw) * (W2 - 40), Y2 = (y) => H2 / 2 - (y / YM) * (H2 / 2 - 14);
  const y2 = (s) => onda(0, s, p);
  return (
    <div className="fis-grid">
      <div className="fis-panel">
        <h3>Onda viajera</h3>
        <Ctl etiqueta="Amplitud A" valor={A} set={setA} min={0.5} max={5} paso={0.5} dec={1} unidad="cm" />
        <Ctl etiqueta="Frecuencia f" valor={f} set={setF} min={0.2} max={3} paso={0.1} dec={1} unidad="Hz" />
        <Ctl etiqueta="Longitud de onda λ" valor={lam} set={setLam} min={0.5} max={3} paso={0.1} dec={1} unidad="m" />
        <Ctl etiqueta="Fase inicial φ" valor={fase} set={setFase} min={0} max={360} paso={15} unidad="°" />
        <Reloj activo={activo} setActivo={setActivo} vel={vel} setVel={setVel} />
        <div className="fis-datos">
          <Dato t="Periodo T = 1/f" v={`${fmt(d.T, 2)} s`} color="var(--i)" />
          <Dato t="Velocidad v = λ·f" v={`${fmt(d.v, 2)} m/s`} color="var(--p)" />
          <Dato t="ω = 2πf" v={`${fmt(d.w, 2)} rad/s`} color="var(--v)" />
          <Dato t="k = 2π/λ" v={`${fmt(d.k, 2)} rad/m`} color="var(--exito)" />
        </div>
      </div>
      <div className="fis-panel">
        <p className="fis-peq"><b>En el espacio</b>: la forma de la cuerda en este instante.</p>
        <svg viewBox={`0 0 ${W} ${H}`} className="fis-svg" role="img" aria-label="Onda en el espacio">
          <line x1={20} x2={W - 20} y1={Y(0)} y2={Y(0)} className="eje" />
          <line x1={20} x2={W - 20} y1={Y(A)} y2={Y(A)} className="rej" /><line x1={20} x2={W - 20} y1={Y(-A)} y2={Y(-A)} className="rej" />
          <text x={W - 22} y={Y(A) - 4} textAnchor="end" className="txt">+A</text><text x={W - 22} y={Y(-A) + 12} textAnchor="end" className="txt">−A</text>
          <polyline points={trazo(240, (u) => [X(u * L), Y(onda(u * L, t, p))])} className="onda" />
          {x0 + lam <= L + 1e-6 ? <g><line x1={X(x0)} x2={X(x0 + lam)} y1={Y(A) - 10} y2={Y(A) - 10} className="med" /><text x={X(x0 + lam / 2)} y={Y(A) - 14} textAnchor="middle" className="txt fuerte">λ</text></g> : null}
          <circle cx={X(xp)} cy={Y(onda(xp, t, p))} r={6} className="punto" />
        </svg>
        <p className="fis-peq"><b>En el tiempo</b>: cómo sube y baja un solo punto (x = 0). El periodo T es lo que tarda en repetirse.</p>
        <svg viewBox={`0 0 ${W2} ${H2}`} className="fis-svg" role="img" aria-label="Onda en el tiempo">
          <line x1={20} x2={W2 - 20} y1={Y2(0)} y2={Y2(0)} className="eje" />
          <polyline points={trazo(240, (u) => [X2(u * tw), Y2(y2(u * tw))])} className="onda t" />
          <line x1={X2(0)} x2={X2(d.T)} y1={H2 - 10} y2={H2 - 10} className="med" /><text x={X2(d.T / 2)} y={H2 - 14} textAnchor="middle" className="txt fuerte">T</text>
          <circle cx={X2(tau)} cy={Y2(y2(tau))} r={6} className="punto" />
        </svg>
        <Pasos lineas={["y(x, t) = A · sen(2π(x/λ − f·t) + φ)", `v = λ · f = ${fmt(lam, 1)} × ${fmt(f, 1)} = ${fmt(d.v, 2)} m/s`]} />
      </div>
    </div>
  );
}

function Suma() {
  const [A1, setA1] = useState(2), [A2, setA2] = useState(2), [dfi, setDfi] = useState(0);
  const [activo, setActivo] = useState(!reducido()), [vel, setVel] = useState(1);
  const t = useTiempo(activo, vel);
  const f = 0.6, lam = 2, W = 640, H = 240, L = 6, YM = 5;
  const X = (x) => 20 + (x / L) * (W - 40), Y = (y) => H / 2 - (y / YM) * (H / 2 - 14);
  const a = { A: A1, f, lam, fase: 0 }, b = { A: A2, f, lam, fase: (dfi * Math.PI) / 180 };
  const suma = (x) => onda(x, t, a) + onda(x, t, b);
  const Ar = ampSuma(A1, A2, (dfi * Math.PI) / 180), tipo = tipoInterferencia(A1, A2, (dfi * Math.PI) / 180);
  return (
    <div className="fis-grid">
      <div className="fis-panel">
        <h3>Superposición e interferencia</h3>
        <Ctl etiqueta="Amplitud onda 1" valor={A1} set={setA1} min={0.5} max={2.5} paso={0.5} dec={1} unidad="cm" />
        <Ctl etiqueta="Amplitud onda 2" valor={A2} set={setA2} min={0.5} max={2.5} paso={0.5} dec={1} unidad="cm" />
        <Ctl etiqueta="Desfase Δφ" valor={dfi} set={setDfi} min={0} max={360} paso={15} unidad="°" />
        <Reloj activo={activo} setActivo={setActivo} vel={vel} setVel={setVel} />
        <div className="fis-datos">
          <Dato t="Amplitud resultante" v={`${fmt(Ar, 2)} cm`} color="var(--p)" />
          <Dato t="Interferencia" v={tipo} color={tipo === "constructiva" ? "var(--exito)" : tipo.startsWith("destructiva") ? "var(--error)" : "var(--adv)"} />
        </div>
      </div>
      <div className="fis-panel">
        <svg viewBox={`0 0 ${W} ${H}`} className="fis-svg" role="img" aria-label="Suma de dos ondas">
          <line x1={20} x2={W - 20} y1={Y(0)} y2={Y(0)} className="eje" />
          <polyline points={trazo(240, (u) => [X(u * L), Y(onda(u * L, t, a))])} className="onda uno" />
          <polyline points={trazo(240, (u) => [X(u * L), Y(onda(u * L, t, b))])} className="onda dos" />
          <polyline points={trazo(240, (u) => [X(u * L), Y(suma(u * L))])} className="onda suma" />
        </svg>
        <div className="fis-leyenda"><span className="uno">Onda 1</span><span className="dos">Onda 2</span><span className="suma">Suma</span></div>
        <Pasos lineas={["y = y₁ + y₂", "A_res = √(A₁² + A₂² + 2·A₁·A₂·cos Δφ)", `A_res = ${fmt(Ar, 2)} cm`]} />
        <p className="fis-peq">Con Δφ = 0° las crestas coinciden y se refuerzan. Con Δφ = 180° una cresta cae sobre un valle y se cancelan (del todo si las amplitudes son iguales).</p>
      </div>
    </div>
  );
}

function Alterna() {
  const [Vmax, setV] = useState(12), [f, setF] = useState(60), [R, setR] = useState(100);
  const [activo, setActivo] = useState(!reducido());
  const t = useTiempo(activo, 1), r = alterna({ Vmax, R });
  const W = 640, H = 230, N = 2, X = (u) => 30 + u * (W - 50), Y = (v) => H / 2 - (v / Vmax) * (H / 2 - 22);
  const u0 = (t * 0.2) % 1, T = 1 / f;
  return (
    <div className="fis-grid">
      <div className="fis-panel">
        <h3>Corriente alterna sobre una resistencia</h3>
        <Ctl etiqueta="Voltaje máximo" valor={Vmax} set={setV} min={1} max={170} unidad="V" />
        <Ctl etiqueta="Frecuencia" valor={f} set={setF} min={1} max={60} unidad="Hz" />
        <Ctl etiqueta="Resistencia R" valor={R} set={setR} min={1} max={1000} unidad="Ω" />
        <div className="fis-reloj"><button className="btn prim" onClick={() => setActivo(!activo)}>{activo ? "Pausar" : "Reanudar"}</button></div>
        <div className="fis-datos">
          <Dato t="Voltaje eficaz" v={`${fmt(r.Vrms, 2)} V`} color="var(--v)" nota="Vmax / √2" />
          <Dato t="Corriente eficaz" v={`${fmt(r.Irms * 1000, 1)} mA`} color="var(--i)" nota={`máxima ${fmt(r.Imax * 1000, 1)} mA`} />
          <Dato t="Potencia media" v={`${fmt(r.Pm, 2)} W`} color="var(--p)" nota={`pico ${fmt(r.Pmax, 2)} W`} />
        </div>
      </div>
      <div className="fis-panel">
        <p className="fis-peq">Se muestran {N} periodos, T = {fmt(T * 1000, 1)} ms (la línea de puntos es el voltaje eficaz). El punto avanza en cámara lenta.</p>
        <svg viewBox={`0 0 ${W} ${H}`} className="fis-svg" role="img" aria-label="Voltaje alterno en el tiempo">
          <line x1={30} x2={W - 20} y1={Y(0)} y2={Y(0)} className="eje" />
          <line x1={30} x2={W - 20} y1={Y(r.Vrms)} y2={Y(r.Vrms)} className="rej" /><line x1={30} x2={W - 20} y1={Y(-r.Vrms)} y2={Y(-r.Vrms)} className="rej" />
          <text x={32} y={Y(Vmax) + 2} className="txt">+{fmt(Vmax, 0)} V</text>
          <polyline points={trazo(300, (u) => [X(u), Y(Vmax * Math.sin(2 * Math.PI * N * u))])} className="onda" />
          <circle cx={X(u0)} cy={Y(Vmax * Math.sin(2 * Math.PI * N * u0))} r={6} className="punto" />
        </svg>
        <Pasos lineas={["v(t) = Vmax · sen(2πft)", "Vrms = Vmax / √2    ·    Irms = Vrms / R", `P media = Vrms² / R = ${fmt(r.Pm, 2)} W`]} />
        <p className="fis-peq">La corriente alterna es una onda: su amplitud es Vmax y su frecuencia, f. La potencia media es la mitad de la de pico, y es la que calienta al bombillo igual que lo haría una batería de Vrms voltios.</p>
      </div>
    </div>
  );
}

export default function Ondas({ ir, progreso }) {
  const [tab, setTab] = useState("viajera");
  const Vista = { viajera: Viajera, suma: Suma, alterna: Alterna }[tab];
  return (
    <div className="ini">
      <div className="ini-cont">
        <Cabecera ir={ir} otra="Calor" nombreOtra="← Calor" />
        <section className="fis-pg">
          <h1 className="ruta-t">Ondas y corriente alterna</h1>
          <p className="ruta-sub">Amplitud, frecuencia, periodo y longitud de onda: cámbialos y mira cómo se mueve la onda, cómo se suman y cómo aparecen en la corriente alterna.</p>
          <Hub modulo="ondas" ir={ir} progreso={progreso} />
          <h2 className="fis-sub">Calculadoras interactivas</h2>
          <Pestanas activa={tab} set={setTab} items={[["viajera", "Onda viajera"], ["suma", "Superposición"], ["alterna", "Corriente alterna"]]} />
          <Vista key={tab} />
        </section>
      </div>
    </div>
  );
}
