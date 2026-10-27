// Figuras de los problemas aplicados, dibujadas en SVG. `foco` resalta las piezas del paso actual.

const zig = (x, y, L, vert) => {
  const lead = (L - 42) / 2;
  const pts = [[0, 0], [lead, 0]];
  for (let k = 0; k < 6; k++) pts.push([lead + 3.5 + 7 * k, k % 2 ? 7 : -7]);
  pts.push([lead + 42, 0], [L, 0]);
  return "M" + pts.map(([t, s]) => (vert ? `${x + s} ${y + t}` : `${x + t} ${y + s}`)).join(" L");
};

function useFoco(foco) { return (id) => (foco && foco.includes(id) ? " foco" : ""); }

function Res({ x, y, L, v, id, f }) { return <path className={`e${f(id)}`} d={zig(x, y, L, v)} />; }
function Hilo({ d }) { return <path className="w" d={d} />; }
function Nodo({ x, y, id, f }) { return <circle className={`nodo${f(id)}`} cx={x} cy={y} r="3.6" />; }

// Batería. eje "v": vertical (+ arriba o abajo); eje "h": horizontal (+ izquierda o derecha).
function Bat({ x, y, eje, plus, id, f }) {
  const c = `e${f(id)}`;
  if (eje === "v") {
    const yl = plus === "arriba" ? y - 4 : y + 4, yc = plus === "arriba" ? y + 4 : y - 4;
    return <g className={c}><path d={`M${x - 12} ${yl} H${x + 12}`} /><path d={`M${x - 6} ${yc} H${x + 6}`} strokeWidth="4" /></g>;
  }
  const xl = plus === "izq" ? x - 4 : x + 4, xc = plus === "izq" ? x + 4 : x - 4;
  return <g className={c}><path d={`M${xl} ${y - 12} V${y + 12}`} /><path d={`M${xc} ${y - 6} V${y + 6}`} strokeWidth="4" /></g>;
}

// Capacitor: dos placas. eje "v": cables verticales (placas horizontales); "h": cables horizontales.
function Cap({ x, y, eje, id, f }) {
  const c = `e${f(id)}`;
  return eje === "v"
    ? <g className={c}><path d={`M${x - 13} ${y - 4} H${x + 13} M${x - 13} ${y + 4} H${x + 13}`} /></g>
    : <g className={c}><path d={`M${x - 4} ${y - 13} V${y + 13} M${x + 4} ${y - 13} V${y + 13}`} /></g>;
}

function T({ x, y, children, a = "start", id, f, s = 14 }) {
  return <text className={`t${f ? f(id) : ""}`} x={x} y={y} textAnchor={a} fontSize={s}>{children}</text>;
}

/* ---------------- 26.64 ---------------- */
function F2664({ f }) {
  return (
    <svg viewBox="0 0 380 250" role="img" aria-label="Tres ramas en paralelo: batería de 24 V con 3 ohm, fuente ε con 2 ohm y resistor de 7 ohm">
      <Hilo d="M100 40 H300 M100 210 H300" />
      <path className={`w${f("top")}`} d="M100 40 H300" />
      {/* rama 1 */}
      <Hilo d="M100 40 V80 M100 90 V110 M100 180 V210" /><Bat x={100} y={85} eje="v" plus="arriba" id="b1" f={f} /><Res x={100} y={110} L={70} v id="r1" f={f} />
      {/* rama 2 */}
      <Hilo d="M190 40 V80 M190 90 V110 M190 180 V210" /><Bat x={190} y={85} eje="v" plus="arriba" id="b2" f={f} /><Res x={190} y={110} L={70} v id="r2" f={f} />
      {/* rama 3 */}
      <Hilo d="M300 40 V80 M300 160 V210" /><Res x={300} y={80} L={80} v id="r3" f={f} />
      <Nodo x={100} y={40} f={f} /><Nodo x={190} y={40} f={f} /><Nodo x={100} y={210} f={f} /><Nodo x={190} y={210} f={f} />
      <T x={116} y={76} s={15}>+</T><T x={206} y={76} s={15}>+</T>
      <T x={82} y={90} a="end" id="b1" f={f}>24.0 V</T><T x={86} y={150} a="end" id="r1" f={f}>3.00 Ω</T>
      <T x={172} y={90} a="end" id="b2" f={f}>ε = ?</T><T x={176} y={150} a="end" id="r2" f={f}>2.00 Ω</T>
      <T x={314} y={124} id="r3" f={f}>7.00 Ω</T>
    </svg>
  );
}

