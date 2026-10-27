import { useRef, useState } from "react";
import { LECCIONES } from "../datos/lecciones.js";
import { RETOS, NIVELES } from "../datos/retos.js";
import { PROBLEMAS } from "../datos/problemas.js";
import { LECCIONES_FIS } from "../datos/leccionesFisica.js";
import { RETOS_FIS } from "../datos/retosFisica.js";
import { Estrellas } from "../componentes/piezas.jsx";
import { IconoEstado } from "../componentes/Iconos.jsx";
import { progresoInicial } from "../lib/progresion.js";

const HABILIDADES = [["herramienta", "Elegir herramientas"], ["colocar", "Colocar piezas"], ["cable", "Dibujar cables"], ["valor", "Cambiar valores"], ["interruptor", "Usar interruptores"], ["borrar", "Borrar piezas"]];

function Fila({ hecha, texto, derecha, onClick }) {
  return (
    <button type="button" className={`pg-fila ${hecha ? "hecha" : ""}`} onClick={onClick}>
      {hecha ? <IconoEstado forma="ok" color="#2E9E6A" tam={18} /> : <span className="pg-vacio" />}
      <span className="pg-txt">{texto}</span>{derecha}
    </button>
  );
}

export default function Progreso({ ir, progreso, setProgreso }) {
  const [confirmar, setConfirmar] = useState(false);
  const [aviso, setAviso] = useState("");
  const archivo = useRef(null);
  const guardarCopia = () => {
    const d = { version: 1, aprender: [...progreso.aprender], laboratorio: [...progreso.laboratorio], habilidades: [...progreso.habilidades], problemas: [...progreso.problemas], fisica: [...progreso.fisica], estrellas: progreso.estrellas, evidencias: progreso.evidencias, nombre: progreso.nombre , sesiones: progreso.sesiones};
    const url = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = `circuitlab_progreso${progreso.nombre ? "_" + progreso.nombre.trim().replace(/\s+/g, "-") : ""}.json`;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    setAviso("Copia guardada en tus descargas.");
  };
  const cargarCopia = (e) => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    f.text().then((t) => {
      const j = JSON.parse(t);
      if (!Array.isArray(j.aprender) || !Array.isArray(j.laboratorio)) throw new Error("formato");
      setProgreso((p) => ({ ...p, aprender: new Set(j.aprender), laboratorio: new Set(j.laboratorio), habilidades: new Set(j.habilidades || []), problemas: new Set(j.problemas || []), fisica: new Set(j.fisica || []), estrellas: j.estrellas || {}, evidencias: j.evidencias || {}, nombre: j.nombre || p.nombre , sesiones: j.sesiones || p.sesiones}));
      setAviso("Progreso cargado.");
    }).catch(() => setAviso("Ese archivo no es una copia de CircuitLab.")).finally(() => { e.target.value = ""; });
  };
  const nLF = LECCIONES_FIS.filter((l) => progreso.fisica.has(l.clave)).length, nRF = RETOS_FIS.filter((r) => progreso.fisica.has(r.clave)).length;
  const nL = progreso.aprender.size + nLF, nR = progreso.laboratorio.size + nRF;
  const totL = LECCIONES.length + LECCIONES_FIS.length, totR = RETOS.length + RETOS_FIS.length;
  const total = totL + totR, hechas = nL + nR;
  const pct = Math.round((hechas / total) * 100);
  const estrellas = [...RETOS, ...RETOS_FIS].reduce((a, r) => a + (progreso.estrellas[r.clave] || 0), 0);
  const siguiente = LECCIONES.find((l) => !progreso.aprender.has(l.clave)) || LECCIONES_FIS.find((l) => !progreso.fisica.has(l.clave));
  return (
    <div className="pantalla" style={{ overflowY: "auto" }}>
      <div className="cab">
        <button className="btn contorno med" onClick={() => ir("Inicio")} style={{ marginTop: 6 }}>← Inicio</button>
        <div className="titulos"><h1 style={{ fontSize: 28 }}>Mi progreso</h1></div>
      </div>
      <div className="pg-resumen tarjeta">
        <div className="pg-anillo" style={{ "--p": pct }}><b>{pct}%</b></div>
        <div className="pg-cifras">
          <div><strong>{nL}</strong><span>de {totL} lecciones</span></div>
          <div><strong>{nR}</strong><span>de {totR} retos</span></div>
          <div><strong>{progreso.problemas.size}</strong><span>de {PROBLEMAS.length} problemas</span></div>
          <div><strong>{estrellas}</strong><span>de {totR * 3} estrellas</span></div>
        </div>
        {siguiente ? <button className="btn prim med" onClick={() => ir("Aprender", siguiente.modulo ? siguiente.clave : null)}>Continuar: {siguiente.titulo}</button> : <span className="chip exito">Lecciones completas</span>}
      </div>
      <div className="pg-copia tarjeta">
        <label>Tu nombre <input value={progreso.nombre} onChange={(e) => setProgreso((p) => ({ ...p, nombre: e.target.value }))} placeholder="Opcional" maxLength={40} /></label>
        <span className="pg-copia-t">Se guarda solo en <b>este navegador</b>. Para pasarlo a otro equipo o entregárselo al profesor:</span>
        <button className="btn med contorno" onClick={guardarCopia}>Guardar copia</button>
        <button className="btn med contorno" onClick={() => archivo.current && archivo.current.click()}>Cargar copia</button>
        <input ref={archivo} type="file" accept="application/json,.json" onChange={cargarCopia} hidden />
        {aviso ? <b className="pg-aviso" role="status">{aviso}</b> : null}
      </div>
      <div className="pg-cols">
        <div className="tarjeta pg-col">
          <h3>Lecciones</h3>
          {LECCIONES.map((l) => <Fila key={l.clave} hecha={progreso.aprender.has(l.clave)} texto={l.titulo} onClick={() => ir("Aprender")} />)}
        </div>
        <div className="tarjeta pg-col">
          <h3>Retos del laboratorio</h3>
          {Object.keys(NIVELES).map((nv) => (
            <div key={nv}>
              <div className="pg-nivel">Nivel {nv} · {NIVELES[nv][0]}</div>
              {RETOS.filter((r) => r.nivel === +nv).map((r) => (
                <Fila key={r.clave} hecha={progreso.laboratorio.has(r.clave)} texto={r.titulo} onClick={() => ir("Laboratorio")}
                  derecha={progreso.laboratorio.has(r.clave) ? <Estrellas n={progreso.estrellas[r.clave] || 0} t={14} /> : null} />
              ))}
            </div>))}
        </div>
        <div className="tarjeta pg-col">
          <h3>Calor y ondas</h3>
          {["calor", "ondas"].map((m) => (
            <div key={m}>
              <div className="pg-nivel">{m === "calor" ? "Calor" : "Ondas"} · lecciones</div>
              {LECCIONES_FIS.filter((l) => l.modulo === m).map((l) => <Fila key={l.clave} hecha={progreso.fisica.has(l.clave)} texto={l.titulo} onClick={() => ir("Aprender", l.clave)} />)}
              <div className="pg-nivel">{m === "calor" ? "Calor" : "Ondas"} · retos</div>
              {RETOS_FIS.filter((r) => r.modulo === m).map((r) => <Fila key={r.clave} hecha={progreso.fisica.has(r.clave)} texto={r.titulo} onClick={() => ir("Laboratorio", r.clave)}
                derecha={progreso.fisica.has(r.clave) ? <Estrellas n={progreso.estrellas[r.clave] || 0} t={14} /> : null} />)}
            </div>))}
        </div>
        <div className="tarjeta pg-col">
          <h3>Problemas aplicados</h3>
          {PROBLEMAS.map((q) => <Fila key={q.clave} hecha={progreso.problemas.has(q.clave)} texto={`${q.ref} · ${q.titulo}`} onClick={() => ir("Problemas", q.clave)} />)}
        </div>
        <div className="tarjeta pg-col">
          <h3>Habilidades</h3>
          {HABILIDADES.map(([k, t]) => <Fila key={k} hecha={progreso.habilidades.has(k)} texto={t} onClick={() => ir("Laboratorio")} />)}
          <div className="pg-reinicio">
            {confirmar ? (
              <>
                <span>¿Borrar todo el avance?</span>
                <button className="btn sm err" onClick={() => { setProgreso(progresoInicial()); setConfirmar(false); }}>Sí, borrar</button>
                <button className="btn sm crema" onClick={() => setConfirmar(false)}>Cancelar</button>
              </>) : <button className="btn sm discreto" onClick={() => setConfirmar(true)}>Reiniciar progreso</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
