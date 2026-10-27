import { useEffect, useRef, useState } from "react";
import * as E from "../lib/estilos.js";
import { formatearOhm, fuente } from "../lib/cv.js";
import { IconoFis } from "../componentes/IconosFisica.jsx";

const CONTENIDO = {
  serie: {
    modulo: "Electricidad", titulo: "Circuito en serie", r: [100, 200, 300],
    caracteristicas: ["Los elementos están conectados uno después de otro.", "Existe una sola trayectoria para la corriente.", "La resistencia equivalente corresponde a la suma de las resistencias.", "La corriente atraviesa todos los elementos del circuito.", "Si se interrumpe la trayectoria, deja de circular corriente en todo el circuito."],
    formula: "Req = R1 + R2 + R3 + ...",
    explicacion: "En un circuito en serie hay un único camino para la corriente, así que la misma corriente atraviesa cada resistencia. Por eso, si un elemento se abre o se desconecta (por ejemplo, un bombillo que se funde), el circuito completo deja de funcionar: es el mismo principio detrás de las series de luces antiguas, donde si un foco se quema, todos los demás se apagan.\n\nComo toda la corriente pasa por cada resistencia, para aumentar la resistencia total basta con sumar los valores individuales.",
    ejemplo: "Ejemplo: con R1=100Ω, R2=200Ω y R3=300Ω,\nReq = 100 + 200 + 300 = 600 Ω",
  },
  paralelo: {
    modulo: "Electricidad", titulo: "Circuito en paralelo", r: [100, 200, 300],
    caracteristicas: ["Los elementos están conectados en diferentes ramas.", "Existen varias trayectorias para la corriente.", "El voltaje es común entre las ramas.", "La resistencia equivalente se obtiene mediante la suma de los inversos de las resistencias."],
    formula: "1/Req = 1/R1 + 1/R2 + 1/R3 + ...",
    explicacion: "En un circuito en paralelo cada resistencia forma su propia rama entre los mismos dos puntos, así que todas comparten el mismo voltaje, pero la corriente se reparte entre las ramas según su resistencia. Por eso, si una rama se desconecta, las demás siguen funcionando con normalidad: es el mismo principio detrás de la instalación eléctrica de una casa, donde apagar una lámpara no afecta a los demás enchufes.\n\nAgregar más ramas en paralelo siempre reduce la resistencia equivalente, incluso por debajo del valor de la resistencia más pequeña.",
    ejemplo: "Ejemplo: con R1=100Ω, R2=200Ω y R3=300Ω,\n1/Req = 1/100 + 1/200 + 1/300 → Req ≈ 54.5 Ω",
  },
  calor: {
    modulo: "Calor", fis: "termometro", titulo: "Calor y temperatura",
    caracteristicas: ["La temperatura mide qué tan agitadas están las partículas.", "El calor es energía que pasa del cuerpo caliente al frío (se mide en J).", "Q depende de la masa, del material y del cambio de temperatura.", "El agua tiene un calor específico muy alto: tarda en calentarse y en enfriarse."],
    formula: "Q = m · c · ΔT",
    explicacion: "El calor específico c dice cuánta energía necesita 1 kg de una sustancia para subir 1 K. Con c = 4186 J/(kg·K) el agua guarda mucha energía; el cobre (385) casi no guarda.\n\nSi la temperatura final es mayor que la inicial, Q es positivo y el cuerpo absorbe calor; si es menor, Q es negativo y el cuerpo lo cede.",
    ejemplo: "Ejemplo: 2 kg de agua de 20 °C a 50 °C\nQ = 2 × 4186 × 30 ≈ 251 kJ",
  },
  equilibrio: {
    modulo: "Calor", fis: "mezcla", titulo: "Equilibrio térmico",
    caracteristicas: ["Dos cuerpos en contacto intercambian calor hasta igualar su temperatura.", "Sin pérdidas: Q cedido + Q absorbido = 0.", "La temperatura final es un promedio ponderado por m·c.", "Un calorímetro o un termo intentan aislar el sistema."],
    formula: "Tf = (m₁c₁T₁ + m₂c₂T₂) / (m₁c₁ + m₂c₂)",
    explicacion: "El cuerpo con más capacidad térmica (m·c) cambia poco su temperatura y arrastra al otro hacia la suya. Por eso una pieza de metal caliente casi no calienta un vaso de agua.\n\nEsta fórmula supone que ninguno cambia de fase y que no hay pérdidas hacia el ambiente.",
    ejemplo: "Ejemplo: 0,2 kg de cobre a 100 °C en 0,5 kg de agua a 20 °C\nTf ≈ 22,8 °C",
  },
  fases: {
    modulo: "Calor", fis: "fases", titulo: "Cambios de fase",
    caracteristicas: ["Durante un cambio de fase la temperatura no cambia.", "La energía rompe enlaces entre moléculas en lugar de agitarlas.", "Fusión del agua: Lf = 334 kJ/kg. Vaporización: Lv = 2256 kJ/kg.", "En un problema con varias etapas se calcula cada tramo y se suman."],
    formula: "Q = m · L",
    explicacion: "La curva de calentamiento del agua tiene tramos inclinados (la temperatura sube) y dos tramos planos: la fusión en 0 °C y la ebullición en 100 °C. El tramo de la vaporización es casi siete veces más largo que el de la fusión.",
    ejemplo: "Ejemplo: fundir 0,5 kg de hielo a 0 °C\nQ = 0,5 × 334 000 = 167 kJ",
  },
  joule: {
    modulo: "Calor", fis: "joule", titulo: "Efecto Joule",
    caracteristicas: ["Una corriente que atraviesa una resistencia la calienta.", "La potencia es P = V²/R = V·I.", "La energía entregada en un tiempo t es Q = P·t.", "Si el calor llega todo al agua: P·t = m·c·ΔT."],
    formula: "P = V² / R      Q = P · t",
    explicacion: "Es el puente entre electricidad y calor: las estufas, los hervidores y los secadores son resistencias que se calientan. Y es la razón por la que los bombillos y las resistencias se funden si reciben más potencia de la que soportan.",
    ejemplo: "Ejemplo: 24 Ω a 120 V durante 2 min\nP = 600 W → Q = 72 kJ",
  },
  onda: {
    modulo: "Ondas", fis: "onda", titulo: "Amplitud, frecuencia y velocidad",
    caracteristicas: ["La amplitud A es el máximo desplazamiento desde el equilibrio.", "El periodo T es el tiempo de una oscilación; la frecuencia f, las oscilaciones por segundo (Hz).", "La longitud de onda λ es la distancia entre dos crestas.", "En un medio fijo, más frecuencia significa menos longitud de onda."],
    formula: "T = 1 / f      v = λ · f",
    explicacion: "Una onda transporta energía sin transportar materia. La velocidad depende del medio; la frecuencia la fija la fuente. De ahí sale la longitud de onda: λ = v / f.\n\nLa amplitud no cambia la velocidad: solo la cantidad de energía que lleva la onda.",
    ejemplo: "Ejemplo: λ = 0,5 m y f = 6 Hz\nv = 0,5 × 6 = 3 m/s",
  },
  interferencia: {
    modulo: "Ondas", fis: "interf", titulo: "Superposición e interferencia",
    caracteristicas: ["Cuando dos ondas coinciden, sus desplazamientos se suman.", "En fase (0°): se refuerzan, A = A₁ + A₂.", "En oposición (180°): se restan, A = |A₁ − A₂|.", "Con amplitudes iguales y 180° se cancelan por completo."],
    formula: "A = √(A₁² + A₂² + 2·A₁·A₂·cos Δφ)",
    explicacion: "El desfase Δφ dice cuánto va una onda adelantada de la otra. Con dos fuentes, el patrón alterna zonas de refuerzo y zonas de cancelación. Los audífonos con cancelación de ruido usan interferencia destructiva.",
    ejemplo: "Ejemplo: 2 cm y 3 cm a 180°\nA = |3 − 2| = 1 cm",
  },
  alterna: {
    modulo: "Ondas", fis: "alterna", titulo: "Corriente alterna",
    caracteristicas: ["El voltaje de la red oscila como una onda seno (60 Hz).", "El voltaje eficaz es Vrms = Vmax/√2.", "El valor eficaz equivale a una batería que calentaría igual.", "La potencia media es la mitad de la máxima: Vrms²/R."],
    formula: "Vrms = Vmax / √2",
    explicacion: "Cuando se dice «120 V» en un enchufe se habla de Vrms; el pico es de unos 170 V. La potencia en una resistencia oscila entre 0 y Vmax²/R, y su promedio es Vrms²/R: es lo que realmente calienta.",
    ejemplo: "Ejemplo: Vmax = 170 V sobre 100 Ω\nVrms ≈ 120 V → P ≈ 144 W",
  },
};

