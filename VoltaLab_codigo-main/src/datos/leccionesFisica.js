// Lecciones de Calor y Ondas, con el mismo formato de tarjetas que las de electricidad.
import { MODELOS } from "../lib/modelosFisica.js";
import { fmt, fmtE } from "../lib/formatoFis.js";

const AZUL = "#246B8E", AMARILLO = "#C98A00", MORADO = "#8A5CC7", VERDE = "#4D876C", ROJO = "#D0493F";
const n = (x, d = 1) => fmt(x, d);
const NOMBRE_MAT = { agua: "agua", aceite: "aceite", aluminio: "aluminio", hierro: "hierro", cobre: "cobre", plomo: "plomo" };

// ---------- contexto de las metas (igual idea que Contexto de lecciones.js) ----------
const redondo = (x) => (typeof x === "number" ? Math.round(x * 1e6) / 1e6 : x);
export const cercaFis = (a, b, tol = 0.01) => Math.abs(a - b) <= tol * Math.max(Math.abs(b), 1e-12);
const cumple = (e, k, x) => (typeof x === "string" ? e[k] === x : typeof e[k] === "number" && cercaFis(e[k], x));
export class CtxFis {
  constructor(e, historial) { this.e = e; this.historial = historial; }
  distintos(k) { return new Set(this.historial.map((h) => redondo(h[k]))).size; }
  visto(cond) {
    for (let i = this.historial.length - 1; i >= 0; i--) if (Object.entries(cond).every(([k, x]) => cumple(this.historial[i], k, x))) return this.historial[i];
    return null;
  }
  ahora(cond = {}) { return !!this.e && Object.entries(cond).every(([k, x]) => cumple(this.e, k, x)); }
}

// ---------- ayudas para escribir lecciones ----------
const opt = (id, etiqueta, opciones, unidad = "") => ({ id, etiqueta, unidad, opciones: opciones.map((o) => (Array.isArray(o) ? o : [o, unidad ? `${fmt(o, Number.isInteger(o) ? 0 : 1)} ${unidad}` : String(o)])) });
const MAT = (id = "mat", etiqueta = "Material", lista = ["agua", "aceite", "aluminio", "cobre"]) => ({ id, etiqueta, unidad: "", opciones: lista.map((k) => [k, k[0].toUpperCase() + k.slice(1)]) });
const med = (id, titulo, color, de, f) => ({ id, titulo, color, de, f });
const kJ = (e) => `${n(e / 1000, 1)} kJ`;

// Busca por fuerza bruta las combinaciones de controles que cumplen la meta de un reto de la lección.
export function soluciones(lec, t) {
  if (t.solucion) return [t.solucion];
  const ids = lec.controles.map((c) => c.id), lista = [];
  const rec = (i, v) => {
    if (i === ids.length) {
      const e = { ...v, ...MODELOS[lec.escena](v) };
      try { if (t.meta(new CtxFis(e, [e]))) lista.push({ ...Object.fromEntries(ids.map((k) => [k, v[k]])) }); } catch { /* */ }
      return;
    }
    for (const [val] of lec.controles[i].opciones) rec(i + 1, { ...v, [ids[i]]: val });
  };
  rec(0, { ...lec.inicial });
  return lista;
}