/* ---------------- 26.66 ---------------- */
function F2666({ f }) {
  return (
    <svg viewBox="0 0 380 250" role="img" aria-label="Puente de resistores con batería de 14 V">
      <Hilo d="M60 50 H270 M60 210 H270 M60 50 V110 M60 140 V210 M140 130 H170 M240 130 H270" />
      <Bat x={60} y={125} eje="v" plus="arriba" id="bat" f={f} />
      <Hilo d="M60 110 V121 M60 129 V140" />
      <Res x={140} y={50} L={80} v id="r1" f={f} /><Res x={140} y={130} L={80} v id="r4" f={f} />
      <Res x={270} y={50} L={80} v id="r2" f={f} /><Res x={270} y={130} L={80} v id="r5" f={f} />
      <Res x={140} y={130} L={130} id="r3" f={f} />
      <Nodo x={140} y={130} id="n1" f={f} /><Nodo x={270} y={130} id="n2" f={f} />
      <Nodo x={140} y={50} f={f} /><Nodo x={270} y={50} f={f} /><Nodo x={140} y={210} f={f} /><Nodo x={270} y={210} f={f} />
      <T x={42} y={129} a="end" id="bat" f={f}>14.0 V</T>
      <T x={73} y={44} s={15}>+</T>
      <T x={128} y={94} a="end" id="r1" f={f}>R₁ 1.00 Ω</T><T x={128} y={178} a="end" id="r4" f={f}>R₄ 2.00 Ω</T>
      <T x={282} y={94} id="r2" f={f}>R₂ 2.00 Ω</T><T x={282} y={178} id="r5" f={f}>R₅ 1.00 Ω</T>
      <T x={205} y={116} a="middle" id="r3" f={f}>R₃ 1.00 Ω</T>
      <T x={128} y={122} a="end" id="n1" f={f}>V₁</T><T x={282} y={122} id="n2" f={f}>V₂</T>
    </svg>
  );
}