const FUENTE = (t, b) => fuente(t, !!b);
function dibujar(ctx, w, h, tipo, rs) {
  ctx.clearRect(0, 0, w, h);
  const cab = E.COLOR_TEXTO_SECUNDARIO, caja = E.COLOR_FONDO_TARJETA, borde = E.COLOR_ACENTO, tx = E.COLOR_TEXTO_PRINCIPAL;
  const lin = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = cab; ctx.lineWidth = 2; ctx.stroke(); };
  const txt = (t, x, y, f, c) => { ctx.font = f; ctx.fillStyle = c; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(t, x, y); };
  const rect = (x0, y0, x1, y1) => { ctx.fillStyle = caja; ctx.fillRect(x0, y0, x1 - x0, y1 - y0); ctx.strokeStyle = borde; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0); };
  const n = rs.length;
  if (tipo === "serie") {
    const mx = 46, my = 56, xi = mx, xd = w - mx, ya = my, yb = h - my, ym = (ya + yb) / 2;
    lin(xi, ya, xd, ya); lin(xd, ya, xd, yb); lin(xd, yb, xi, yb); lin(xi, yb, xi, ya);
    txt("V", xi - 22, ym, FUENTE(13, 1), tx); txt("+", xi, ya - 14, FUENTE(12, 1), E.COLOR_EXITO); txt("−", xi, yb + 14, FUENTE(12, 1), E.COLOR_ERROR);
    const aw = 58, ah = 34, paso = (xd - xi) / (n + 1);
    rs.forEach((r, i) => { const cx = xi + paso * (i + 1); rect(cx - aw / 2, ya - ah / 2, cx + aw / 2, ya + ah / 2); txt(`R${i + 1}`, cx, ya - ah / 2 - 12, FUENTE(11, 1), tx); txt(formatearOhm(r), cx, ya, FUENTE(10), cab); });
  } else {
    const mx = Math.min(60, w * 0.18), my = Math.max(30, h * 0.28), yf = my * 0.35;
    const xi = mx, xd = w - mx, ya = my, yb = h - my;
    lin(xi, ya, xi, yb); lin(xd, ya, xd, yb);
    txt("+", xi, yf, FUENTE(12, 1), E.COLOR_EXITO); txt("−", xd, yf, FUENTE(12, 1), E.COLOR_ERROR); txt("V", (xi + xd) / 2, yf, FUENTE(12, 1), tx);
    const py = n === 1 ? yb - ya : (yb - ya) / (n - 1);
    const ys = n === 1 ? [(ya + yb) / 2] : rs.map((_, i) => ya + py * i);
    const ah = Math.min(30, Math.max(14, py * 0.42)), aw = Math.min(56, w * 0.22), cx = (xi + xd) / 2;
    rs.forEach((r, i) => { const y = ys[i]; lin(xi, y, cx - aw / 2, y); lin(cx + aw / 2, y, xd, y); rect(cx - aw / 2, y - ah / 2, cx + aw / 2, y + ah / 2);
      txt(`R${i + 1}`, cx, y - (ah / 2 + 9), FUENTE(py >= 40 ? 11 : 9, 1), tx); txt(formatearOhm(r), cx, y, FUENTE(py >= 40 ? 10 : 8), cab); });
  }
}

