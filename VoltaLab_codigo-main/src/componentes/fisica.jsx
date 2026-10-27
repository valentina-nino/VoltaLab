import { useEffect, useRef, useState } from "react";
export { fmt, fmtE, colorT } from "../lib/formatoFis.js";
import { fmt } from "../lib/formatoFis.js";

export const reducido = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

// Reloj de animación: devuelve el tiempo (s) escalado por `vel` mientras `activo` es verdadero.
export function useTiempo(activo, vel) {
  const [t, setT] = useState(0), acum = useRef(0), v = useRef(vel);
  v.current = vel;
  useEffect(() => {
    if (!activo) return undefined;
    let id, ant = performance.now();
    const paso = (ahora) => { acum.current += ((ahora - ant) / 1000) * v.current; ant = ahora; setT(acum.current); id = requestAnimationFrame(paso); };
    id = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(id);
  }, [activo]);
  return t;
}

export function Reloj({ activo, setActivo, vel, setVel }) {
  return (
    <div className="fis-reloj">
      <button className="btn sm" onClick={() => setActivo(!activo)}>{activo ? "⏸ Pausar" : "▶ Reanudar"}</button>
      {[[1, "Normal"], [0.25, "Cámara lenta"]].map(([x, t]) => <button key={x} className={`btn sm ${vel === x ? "activo" : ""}`} onClick={() => setVel(x)}>{t}</button>)}
    </div>
  );
}

export function Cabecera({ ir, otra, nombreOtra, atras = ["Ruta", "← Aprender"] }) {
  return (
    <header className="ini-nav">
      <button className="ini-link" onClick={() => ir(atras[0])}>{atras[1]}</button>
      <nav>
        {otra ? <button className="ini-link" onClick={() => ir(otra)}>{nombreOtra}</button> : null}
        <button className="ini-link" onClick={() => ir("Inicio")}>Inicio</button>
      </nav>
    </header>
  );
}
export function Pestanas({ items, activa, set }) {
  return (
    <div className="fis-tabs" role="tablist">
      {items.map(([id, t]) => <button key={id} role="tab" aria-selected={activa === id} className={activa === id ? "on" : ""} onClick={() => set(id)}>{t}</button>)}
    </div>
  );
}
export function Ctl({ etiqueta, valor, set, min, max, paso = 1, unidad = "", dec = 0 }) {
  return (
    <label className="fis-ctl">
      <span>{etiqueta}</span><b>{fmt(valor, dec)} {unidad}</b>
      <input type="range" min={min} max={max} step={paso} value={valor} onChange={(e) => set(+e.target.value)} />
    </label>
  );
}
export function Dato({ t, v, color = "var(--acento)", nota }) {
  return <div className="fis-dato" style={{ borderTopColor: color }}><span>{t}</span><b style={{ color }}>{v}</b>{nota ? <small>{nota}</small> : null}</div>;
}
export function Pasos({ lineas }) {
  return <div className="fis-pasos">{lineas.map((l, i) => <div key={i} className={i === lineas.length - 1 ? "fuerte" : ""}>{l}</div>)}</div>;
}
