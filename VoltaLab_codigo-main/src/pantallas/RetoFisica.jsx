import { useReducer, useRef } from "react";
import Escena from "../componentes/EscenasFisica.jsx";
import { Ctl, fmt } from "../componentes/fisica.jsx";
import { IconoEstado } from "../componentes/Iconos.jsx";
import { IconoFis } from "../componentes/IconosFisica.jsx";
import { CajaTitulada, BarraPasos, Estrellas } from "../componentes/piezas.jsx";
import * as E from "../lib/estilos.js";
import { NIVELES_FIS, valoresReto, inicialReto, estrellasPorPistas } from "../datos/retosFisica.js";

const COL_NIVEL = { 1: [E.COLOR_EXITO, E.COLOR_EXITO_SUAVE], 2: [E.COLOR_ACENTO, E.COLOR_ACENTO_SUAVE], 3: [E.COLOR_ADVERTENCIA, E.COLOR_ADVERTENCIA_SUAVE] };
const dec = (x) => (Math.abs(x % 1) > 1e-9 ? 2 : 0);

export default function RetoFisica({ reto, etiqueta, onVolver, onCompletar, onSiguiente, onReiniciar, onPista, haySiguiente }) {
  const [, bump] = useReducer((x) => x + 1, 0);
  const S = useRef(null);
  if (!S.current) S.current = { v: inicialReto(reto), pistas: 0, completado: false, estrellas: 0, tocado: false };
  const s = S.current, nivel = reto.nivel, vv = valoresReto(reto, s.v), r = reto.modelo(vv), o = reto.objetivo;
  const meta = Math.abs(r.valor - o.valor) <= o.tol + 1e-9;
  const [colN, fondoN] = COL_NIVEL[nivel], [nomN, descN] = NIVELES_FIS[nivel], guiado = nivel === 1 && !!reto.pasos;

  const cambiar = (id, x) => {
    s.v = { ...s.v, [id]: x }; s.tocado = true;
    const rr = reto.modelo(valoresReto(reto, s.v));
    if (!s.completado && Math.abs(rr.valor - o.valor) <= o.tol + 1e-9) { s.completado = true; s.estrellas = estrellasPorPistas(s.pistas); onCompletar(reto.clave, s.estrellas); }
    bump();
  };
  const pedirPista = () => { s.pistas += 1; if (onPista) onPista(); bump(); const sc = document.querySelector(".col-der .scroll"); if (sc) setTimeout(() => (sc.scrollTop = sc.scrollHeight), 30); };
  const criterios = !guiado ? [`${o.etiqueta}: ${fmt(o.valor, dec(o.valor))} ${o.unidad} (±${fmt(o.tol, dec(o.tol))})`] : reto.pasos;
  const hechos = s.completado ? criterios.length : meta ? Math.max(0, criterios.length - 1) : 0;

  return (
    <div className="vista-lec">
      <div className="cab" style={{ alignItems: "center" }}>
        <button className="btn contorno med" onClick={onVolver}>← Retos</button>
        <div className="titulos"><div className="sub" style={{ letterSpacing: ".3px", fontWeight: 700 }}>{etiqueta.toUpperCase()}</div><h2 style={{ fontSize: 22 }}>{reto.titulo}</h2></div>
        <button className="btn discreto med" onClick={onReiniciar}>Empezar de nuevo</button>
        <BarraPasos total={criterios.length} actual={Math.min(hechos, criterios.length - 1)} hechas={hechos} texto={s.completado ? "¡RETO SUPERADO!" : `${hechos} DE ${criterios.length} ${!guiado ? "CRITERIOS" : "PASOS"}`} />
      </div>
      <div className="cuerpo-lec">
        <div className="col-izq">
          <div className="caja-opc tarjeta"><IconoFis tipo={reto.svg} w={64} h={32} /><span className="tit">{reto.titulo}</span><span style={{ color: "var(--texto2)" }}>Mueve los controles hasta llegar a la meta.</span></div>
          <div className="zona-fis"><Escena escena={reto.escena} v={vv} /></div>
          <div className="controles-lec tarjeta">
            <div className="fis-sliders">{reto.controles.map((c) => <Ctl key={c.id} etiqueta={c.etiqueta} valor={s.v[c.id]} set={(x) => cambiar(c.id, x)} min={c.min} max={c.max} paso={c.paso} dec={c.dec} unidad={c.unidad} />)}</div>
            <div className="sep" />
            <div className="medidores">
              <div className={`medidor ${meta ? "res" : ""}`} style={{ background: meta ? E.COLOR_EXITO_SUAVE : "#F4F8FB", borderColor: meta ? E.COLOR_EXITO : "#D6E4EE" }}>
                <div className="t"><span>{o.etiqueta.toUpperCase()} AHORA</span>{meta ? <i style={{ background: E.COLOR_EXITO }}>EN LA META</i> : null}</div>
                <div className="n">{r.texto}</div>
              </div>
              <div className="medidor" style={{ background: E.COLOR_ELECTRICIDAD_SUAVE, borderColor: "#F2D78A" }}>
                <div className="t"><span>META</span></div>
                <div className="n">{fmt(o.valor, dec(o.valor))} {o.unidad}</div>
              </div>
            </div>
            <div className="formula-viva"><em>EN VIVO</em><span>{r.lineas.join("     ")}</span></div>
          </div>
        </div>
        <div className="col-der tarjeta">
          <div className="scroll">
            <span className="chip" style={{ background: fondoN, color: colN }}>NIVEL {nivel} · {nomN.toUpperCase()}</span>
            <p className="txt sm" style={{ color: "var(--texto2)", margin: "4px 0 8px" }}>{descN}</p>
            <CajaTitulada titulo="Objetivo" color={E.COLOR_ELECTRICIDAD_OSCURO} fondo={E.COLOR_ELECTRICIDAD_SUAVE}>
              <p className="txt m" style={{ fontWeight: 700, margin: "0 0 4px" }}>{reto.enunciado}</p>
            </CajaTitulada>
            {s.completado ? (
              <CajaTitulada titulo="¡Reto superado!" color={E.COLOR_EXITO} fondo={E.COLOR_EXITO_SUAVE} forma="ok" flash>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><Estrellas n={s.estrellas} t={26} /><span style={{ fontSize: 11, color: "var(--texto2)" }}>{s.pistas === 0 ? "sin pistas" : `con ${s.pistas} pista${s.pistas > 1 ? "s" : ""}`}</span></div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--exito)", marginTop: 4 }}>LO QUE APRENDISTE</div>
                <p className="txt m">{reto.cierre(vv, r)}</p>
                {haySiguiente ? <button className="btn prim med completo" style={{ marginBottom: 6 }} onClick={onSiguiente}>Siguiente reto  →</button> : null}
                <p className="txt sm" style={{ color: "var(--texto2)", fontSize: 10 }}>Puedes seguir moviendo los controles.</p>
              </CajaTitulada>) : null}
            <div className="rot-sec">{!guiado ? "CRITERIOS" : "PASOS"}</div>
            {criterios.map((p, i) => {
              const hecho = i < hechos, actual = guiado && i === hechos && !s.completado;
              return (
                <div key={i} className={`paso-l ${actual ? "actual" : ""} ${!hecho && !actual && guiado ? "pend" : ""}`}>
                  {hecho ? <IconoEstado forma="ok" color={E.COLOR_EXITO} tam={22} /> : !guiado ? <IconoEstado forma="neutro" color={E.COLOR_TEXTO_SECUNDARIO} tam={22} /> : <span className="n">{i + 1}</span>}
                  <span style={{ flex: 1 }}>{p}</span>
                </div>);
            })}
            {!s.completado ? (
              <CajaTitulada titulo="¿Te atascaste?" color={E.COLOR_ACENTO} fondo={E.COLOR_FONDO} style={{ marginTop: 12 }}>
                {reto.pistas.slice(0, s.pistas).map((p, j) => (
                  <div key={j} style={{ display: "flex", gap: 8, margin: "2px 0" }}><b style={{ width: 50, fontSize: 11, color: "var(--acento)", flex: "none" }}>Pista {j + 1}</b><div className="txt sm" style={{ margin: 0 }}>{p}</div></div>))}
                {s.pistas < reto.pistas.length
                  ? <button className="btn med completo" style={{ marginTop: 6 }} onClick={pedirPista}>{s.pistas === reto.pistas.length - 1 ? "Ver la última pista (casi la solución)" : s.pistas ? `Ver una pista (${s.pistas + 1} de ${reto.pistas.length})` : "Ver una pista"}</button>
                  : <p className="txt sm" style={{ color: "var(--texto2)", margin: "4px 0 0" }}>Ya viste todas las pistas.</p>}
                {s.pistas === 0 ? <p className="txt sm" style={{ color: "var(--texto2)", fontSize: 10, marginTop: 6 }}>Cada pista que pidas resta una estrella al terminar.</p> : null}
              </CajaTitulada>) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
