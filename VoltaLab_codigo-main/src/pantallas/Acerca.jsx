import { IconoCanvas } from "../componentes/Iconos.jsx";
import { LECCIONES } from "../datos/lecciones.js";
import { RETOS } from "../datos/retos.js";
import { LECCIONES_FIS } from "../datos/leccionesFisica.js";
import { RETOS_FIS } from "../datos/retosFisica.js";
import { IconoFis } from "../componentes/IconosFisica.jsx";
import { PROBLEMAS } from "../datos/problemas.js";
import { TECLA } from "../lienzo/Lienzo.js";

const OBJETIVOS = [
  ["Comprender", "Relacionar voltaje, corriente y resistencia a partir de la ley de Ohm, observando qué cambia cuando se modifica una sola variable."],
  ["Diferenciar", "Distinguir los circuitos en serie, en paralelo y mixtos según cómo se reparten el voltaje y la corriente."],
  ["Predecir y comprobar", "Formular una hipótesis antes de cada experimento y contrastarla con las mediciones del simulador."],
  ["Resolver", "Aplicar Kirchhoff, capacitores, calorimetría, interferencia y corriente alterna en problemas paso a paso."],
  ["Calcular el calor", "Usar Q = m·c·ΔT, el equilibrio térmico y el calor latente para predecir cuánta energía hace falta y qué temperatura se alcanza."],
  ["Conectar electricidad y calor", "Ver cómo la potencia eléctrica (P = V²/R) se convierte en calor en una resistencia: el efecto Joule."],
  ["Describir ondas", "Relacionar amplitud, frecuencia, periodo, longitud de onda y velocidad (v = λ·f) en ondas que viajan y se superponen."],
  ["Explicar la corriente alterna", "Entender el voltaje eficaz y la potencia media de la red eléctrica como una onda, y su efecto sobre una resistencia."],
];

const PASOS = [
  ["Prueba el experimento de la portada", "Un bombillo de 5 W conectado a 12 V: predice qué pasará y compruébalo. Es la idea de todo VOLTA: primero piensas, después ves qué pasa y entiendes por qué."],
  ["Aprende paso a paso", "Las lecciones están en orden: cada una presenta una idea, te pide experimentar con el circuito y termina con un reto y una pregunta. El panel «Por dentro» muestra lo que no se ve: el agua en los tubos, los electrones, el filamento."],
  ["Quema y repara", "En «Cuando algo se quema» y «Cortocircuitos y fusibles» las piezas fallan según los cálculos reales: descubres por qué se dañan y cómo evitarlo."],
  ["Practica con los retos", "Construye el circuito que se pide. Si te atascas, pide una pista; las estrellas premian resolverlo con menos ayuda."],
  ["Experimenta en el laboratorio libre", "Arma cualquier circuito y ponlo al límite: los bombillos se funden, las resistencias se queman, los fusibles se abren y la batería se protege."],
  ["Sigue con calor y ondas", "En «Aprender» y «Laboratorio» elige la pestaña Calor u Ondas: tienen el mismo recorrido que electricidad, con teoría completa, ejercicios resueltos, retos con estrellas y un simulador propio."],
  ["Mezcla las tres ideas", "La resistencia que calienta agua (efecto Joule) y la red eléctrica que oscila como una onda son el mismo laboratorio visto desde tres ángulos."],
];

const HERRAMIENTAS = [
  ["bateria", "Batería", "Da el empuje (voltaje). Solo puede haber una por circuito."],
  ["resistencia", "Resistencia", "Se opone a la corriente. Elige un valor o escríbelo en ohmios."],
  ["bombillo", "Bombillo", "Brilla según la potencia que recibe (P = V × I)."],
  ["interruptor", "Interruptor", "Abre o cierra el camino. Con la herramienta Mover, un clic lo alterna."],
  ["cable", "Cable", "Un clic para empezar, otro en cada doblez; termina al tocar una conexión."],
  ["fusible", "Fusible", "Se funde si pasa más corriente que su valor nominal y protege el circuito."],
];

