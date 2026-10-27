// Modelos de cada escena de Calor y Ondas. Los usan las lecciones, los retos y las escenas.
import { cDe, calor, equilibrio, calentador, curvaAgua, AGUA } from "./termica.js";
import { derivadas, ampSuma, tipoInterferencia, alterna } from "./ondas.js";

export const MODELOS = {
  calor: (v) => { const c = cDe(v.mat), dT = v.Tf - v.T0; return { c, dT, Q: calor(v.m, c, dT) }; },
  mezcla: (v) => {
    const cA = cDe(v.matA), cB = cDe(v.matB), r = equilibrio({ m: v.mA, c: cA, T: v.TA }, { m: v.mB, c: cB, T: v.TB });
    return { cA, cB, Tfin: r.Tf, Qa: r.Qa, Qb: r.Qb };
  },
  fases: (v) => {
    const cv = curvaAgua(v.m, v.T0, v.Tf), sumar = (n) => cv.tramos.filter((t) => t.nombre === n).reduce((s, t) => s + t.Q, 0);
    return { Q: cv.Qtotal, Qf: sumar("Fusión"), Qv: sumar("Vaporización"), nMesetas: cv.tramos.filter((t) => t.tipo === "cambio").length, curva: cv };
  },
  joule: (v) => {
    const r = calentador({ V: v.V, R: v.R, m: v.m, c: AGUA.cAgua, T0: v.T0, t: v.t, eta: v.eta ?? 1 });
    return { P: r.P, I: r.I, Q: r.Q, dT: r.dT, Tfin: r.T, tHierve: r.tHierve };
  },
  onda: (v) => { const d = derivadas({ f: v.f, lam: v.lam }); return { T: d.T, vel: d.v, w: d.w, k: d.k }; },
  interf: (v) => {
    const dfi = (v.dfi * Math.PI) / 180, Ares = ampSuma(v.A1, v.A2, dfi);
    return { Ares, tipo: tipoInterferencia(v.A1, v.A2, dfi) };
  },
  alterna: (v) => { const r = alterna({ Vmax: v.Vmax, R: v.R }); return { Vrms: r.Vrms, Irms: r.Irms, Imax: r.Imax, Pm: r.Pm, Pmax: r.Pmax }; },
};
export const entrada = (escena, v) => ({ ...v, ...MODELOS[escena](v) });