/* ---------------- 26.34 ---------------- */
function F2634({ f }) {
  return (
    <svg viewBox="0 0 470 300" role="img" aria-label="Circuito con tres ramas: fem desconocida, rama central con batería de 25 V y rama derecha con resistores y amperímetro">
      {/* izquierda */}
      <Hilo d="M60 80 H100 M200 80 H270 M60 80 V134 M60 142 V240 M60 240 H100 M200 240 H290" />
      <Bat x={60} y={138} eje="v" plus="arriba" id="e" f={f} />
      <Res x={100} y={80} L={100} id="r17" f={f} /><Res x={100} y={240} L={100} id="r13" f={f} />
      {/* central */}
      <Res x={200} y={80} L={82} v id="r6" f={f} />
      <Bat x={200} y={166} eje="v" plus="arriba" id="b25" f={f} />
      <Res x={200} y={170} L={70} v id="r3m" f={f} />
      <Nodo x={200} y={80} id="nodeT" f={f} /><Nodo x={200} y={240} id="nodeB" f={f} />
      <path className="flecha" d="M186 136 V108 M181 114 L186 107 L191 114" />
      {/* derecha */}
      <Hilo d="M270 80 V42 H290 M270 80 V118 H290 M370 42 H385 V80 M370 118 H385 V80 M385 80 H430 M430 80 V80 M430 170 V186 M430 214 V240 M370 240 H430" />
      <Res x={290} y={42} L={80} id="rp1" f={f} /><Res x={290} y={118} L={80} id="rp2" f={f} />
      <Res x={430} y={80} L={90} v id="r19" f={f} />
      <Res x={290} y={240} L={80} id="r1" f={f} />
      <g className={`e${f("amp")}`}><circle cx="430" cy="200" r="14" style={{ fill: "var(--tarjeta)" }} /><text x="430" y="205" textAnchor="middle" fontSize="14" className="t" style={{ fontStyle: "normal" }}>A</text></g>
      <Nodo x={270} y={80} f={f} /><Nodo x={385} y={80} f={f} />
      <T x={72} y={126} s={15}>+</T><T x={212} y={160} s={15}>+</T>
      <T x={150} y={70} a="middle" id="r17" f={f}>17 Ω</T><T x={150} y={262} a="middle" id="r13" f={f}>13 Ω</T>
      <T x={42} y={144} a="end" id="e" f={f}>ε = ?</T>
      <T x={182} y={190} a="end" id="b25" f={f}>25 V</T>
      <T x={212} y={118} id="r6" f={f}>6.0 Ω</T><T x={212} y={222} id="r3m" f={f}>3.0 Ω</T>
      <T x={330} y={34} a="middle" id="rp1" f={f}>20.0 Ω</T><T x={330} y={142} a="middle" id="rp2" f={f}>20.0 Ω</T>
      <T x={442} y={128} id="r19" f={f}>19 Ω</T>
      <T x={330} y={262} a="middle" id="r1" f={f}>1.0 Ω</T>
    </svg>
  );
}

/* ---------------- 56 ---------------- */
function Fc56({ f }) {
  return (
    <svg viewBox="0 0 380 250" role="img" aria-label="Batería de 30 V con tres capacitores en serie de 12, 4 y 6 microfaradios">
      <Hilo d="M70 40 H250 M70 210 H250 M70 40 V111 M70 139 V210 M250 40 V66 M250 74 V121 M250 129 V176 M250 184 V210" />
      <Bat x={70} y={125} eje="v" plus="arriba" id="bat" f={f} />
      <Hilo d="M70 111 V121 M70 129 V139" />
      <Cap x={250} y={70} eje="v" id="c1" f={f} /><Cap x={250} y={125} eje="v" id="c2" f={f} /><Cap x={250} y={180} eje="v" id="c3" f={f} />
      <T x={52} y={129} a="end" id="bat" f={f}>30 V</T><T x={84} y={34} s={15}>+</T>
      <T x={272} y={74} id="c1" f={f}>C₁ = 12 μF</T><T x={272} y={129} id="c2" f={f}>C₂ = 4 μF</T><T x={272} y={184} id="c3" f={f}>C₃ = 6 μF</T>
    </svg>
  );
}

/* ---------------- 58 ---------------- */
function Fc58({ f }) {
  return (
    <svg viewBox="0 0 380 250" role="img" aria-label="Batería de 9 V, un capacitor de 5 microfaradios en paralelo con dos capacitores de 4 y 6 microfaradios en serie">
      <Hilo d="M60 40 H250 M60 210 H250 M60 40 V111 M60 139 V210 M150 40 V121 M150 129 V210 M250 40 V86 M250 94 V156 M250 164 V210" />
      <Bat x={60} y={125} eje="v" plus="arriba" id="bat" f={f} />
      <Hilo d="M60 111 V121 M60 129 V139" />
      <Cap x={150} y={125} eje="v" id="c1" f={f} /><Cap x={250} y={90} eje="v" id="c2" f={f} /><Cap x={250} y={160} eje="v" id="c3" f={f} />
      <Nodo x={150} y={40} f={f} /><Nodo x={150} y={210} f={f} />
      <T x={42} y={129} a="end" id="bat" f={f}>9 V</T><T x={73} y={34} s={15}>+</T>
      <T x={164} y={129} id="c1" f={f}>C₁ = 5 μF</T><T x={264} y={94} id="c2" f={f}>C₂ = 4 μF</T><T x={264} y={164} id="c3" f={f}>C₃ = 6 μF</T>
    </svg>
  );
}

