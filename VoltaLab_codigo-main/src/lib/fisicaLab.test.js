import { test } from "node:test";
import assert from "node:assert/strict";
import { crearCuerpo, nuevoLab, pasoLab, tempCuerpo, energiaTotal, aguaDeH, HdeT_agua, campoOndas } from "./fisicaLab.js";
import { equilibrio } from "./termica.js";

const casi = (a, b, tol = 0.02) => assert.ok(Math.abs(a - b) <= tol, `${a} vs ${b}`);

test("equilibrio de dos cuerpos en un recipiente aislado coincide con la fórmula", () => {
  const lab = nuevoLab(); lab.kAmb = 0; lab.aislado.A = true;
  const a = crearCuerpo("cobre", { m: 0.5, T: 100 }), b = crearCuerpo("agua", { m: 0.5, T: 20 });
  lab.cuerpos.push(a, b);
  const E0 = energiaTotal(lab);
  for (let i = 0; i < 40; i++) pasoLab(lab, 30);
  const esp = equilibrio({ m: 0.5, c: 385, T: 100 }, { m: 0.5, c: 4186, T: 20 }).Tf;
  casi(tempCuerpo(a), esp, 0.05); casi(tempCuerpo(b), esp, 0.05);
  casi(energiaTotal(lab), E0, 1e-3 * Math.abs(E0) + 1);
});
test("el agua tiene mesetas en 0 y 100 °C", () => {
  const m = 1;
  assert.equal(aguaDeH(m, 100000).T, 0);
  assert.equal(aguaDeH(m, 334000 + 4186 * 100 + 1000).T, 100);
  casi(aguaDeH(m, HdeT_agua(m, 37, true)).T, 37, 1e-6);
  casi(aguaDeH(m, HdeT_agua(m, -15, false)).T, -15, 1e-6);
  casi(aguaDeH(m, HdeT_agua(m, 130, true)).T, 130, 1e-6);
});
test("un calentador de 600 W calienta 0,5 kg de agua como Q = P·t", () => {
  const lab = nuevoLab(); lab.kAmb = 0;
  const a = crearCuerpo("agua", { m: 0.5, T: 20 }); lab.cuerpos.push(a);
  lab.fuentes.push({ id: "f1", tipo: "calentador", V: 120, R: 24, eta: 1, objetivo: a.id, on: true });
  pasoLab(lab, 100);
  casi(tempCuerpo(a), 20 + (600 * 100) / (0.5 * 4186), 0.05);
});
test("el hielo se funde y se queda en 0 °C mientras tanto", () => {
  const lab = nuevoLab(); lab.kAmb = 0;
  const h = crearCuerpo("hielo", { m: 1, T: -10 }); lab.cuerpos.push(h);
  lab.fuentes.push({ id: "f1", tipo: "mechero", W: 1000, objetivo: h.id, on: true });
  pasoLab(lab, 100); casi(tempCuerpo(h), 0, 1e-9); // 21 kJ calientan; 79 kJ funden
  pasoLab(lab, 100); casi(tempCuerpo(h), 0, 1e-9);
});
test("dos fuentes iguales en fase se refuerzan en el punto medio", () => {
  const f = [{ x: -1, y: 0, f: 1, A: 1, fase: 0, on: true }, { x: 1, y: 0, f: 1, A: 1, fase: 0, on: true }];
  const solo = [f[0]];
  let max2 = 0, max1 = 0;
  for (let t = 5; t < 6; t += 0.01) { max2 = Math.max(max2, Math.abs(campoOndas(0, 0, t, f, 2))); max1 = Math.max(max1, Math.abs(campoOndas(0, 0, t, solo, 2))); }
  assert.ok(max2 > 1.8 * max1);
});

import { cambiarMasa, fijarTemperatura, ejemploLab } from "./fisicaLab.js";
test("cambiar la masa conserva la temperatura y fijar T la establece", () => {
  const c = crearCuerpo("agua", { m: 1, T: 50 });
  cambiarMasa(c, 2); casi(tempCuerpo(c), 50, 1e-9);
  fijarTemperatura(c, 70); casi(tempCuerpo(c), 70, 1e-9);
  const h = crearCuerpo("hielo", { m: 1, T: -10 }); fijarTemperatura(h, -5); casi(tempCuerpo(h), -5, 1e-9);
});
test("los ejemplos del laboratorio de calor corren sin errores y el agua hierve", () => {
  const lab = ejemploLab("hervir");
  for (let i = 0; i < 200; i++) pasoLab(lab, 1);
  assert.ok(tempCuerpo(lab.cuerpos[0]) >= 99.9);
  for (const n of ["calorimetro", "hielo"]) { const l = ejemploLab(n); for (let i = 0; i < 100; i++) pasoLab(l, 5); assert.ok(l.cuerpos.every((c) => Number.isFinite(tempCuerpo(c)))); }
});
