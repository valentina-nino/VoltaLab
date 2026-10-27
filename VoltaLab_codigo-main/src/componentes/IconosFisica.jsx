// Iconos SVG de las lecciones y los módulos de Calor y Ondas.
const base = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" };
const DIB = {
  termometro: <><rect x="34" y="4" width="12" height="28" rx="6" /><circle cx="40" cy="36" r="6" fill="currentColor" /><path d="M56 12h10M56 22h14M56 32h10" /></>,
  mezcla: <><path d="M10 10v26a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4V10" /><path d="M46 10v26a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4V10" /><path d="M10 26h28M46 20h28" /></>,
  fases: <><path d="M6 38L24 30V16L40 14V6L50 6V16L64 14V6" /><path d="M6 40h72" opacity=".4" /></>,
  joule: <><path d="M6 24h14l4-9 6 18 6-18 6 18 4-9h14" /><path d="M62 8c4 4-4 6 0 12M70 8c4 4-4 6 0 12" opacity=".7" /></>,
  onda: <path d="M4 24C14 2 24 2 32 24S50 46 60 24 74 2 80 24" />,
  lambda: <><path d="M4 28C12 10 20 10 26 28S40 46 48 28 62 10 70 28" /><path d="M18 8h30M18 5v6M48 5v6" /></>,
  interf: <><path d="M4 14C12 4 20 4 28 14S44 24 52 14 68 4 80 14" /><path d="M4 34C12 24 20 24 28 34S44 44 52 34 68 24 80 34" opacity=".6" /></>,
  alterna: <><path d="M4 24C12 4 20 4 24 24S36 44 44 24 56 4 64 24" /><path d="M4 24h76" opacity=".4" /><path d="M64 24c4 -12 12 -12 16 0" opacity=".5" /></>,
  calor: <><rect x="36" y="4" width="12" height="30" rx="6" /><circle cx="42" cy="37" r="6" fill="currentColor" /><path d="M58 12h10M58 22h14M58 32h10" /></>,
  ondas: <path d="M4 23C14 2 24 2 32 23S50 44 60 23 74 2 80 23" />,
  lab: <><path d="M32 6h20M36 6v14L22 40a4 4 0 0 0 3.5 6h33a4 4 0 0 0 3.5-6L48 20V6" /><path d="M28 34h28" opacity=".6" /></>,
  circuito: <><path d="M10 10h64v28H10z" /><path d="M30 10v-0M42 38v0" /><rect x="34" y="4" width="16" height="12" rx="3" fill="var(--tarjeta)" /></>,
};
export function IconoFis({ tipo, w = 70, h = 34 }) {
  return <svg viewBox="0 0 84 46" width={w} height={h} {...base} aria-hidden="true">{DIB[tipo] || DIB.calor}</svg>;
}
