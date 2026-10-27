import { useEffect, useReducer, useRef } from "react";
import Escena from "../componentes/EscenasFisica.jsx";
import { IconoEstado } from "../componentes/Iconos.jsx";
import { IconoFis } from "../componentes/IconosFisica.jsx";
import { CajaTitulada, BarraPasos, OpcionRelieve, Teoria } from "../componentes/piezas.jsx";
import * as E from "../lib/estilos.js";
import { mezclarColor } from "../lib/animaciones.js";
import { MODELOS } from "../lib/modelosFisica.js";
import { CtxFis, soluciones } from "../datos/leccionesFisica.js";
import { teoriaFis } from "../datos/teoriaFisica.js";

const TIPOS = {
  idea: ["IDEA", E.COLOR_ACENTO, E.COLOR_ACENTO_SUAVE],
  explora: ["TU TURNO", E.COLOR_ELECTRICIDAD_OSCURO, E.COLOR_ELECTRICIDAD_SUAVE],
  reto: ["RETO", E.COLOR_ADVERTENCIA, E.COLOR_ADVERTENCIA_SUAVE],
  pregunta: ["COMPRUEBA", E.COLOR_POTENCIA, "#EFE7F8"],
  resumen: ["RESUMEN", E.COLOR_EXITO, E.COLOR_EXITO_SUAVE],
};

function Medidor({ def, entrada, resaltar }) {
  const val = entrada ? def.de(entrada) : null, previo = useRef(null);
  const [info, setInfo] = useReducer((_, x) => x, { texto: "", sube: true, k: 0 });
  useEffect(() => {
    const a = previo.current; previo.current = val;
    if (val == null) return;
    let texto = "";
    if (a != null && a !== val) {
      if (a === 0 || val === 0) texto = val > a ? "SUBE" : "BAJA";
      else { const r = val / a; if (Math.abs(r - 1) > 0.005) texto = r > 1 ? `×${+r.toPrecision(3)}` : `÷${+(1 / r).toPrecision(3)}`; }
    }
    setInfo({ texto, sube: a == null || val > a, k: info.k + 1 });
    // eslint-disable-next-line
  }, [val]);
  const fondo = mezclarColor(def.color, "#FFFFFF", 0.9), borde = mezclarColor(def.color, "#FFFFFF", 0.7);
  return (
    <div className={`medidor ${resaltar ? "res" : ""}`} style={{ background: fondo, borderColor: borde, boxShadow: `0 3px 0 ${mezclarColor(def.color, "#FFFFFF", 0.55)}` }}>
      <div className="t"><span style={{ color: mezclarColor(def.color, "#000000", 0.15) }}>{def.titulo.toUpperCase()}</span>
        {info.texto ? <i key={info.k} style={{ background: info.sube ? E.COLOR_EXITO : E.COLOR_ERROR }}>{info.texto}</i> : null}</div>
      <div className="n">{val == null ? "—" : def.f(val)}</div>
    </div>
  );
}

