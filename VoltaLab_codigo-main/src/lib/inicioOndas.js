// Experimento de ondas de la portada: dos fuentes iguales y una boya P.
// Dos posiciones de la fuente 2 dan el resultado contrario: Δr = λ/2 (se anulan) o Δr = λ (se refuerzan).
import { intensidadOndas } from "./fisicaLab.js";
import { ampSuma, tipoInterferencia } from "./ondas.js";

export const MUNDO = { ancho: 8, alto: 5 };
export const V_ONDAS = 3, F_ONDAS = 1.5, A_ONDAS = 1.5; // λ = v / f = 2 m
export const LAMBDA = V_ONDAS / F_ONDAS;
export const P_BOYA = { x: 6.5, y: 2.5 };
const S1 = { x: 2, y: 1 }, Y2 = 4;

// Coloca la fuente 2 sobre la altura Y2 para que r₂ = r₁ − Δr exactamente.
const fuente2 = (dr) => {
  const r1 = Math.hypot(P_BOYA.x - S1.x, P_BOYA.y - S1.y), r2 = r1 - dr;
  return { x: P_BOYA.x - Math.sqrt(r2 * r2 - (P_BOYA.y - Y2) ** 2), y: Y2 };
};

export const ESCENAS_ONDAS = [
  { id: "anula", dr: LAMBDA / 2, correcta: "quieta" },
  { id: "refuerza", dr: LAMBDA, correcta: "fuerte" },
].map((e) => ({ ...e, fuentes: [{ ...S1, f: F_ONDAS, A: A_ONDAS, fase: 0, on: true }, { ...fuente2(e.dr), f: F_ONDAS, A: A_ONDAS, fase: 0, on: true }] }));

// Lo que de verdad ocurre en P (mismas fórmulas que el simulador libre).
export function resultadoEscena(e) {
  const [a, b] = e.fuentes, r1 = Math.hypot(P_BOYA.x - a.x, P_BOYA.y - a.y), r2 = Math.hypot(P_BOYA.x - b.x, P_BOYA.y - b.y);
  const at = (r) => A_ONDAS / Math.sqrt(1 + 0.6 * r), a1 = at(r1), a2 = at(r2);
  const amp = Math.sqrt(2 * intensidadOndas(P_BOYA.x, P_BOYA.y, e.fuentes, V_ONDAS));
  return { r1, r2, dr: r1 - r2, razon: (r1 - r2) / LAMBDA, a1, a2, amp, ampMax: a1 + a2, pct: amp / (a1 + a2), tipo: tipoInterferencia(a1, a2, (2 * Math.PI * (r1 - r2)) / LAMBDA), ampTeorica: ampSuma(a1, a2, (2 * Math.PI * (r1 - r2)) / LAMBDA) };
}