/* ---------------- 48 ---------------- */
function Fc48({ f }) {
  return (
    <svg viewBox="0 0 400 250" role="img" aria-label="Dos grupos de dos capacitores de 20 microfaradios en paralelo, con un capacitor de 10 microfaradios en medio, todo en serie">
      <Hilo d="M15 125 H50 M50 70 V180 M150 70 V180 M150 125 H196 M204 125 H250 M250 70 V180 M350 70 V180 M350 125 H385" />
      <Hilo d="M50 70 H96 M104 70 H150 M50 180 H96 M104 180 H150 M250 70 H296 M304 70 H350 M250 180 H296 M304 180 H350" />
      <Cap x={100} y={70} eje="h" id="ga1" f={f} /><Cap x={100} y={180} eje="h" id="ga2" f={f} />
      <Cap x={200} y={125} eje="h" id="cm" f={f} />
      <Cap x={300} y={70} eje="h" id="gb1" f={f} /><Cap x={300} y={180} eje="h" id="gb2" f={f} />
      <circle className="nodo" cx="15" cy="125" r="3.6" /><circle className="nodo" cx="385" cy="125" r="3.6" />
      <T x={100} y={52} a="middle" id="ga1" f={f}>20.0 μF</T><T x={100} y={212} a="middle" id="ga2" f={f}>20.0 μF</T>
      <T x={200} y={104} a="middle" id="cm" f={f}>10.0 μF</T>
      <T x={300} y={52} a="middle" id="gb1" f={f}>20.0 μF</T><T x={300} y={212} a="middle" id="gb2" f={f}>20.0 μF</T>
      <T x={200} y={236} a="middle" id="bat" f={f} s={12}>Voltaje de ruptura de cada capacitor: 15.0 V</T>
    </svg>
  );
}

/* ======================= CALOR ======================= */
// Vaso con agua: x, y = esquina superior izquierda; nivel = fracción llena.
function Vaso({ x, y, w, h, nivel = 0.65, id, f, rotulo }) {
  const top = y + h * (1 - nivel);
  return (
    <g>
      <path className={`agua${f(id)}`} d={`M${x + 3} ${top} H${x + w - 3} V${y + h - 4} Q${x + w - 3} ${y + h} ${x + w - 8} ${y + h} H${x + 8} Q${x + 3} ${y + h} ${x + 3} ${y + h - 4} Z`} />
      <path className="w" d={`M${x} ${y} V${y + h - 8} Q${x} ${y + h} ${x + 8} ${y + h} H${x + w - 8} Q${x + w} ${y + h} ${x + w} ${y + h - 8} V${y}`} />
      {rotulo ? <T x={x + w / 2} y={top + 24} a="middle" id={id} f={f} s={13}>{rotulo}</T> : null}
    </g>
  );
}
function Llama({ x, y, id, f }) { return <path className={`llama${f(id)}`} d={`M${x} ${y} C${x - 14} ${y - 14} ${x - 6} ${y - 26} ${x} ${y - 38} C${x + 4} ${y - 26} ${x + 16} ${y - 20} ${x + 8} ${y - 6} C${x + 6} ${y - 2} ${x + 2} ${y} ${x} ${y} Z`} />; }
function Termo({ x, y, h, T, id, f }) {
  return (
    <g>
      <rect className={`e${f(id)}`} x={x - 6} y={y} width="12" height={h} rx="6" />
      <circle className={`bulbo${f(id)}`} cx={x} cy={y + h + 6} r="9" />
      <rect className={`bulbo${f(id)}`} x={x - 3} y={y + h * (1 - T)} width="6" height={h * T + 2} />
    </g>
  );
}

