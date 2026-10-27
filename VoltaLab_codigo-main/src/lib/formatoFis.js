// Formato de magnitudes de Calor y Ondas (sin JSX para poder probarlo con node).
export const fmt = (n, d = 1) => Number(n).toLocaleString("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d });
export const fmtE = (Q) => { const a = Math.abs(Q); return a >= 1e6 ? `${fmt(Q / 1e6, 2)} MJ` : a >= 1e3 ? `${fmt(Q / 1e3, 1)} kJ` : `${fmt(Q, 0)} J`; };
const PARADAS = [[-20, [150, 205, 235]], [20, [59, 130, 196]], [60, [242, 163, 58]], [100, [208, 73, 63]]];
export const colorT = (T) => {
  const x = Math.max(-20, Math.min(100, T));
  let k = 0; while (k < PARADAS.length - 2 && x > PARADAS[k + 1][0]) k++;
  const [t0, c0] = PARADAS[k], [t1, c1] = PARADAS[k + 1], u = (x - t0) / (t1 - t0);
  return `rgb(${c0.map((v, i) => Math.round(v + (c1[i] - v) * u)).join(",")})`;
};
export const fmtN = (x, u = "", d = 2) => `${fmt(x, d)}${u ? " " + u : ""}`;
