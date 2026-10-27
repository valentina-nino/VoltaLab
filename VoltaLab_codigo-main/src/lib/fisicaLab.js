// Simulador libre de calor y de ondas: funciones puras (sin React).
import { AGUA } from "./termica.js";

// ---------------------------------------------------------------- CALOR
export const TIPOS_CUERPO = {
  agua: { nombre: "Agua", c: 4186, fase: true, forma: "vaso" },
  hielo: { nombre: "Hielo", c: 2100, fase: true, forma: "hielo" },
  aceite: { nombre: "Aceite", c: 2000, forma: "vaso" },
  aluminio: { nombre: "Aluminio", c: 900, forma: "bloque" },
  hierro: { nombre: "Hierro", c: 449, forma: "bloque" },
  cobre: { nombre: "Cobre", c: 385, forma: "bloque" },
  plomo: { nombre: "Plomo", c: 129, forma: "bloque" },
};
export const RECIPIENTES = ["A", "B", "C"];

// Entalpía del agua (J) respecto a hielo a 0 °C sólido: -∞..0 hielo, 0..m·Lf se funde, etc.
export const HdeT_agua = (m, T, liquida) => {
  if (T < 0) return m * AGUA.cHielo * T;
  if (!liquida && T === 0) return 0;
  if (T < 100 || (T === 100 && liquida)) return m * AGUA.Lf + m * AGUA.cAgua * T;
  return m * (AGUA.Lf + AGUA.cAgua * 100 + AGUA.Lv) + m * AGUA.cVapor * (T - 100);
};
// Temperatura y estado del agua a partir de su entalpía
export function aguaDeH(m, H) {
  const H0 = 0, H1 = m * AGUA.Lf, H2 = H1 + m * AGUA.cAgua * 100, H3 = H2 + m * AGUA.Lv;
  if (H < H0) return { T: H / (m * AGUA.cHielo), fase: "hielo", frac: 0 };
  if (H <= H1) return { T: 0, fase: H === H0 ? "hielo" : "fusion", frac: H / H1 };
  if (H < H2) return { T: (H - H1) / (m * AGUA.cAgua), fase: "agua", frac: 1 };
  if (H <= H3) return { T: 100, fase: H === H2 ? "agua" : "vaporizacion", frac: (H - H2) / (H3 - H2) };
  return { T: 100 + (H - H3) / (m * AGUA.cVapor), fase: "vapor", frac: 1 };
}

let _id = 1;
export function crearCuerpo(tipo, { m, T, rec = "A" } = {}) {
  const def = TIPOS_CUERPO[tipo];
  const masa = m ?? (def.forma === "bloque" ? 0.5 : 1);
  const T0 = T ?? (tipo === "hielo" ? -10 : tipo === "agua" ? 20 : def.forma === "bloque" ? 100 : 20);
  const c = { id: `c${_id++}`, tipo, m: masa, rec, T0, nombre: def.nombre };
  c.H = def.fase ? HdeT_agua(masa, T0, tipo === "agua") : masa * def.c * T0;
  return c;
}
export function estadoCuerpo(c) {
  const def = TIPOS_CUERPO[c.tipo];
  if (def.fase) return aguaDeH(c.m, c.H);
  return { T: c.H / (c.m * def.c), fase: "solido", frac: 1 };
}
export const tempCuerpo = (c) => estadoCuerpo(c).T;
// capacidad térmica efectiva (J/K) en la fase actual, para escoger el paso de tiempo
const capacidad = (c) => {
  const def = TIPOS_CUERPO[c.tipo];
  if (!def.fase) return c.m * def.c;
  const f = estadoCuerpo(c).fase;
  return c.m * (f === "hielo" ? AGUA.cHielo : f === "vapor" ? AGUA.cVapor : AGUA.cAgua);
};
export const potenciaFuente = (f) => (f.tipo === "calentador" ? ((f.V * f.V) / f.R) * f.eta : f.W);