function Fcal1({ f }) {
  return (
    <svg viewBox="0 0 380 250" role="img" aria-label="Olla con 2 kilogramos de agua que se calienta de 20 a 70 grados con una estufa de 1500 watts">
      <Vaso x={105} y={50} w={130} h={100} nivel={0.7} id="agua" f={f} rotulo="Agua 2.00 kg" />
      <path className="w" d="M85 158 H255" />
      <Llama x={146} y={196} id="estufa" f={f} /><Llama x={170} y={196} id="estufa" f={f} /><Llama x={194} y={196} id="estufa" f={f} />
      <path className="w" d="M85 202 H255" />
      <T x={170} y={228} a="middle" id="estufa" f={f}>Estufa 1500 W</T>
      <Termo x={300} y={50} h={100} T={0.7} id="dT" f={f} />
      <T x={286} y={78} a="end" id="dT" f={f} s={13}>70.0 °C</T><T x={286} y={146} a="end" id="dT" f={f} s={13}>20.0 °C</T>
      <T x={170} y={36} a="middle" id="agua" f={f} s={13}>c = 4186 J/(kg·K)</T>
    </svg>
  );
}
function Fcal2({ f }) {
  return (
    <svg viewBox="0 0 380 250" role="img" aria-label="Bloque de cobre de 0.5 kilogramos a 100 grados que cae en un calorímetro con 0.5 kilogramos de agua a 20 grados">
      <rect className={`bloque${f("cobre")}`} x="150" y="30" width="80" height="48" rx="4" />
      <T x={190} y={60} a="middle" id="cobre" f={f} s={13}>Cobre</T>
      <path className="flecha" d="M190 86 V118 M184 110 L190 120 L196 110" />
      <T x={250} y={50} id="cobre" f={f} s={13}>0.500 kg</T><T x={250} y={68} id="cobre" f={f} s={13}>100 °C</T>
      <Vaso x={110} y={110} w={160} h={105} nivel={0.7} id="agua" f={f} rotulo="Agua 0.500 kg" />
      <rect className="aislante" x="100" y="102" width="180" height="120" rx="12" />
      <T x={190} y={238} a="middle" id="agua" f={f} s={13}>20.0 °C · calorímetro aislado</T>
      <T x={300} y={170} id="tf" f={f}>T_f = ?</T>
    </svg>
  );
}
function Fcal3({ f }) {
  return (
    <svg viewBox="0 0 380 250" role="img" aria-label="Fuente de 120 voltios conectada a una resistencia de 12 ohmios sumergida en 0.5 kilogramos de agua">
      <Hilo d="M55 121 V45 H125 V130 H150" /><Hilo d="M55 129 V215 H345 V130 H310" />
      <Bat x={55} y={125} eje="v" plus="arriba" id="bat" f={f} />
      <T x={40} y={128} a="end" id="bat" f={f}>120 V</T>
      <Vaso x={140} y={70} w={180} h={130} nivel={0.75} id="agua" f={f} />
      <Res x={150} y={130} L={160} id="res" f={f} />
      <T x={230} y={116} a="middle" id="res" f={f}>12.0 Ω</T>
      <T x={230} y={166} a="middle" id="agua" f={f} s={13}>Agua 0.500 kg</T><T x={230} y={184} a="middle" id="agua" f={f} s={13}>20.0 → 100 °C</T>
      <T x={230} y={236} a="middle" id="eta" f={f} s={13}>Solo el 90 % del calor llega al agua (η = 0.90)</T>
    </svg>
  );
}
function Fcal4({ f }) {
  const seg = (id, d) => <path className={`curva${f(id)}`} d={d} />;
  return (
    <svg viewBox="0 0 400 250" role="img" aria-label="Curva de calentamiento del agua: hielo, fusión, agua líquida, vaporización y vapor">
      <path className="w" d="M45 20 V205 H385" />
      <T x={52} y={22} s={12}>T (°C)</T><T x={385} y={224} a="end" s={12}>Q (calor)</T>
      <path className="guia" d="M45 170 H340 M45 62 H340" /><T x={38} y={174} a="end" s={12}>0</T><T x={38} y={66} a="end" s={12}>100</T>
      {seg("s1", "M60 190 L90 170")}{seg("s2", "M90 170 H150")}{seg("s3", "M150 170 L225 62")}{seg("s4", "M225 62 H335")}{seg("s5", "M335 62 L365 46")}
      <T x={78} y={201} a="middle" id="s1" f={f} s={12}>hielo</T>
      <T x={120} y={160} a="middle" id="s2" f={f} s={12}>fusión</T>
      <T x={174} y={122} a="end" id="s3" f={f} s={12}>agua</T>
      <T x={280} y={50} a="middle" id="s4" f={f} s={12}>vaporización</T>
      <T x={350} y={92} a="middle" id="s5" f={f} s={12}>vapor</T>
      <T x={215} y={242} a="middle" id="tot" f={f} s={12}>−10 °C → 110 °C · m = 0.200 kg · esquema, no a escala</T>
    </svg>
  );
}