const PIEZAS_CALOR = [
  ["Vaso con agua o aceite", "Líquidos con su calor específico. El agua cambia de fase de verdad: hielo, líquido y vapor."],
  ["Hielo", "Parte por debajo de 0 °C; se calienta, se funde (la temperatura se detiene) y luego se calienta como agua."],
  ["Bloques de metal", "Aluminio, hierro, cobre y plomo: calor específico bajo, se calientan rápido y calientan poco al agua."],
  ["Calentador eléctrico", "Una resistencia: P = V²/R. Elige voltaje, resistencia y eficiencia."],
  ["Mechero", "Una fuente de potencia fija en vatios para calentar un cuerpo."],
  ["Termómetro", "Registra la temperatura de un cuerpo en la gráfica a lo largo del tiempo."],
  ["Recipientes A, B y C", "Los cuerpos de un mismo recipiente intercambian calor; puedes aislarlo o dejar que pierda calor al ambiente."],
];
const PIEZAS_ONDAS = [
  ["Fuente de ondas", "Emite ondas circulares. Cambia su frecuencia, amplitud y fase, y arrástrala por la cubeta (hasta 4)."],
  ["Sonda con osciloscopio", "Mide cómo sube y baja la onda en un punto y dibuja la señal (hasta 3)."],
  ["Velocidad del medio", "Cambia v y comprueba cómo cambia la longitud de onda: λ = v / f."],
  ["Zonas de refuerzo", "Muestra dónde se refuerzan y dónde se cancelan las ondas al sumarse."],
  ["Generador de corriente alterna", "Elige voltaje máximo y frecuencia; mide Vrms, corriente y potencia media."],
  ["Resistencia de CA", "Calienta agua con la potencia media de la red: une ondas y calor."],
];
const ATAJOS = [
  [`${TECLA} + Z`, "Deshace el último cambio (con Shift lo rehace)"],
  ["Arrastrar el fondo", "Dibuja un recuadro para seleccionar varias piezas"],
  [`Shift / ${TECLA} + clic`, "Suma o quita una pieza de la selección"],
  [`${TECLA} + A`, "Selecciona todo el circuito"],
  [`${TECLA} + C / V`, "Copia y pega lo seleccionado (X corta, D duplica)"],
  ["R", "Gira la pieza seleccionada o la que vas a colocar"],
  ["Supr", "Borra lo seleccionado"],
  ["Esc", "Cancela el cable en curso o quita la selección"],
  ["Espacio + arrastrar", "Mueve la vista del tablero"],
  [`${TECLA} + rueda`, "Acerca o aleja el tablero"],
];

const CONCEPTOS = ["Voltaje", "Corriente", "Resistencia", "Ley de Ohm", "Código de colores", "Circuito en serie", "Circuito en paralelo", "Circuitos mixtos", "Potencia eléctrica", "Leyes de Kirchhoff", "Resistencia equivalente", "Capacitores", "Calor y temperatura", "Calor específico", "Q = m·c·ΔT", "Equilibrio térmico", "Calorimetría", "Cambios de fase", "Calor latente", "Efecto Joule", "Amplitud, frecuencia y periodo", "Longitud de onda", "Velocidad de una onda (v = λ·f)", "Superposición", "Interferencia constructiva y destructiva", "Corriente alterna", "Voltaje eficaz (Vrms)", "Potencia media en CA"];

const EQUIPO = ["Santiago Barrios Guerrero", "Isabel Marrugo Jurado", "Valentina Niño Solano", "David Alvarez Villalobos"];
const iniciales = (n) => n.split(" ").slice(0, 2).map((p) => p[0]).join("");