export function nuevoLab() {
  return { cuerpos: [], fuentes: [], termometros: [], t: 0, k: 40, kAmb: 0.6, Tamb: 20, aislado: { A: false, B: false, C: false }, historial: [] };
}
// Avanza dt segundos de simulación. Calor entre cuerpos del mismo recipiente + fuentes + pérdidas al ambiente.
export function pasoLab(lab, dt) {
  if (!lab.cuerpos.length) { lab.t += dt; return lab; }
  const capMin = Math.min(...lab.cuerpos.map(capacidad));
  const hMax = Math.max(0.02, Math.min(1, (0.2 * capMin) / Math.max(lab.k * lab.cuerpos.length, 1)));
  let resto = dt;
  while (resto > 1e-9) {
    const h = Math.min(hMax, resto), est = lab.cuerpos.map(estadoCuerpo), dH = lab.cuerpos.map(() => 0);
    lab.cuerpos.forEach((a, i) => {
      lab.cuerpos.forEach((b, j) => { if (j > i && a.rec === b.rec) { const q = lab.k * (est[j].T - est[i].T) * h; dH[i] += q; dH[j] -= q; } });
      if (!lab.aislado[a.rec]) dH[i] += lab.kAmb * (lab.Tamb - est[i].T) * h;
    });
    lab.fuentes.forEach((f) => { if (f.on && f.objetivo) { const i = lab.cuerpos.findIndex((c) => c.id === f.objetivo); if (i >= 0) dH[i] += potenciaFuente(f) * h; } });
    lab.cuerpos.forEach((c, i) => { c.H += dH[i]; });
    resto -= h; lab.t += h;
  }
  return lab;
}
export const energiaTotal = (lab) => lab.cuerpos.reduce((s, c) => s + c.H, 0);
export const muestra = (lab) => ({ t: lab.t, T: Object.fromEntries(lab.cuerpos.map((c) => [c.id, tempCuerpo(c)])) });

// ---------------------------------------------------------------- ONDAS
export const campoOndas = (x, y, t, fuentes, v) => fuentes.reduce((s, f) => {
  if (!f.on) return s;
  const r = Math.hypot(x - f.x, y - f.y), lam = v / f.f, atten = 1 / Math.sqrt(1 + 0.6 * r);
  const retraso = r / v; // la perturbación aún no llegó si t < r / v
  if (t < retraso) return s;
  return s + f.A * atten * Math.sin(2 * Math.PI * (f.f * t - r / lam) + (f.fase * Math.PI) / 180);
}, 0);
export const infoOndas = (f, v) => ({ lam: v / f, T: 1 / f, w: 2 * Math.PI * f, k: (2 * Math.PI * f) / v });
// Distancia entre dos máximos de interferencia constructiva sobre la línea que une dos fuentes iguales: λ/2
export const nodosEntre = (d, lam) => Math.floor((2 * d) / lam);

// ---------------------------------------------------------------- edición de piezas
// H es proporcional a la masa, así que al cambiarla se conserva la temperatura y la fase.
export const cambiarMasa = (c, m) => { c.H *= m / c.m; c.m = m; return c; };
export function fijarTemperatura(c, T) {
  const def = TIPOS_CUERPO[c.tipo];
  c.H = def.fase ? HdeT_agua(c.m, T, c.tipo === "agua" || T > 0) : c.m * def.c * T;
  return c;
}
export const aportarCalor = (lab, dt) => lab.fuentes.reduce((s, f) => (f.on && f.objetivo && lab.cuerpos.some((c) => c.id === f.objetivo) ? s + potenciaFuente(f) * dt : s), 0);
export function ejemploLab(nombre) {
  const lab = nuevoLab();
  const poner = (tipo, o) => { const c = crearCuerpo(tipo, o); lab.cuerpos.push(c); return c; };
  if (nombre === "calorimetro") {
    lab.aislado.A = true; const a = poner("cobre", { m: 0.5, T: 100, rec: "A" }), b = poner("agua", { m: 0.5, T: 20, rec: "A" });
    lab.termometros.push({ id: "t1", objetivo: a.id }, { id: "t2", objetivo: b.id });
  } else if (nombre === "hervir") {
    const b = poner("agua", { m: 0.5, T: 20, rec: "A" });
    lab.fuentes.push({ id: "f1", tipo: "calentador", V: 120, R: 12, eta: 0.9, objetivo: b.id, on: true });
    lab.termometros.push({ id: "t1", objetivo: b.id });
  } else if (nombre === "hielo") {
    const h = poner("hielo", { m: 0.5, T: -20, rec: "A" }), p = poner("plomo", { m: 1, T: 150, rec: "B" }), a = poner("aluminio", { m: 1, T: 150, rec: "B" });
    lab.fuentes.push({ id: "f1", tipo: "mechero", W: 500, objetivo: h.id, on: true });
    lab.termometros.push({ id: "t1", objetivo: h.id }, { id: "t2", objetivo: p.id }, { id: "t3", objetivo: a.id });
  }
  lab.contador = 10;
  return lab;
}

// Intensidad media (∝ amplitud²) del patrón de interferencia: suma coherente por grupos de igual frecuencia.
export function intensidadOndas(x, y, fuentes, v) {
  const grupos = {};
  for (const s of fuentes) {
    if (!s.on) continue;
    const r = Math.hypot(x - s.x, y - s.y), a = s.A / Math.sqrt(1 + 0.6 * r), ph = (s.fase * Math.PI) / 180 - (2 * Math.PI * s.f * r) / v;
    const g = grupos[s.f] || (grupos[s.f] = [0, 0]); g[0] += a * Math.cos(ph); g[1] += a * Math.sin(ph);
  }
  return Object.values(grupos).reduce((t, [re, im]) => t + (re * re + im * im) / 2, 0);
}
