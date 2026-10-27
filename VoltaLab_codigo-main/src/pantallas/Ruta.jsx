import { IconoCanvas } from "../componentes/Iconos.jsx";
import { LECCIONES } from "../datos/lecciones.js";
import { RETOS } from "../datos/retos.js";
import { PROBLEMAS } from "../datos/problemas.js";
import { lecDe } from "../datos/leccionesFisica.js";
import { retosDe } from "../datos/retosFisica.js";

function Barra({ n, t }) { return <span className="ini-barra" aria-hidden="true"><i style={{ width: `${(n / t) * 100}%` }} /></span>; }

export default function Ruta({ ir, progreso }) {
  const nL = progreso.aprender.size, nR = progreso.laboratorio.size, nP = progreso.problemas.size, nF = progreso.fisica.size, totF = lecDe("calor").length + lecDe("ondas").length + retosDe("calor").length + retosDe("ondas").length;
  const sig = LECCIONES.find((l) => !progreso.aprender.has(l.clave));
  const empezo = nL > 0;
  const avance = (m) => { const l = [...lecDe(m), ...retosDe(m)]; return [l.filter((x) => progreso.fisica.has(x.clave)).length, l.length]; };
  const [nC, tC] = avance("calor"), [nO, tO] = avance("ondas");
  return (
    <div className="ini">
      <div className="ini-cont">
        <header className="ini-nav">
          <button className="ini-link" onClick={() => ir("Inicio")}>← Inicio</button>
          <nav>
            <button className="ini-progreso" onClick={() => ir("Progreso")}>Mi progreso <b>{nL + nR + nF}/{LECCIONES.length + RETOS.length + totF}</b></button>
          </nav>
        </header>
        <section className="ruta-pg">
          <h1 className="ruta-t">Aprender paso a paso</h1>
          <p className="ruta-sub">Para cuando quieras entender algo con calma: lecciones en orden, retos para practicar y problemas para aplicar. Empieza por electricidad y sigue con calor y ondas.</p>
          <div className="ini-grid">
            <button className="ini-card grande" onClick={() => ir("Aprender")}>
              <span className="ini-num">1</span>
              <span className="ini-ico"><IconoCanvas tipo="bombillo" w={84} h={46} /></span>
              <span className="ini-verbo">Comprender</span>
              <h3>Lecciones guiadas</h3>
              <p>Voltaje, corriente, resistencia, serie y paralelo, cada una con experimentos que cambias tú.</p>
              <span className="ini-prog"><Barra n={nL} t={LECCIONES.length} /><small>{nL} de {LECCIONES.length}</small></span>
              <span className="ini-ir">{sig ? (empezo ? `Siguiente: ${sig.titulo}` : `Empezar: ${sig.titulo}`) : "Repasar las lecciones"}<span aria-hidden="true"> →</span></span>
            </button>
            <button className="ini-card" onClick={() => ir("Laboratorio")}>
              <span className="ini-num">2</span>
              <span className="ini-ico"><IconoCanvas tipo="resistencia" w={84} h={46} /></span>
              <span className="ini-verbo">Resolver</span>
              <h3>Retos de laboratorio</h3>
              <p>Construye lo que se te pide, primero con guía y luego por tu cuenta.</p>
              <span className="ini-prog"><Barra n={nR} t={RETOS.length} /><small>{nR} de {RETOS.length}</small></span>
            </button>
            <button className="ini-card" onClick={() => ir("Problemas")}>
              <span className="ini-num">3</span>
              <span className="ini-ico"><IconoCanvas tipo="cable" w={84} h={46} /></span>
              <span className="ini-verbo">Aplicar <span className="pb-nivel n3 ruta-nivel">Intermedio–avanzado</span></span>
              <h3>Problemas aplicados</h3>
              <p>Circuitos, capacitores, calor y ondas, resueltos paso a paso.</p>
              <span className="ini-prog"><Barra n={nP} t={PROBLEMAS.length} /><small>{nP} de {PROBLEMAS.length}</small></span>
            </button>
          </div>
          <div className="ruta-mas">
            <h2>Calor y ondas</h2>
            <p className="ruta-sub">Dos módulos completos, con el mismo recorrido que electricidad: lecciones con teoría, retos de laboratorio y un simulador libre.</p>
            <div className="ini-grid dos">
              <button className="ini-card" onClick={() => ir("Calor")}>
                <span className="ini-ico"><svg viewBox="0 0 84 46" width="84" height="46" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><rect x="36" y="4" width="12" height="30" rx="6" /><circle cx="42" cy="37" r="6" fill="currentColor" /><path d="M58 12h10M58 22h14M58 32h10" /></svg></span>
                <span className="ini-verbo">Explorar</span>
                <h3>Calor y calorimetría</h3>
                <p>Q = m·c·ΔT, equilibrio térmico, cambios de fase y efecto Joule: lecciones, retos y simulador.</p>
                <span className="ini-prog"><Barra n={nC} t={tC} /><small>{nC} de {tC} actividades</small></span>
                <span className="ini-ir">Abrir calor<span aria-hidden="true"> →</span></span>
              </button>
              <button className="ini-card" onClick={() => ir("Ondas")}>
                <span className="ini-ico"><svg viewBox="0 0 84 46" width="84" height="46" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M4 23C14 2 24 2 32 23S50 44 60 23 74 2 80 23" /></svg></span>
                <span className="ini-verbo">Explorar</span>
                <h3>Ondas</h3>
                <p>Amplitud, frecuencia, longitud de onda, interferencia y corriente alterna: lecciones, retos y simulador.</p>
                <span className="ini-prog"><Barra n={nO} t={tO} /><small>{nO} de {tO} actividades</small></span>
                <span className="ini-ir">Abrir ondas<span aria-hidden="true"> →</span></span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}