// Guía de conceptos de los problemas de calor y de ondas (misma forma que guiaProblemas.js).
export const CONCEPTOS_FIS = {
  // ---------------- calor ----------------
  calor_sensible: {
    titulo: "Calor y cambio de temperatura", corto: "Q = m·c·ΔT",
    texto: ["El calor Q es la energía que pasa de un cuerpo a otro por tener distinta temperatura. Se mide en julios (J).", "El calor específico c dice cuántos julios hay que dar a 1 kg para subirle 1 K. El agua tiene un c muy alto (4186): cuesta mucho calentarla y también enfriarla.", "Si el cuerpo absorbe calor, Q es positivo y sube su temperatura; si cede calor, Q es negativo."],
    formula: "Q = m · c · ΔT", simbolos: [["Q", "calor absorbido (J)"], ["m", "masa (kg)"], ["c", "calor específico (J/(kg·K))"], ["ΔT", "T final − T inicial (K o °C)"]],
    ejemplo: ["1.00 kg de aluminio (c = 900) se calienta 10 K.", "Q = 1.00 · 900 · 10 = 9000 J"],
  },
  potencia_t: {
    titulo: "Potencia: energía por segundo", corto: "P = Q / t",
    texto: ["La potencia dice cuánta energía se entrega cada segundo. 1 W = 1 J/s.", "Si sabes cuánta energía se necesita y la potencia disponible, el tiempo es la división. Si solo una parte de la potencia llega al cuerpo (eficiencia η), usa la potencia útil η · P."],
    formula: "t = Q / P", simbolos: [["t", "tiempo (s)"], ["Q", "energía (J)"], ["P", "potencia (W)"]],
    ejemplo: ["Una estufa de 1000 W entrega 60 000 J.", "t = 60 000 / 1000 = 60 s"],
  },
  efecto_joule: {
    titulo: "Efecto Joule: electricidad que calienta", corto: "Efecto Joule",
    texto: ["Cuando una corriente atraviesa una resistencia, la energía eléctrica se convierte en calor. Así funcionan los hervidores, las tostadoras y los calentadores.", "La potencia que consume depende del voltaje y de la resistencia. A mayor voltaje o menor resistencia, más calor por segundo."],
    formula: "P = V² / R", simbolos: [["P", "potencia (W)"], ["V", "voltaje (V)"], ["R", "resistencia (Ω)"]],
    ejemplo: ["Una resistencia de 24 Ω conectada a 120 V.", "P = 120² / 24 = 600 W"],
  },
  equilibrio: {
    titulo: "Equilibrio térmico", corto: "Equilibrio térmico",
    texto: ["Si juntas un cuerpo caliente y uno frío en un recipiente aislado, el caliente cede calor y el frío lo absorbe hasta quedar a la misma temperatura.", "Sin pérdidas, la energía se conserva: lo que cede uno lo absorbe el otro. Por eso la suma de los dos calores es cero.", "La capacidad térmica C = m · c resume cuánto cuesta cambiar la temperatura de todo el cuerpo."],
    formula: "C₁(T_f − T₁) + C₂(T_f − T₂) = 0", simbolos: [["C", "capacidad térmica m·c (J/K)"], ["T_f", "temperatura final de equilibrio"]],
    ejemplo: ["Dos cuerpos con C = 100 J/K a 80 °C y 20 °C.", "T_f = (100·80 + 100·20) / 200 = 50 °C"],
  },
  fase: {
    titulo: "Cambios de fase y calor latente", corto: "Calor latente",
    texto: ["Cuando una sustancia cambia de fase (hielo → agua → vapor), la temperatura se queda quieta mientras dura el cambio: el calor se usa en romper o formar los enlaces, no en agitar más las moléculas.", "El calor latente L dice cuántos julios por kilogramo hacen falta para cambiar de fase. Para el agua: fusión L_f = 334 kJ/kg y vaporización L_v = 2256 kJ/kg.", "Un cálculo completo se hace por tramos: calor sensible en cada tramo inclinado de la curva y Q = m · L en cada tramo horizontal. Después se suman."],
    formula: "Q = m · L", simbolos: [["Q", "calor del cambio de fase (J)"], ["m", "masa (kg)"], ["L", "calor latente (J/kg)"]],
    ejemplo: ["Fundir 1.00 kg de hielo a 0 °C.", "Q = 1.00 · 334 000 = 334 000 J"],
  },
  // ---------------- ondas ----------------
  onda_param: {
    titulo: "Frecuencia, periodo y longitud de onda", corto: "Parámetros de la onda",
    texto: ["La frecuencia f es cuántas oscilaciones completas hay por segundo (Hz). El periodo T es el tiempo de una oscilación: T = 1/f.", "La longitud de onda λ es la distancia entre dos crestas seguidas. En un periodo la onda avanza una longitud de onda, así que su velocidad es v = λ·f.", "El número de onda k y la frecuencia angular ω cuentan la fase en radianes: k = 2π/λ y ω = 2π·f."],
    formula: "v = λ · f   ·   T = 1/f   ·   k = 2π/λ", simbolos: [["v", "velocidad de la onda (m/s)"], ["λ", "longitud de onda (m)"], ["f", "frecuencia (Hz)"], ["k", "número de onda (rad/m)"]],
    ejemplo: ["Una onda de 2 Hz con λ = 3 m.", "v = 3 · 2 = 6 m/s · T = 0.5 s"],
  },
  onda_xt: {
    titulo: "La onda como función de x y t", corto: "y(x, t)",
    texto: ["Una onda viajera hacia +x se escribe y(x, t) = A·sen[2π(x/λ − f·t)]. Dice qué elevación tiene cada punto x en cada instante t.", "Lo que va dentro del seno es la fase, en radianes. La calculadora debe estar en modo radianes.", "La amplitud A es el valor máximo que alcanza y, y el signo indica si el punto está por encima o por debajo del equilibrio."],
    formula: "y = A · sen[2π(x/λ − f·t)]", simbolos: [["A", "amplitud"], ["x", "posición (m)"], ["t", "tiempo (s)"]],
    ejemplo: ["A = 2 cm, λ = 4 m, f = 1 Hz, x = 1 m y t = 0.", "fase = 2π(1/4) = π/2 → y = 2·sen(π/2) = 2 cm"],
  },
  interf: {
    titulo: "Interferencia de dos ondas", corto: "Interferencia",
    texto: ["Cuando dos ondas de la misma frecuencia llegan a un punto, sus elevaciones se suman. El resultado depende de cuánto más recorre una que la otra.", "Si la diferencia de trayectoria Δr es un número entero de longitudes de onda, llegan en fase y se refuerzan (constructiva). Si es un número entero más media longitud, llegan en oposición y se anulan (destructiva).", "En general el desfase es Δφ = 2π·Δr/λ y la amplitud de la suma es A = √(A₁² + A₂² + 2·A₁·A₂·cos Δφ)."],
    formula: "Δφ = 2π · Δr / λ", simbolos: [["Δr", "diferencia de trayectoria (m)"], ["Δφ", "desfase (rad)"], ["A", "amplitud de la onda resultante"]],
    ejemplo: ["Dos fuentes iguales con Δr = λ/2.", "Δφ = π → cos π = −1 → A = |A₁ − A₂| = 0 si A₁ = A₂"],
  },
  alterna: {
    titulo: "Corriente alterna: valores eficaces", corto: "Valores eficaces",
    texto: ["En la corriente alterna el voltaje es una onda senoidal: sube y baja todo el tiempo, así que su valor promedio es 0. Por eso se usa el valor eficaz (rms).", "El valor eficaz es el voltaje continuo que calentaría una resistencia igual que la onda. Para una senoide vale el valor máximo dividido entre √2.", "Con valores eficaces valen la ley de Ohm y las fórmulas de potencia media de siempre."],
    formula: "V_rms = V_máx / √2   ·   P = V_rms² / R", simbolos: [["V_máx", "voltaje de pico (V)"], ["V_rms", "voltaje eficaz (V)"], ["P", "potencia media (W)"]],
    ejemplo: ["V_máx = 100 V sobre 20 Ω.", "V_rms = 70.7 V → P = 70.7² / 20 = 250 W"],
  },
};

export const GUIA_FIS = {
  calor: ["calor_sensible", "potencia_t", "efecto_joule", "equilibrio", "fase"],
  ondas: ["onda_param", "onda_xt", "interf", "alterna"],
};
