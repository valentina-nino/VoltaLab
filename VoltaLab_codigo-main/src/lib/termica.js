// Calorimetría: funciones puras (unidades SI; temperaturas en °C)
export const MATERIALES = [
  { id: "agua", nombre: "Agua", c: 4186 },
  { id: "aceite", nombre: "Aceite", c: 2000 },
  { id: "aluminio", nombre: "Aluminio", c: 900 },
  { id: "hierro", nombre: "Hierro", c: 449 },
  { id: "cobre", nombre: "Cobre", c: 385 },
  { id: "plomo", nombre: "Plomo", c: 129 },
];
export const cDe = (id) => MATERIALES.find((x) => x.id === id).c;

// Q = m·c·ΔT (J). Positivo: el cuerpo absorbe calor.
export const calor = (m, c, dT) => m * c * dT;

// Equilibrio térmico de dos cuerpos sin cambio de fase ni pérdidas.
export function equilibrio(a, b) {
  const ca = a.m * a.c, cb = b.m * b.c;
  const Tf = (ca * a.T + cb * b.T) / (ca + cb);
  return { Tf, Qa: ca * (Tf - a.T), Qb: cb * (Tf - b.T) };
}

// Calentador eléctrico (efecto Joule): P = V²/R, Q = η·P·t
export function calentador({ V, R, m, c, T0, t, eta = 1 }) {
  const P = (V * V) / R, I = V / R, Q = eta * P * t;
  const dT = Q / (m * c);
  const tHierve = P > 0 ? (m * c * (100 - T0)) / (eta * P) : Infinity;
  return { P, I, Q, dT, T: T0 + dT, tHierve };
}

// Curva de calentamiento del agua (hielo → agua → vapor)
export const AGUA = { cHielo: 2100, cAgua: 4186, cVapor: 2010, Lf: 334000, Lv: 2256000 };
export function curvaAgua(m, T0, Tf) {
  const tramos = [], puntos = [{ Q: 0, T: T0 }];
  let T = T0, Q = 0;
  const calentar = (nombre, c, hasta) => {
    if (T < hasta && Tf > T) {
      const T2 = Math.min(hasta, Tf), q = m * c * (T2 - T);
      tramos.push({ nombre, tipo: "calentar", T1: T, T2, Q: q }); Q += q; T = T2; puntos.push({ Q, T });
    }
  };
  const cambio = (nombre, Tc, L) => {
    if (T === Tc && Tf > Tc) { const q = m * L; tramos.push({ nombre, tipo: "cambio", T1: Tc, T2: Tc, Q: q }); Q += q; puntos.push({ Q, T: Tc }); }
  };
  calentar("Hielo", AGUA.cHielo, 0);
  cambio("Fusión", 0, AGUA.Lf);
  calentar("Agua líquida", AGUA.cAgua, 100);
  cambio("Vaporización", 100, AGUA.Lv);
  calentar("Vapor", AGUA.cVapor, Infinity);
  return { tramos, puntos, Qtotal: Q };
}