export default function Acerca({ ir }) {
  const MODULOS = [
    ["bombillo", "Comprender", "Lecciones guiadas", `${LECCIONES.length + LECCIONES_FIS.length} lecciones`, "Electricidad, calor y ondas: teoría completa, experimentos que tú modificas y ejercicios resueltos.", "Aprender"],
    ["resistencia", "Resolver", "Retos de laboratorio", `${RETOS.length + RETOS_FIS.length} retos`, "Desafíos de lo guiado a lo libre, con pistas y estrellas, en los tres módulos.", "Laboratorio"],
    ["bateria", "Construir", "Simuladores libres", "3 laboratorios abiertos", "Circuitos, mesa de calor y cubeta de ondas para probar tus propias ideas.", "Simuladores"],
    ["cable", "Aplicar", "Problemas aplicados", `${PROBLEMAS.length} problemas`, "Circuitos, capacitores, calor y ondas, paso a paso.", "Problemas"],
    ["fis:termometro", "Explorar", "Calor y calorimetría", `${LECCIONES_FIS.filter((l) => l.modulo === "calor").length} lecciones`, "Q = m·c·ΔT, equilibrio térmico, cambios de fase y efecto Joule.", "Calor"],
    ["fis:onda", "Explorar", "Ondas y corriente alterna", `${LECCIONES_FIS.filter((l) => l.modulo === "ondas").length} lecciones`, "Amplitud, frecuencia, longitud de onda, interferencia y corriente alterna.", "Ondas"],
  ];
  return (
    <div className="ini">
      <div className="ini-cont">
        <header className="ini-nav">
          <button className="ini-link" onClick={() => ir("Inicio")}>← Inicio</button>
          <nav><button className="ini-link" onClick={() => ir("Docentes")}>Para docentes</button></nav>
        </header>

        <section className="ac-hero">
          <span className="ini-kicker"><span className="ini-kicker-punto" /> ACERCA DEL PROYECTO</span>
          <h1>VOLTA, un laboratorio para <em>ver</em> la física.</h1>
          <p>VOLTA es un laboratorio interactivo de física con tres módulos basado en las dos físicas: electricidad, calor y ondas. Está pensado para aprender haciendo: en lugar de memorizar fórmulas, construyes circuitos, calientas agua, sumas ondas, cambias los valores y observas en tiempo real cómo responde cada magnitud.</p>
          <p>Nace como proyecto de la asignatura <b>Física Electricidad y Física Calor Ondas</b> con una pregunta sencilla: ¿cómo hacer visible algo que no se puede ver? La respuesta es un recorrido que combina explicación, experimentación y práctica.</p>
          <div className="ac-datos">
            <div><b>{LECCIONES.length + LECCIONES_FIS.length}</b><span>lecciones</span></div>
            <div><b>{RETOS.length + RETOS_FIS.length}</b><span>retos</span></div>
            <div><b>{PROBLEMAS.length}</b><span>problemas</span></div>
            <div><b>3</b><span>simuladores libres</span></div>
          </div>
        </section>

        <section className="ac-sec">
          <div className="ac-cab"><span className="ac-n">01</span><h2>Objetivos</h2></div>
          <div className="ac-general">
            <span className="ini-verbo">Objetivo general</span>
            <p>Facilitar la comprensión de los circuitos eléctricos, el calor y las ondas mediante un entorno interactivo donde el estudiante predice, experimenta y explica el comportamiento de cada sistema físico.</p>
          </div>
          <div className="ac-grid2">
            {OBJETIVOS.map(([t, d]) => (
              <div key={t} className="ac-obj"><span className="ac-check" aria-hidden="true">✓</span><div><h3>{t}</h3><p>{d}</p></div></div>
            ))}
          </div>
        </section>

        <section className="ac-sec">
          <div className="ac-cab"><span className="ac-n">02</span><h2>Qué encontrarás</h2></div>
          <div className="ac-mods">
            {MODULOS.map(([ico, verbo, t, cuenta, d, destino]) => (
              <button key={t} className="ac-mod" onClick={() => ir(destino)}>
                <span className="ini-ico">{ico.startsWith("fis:") ? <IconoFis tipo={ico.slice(4)} w={84} h={46} /> : <IconoCanvas tipo={ico} w={84} h={46} />}</span>
                <span className="ini-verbo">{verbo}</span>
                <h3>{t}</h3>
                <p>{d}</p>
                <span className="ac-cuenta">{cuenta} <span aria-hidden="true">→</span></span>
              </button>
            ))}
          </div>
        </section>

        <section className="ac-sec">
          <div className="ac-cab"><span className="ac-n">03</span><h2>Cómo usar VOLTA</h2></div>
          <ol className="ac-pasos">
            {PASOS.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
          </ol>
        </section>

        <section className="ac-sec">
          <div className="ac-cab"><span className="ac-n">04</span><h2>Instrucciones de los simuladores</h2></div>
          <div className="ac-sim">
            <div className="ac-caja">
              <h3>Las piezas</h3>
              <ul className="ac-piezas">
                {HERRAMIENTAS.map(([ico, t, d]) => (
                  <li key={t}><span className="ac-pieza-ico"><IconoCanvas tipo={ico} w={52} h={30} /></span><div><b>{t}</b><p>{d}</p></div></li>
                ))}
              </ul>
            </div>
            <div className="ac-col">
              <div className="ac-caja">
                <h3>Arma tu primer circuito</h3>
                <ol className="ac-mini">
                  <li>Coloca una batería y un bombillo en el tablero.</li>
                  <li>Con la herramienta <b>Cable</b>, une el + de la batería con el bombillo y regresa al −.</li>
                  <li>Cuando el camino esté cerrado, el bombillo brilla y verás la corriente circular.</li>
                  <li>Selecciona una pieza para cambiar su valor y observa cómo cambian las mediciones.</li>
                </ol>
              </div>
              <div className="ac-caja">
                <h3>Atajos de teclado</h3>
                <ul className="ac-atajos">
                  {ATAJOS.map(([k, d]) => <li key={k}><kbd>{k}</kbd><span>{d}</span></li>)}
                </ul>
              </div>
            </div>
          </div>
          <div className="ac-sim" style={{ marginTop: 14 }}>
            <div className="ac-caja">
              <h3>Laboratorio de calor: las piezas</h3>
              <ul className="ac-piezas">{PIEZAS_CALOR.map(([t, d]) => <li key={t}><span className="ac-pieza-ico"><IconoFis tipo="termometro" w={52} h={30} /></span><div><b>{t}</b><p>{d}</p></div></li>)}</ul>
            </div>
            <div className="ac-col">
              <div className="ac-caja">
                <h3>Tu primer experimento de calor</h3>
                <ol className="ac-mini">
                  <li>Elige un recipiente (A, B o C) y agrega un vaso con agua y un bloque de cobre.</li>
                  <li>Pon el cobre a 100 °C con la temperatura de la pieza y agrega un termómetro a cada cuerpo.</li>
                  <li>Pulsa <b>Simular</b> y sube la velocidad: verás cómo las dos curvas se acercan al equilibrio.</li>
                  <li>Prueba un calentador eléctrico o un mechero y mira las mesetas del cambio de fase.</li>
                </ol>
              </div>
            </div>
          </div>
          <div className="ac-sim" style={{ marginTop: 14 }}>
            <div className="ac-caja">
              <h3>Laboratorio de ondas: las piezas</h3>
              <ul className="ac-piezas">{PIEZAS_ONDAS.map(([t, d]) => <li key={t}><span className="ac-pieza-ico"><IconoFis tipo="onda" w={52} h={30} /></span><div><b>{t}</b><p>{d}</p></div></li>)}</ul>
            </div>
            <div className="ac-col">
              <div className="ac-caja">
                <h3>Tu primer experimento de ondas</h3>
                <ol className="ac-mini">
                  <li>Carga el ejemplo «Dos fuentes en fase» y mira cómo se cruzan las ondas.</li>
                  <li>Activa <b>Zonas de refuerzo</b> para ver dónde se suman y dónde se cancelan.</li>
                  <li>Cambia la fase de una fuente a 180° y observa cómo cambia el patrón.</li>
                  <li>Arrastra una sonda y mira su señal en el osciloscopio.</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="ac-sec">
          <div className="ac-cab"><span className="ac-n">05</span><h2>Conceptos que se trabajan</h2></div>
          <div className="ac-chips">{CONCEPTOS.map((c) => <span key={c}>{c}</span>)}</div>
          <p className="ac-nota"><b>Tu progreso se guarda solo en este navegador.</b> No se crean cuentas ni se envían datos. Desde <button className="ac-enlace" onClick={() => ir("Progreso")}>Mi progreso</button> puedes usar <b>Guardar copia</b> para entregarla al docente o continuar en otro equipo.</p>
        </section>

        <section className="ac-sec">
          <div className="ac-cab"><span className="ac-n">06</span><h2>Equipo</h2></div>
          <div className="ac-equipo">
            {EQUIPO.map((n) => <div key={n} className="ac-persona"><span className="ac-avatar" aria-hidden="true">{iniciales(n)}</span><b>{n}</b></div>)}
          </div>
          <dl className="ac-ficha">
            <div><dt>Asignatura</dt><dd>Física – Electricidad, calor y ondas</dd></div>
            <div><dt>Tecnologías</dt><dd>React, Vite y HTML Canvas</dd></div>
            <div><dt>Origen</dt><dd>Versión web del proyecto original en Python y CustomTkinter</dd></div>
          </dl>
        </section>

        <section className="ac-final">
          <div>
            <h2>¿Listo para tu primer experimento?</h2>
            <p>Empieza por la ruta de aprendizaje o ve directo a un simulador.</p>
          </div>
          <div className="ini-cta">
            <button className="ini-btn prim" onClick={() => ir("Ruta")}>Comenzar a explorar<span aria-hidden="true">→</span></button>
            <button className="ini-btn sec" onClick={() => ir("Simuladores")}>Probar los simuladores</button>
          </div>
        </section>

        <footer className="ini-pie">
          <span className="ini-footer-brand"><b>VOLTA</b><i /> Explora · Conecta · Comprende</span>
          <button className="ini-link" onClick={() => ir("Inicio")}>Volver al inicio</button>
        </footer>
      </div>
    </div>
  );
}
