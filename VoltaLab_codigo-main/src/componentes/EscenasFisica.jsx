// Escenas (el «tablero» de las lecciones, retos y laboratorios de Calor y Ondas).
import "../fisica.css";
import { useId, useState } from "react";
import { fmt, fmtE, colorT, useTiempo, Reloj, reducido } from "./fisica.jsx";
import { MATERIALES, calor } from "../lib/termica.js";
import { MODELOS } from "../lib/modelosFisica.js";
import { onda } from "../lib/ondas.js";

const W = 640, H = 300;
const METALES = { aluminio: "#B9C2CC", cobre: "#C77B4A", hierro: "#7B8794", plomo: "#59616B" };
const NOM = { agua: "Agua", aceite: "Aceite", aluminio: "Aluminio", cobre: "Cobre", hierro: "Hierro", plomo: "Plomo" };
const brillo = (T) => Math.max(0, Math.min(1, (T - 20) / 90));

// ---------- piezas ----------
export function Termo({ x, y, T, etiqueta, alto = 140, color, sinTexto }) {
  const f = Math.max(0, Math.min(1, (T + 30) / 160)), col = color || colorT(T), h = f * (alto - 14) + 8;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-8} y={0} width={16} height={alto} rx={8} fill="#fff" stroke="var(--crema-oscuro)" strokeWidth="2" />
      <rect x={-4.5} y={alto - 6 - h + 8} width={9} height={h - 8} rx={4} fill={col} />
      <circle cx={0} cy={alto + 6} r={13} fill={col} stroke="var(--crema-oscuro)" strokeWidth="2" />
      {sinTexto ? null : <><text x={0} y={alto + 34} textAnchor="middle" className="esc-num">{fmt(T, 1)} °C</text>
      <text x={0} y={alto + 50} textAnchor="middle" className="esc-peq">{etiqueta}</text></>}
    </g>
  );
}
export function Vaso({ x, y, w, h, nivel = 0.6, T = 20, rotulo, hielo = 0 }) {
  const id = useId().replace(/:/g, ""), lh = h * nivel;
  return (
    <g>
      <clipPath id={id}><path d={`M${x + 3} ${y} V${y + h - 10} a8 8 0 0 0 8 8 H${x + w - 11} a8 8 0 0 0 8 -8 V${y}z`} /></clipPath>
      <rect x={x + 3} y={y + h - lh} width={w - 6} height={lh} fill={colorT(T)} opacity=".85" clipPath={`url(#${id})`} />
      {hielo ? [0, 1, 2].map((k) => <rect key={k} x={x + 22 + k * ((w - 70) / 2.5)} y={y + h - lh - 4 + k * 5} width={30} height={26} rx={5} fill="#fff" opacity=".8" stroke="#BFD4E4" strokeWidth="2" />) : null}
      <path d={`M${x} ${y} V${y + h - 8} a10 10 0 0 0 10 10 H${x + w - 10} a10 10 0 0 0 10 -10 V${y}`} fill="none" stroke="var(--texto2)" strokeWidth="3" strokeLinecap="round" />
      {rotulo ? <text x={x + w / 2} y={y + h + 24} textAnchor="middle" className="esc-peq">{rotulo}</text> : null}
    </g>
  );
}
export function Bloque({ x, y, w, h, mat, T, rotulo }) {
  const g = brillo(T), base = METALES[mat] || "#999";
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={base} stroke="var(--texto2)" strokeWidth="3" />
      <rect x={x} y={y} width={w} height={h} rx={8} fill="#E5502F" opacity={g * 0.6} />
      <rect x={x + 10} y={y + 8} width={w - 20} height={8} rx={4} fill="#fff" opacity=".25" />
      {rotulo ? <text x={x + w / 2} y={y + h + 24} textAnchor="middle" className="esc-peq">{rotulo}</text> : null}
    </g>
  );
}
const Llama = ({ x, y, s = 1 }) => <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M0 0c-14 -10 -8 -24 0 -34c4 10 16 14 10 26c-2 4 -6 8 -10 8z" fill="#F29D1B" /><path d="M0 -2c-6 -4 -3 -12 0 -16c2 6 7 8 4 14z" fill="#FFD866" /></g>;
const Flecha = ({ x1, y1, x2, y2, color = "var(--acento)" }) => {
  const a = Math.atan2(y2 - y1, x2 - x1), p = (d) => `${x2 - 12 * Math.cos(a - d)},${y2 - 12 * Math.sin(a - d)}`;
  return <g stroke={color} strokeWidth="3" fill={color} strokeLinecap="round"><line x1={x1} y1={y1} x2={x2} y2={y2} /><polygon points={`${x2},${y2} ${p(0.4)} ${p(-0.4)}`} stroke="none" /></g>;
};