const Grande = ({ tipo, alto }) => <div style={{ height: alto, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--acento)", background: "var(--lienzo)", borderRadius: 8 }}><IconoFis tipo={tipo} w={alto * 1.5} h={alto * 0.82} /></div>;
function Diagrama({ tipo, rs, alto }) {
  const ref = useRef(null), cont = useRef(null);
  const [w, setW] = useState(300);
  useEffect(() => { const ro = new ResizeObserver(() => cont.current && setW(Math.max(200, cont.current.clientWidth))); ro.observe(cont.current); return () => ro.disconnect(); }, []);
  useEffect(() => {
    const c = ref.current, dpr = window.devicePixelRatio || 1;
    c.width = w * dpr; c.height = alto * dpr;
    const ctx = c.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dibujar(ctx, w, alto, tipo, rs);
  }, [w, alto, tipo, rs]);
  return <div ref={cont}><canvas ref={ref} style={{ width: w, height: alto, display: "block" }} /></div>;
}

export default function Conceptos({ ir }) {
  const [det, setDet] = useState(null);
  const c = det && CONTENIDO[det];
  return (
    <div className="pantalla" style={{ overflowY: "auto" }}>
      <div className="cab">
        <button className="btn contorno med" style={{ marginTop: 6 }} onClick={() => (det ? setDet(null) : ir("Aprender"))}>← {det ? "Volver al repaso" : "Volver a Aprender"}</button>
        <div className="titulos"><h1 style={{ fontSize: 28 }}>{det ? c.titulo : "Antes de comenzar"}</h1><div className="sub" style={{ fontSize: 13 }}>{det ? `Repaso de conceptos · ${c.modulo}` : "Repasa los conceptos de circuitos, calor y ondas que se trabajan en VOLTA."}</div></div>
        <button className="btn prim med" style={{ marginTop: 6 }} onClick={() => ir("Simuladores")}>Ir a los simuladores</button>
      </div>
      {!det ? (
        <div style={{ maxWidth: 980, margin: "0 auto", width: "100%" }}>
          {["Electricidad", "Calor", "Ondas"].map((g) => (
            <div key={g}>
              <div className="nivel-cab" style={{ padding: "10px 24px 0" }}><span className="chip">{g.toUpperCase()}</span></div>
              <div className="grid3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                {Object.entries(CONTENIDO).filter(([, x]) => x.modulo === g).map(([k, x]) => (
                  <div key={k} className="tarjeta" style={{ padding: 18, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ margin: "0 0 8px", fontSize: 18 }}>{x.titulo}</h3>
                    {x.fis ? <Grande tipo={x.fis} alto={120} /> : <Diagrama tipo={k} rs={x.r} alto={150} />}
                    <ul style={{ paddingLeft: 18, margin: "12px 0", fontSize: 13, flex: 1 }}>{x.caracteristicas.map((t, i) => <li key={i} style={{ marginBottom: 4 }}>{t}</li>)}</ul>
                    <button className="btn contorno med completo" onClick={() => setDet(k)}>Explorar</button>
                  </div>))}
              </div>
            </div>))}
        </div>
      ) : (
        <div className="grid3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", maxWidth: 980, margin: "0 auto", width: "100%" }}>
          <div className="tarjeta" style={{ padding: 18 }}>
            {c.fis ? <Grande tipo={c.fis} alto={170} /> : <Diagrama tipo={det} rs={c.r} alto={190} />}
            <div style={{ textAlign: "center", color: "var(--acento)", fontWeight: 700, fontSize: 20, margin: "10px 0 4px" }}>{c.formula}</div>
            <div className="txt sm" style={{ textAlign: "center", color: "var(--texto2)" }}>{c.ejemplo}</div>
          </div>
          <div className="tarjeta" style={{ padding: 18 }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 18 }}>¿Por qué se comporta así?</h3>
            <p className="txt" style={{ fontSize: 14 }}>{c.explicacion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