/* ======================= ONDAS ======================= */
// Senoide como polilínea: y = A·sen(2π(x − x0)/L − φ)
const senoide = (x0, x1, yc, A, L, fi = 0) => {
  const pts = [];
  for (let x = x0; x <= x1; x += 4) pts.push(`${x} ${(yc - A * Math.sin((2 * Math.PI * (x - x0)) / L - fi)).toFixed(1)}`);
  return "M" + pts.join(" L");
};

function Fond1({ f }) {
  return (
    <svg viewBox="0 0 380 250" role="img" aria-label="Onda en una cuerda con amplitud 0.1 metros y longitud de onda 0.5 metros">
      <path className="guia" d="M30 125 H350" />
      <path className="onda" d={senoide(40, 320, 125, 50, 140)} />
      <path className={`w${f("A")}`} d="M75 125 V75 M69 83 L75 75 L81 83" />
      <T x={75} y={66} a="middle" id="A" f={f}>A = 0.100 m</T>
      <path className={`w${f("lam")}`} d="M75 40 H215 M75 34 V46 M215 34 V46" />
      <T x={145} y={30} a="middle" id="lam" f={f}>λ = 0.500 m</T>
      <T x={190} y={222} a="middle" id="f" f={f}>f = 4.00 Hz</T>
    </svg>
  );
}
function Fond2({ f }) {
  const A = 50, L = 140, x0 = 40, xp = x0 + (0.5 / 1.5) * L, fi = 2 * Math.PI * 0.2; // f·t = 0.2 ciclos
  const yp = 125 - A * Math.sin((2 * Math.PI * (xp - x0)) / L - fi);
  return (
    <svg viewBox="0 0 380 250" role="img" aria-label="Instantánea de la onda en t = 0.1 s con el punto x = 0.5 metros marcado">
      <path className="guia" d="M30 125 H350" />
      <path className="onda" d={senoide(x0, 320, 125, A, L, fi)} />
      <path className={`guia${f("punto")}`} d={`M${xp} 125 V${yp} M${xp} 125 V190`} />
      <circle className={`nodo${f("punto")}`} cx={xp} cy={yp} r="6" />
      <T x={xp} y={58} a="middle" id="punto" f={f}>x = 0.500 m</T>
      <T x={xp - 12} y={yp + 2} a="end" id="punto" f={f}>y = ?</T>
      <path className={`w${f("lam")}`} d={`M${x0} 205 H${x0 + L} M${x0} 199 V211 M${x0 + L} 199 V211`} />
      <T x={x0 + L / 2} y={228} a="middle" id="lam" f={f}>λ = 1.50 m</T>
      <T x={330} y={34} a="end" id="A" f={f}>A = 10.0 cm</T><T x={330} y={54} a="end">t = 0.100 s · f = 2.00 Hz</T>
    </svg>
  );
}
function Altavoz({ x, y, id, f, n }) {
  return (
    <g>
      <rect className={`e${f(id)}`} x={x - 14} y={y - 10} width="12" height="20" />
      <path className={`e${f(id)}`} d={`M${x - 2} ${y - 10} L${x + 12} ${y - 22} V${y + 22} L${x - 2} ${y + 10}`} />
      <path className="guia" d={`M${x + 20} ${y - 12} Q${x + 28} ${y} ${x + 20} ${y + 12} M${x + 28} ${y - 18} Q${x + 40} ${y} ${x + 28} ${y + 18}`} />
      <T x={x - 8} y={y + 40} a="middle" id={id} f={f} s={13}>Altavoz {n}</T>
    </g>
  );
}
function Fond3({ f }) {
  return (
    <svg viewBox="0 0 400 250" role="img" aria-label="Dos altavoces en fase y un micrófono P a 3.00 y 3.75 metros de cada uno">
      <Altavoz x={50} y={70} id="s1" f={f} n={1} /><Altavoz x={50} y={180} id="s2" f={f} n={2} />
      <path className={`w${f("r1")}`} d="M70 70 L322 118" /><path className={`w${f("r2")}`} d="M70 180 L322 128" />
      <T x={190} y={74} a="middle" id="r1" f={f}>r₁ = 3.00 m</T><T x={196} y={190} a="middle" id="r2" f={f}>r₂ = 3.75 m</T>
      <circle className={`nodo${f("P")}`} cx="330" cy="123" r="9" /><T x={330} y={152} a="middle" id="P" f={f}>Micrófono P</T>
      <T x={14} y={20} id="s1" f={f} s={13}>A₁ = 3.0</T><T x={14} y={238} id="s2" f={f} s={13}>A₂ = 2.0</T>
      <T x={386} y={20} a="end" s={13}>f = 686 Hz · v = 343 m/s</T>
    </svg>
  );
}
function Fond4({ f }) {
  const yc = 135, Am = 85, Ar = Am / Math.SQRT2, x0 = 50, L = 140;
  return (
    <svg viewBox="0 0 400 250" role="img" aria-label="Voltaje alterno senoidal de 170 voltios de pico sobre una resistencia de 50 ohmios">
      <path className="guia" d={`M35 ${yc} H370`} />
      <path className={`guia${f("vmax")}`} d={`M35 ${yc - Am} H370 M35 ${yc + Am} H370`} />
      <path className={`guia${f("vrms")}`} d={`M35 ${yc - Ar} H370 M35 ${yc + Ar} H370`} />
      <path className="onda" d={senoide(x0, 330, yc, Am, L)} />
      <T x={372} y={yc - Am - 5} a="end" id="vmax" f={f} s={13}>V_máx = 170 V</T>
      <T x={372} y={yc - Ar + 16} a="end" id="vrms" f={f} s={13}>V_rms = ?</T>
      <T x={200} y={236} a="middle" id="R" f={f}>conectada a R = 50.0 Ω</T>
    </svg>
  );
}

const FIGURAS = { f2664: F2664, f2666: F2666, f2634: F2634, fc56: Fc56, fc58: Fc58, fc48: Fc48, fcal1: Fcal1, fcal2: Fcal2, fcal3: Fcal3, fcal4: Fcal4, fond1: Fond1, fond2: Fond2, fond3: Fond3, fond4: Fond4 };

export default function FiguraProblema({ tipo, foco }) {
  const F = FIGURAS[tipo];
  const f = useFoco(foco);
  return <div className="pb-fig"><F f={f} /></div>;
}
