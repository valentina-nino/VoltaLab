// Problemas aplicados de calor y de ondas. Misma forma que los de electricidad (problemas.js):
// cada uno calcula sus números (calc) y arma sus pasos (pasos). Las energías se piden en kJ para no escribir cifras enormes.
import { AGUA, calor, equilibrio, calentador } from "../lib/termica.js";
import { alterna, ampSuma, derivadas, onda, tipoInterferencia } from "../lib/ondas.js";

const num = (x, d = 2) => { const s = (+x.toFixed(d)).toString(); return s === "-0" ? "0" : s; };
const kJ = (j) => j / 1000;

export const PROBLEMAS_FIS = [
  /* ================================ CALOR ================================ */
  {
    clave: "cal_sensible", conceptos: ["calor_sensible", "potencia_t"], grupo: "calor", nivel: 1, ref: "Calor 1", titulo: "Calentar agua en una estufa", figura: "fcal1",
    enunciado: "Una olla contiene 2.00 kg de agua a 20.0 °C. ¿Cuánta energía debe absorber para llegar a 70.0 °C? Si la estufa entrega 1500 W y todo el calor llega al agua, ¿cuánto tarda?",
    calc() {
      const m = 2, c = 4186, T0 = 20, Tf = 70, P = 1500;
      const dT = Tf - T0, Q = calor(m, c, dT), t = Q / P;
      return { m, c, T0, Tf, P, dT, Q, t };
    },
    pasos(v) {
      return [
        { concepto: "calor_sensible", titulo: "Cuánto cambia la temperatura", foco: ["dT"],
          texto: "Lo primero es saber cuántos grados sube el agua: temperatura final menos temperatura inicial.",
          explica: "Un cambio de 1 °C es igual a un cambio de 1 K, así que ΔT se puede escribir en cualquiera de las dos unidades.",
          pregunta: { texto: "¿Cuánto vale ΔT?", valor: v.dT, unidad: "K", pista: "ΔT = T final − T inicial = 70 − 20." },
          lineas: [`ΔT = ${v.Tf} − ${v.T0}`, `ΔT = ${num(v.dT)} K`], resumen: `ΔT = ${num(v.dT)} K` },
        { concepto: "calor_sensible", titulo: "Energía que debe absorber el agua", foco: ["agua"],
          texto: "Con la masa, el calor específico del agua (4186 J/(kg·K)) y ΔT, el calor sale de Q = m · c · ΔT.",
          explica: "El resultado queda en julios. Divide entre 1000 para pasarlo a kilojulios.",
          pregunta: { texto: "¿Cuánto calor Q necesita el agua?", valor: kJ(v.Q), unidad: "kJ", pista: "Q = 2.00 · 4186 · 50 en julios; luego divide entre 1000." },
          lineas: [`Q = m · c · ΔT = ${num(v.m)} kg · ${v.c} J/(kg·K) · ${num(v.dT)} K`, `Q = ${num(v.Q, 0)} J = ${num(kJ(v.Q), 1)} kJ`], resumen: `Q = ${num(kJ(v.Q), 1)} kJ` },
        { concepto: "potencia_t", titulo: "Tiempo que tarda la estufa", foco: ["estufa"],
          texto: "La potencia es la energía que entrega la estufa cada segundo. Si entrega 1500 W, entrega 1500 J por segundo.",
          pregunta: { texto: "¿Cuántos segundos tarda en entregar esa energía?", valor: v.t, unidad: "s", pista: "t = Q / P, con Q en julios (418 600 J) y P = 1500 W." },
          lineas: [`t = Q / P = ${num(v.Q, 0)} J / ${v.P} W`, `t = ${num(v.t, 1)} s ≈ ${num(v.t / 60, 1)} min`], resumen: `t = ${num(v.t, 1)} s` },
      ];
    },
    respuesta: (v) => `Q = ${num(kJ(v.Q), 1)} kJ · t = ${num(v.t, 1)} s`,
  },
  /* ---------------------------------------------------------------- */
  {
    clave: "cal_mezcla", conceptos: ["calor_sensible", "equilibrio"], grupo: "calor", nivel: 2, ref: "Calor 2", titulo: "Bloque de cobre en un calorímetro", figura: "fcal2",
    enunciado: "Un bloque de cobre de 0.500 kg a 100 °C se mete en 0.500 kg de agua a 20.0 °C dentro de un calorímetro aislado. ¿Cuál es la temperatura final y cuánto calor pasó del cobre al agua? (c del cobre = 385 J/(kg·K); c del agua = 4186 J/(kg·K)).",
    calc() {
      const mCu = 0.5, cCu = 385, TCu = 100, mW = 0.5, cW = 4186, TW = 20;
      const CCu = mCu * cCu, CW = mW * cW;
      const r = equilibrio({ m: mCu, c: cCu, T: TCu }, { m: mW, c: cW, T: TW });
      return { mCu, cCu, TCu, mW, cW, TW, CCu, CW, Tf: r.Tf, QCu: r.Qa, QW: r.Qb };
    },
    pasos(v) {
      return [
        { concepto: "calor_sensible", titulo: "Capacidad térmica de cada cuerpo", foco: ["cobre", "agua"],
          texto: "Llamamos capacidad térmica a C = m · c: los julios que hay que dar a todo el cuerpo para subirle 1 K. Sirve para escribir el equilibrio más corto.",
          pregunta: { texto: "¿Cuánto vale C del agua?", valor: v.CW, unidad: "J/K", pista: "C = m · c = 0.500 · 4186." },
          lineas: [`C agua = ${num(v.mW)} · ${v.cW} = ${num(v.CW, 1)} J/K`, `C cobre = ${num(v.mCu)} · ${v.cCu} = ${num(v.CCu, 1)} J/K`], destacar: [0, 1], resumen: `C agua = ${num(v.CW, 1)} J/K · C cobre = ${num(v.CCu, 1)} J/K` },
        { concepto: "equilibrio", titulo: "Temperatura de equilibrio", foco: ["tf"],
          texto: "Sin pérdidas, el calor que cede el cobre es el que absorbe el agua: C_cu (100 − T_f) = C_agua (T_f − 20). Despejando T_f queda un promedio de las temperaturas, ponderado por las capacidades térmicas.",
          explica: "Como el agua tiene una capacidad térmica mucho mayor, la temperatura final queda cerca de la del agua.",
          pregunta: { texto: "¿Cuál es la temperatura final?", valor: v.Tf, unidad: "°C", pista: "T_f = (C_cu · 100 + C_agua · 20) / (C_cu + C_agua)." },
          lineas: [`T_f = (${num(v.CCu, 1)} · ${v.TCu} + ${num(v.CW, 1)} · ${v.TW}) / (${num(v.CCu, 1)} + ${num(v.CW, 1)})`, `T_f = ${num(v.Tf, 2)} °C`], resumen: `T_f = ${num(v.Tf, 2)} °C` },
        { concepto: "equilibrio", titulo: "Comprobar con el calor", foco: ["cobre", "agua"],
          texto: "Calcula el calor que absorbe el agua y compáralo con el que cede el cobre: deben ser iguales en valor y de signo contrario.",
          pregunta: { texto: "¿Cuánto calor absorbe el agua?", valor: kJ(v.QW), unidad: "kJ", pista: "Q = C_agua · (T_f − 20); divide entre 1000 para kJ." },
          lineas: [`Q agua = ${num(v.CW, 1)} · (${num(v.Tf, 2)} − ${v.TW}) = +${num(kJ(v.QW), 2)} kJ`, `Q cobre = ${num(v.CCu, 1)} · (${num(v.Tf, 2)} − ${v.TCu}) = ${num(kJ(v.QCu), 2)} kJ`, "La suma es 0: no se perdió ni se creó energía."], destacar: [0], resumen: `Pasaron ${num(kJ(v.QW), 2)} kJ del cobre al agua` },
      ];
    },
    respuesta: (v) => `T_f = ${num(v.Tf, 2)} °C · Q = ${num(kJ(v.QW), 2)} kJ`,
  },
  /* ---------------------------------------------------------------- */
  {
    clave: "cal_joule", conceptos: ["efecto_joule", "calor_sensible", "potencia_t"], grupo: "calor", nivel: 2, ref: "Calor 3", titulo: "Hervir agua con un calentador eléctrico", figura: "fcal3",
    enunciado: "Un calentador de resistencia de 12.0 Ω se conecta a 120 V y está sumergido en 0.500 kg de agua a 20.0 °C. Solo el 90 % de la energía eléctrica llega al agua. ¿Cuánto tarda el agua en llegar a 100 °C?",
    calc() {
      const V = 120, R = 12, eta = 0.9, m = 0.5, c = 4186, T0 = 20, Tf = 100;
      const { P } = calentador({ V, R, m, c, T0, t: 0, eta });
      const Q = calor(m, c, Tf - T0), Pu = eta * P, t = Q / Pu;
      return { V, R, eta, m, c, T0, Tf, P, Q, Pu, t };
    },
    pasos(v) {
      return [
        { concepto: "efecto_joule", titulo: "Potencia eléctrica del calentador", foco: ["bat", "res"],
          texto: "Una resistencia conectada a un voltaje convierte energía eléctrica en calor. La potencia es P = V² / R.",
          pregunta: { texto: "¿Cuánta potencia consume el calentador?", valor: v.P, unidad: "W", pista: "P = V² / R = 120² / 12." },
          lineas: [`P = V² / R = ${v.V}² / ${v.R}`, `P = ${num(v.P, 0)} W`], resumen: `P = ${num(v.P, 0)} W` },
        { concepto: "calor_sensible", titulo: "Calor que necesita el agua", foco: ["agua"],
          texto: "El agua sube de 20 a 100 °C: ΔT = 80 K. Ese calor sale de Q = m · c · ΔT.",
          pregunta: { texto: "¿Cuánto calor necesita el agua?", valor: kJ(v.Q), unidad: "kJ", pista: "Q = 0.500 · 4186 · 80 en julios; luego divide entre 1000." },
          lineas: [`Q = ${num(v.m)} · ${v.c} · ${v.Tf - v.T0} = ${num(v.Q, 0)} J`, `Q = ${num(kJ(v.Q), 2)} kJ`], resumen: `Q = ${num(kJ(v.Q), 2)} kJ` },
        { concepto: "potencia_t", titulo: "Tiempo con pérdidas", foco: ["eta"],
          texto: "Como solo el 90 % de la potencia llega al agua, la potencia útil es η · P. El tiempo es la energía necesaria entre la potencia útil.",
          pregunta: { texto: "¿Cuántos segundos tarda en hervir?", valor: v.t, unidad: "s", pista: "t = Q / (η · P) = 167 440 J / (0.90 · 1200 W)." },
          lineas: [`P útil = η · P = ${v.eta} · ${num(v.P, 0)} = ${num(v.Pu, 0)} W`, `t = Q / P útil = ${num(v.Q, 0)} / ${num(v.Pu, 0)}`, `t = ${num(v.t, 1)} s ≈ ${num(v.t / 60, 1)} min`], destacar: [2], resumen: `t = ${num(v.t, 1)} s` },
      ];
    },
    respuesta: (v) => `t = ${num(v.t, 1)} s (≈ ${num(v.t / 60, 1)} min)`,
  },
  /* ---------------------------------------------------------------- */
  {
    clave: "cal_fase", conceptos: ["calor_sensible", "fase"], grupo: "calor", nivel: 3, ref: "Calor 4", titulo: "De hielo a vapor", figura: "fcal4",
    enunciado: "¿Cuánta energía hay que darle a 0.200 kg de hielo a −10.0 °C para convertirlo en vapor a 110 °C? Usa: c del hielo 2100, c del agua 4186, c del vapor 2010 J/(kg·K); calor de fusión 334 kJ/kg; calor de vaporización 2256 kJ/kg.",
    calc() {
      const m = 0.2, { cHielo, cAgua, cVapor, Lf, Lv } = AGUA;
      const Q1 = m * cHielo * 10, Q2 = m * Lf, Q3 = m * cAgua * 100, Q4 = m * Lv, Q5 = m * cVapor * 10;
      return { m, cHielo, cAgua, cVapor, Lf, Lv, Q1, Q2, Q3, Q4, Q5, Q: Q1 + Q2 + Q3 + Q4 + Q5 };
    },
    pasos(v) {
      return [
        { concepto: "calor_sensible", titulo: "Calentar el hielo hasta 0 °C", foco: ["s1"],
          texto: "Primero el hielo sube de −10 a 0 °C sin derretirse. Es calor sensible: la temperatura cambia.",
          lineas: [`Q₁ = m · c · ΔT = ${num(v.m)} · ${v.cHielo} · 10 = ${num(v.Q1, 0)} J`, `Q₁ = ${num(kJ(v.Q1), 2)} kJ`], resumen: `Q₁ = ${num(kJ(v.Q1), 2)} kJ (hielo a 0 °C)` },
        { concepto: "fase", titulo: "Fundir el hielo", foco: ["s2"],
          texto: "A 0 °C el hielo se derrite. Mientras se funde, la temperatura NO cambia: todo el calor rompe la estructura del hielo. Se calcula con el calor latente, Q = m · L.",
          explica: "Fíjate en la curva de la figura: el tramo de fusión es horizontal.",
          pregunta: { texto: "¿Cuánto calor se necesita para fundirlo?", valor: kJ(v.Q2), unidad: "kJ", pista: "Q = m · L_f = 0.200 · 334 000 J; divide entre 1000." },
          lineas: [`Q₂ = m · L_f = ${num(v.m)} · ${num(v.Lf, 0)} = ${num(v.Q2, 0)} J`, `Q₂ = ${num(kJ(v.Q2), 1)} kJ`], resumen: `Q₂ = ${num(kJ(v.Q2), 1)} kJ (fusión)` },
        { concepto: "calor_sensible", titulo: "Calentar el agua de 0 a 100 °C", foco: ["s3"],
          texto: "Ya es agua líquida a 0 °C y sube hasta 100 °C. Otra vez calor sensible, ahora con c del agua.",
          lineas: [`Q₃ = ${num(v.m)} · ${v.cAgua} · 100 = ${num(v.Q3, 0)} J`, `Q₃ = ${num(kJ(v.Q3), 2)} kJ`], resumen: `Q₃ = ${num(kJ(v.Q3), 2)} kJ (agua a 100 °C)` },
        { concepto: "fase", titulo: "Vaporizar el agua", foco: ["s4"],
          texto: "A 100 °C el agua hierve y la temperatura se queda fija hasta que todo sea vapor. Aquí va el tramo más largo de la curva.",
          pregunta: { texto: "¿Cuánto calor se necesita para vaporizarla?", valor: kJ(v.Q4), unidad: "kJ", pista: "Q = m · L_v = 0.200 · 2 256 000 J; divide entre 1000." },
          lineas: [`Q₄ = m · L_v = ${num(v.m)} · ${num(v.Lv, 0)} = ${num(v.Q4, 0)} J`, `Q₄ = ${num(kJ(v.Q4), 1)} kJ`], resumen: `Q₄ = ${num(kJ(v.Q4), 1)} kJ (vaporización)` },
        { concepto: "calor_sensible", titulo: "Calentar el vapor hasta 110 °C", foco: ["s5"],
          texto: "Por último, el vapor sube de 100 a 110 °C con c del vapor.",
          lineas: [`Q₅ = ${num(v.m)} · ${v.cVapor} · 10 = ${num(v.Q5, 0)} J`, `Q₅ = ${num(kJ(v.Q5), 2)} kJ`], resumen: `Q₅ = ${num(kJ(v.Q5), 2)} kJ (vapor a 110 °C)` },
        { concepto: "fase", titulo: "Energía total", foco: ["tot"],
          texto: "La energía total es la suma de los cinco tramos. Casi todo se va en cambiar de fase, no en subir la temperatura.",
          pregunta: { texto: "¿Cuánta energía total hay que dar?", valor: kJ(v.Q), unidad: "kJ", pista: "Suma Q₁ + Q₂ + Q₃ + Q₄ + Q₅ en kJ." },
          lineas: [`Q = ${num(kJ(v.Q1), 2)} + ${num(kJ(v.Q2), 1)} + ${num(kJ(v.Q3), 2)} + ${num(kJ(v.Q4), 1)} + ${num(kJ(v.Q5), 2)}`, `Q = ${num(kJ(v.Q), 2)} kJ`, `Vaporizar solo fue el ${num((v.Q4 / v.Q) * 100, 0)} % del total.`], destacar: [1], resumen: `Q total = ${num(kJ(v.Q), 2)} kJ` },
      ];
    },
    respuesta: (v) => `Q total = ${num(kJ(v.Q), 2)} kJ`,
  },
  /* ================================ ONDAS ================================ */
  {
    clave: "ond_param", conceptos: ["onda_param"], grupo: "ondas", nivel: 1, ref: "Ondas 1", titulo: "Periodo, velocidad y número de onda", figura: "fond1",
    enunciado: "Una onda viaja por una cuerda con frecuencia 4.00 Hz, longitud de onda 0.500 m y amplitud 0.100 m. Halla el periodo, la velocidad de propagación y el número de onda k.",
    calc() {
      const f = 4, lam = 0.5, A = 0.1, d = derivadas({ f, lam });
      return { f, lam, A, T: d.T, v: d.v, k: d.k, w: d.w };
    },
    pasos(v) {
      return [
        { concepto: "onda_param", titulo: "Periodo", foco: ["f"],
          texto: "El periodo es el tiempo que tarda un punto de la cuerda en completar una oscilación. Es el inverso de la frecuencia.",
          pregunta: { texto: "¿Cuánto vale el periodo T?", valor: v.T, unidad: "s", pista: "T = 1 / f = 1 / 4." },
          lineas: [`T = 1 / f = 1 / ${v.f} Hz`, `T = ${num(v.T, 3)} s`], resumen: `T = ${num(v.T, 3)} s` },
        { concepto: "onda_param", titulo: "Velocidad de la onda", foco: ["lam"],
          texto: "En un periodo la onda avanza exactamente una longitud de onda, así que v = λ / T = λ · f.",
          pregunta: { texto: "¿Con qué velocidad avanza la onda?", valor: v.v, unidad: "m/s", pista: "v = λ · f = 0.500 · 4." },
          lineas: [`v = λ · f = ${num(v.lam, 3)} m · ${v.f} Hz`, `v = ${num(v.v)} m/s`], resumen: `v = ${num(v.v)} m/s` },
        { concepto: "onda_param", titulo: "Número de onda", foco: ["lam"],
          texto: "El número de onda k dice cuántos radianes de fase avanza la onda por cada metro. Una longitud de onda completa equivale a 2π rad.",
          pregunta: { texto: "¿Cuánto vale k?", valor: v.k, unidad: "rad/m", pista: "k = 2π / λ = 2π / 0.500." },
          lineas: [`k = 2π / λ = 2π / ${num(v.lam, 3)} m`, `k = ${num(v.k, 2)} rad/m`, `(Además ω = 2π f = ${num(v.w, 2)} rad/s.)`], destacar: [1], resumen: `k = ${num(v.k, 2)} rad/m` },
      ];
    },
    respuesta: (v) => `T = ${num(v.T, 3)} s · v = ${num(v.v)} m/s · k = ${num(v.k, 2)} rad/m`,
  },
  /* ---------------------------------------------------------------- */
  {
    clave: "ond_xt", conceptos: ["onda_param", "onda_xt"], grupo: "ondas", nivel: 2, ref: "Ondas 2", titulo: "Posición de un punto en la onda", figura: "fond2",
    enunciado: "Una onda y(x, t) = A · sen[2π(x/λ − f·t)] viaja en +x con A = 10.0 cm, f = 2.00 Hz y λ = 1.50 m. ¿Cuánto vale la elevación y del punto x = 0.500 m en el instante t = 0.100 s?",
    calc() {
      const A = 10, f = 2, lam = 1.5, x = 0.5, t = 0.1;
      const v = lam * f, fase = 2 * Math.PI * (x / lam - f * t), y = onda(x, t, { A, f, lam });
      return { A, f, lam, x, t, v, fase, y };
    },
    pasos(v) {
      return [
        { concepto: "onda_param", titulo: "Velocidad de la onda", foco: ["lam"],
          texto: "Primero la velocidad, para entender qué tan rápido pasa la onda por ese punto.",
          pregunta: { texto: "¿Cuánto vale v?", valor: v.v, unidad: "m/s", pista: "v = λ · f = 1.50 · 2.00." },
          lineas: [`v = λ · f = ${num(v.lam)} · ${num(v.f)}`, `v = ${num(v.v)} m/s`], resumen: `v = ${num(v.v)} m/s` },
        { concepto: "onda_xt", titulo: "Fase en ese punto y ese instante", foco: ["punto"],
          texto: "Lo que está dentro del seno es la fase: 2π(x/λ − f·t). Sustituye x = 0.500 m y t = 0.100 s.",
          explica: "Pon la calculadora en radianes. El resultado de la fase también queda en radianes.",
          pregunta: { texto: "¿Cuánto vale la fase?", valor: v.fase, unidad: "rad", pista: "x/λ = 0.3333 y f·t = 0.200. Réstalos y multiplica por 2π." },
          lineas: [`x / λ = ${num(v.x)} / ${num(v.lam)} = ${num(v.x / v.lam, 4)}`, `f · t = ${num(v.f)} · ${num(v.t)} = ${num(v.f * v.t, 3)}`, `fase = 2π (${num(v.x / v.lam, 4)} − ${num(v.f * v.t, 3)}) = ${num(v.fase, 3)} rad`], destacar: [2], resumen: `fase = ${num(v.fase, 3)} rad` },
        { concepto: "onda_xt", titulo: "Elevación del punto", foco: ["punto", "A"],
          texto: "Ahora multiplica la amplitud por el seno de la fase.",
          pregunta: { texto: "¿Cuánto vale y?", valor: v.y, unidad: "cm", pista: "y = 10.0 · sen(0.838), con la calculadora en radianes." },
          lineas: [`y = A · sen(fase) = ${num(v.A, 1)} cm · sen(${num(v.fase, 3)})`, `y = ${num(v.A, 1)} · ${num(Math.sin(v.fase), 4)} = ${num(v.y, 2)} cm`, "Es positivo: el punto está por encima de su posición de equilibrio."], destacar: [1], resumen: `y = ${num(v.y, 2)} cm` },
      ];
    },
    respuesta: (v) => `y = ${num(v.y, 2)} cm`,
  },
  /* ---------------------------------------------------------------- */
  {
    clave: "ond_interf", conceptos: ["onda_param", "interf"], grupo: "ondas", nivel: 2, ref: "Ondas 3", titulo: "Dos altavoces e interferencia", figura: "fond3",
    enunciado: "Dos altavoces en fase emiten un tono de 686 Hz (velocidad del sonido 343 m/s). Un micrófono P está a 3.00 m del altavoz 1 y a 3.75 m del altavoz 2. Las amplitudes que cada uno produce en P son 3.0 y 2.0 (unidades arbitrarias). ¿Qué amplitud mide el micrófono?",
    calc() {
      const f = 686, vs = 343, r1 = 3, r2 = 3.75, A1 = 3, A2 = 2;
      const lam = vs / f, dr = r2 - r1, razon = dr / lam, dfi = 2 * Math.PI * razon, Ar = ampSuma(A1, A2, dfi);
      return { f, vs, r1, r2, A1, A2, lam, dr, razon, dfi, Ar, tipo: tipoInterferencia(A1, A2, dfi) };
    },
    pasos(v) {
      return [
        { concepto: "onda_param", titulo: "Longitud de onda del tono", foco: ["s1", "s2"],
          texto: "Con la velocidad del sonido y la frecuencia sale la longitud de onda: λ = v / f.",
          pregunta: { texto: "¿Cuánto vale λ?", valor: v.lam, unidad: "m", pista: "λ = 343 / 686." },
          lineas: [`λ = v / f = ${v.vs} / ${v.f}`, `λ = ${num(v.lam, 3)} m`], resumen: `λ = ${num(v.lam, 3)} m` },
        { concepto: "interf", titulo: "Diferencia de trayectoria", foco: ["r1", "r2"],
          texto: "Lo que decide la interferencia es cuánto más recorre una onda que la otra, medido en longitudes de onda: Δr / λ.",
          pregunta: { texto: "¿Cuánto vale Δr / λ?", valor: v.razon, unidad: "", pista: "Δr = 3.75 − 3.00 = 0.75 m; divídelo entre λ." },
          lineas: [`Δr = r₂ − r₁ = ${num(v.r2)} − ${num(v.r1)} = ${num(v.dr)} m`, `Δr / λ = ${num(v.dr)} / ${num(v.lam, 3)} = ${num(v.razon)}`], destacar: [1], resumen: `Δr / λ = ${num(v.razon)}` },
        { concepto: "interf", titulo: "Diferencia de fase", foco: ["P"],
          texto: "Cada longitud de onda de diferencia equivale a 2π rad de desfase: Δφ = 2π · Δr / λ.",
          pregunta: { texto: "¿Cuánto vale Δφ?", valor: v.dfi, unidad: "rad", pista: "Δφ = 2π · 1.5 = 3π." },
          lineas: [`Δφ = 2π · ${num(v.razon)} = ${num(v.dfi, 2)} rad`, "Es 3π: un número impar de medios ciclos, así que llegan en oposición."], resumen: `Δφ = ${num(v.dfi, 2)} rad (= 3π)` },
        { concepto: "interf", titulo: "Amplitud resultante", foco: ["P"],
          texto: "Con dos ondas de la misma frecuencia, la amplitud de la suma es A = √(A₁² + A₂² + 2·A₁·A₂·cos Δφ).",
          explica: "Con cos Δφ = −1 las ondas se oponen y la amplitud es |A₁ − A₂|. Con cos Δφ = +1 se refuerzan y es A₁ + A₂.",
          pregunta: { texto: "¿Qué amplitud mide el micrófono?", valor: v.Ar, unidad: "", pista: "cos(3π) = −1, así que A = √(9 + 4 − 12)." },
          lineas: [`A = √(${num(v.A1 ** 2)} + ${num(v.A2 ** 2)} + 2·${num(v.A1)}·${num(v.A2)}·cos ${num(v.dfi, 2)})`, `A = √(13 − 12) = ${num(v.Ar, 2)}`, `Interferencia ${v.tipo}: el altavoz 1 «gana», pero casi se anulan (5.0 sería lo máximo).`], destacar: [1], resumen: `A = ${num(v.Ar, 2)} (interferencia ${v.tipo})` },
      ];
    },
    respuesta: (v) => `A = ${num(v.Ar, 2)} · interferencia ${v.tipo}`,
  },
  /* ---------------------------------------------------------------- */
  {
    clave: "ond_alterna", conceptos: ["alterna"], grupo: "ondas", nivel: 2, ref: "Ondas 4", titulo: "Corriente alterna en una resistencia", figura: "fond4",
    enunciado: "Una fuente de corriente alterna entrega v(t) = V_máx · sen(2π f t) con V_máx = 170 V a una resistencia de 50.0 Ω. Halla el voltaje eficaz, la corriente eficaz y la potencia media.",
    calc() {
      const Vmax = 170, R = 50, a = alterna({ Vmax, R });
      return { Vmax, R, Vrms: a.Vrms, Irms: a.Irms, Pm: a.Pm, Pmax: a.Pmax };
    },
    pasos(v) {
      return [
        { concepto: "alterna", titulo: "Voltaje eficaz", foco: ["vrms", "vmax"],
          texto: "El voltaje eficaz (rms) es el voltaje continuo que daría la misma potencia media. Para una onda senoidal vale V_máx / √2.",
          pregunta: { texto: "¿Cuánto vale V_rms?", valor: v.Vrms, unidad: "V", pista: "V_rms = 170 / √2, y √2 ≈ 1.414." },
          lineas: [`V_rms = V_máx / √2 = ${v.Vmax} / 1.414`, `V_rms = ${num(v.Vrms, 1)} V`], resumen: `V_rms = ${num(v.Vrms, 1)} V` },
        { concepto: "alterna", titulo: "Corriente eficaz", foco: ["R"],
          texto: "La ley de Ohm vale con los valores eficaces: I_rms = V_rms / R.",
          pregunta: { texto: "¿Cuánto vale I_rms?", valor: v.Irms, unidad: "A", pista: "I_rms = 120.2 / 50." },
          lineas: [`I_rms = V_rms / R = ${num(v.Vrms, 1)} / ${num(v.R, 1)}`, `I_rms = ${num(v.Irms, 2)} A`], resumen: `I_rms = ${num(v.Irms, 2)} A` },
        { concepto: "alterna", titulo: "Potencia media", foco: ["R"],
          texto: "La potencia que se disipa en promedio es P = V_rms · I_rms = V_rms² / R.",
          explica: "La potencia instantánea llega a V_máx² / R, pero solo un instante cada medio ciclo: el promedio es la mitad.",
          pregunta: { texto: "¿Cuánto vale la potencia media?", valor: v.Pm, unidad: "W", pista: "P = V_rms² / R = 120.2² / 50." },
          lineas: [`P = V_rms² / R = ${num(v.Vrms, 1)}² / ${num(v.R, 1)}`, `P = ${num(v.Pm, 1)} W`, `Pico: V_máx² / R = ${num(v.Pmax, 0)} W, el doble.`], destacar: [1], resumen: `P media = ${num(v.Pm, 1)} W` },
      ];
    },
    respuesta: (v) => `V_rms = ${num(v.Vrms, 1)} V · I_rms = ${num(v.Irms, 2)} A · P = ${num(v.Pm, 1)} W`,
  },
];
