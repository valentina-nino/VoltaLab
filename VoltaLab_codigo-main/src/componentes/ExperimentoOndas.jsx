import { useEffect, useMemo, useRef, useState } from "react";
import { campoOndas } from "../lib/fisicaLab.js";
import { ESCENAS_ONDAS, resultadoEscena, MUNDO, V_ONDAS, P_BOYA } from "../lib/inicioOndas.js";

// Experimento de la portada con ondas: dos fuentes iguales y una boya P.
// El estudiante predice si la boya se mueve mucho o casi nada; las ondas se calculan de verdad (mismo modelo que el simulador libre).
const CW = 160, CH = 100, W = 640, H = 400, COLS = ["#D0493F", "#246B8E"], VENTANA = 3.2, ESPERA = 4200;
const px = (x) => (x / MUNDO.ancho) * W, py = (y) => (y / MUNDO.alto) * H;
const reducido = () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function ExperimentoOndas({ ir }) {
  const cv = useRef(null), buf = useRef(null), est = useRef({ t: 0, on: false, traza: [] }), tm = useRef(null);
  const [esc, setEsc] = useState(0), [fase, setFase] = useState("pregunta"), [eleccion, setEleccion] = useState(null);
  const e = ESCENAS_ONDAS[esc], r = useMemo(() => resultadoEscena(e), [e]);

  useEffect(() => {
    const s = est.current, quieto = reducido();
    const dibujar = () => {
      const c = cv.current; if (!c) return;
      const ctx = c.getContext("2d");
      if (!buf.current) { buf.current = document.createElement("canvas"); buf.current.width = CW; buf.current.height = CH; }
      const bctx = buf.current.getContext("2d"), img = bctx.createImageData(CW, CH), d = img.data, norma = r.ampMax * 0.9;
      for (let j = 0; j < CH; j++) for (let i = 0; i < CW; i++) {
        const k = (j * CW + i) * 4;
        if (!s.on) { d[k] = 246; d[k + 1] = 241; d[k + 2] = 231; d[k + 3] = 255; continue; }
        const u = Math.max(-1, Math.min(1, campoOndas(((i + 0.5) / CW) * MUNDO.ancho, ((j + 0.5) / CH) * MUNDO.alto, s.t, e.fuentes, V_ONDAS) / norma));
        d[k] = u > 0 ? 246 - u * 210 : 246 + u * 30; d[k + 1] = u > 0 ? 241 - u * 134 : 241 + u * 110; d[k + 2] = u > 0 ? 231 - u * 90 : 231 + u * 180; d[k + 3] = 255;
      }
      bctx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = true; ctx.drawImage(buf.current, 0, 0, W, H);
      // distancias de cada fuente a la boya
      ctx.font = "700 15px sans-serif"; ctx.textAlign = "center"; ctx.lineWidth = 2;
      e.fuentes.forEach((f, i) => {
        ctx.setLineDash([7, 6]); ctx.strokeStyle = "rgba(36,50,71,.45)"; ctx.beginPath(); ctx.moveTo(px(f.x), py(f.y)); ctx.lineTo(px(P_BOYA.x), py(P_BOYA.y)); ctx.stroke(); ctx.setLineDash([]);
        const rr = i === 0 ? r.r1 : r.r2, mx = (px(f.x) + px(P_BOYA.x)) / 2, my = (py(f.y) + py(P_BOYA.y)) / 2 + (i === 0 ? -9 : 20);
        ctx.lineWidth = 4; ctx.strokeStyle = "rgba(255,252,246,.9)"; ctx.strokeText(`r${i + 1} = ${rr.toFixed(1)} m`, mx, my); ctx.fillStyle = "#243247"; ctx.fillText(`r${i + 1} = ${rr.toFixed(1)} m`, mx, my);
      });
      ctx.lineWidth = 3;
      e.fuentes.forEach((f, i) => { ctx.beginPath(); ctx.arc(px(f.x), py(f.y), 15, 0, 7); ctx.fillStyle = s.on ? COLS[i] : "#9AA9B8"; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.stroke(); ctx.fillStyle = "#fff"; ctx.fillText(`S${i + 1}`, px(f.x), py(f.y) + 5); });
      // boya P: sube y baja con el campo de ondas
      const y = s.on ? campoOndas(P_BOYA.x, P_BOYA.y, s.t, e.fuentes, V_ONDAS) : 0, dy = (y / r.ampMax) * 30;
      ctx.strokeStyle = "rgba(36,50,71,.5)"; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(px(P_BOYA.x), py(P_BOYA.y), 17, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(px(P_BOYA.x), py(P_BOYA.y) - dy, 14, 0, 7); ctx.fillStyle = "#243247"; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = "#fff"; ctx.fillText("P", px(P_BOYA.x), py(P_BOYA.y) - dy + 5);
      // registro del movimiento de P
      const bx = W - 262, by = 12, bw = 250, bh = 76, cy = by + bh / 2 + 6;
      ctx.fillStyle = "rgba(255,252,246,.9)"; ctx.fillRect(bx, by, bw, bh); ctx.strokeStyle = "rgba(36,50,71,.25)"; ctx.lineWidth = 1.5; ctx.strokeRect(bx, by, bw, bh);
      ctx.font = "700 12px sans-serif"; ctx.textAlign = "left"; ctx.fillStyle = "#5B6B7E"; ctx.fillText("Movimiento de la boya P", bx + 8, by + 16);
      ctx.strokeStyle = "rgba(36,50,71,.3)"; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(bx + 6, cy); ctx.lineTo(bx + bw - 6, cy); ctx.stroke(); ctx.setLineDash([]);
      if (s.traza.length > 1) {
        ctx.strokeStyle = "#172B49"; ctx.lineWidth = 2.4; ctx.beginPath();
        s.traza.forEach(([t, v], k) => { const X = bx + 6 + ((t - (s.t - VENTANA)) / VENTANA) * (bw - 12), Y = cy - (v / r.ampMax) * 26; if (k === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); });
        ctx.stroke();
      }
      ctx.textAlign = "center";
    };
    let id, ant = performance.now();
    const marco = (ahora) => {
      const dt = quieto ? 0 : Math.min(0.05, (ahora - ant) / 1000); ant = ahora;
      if (s.on && dt > 0) { s.t += dt; s.traza.push([s.t, campoOndas(P_BOYA.x, P_BOYA.y, s.t, e.fuentes, V_ONDAS)]); while (s.traza.length && s.t - s.traza[0][0] > VENTANA) s.traza.shift(); }
      dibujar(); id = requestAnimationFrame(marco);
    };
    id = requestAnimationFrame(marco);
    return () => cancelAnimationFrame(id);
  }, [e, r]);
  useEffect(() => () => clearTimeout(tm.current), []);

  const elegir = (op) => {
    const s = est.current; s.t = 0; s.traza = []; s.on = true; setEleccion(op); setFase("probando");
    if (reducido()) { s.t = 4.5; for (let t = 4.5 - VENTANA; t <= 4.5; t += 0.04) s.traza.push([t, campoOndas(P_BOYA.x, P_BOYA.y, t, e.fuentes, V_ONDAS)]); setFase("resultado"); return; }
    tm.current = setTimeout(() => setFase("resultado"), ESPERA);
  };
  const otraPosicion = () => { clearTimeout(tm.current); const s = est.current; s.on = false; s.t = 0; s.traza = []; setEsc((esc + 1) % ESCENAS_ONDAS.length); setEleccion(null); setFase("pregunta"); };
  const acerto = eleccion === e.correcta, pct = Math.round(r.pct * 100);
  const estado = fase === "pregunta" ? ["off", "Fuentes apagadas"] : fase === "probando" ? ["on", "Ondas en camino"] : [e.id === "anula" ? "off" : "on", e.id === "anula" ? "Interferencia destructiva" : "Interferencia constructiva"];
  return (
    <aside className="ini-exp" aria-label="Experimento: dos fuentes de ondas y una boya">
      <div className="ini-exp-cab">
        <span className="ini-etiqueta">Experimento</span>
        <span className={`ini-estado ${estado[0]}`}>{estado[1]}</span>
      </div>
      <div className="ini-exp-lienzo ondas">
        <canvas ref={cv} width={W} height={H} role="img" aria-label="Cubeta de ondas con dos fuentes, S1 y S2, y una boya P" />
      </div>
      <div className="ini-exp-pie" aria-live="polite">
        {fase === "pregunta" ? (
          <>
            <p className="ini-pregunta">Dos fuentes idénticas hacen ondas de λ = 2 m. La boya P está {e.dr} m más lejos de S1 que de S2. ¿Cómo se mueve P?</p>
            <div className="ini-opciones">
              <button className="ini-op" onClick={() => elegir("fuerte")}>Sube y baja con fuerza</button>
              <button className="ini-op" onClick={() => elegir("quieta")}>Casi no se mueve</button>
            </div>
          </>
        ) : fase === "probando" ? (
          <p className="ini-pregunta">Las fuentes empiezan a vibrar…</p>
        ) : (
          <>
            <p className={`ini-resp ${acerto ? "ok" : "no"}`}><b>{acerto ? "Exacto." : "Al revés."}</b>{" "}
              {e.id === "anula"
                ? `Las ondas llegan con media longitud de onda de diferencia (Δr = ${e.dr} m = λ/2): cuando una empuja hacia arriba, la otra empuja hacia abajo. La boya oscila solo el ${pct} % de lo que podría.`
                : `Las ondas llegan con una longitud de onda completa de diferencia (Δr = ${e.dr} m = λ): suben y bajan juntas y sus efectos se suman. La boya oscila el ${pct} % de lo máximo posible.`}</p>
            <div className="ini-opciones">
              <button className="ini-op" onClick={otraPosicion}>Probar otra posición</button>
              <button className="ini-op fuerte" onClick={() => ir("Ondas")}>Aprende por qué →</button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