export const LECCIONES_FIS = [
  // ====================================================== CALOR
  {
    clave: "calor_l1", modulo: "calor", escena: "calor", titulo: "Calor y temperatura", svg: "termometro", resumen: "Q = m·c·ΔT: cuánta energía cuesta calentar algo.",
    inicial: { mat: "agua", m: 1, T0: 20, Tf: 60 },
    controles: [MAT(), opt("m", "Masa", [0.5, 1, 2, 3], "kg"), opt("Tf", "T final", [30, 40, 50, 60, 80], "°C")],
    medidor: [med("Q", "Calor Q", MORADO, (e) => e.Q, kJ), med("c", "Calor específico", AMARILLO, (e) => e.c, (x) => `${fmt(x, 0)} J/kg·K`), med("dT", "Variación ΔT", AZUL, (e) => e.dT, (x) => `${fmt(x, 0)} K`)],
    formula: (e) => `Q = m·c·ΔT = ${n(e.m, 1)} kg × ${fmt(e.c, 0)} J/(kg·K) × ${fmt(e.dT, 0)} K = ${fmtE(e.Q)}`,
    tarjetas: [
      { tipo: "idea", titulo: "Calor no es temperatura",
        texto: "La TEMPERATURA mide qué tan agitadas están las partículas de un cuerpo: cuanto más caliente, más rápido se mueven. El CALOR es la energía que pasa de un cuerpo a otro por culpa de esa diferencia de temperatura. Se mide en julios (J).\n\nEn el tablero tienes un cuerpo que empieza a 20 °C y que se calienta hasta la temperatura final que elijas. Los termómetros muestran el antes y el después.",
        fijate: ["El termómetro de la izquierda es la temperatura inicial (fija en 20 °C).", "El de la derecha es la final: la eliges tú.", "La ficha CALOR Q dice cuánta energía recibió el cuerpo."],
        analogia: "Dos ollas en la estufa: una con un poco de agua y otra con mucha. Las dos reciben el mismo fuego (calor), pero la pequeña sube más rápido su temperatura." },
      { tipo: "idea", titulo: "La fórmula del calor",
        texto: "La energía que necesita un cuerpo para cambiar de temperatura depende de tres cosas: cuánta masa tiene (m), de qué material es (calor específico c) y cuántos grados quieres que cambie (ΔT).",
        formula: "Q = m · c · ΔT", simbolos: [["Q", "calor (J)"], ["m", "masa (kg)"], ["c", "calor específico (J/kg·K)"], ["ΔT", "T final − T inicial (K)"]],
        ejemplo: { enunciado: "¿Cuánta energía necesitan 2 kg de agua para pasar de 20 °C a 50 °C?", pasos: ["ΔT = 50 − 20 = 30 K.", "Q = 2 × 4186 × 30.", "Q = 251 160 J ≈ 251 kJ."] } },
      { tipo: "explora", titulo: "Más masa, más energía", texto: "Cambia la masa del cuerpo (abajo del tablero) y prueba al menos 3 valores. Mira la ficha de CALOR Q.",
        meta: (ctx) => ctx.distintos("m") >= 3, progreso: (ctx) => `Masas probadas: ${Math.min(ctx.distintos("m"), 3)} de 3`,
        descubre: "A más masa, más energía hace falta para lograr el mismo cambio de temperatura. Tiene sentido: hay más partículas que agitar. La temperatura final y el material no cambiaron: solo la masa.", resaltar: "Q" },
      { tipo: "explora", titulo: "Duplica la masa",
        texto: "Con agua y T final de 60 °C, pon la masa en 1 kg y mira Q. Luego ponla en 2 kg (el doble).",
        meta: (ctx) => !!(ctx.visto({ mat: "agua", Tf: 60, m: 1 }) && ctx.visto({ mat: "agua", Tf: 60, m: 2 })),
        progreso: (ctx) => (ctx.visto({ mat: "agua", Tf: 60, m: 1 }) && !ctx.visto({ mat: "agua", Tf: 60, m: 2 }) ? "Ahora pon 2 kg" : ctx.visto({ mat: "agua", Tf: 60, m: 2 }) ? "Ahora pon 1 kg" : "Pon agua, 60 °C y 1 kg"),
        descubre: (ctx) => `Con 1 kg: ${fmtE(ctx.visto({ mat: "agua", Tf: 60, m: 1 }).Q)}. Con 2 kg: ${fmtE(ctx.visto({ mat: "agua", Tf: 60, m: 2 }).Q)}. El doble de masa necesita exactamente el DOBLE de calor: Q es proporcional a m.`, resaltar: "Q" },
      { tipo: "explora", titulo: "El agua se resiste a calentarse",
        texto: "Con 1 kg y T final de 60 °C, compara el agua con el cobre: elige «Cobre» en el control de material.",
        meta: (ctx) => !!(ctx.visto({ mat: "agua", m: 1, Tf: 60 }) && ctx.visto({ mat: "cobre", m: 1, Tf: 60 })),
        progreso: (ctx) => (ctx.visto({ mat: "cobre", m: 1, Tf: 60 }) ? "Ahora vuelve al agua" : "Elige cobre con 1 kg y 60 °C"),
        descubre: (ctx) => `Para el mismo cambio, el agua pide ${fmtE(ctx.visto({ mat: "agua", m: 1, Tf: 60 }).Q)} y el cobre solo ${fmtE(ctx.visto({ mat: "cobre", m: 1, Tf: 60 }).Q)}: unas 11 veces menos. El calor específico del agua (4186) es enorme comparado con el del cobre (385). El agua guarda mucha energía y tarda en calentarse y en enfriarse.`, resaltar: "c" },
      { tipo: "reto", titulo: "Reto: 250 kJ con agua", texto: "Elige la masa y la temperatura final para que el agua reciba unos 250 kJ (±2 %).",
        meta: (ctx) => ctx.ahora({ mat: "agua" }) && Math.abs(ctx.e.Q / 1000 - 250) <= 5,
        pistas: ["Q = m·c·ΔT con c = 4186 y T inicial de 20 °C.", "Necesitas m·ΔT ≈ 250 000 / 4186 ≈ 60. Por ejemplo, 2 kg por 30 K.", "Sirven 1 kg y 80 °C (ΔT = 60 K), 2 kg y 50 °C (ΔT = 30 K) o 3 kg y 40 °C (ΔT = 20 K)."],
        logro: (ctx) => `Con ${n(ctx.e.m, 1)} kg y ΔT = ${fmt(ctx.e.dT, 0)} K el agua recibe ${fmtE(ctx.e.Q)}. Combinaste masa y temperatura para llegar a la energía pedida: eso es usar Q = m·c·ΔT al revés.` },
      { tipo: "pregunta", texto: "Dos bloques de 1 kg, uno de agua y otro de cobre, reciben la misma energía. ¿Cuál sube más su temperatura?",
        opciones: [["cobre", "El cobre", "Correcto: su calor específico es 11 veces menor, así que la misma energía produce un ΔT mucho mayor."], ["agua", "El agua", "Al revés: el agua necesita MÁS energía por grado, así que sube menos."], ["igual", "Los dos igual", "Depende del material: lo viste al comparar el agua con el cobre."]], correcta: "cobre" },
      { tipo: "resumen", puntos: ["El calor es energía que pasa por una diferencia de temperatura (J).", "Q = m · c · ΔT: crece con la masa, el calor específico y el cambio de temperatura.", "El agua tiene un calor específico muy alto: tarda en calentarse y en enfriarse."], formula: "Q = m · c · ΔT" },
    ],
  },
  {
    clave: "calor_l2", modulo: "calor", escena: "mezcla", titulo: "Equilibrio térmico", svg: "mezcla", resumen: "Qué temperatura queda al juntar dos cuerpos.",
    inicial: { matA: "cobre", mA: 0.5, TA: 100, matB: "agua", mB: 0.5, TB: 20 },
    controles: [MAT("matA", "Cuerpo A", ["agua", "aluminio", "hierro", "cobre", "plomo"]), opt("mA", "Masa de A", [0.2, 0.5, 1, 2], "kg"), opt("TA", "T de A", [60, 80, 100], "°C"), opt("mB", "Masa de agua B", [0.5, 1, 2], "kg")],
    medidor: [med("Tfin", "Temp. final", VERDE, (e) => e.Tfin, (x) => `${fmt(x, 1)} °C`), med("Qa", "Calor de A", ROJO, (e) => e.Qa, kJ), med("Qb", "Calor de B", AZUL, (e) => e.Qb, kJ)],
    formula: (e) => `Tf = (mₐcₐTₐ + m_b c_b T_b) / (mₐcₐ + m_b c_b) = ${fmt(e.Tfin, 2)} °C     QA + QB = ${fmtE(e.Qa + e.Qb)}`,
    tarjetas: [
      { tipo: "idea", titulo: "Dos cuerpos, una sola temperatura",
        texto: "Si juntas un cuerpo caliente (A) con uno frío (B), el caliente CEDE calor y el frío lo ABSORBE, hasta que los dos quedan a la misma temperatura. Eso se llama equilibrio térmico.\n\nAquí tienes un cuerpo A (que puedes cambiar) dentro de un recipiente aislado con 0,5 kg de agua a 20 °C. Si nada se pierde, toda la energía que sale de A entra al agua.",
        fijate: ["La ficha TEMP. FINAL es la temperatura de equilibrio.", "Calor de A es negativo (cede) y calor de B es positivo (absorbe).", "La suma de los dos calores es cero: la energía se conserva."],
        analogia: "Como dos vasos comunicantes con agua a distinta altura: el agua pasa del más alto al más bajo hasta que los niveles se igualan." },
      { tipo: "idea", titulo: "Un promedio con pesos",
        texto: "La temperatura final es un promedio de las dos temperaturas iniciales, pero ponderado por m·c (la capacidad térmica de cada cuerpo): el cuerpo que más energía necesita por grado «pesa» más y decide más.",
        formula: "Tf = (mₐcₐTₐ + m_b c_b T_b) / (mₐcₐ + m_b c_b)", simbolos: [["m·c", "capacidad térmica (J/K)"], ["Tₐ, T_b", "temperaturas iniciales"], ["Tf", "temperatura de equilibrio"]],
        ejemplo: { enunciado: "0,2 kg de cobre a 100 °C caen en 0,5 kg de agua a 20 °C. ¿Temperatura final?", pasos: ["m·c del cobre: 0,2 × 385 = 77. Del agua: 0,5 × 4186 = 2093.", "Tf = (77 × 100 + 2093 × 20) / (77 + 2093).", "Tf = 49 560 / 2170 ≈ 22,8 °C."] } },
      { tipo: "explora", titulo: "Prueba distintos materiales", texto: "Cambia el material de A y prueba al menos 3 distintos. Fíjate en la temperatura final y en cuánto calor cede A.",
        meta: (ctx) => ctx.distintos("matA") >= 3, progreso: (ctx) => `Materiales probados: ${Math.min(ctx.distintos("matA"), 3)} de 3`,
        descubre: (ctx) => `Aunque A parte de 100 °C, la temperatura final casi no cambia con los metales: el agua (0,5 kg × 4186 = 2093 J/K) tiene una capacidad térmica mucho mayor que la de la pieza metálica. Y siempre se cumple: Calor de A + Calor de B = 0.`, resaltar: "Tfin" },
      { tipo: "explora", titulo: "Agua con agua", texto: "Pon A como agua, 1 kg, 80 °C, y la masa de B en 1 kg. Son dos masas iguales del mismo líquido.",
        meta: (ctx) => ctx.ahora({ matA: "agua", mA: 1, mB: 1, TA: 80 }),
        progreso: () => "Agua en A, 1 kg, 80 °C y B con 1 kg",
        descubre: (ctx) => `Mezclar 1 kg a 80 °C con 1 kg a 20 °C da ${fmt(ctx.e.Tfin, 1)} °C: justo el promedio simple. Con el mismo material y la misma masa, el «peso» de cada una es igual. Cuando algo cambia (otro material u otra masa), el promedio se inclina hacia el cuerpo con más m·c.`, resaltar: "Tfin" },
      { tipo: "reto", titulo: "Reto: equilibrio en 30 °C", texto: "Elige el material, la masa y la temperatura de A para que la mezcla quede en 30 °C (±1,5 °C).",
        meta: (ctx) => Math.abs(ctx.e.Tfin - 30) <= 1.5,
        pistas: ["Para llegar a 30 °C el agua debe subir 10 K: necesita Q = 0,5 × 4186 × 10 ≈ 21 kJ.", "A debe ceder ese calor: mA·cA·(TA − 30) = 21 kJ. Mira qué materiales y masas lo permiten.", "Mira las combinaciones iluminadas en los controles: más masa o más calor específico acercan la mezcla a 30 °C."],
        logro: (ctx) => `Con ${n(ctx.e.mA, 1)} kg de ${NOMBRE_MAT[ctx.e.matA]} a ${fmt(ctx.e.TA, 0)} °C la mezcla queda en ${fmt(ctx.e.Tfin, 1)} °C. A cedió ${fmtE(-ctx.e.Qa)} y B absorbió esa misma energía.` },
      { tipo: "pregunta", texto: "Una pieza de plomo a 100 °C cae en un vaso con agua fría. ¿Por qué el agua casi no se calienta?",
        opciones: [["cap", "Porque el agua tiene mucha más capacidad térmica (m·c) que el plomo", "Correcto: el plomo (c = 129) cede poca energía al enfriarse; el agua (c = 4186) necesita mucha para subir un grado."], ["mas", "Porque el plomo es un mal conductor", "No es cuestión de conducción: hablamos de cuánta energía puede ceder, y eso depende de m·c."], ["nada", "Porque el calor desaparece", "El calor nunca desaparece: Q cedido + Q absorbido = 0."]], correcta: "cap" },
      { tipo: "resumen", puntos: ["Dos cuerpos en contacto llegan a la misma temperatura: el equilibrio térmico.", "Q cedido + Q absorbido = 0 (sin pérdidas).", "La temperatura final es un promedio ponderado por m·c."], formula: "Tf = (m₁c₁T₁ + m₂c₂T₂) / (m₁c₁ + m₂c₂)" },
    ],
  },
  {
    clave: "calor_l3", modulo: "calor", escena: "fases", titulo: "Cambios de fase", svg: "fases", resumen: "Por qué la temperatura se detiene mientras algo se funde o hierve.",
    inicial: { m: 1, T0: -20, Tf: 120 },
    controles: [opt("m", "Masa", [0.5, 1, 2], "kg"), opt("T0", "T inicial", [-30, -20, -10, 0, 20], "°C"), opt("Tf", "T final", [30, 60, 100, 120], "°C")],
    medidor: [med("Q", "Calor total", MORADO, (e) => e.Q, kJ), med("Qf", "Fusión", AZUL, (e) => e.Qf, (x) => (x ? kJ(x) : "—")), med("Qv", "Vaporización", ROJO, (e) => e.Qv, (x) => (x ? kJ(x) : "—"))],
    formula: (e) => `Fusión: m·Lf = ${n(e.m, 1)} × 334 kJ/kg${e.Qf ? ` = ${kJ(e.Qf)}` : " (no hay)"}     Vaporización: m·Lv = ${n(e.m, 1)} × 2256 kJ/kg${e.Qv ? ` = ${kJ(e.Qv)}` : " (no hay)"}`,
    tarjetas: [
      { tipo: "idea", titulo: "La temperatura se detiene",
        texto: "Calienta un trozo de hielo: su temperatura sube hasta 0 °C. Ahí empieza a fundirse y, aunque sigas dándole calor, la temperatura se queda quieta en 0 °C hasta que todo el hielo es agua. Con la ebullición pasa lo mismo en 100 °C.\n\nEn el tablero tienes la curva de calentamiento del agua: temperatura contra calor aportado. Las partes planas son los cambios de fase.",
        fijate: ["Los tramos inclinados son calentamientos (la temperatura sube).", "Los tramos planos son cambios de fase (la temperatura no cambia).", "La tabla de abajo muestra el calor de cada tramo."],
        analogia: "Como una escalera con rellanos: en los tramos inclinados subes de temperatura; en los rellanos gastas energía sin subir, porque la usas para romper enlaces entre moléculas." },
      { tipo: "idea", titulo: "Calor latente",
        texto: "La energía de un cambio de fase es proporcional a la masa. Para el agua: fusión Lf = 334 kJ/kg y vaporización Lv = 2256 kJ/kg. Vaporizar cuesta casi siete veces más que fundir.",
        formula: "Q = m · L", simbolos: [["Q", "calor del cambio de fase (J)"], ["m", "masa (kg)"], ["L", "calor latente (J/kg)"]],
        ejemplo: { enunciado: "¿Cuánta energía lleva 0,5 kg de hielo a −20 °C hasta agua a 0 °C?", pasos: ["Calentar el hielo: 0,5 × 2100 × 20 = 21 000 J.", "Fundirlo: 0,5 × 334 000 = 167 000 J.", "Total = 188 000 J = 188 kJ."] } },
      { tipo: "explora", titulo: "Recorre la curva", texto: "Cambia la temperatura final y prueba al menos 3 valores distintos. Mira cómo aparecen o desaparecen las partes planas.",
        meta: (ctx) => ctx.distintos("Tf") >= 3, progreso: (ctx) => `Valores probados: ${Math.min(ctx.distintos("Tf"), 3)} de 3`,
        descubre: "Con T final de 30 o 60 °C solo hay una meseta (la fusión). Con 100 °C la curva llega a la ebullición pero aún no empieza a vaporizar. Con 120 °C aparece la segunda meseta, enorme: la vaporización.", resaltar: "Q" },
      { tipo: "explora", titulo: "Vaporizar cuesta mucho", texto: "Con 1 kg, pon T inicial en 20 °C y T final en 120 °C para ver solo agua líquida pasando a vapor.",
        meta: (ctx) => ctx.ahora({ m: 1, T0: 20, Tf: 120 }), progreso: () => "Pon 1 kg, 20 °C y 120 °C",
        descubre: (ctx) => `Para vaporizar 1 kg se necesitan ${fmtE(ctx.e.Qv)}, mientras que calentar el agua de 20 a 100 °C apenas cuesta ${fmtE(ctx.e.Q - ctx.e.Qv - 1 * 2010 * 20)}. La vaporización es la parte más cara de todo el recorrido.`, resaltar: "Qv" },
      { tipo: "reto", titulo: "Reto: unos 400 kJ", texto: "Elige masa y temperaturas para que el calor total sea de unos 400 kJ (±2 %).",
        meta: (ctx) => Math.abs(ctx.e.Q / 1000 - 400) <= 8,
        pistas: ["La fusión sola, con 1 kg, ya cuesta 334 kJ. ¿Una masa menor te deja espacio para calentar?", "Con 0,5 kg: calentar el hielo 21 kJ + fundir 167 kJ + calentar el agua hasta 100 °C ≈ 209 kJ.", "0,5 kg, de −20 °C a 100 °C: ≈ 397 kJ."],
        logro: (ctx) => `Con ${n(ctx.e.m, 1)} kg el recorrido completo cuesta ${fmtE(ctx.e.Q)}, de los cuales ${fmtE(ctx.e.Qf)} son solo de fusión.` },
      { tipo: "pregunta", texto: "Un trozo de hielo se está fundiendo a 0 °C sobre una estufa. Mientras se funde, su temperatura…",
        opciones: [["const", "Se mantiene en 0 °C", "Correcto: toda la energía se usa en el cambio de fase, no en subir la temperatura."], ["sube", "Sube poco a poco", "Eso pasa con el hielo antes de llegar a 0 °C y con el agua después. Durante la fusión se queda quieta."], ["baja", "Baja", "El hielo recibe calor, así que no puede enfriarse."]], correcta: "const" },
      { tipo: "resumen", puntos: ["En un cambio de fase la temperatura no cambia aunque se aporte calor.", "Q = m · L: Lf = 334 kJ/kg (fusión) y Lv = 2256 kJ/kg (vaporización).", "En problemas con varias etapas se calcula cada tramo y se suman."], formula: "Q = m · c · ΔT   ·   Q = m · L" },
    ],
  },
  {
    clave: "calor_l4", modulo: "calor", escena: "joule", titulo: "De la electricidad al calor", svg: "joule", resumen: "Efecto Joule: P = V²/R y Q = P·t.",
    inicial: { V: 120, R: 24, t: 120, m: 0.5, T0: 20, eta: 1 },
    controles: [opt("V", "Voltaje", [60, 120, 240], "V"), opt("R", "Resistencia", [12, 24, 48], "Ω"), opt("t", "Tiempo", [60, 120, 240], "s")],
    medidor: [med("P", "Potencia", MORADO, (e) => e.P, (x) => `${fmt(x, 0)} W`), med("Q", "Calor Q", AMARILLO, (e) => e.Q, kJ), med("Tfin", "Temp. final", ROJO, (e) => e.Tfin, (x) => (x >= 100 ? "100 °C (hierve)" : `${fmt(x, 1)} °C`))],
    formula: (e) => `P = V²/R = ${fmt(e.V, 0)}² / ${fmt(e.R, 0)} = ${fmt(e.P, 0)} W     Q = P·t = ${fmt(e.P, 0)} × ${fmt(e.t, 0)} = ${fmtE(e.Q)}`,
    tarjetas: [
      { tipo: "idea", titulo: "Cuando la corriente calienta",
        texto: "Cuando una corriente atraviesa una resistencia, la energía eléctrica se convierte en calor: es el efecto Joule. Así funcionan las estufas, los hervidores y los secadores de pelo.\n\nEn el tablero hay un calentador (una resistencia) sumergido en 0,5 kg de agua a 20 °C. Tú eliges el voltaje, la resistencia y cuánto tiempo está encendido.",
        fijate: ["La ficha POTENCIA es la rapidez con la que la resistencia entrega energía.", "Calor Q es la energía total entregada: potencia por tiempo.", "El vaso muestra cómo sube la temperatura del agua."],
        analogia: "La potencia es como el caudal de un grifo: 600 W son 600 julios de energía cada segundo. El tiempo es cuánto lo dejas abierto." },
      { tipo: "idea", titulo: "Potencia y energía",
        texto: "Ya conoces P = V · I y la ley de Ohm. Juntas dan P = V² / R. La energía que entrega en un tiempo t es Q = P·t. Si todo ese calor llega al agua, P·t = m·c·ΔT.",
        formula: "P = V² / R     Q = P · t", simbolos: [["P", "potencia (W)"], ["V", "voltaje (V)"], ["R", "resistencia (Ω)"], ["t", "tiempo (s)"]],
        ejemplo: { enunciado: "Un calentador de 24 Ω a 120 V durante 2 minutos. ¿Qué calor entrega?", pasos: ["P = 120² / 24 = 600 W.", "t = 2 min = 120 s.", "Q = 600 × 120 = 72 000 J = 72 kJ."] } },
      { tipo: "explora", titulo: "Duplica el voltaje", texto: "Con R = 24 Ω y t = 120 s, pon el voltaje en 60 V y mira la potencia. Luego en 120 V (el doble).",
        meta: (ctx) => !!(ctx.visto({ V: 60, R: 24, t: 120 }) && ctx.visto({ V: 120, R: 24, t: 120 })),
        progreso: (ctx) => (ctx.visto({ V: 60, R: 24, t: 120 }) && !ctx.visto({ V: 120, R: 24, t: 120 }) ? "Ahora pon 120 V" : ctx.visto({ V: 120, R: 24, t: 120 }) ? "Ahora pon 60 V" : "Empieza con 60 V, 24 Ω y 120 s"),
        descubre: (ctx) => `Con 60 V la potencia es ${fmt(ctx.visto({ V: 60, R: 24, t: 120 }).P, 0)} W y con 120 V, ${fmt(ctx.visto({ V: 120, R: 24, t: 120 }).P, 0)} W: ¡cuatro veces más! P = V²/R: el voltaje está al cuadrado.`, resaltar: "P" },
      { tipo: "explora", titulo: "Menos resistencia, más calor", texto: "Con 120 V y 120 s, prueba R = 48 Ω y después R = 12 Ω.",
        meta: (ctx) => !!(ctx.visto({ V: 120, t: 120, R: 48 }) && ctx.visto({ V: 120, t: 120, R: 12 })),
        progreso: (ctx) => (ctx.visto({ V: 120, t: 120, R: 48 }) ? "Ahora prueba 12 Ω" : ctx.visto({ V: 120, t: 120, R: 12 }) ? "Ahora prueba 48 Ω" : "Pon 120 V, 120 s y 48 Ω"),
        descubre: (ctx) => `Con 48 Ω: ${fmt(ctx.visto({ V: 120, t: 120, R: 48 }).P, 0)} W. Con 12 Ω: ${fmt(ctx.visto({ V: 120, t: 120, R: 12 }).P, 0)} W. A voltaje fijo, una resistencia más pequeña deja pasar más corriente y entrega más potencia: se calienta más rápido (por eso un cortocircuito es tan peligroso).`, resaltar: "P" },
      { tipo: "reto", titulo: "Reto: agua a unos 55 °C", texto: "El agua empieza a 20 °C. Elige voltaje, resistencia y tiempo para que termine cerca de 55 °C (±3 °C).",
        meta: (ctx) => Math.abs(ctx.e.Tfin - 55) <= 3,
        pistas: ["Necesitas ΔT = 35 K: Q = 0,5 × 4186 × 35 ≈ 73 kJ.", "Q = P·t. Busca una combinación de P y t que dé unos 73 kJ.", "120 V, 24 Ω y 120 s (600 W) dan 72 kJ: llegan a 54,4 °C."],
        logro: (ctx) => `Con ${fmt(ctx.e.P, 0)} W durante ${fmt(ctx.e.t, 0)} s entregaste ${fmtE(ctx.e.Q)} y el agua llegó a ${fmt(ctx.e.Tfin, 1)} °C. Hay más de una combinación que sirve: lo que importa es el producto P·t.` },
      { tipo: "pregunta", texto: "Con una resistencia fija, si duplicas el voltaje durante el mismo tiempo, el calor entregado…",
        opciones: [["x4", "Se multiplica por 4", "Correcto: P = V²/R, así que 2² = 4 veces la potencia y, por lo tanto, 4 veces la energía."], ["x2", "Se duplica", "Casi: eso pasaría si P fuera proporcional a V, pero P depende de V²."], ["igual", "No cambia", "Sí cambia: lo viste al mover el control de voltaje."]], correcta: "x4" },
      { tipo: "resumen", puntos: ["Una resistencia convierte energía eléctrica en calor: efecto Joule.", "P = V²/R y Q = P·t.", "Si todo el calor llega al agua: P·t = m·c·ΔT."], formula: "P = V²/R   ·   Q = P·t" },
    ],
  },
  // ====================================================== ONDAS
  {
    clave: "ondas_l1", modulo: "ondas", escena: "onda", titulo: "Amplitud, frecuencia y periodo", svg: "onda", resumen: "Las tres cantidades básicas de una onda.",
    inicial: { A: 2, f: 1, lam: 2, fase: 0 },
    controles: [opt("A", "Amplitud", [1, 2, 3, 4], "cm"), opt("f", "Frecuencia", [0.5, 1, 2, 4], "Hz")],
    medidor: [med("A", "Amplitud", AZUL, (e) => e.A, (x) => `${fmt(x, 0)} cm`), med("f", "Frecuencia", AMARILLO, (e) => e.f, (x) => `${fmt(x, 1)} Hz`), med("T", "Periodo", MORADO, (e) => e.T, (x) => `${fmt(x, 2)} s`)],
    formula: (e) => `T = 1/f = 1/${fmt(e.f, 1)} = ${fmt(e.T, 2)} s     v = λ·f = ${fmt(e.lam, 0)} × ${fmt(e.f, 1)} = ${fmt(e.vel, 2)} m/s`,
    tarjetas: [
      { tipo: "idea", titulo: "Una onda que viaja",
        texto: "Una onda es una perturbación que viaja llevando energía, sin transportar materia. En el tablero tienes una onda en una cuerda: cada punto sube y baja, pero la forma avanza hacia la derecha.\n\nPara describirla usamos tres cantidades: la AMPLITUD (cuánto sube y baja), la FRECUENCIA (cuántas oscilaciones por segundo) y el PERIODO (lo que tarda una oscilación).",
        fijate: ["La flecha vertical marca la amplitud A.", "El punto rojo sube y baja: es un trozo de cuerda oscilando.", "La gráfica de abajo muestra ese punto a lo largo del tiempo."],
        analogia: "Como mecer una cuerda con la mano: cuánto subes y bajas la mano es la amplitud; cuántas veces la mueves por segundo, la frecuencia." },
      { tipo: "idea", titulo: "Periodo y frecuencia",
        texto: "El periodo T es el tiempo de una oscilación completa. La frecuencia f es cuántas oscilaciones caben en un segundo, y se mide en hertz (Hz). Son inversos: si f sube, T baja.",
        formula: "T = 1 / f", simbolos: [["T", "periodo (s)"], ["f", "frecuencia (Hz)"]],
        ejemplo: { enunciado: "Una onda oscila 4 veces cada segundo. ¿Cuál es su periodo?", pasos: ["f = 4 Hz.", "T = 1 / f = 1 / 4.", "T = 0,25 s."] } },
      { tipo: "explora", titulo: "Cambia la amplitud", texto: "Prueba al menos 3 amplitudes distintas con el control de abajo. Mira la ficha de PERIODO.",
        meta: (ctx) => ctx.distintos("A") >= 3, progreso: (ctx) => `Amplitudes probadas: ${Math.min(ctx.distintos("A"), 3)} de 3`,
        descubre: "Al aumentar la amplitud la onda sube más, pero el periodo no cambió: la amplitud no afecta a qué tan rápido oscila. Solo cambia cuánta energía lleva la onda.", resaltar: "T" },
      { tipo: "explora", titulo: "Duplica la frecuencia", texto: "Con 2 cm de amplitud, pon la frecuencia en 1 Hz y mira el periodo. Luego en 2 Hz.",
        meta: (ctx) => !!(ctx.visto({ A: 2, f: 1 }) && ctx.visto({ A: 2, f: 2 })),
        progreso: (ctx) => (ctx.visto({ A: 2, f: 1 }) && !ctx.visto({ A: 2, f: 2 }) ? "Ahora pon 2 Hz" : ctx.visto({ A: 2, f: 2 }) ? "Ahora pon 1 Hz" : "Empieza con 2 cm y 1 Hz"),
        descubre: (ctx) => `Con 1 Hz el periodo es ${fmt(ctx.visto({ A: 2, f: 1 }).T, 2)} s y con 2 Hz, ${fmt(ctx.visto({ A: 2, f: 2 }).T, 2)} s. El doble de frecuencia dio la MITAD de periodo: son inversos. La onda se ve «más apretada» en el tiempo.`, resaltar: "T" },
      { tipo: "reto", titulo: "Reto: periodo de 0,25 s", texto: "Elige la frecuencia para que la onda se repita cada 0,25 segundos.",
        meta: (ctx) => ctx.ahora({ T: 0.25 }),
        pistas: ["El periodo es el inverso de la frecuencia: T = 1/f.", "Si T = 0,25 s, f = 1 / 0,25.", "f = 4 Hz."],
        logro: "Con 4 Hz el periodo es 0,25 s: 4 oscilaciones completas en cada segundo. Usaste T = 1/f al revés." },
      { tipo: "pregunta", texto: "Si la frecuencia de una onda aumenta, su periodo…",
        opciones: [["baja", "Disminuye", "Correcto: T = 1/f. Más oscilaciones por segundo significa que cada una dura menos."], ["sube", "Aumenta", "Al revés: más frecuencia, oscilaciones más cortas."], ["igual", "No cambia", "Sí cambia: son inversos."]], correcta: "baja" },
      { tipo: "resumen", puntos: ["La amplitud A es el máximo desplazamiento desde el equilibrio.", "El periodo T es el tiempo de una oscilación; la frecuencia f son las oscilaciones por segundo.", "T = 1/f: son inversos."], formula: "T = 1 / f" },
    ],
  },
  {
    clave: "ondas_l2", modulo: "ondas", escena: "onda", titulo: "Longitud de onda y velocidad", svg: "lambda", resumen: "v = λ·f: cómo se relacionan.",
    inicial: { A: 2, f: 1, lam: 2, fase: 0 },
    controles: [opt("f", "Frecuencia", [1, 2, 3], "Hz"), opt("lam", "Longitud de onda", [1, 2, 3], "m")],
    medidor: [med("lam", "Long. de onda", AZUL, (e) => e.lam, (x) => `${fmt(x, 0)} m`), med("f", "Frecuencia", AMARILLO, (e) => e.f, (x) => `${fmt(x, 0)} Hz`), med("vel", "Velocidad", MORADO, (e) => e.vel, (x) => `${fmt(x, 1)} m/s`)],
    formula: (e) => `v = λ · f = ${fmt(e.lam, 0)} m × ${fmt(e.f, 0)} Hz = ${fmt(e.vel, 1)} m/s     T = ${fmt(e.T, 2)} s`,
    tarjetas: [
      { tipo: "idea", titulo: "La distancia entre crestas",
        texto: "La longitud de onda λ es la distancia entre dos crestas seguidas (o dos valles). En una oscilación completa, la onda avanza exactamente una longitud de onda.\n\nEn el tablero, la llave horizontal marca λ. Cambia la frecuencia y la longitud de onda con los controles y mira la velocidad.",
        fijate: ["La llave entre dos crestas es λ.", "La ficha VELOCIDAD dice qué tan rápido avanza la forma de la onda.", "La cresta marcada con un punto avanza con esa velocidad."],
        analogia: "Como una fila de personas que caminan: λ es la distancia entre una persona y la siguiente, y f cuántas pasan frente a ti cada segundo." },
      { tipo: "idea", titulo: "v = λ · f",
        texto: "Si en cada segundo pasan f crestas y cada una está separada λ de la siguiente, la onda avanza λ·f metros por segundo. La velocidad depende del medio: en una cuerda dada, es fija.",
        formula: "v = λ · f", simbolos: [["v", "velocidad (m/s)"], ["λ", "longitud de onda (m)"], ["f", "frecuencia (Hz)"]],
        ejemplo: { enunciado: "Una onda tiene λ = 0,5 m y f = 6 Hz. ¿Con qué velocidad viaja?", pasos: ["v = λ · f.", "v = 0,5 × 6.", "v = 3 m/s."] } },
      { tipo: "explora", titulo: "Sube la frecuencia", texto: "Con λ = 2 m, pon f en 1 Hz y luego en 2 Hz. Mira la velocidad.",
        meta: (ctx) => !!(ctx.visto({ lam: 2, f: 1 }) && ctx.visto({ lam: 2, f: 2 })),
        progreso: (ctx) => (ctx.visto({ lam: 2, f: 1 }) && !ctx.visto({ lam: 2, f: 2 }) ? "Ahora pon 2 Hz" : ctx.visto({ lam: 2, f: 2 }) ? "Ahora pon 1 Hz" : "Empieza con λ = 2 m y 1 Hz"),
        descubre: (ctx) => `Con 1 Hz: ${fmt(ctx.visto({ lam: 2, f: 1 }).vel, 1)} m/s. Con 2 Hz: ${fmt(ctx.visto({ lam: 2, f: 2 }).vel, 1)} m/s. Si λ no cambia, el doble de frecuencia da el doble de velocidad.`, resaltar: "vel" },
      { tipo: "explora", titulo: "Misma velocidad, distinta onda", texto: "Consigue una velocidad de 3 m/s de dos formas distintas: con λ = 1 m y f = 3 Hz, y con λ = 3 m y f = 1 Hz.",
        meta: (ctx) => !!(ctx.visto({ lam: 1, f: 3 }) && ctx.visto({ lam: 3, f: 1 })),
        progreso: (ctx) => `Combinaciones probadas: ${(ctx.visto({ lam: 1, f: 3 }) ? 1 : 0) + (ctx.visto({ lam: 3, f: 1 }) ? 1 : 0)} de 2`,
        descubre: "En las dos combinaciones v = 3 m/s. Para una velocidad fija, si la frecuencia sube la longitud de onda baja, y al revés: f y λ son inversamente proporcionales.", resaltar: "vel" },
      { tipo: "reto", titulo: "Reto: 6 m/s", texto: "Elige la frecuencia y la longitud de onda para que la velocidad sea exactamente 6 m/s.",
        meta: (ctx) => ctx.ahora({ vel: 6 }),
        pistas: ["v = λ · f. Necesitas que el producto sea 6.", "3 × 2 = 6: ¿cuál va en cada control?", "λ = 3 m con f = 2 Hz, o λ = 2 m con f = 3 Hz."],
        logro: (ctx) => `${fmt(ctx.e.lam, 0)} m × ${fmt(ctx.e.f, 0)} Hz = 6 m/s. Hay dos combinaciones posibles: lo que se mantiene es el producto λ·f.` },
      { tipo: "pregunta", texto: "La velocidad de las ondas en una cuerda es fija. Si duplicas la frecuencia, la longitud de onda…",
        opciones: [["mitad", "Se reduce a la mitad", "Correcto: v = λ·f con v constante; si f se duplica, λ se divide entre 2."], ["doble", "Se duplica", "Al revés: más frecuencia significa crestas más juntas."], ["igual", "No cambia", "Si λ no cambiara y f se duplicara, la velocidad también se duplicaría; pero v es fija."]], correcta: "mitad" },
      { tipo: "resumen", puntos: ["La longitud de onda λ es la distancia entre dos crestas consecutivas.", "v = λ · f: la velocidad es el producto de las dos.", "En un medio fijo, más frecuencia implica menos longitud de onda."], formula: "v = λ · f" },
    ],
  },
  {
    clave: "ondas_l3", modulo: "ondas", escena: "interf", titulo: "Interferencia", svg: "interf", resumen: "Qué pasa cuando dos ondas se encuentran.",
    inicial: { A1: 2, A2: 2, dfi: 0, f: 1, lam: 2 },
    controles: [opt("A2", "Amplitud de la onda 2", [1, 2, 3], "cm"), opt("dfi", "Desfase Δφ", [0, 90, 120, 180], "°")],
    medidor: [med("A2", "Amplitud 2", AZUL, (e) => e.A2, (x) => `${fmt(x, 0)} cm`), med("dfi", "Desfase", AMARILLO, (e) => e.dfi, (x) => `${fmt(x, 0)}°`), med("Ares", "Suma (amplitud)", MORADO, (e) => e.Ares, (x) => `${fmt(x, 2)} cm`)],
    formula: (e) => `A = √(A₁² + A₂² + 2·A₁·A₂·cos Δφ) = √(${fmt(e.A1, 0)}² + ${fmt(e.A2, 0)}² + 2·${fmt(e.A1, 0)}·${fmt(e.A2, 0)}·cos ${fmt(e.dfi, 0)}°) = ${fmt(e.Ares, 2)} cm     (${e.tipo})`,
    tarjetas: [
      { tipo: "idea", titulo: "Las ondas se suman",
        texto: "Dos ondas pueden cruzarse sin dañarse. Mientras coinciden en un punto, el desplazamiento total es la SUMA de los de cada una: es el principio de superposición.\n\nEn el tablero, la onda 1 (azul, amplitud 2 cm) y la onda 2 (naranja) se suman en la onda resultante (morada). Tú eliges la amplitud de la onda 2 y el desfase entre ellas.",
        fijate: ["Las dos ondas de arriba son las que se encuentran.", "La de abajo es la suma: lo que realmente vería un observador.", "La ficha SUMA dice la amplitud de la onda resultante."],
        analogia: "Dos personas empujan un columpio: si empujan a la vez y en el mismo sentido, el columpio sube mucho; si una empuja justo cuando la otra frena, casi no se mueve." },
      { tipo: "idea", titulo: "Constructiva y destructiva",
        texto: "El desfase Δφ dice cuánto va una onda adelantada respecto de la otra. Con Δφ = 0° las crestas coinciden y se refuerzan (interferencia constructiva). Con Δφ = 180° una cresta cae sobre un valle y se restan (destructiva).",
        formula: "A = √(A₁² + A₂² + 2·A₁·A₂·cos Δφ)", simbolos: [["Δφ = 0°", "A = A₁ + A₂"], ["Δφ = 180°", "A = |A₁ − A₂|"]],
        ejemplo: { enunciado: "Ondas de 2 cm y 3 cm en oposición de fase (180°). ¿Amplitud resultante?", pasos: ["cos 180° = −1.", "A = √(2² + 3² − 2·2·3) = √1.", "A = 1 cm."] } },
      { tipo: "explora", titulo: "Refuerza la onda", texto: "Pon las dos ondas en fase (Δφ = 0°) con amplitud 2 cm cada una.",
        meta: (ctx) => ctx.ahora({ dfi: 0, A2: 2 }), progreso: () => "Δφ = 0° y amplitud 2 cm",
        descubre: (ctx) => `Con las crestas coincidiendo la suma tiene ${fmt(ctx.e.Ares, 1)} cm: justo 2 + 2. Es interferencia constructiva: la onda resultante es más grande que cada una.`, resaltar: "Ares" },
      { tipo: "explora", titulo: "Prueba los desfases", texto: "Prueba al menos 3 desfases distintos y mira cómo cambia la amplitud de la suma.",
        meta: (ctx) => ctx.distintos("dfi") >= 3, progreso: (ctx) => `Desfases probados: ${Math.min(ctx.distintos("dfi"), 3)} de 3`,
        descubre: "A medida que el desfase crece de 0° a 180°, la amplitud de la suma baja de A₁ + A₂ a |A₁ − A₂|. En el medio hay interferencia parcial: ni se refuerzan del todo ni se cancelan.", resaltar: "Ares" },
      { tipo: "reto", titulo: "Reto: cancélalas", texto: "Haz que la suma quede en 0 cm: interferencia destructiva total.",
        meta: (ctx) => ctx.e.Ares < 0.05,
        pistas: ["Para cancelarse, cada cresta debe caer sobre un valle de la otra.", "Eso pasa con Δφ = 180° y amplitudes iguales.", "Amplitud 2 cm y Δφ = 180°."],
        logro: "Con amplitudes iguales y 180° de desfase la suma es cero: es lo que hacen los audífonos con cancelación de ruido." },
      { tipo: "pregunta", texto: "Dos ondas de amplitud 2 cm y 3 cm llegan en oposición de fase (180°). ¿Qué amplitud tiene la suma?",
        opciones: [["1", "1 cm", "Correcto: |3 − 2| = 1 cm."], ["5", "5 cm", "Eso sería en fase (Δφ = 0°). Con 180° se restan."], ["0", "0 cm", "Solo se cancelan del todo si las amplitudes son iguales."]], correcta: "1" },
      { tipo: "resumen", puntos: ["Al encontrarse, los desplazamientos de dos ondas se suman.", "En fase (0°) se refuerzan: A₁ + A₂. En oposición (180°) se restan: |A₁ − A₂|.", "Con amplitudes iguales y 180° se cancelan por completo."], formula: "A = √(A₁² + A₂² + 2·A₁·A₂·cos Δφ)" },
    ],
  },
  {
    clave: "ondas_l4", modulo: "ondas", escena: "alterna", titulo: "Corriente alterna", svg: "alterna", resumen: "La red eléctrica vista como una onda.",
    inicial: { Vmax: 170, R: 100, f: 60 },
    controles: [opt("Vmax", "Voltaje máximo", [50, 100, 170], "V"), opt("R", "Resistencia", [50, 100, 200], "Ω")],
    medidor: [med("Vrms", "V eficaz", AZUL, (e) => e.Vrms, (x) => `${fmt(x, 1)} V`), med("Pm", "P media", MORADO, (e) => e.Pm, (x) => `${fmt(x, 1)} W`), med("Pmax", "P máxima", ROJO, (e) => e.Pmax, (x) => `${fmt(x, 1)} W`)],
    formula: (e) => `Vrms = Vmax/√2 = ${fmt(e.Vmax, 0)}/1,414 = ${fmt(e.Vrms, 1)} V     P media = Vrms²/R = ${fmt(e.Pm, 1)} W`,
    tarjetas: [
      { tipo: "idea", titulo: "La red es una onda",
        texto: "En un enchufe el voltaje no es constante: oscila como una onda seno, v(t) = Vmax·sen(2πft). En Colombia la frecuencia es de 60 Hz: 60 oscilaciones cada segundo. Es la corriente alterna (CA), distinta a la continua que daban las baterías de tus circuitos.\n\nEn el tablero, la curva azul es el voltaje y la morada la potencia que entrega a una resistencia R.",
        fijate: ["El voltaje sube y baja, y a veces es negativo (cambia el sentido).", "La potencia (morada) nunca es negativa: una resistencia siempre se calienta.", "La línea punteada es el voltaje eficaz Vrms."],
        analogia: "Como el vaivén de una sierra: empuja y jala, y aun así corta siempre. La corriente cambia de sentido pero la resistencia siempre se calienta." },
      { tipo: "idea", titulo: "Voltaje eficaz",
        texto: "Como el voltaje cambia todo el tiempo, usamos un valor equivalente: el voltaje eficaz Vrms. Es el de una batería que calentaría la resistencia exactamente igual. Cuando dicen «120 V» en un enchufe, hablan de Vrms; el pico es de unos 170 V.",
        formula: "Vrms = Vmax / √2", simbolos: [["Vmax", "voltaje de pico (V)"], ["Vrms", "voltaje eficaz (V)"], ["P media", "Vrms² / R"]],
        ejemplo: { enunciado: "Vmax = 170 V sobre una resistencia de 100 Ω. ¿Vrms y potencia media?", pasos: ["Vrms = 170 / 1,414 ≈ 120 V.", "P media = Vrms² / R = 120² / 100.", "P media ≈ 144 W."] } },
      { tipo: "explora", titulo: "Pico contra eficaz", texto: "Prueba al menos 3 voltajes máximos distintos. Compara Vmax con la ficha V EFICAZ.",
        meta: (ctx) => ctx.distintos("Vmax") >= 3, progreso: (ctx) => `Voltajes probados: ${Math.min(ctx.distintos("Vmax"), 3)} de 3`,
        descubre: "El voltaje eficaz siempre es Vmax / √2 ≈ 0,707 · Vmax. No importa el valor: la proporción es la misma. Con 170 V de pico, 120 V eficaces.", resaltar: "Vrms" },
      { tipo: "explora", titulo: "La mitad de la potencia máxima", texto: "Pon Vmax en 100 V y R en 100 Ω, y compara la potencia media con la máxima.",
        meta: (ctx) => ctx.ahora({ Vmax: 100, R: 100 }), progreso: () => "Pon 100 V y 100 Ω",
        descubre: (ctx) => `La potencia máxima es ${fmt(ctx.e.Pmax, 0)} W, pero la media solo ${fmt(ctx.e.Pm, 0)} W: exactamente la mitad. La potencia oscila entre 0 y su pico, y el promedio queda en medio.`, resaltar: "Pm" },
      { tipo: "reto", titulo: "Reto: 100 W de potencia media", texto: "Elige el voltaje máximo y la resistencia para que la potencia media sea de 100 W (±2 %).",
        meta: (ctx) => Math.abs(ctx.e.Pm - 100) <= 2,
        pistas: ["P media = Vmax² / (2R).", "Necesitas Vmax² = 200·R. Prueba con R = 50 Ω: Vmax² = 10 000.", "Vmax = 100 V y R = 50 Ω."],
        logro: (ctx) => `Con ${fmt(ctx.e.Vmax, 0)} V de pico y ${fmt(ctx.e.R, 0)} Ω, la potencia media es ${fmt(ctx.e.Pm, 1)} W. Es la misma que daría una batería de ${fmt(ctx.e.Vrms, 1)} V sobre esa resistencia.` },
      { tipo: "pregunta", texto: "Cuando se dice que un enchufe es de «120 V», ese valor es…",
        opciones: [["rms", "El voltaje eficaz (Vrms)", "Correcto: es el equivalente en corriente continua. El pico es de unos 170 V."], ["max", "El voltaje máximo", "El máximo (pico) es mayor: Vmax = Vrms · √2 ≈ 170 V."], ["prom", "El promedio del voltaje", "El promedio de una onda seno es cero: sube y baja por igual."]], correcta: "rms" },
      { tipo: "resumen", puntos: ["La red eléctrica es una onda seno de 60 Hz: el voltaje cambia de sentido.", "Vrms = Vmax/√2: es el valor equivalente a una batería.", "P media = Vrms²/R = la mitad de la potencia máxima."], formula: "Vrms = Vmax / √2" },
    ],
  },
];

export const lecDe = (modulo) => LECCIONES_FIS.filter((l) => l.modulo === modulo);
export const buscarLec = (clave) => LECCIONES_FIS.find((l) => l.clave === clave) || null;