export default function LeccionFisica({ leccion: lec, etiqueta, onVolver, onCompletar, onSiguiente, onReiniciar, haySiguiente }) {
  const [, bump] = useReducer((x) => x + 1, 0);
  const modelo = MODELOS[lec.escena], entrada = (v) => ({ ...v, ...modelo(v) });
  const S = useRef(null);
  if (!S.current) {
    const v0 = { ...lec.inicial };
    S.current = { i: 0, terminada: false, v: v0, historial: [entrada(v0)], estado: lec.tarjetas.map(() => ({})), leyendo: false, pistaVisual: null };
  }
  const s = S.current, tarjetas = lec.tarjetas, t = tarjetas[s.i], st = s.estado[s.i], bloquesTeoria = teoriaFis(lec.clave);
  const ent = entrada(s.v);
  const ctx = () => new CtxFis(entrada(s.v), s.historial);

  const guiaReto = () => {
    const t0 = tarjetas[s.i], st0 = s.estado[s.i], vistas = st0.pistas || 0;
    if (s.terminada || t0.tipo !== "reto" || st0.hecha || !vistas) { s.pistaVisual = null; return; }
    const lista = soluciones(lec, t0);
    const dif = (so) => Object.entries(so).filter(([k, x]) => s.v[k] !== x).length;
    const sol = [...lista].sort((a, b) => dif(a) - dif(b))[0] || {};
    s.pistaVisual = [vistas, sol];
  };
  const evaluar = () => {
    if (s.terminada) return;
    const t0 = tarjetas[s.i], st0 = s.estado[s.i];
    if ((t0.tipo === "explora" || t0.tipo === "reto") && !st0.hecha) {
      const c = ctx(); let ok = false;
      try { ok = !!t0.meta(c); } catch { ok = false; }
      if (ok) {
        st0.hecha = true; st0.recien = true;
        const tx = t0.tipo === "explora" ? t0.descubre : t0.logro;
        try { st0.texto = typeof tx === "function" ? tx(c) : tx; } catch { st0.texto = ""; }
      }
    }
    guiaReto(); bump();
  };
  const aplicar = (c, val) => { s.v = { ...s.v, [c.id]: val }; s.historial = [...s.historial, entrada(s.v)]; evaluar(); };
  const irA = (i) => { s.i = i; s.terminada = false; s.historial = [entrada(s.v)]; s.leyendo = false; evaluar(); const sc = document.querySelector(".col-der .scroll"); if (sc) sc.scrollTop = 0; };
  const hecha = (k = s.i) => ["idea", "resumen"].includes(tarjetas[k].tipo) || !!s.estado[k].hecha;
  const seguir = () => {
    if (s.terminada || !hecha()) return;
    if (s.i + 1 < tarjetas.length) irA(s.i + 1); else { s.terminada = true; onCompletar(lec.clave); bump(); }
  };
  const atras = () => { if (s.terminada) irA(tarjetas.length - 1); else if (s.i > 0) irA(s.i - 1); };
  const responder = (clave) => { st.fallidas = st.fallidas || new Set(); st.ultima = clave; if (clave === t.correcta) st.hecha = true; else st.fallidas.add(clave); bump(); };

  const [vistas, solPista] = s.pistaVisual || [0, {}];
  const grupoControl = (c) => {
    const actual = s.v[c.id], meta = solPista[c.id], mover = vistas >= 1 && meta !== undefined && actual !== meta;
    return (
      <div key={c.id} className={`grupo-ctrl ${mover ? "mover" : ""}`}>
        <b>{c.etiqueta}</b>
        {c.opciones.map(([val, tx]) => {
          const on = actual === val, exacto = mover && vistas >= 3 && val === meta;
          const lado = mover && vistas >= 2 && !exacto && typeof meta === "number" && Math.min(actual, meta) < val && val <= Math.max(actual, meta);
          return <button key={String(val)} className={`btn opt ${on ? "on" : exacto ? "exacto" : lado ? "lado" : ""}`} onClick={() => aplicar(c, val)}>{tx}</button>;
        })}
      </div>
    );
  };
  const Extras = ({ t: tt }) => (<>
    {tt.fijate ? <CajaTitulada titulo="Fíjate en el tablero" color={E.COLOR_ACENTO} fondo={E.COLOR_ACENTO_SUAVE}><ul>{tt.fijate.map((p, i) => <li key={i}>{p}</li>)}</ul></CajaTitulada> : null}
    {tt.ejemplo ? <CajaTitulada titulo="Ejemplo resuelto" color={E.COLOR_TEXTO_PRINCIPAL} fondo={E.COLOR_FONDO}>
      <p className="txt m" style={{ fontWeight: 700 }}>{tt.ejemplo.enunciado}</p>
      {tt.ejemplo.pasos.map((p, i) => <div className="ej-paso" key={i}><b>{i + 1}</b><span>{p}</span></div>)}</CajaTitulada> : null}
  </>);

  const cuerpoTarjeta = () => {
    if (s.terminada) {
      const r = tarjetas.find((x) => x.tipo === "resumen");
      return (<>
        <CajaTitulada titulo="¡Lección completada!" color={E.COLOR_EXITO} fondo={E.COLOR_EXITO_SUAVE} forma="ok" flash>
          <p className="txt m">Terminaste «{lec.titulo}». Esto es lo que te llevas:</p>
          {r ? r.puntos.map((p, i) => <p key={i} className="txt sm">•  {p}</p>) : null}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {haySiguiente ? <button className="btn prim med" onClick={onSiguiente}>Siguiente lección  →</button> : null}
            <button className="btn med" onClick={onVolver}>Volver a las lecciones</button>
          </div>
        </CajaTitulada>
        <p className="txt sm" style={{ color: "var(--texto2)" }}>El tablero sigue vivo: puedes seguir moviendo los controles.</p>
      </>);
    }
    const [rot, col, fondo] = TIPOS[t.tipo];
    return (<>
      <span className="chip" style={{ background: fondo, color: col }}>{rot}</span>
      {t.titulo ? <h3 className="tc-titulo">{t.titulo}</h3> : null}
      {t.tipo === "idea" ? (<>
        <p className="txt">{t.texto}</p>
        {t.formula ? <div className="formula-grande"><div className="f">{t.formula}</div>{(t.simbolos || []).map(([a, b], i) => <div className="s" key={i}><b>{a}</b><span>{b}</span></div>)}</div> : null}
        {t.analogia ? <CajaTitulada titulo="Imagínalo así" color={E.COLOR_ELECTRICIDAD_OSCURO} fondo={E.COLOR_ELECTRICIDAD_SUAVE}><p className="txt m" style={{ margin: 0 }}>{t.analogia}</p></CajaTitulada> : null}
        <Extras t={t} />
      </>) : null}
      {t.tipo === "explora" ? (<><div className="caja-t" style={{ background: E.COLOR_ELECTRICIDAD_SUAVE, borderColor: E.COLOR_ELECTRICIDAD }}><p className="txt" style={{ margin: 0 }}>{t.texto}</p></div><Extras t={t} /></>) : null}
      {t.tipo === "reto" ? <div className="caja-t" style={{ background: E.COLOR_ADVERTENCIA_SUAVE, borderColor: E.COLOR_ADVERTENCIA }}><p className="txt" style={{ margin: 0, fontWeight: 700 }}>{t.texto}</p></div> : null}
      {t.tipo === "pregunta" ? (<>
        <p className="txt" style={{ fontWeight: 700 }}>{t.texto}</p>
        {t.opciones.map(([k, tx], i) => {
          const fall = st.fallidas?.has(k), ok = st.hecha && k === t.correcta;
          return <OpcionRelieve key={k} letra={"ABCD"[i]} texto={tx} estado={ok ? "correcta" : fall ? "fallida" : "normal"} deshabilitada={!!st.hecha || !!fall} onClick={() => responder(k)} />;
        })}
        {st.ultima ? (() => { const retro = t.opciones.find(([k]) => k === st.ultima)[2]; return st.ultima === t.correcta
          ? <CajaTitulada titulo="¡Correcto!" color={E.COLOR_EXITO} fondo={E.COLOR_EXITO_SUAVE} forma="ok" flash><p className="txt m" style={{ margin: 0 }}>{retro}</p></CajaTitulada>
          : <CajaTitulada titulo="Todavía no" color={E.COLOR_ADVERTENCIA} fondo={E.COLOR_ADVERTENCIA_SUAVE} forma="aviso"><p className="txt m">{retro}</p><p className="txt sm" style={{ color: "var(--texto2)", margin: 0 }}>Prueba con otra opción.</p></CajaTitulada>; })() : null}
      </>) : null}
      {t.tipo === "resumen" ? (<>
        {t.puntos.map((p, i) => <div className="resumen-l" key={i}><IconoEstado forma="ok" color={E.COLOR_EXITO} tam={20} /><span>{p}</span></div>)}
        {t.formula ? <div className="caja-t" style={{ background: E.COLOR_ACENTO_SUAVE, borderColor: E.COLOR_ACENTO, textAlign: "center", fontSize: 18, fontWeight: 700, color: E.COLOR_ACENTO, padding: 12 }}>{t.formula}</div> : null}
      </>) : null}
      {(t.tipo === "explora" || t.tipo === "reto") ? (<>
        {!st.hecha ? (<>
          {t.progreso ? <div className="resumen-l" style={{ color: "var(--texto2)", fontWeight: 700 }}><IconoEstado forma="neutro" color={E.COLOR_TEXTO_SECUNDARIO} tam={16} /><span>{(() => { try { return t.progreso(ctx()); } catch { return ""; } })()}</span></div> : null}
          {t.tipo === "reto" && t.pistas ? (
            <CajaTitulada titulo="¿Te atascaste?" color={E.COLOR_ACENTO} fondo={E.COLOR_FONDO}>
              {t.pistas.slice(0, st.pistas || 0).map((p, i) => <p key={i} className="txt sm">Pista {i + 1}:  {p}</p>)}
              {(st.pistas || 0) > 0 ? <p className="txt sm" style={{ color: "var(--elec-oscuro)", fontWeight: 700, fontSize: 10 }}>◆ {["", "Mira los controles: se ilumina lo que tienes que mover.", "Los valores iluminados van en la dirección correcta.", "El valor exacto está marcado en amarillo."][Math.min(st.pistas, 3)]}</p> : null}
              {(st.pistas || 0) < t.pistas.length ? <button className="btn med" onClick={() => { st.pistas = (st.pistas || 0) + 1; guiaReto(); bump(); }}>{!st.pistas ? "Ver una pista" : `Otra pista (${st.pistas + 1} de ${t.pistas.length})`}</button> : null}
            </CajaTitulada>) : null}
        </>) : (() => { const nuevo = st.recien; st.recien = false; return (
          <CajaTitulada titulo={t.tipo === "explora" ? "Lo que descubriste" : "¡Reto logrado!"} color={E.COLOR_EXITO} fondo={E.COLOR_EXITO_SUAVE} forma="ok" flash={nuevo}>
            <p className="txt m" style={{ margin: 0 }}>{st.texto}</p></CajaTitulada>); })()}
      </>) : null}
    </>);
  };

  const ok = hecha(), ultima = s.i === tarjetas.length - 1;
  const textoSeguir = ok ? (ultima ? "TERMINAR LA LECCIÓN" : "CONTINUAR") : ({ explora: "Haz la actividad para seguir", reto: "Logra el reto para seguir", pregunta: "Responde para seguir" }[t.tipo] || "CONTINUAR");
  const nHechas = tarjetas.reduce((n, _, k) => n + (hecha(k) && k < s.i ? 1 : 0), 0) + (ok ? 1 : 0);
  const pulsar = !s.terminada && (t.tipo === "explora" || t.tipo === "reto") && !st.hecha;

  return (
    <div className="vista-lec">
      <div className="cab" style={{ alignItems: "center" }}>
        <button className="btn contorno med" onClick={onVolver}>← Lecciones</button>
        <div className="titulos"><div className="sub" style={{ letterSpacing: ".3px", fontWeight: 700 }}>{etiqueta.toUpperCase()}</div><h2 style={{ fontSize: 22 }}>{lec.titulo}</h2></div>
        {bloquesTeoria ? <button className="btn contorno med" onClick={() => { s.leyendo = !s.leyendo; bump(); }}>{s.leyendo ? "Volver al tablero" : "Leer la teoría completa"}</button> : null}
        <button className="btn discreto med" onClick={onReiniciar}>Empezar de nuevo</button>
        <BarraPasos total={tarjetas.length} actual={s.i} hechas={s.terminada ? tarjetas.length : nHechas} texto={s.terminada ? "LECCIÓN COMPLETADA" : `TARJETA ${s.i + 1} DE ${tarjetas.length}`} />
      </div>
      <div className="cuerpo-lec">
        <div className="col-izq">
          <div className="caja-opc tarjeta"><IconoFis tipo={lec.svg} w={64} h={32} /><span className="tit">{lec.titulo}</span><span style={{ color: "var(--texto2)" }}>Cambia los controles de abajo y observa el tablero.</span></div>
          <div className="zona-fis"><Escena escena={lec.escena} v={ent} /></div>
          <div className={`controles-lec tarjeta ${pulsar ? "pulso" : ""}`} key={pulsar ? `p${s.i}` : "q"}>
            <div className="fila-ctrl">{lec.controles.map(grupoControl)}</div>
            <div className="sep" />
            <div className="medidores">{lec.medidor.map((d) => <Medidor key={d.id} def={d} entrada={ent} resaltar={!s.terminada && t.resaltar === d.id} />)}</div>
            <div className="formula-viva"><em>EN VIVO</em><span>{(() => { try { return lec.formula(ent); } catch { return ""; } })()}</span></div>
          </div>
          {s.leyendo && bloquesTeoria ? <Teoria lec={lec} bloques={bloquesTeoria} volver="Volver al tablero  →" onVolver={() => { s.leyendo = false; bump(); }} /> : null}
        </div>
        <div className="col-der tarjeta">
          <div className="scroll" key={`${s.i}-${s.terminada}`}>{cuerpoTarjeta()}</div>
          <div className="nav">
            <button className="btn" disabled={!(s.i > 0 || s.terminada)} onClick={atras}>Atrás</button>
            {!s.terminada ? <button className={`btn sig ${ok ? (ultima ? "exito" : "prim") : "apagado"}`} disabled={!ok} onClick={seguir}>{textoSeguir}</button> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
