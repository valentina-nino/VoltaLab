import { useState } from "react";
import Indice from "./Indice.jsx";
import RetoVista from "./RetoVista.jsx";
import RetoFisica from "./RetoFisica.jsx";
import SelectorModulo, { moduloDeClave } from "../componentes/SelectorModulo.jsx";
import { Estrellas } from "../componentes/piezas.jsx";
import { RETOS, NIVELES } from "../datos/retos.js";
import { LECCIONES } from "../datos/lecciones.js";
import { RETOS_FIS, retosDe, NIVELES_FIS } from "../datos/retosFisica.js";
import { LECCIONES_FIS } from "../datos/leccionesFisica.js";
import { anotar } from "../lib/evidencias.js";
import { sugerenciaReto } from "../lib/progresion.js";

const COL = { 1: ["exito", "Guiado"], 2: ["", "Con apoyo"], 3: ["adv", "Reto"] };
const buscarReto = (c) => RETOS_FIS.find((r) => r.clave === c);

export default function Laboratorio({ ir, progreso, setProgreso, clave }) {
  const [mod, setMod0] = useState(() => moduloDeClave(clave, buscarReto));
  const [abierto, setAbierto] = useState(clave && !clave.startsWith("mod:") ? clave : null);
  const [reinicio, setReinicio] = useState(0);
  const esFis = mod !== "electricidad";
  const lista = esFis ? retosDe(mod) : RETOS, niveles = esFis ? NIVELES_FIS : NIVELES;
  const hechos = esFis ? new Set([...progreso.fisica].filter((k) => lista.some((r) => r.clave === k))) : progreso.laboratorio;
  const setMod = (m) => { setAbierto(null); setMod0(m); };
  const abrir = (c) => { anotar(setProgreso, c, (e) => ({ ...e, intentos: e.intentos + 1 })); setAbierto(c); setReinicio((k) => k + 1); window.scrollTo(0, 0); };
  const completar = (c, est) => {
    setProgreso((p) => ({ ...p, [esFis ? "fisica" : "laboratorio"]: new Set([...p[esFis ? "fisica" : "laboratorio"], c]), estrellas: { ...p.estrellas, [c]: Math.max(est, p.estrellas[c] || 0) } }));
    anotar(setProgreso, c, (e) => ({ ...e, fecha: e.fecha || new Date().toISOString() }));
  };
  if (abierto) {
    const i = lista.findIndex((r) => r.clave === abierto);
    if (i >= 0) {
      const comunes = { reto: lista[i], etiqueta: `Reto ${i + 1} de ${lista.length}`, haySiguiente: i + 1 < lista.length, onVolver: () => setAbierto(null), onCompletar: completar, onSiguiente: () => abrir(lista[i + 1].clave), onReiniciar: () => abrir(abierto), onPista: () => anotar(setProgreso, abierto, (e) => ({ ...e, pistas: e.pistas + 1 })) };
      const k = `${abierto}-${reinicio}`;
      return esFis ? <RetoFisica key={k} {...comunes} /> : <RetoVista key={k} {...comunes} habilidades={progreso.habilidades} />;
    }
  }
  const agrupar = (todas, rejilla) => Object.entries(niveles).map(([nv, [nombre]]) => {
    const grupo = todas.filter(([, a]) => a.nivel === +nv);
    if (!grupo.length) return null;
    const [cls] = COL[nv];
    return (
      <div key={nv}>
        <div className="nivel-cab"><span className={`chip ${cls}`}>NIVEL {nv}</span><h2>{nombre}</h2></div>
        {rejilla(grupo)}
      </div>
    );
  });
  return (
    <Indice kicker="RETOS DE CONSTRUCCIÓN" titulo="Laboratorio" subtitulo=""
      ir={ir} atras={["Ruta", "← Mi ruta"]} actividades={lista} completadas={hechos} bloqueo={() => null} docente={progreso.docente}
      onDocente={(v) => setProgreso((p) => ({ ...p, docente: v }))}
      extra={<><SelectorModulo modulo={mod} set={setMod} /><button className="btn discreto med" style={{ marginTop: 6 }} onClick={() => ir(esFis ? (mod === "calor" ? "LabCalor" : "LabOndas") : "Configurar")}>Simulador libre</button></>}
      pieDe={(a, hecha) => {
        const sug = hecha ? null : sugerenciaReto(a, esFis ? LECCIONES_FIS : LECCIONES, esFis ? progreso.fisica : progreso.aprender);
        return <>{sug ? <span style={{ maxWidth: 170 }}>{sug}</span> : null}{hecha ? <Estrellas n={progreso.estrellas[a.clave] || 0} t={18} /> : null}</>;
      }}
      agrupar={agrupar} onAbrir={abrir} />
  );
}