// ---------- CALOR ----------
function EscCalor({ v }) {
  const r = MODELOS.calor(v), esMetal = !!METALES[v.mat], nivel = 0.35 + (v.m / 5) * 0.55;
  const todos = MATERIALES.map((x) => ({ ...x, q: calor(v.m, x.c, v.Tf - v.T0) })), max = Math.max(...todos.map((x) => Math.abs(x.q)), 1);
  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="esc-svg" role="img" aria-label="Un cuerpo que se calienta">
        {esMetal ? <Bloque x={70} y={110 + (1 - nivel) * 40} w={150} h={90 + nivel * 40} mat={v.mat} T={v.Tf} rotulo={`${NOM[v.mat]} · ${fmt(v.m, 1)} kg`} />
          : <Vaso x={65} y={60} w={160} h={150} nivel={nivel} T={v.Tf} rotulo={`${NOM[v.mat]} · ${fmt(v.m, 1)} kg`} />}
        {r.dT > 0 ? [105, 145, 185].map((x) => <Llama key={x} x={x} y={262} s={0.55} />) : null}
        <Flecha x1={250} y1={140} x2={340} y2={140} color={r.Q >= 0 ? "var(--error)" : "var(--acento)"} />
        <text x={295} y={118} textAnchor="middle" className="esc-num" style={{ fill: "var(--p)" }}>Q = {r.Q >= 0 ? "+" : ""}{fmtE(r.Q)}</text>
        <text x={295} y={166} textAnchor="middle" className="esc-peq">{r.dT === 0 ? "sin cambio" : r.Q > 0 ? "absorbe calor" : "cede calor"}</text>
        <Termo x={420} y={34} T={v.T0} etiqueta="inicial" />
        <Termo x={540} y={34} T={v.Tf} etiqueta="final" />
      </svg>
      <div className="fis-barras esc-extra">
        <p className="fis-peq">Misma masa y mismo ΔT en otros materiales:</p>
        {todos.map((x) => <div key={x.id} className={x.id === v.mat ? "on" : ""}><span>{x.nombre}</span><i><u style={{ width: `${(Math.abs(x.q) / max) * 100}%` }} /></i><b>{fmtE(x.q)}</b></div>)}
      </div>
    </>
  );
}
function EscMezcla({ v }) {
  const r = MODELOS.mezcla(v), esMetal = !!METALES[v.matA], nivel = 0.4 + (v.mB / 2) * 0.35;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="esc-svg" role="img" aria-label="Dos cuerpos que se mezclan">
      <Vaso x={50} y={70} w={210} h={150} nivel={nivel} T={r.Tfin} rotulo={`B: agua ${fmt(v.mB, 1)} kg`} />
      {esMetal ? <Bloque x={110} y={100} w={90} h={60 + v.mA * 24} mat={v.matA} T={r.Tfin} />
        : <Vaso x={105} y={100} w={100} h={80} nivel={0.7} T={v.TA} />}
      <text x={155} y={58} textAnchor="middle" className="esc-peq">A: {NOM[v.matA].toLowerCase()} {fmt(v.mA, 1)} kg</text>
      <Flecha x1={280} y1={120} x2={330} y2={120} color="var(--error)" />
      <text x={305} y={104} textAnchor="middle" className="esc-peq" style={{ fill: "var(--error)" }}>A cede {fmtE(-r.Qa)}</text>
      <Flecha x1={330} y1={165} x2={280} y2={165} color="var(--acento)" />
      <text x={305} y={188} textAnchor="middle" className="esc-peq" style={{ fill: "var(--acento)" }}>B absorbe {fmtE(r.Qb)}</text>
      <Termo x={400} y={40} T={v.TA} etiqueta="A inicial" alto={120} />
      <Termo x={485} y={40} T={v.TB} etiqueta="B inicial" alto={120} />
      <Termo x={575} y={40} T={r.Tfin} etiqueta="equilibrio" alto={120} color="var(--exito)" />
    </svg>
  );
}
function EscFases({ v }) {
  const r = MODELOS.fases(v), cv = r.curva, ml = 52, mb = 34, qmax = cv.Qtotal || 1;
  const X = (Q) => ml + (Q / qmax) * (W - ml - 18), Y = (T) => H - mb - ((T + 40) / 190) * (H - mb - 20);
  const fin = cv.puntos[cv.puntos.length - 1];
  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="esc-svg" role="img" aria-label="Curva de calentamiento del agua">
        {[0, 100].map((T) => <g key={T}><line x1={ml} x2={W - 18} y1={Y(T)} y2={Y(T)} className="esc-rej" /><text x={ml - 8} y={Y(T) + 4} textAnchor="end" className="esc-peq">{T} °C</text></g>)}
        <line x1={ml} x2={ml} y1={12} y2={H - mb} className="esc-eje" /><line x1={ml} x2={W - 18} y1={H - mb} y2={H - mb} className="esc-eje" />
        {cv.puntos.slice(1).map((p, i) => { const q0 = cv.puntos[i], t = cv.tramos[i]; return (
          <g key={i}><line x1={X(q0.Q)} y1={Y(q0.T)} x2={X(p.Q)} y2={Y(p.T)} className={t.tipo === "cambio" ? "esc-meseta" : "esc-rampa"} />
            {t.tipo === "cambio" ? <text x={(X(q0.Q) + X(p.Q)) / 2} y={Y(p.T) - 10} textAnchor="middle" className="esc-peq" style={{ fill: "var(--error)" }}>{t.nombre}</text> : null}</g>); })}
        <circle cx={X(fin.Q)} cy={Y(fin.T)} r={7} fill="var(--elec)" stroke="var(--elec-oscuro)" strokeWidth="3" />
        <text x={W / 2} y={H - 8} textAnchor="middle" className="esc-peq">Calor aportado (kJ) — total {fmt(cv.Qtotal / 1000, 0)} kJ</text>
      </svg>
      <table className="fis-tabla esc-extra"><thead><tr><th>Tramo</th><th>De → a</th><th>Calor</th></tr></thead>
        <tbody>{cv.tramos.map((t, i) => <tr key={i} className={t.tipo}><td>{t.nombre}</td><td>{t.tipo === "cambio" ? `${t.T1} °C (constante)` : `${fmt(t.T1, 0)} → ${fmt(t.T2, 0)} °C`}</td><td>{fmtE(t.Q)}</td></tr>)}</tbody></table>
    </>
  );
}
function EscJoule({ v, t }) {
  const r = MODELOS.joule(v), Tm = Math.min(100, r.Tfin), hierve = r.Tfin >= 100;
  const zig = "M300 160 l12 -26 l24 52 l24 -52 l24 52 l24 -52 l12 26";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="esc-svg" role="img" aria-label="Calentador eléctrico en agua">
      <rect x={28} y={110} width={56} height={90} rx={6} fill="var(--elec-suave)" stroke="var(--elec-oscuro)" strokeWidth="3" />
      <text x={56} y={150} textAnchor="middle" className="esc-num">{v.V} V</text>
      <text x={56} y={172} textAnchor="middle" className="esc-peq">fuente</text>
      <Vaso x={255} y={100} w={210} h={130} nivel={0.45 + v.m * 0.3} T={Tm} />
      <path d="M56 110V80H300V160M444 160V80H610V275H56V200" className="esc-cable" />
      <path d={zig} fill="none" stroke="#E5502F" strokeWidth="5" strokeLinejoin="round" />
      {hierve ? [0, 1, 2, 3, 4, 5].map((k) => { const ph = ((t * 0.9 + k / 6) % 1); return <circle key={k} cx={285 + k * 32} cy={225 - ph * 90} r={4 + (k % 3)} fill="#fff" opacity={0.85 - ph * 0.6} stroke="#BFD4E4" />; }) : null}
      <text x={360} y={254} textAnchor="middle" className="esc-peq">{fmt(v.m, 1)} kg de agua · R = {v.R} Ω</text>
      <Termo x={545} y={100} T={Math.min(130, r.Tfin)} etiqueta={hierve ? "¡hierve!" : "final"} alto={80} />
      <text x={330} y={32} textAnchor="middle" className="esc-num" style={{ fill: "var(--p)" }}>P = {fmt(r.P, 0)} W</text>
      <text x={330} y={54} textAnchor="middle" className="esc-peq">I = {fmt(r.I, 2)} A · Q = {fmtE(r.Q)}</text>
    </svg>
  );
}

