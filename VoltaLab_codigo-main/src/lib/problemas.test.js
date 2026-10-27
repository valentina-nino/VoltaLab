import test from "node:test";
import assert from "node:assert/strict";
import { PROBLEMAS, resolverSistema, num } from "../datos/problemas.js";

const P = (c) => PROBLEMAS.find((p) => p.clave === c);
const cerca = (a, b, t = 1e-9) => assert.ok(Math.abs(a - b) < t, `${a} ≠ ${b}`);

test("resolverSistema resuelve un 2x2", () => {
  const [x, y] = resolverSistema([[2, 1], [1, 3]], [5, 10]);
  cerca(x, 1); cerca(y, 3);
});

test("26.64: ε = 8.6 V y las corrientes cumplen Kirchhoff", () => {
  const v = P("p26_64").calc();
  cerca(v.V, 12.6); cerca(v.I1, 3.8); cerca(v.I2, -2); cerca(v.e, 8.6);
  cerca(v.I1 + v.I2, v.I3);                 // nodo
  cerca(v.e1 - v.R1 * v.I1, v.V);           // rama izquierda
  cerca(v.e - v.R2 * v.I2, v.V);            // rama central
});

test("26.66: puente, potenciales y corrientes", () => {
  const v = P("p26_66").calc();
  cerca(v.V1, 8); cerca(v.V2, 6);
  cerca(v.I1, 6); cerca(v.I2, 4); cerca(v.I3, 2); cerca(v.I4, 4); cerca(v.I5, 6);
  cerca(v.Ib, 10); cerca(v.Req, 1.4);
  cerca(v.I1, v.I3 + v.I4); cerca(v.I5, v.I2 + v.I3); // nodos del centro
  cerca(v.E * v.Ib, v.R1 * v.I1 ** 2 + v.R2 * v.I2 ** 2 + v.R3 * v.I3 ** 2 + v.R4 * v.I4 ** 2 + v.R5 * v.I5 ** 2); // potencia
});

test("26.34: 6 Ω disipa 24 W, I_A = 7/30 A y ε = −46 V (polaridad contraria)", () => {
  const v = P("p26_34").calc();
  cerca(v.Imid, 2); cerca(v.Vtb, 7); cerca(v.Rder, 30); cerca(v.Ia, 7 / 30); cerca(Math.abs(v.e), 46); assert.ok(v.e < 0);
  // comprobación independiente: nodal con ε = −46 en la rama izquierda
  const x = (25 * 30 - 9 * 46) / (30 + 18) * 0 + (750 - 414) / 48;
  cerca(x, 7);
  const Imid = (25 - v.Vtb) / 9, Iizq = (v.Vtb - v.e) / 30, Ider = v.Vtb / 30;
  cerca(Imid, Iizq + Ider);
  cerca(v.R6 * Imid ** 2, 24);
});

test("Capacitores 56, 58 y 48", () => {
  const a = P("c56").calc();
  cerca(a.Ceq, 2); cerca(a.Q, 60); cerca(a.V1, 5); cerca(a.V2, 15); cerca(a.V3, 10); cerca(a.V1 + a.V2 + a.V3, 30);
  const b = P("c58").calc();
  cerca(b.C23, 2.4); cerca(b.Ceq, 7.4); cerca(b.Q1, 45); cerca(b.Q23, 21.6); cerca(b.V2, 5.4); cerca(b.V3, 3.6); cerca(b.V2 + b.V3, 9);
  const c = P("c48").calc();
  cerca(c.Cg, 40); cerca(c.Ceq, 20 / 3); cerca(c.Qmax, 150); cerca(c.Vmax, 22.5);
});

test("Cada paso con pregunta tiene valor numérico y pista; las claves son únicas", () => {
  assert.equal(new Set(PROBLEMAS.map((p) => p.clave)).size, PROBLEMAS.length);
  for (const p of PROBLEMAS) {
    const pasos = p.pasos(p.calc());
    assert.ok(pasos.length >= 3, p.clave);
    for (const s of pasos) {
      assert.ok(s.lineas.length > 0 && s.resumen, p.clave);
      if (s.pregunta) { assert.ok(Number.isFinite(s.pregunta.valor), p.clave); assert.ok(s.pregunta.pista, p.clave); }
    }
    assert.ok(!/NaN|undefined/.test(JSON.stringify(pasos)), `${p.clave} tiene NaN/undefined`);
  }
});

