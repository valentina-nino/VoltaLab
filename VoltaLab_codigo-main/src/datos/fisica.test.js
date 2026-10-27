import { test } from "node:test";
import assert from "node:assert/strict";
import { LECCIONES_FIS, soluciones } from "./leccionesFisica.js";
import { RETOS_FIS, logrado, inicialReto } from "./retosFisica.js";
import { TEORIA_FIS } from "./teoriaFisica.js";
import { MODELOS } from "../lib/modelosFisica.js";

test("cada lección de calor y ondas tiene teoría, medidores válidos y al menos un reto resoluble", () => {
  assert.equal(LECCIONES_FIS.length, 8);
  for (const l of LECCIONES_FIS) {
    assert.ok(TEORIA_FIS[l.clave]?.length >= 5, `teoría de ${l.clave}`);
    const e0 = { ...l.inicial, ...MODELOS[l.escena](l.inicial) };
    for (const m of l.medidor) assert.ok(typeof m.f(m.de(e0)) === "string");
    assert.ok(l.formula(e0).length > 5);
    const tipos = l.tarjetas.map((t) => t.tipo);
    for (const t of ["idea", "explora", "reto", "pregunta", "resumen"]) assert.ok(tipos.includes(t), `${l.clave} sin ${t}`);
    for (const t of l.tarjetas.filter((x) => x.tipo === "reto")) assert.ok(soluciones(l, t).length >= 1, `${l.clave} reto sin solución`);
    for (const t of l.tarjetas.filter((x) => x.tipo === "pregunta")) assert.ok(t.opciones.some(([k]) => k === t.correcta));
  }
});
test("cada reto de laboratorio se puede lograr con los controles y no empieza logrado", () => {
  assert.equal(RETOS_FIS.length, 10);
  for (const r of RETOS_FIS) {
    let ok = 0;
    const rec = (i, v) => { if (i === r.controles.length) { if (logrado(r, v)) ok++; return; } const c = r.controles[i]; const paso = r.controles.length >= 3 ? Math.max(c.paso, (c.max - c.min) / 28) : c.paso; for (let x = c.min; x <= c.max + 1e-9; x += paso) rec(i + 1, { ...v, [c.id]: Math.round(x * 1e6) / 1e6 }); };
    rec(0, {});
    assert.ok(ok >= 1, `${r.clave} sin solución`);
    assert.ok(!logrado(r, inicialReto(r)), `${r.clave} ya empieza logrado`);
    assert.equal(r.pistas.length, 3);
  }
});

// ---------------------------------------------------------------- experimento de ondas de la portada
import { ESCENAS_ONDAS, resultadoEscena, LAMBDA } from "../lib/inicioOndas.js";
test("Portada: la posición «anula» da Δr = λ/2 y casi no mueve la boya", () => {
  const r = resultadoEscena(ESCENAS_ONDAS.find((e) => e.id === "anula"));
  assert.ok(Math.abs(r.dr - LAMBDA / 2) < 1e-9, `Δr = ${r.dr}`);
  assert.ok(r.pct < 0.15, `pct = ${r.pct}`);
  assert.ok(Math.abs(r.amp - r.ampTeorica) < 1e-9);
  assert.ok(r.tipo.startsWith("destructiva"));
});
test("Portada: la posición «refuerza» da Δr = λ y suma las dos amplitudes", () => {
  const r = resultadoEscena(ESCENAS_ONDAS.find((e) => e.id === "refuerza"));
  assert.ok(Math.abs(r.dr - LAMBDA) < 1e-9);
  assert.ok(r.pct > 0.99, `pct = ${r.pct}`);
  assert.equal(r.tipo, "constructiva");
});
test("Portada: las fuentes caben en el mundo de 8 × 5 m", () => {
  for (const e of ESCENAS_ONDAS) for (const f of e.fuentes) assert.ok(f.x > 0.3 && f.x < 7.7 && f.y > 0.3 && f.y < 4.7);
});
