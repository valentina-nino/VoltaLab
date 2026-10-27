import "../fisica.css";
import { Cabecera } from "../componentes/fisica.jsx";
import { IconoCanvas } from "../componentes/Iconos.jsx";
import { IconoFis } from "../componentes/IconosFisica.jsx";

export default function Simuladores({ ir }) {
  return (
    <div className="ini">
      <div className="ini-cont">
        <Cabecera ir={ir} atras={["Inicio", "← Inicio"]} />
        <section className="ruta-pg">
          <h1 className="ruta-t">Simuladores libres</h1>
          <p className="ruta-sub">Tres laboratorios abiertos, sin instrucciones: coloca las piezas, cambia sus valores y mira qué pasa.</p>
          <div className="ini-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <button className="ini-card" onClick={() => ir("Configurar")}>
              <span className="ini-ico"><IconoCanvas tipo="bateria" w={84} h={46} /></span>
              <span className="ini-verbo">Electricidad</span>
              <h3>Circuitos</h3>
              <p>Baterías, resistencias, bombillos, interruptores, cables y fusibles. Las piezas se queman de verdad.</p>
              <span className="ini-ir">Abrir el simulador<span aria-hidden="true"> →</span></span>
            </button>
            <button className="ini-card" onClick={() => ir("LabCalor")}>
              <span className="ini-ico"><IconoFis tipo="termometro" w={84} h={46} /></span>
              <span className="ini-verbo">Calor</span>
              <h3>Laboratorio de calor</h3>
              <p>Vasos con agua, hielo, aceite y bloques de metal; calentador eléctrico, mechero y termómetros. Mezclas, equilibrio y cambios de fase.</p>
              <span className="ini-ir">Abrir el simulador<span aria-hidden="true"> →</span></span>
            </button>
            <button className="ini-card" onClick={() => ir("LabOndas")}>
              <span className="ini-ico"><IconoFis tipo="onda" w={84} h={46} /></span>
              <span className="ini-verbo">Ondas</span>
              <h3>Laboratorio de ondas</h3>
              <p>Cubeta de ondas con fuentes y sondas, interferencia, osciloscopio y un generador de corriente alterna.</p>
              <span className="ini-ir">Abrir el simulador<span aria-hidden="true"> →</span></span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