test("num recorta ceros", () => { assert.equal(num(2), "2"); assert.equal(num(1.4), "1.4"); assert.equal(num(0.2333, 3), "0.233"); });

// ---------------------------------------------------------------- calor y ondas
test("Calor 1: Q = 418.6 kJ y t = 279 s", () => {
  const v = P("cal_sensible").calc();
  cerca(v.dT, 50); cerca(v.Q, 418600); cerca(v.t, 418600 / 1500);
});
test("Calor 2: equilibrio cobre-agua y conservación de la energía", () => {
  const v = P("cal_mezcla").calc();
  cerca(v.CW, 2093); cerca(v.CCu, 192.5); cerca(v.Tf, 61110 / 2285.5);
  cerca(v.QCu + v.QW, 0, 1e-6); assert.ok(v.QW > 0 && v.QCu < 0);
});
test("Calor 3: calentador de 1200 W y 155 s", () => {
  const v = P("cal_joule").calc();
  cerca(v.P, 1200); cerca(v.Q, 167440); cerca(v.Pu, 1080); cerca(v.t, 167440 / 1080);
});
test("Calor 4: suma de cinco tramos = 609.94 kJ", () => {
  const v = P("cal_fase").calc();
  cerca(v.Q1, 4200); cerca(v.Q2, 66800); cerca(v.Q3, 83720); cerca(v.Q4, 451200); cerca(v.Q5, 4020);
  cerca(v.Q, 609940, 1e-6);
});
test("Ondas 1 y 2: T, v, k, fase y elevación", () => {
  const a = P("ond_param").calc();
  cerca(a.T, 0.25); cerca(a.v, 2); cerca(a.k, 4 * Math.PI, 1e-9); cerca(a.v, a.lam / a.T);
  const b = P("ond_xt").calc();
  cerca(b.v, 3); cerca(b.fase, 2 * Math.PI * (1 / 3 - 0.2), 1e-9); cerca(b.y, 10 * Math.sin(b.fase), 1e-9); cerca(b.y, 7.431, 1e-3);
});
test("Ondas 3: Δr = 3λ/2, Δφ = 3π y amplitud 1.0 (destructiva)", () => {
  const v = P("ond_interf").calc();
  cerca(v.lam, 0.5); cerca(v.razon, 1.5); cerca(v.dfi, 3 * Math.PI, 1e-9); cerca(v.Ar, 1, 1e-9); assert.equal(v.tipo, "destructiva");
});
test("Ondas 4: Vrms = 120.2 V, Irms = 2.40 A, P = 289 W (la mitad del pico)", () => {
  const v = P("ond_alterna").calc();
  cerca(v.Vrms, 170 / Math.SQRT2, 1e-9); cerca(v.Irms, v.Vrms / 50, 1e-9); cerca(v.Pm, 289, 1e-9); cerca(v.Pm * 2, v.Pmax, 1e-9);
});
test("Cada problema nuevo pertenece a un grupo con guía, y cada concepto citado existe", async () => {
  const { GRUPOS_PROB } = await import("../datos/problemas.js");
  const { CONCEPTOS, GUIA } = await import("../datos/guiaProblemas.js");
  for (const p of PROBLEMAS) {
    assert.ok(GRUPOS_PROB[p.grupo], p.clave); assert.ok(GUIA[p.grupo], p.clave);
    for (const c of p.conceptos) assert.ok(CONCEPTOS[c], `${p.clave}: falta ${c}`);
    for (const s of p.pasos(p.calc())) if (s.concepto) assert.ok(CONCEPTOS[s.concepto], `${p.clave}: falta ${s.concepto}`);
  }
  for (const g of Object.keys(GUIA)) for (const c of GUIA[g]) assert.ok(CONCEPTOS[c], `GUIA.${g}: falta ${c}`);
});
