import "../fisica.css";
import { IconoFis } from "./IconosFisica.jsx";
import { lecDe } from "../datos/leccionesFisica.js";
import { retosDe } from "../datos/retosFisica.js";

const Barra = ({ n, t }) => <span className="ini-barra" aria-hidden="true"><i style={{ width: `${t ? (n / t) * 100 : 0}%` }} /></span>;

// Tres accesos de un módulo: lecciones, retos y simulador libre.
export default function Hub({ modulo, ir, progreso }) {
  const lec = lecDe(modulo), ret = retosDe(modulo), hecho = (l) => l.filter((x) => progreso.fisica.has(x.clave)).length;
  const nL = hecho(lec), nR = hecho(ret), sig = lec.find((l) => !progreso.fisica.has(l.clave));
  const lab = modulo === "calor" ? "LabCalor" : "LabOndas";
  return (
    <div className="ini-grid hub-fis">
      <button className="ini-card grande" onClick={() => ir("Aprender", sig ? sig.clave : `mod:${modulo}`)}>
        <span className="ini-num">1</span><span className="ini-ico"><IconoFis tipo={modulo === "calor" ? "termometro" : "onda"} w={84} h={46} /></span>
        <span className="ini-verbo">Comprender</span><h3>Lecciones guiadas</h3>
        <p>{lec.map((l) => l.titulo).join(", ")}. Con teoría, experimentos y ejercicios resueltos.</p>
        <span className="ini-prog"><Barra n={nL} t={lec.length} /><small>{nL} de {lec.length}</small></span>
        <span className="ini-ir">{sig ? (nL ? `Siguiente: ${sig.titulo}` : `Empezar: ${sig.titulo}`) : "Repasar las lecciones"}<span aria-hidden="true"> →</span></span>
      </button>
      <button className="ini-card" onClick={() => ir("Laboratorio", `mod:${modulo}`)}>
        <span className="ini-num">2</span><span className="ini-ico"><IconoFis tipo="lab" w={84} h={46} /></span>
        <span className="ini-verbo">Resolver</span><h3>Retos de laboratorio</h3>
        <p>Alcanza una meta ajustando los controles: de lo guiado a lo libre, con pistas y estrellas.</p>
        <span className="ini-prog"><Barra n={nR} t={ret.length} /><small>{nR} de {ret.length}</small></span>
      </button>
      <button className="ini-card" onClick={() => ir(lab)}>
        <span className="ini-num">3</span><span className="ini-ico"><IconoFis tipo={modulo === "calor" ? "joule" : "interf"} w={84} h={46} /></span>
        <span className="ini-verbo">Construir</span><h3>Simulador libre</h3>
        <p>{modulo === "calor" ? "Vasos, hielo, metales, calentador, mechero y termómetros en una mesa de laboratorio." : "Cubeta de ondas con fuentes y sondas, y un generador de corriente alterna con osciloscopio."}</p>
        <span className="ini-ir">Abrir el simulador<span aria-hidden="true"> →</span></span>
      </button>
    </div>
  );
}
