// Ondas: funciones puras
export const derivadas = ({ f, lam }) => ({ T: 1 / f, w: 2 * Math.PI * f, k: (2 * Math.PI) / lam, v: lam * f });
// Onda viajera hacia +x: y = A·sen(2π(x/λ − f·t) + φ)
export const onda = (x, t, { A, f, lam, fase = 0 }) => A * Math.sin(2 * Math.PI * (x / lam - f * t) + fase);
// Amplitud de la suma de dos ondas de igual f y λ con diferencia de fase dfi (rad)
export const ampSuma = (A1, A2, dfi) => Math.sqrt(A1 * A1 + A2 * A2 + 2 * A1 * A2 * Math.cos(dfi));
export function tipoInterferencia(A1, A2, dfi) {
  const r = ampSuma(A1, A2, dfi), max = A1 + A2, min = Math.abs(A1 - A2);
  if (r >= max - 0.03 * max) return "constructiva";
  if (r <= min + 0.03 * max) return min < 0.03 * max ? "destructiva total" : "destructiva";
  return "parcial";
}
// Corriente alterna sobre una resistencia R: v = Vmax·sen(2πft)
export function alterna({ Vmax, R }) {
  const Vrms = Vmax / Math.SQRT2;
  return { Vrms, Irms: Vrms / R, Imax: Vmax / R, Pm: (Vrms * Vrms) / R, Pmax: (Vmax * Vmax) / R };
}