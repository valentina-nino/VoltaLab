import { useState } from "react";
import Indice from "./Indice.jsx";
import LeccionVista from "./LeccionVista.jsx";
import LeccionFisica from "./LeccionFisica.jsx";
import SelectorModulo, { moduloDeClave } from "../componentes/SelectorModulo.jsx";
import { LECCIONES } from "../datos/lecciones.js";
import { LECCIONES_FIS, lecDe, buscarLec } from "../datos/leccionesFisica.js";
import { anotar } from "../lib/evidencias.js";
import { bloqueoLeccion } from "../lib/progresion.js";

export default function Aprender({ ir, progreso, setProgreso, clave }) {
  const [mod, setModOriginal] = useState(() => moduloDeClave(clave, buscarLec));
  const [abierta, setAbierta] = useState(clave && !clave.startsWith("mod:") ? clave : null);
  const [reinicio, setReinicio] = useState(0);
  const esFis = mod !== "electricidad";
  const lista = esFis ? lecDe(mod) : LECCIONES;
  const hechas = esFis ? new Set([...progreso.fisica].filter((k) => lista.some((l) => l.clave === k))) : progreso.aprender;
  const setMod = (m) => { setAbierta(null); setModOriginal(m); };
  const abrir = (c) => { anotar(setProgreso, c, (e) => ({ ...e, intentos: e.intentos + 1 })); setAbierta(c); setReinicio((k) => k + 1); window.scrollTo(0, 0); };
  const bloqueo = (i) => bloqueoLeccion(i, lista, hechas, progreso.docente);
  const completar = (c) => {
    setProgreso((p) => (esFis ? { ...p, fisica: new Set([...p.fisica, c]) } : { ...p, aprender: new Set([...p.aprender, c]) }));
    anotar(setProgreso, c, (e) => ({ ...e, fecha: e.fecha || new Date().toISOString() }));
  };

  if (abierta) {
    const i = lista.findIndex((l) => l.clave === abierta);
    if (i >= 0 && (!bloqueo(i) || hechas.has(abierta))) {
      const Vista = esFis ? LeccionFisica : LeccionVista;
      return (
        <Vista key={`${abierta}-${reinicio}`} leccion={lista[i]} etiqueta={`Lección ${i + 1} de ${lista.length}`}
          haySiguiente={i + 1 < lista.length}
          onVolver={() => setAbierta(null)}
          onCompletar={completar}
          onSiguiente={() => abrir(lista[i + 1].clave)}
          onReiniciar={() => abrir(abierta)} />
      );
    }
  }
  return (
    <Indice kicker="LECCIONES INTERACTIVAS" titulo="Aprender" subtitulo=""
      ir={ir} atras={["Ruta", "← Mi ruta"]} actividades={lista} completadas={hechas} bloqueo={bloqueo} docente={progreso.docente}
      onDocente={(v) => setProgreso((p) => ({ ...p, docente: v }))}
      pieDe={(a) => <span>{a.tarjetas.length} tarjetas</span>}
      extra={<>
        <SelectorModulo modulo={mod} set={setMod} />
        {!esFis ? <button className="btn discreto med" style={{ marginTop: 6 }} onClick={() => ir("Conceptos")}>Repaso de conceptos</button> : <button className="btn discreto med" style={{ marginTop: 6 }} onClick={() => ir(mod === "calor" ? "Calor" : "Ondas")}>Calculadoras de {mod === "calor" ? "calor" : "ondas"}</button>}
      </>}
      onAbrir={abrir} />
  );
}
export { LECCIONES_FIS };