// ---------- ONDAS ----------
const trazo = (n, f) => Array.from({ length: n + 1 }, (_, i) => f(i / n)).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
function EscOnda({ v, t }) {
  const L = 6, p = { A: v.A, f: v.f, lam: v.lam, fase: ((v.fase || 0) * Math.PI) / 180 }, d = MODELOS.onda(v);
  const X = (x) => 24 + (x / L) * (W - 48), Y = (y) => 105 - (y / 5) * 80;
  const c1 = (((v.lam * (v.f * t + 0.25 - p.fase / (2 * Math.PI))) % v.lam) + v.lam) % v.lam, c2 = c1 + v.lam;
  const xp = L / 2, tw = 3 * d.T, tau = t % tw, X2 = (s) => 24 + (s / tw) * (W - 48), Y2 = (y) => 238 - (y / 5) * 48;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="esc-svg" role="img" aria-label="Onda viajera">
      <line x1={24} x2={W - 24} y1={105} y2={105} className="esc-rej" />
      <polyline points={trazo(200, (u) => [X(u * L), Y(onda(u * L, t, p))])} className="esc-onda" />
      <line x1={X(xp)} x2={X(xp)} y1={105} y2={Y(onda(xp, t, p))} className="esc-guia" /><circle cx={X(xp)} cy={Y(onda(xp, t, p))} r={7} fill="var(--error)" />
      {c2 <= L ? <g><line x1={X(c1)} x2={X(c1)} y1={Y(v.A) - 8} y2={Y(v.A) - 24} className="esc-guia" /><line x1={X(c2)} x2={X(c2)} y1={Y(v.A) - 8} y2={Y(v.A) - 24} className="esc-guia" />
        <line x1={X(c1)} x2={X(c2)} y1={Y(v.A) - 20} y2={Y(v.A) - 20} className="esc-brace" /><text x={(X(c1) + X(c2)) / 2} y={Y(v.A) - 28} textAnchor="middle" className="esc-peq">λ = {fmt(v.lam, 1)} m</text></g> : null}
      <g><line x1={W - 40} x2={W - 40} y1={Y(0)} y2={Y(v.A)} className="esc-brace" /><text x={W - 46} y={Y(v.A / 2) + 4} textAnchor="end" className="esc-peq">A = {fmt(v.A, 0)} cm</text></g>
      <text x={26} y={22} className="esc-peq">En el espacio: la cuerda en este instante · v = {fmt(d.vel, 2)} m/s</text>
      <line x1={24} x2={W - 24} y1={238} y2={238} className="esc-rej" />
      <polyline points={trazo(160, (u) => [X2(u * tw), Y2(onda(xp, u * tw, p))])} className="esc-onda2" />
      <line x1={X2(0)} x2={X2(d.T)} y1={284} y2={284} className="esc-brace" /><text x={X2(d.T / 2)} y={278} textAnchor="middle" className="esc-peq">T = {fmt(d.T, 2)} s</text>
      <circle cx={X2(tau)} cy={Y2(onda(xp, tau, p))} r={6} fill="var(--error)" />
      <text x={26} y={170} className="esc-peq">En el tiempo: el punto rojo de arriba, a lo largo de 3 periodos</text>
    </svg>
  );
}
function EscInterf({ v, t }) {
  const L = 6, base = { f: v.f, lam: v.lam }, p1 = { ...base, A: v.A1, fase: 0 }, p2 = { ...base, A: v.A2, fase: (v.dfi * Math.PI) / 180 };
  const X = (x) => 24 + (x / L) * (W - 48), esc = 9, cy = [52, 140, 238];
  const r = MODELOS.interf(v);
  const fila = (i, f, cls, nombre, env) => (
    <g key={i}><line x1={24} x2={W - 24} y1={cy[i]} y2={cy[i]} className="esc-rej" />
      {env ? [-1, 1].map((s) => <line key={s} x1={24} x2={W - 24} y1={cy[i] - s * env * esc} y2={cy[i] - s * env * esc} className="esc-guia" />) : null}
      <polyline points={trazo(200, (u) => [X(u * L), cy[i] - f(u * L) * esc])} className={cls} />
      <text x={26} y={cy[i] - (i === 2 ? 58 : 38)} className="esc-peq">{nombre}</text></g>
  );
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="esc-svg" role="img" aria-label="Interferencia de dos ondas">
      {fila(0, (x) => onda(x, t, p1), "esc-onda azul", `Onda 1 · A = ${fmt(v.A1, 0)} cm`)}
      {fila(1, (x) => onda(x, t, p2), "esc-onda naranja", `Onda 2 · A = ${fmt(v.A2, 0)} cm · Δφ = ${fmt(v.dfi, 0)}°`)}
      {fila(2, (x) => onda(x, t, p1) + onda(x, t, p2), "esc-onda", `Suma · A = ${fmt(r.Ares, 2)} cm (${r.tipo})`, r.Ares)}
    </svg>
  );
}
function EscAlterna({ v, t }) {
  const d = MODELOS.alterna(v), ciclos = 2, X = (u) => 40 + u * (W - 70);
  const vv = (u) => v.Vmax * Math.sin(2 * Math.PI * ciclos * u), Yv = (x) => 100 - (x / 170) * 70, Pmaxi = 170 * 170 / 50, Yp = (x) => 270 - (x / Pmaxi) * 100;
  const u0 = (t / 2) % 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="esc-svg" role="img" aria-label="Voltaje y potencia en corriente alterna">
      <text x={42} y={20} className="esc-peq">Voltaje v(t) · pico {fmt(v.Vmax, 0)} V · eficaz {fmt(d.Vrms, 1)} V · f = {fmt(v.f, 0)} Hz</text>
      <line x1={40} x2={W - 30} y1={Yv(0)} y2={Yv(0)} className="esc-rej" />
      {[-1, 1].map((s) => <line key={s} x1={40} x2={W - 30} y1={Yv(s * d.Vrms)} y2={Yv(s * d.Vrms)} className="esc-guia" />)}
      <text x={W - 32} y={Yv(d.Vrms) - 4} textAnchor="end" className="esc-peq">+Vrms</text>
      <polyline points={trazo(240, (u) => [X(u), Yv(vv(u))])} className="esc-onda azul" />
      <circle cx={X(u0)} cy={Yv(vv(u0))} r={6} fill="var(--error)" />
      <text x={42} y={166} className="esc-peq">Potencia en la resistencia p(t) = v²/R · media {fmt(d.Pm, 1)} W · máxima {fmt(d.Pmax, 1)} W</text>
      <line x1={40} x2={W - 30} y1={Yp(0)} y2={Yp(0)} className="esc-rej" />
      <line x1={40} x2={W - 30} y1={Yp(d.Pm)} y2={Yp(d.Pm)} className="esc-guia" /><text x={W - 32} y={Yp(d.Pm) - 4} textAnchor="end" className="esc-peq">media</text>
      <polyline points={trazo(240, (u) => [X(u), Yp((vv(u) ** 2) / v.R)])} className="esc-onda" />
      <circle cx={X(u0)} cy={Yp((vv(u0) ** 2) / v.R)} r={6} fill="var(--error)" />
      <text x={W / 2} y={H - 8} textAnchor="middle" className="esc-peq">Dos ciclos de la red (en la realidad duran apenas {fmt(2000 / v.f, 0)} milisegundos)</text>
    </svg>
  );
}

const ESC = { calor: EscCalor, mezcla: EscMezcla, fases: EscFases, joule: EscJoule, onda: EscOnda, interf: EscInterf, alterna: EscAlterna };
const ANIMADAS = new Set(["joule", "onda", "interf", "alterna"]);

export default function Escena({ escena, v }) {
  const [activo, setActivo] = useState(() => !reducido()), [vel, setVel] = useState(1);
  const anim = ANIMADAS.has(escena), t = useTiempo(anim && activo, vel), S = ESC[escena];
  return (
    <div className="escena-fis">
      <div className="esc-cuerpo"><S v={v} t={t} /></div>
      {anim ? <Reloj activo={activo} setActivo={setActivo} vel={vel} setVel={setVel} /> : null}
    </div>
  );
}
